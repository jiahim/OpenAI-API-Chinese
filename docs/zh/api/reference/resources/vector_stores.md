# Vector Stores

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 创建向量存储

**post** `/vector_stores`

创建一个向量存储。

### 请求体参数

- `chunking_strategy: optional AutoFileChunkingStrategyParam or StaticFileChunkingStrategyObjectParam`

  用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。仅当 `file_ids` 非空时适用。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。此策略目前使用 `max_chunk_size_tokens` 和 `800` 。 `chunk_overlap_tokens` 和 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置分块大小和分块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        分块之间重叠的令牌数量。默认值为 `400`.

        请注意，重叠部分不得超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        的一半。每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

- `description: optional string`

  向量存储的描述。可用于描述向量存储的用途。

- `expires_after: optional object { anchor, days }`

  向量存储的过期策略。

  - `anchor: "last_active_at"`

    过期策略适用的锚定时间戳。支持的锚定： `last_active_at`.

    - `"last_active_at"`

  - `days: number`

    锚定时间之后向量存储将过期的天数。

- `file_ids: optional array of string`

  向量存储应使用的 [文件](/docs/api-reference/files) ID 列表。对诸如 `file_search` 可访问文件的。

- `metadata: optional Metadata or null`

  一组 16 个键值对，可附加到对象上。这可以
  用于以结构化格式存储关于对象的额外信息，
  并通过 API 或仪表板查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串
  ，最大长度为 512 个字符。

- `name: optional string`

  向量存储的名称。

### 返回

- `VectorStore object { id, created_at, file_counts, 8 more }`

  向量存储是已处理文件的集合，可被 `file_search` 工具使用。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    创建向量存储时的 Unix 时间戳（秒）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数。

    - `completed: number`

      已成功处理的文件数。

    - `failed: number`

      处理失败的文件数。

    - `in_progress: number`

      当前正在处理的文件数。

    - `total: number`

      文件总数。

  - `last_active_at: number or null`

    向量存储上次活跃时的 Unix 时间戳（秒）。

  - `metadata: Metadata or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

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

      过期策略适用的锚定时间戳。支持的锚定： `last_active_at`.

      - `"last_active_at"`

    - `days: number`

      锚定时间之后向量存储将过期的天数。

  - `expires_at: optional number or null`

    向量存储过期时的 Unix 时间戳（秒）。

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

**删除** `/vector_stores/{vector_store_id}`

删除一个向量存储。

### 路径参数

- `vector_store_id: string`

### 返回

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
  id: "vs_abc123",
  object: "vector_store.deleted",
  deleted: true
}
```

## 列出向量存储

**get** `/vector_stores`

返回向量存储列表。

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 结尾，那么你的后续调用可以包含 after=obj_foo，以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 开头，那么你的后续调用可以包含 before=obj_foo，以获取列表的上一页。

- `limit: optional number`

  对返回对象数量的限制。限制范围在 1 到 100 之间，默认为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 用于升序， `desc` 用于降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of VectorStore`

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    创建向量存储时的 Unix 时间戳（秒）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数。

    - `completed: number`

      已成功处理的文件数。

    - `failed: number`

      处理失败的文件数。

    - `in_progress: number`

      当前正在处理的文件数。

    - `total: number`

      文件总数。

  - `last_active_at: number or null`

    向量存储上次活跃时的 Unix 时间戳（秒）。

  - `metadata: Metadata or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

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

      过期策略适用的锚定时间戳。支持的锚定： `last_active_at`.

      - `"last_active_at"`

    - `days: number`

      锚定时间之后向量存储将过期的天数。

  - `expires_at: optional number or null`

    向量存储过期时的 Unix 时间戳（秒）。

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

### 返回

