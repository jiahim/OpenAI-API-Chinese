> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 删除线程

**删除** `/threads/{thread_id}`

删除一个线程。

### 路径参数

- `thread_id: string`

### 返回值

- `ThreadDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "thread.deleted"`

    - `"thread.deleted"`

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "thread.deleted"
}
```

### 示例

```http
curl https://api.openai.com/v1/threads/thread_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE
```

#### 响应

```json
{
  "id": "thread_abc123",
  "object": "thread.deleted",
  "deleted": true
}
```
