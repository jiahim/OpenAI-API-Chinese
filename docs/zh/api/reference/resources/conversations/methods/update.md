> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 更新对话

**post** `/conversations/{conversation_id}`

更新对话

### 路径参数

- `conversation_id: string`

### 请求体参数

- `metadata: Metadata or null`

  可附加到对象上的16组键值对。这可以
  用于以结构化格式存储关于对象的额外信息，
  并通过 API 或仪表盘查询对象。

  键是字符串，最大长度为64个字符。值是字符串
  最大长度为512个字符。

### 返回

- `Conversation object { id, created_at, metadata, object }`

  - `id: string`

    对话的唯一 ID。

  - `created_at: number`

    对话创建的时间，以 Unix 纪元以来的秒数衡量。

  - `metadata: unknown`

    可附加到对象的一组 16 个键值对。这可用于以结构化格式存储有关对象的附加信息，并通过 API 或仪表板查询对象。
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