- `VectorStore object { id, created_at, file_counts, 8 more }`

  向量存储是已处理文件的集合，可被 `file_search` 工具使用。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    创建向量存储时的 Unix 时间戳（秒）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数。

    - `completed: number`

      已成功处理的文件数。

    - `failed: number`

      处理失败的文件数。

    - `in_progress: number`

      当前正在处理的文件数。

    - `total: number`

      文件总数。

  - `last_active_at: number or null`

    向量存储上次活跃时的 Unix 时间戳（秒）。

  - `metadata: Metadata or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

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

      过期策略适用的锚定时间戳。支持的锚定： `last_active_at`.

      - `"last_active_at"`

    - `days: number`

      锚定时间之后向量存储将过期的天数。

  - `expires_at: optional number or null`

    向量存储过期时的 Unix 时间戳（秒）。

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

根据查询和文件属性过滤器在向量存储中搜索相关分块。

### 路径参数

- `vector_store_id: string`

### 请求体参数

- `query: string or array of string`

  用于搜索的查询字符串

  - `string`

  - `array of string`

- `filters: optional ComparisonFilter or CompoundFilter`

  基于文件属性应用的过滤器。

  - `ComparisonFilter object { key, type, value }`

    使用定义的比较操作，将指定属性键与给定值进行比较的过滤器。

    - `key: string`

      用于与值进行比较的键。

    - `type: "eq" or "ne" or "gt" or 5 more`

      指定比较操作符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

      - `eq`: 等于
      - `ne`: 不等于
      - `gt`: 大于
      - `gte`: 大于或等于
      - `lt`: 小于
      - `lte`: 小于或等于
      - `in`: 包含于
      - `nin`: 不包含于

      - `"eq"`

      - `"ne"`

      - `"gt"`

      - `"gte"`

      - `"lt"`

      - `"lte"`

      - `"in"`

      - `"nin"`

    - `value: string or number or boolean or array of string or number`

      用于与属性键比较的值；支持字符串、数字或布尔类型。

      - `string`

      - `number`

      - `boolean`

      - `array of string or number`

        - `string`

        - `number`

  - `CompoundFilter object { filters, type }`

    使用以下方式组合多个过滤器 `and` 或 `or`.

    - `filters: array of ComparisonFilter or unknown`

      要组合的过滤器数组。项目可以是 `ComparisonFilter` 或 `CompoundFilter`.

      - `ComparisonFilter object { key, type, value }`

        使用定义的比较操作，将指定属性键与给定值进行比较的过滤器。

      - `unknown`

    - `type: "and" or "or"`

      操作类型： `and` 或 `or`.

      - `"and"`

      - `"or"`

- `max_num_results: optional number`

  要返回的最大结果数。此数字应在 1 到 50 之间（含）。

- `ranking_options: optional object { ranker, score_threshold }`

  搜索的排名选项。

  - `ranker: optional "none" or "auto" or "default-2024-11-15"`

    启用重新排序；设置为 `none` 以禁用，这有助于减少延迟。

    - `"none"`

    - `"auto"`

    - `"default-2024-11-15"`

  - `score_threshold: optional number`

- `rewrite_query: optional boolean`

  是否重写自然语言查询以进行向量搜索。

### 返回

- `data: array of object { attributes, content, file_id, 2 more }`

  搜索结果项列表。

  - `attributes: map[string or number or boolean] or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    格式，以及通过API或仪表盘查询对象。键是字符串
    ，最大长度为 64 个字符。值是字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `content: array of object { text, type }`

    来自文件的内容块。

    - `text: string`

      从搜索中返回的文本内容。

    - `type: "text"`

      内容的类型。

      - `"text"`

  - `file_id: string`

    向量存储文件的 ID。

  - `filename: string`

    向量存储文件的名称。

  - `score: number`

    结果的相似性得分。

- `has_more: boolean`

  指示是否还有更多结果可获取。

- `next_page: string or null`

  下一页的令牌（如有）。

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
  "search_query": "What is the return policy?",
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

修改向量存储。

### 路径参数

- `vector_store_id: string`

### 请求体参数

- `expires_after: optional object { anchor, days }  or null`

  向量存储的过期策略。

  - `anchor: "last_active_at"`

    过期策略适用的锚定时间戳。支持的锚定： `last_active_at`.

    - `"last_active_at"`

  - `days: number`

    锚定时间之后向量存储将过期的天数。

- `metadata: optional Metadata or null`

  一组 16 个键值对，可附加到对象上。这可以
  用于以结构化格式存储关于对象的额外信息，
  并通过 API 或仪表板查询对象。

  键是字符串，最大长度为 64 个字符。值是字符串
  ，最大长度为 512 个字符。

