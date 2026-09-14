> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾添加 `.md` 即可获取该页面的 Markdown 版本。

## 删除 ChatKit 会话

**delete** `/chatkit/threads/{thread_id}`

删除 ChatKit 会话及其项目和已存储的附件。

### 路径参数

- `thread_id: string`

### 返回

- `id: string`

  已删除对话的标识符。

- `deleted: boolean`

  表示该对话已被删除。

- `object: "chatkit.thread.deleted"`

  始终为的类型判别字段 `chatkit.thread.deleted`.

  - `"chatkit.thread.deleted"`

### 示例

```http
curl https://api.openai.com/v1/chatkit/threads/$THREAD_ID \
    -X DELETE \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "chatkit.thread.deleted"
}
```
