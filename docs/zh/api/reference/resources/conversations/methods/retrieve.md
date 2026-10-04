> 完整文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 来获取。

## 检索对话

**get** `/conversations/{conversation_id}`

获取对话

### 路径参数

- `conversation_id: string`

### 返回

- `Conversation object { id, created_at, metadata, object }`

  - `id: string`

    该对话的唯一 ID。

  - `created_at: number`

    对话创建的时间，以自 Unix 纪元以来的秒数表示。

  - `metadata: map[string]`

    可附加到对象的 16 个键值对集合。这对于以结构化格式存储有关对象的附加信息，以及通过 API 或控制面板查询对象非常有用。
    键为字符串，最长 64 个字符。值为字符串，最长 512 个字符。

  - `object: "conversation"`

    对象类型，始终为 `conversation`.

    - `"conversation"`

### 示例

```http
curl https://api.openai.com/v1/conversations/$CONVERSATION_ID \
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
  "object": "conversation"
}
```

### 示例

```http
curl https://api.openai.com/v1/conversations/conv_123 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "conv_123",
  "object": "conversation",
  "created_at": 1741900000,
  "metadata": {"topic": "demo"}
}
```
