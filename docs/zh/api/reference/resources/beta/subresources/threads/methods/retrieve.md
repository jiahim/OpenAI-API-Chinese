> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 检索线程

**get** `/threads/{thread_id}`

检索一个线程。

### 路径参数

- `thread_id: string`

### 返回

- `Thread object { id, created_at, metadata, 2 more }`

  表示包含 [消息](/docs/api-reference/messages).

  - `id: string`

    标识符，可在 API 端点中引用。

  - `created_at: number`

    线程创建时的 Unix 时间戳（秒）。

  - `metadata: Metadata or null`

    可附加到对象的 16 个键值对集合。这可以
    用于以结构化格式存储关于对象的附加信息，
    并通过 API 或仪表板查询对象。

    键是字符串，最大长度为 64 个字符。值是字符串，
    最大长度为 512 个字符。

  - `object: "thread"`

    对象类型，始终为 `thread`.

    - `"thread"`

  - `tool_resources: object { code_interpreter, file_search }  or null`

    一组在此线程中对助理的工具可用的资源。资源特定于工具类型。例如， `code_interpreter` 工具需要文件 ID 列表，而 `file_search` 工具需要向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        可用的 [文件](/docs/api-reference/files) ID 列表，提供给 `code_interpreter` 工具。与该工具关联的文件最多可有 20 个。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        附加到此线程的 [向量存储](/docs/api-reference/vector-stores/object) 。线程最多可附加 1 个向量存储。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

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

#### 响应

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
