> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

## Retrieve thread

**get** `/threads/{thread_id}`

检索一个会话。

### 路径参数

- `thread_id: string`

### 返回

- `Thread object { id, created_at, metadata, 2 more }`

  表示一个包含 [消息](/docs/api-reference/messages).

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    线程创建时的 Unix 时间戳（以秒为单位）。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对集合。可用于
    以结构化格式存储有关对象的附加信息，并通过 API 或仪表板查询对象。
    或仪表板查询对象。

    键为字符串，最大长度为 64 个字符。值为字符串，最大长度为 512 个字符。
    最大长度为 512 个字符。

  - `object: "thread"`

    对象类型，始终为 `thread`.

    - `"thread"`

  - `tool_resources: object { code_interpreter, file_search }  or null`

    此线程中可供助手工具使用的一组资源。这些资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        一个 [文件](/docs/api-reference/files) ID 列表，可供 `code_interpreter` 工具使用。与该工具关联的文件最多为 20 个。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        该 [向量存储](/docs/api-reference/vector-stores/object) 附加到此线程。线程最多可附加 1 个向量存储。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "metadata": {
    "foo": "string"
  },
  "object": "thread",
  "tool_resources": {
    "code_interpreter": {
      "file_ids": [
        "string"
      ]
    },
    "file_search": {
      "vector_store_ids": [
        "string"
      ]
    }
  }
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### Response

```json
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699014083,
  "metadata": {},
  "tool_resources": {
    "code_interpreter": {
      "file_ids": []
    }
  }
}
```
