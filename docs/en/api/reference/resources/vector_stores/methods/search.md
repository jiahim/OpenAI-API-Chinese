> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Search vector store

**post** `/vector_stores/{vector_store_id}/search`

Search a vector store for relevant chunks based on a query and file attributes filter.

### Path Parameters

- `vector_store_id: string`

### Body Parameters

- `query: string or array of string`

  A query string for a search

  - `string`

  - `array of string`

- `filters: optional ComparisonFilter or CompoundFilter`

  A filter to apply based on file attributes.

  - `ComparisonFilter object { key, type, value }`

    A filter used to compare a specified attribute key to a given value using a defined comparison operation.

    - `key: string`

      The key to compare against the value.

    - `type: "eq" or "ne" or "gt" or 5 more`

      Specifies the comparison operator: `eq`, `ne`, `gt`, `gte`, `lt`, `lte`, `in`, `nin`.

      - `eq`: equals
      - `ne`: not equal
      - `gt`: greater than
      - `gte`: greater than or equal
      - `lt`: less than
      - `lte`: less than or equal
      - `in`: in
      - `nin`: not in

      - `"eq"`

      - `"ne"`

      - `"gt"`

      - `"gte"`

      - `"lt"`

      - `"lte"`

      - `"in"`

      - `"nin"`

    - `value: string or number or boolean or array of string or number`

      The value to compare against the attribute key; supports string, number, or boolean types.

      - `string`

      - `number`

      - `boolean`

      - `array of string or number`

        - `string`

        - `number`

  - `CompoundFilter object { filters, type }`

    Combine multiple filters using `and` or `or`.

    - `filters: array of ComparisonFilter or unknown`

      Array of filters to combine. Items can be `ComparisonFilter` or `CompoundFilter`.

      - `ComparisonFilter object { key, type, value }`

        A filter used to compare a specified attribute key to a given value using a defined comparison operation.

      - `unknown`

    - `type: "and" or "or"`

      Type of operation: `and` or `or`.

      - `"and"`

      - `"or"`

- `max_num_results: optional number`

  The maximum number of results to return. This number should be between 1 and 50 inclusive.

- `ranking_options: optional object { ranker, score_threshold }`

  Ranking options for search.

  - `ranker: optional "none" or "auto" or "default-2024-11-15"`

    Enable re-ranking; set to `none` to disable, which can help reduce latency.

    - `"none"`

    - `"auto"`

    - `"default-2024-11-15"`

  - `score_threshold: optional number`

- `rewrite_query: optional boolean`

  Whether to rewrite the natural language query for vector search.

### Returns

- `data: array of object { attributes, content, file_id, 2 more }`

  The list of search result items.

  - `attributes: map[string or number or boolean] or null`

    Set of 16 key-value pairs that can be attached to an object. This can be
    useful for storing additional information about the object in a structured
    format, and querying for objects via API or the dashboard. Keys are strings
    with a maximum length of 64 characters. Values are strings with a maximum
    length of 512 characters, booleans, or numbers.

    - `string`

    - `number`

    - `boolean`

  - `content: array of object { text, type }`

    Content chunks from the file.

    - `text: string`

      The text content returned from search.

    - `type: "text"`

      The type of content.

      - `"text"`

  - `file_id: string`

    The ID of the vector store file.

  - `filename: string`

    The name of the vector store file.

  - `score: number`

    The similarity score for the result.

- `has_more: boolean`

  Indicates if there are more results to fetch.

- `next_page: string or null`

  The token for the next page, if any.

- `object: "vector_store.search_results.page"`

  The object type, which is always `vector_store.search_results.page`

  - `"vector_store.search_results.page"`

- `search_query: array of string`

### Example

```http
curl https://api.openai.com/v1/vector_stores/$VECTOR_STORE_ID/search \
    -H 'Content-Type: application/json' \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "query": "string"
        }'
```

#### Response

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

### Example

```http
curl -X POST \
https://api.openai.com/v1/vector_stores/vs_abc123/search \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-H "Content-Type: application/json" \
-d '{"query": "What is the return policy?", "filters": {...}}'
```

#### Response

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