- `name: optional string or null`

  向量存储的名称。

### 返回

- `VectorStore object { id, created_at, file_counts, 8 more }`

  向量存储是已处理文件的集合，可被 `file_search` 工具使用。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    创建向量存储时的 Unix 时间戳（秒）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数。

    - `completed: number`

      已成功处理的文件数。

    - `failed: number`

      处理失败的文件数。

    - `in_progress: number`

      当前正在处理的文件数。

    - `total: number`

      文件总数。

  - `last_active_at: number or null`

    向量存储上次活跃时的 Unix 时间戳（秒）。

  - `metadata: Metadata or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

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

      过期策略适用的锚定时间戳。支持的锚定： `last_active_at`.

      - `"last_active_at"`

    - `days: number`

      锚定时间之后向量存储将过期的天数。

  - `expires_at: optional number or null`

    向量存储过期时的 Unix 时间戳（秒）。

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

## 领域类型

### 自动文件分块策略参数

- `AutoFileChunkingStrategyParam object { type }`

  默认策略。此策略目前使用 `max_chunk_size_tokens` 和 `800` 。 `chunk_overlap_tokens` 和 `400`.

  - `type: "auto"`

    始终 `auto`.

    - `"auto"`

### 文件分块策略参数

- `FileChunkingStrategyParam = AutoFileChunkingStrategyParam or StaticFileChunkingStrategyObjectParam`

  用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。此策略目前使用 `max_chunk_size_tokens` 和 `800` 。 `chunk_overlap_tokens` 和 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置分块大小和分块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        分块之间重叠的令牌数量。默认值为 `400`.

        请注意，重叠部分不得超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        的一半。每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

### 其他文件分块策略对象

- `OtherFileChunkingStrategyObject object { type }`

  当分块策略未知时返回此值。通常，这是因为文件是在 `chunking_strategy` API引入该概念之前被索引的。

  - `type: "other"`

    始终 `other`.

    - `"other"`

### 静态文件分块策略

- `StaticFileChunkingStrategy object { chunk_overlap_tokens, max_chunk_size_tokens }`

  - `chunk_overlap_tokens: number`

    分块之间重叠的令牌数量。默认值为 `400`.

    请注意，重叠部分不得超过 `max_chunk_size_tokens`.

  - `max_chunk_size_tokens: number`

    的一半。每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

### 静态文件分块策略对象

- `StaticFileChunkingStrategyObject object { static, type }`

  - `static: StaticFileChunkingStrategy`

    - `chunk_overlap_tokens: number`

      分块之间重叠的令牌数量。默认值为 `400`.

      请注意，重叠部分不得超过 `max_chunk_size_tokens`.

    - `max_chunk_size_tokens: number`

      的一半。每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

  - `type: "static"`

    始终 `static`.

    - `"static"`

### 静态文件分块策略对象参数

- `StaticFileChunkingStrategyObjectParam object { static, type }`

  通过设置分块大小和分块重叠来自定义你自己的分块策略。

  - `static: StaticFileChunkingStrategy`

    - `chunk_overlap_tokens: number`

      分块之间重叠的令牌数量。默认值为 `400`.

      请注意，重叠部分不得超过 `max_chunk_size_tokens`.

    - `max_chunk_size_tokens: number`

      的一半。每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

  - `type: "static"`

    始终 `static`.

    - `"static"`

### 向量存储

- `VectorStore object { id, created_at, file_counts, 8 more }`

  向量存储是已处理文件的集合，可被 `file_search` 工具使用。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    创建向量存储时的 Unix 时间戳（秒）。

  - `file_counts: object { cancelled, completed, failed, 2 more }`

    - `cancelled: number`

      已取消的文件数。

    - `completed: number`

      已成功处理的文件数。

    - `failed: number`

      处理失败的文件数。

    - `in_progress: number`

      当前正在处理的文件数。

    - `total: number`

      文件总数。

  - `last_active_at: number or null`

    向量存储上次活跃时的 Unix 时间戳（秒）。

  - `metadata: Metadata or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串
    ，最大长度为 512 个字符。

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

      过期策略适用的锚定时间戳。支持的锚定： `last_active_at`.

      - `"last_active_at"`

    - `days: number`

      锚定时间之后向量存储将过期的天数。

  - `expires_at: optional number or null`

    向量存储过期时的 Unix 时间戳（秒）。

