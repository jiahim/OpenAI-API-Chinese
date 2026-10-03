# 文件

> 完整文档索引请参阅 [llms.txt](/llms.txt). 如需页面的 Markdown 版本，可在页面 URL 后追加 `.md` 获取。

## 检索向量存储文件内容

**get** `/vector_stores/{vector_store_id}/files/{file_id}/content`

检索已解析的 vector store 文件内容。

### 路径参数

- `vector_store_id: string`

- `file_id: string`

### 返回

- `data: array of object { text, type }`

  文件的已解析内容。

  - `text: optional string`

    文本内容

  - `type: optional string`

    内容类型（目前仅 `"text"`)

- `has_more: boolean`

  指示是否还有更多内容页面可供获取。

- `next_page: string or null`

  下一页的令牌（若有）。

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
  "object": "vector_store.file_content.page",
  "data": [
    {"type": "text", "text": "file content"}
  ],
  "has_more": false,
  "next_page": null
}
```

## 创建向量存储文件

**post** `/vector_stores/{vector_store_id}/files`

通过将 [文件](/api/reference/resources/files) 附加到 [向量存储](/api/reference/resources/vector_stores).

### 路径参数

- `vector_store_id: string`

### Body 参数

- `file_id: string`

  一个 [File](/api/reference/resources/files) 向量存储应使用的 ID。可用于 `file_search` 等可以访问文件的工具。对于多文件摄入，建议 [`file_batches`](/api/reference/resources/vector_stores/subresources/file_batches/methods/create) 以减少每个向量存储的写入请求数。

- `attributes: optional map[string or number or boolean] or null`

  可附加到对象的 16 个键值对。可用于
  以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。键是字符串，
  以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。键是字符串
  最大长度为 64 个字符。值是最大长度为 512 个字符的字符串、布尔值或数字。
  最大长度为 512 个字符的字符串、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

- `chunking_strategy: optional FileChunkingStrategyParam`

  用于对文件进行分块的分块策略。如果未设置，将使用 `auto` 策略。

  - `AutoFileChunkingStrategyParam object { type }`

    默认策略。此策略当前使用 `max_chunk_size_tokens` 的 `800` 和 `chunk_overlap_tokens` 的 `400`.

    - `type: "auto"`

      始终 `auto`.

      - `"auto"`

  - `StaticFileChunkingStrategyObjectParam object { static, type }`

    通过设置块大小和块重叠来自定义你自己的分块策略。

    - `static: StaticFileChunkingStrategy`

      - `chunk_overlap_tokens: number`

        块之间重叠的 token 数量。默认值为 `400`.

        请注意，重叠部分不能超过 `max_chunk_size_tokens`.

      - `max_chunk_size_tokens: number`

        每个块中最大的 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

    - `type: "static"`

      始终 `static`.

      - `"static"`

### 返回

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件的创建时间的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下值之一 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可为 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    所附加的 [向量存储](/api/reference/resources/vector_stores) 的 ID，该向量存储 [File](/api/reference/resources/files) 被附加到。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 个键值对。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。键是字符串，
    以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。键是字符串
    最大长度为 64 个字符。值是最大长度为 512 个字符的字符串、布尔值或数字。
    最大长度为 512 个字符的字符串、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块（chunking）的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          块之间重叠的 token 数量。默认值为 `400`.

          请注意，重叠部分不能超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中最大的 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      在分块策略未知时返回。通常，这是因为该文件在 `chunking_strategy` 该概念在 API 中引入。

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

删除一个向量存储文件。这将从向量存储中移除该文件，但文件本身不会被删除。若要删除文件，请使用 [delete file](/api/reference/resources/files/methods/delete) 端点。

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

  用于分页查询的游标。 `after` 是一个对象 ID，用于标识你在列表中的位置。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 结尾，则后续调用可以在请求中包含 after=obj_foo 以获取列表的下一页。

- `before: optional string`

  用于分页查询的游标。 `before` 是一个对象 ID，用于标识你在列表中的位置。例如，如果你发起一个列表请求并收到 100 个对象，以 obj_foo 开头，则后续调用可以在请求中包含 before=obj_foo 以获取列表的上一页。

- `filter: optional "in_progress" or "completed" or "failed" or "cancelled"`

  按文件状态进行筛选。可选值为 `in_progress`, `completed`, `failed`, `cancelled`.

  - `"in_progress"`

  - `"completed"`

  - `"failed"`

  - `"cancelled"`

- `limit: optional number`

  返回对象数量的上限。限制范围为 1 到 100，默认为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### 返回

- `data: array of VectorStoreFile`

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件的创建时间的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下值之一 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可为 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    所附加的 [向量存储](/api/reference/resources/vector_stores) 的 ID，该向量存储 [File](/api/reference/resources/files) 被附加到。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 个键值对。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。键是字符串，
    以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。键是字符串
    最大长度为 64 个字符。值是最大长度为 512 个字符的字符串、布尔值或数字。
    最大长度为 512 个字符的字符串、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块（chunking）的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          块之间重叠的 token 数量。默认值为 `400`.

          请注意，重叠部分不能超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中最大的 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      在分块策略未知时返回。通常，这是因为该文件在 `chunking_strategy` 该概念在 API 中引入。

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
      "vector_store_id": "vs_abc123",
      "usage_bytes": 1234,
      "status": "completed",
      "last_error": null
    },
    {
      "id": "file-abc456",
      "object": "vector_store.file",
      "created_at": 1699061776,
      "vector_store_id": "vs_abc123",
      "usage_bytes": 1234,
      "status": "completed",
      "last_error": null
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

    向量存储文件的创建时间的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下值之一 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可为 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    所附加的 [向量存储](/api/reference/resources/vector_stores) 的 ID，该向量存储 [File](/api/reference/resources/files) 被附加到。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 个键值对。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。键是字符串，
    以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。键是字符串
    最大长度为 64 个字符。值是最大长度为 512 个字符的字符串、布尔值或数字。
    最大长度为 512 个字符的字符串、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块（chunking）的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          块之间重叠的 token 数量。默认值为 `400`.

          请注意，重叠部分不能超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中最大的 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      在分块策略未知时返回。通常，这是因为该文件在 `chunking_strategy` 该概念在 API 中引入。

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
  "vector_store_id": "vs_abc123",
  "status": "completed",
  "last_error": null,
  "usage_bytes": 1234
}
```

