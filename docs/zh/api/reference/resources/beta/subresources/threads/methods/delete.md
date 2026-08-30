> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

## 删除会话

**delete** `/threads/{thread_id}`

删除会话线程。

### 路径参数

- `thread_id: string`

### 返回

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