### 向量存储已删除

- `VectorStoreDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "vector_store.deleted"`

    - `"vector_store.deleted"`

### 向量存储搜索响应

- `VectorStoreSearchResponse object { attributes, content, file_id, 2 more }`

  - `attributes: map[string or number or boolean] or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    格式，以及通过API或仪表盘查询对象。键是字符串
    ，最大长度为 64 个字符。值是字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `content: array of object { text, type }`

    来自文件的内容块。

    - `text: string`

      从搜索中返回的文本内容。

    - `type: "text"`

      内容的类型。

      - `"text"`

  - `file_id: string`

    向量存储文件的 ID。

  - `filename: string`

    向量存储文件的名称。

  - `score: number`

    结果的相似性得分。

# 文件批次

## 取消向量存储文件批次

**post** `/vector_stores/{vector_store_id}/file_batches/{batch_id}/cancel`

取消向量存储文件批次。这将尝试尽快取消此批次中文件的处理。

### 路径参数

- `vector_store_id: string`

- `batch_id: string`

### 返回

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  一批附加到向量存储的文件。

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

      处理失败的文件数。

    - `in_progress: number`

      当前正在处理的文件数。

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

    该 [vector store](/docs/api-reference/vector-stores/object) 所属 [文件](/docs/api-reference/files) 的ID。

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

  一组 16 个键值对，可附加到对象上。这可以
  用于以结构化格式存储关于对象的额外信息，
  格式，以及通过API或仪表盘查询对象。键是字符串
  ，最大长度为 64 个字符。值是字符串，最大
  长度为 512 个字符、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

- `chunking_strategy: optional FileChunkingStrategyParam`

  用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。此策略目前使用 `max_chunk_size_tokens` 和 `800` 。 `chunk_overlap_tokens` 和 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置分块大小和分块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        分块之间重叠的令牌数量。默认值为 `400`.

        请注意，重叠部分不得超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        的一半。每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

- `file_ids: optional array of string`

  向量存储应使用的 [文件](/docs/api-reference/files) ID 列表。对诸如 `file_search` 可访问文件的工具。如果 `attributes` 或 `chunking_strategy` 被提供，它们将应用于批次中的所有文件。最大文件批次大小为 2000 个文件。此端点推荐用于多文件引入，有助于减少每个向量存储的写入请求压力。与 `files`.

- `files: optional array of object { file_id, attributes, chunking_strategy }`

  对象列表，每个对象包含一个 `file_id` 以及可选的 `attributes` 或 `chunking_strategy`。当需要覆盖特定文件的元数据时使用。全局 `attributes` 或 `chunking_strategy` 将被忽略，必须为每个文件指定。最大文件批次大小为 2000 个文件。此端点推荐用于多文件引入，有助于减少每个向量存储的写入请求压力。与 `file_ids`.

  - `file_id: string`

    一个 [文件](/docs/api-reference/files) ID，向量存储应使用该 ID。适用于工具，如 `file_search` 可访问文件的工具。对于多文件引入，我们推荐 [`file_batches`](/docs/api-reference/vector-stores-file-batches/createBatch) 以最小化每个向量存储的写入请求。

  - `attributes: optional map[string or number or boolean] or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    格式，以及通过API或仪表盘查询对象。键是字符串
    ，最大长度为 64 个字符。值是字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional FileChunkingStrategyParam`

    用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

### 返回

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  一批附加到向量存储的文件。

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

      处理失败的文件数。

    - `in_progress: number`

      当前正在处理的文件数。

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

    该 [vector store](/docs/api-reference/vector-stores/object) 所属 [文件](/docs/api-reference/files) 的ID。

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

返回批次中的向量存储文件列表。

### 路径参数

- `vector_store_id: string`

- `batch_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 结尾，那么你的后续调用可以包含 after=obj_foo，以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 开头，那么你的后续调用可以包含 before=obj_foo，以获取列表的上一页。

- `filter: optional "in_progress" or "completed" or "failed" or "cancelled"`

  按文件状态筛选。取值为 `in_progress`, `completed`, `failed`, `cancelled`.

  - `"in_progress"`

  - `"completed"`

  - `"failed"`

  - `"cancelled"`

