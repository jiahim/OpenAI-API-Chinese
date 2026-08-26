# 文件

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 获取。

## 检索向量存储文件内容

**get** `/vector_stores/{vector_store_id}/files/{file_id}/content`

获取向量存储文件的解析内容。

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

  指示是否还有更多内容页需要获取。

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

通过附加 [文件](/docs/api-reference/files) 到 [向量存储](/docs/api-reference/vector-stores/object).

### 路径参数

- `vector_store_id: string`

### 请求体参数

- `file_id: string`

  一个 [文件](/docs/api-reference/files) 向量存储应使用的 ID。适用于能够访问文件的工具， `file_search` 对于多文件导入，我们建议使用 [`file_batches`](/docs/api-reference/vector-stores-file-batches/createBatch) 以最小化每个向量存储的写入请求。

- `attributes: optional map[string or number or boolean] or null`

  可附加到对象的一组 16 个键值对。这可以
  用于以结构化格式存储关于对象的额外信息，
  并通过 API 或仪表板查询对象。键是字符串，
  最大长度为 64 个字符。值是最大
  长度为 512 个字符的字符串、布尔值或数字。

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

    通过设置块大小和块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        块之间重叠的令牌数。默认值为 `400`.

        请注意，重叠不得超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        每个块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

### 返回

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。如果没有错误，将为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下之一： `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。该状态 `completed` 表示向量存储文件已准备好使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    向量存储的 ID， [向量存储](/docs/api-reference/vector-stores/object) 该文件 [文件](/docs/api-reference/files) 附加到其上。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的一组 16 个键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。键是字符串，
    最大长度为 64 个字符。值是最大
    长度为 512 个字符的字符串、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          块之间重叠的令牌数。默认值为 `400`.

          请注意，重叠不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常这是因为文件是在 `chunking_strategy` 概念是在 API 中引入的。

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

删除向量存储文件。这会将该文件从向量存储中移除，但文件本身不会被删除。要删除文件，请使用 [删除文件](/docs/api-reference/files/delete) 端点。

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

返回向量存储文件列表。

### 路径参数

- `vector_store_id: string`

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 结尾，则后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页的游标。 `before` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出列表请求并收到 100 个对象，以 obj_foo 开头，则后续调用可以包含 before=obj_foo 以获取列表的上一页。

- `filter: optional "in_progress" or "completed" or "failed" or "cancelled"`

  按文件状态过滤。取值之一为 `in_progress`, `completed`, `failed`, `cancelled`.

  - `"in_progress"`

  - `"completed"`

  - `"failed"`

  - `"cancelled"`

- `limit: optional number`

  要返回的对象数量上限。限制范围在 1 到 100 之间，默认值为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of VectorStoreFile`

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。如果没有错误，将为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下之一： `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。该状态 `completed` 表示向量存储文件已准备好使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    向量存储的 ID， [向量存储](/docs/api-reference/vector-stores/object) 该文件 [文件](/docs/api-reference/files) 附加到其上。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的一组 16 个键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。键是字符串，
    最大长度为 64 个字符。值是最大
    长度为 512 个字符的字符串、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          块之间重叠的令牌数。默认值为 `400`.

          请注意，重叠不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常这是因为文件是在 `chunking_strategy` 概念是在 API 中引入的。

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

检索向量存储文件。

### 路径参数

- `vector_store_id: string`

- `file_id: string`

### 返回

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。如果没有错误，将为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下之一： `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。该状态 `completed` 表示向量存储文件已准备好使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    向量存储的 ID， [向量存储](/docs/api-reference/vector-stores/object) 该文件 [文件](/docs/api-reference/files) 附加到其上。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的一组 16 个键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。键是字符串，
    最大长度为 64 个字符。值是最大
    长度为 512 个字符的字符串、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          块之间重叠的令牌数。默认值为 `400`.

          请注意，重叠不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常这是因为文件是在 `chunking_strategy` 概念是在 API 中引入的。

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

  可附加到对象的一组 16 个键值对。这可以
  用于以结构化格式存储关于对象的额外信息，
  并通过 API 或仪表板查询对象。键是字符串，
  最大长度为 64 个字符。值是最大
  长度为 512 个字符的字符串、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

### 返回

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件创建时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。如果没有错误，将为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下之一： `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。该状态 `completed` 表示向量存储文件已准备好使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    向量存储的 ID， [向量存储](/docs/api-reference/vector-stores/object) 该文件 [文件](/docs/api-reference/files) 附加到其上。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的一组 16 个键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。键是字符串，
    最大长度为 64 个字符。值是最大
    长度为 512 个字符的字符串、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          块之间重叠的令牌数。默认值为 `400`.

          请注意，重叠不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常这是因为文件是在 `chunking_strategy` 概念是在 API 中引入的。

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

## 域类型

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

    向量存储文件创建时的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。如果没有错误，将为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下之一： `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可以是 `in_progress`, `completed`, `cancelled`，或 `failed`。该状态 `completed` 表示向量存储文件已准备好使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    向量存储的 ID， [向量存储](/docs/api-reference/vector-stores/object) 该文件 [文件](/docs/api-reference/files) 附加到其上。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的一组 16 个键值对。这可以
    用于以结构化格式存储关于对象的额外信息，
    并通过 API 或仪表板查询对象。键是字符串，
    最大长度为 64 个字符。值是最大
    长度为 512 个字符的字符串、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          块之间重叠的令牌数。默认值为 `400`.

          请注意，重叠不得超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中的最大令牌数。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      当分块策略未知时返回此值。通常这是因为文件是在 `chunking_strategy` 概念是在 API 中引入的。

      - `type: "other"`

        始终 `other`.

        - `"other"`

### 向量存储文件已删除

- `VectorStoreFileDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "vector_store.file.deleted"`

    - `"vector_store.file.deleted"`
