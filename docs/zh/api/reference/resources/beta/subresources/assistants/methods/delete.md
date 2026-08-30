> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获得该页面的 Markdown 版本。

## 删除 assistant

**delete** `/assistants/{assistant_id}`

删除一个智能体。

### 路径参数

- `assistant_id: string`

### 返回

- `AssistantDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: "assistant.deleted"`

    - `"assistant.deleted"`

### 示例

```http
curl https://api.openai.com/v1/assistants/$ASSISTANT_ID \
    -X DELETE \
    -H 'OpenAI-Beta: assistants=v2' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "assistant.deleted"
}
```

### 示例

```http
curl https://api.openai.com/v1/assistants/asst_abc123 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Beta: assistants=v2" \
  -X DELETE
```

#### 响应

```json
{
  "id": "asst_abc123",
  "object": "assistant.deleted",
  "deleted": true
}
```
