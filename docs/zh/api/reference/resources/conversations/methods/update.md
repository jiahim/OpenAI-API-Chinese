> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

## 更新会话

**post** `/conversations/{conversation_id}`

更新对话

### 路径参数

- `conversation_id: string`

### 请求体参数

- `metadata: Metadata or null`

  可附加到对象的 16 组键值对。可用于
  以结构化格式存储对象的附加信息，并通过
  API 或控制台查询对象。

  键为字符串，最大长度为 64 个字符；值为字符串，
  最大长度为 512 个字符。

### Returns

- `Conversation object { id, created_at, metadata, object }`

  - `id: string`

    对话的唯一 ID。

  - `created_at: number`

    对话创建的时间，以自 Unix 纪元以来的秒数表示。

  - `metadata: unknown`

    可以附加到对象的 16 个键值对集合。这可用于以结构化格式存储有关对象的附加信息，并通过 API 或控制面板查询对象。
    键为字符串，最长 64 个字符。值为字符串，最长 512 个字符。

  - `object: "conversation"`

    对象类型，始终为 `conversation`.

    - `"conversation"`

### 示例

```http
curl https://api.openai.com/v1/conversations/$CONVERSATION_ID \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "metadata": {
            "foo": "string"
          }
        }'
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
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "metadata": {"topic": "project-x"}
  }'
```

#### 响应

```json
{
  "id": "conv_123",
  "object": "conversation",
  "created_at": 1741900000,
  "metadata": {"topic": "project-x"}
}
```
