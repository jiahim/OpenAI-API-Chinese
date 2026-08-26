> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 搜索向量存储

**post** `/vector_stores/{vector_store_id}/search`

根据查询和文件属性过滤器，在向量存储中搜索相关块。

### 路径参数

- `vector_store_id: string`

### 请求体参数

- `query: string or array of string`

  搜索的查询字符串

  - `string`

  - `array of string`

- `filters: optional ComparisonFilter or CompoundFilter`

  基于文件属性应用的过滤器。

  - `ComparisonFilter object { key, type, value }`

    使用定义的比较操作，将指定的属性键与给定值进行比较的过滤器。

    - `key: string`

      要与值进行比较的键。

    - `type: "eq" or "ne" or "gt" or 5 more`

      指定比较运算符： `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

      - `eq`: 等于
      - `ne`: 不等于
      - `gt`: 大于
      - `gte`: 大于或等于
      - `lt`: 小于
      - `lte`: 小于或等于
      - `in`: 在
      - `nin`: 不在

      - `"eq"`

      - `"ne"`

      - `"gt"`

      - `"gte"`

      - `"lt"`

      - `"lte"`

      - `"in"`

      - `"nin"`

    - `value: string or number or boolean or array of string or number`

      要与属性键进行比较的值；支持字符串、数字或布尔类型。

      - `string`

      - `number`

      - `boolean`

      - `array of string or number`

        - `string`

        - `number`

  - `CompoundFilter object { filters, type }`

    使用 `and` 或 `or`.

    - `filters: array of ComparisonFilter or unknown`

      要组合的过滤器数组。项可以是 `ComparisonFilter` 或 `CompoundFilter`.

      - `ComparisonFilter object { key, type, value }`

        使用定义的比较操作，将指定的属性键与给定值进行比较的过滤器。

      - `unknown`

    - `type: "and" or "or"`

      操作类型： `and` 或 `or`.

      - `"and"`

      - `"or"`

- `max_num_results: optional number`

  要返回的最大结果数。该数字应在 1 到 50 之间（含 1 和 50）。

- `ranking_options: optional object { ranker, score_threshold }`

  搜索的排序选项。

  - `ranker: optional "none" or "auto" or "default-2024-11-15"`

    启用重新排序；设置为 `none` 以禁用，这有助于减少延迟。

    - `"none"`

    - `"auto"`

    - `"default-2024-11-15"`

  - `score_threshold: optional number`

- `rewrite_query: optional boolean`

  是否重写用于向量搜索的自然语言查询。

### 返回

- `data: array of object { attributes, content, file_id, 2 more }`

  搜索结果项的列表。

  - `attributes: map[string or number or boolean] or null`

    可附加到对象上的16组键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过API或仪表板查询对象。键是字符串，
    最大长度为64个字符。值是字符串，最大
    长度为512个字符、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `content: array of object { text, type }`

    来自文件的内容块。

    - `text: string`

      从搜索返回的文本内容。

    - `type: "text"`

      内容的类型。

      - `"text"`

  - `file_id: string`

    向量存储文件的ID。

  - `filename: string`

    向量存储文件的名称。

  - `score: number`

    结果的相似度分数。

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
