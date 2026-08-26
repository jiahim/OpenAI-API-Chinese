> 完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 获取。

## 删除消息

**删除** `/threads/{thread_id}/messages/{message_id}`

删除一条消息。

### 路径参数

- `thread_id: string`

- `message_id: string`

### 返回

- `MessageDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "thread.message.deleted"`

    - `"thread.message.deleted"`

### 示例

```http
curl https://api.openai.com/v1/threads/$THREAD_ID/messages/$MESSAGE_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "thread.message.deleted"
}
```

### 示例

```http
curl -X DELETE https://api.openai.com/v1/threads/thread_abc123/messages/msg_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2"
```

#### 响应

```json
{
  "id": "msg_abc123",
  "object": "thread.message.deleted",
  "deleted": true
}
```
