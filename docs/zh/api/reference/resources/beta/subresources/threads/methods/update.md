> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取 Markdown 版本的文档页面。

## 修改会话线程

**post** `/threads/{thread_id}`

修改会话。

### 路径参数

- `thread_id: string`

### 请求体参数

- `metadata: optional Metadata or null`

  可附加到对象的 16 组键值对。可用于
  以结构化格式存储对象的附加信息，并通过
  API 或控制面板查询对象。

  键为字符串，最长 64 个字符。值为字符串，
  最长 512 个字符。

- `tool_resources: optional object { code_interpreter, file_search }  or null`

  在此线程中提供给助手工具使用的一组资源。资源取决于工具的类型。例如， `code_interpreter` 工具需要一个文件 ID 列表，而 `file_search` 工具需要一个向量存储 ID 列表。

  - `code_interpreter: optional object { file_ids }`

    - `file_ids: optional array of string`

      一个 [file](/docs/api-reference/files) ID 列表，可供该 `code_interpreter` 工具使用。与该工具关联的文件最多 20 个。

  - `file_search: optional object { vector_store_ids }`

    - `vector_store_ids: optional array of string`

      该 [vector store](/docs/api-reference/vector-stores/object) 附加到此线程。每个线程最多只能附加 1 个向量存储。

### 返回值

- `Thread object { id, created_at, metadata, 2 more }`

  表示一个包含 [消息](/docs/api-reference/messages).

  - `id: string`

    该标识符，可在 API 端点中引用。

  - `created_at: number`

    线程创建时的 Unix 时间戳（以秒为单位）。

  - `metadata: Metadata or null`

    可附加到对象的 16 组键值对。可用于
    以结构化格式存储对象的附加信息，并通过
    API 或控制面板查询对象。

    键为字符串，最长 64 个字符。值为字符串，
    最长 512 个字符。

  - `object: "thread"`

    对象类型，始终为 `thread`.

    - `"thread"`

  - `tool_resources: object { code_interpreter, file_search }  or null`

    在此线程中提供给助手工具使用的一组资源。资源取决于工具的类型。例如， `code_interpreter` 工具需要一个文件 ID 列表，而 `file_search` 工具需要一个向量存储 ID 列表。

    - `code_interpreter: optional object { file_ids }`

      - `file_ids: optional array of string`

        一个 [file](/docs/api-reference/files) ID 列表，可供该 `code_interpreter` 工具使用。与该工具关联的文件最多 20 个。

    - `file_search: optional object { vector_store_ids }`

      - `vector_store_ids: optional array of string`

        该 [vector store](/docs/api-reference/vector-stores/object) 附加到此线程。每个线程最多只能附加 1 个向量存储。

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID \
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
  -H "OpenAI-Beta: assistants=v2" \
  -d '{
      "metadata": {
        "modified": "true",
        "user": "abc123"
      }
    }'
```

#### 响应

```json
{
  "id": "thread_abc123",
  "object": "thread",
  "created_at": 1699014083,
  "metadata": {
    "modified": "true",
    "user": "abc123"
  },
  "tool_resources": {}
}
```
