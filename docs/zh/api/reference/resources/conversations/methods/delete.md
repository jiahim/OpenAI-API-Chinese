> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 删除会话

**删除** `/conversations/{conversation_id}`

删除对话。对话中的项目不会被删除。

### 路径参数

- `conversation_id: string`

### 返回

- `ConversationDeletedResource object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "conversation.deleted"`

    - `"conversation.deleted"`

### 示例

```http
curl https://api.openai.com/v1/conversations/$CONVERSATION_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "conversation.deleted"
}
```

### 示例

```http
curl -X DELETE https://api.openai.com/v1/conversations/conv_123 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "conv_123",
  "object": "conversation.deleted",
  "deleted": true
}
```
