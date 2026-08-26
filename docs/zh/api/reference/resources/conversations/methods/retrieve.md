> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

## 检索对话

**get** `/conversations/{conversation_id}`

获取对话

### 路径参数

- `conversation_id: string`

### 返回

- `Conversation object { id, created_at, metadata, object }`

  - `id: string`

    会话的唯一 ID。

  - `created_at: number`

    会话创建时间，以 Unix 纪元以来的秒数计量。

  - `metadata: unknown`

    可附加到对象上的 16 个键值对集合。这在以结构化格式存储关于对象的额外信息，以及通过 API 或仪表盘查询对象时很有用。
    键为字符串，最大长度为 64 个字符。值为字符串，最大长度为 512 个字符。

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
  "metadata": {},
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