- `limit: optional number`

  对返回对象数量的限制。限制范围在 1 到 100 之间，默认为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 用于升序， `desc` 用于降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of VectorStoreFile`

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（秒）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。若无错误，则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      取值为 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示该向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总用量（字节）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    该 [vector store](/docs/api-reference/vector-stores/object) 所属 [文件](/docs/api-reference/files) 的ID。

  - `attributes: optional map[string or number or boolean] or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    格式，以及通过API或仪表盘查询对象。键是字符串
    ，最大长度为 64 个字符。值是字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          分块之间重叠的令牌数量。默认值为 `400`.

          请注意，重叠部分不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          的一半。每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常，这是因为文件是在 `chunking_strategy` API引入该概念之前被索引的。

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

检索向量存储文件批次。

### 路径参数

- `vector_store_id: string`

- `batch_id: string`

### 返回

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  一批附加到向量存储的文件。

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

      处理失败的文件数。

    - `in_progress: number`

      当前正在处理的文件数。

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

    该 [vector store](/docs/api-reference/vector-stores/object) 所属 [文件](/docs/api-reference/files) 的ID。

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

## 领域类型

### 向量存储文件批次

- `VectorStoreFileBatch object { id, created_at, file_counts, 3 more }`

  一批附加到向量存储的文件。

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

      处理失败的文件数。

    - `in_progress: number`

      当前正在处理的文件数。

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

    该 [vector store](/docs/api-reference/vector-stores/object) 所属 [文件](/docs/api-reference/files) 的ID。

# 文件

## 检索向量存储文件内容

**get** `/vector_stores/{vector_store_id}/files/{file_id}/content`

检索向量存储文件的已解析内容。

### 路径参数

- `vector_store_id: string`

- `file_id: string`

### 返回

- `data: array of object { text, type }`

  文件的解析内容。

  - `text: optional string`

    文本内容

  - `type: optional string`

    内容类型（目前仅 `"text"`)

- `has_more: boolean`

  指示是否有更多内容页需要获取。

- `next_page: string or null`

  下一页的令牌（如有）。

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

通过将 [File](/docs/api-reference/files) 附加到 [vector store](/docs/api-reference/vector-stores/object).

### 路径参数

- `vector_store_id: string`

### 请求体参数

- `file_id: string`

  一个 [文件](/docs/api-reference/files) ID，向量存储应使用该 ID。适用于工具，如 `file_search` 可访问文件的工具。对于多文件引入，我们推荐 [`file_batches`](/docs/api-reference/vector-stores-file-batches/createBatch) 以最小化每个向量存储的写入请求。

- `attributes: optional map[string or number or boolean] or null`

  一组 16 个键值对，可附加到对象上。这可以
  用于以结构化格式存储关于对象的额外信息，
  格式，以及通过API或仪表盘查询对象。键是字符串
  ，最大长度为 64 个字符。值是字符串，最大
  长度为 512 个字符、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

- `chunking_strategy: optional FileChunkingStrategyParam`

  用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。此策略目前使用 `max_chunk_size_tokens` 和 `800` 。 `chunk_overlap_tokens` 和 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置分块大小和分块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        分块之间重叠的令牌数量。默认值为 `400`.

        请注意，重叠部分不得超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        的一半。每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

### 返回

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（秒）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。若无错误，则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      取值为 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示该向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总用量（字节）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    该 [vector store](/docs/api-reference/vector-stores/object) 所属 [文件](/docs/api-reference/files) 的ID。

  - `attributes: optional map[string or number or boolean] or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    格式，以及通过API或仪表盘查询对象。键是字符串
    ，最大长度为 64 个字符。值是字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          分块之间重叠的令牌数量。默认值为 `400`.

          请注意，重叠部分不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          的一半。每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常，这是因为文件是在 `chunking_strategy` API引入该概念之前被索引的。

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

**删除** `/vector_stores/{vector_store_id}/files/{file_id}`

删除一个向量存储文件。此操作会将该文件从向量存储中移除，但文件本身不会被删除。要删除文件，请使用 [delete file](/docs/api-reference/files/delete) 端点。

### 路径参数

- `vector_store_id: string`

- `file_id: string`

### 返回

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
  id: "file-abc123",
  object: "vector_store.file.deleted",
  deleted: true
}
```