## 更新向量存储库文件属性

**post** `/vector_stores/{vector_store_id}/files/{file_id}`

更新向量存储文件上的属性。

### 路径参数

- `vector_store_id: string`

- `file_id: string`

### Body 参数

- `attributes: map[string or number or boolean] or null`

  可附加到对象的 16 个键值对。可用于
  以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。键是字符串，
  以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。键是字符串
  最大长度为 64 个字符。值是最大长度为 512 个字符的字符串、布尔值或数字。
  最大长度为 512 个字符的字符串、布尔值或数字。

  - `string`

  - `number`

  - `boolean`

### 返回

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件的创建时间的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下值之一 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可为 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    所附加的 [向量存储](/api/reference/resources/vector_stores) 的 ID，该向量存储 [File](/api/reference/resources/files) 被附加到。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 个键值对。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。键是字符串，
    以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。键是字符串
    最大长度为 64 个字符。值是最大长度为 512 个字符的字符串、布尔值或数字。
    最大长度为 512 个字符的字符串、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块（chunking）的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          块之间重叠的 token 数量。默认值为 `400`.

          请注意，重叠部分不能超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中最大的 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      在分块策略未知时返回。通常，这是因为该文件在 `chunking_strategy` 该概念在 API 中引入。

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
curl https://api.openai.com/v1/vector_stores/vs_abc123/files/file-abc123 \
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
  "vector_store_id": "vs_abc123",
  "status": "completed",
  "last_error": null,
  "chunking_strategy": {
    "type": "static",
    "static": {
      "max_chunk_size_tokens": 800,
      "chunk_overlap_tokens": 400
    }
  },
  "attributes": {"key1": "value1", "key2": 2}
}
```

## Domain Types

### File Content Response

- `FileContentResponse object { text, type }`

  - `text: optional string`

    文本内容

  - `type: optional string`

    内容类型（目前仅 `"text"`)

### Vector Store File

- `VectorStoreFile object { id, created_at, last_error, 6 more }`

  附加到向量存储的文件列表。

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    向量存储文件的创建时间的 Unix 时间戳（以秒为单位）。

  - `last_error: object { code, message }  or null`

    与此向量存储文件关联的最后一个错误。如果没有错误，则为 `null` 。

    - `code: "server_error" or "unsupported_file" or "invalid_file"`

      以下值之一 `server_error`, `unsupported_file`，或 `invalid_file`.

      - `"server_error"`

      - `"unsupported_file"`

      - `"invalid_file"`

    - `message: string`

      错误的人类可读描述。

  - `object: "vector_store.file"`

    对象类型，始终为 `vector_store.file`.

    - `"vector_store.file"`

  - `status: "in_progress" or "completed" or "cancelled" or "failed"`

    向量存储文件的状态，可为 `in_progress`, `completed`, `cancelled`，或 `failed`。状态 `completed` 表示向量存储文件已可供使用。

    - `"in_progress"`

    - `"completed"`

    - `"cancelled"`

    - `"failed"`

  - `usage_bytes: number`

    向量存储的总使用量（以字节为单位）。请注意，这可能与原始文件大小不同。

  - `vector_store_id: string`

    所附加的 [向量存储](/api/reference/resources/vector_stores) 的 ID，该向量存储 [File](/api/reference/resources/files) 被附加到。

  - `attributes: optional map[string or number or boolean] or null`

    可附加到对象的 16 个键值对。可用于
    以结构化格式存储对象的附加信息，并通过 API 或仪表板查询对象。键是字符串，
    以结构化格式存储对象的附加信息，并通过 接口 或仪表板查询对象。键是字符串
    最大长度为 64 个字符。值是最大长度为 512 个字符的字符串、布尔值或数字。
    最大长度为 512 个字符的字符串、布尔值或数字。

    - `string`

    - `number`

    - `boolean`

  - `chunking_strategy: optional StaticFileChunkingStrategyObject or OtherFileChunkingStrategyObject`

    用于对文件进行分块（chunking）的策略。

    - `StaticFileChunkingStrategyObject object { static, type }`

      - `static: StaticFileChunkingStrategy`

        - `chunk_overlap_tokens: number`

          块之间重叠的 token 数量。默认值为 `400`.

          请注意，重叠部分不能超过 `max_chunk_size_tokens`.

        - `max_chunk_size_tokens: number`

          每个块中最大的 token 数量。默认值为 `800`。最小值为 `100` ，最大值为 `4096`.

      - `type: "static"`

        始终 `static`.

        - `"static"`

    - `OtherFileChunkingStrategyObject object { type }`

      在分块策略未知时返回。通常，这是因为该文件在 `chunking_strategy` 该概念在 API 中引入。

      - `type: "other"`

        始终 `other`.

        - `"other"`

### Vector Store File Deleted

- `VectorStoreFileDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "vector_store.file.deleted"`

    - `"vector_store.file.deleted"`
