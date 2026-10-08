> 完整的文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

## 搜索向量存储

**post** `/vector_stores/{vector_store_id}/search`

根据查询和文件属性过滤条件，在向量存储中搜索相关片段。

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

    用于将指定的属性键与给定值通过定义的比较运算进行比较的筛选条件。

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
      - `in`：包含于
      - `nin`：不包含于

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

    - `filters: array of ComparisonFilter or CompoundFilter`

      要组合的筛选条件数组。项可以是 `ComparisonFilter` 或 `CompoundFilter`.

      - `ComparisonFilter object { key, type, value }`

        用于将指定的属性键与给定值通过定义的比较运算进行比较的筛选条件。

      - `CompoundFilter object { filters, type }`

        使用以下方式组合多个筛选条件 `and` 或 `or`.

    - `type: "and" or "or"`

      操作类型： `and` 或 `or`.

      - `"and"`

      - `"or"`

- `max_num_results: optional number`

  返回的最大结果数。该数字应介于 1 到 50 之间（含两端）。

- `ranking_options: optional object { ranker, score_threshold }`

  搜索的排序选项。

  - `ranker: optional "none" or "auto" or "default-2024-11-15"`

    启用重排序；设置为 `none` 以禁用，这有助于降低延迟。

    - `"none"`

    - `"auto"`

    - `"default-2024-11-15"`

  - `score_threshold: optional number`

- `rewrite_query: optional boolean`

  是否重写用于向量搜索的自然语言查询。

### 返回值

- `data: array of object { attributes, content, file_id, 2 more }`

  搜索结果项的列表。

  - `attributes: map[string or number or boolean] or null`

    可附加到对象的 16 组键值对。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板
    查询对象。键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符，也可以是布尔值或数字。
    最大长度为 512 个字符，也可以是布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `content: array of object { text, type }`

    文件的内容块。

    - `text: string`

      从搜索返回的文本内容。

    - `type: "text"`

      内容的类型。

      - `"text"`

  - `file_id: string`

    向量存储文件的 ID。

  - `filename: string`

    向量存储文件的名称。

  - `score: number`

    结果的相似度得分。

- `has_more: boolean`

  指示是否还有更多结果可供获取。

- `next_page: string or null`

  下一页的令牌（若有）。

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