## 列出向量存储文件

**get** `/vector_stores/{vector_store_id}/files`

返回向量存储文件的列表。

### 路径参数

- `vector_store_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 结尾，那么你的后续调用可以包含 after=obj_foo，以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 开头，那么你的后续调用可以包含 before=obj_foo，以获取列表的上一页。

- `filter: optional "in_progress" or "completed" or "failed" or "cancelled"`

  按文件状态筛选。取值为 `in_progress`, `completed`, `failed`, `cancelled`.

  - `"in_progress"`

  - `"completed"`

  - `"failed"`

  - `"cancelled"`

- `limit: optional number`

  对返回对象数量的限制。限制范围在 1 到 100 之间，默认为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 用于升序， `desc` 用于降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of VectorStoreFile`

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（秒）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。若无错误，则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      取值为 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示该向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总用量（字节）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    该 [vector store](/docs/api-reference/vector-stores/object) 所属 [文件](/docs/api-reference/files) 的ID。

  - `attributes: optional map[string or number or boolean] or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    格式，以及通过API或仪表盘查询对象。键是字符串
    ，最大长度为 64 个字符。值是字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          分块之间重叠的令牌数量。默认值为 `400`.

          请注意，重叠部分不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          的一半。每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常，这是因为文件是在 `chunking_strategy` API引入该概念之前被索引的。

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

### 返回

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（秒）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。若无错误，则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      取值为 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示该向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总用量（字节）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    该 [vector store](/docs/api-reference/vector-stores/object) 所属 [文件](/docs/api-reference/files) 的ID。

  - `attributes: optional map[string or number or boolean] or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    格式，以及通过API或仪表盘查询对象。键是字符串
    ，最大长度为 64 个字符。值是字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          分块之间重叠的令牌数量。默认值为 `400`.

          请注意，重叠部分不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          的一半。每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常，这是因为文件是在 `chunking_strategy` API引入该概念之前被索引的。

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

### 请求体参数

- `attributes: map[string or number or boolean] or null`

  一组 16 个键值对，可附加到对象上。这可以
  用于以结构化格式存储关于对象的额外信息，
  格式，以及通过API或仪表盘查询对象。键是字符串
  ，最大长度为 64 个字符。值是字符串，最大
  长度为 512 个字符、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

### 返回

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（秒）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。若无错误，则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      取值为 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示该向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总用量（字节）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    该 [vector store](/docs/api-reference/vector-stores/object) 所属 [文件](/docs/api-reference/files) 的ID。

  - `attributes: optional map[string or number or boolean] or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    格式，以及通过API或仪表盘查询对象。键是字符串
    ，最大长度为 64 个字符。值是字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          分块之间重叠的令牌数量。默认值为 `400`.

          请注意，重叠部分不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          的一半。每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常，这是因为文件是在 `chunking_strategy` API引入该概念之前被索引的。

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

## 领域类型

### 文件内容响应

- `FileContentResponse object { text, type }`

  - `text: optional string`

    文本内容

  - `type: optional string`

    内容类型（目前仅 `"text"`)

### 向量存储文件

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（秒）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。若无错误，则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      取值为 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示该向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总用量（字节）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    该 [vector store](/docs/api-reference/vector-stores/object) 所属 [文件](/docs/api-reference/files) 的ID。

  - `attributes: optional map[string or number or boolean] or null`

    一组 16 个键值对，可附加到对象上。这可以
    用于以结构化格式存储关于对象的额外信息，
    格式，以及通过API或仪表盘查询对象。键是字符串
    ，最大长度为 64 个字符。值是字符串，最大
    长度为 512 个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          分块之间重叠的令牌数量。默认值为 `400`.

          请注意，重叠部分不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          的一半。每个分块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常，这是因为文件是在 `chunking_strategy` API引入该概念之前被索引的。

      - `type: "other"`

        始终 `other`.

        - `"other"`

### 向量存储文件已删除

- `VectorStoreFileDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "vector_store.file.deleted"`

    - `"vector_store.file.deleted"`
