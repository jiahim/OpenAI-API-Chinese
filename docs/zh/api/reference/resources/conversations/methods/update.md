> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取各文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 来获取。

## 更新对话

**post** `/conversations/{conversation_id}`

更新对话

### 路径参数

- `conversation_id: string`

### 请求体参数

- `metadata: Metadata or null`

  可附加到对象上的 16 组键值对。这对于以结构化格式存储对象的附加信息，以及通过 API 或控制台查询对象非常有用。
  键是字符串，最大长度为 64 个字符。值是字符串，最大长度为 512 个字符。

### Returns

- `Conversation object { id, created_at, metadata, object }`

  - `id: string`

    该会话的唯一 ID。

  - `created_at: number`

    会话创建的时间，以自 Unix 纪元以来的秒数表示。

  - `metadata: unknown`

    可附加到对象上的 16 组键值对。这对于以结构化格式存储对象的附加信息，以及通过 API 或控制台查询对象非常有用。
    键是字符串，最大长度为 64 个字符。值是字符串，最大长度为 512 个字符。

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
