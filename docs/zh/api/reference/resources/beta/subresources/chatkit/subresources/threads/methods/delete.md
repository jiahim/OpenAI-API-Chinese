> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 删除 ChatKit 线程

**删除** `/chatkit/threads/{thread_id}`

删除一个 ChatKit 线程及其条目和存储的附件。

### 路径参数

- `thread_id: string`

### 返回

- `id: string`

  已删除线程的标识符。

- `deleted: boolean`

  表示线程已被删除。

- `object: "chatkit.thread.deleted"`

  始终为 `chatkit.thread.deleted`.

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
