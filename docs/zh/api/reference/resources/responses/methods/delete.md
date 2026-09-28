> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾追加 `.md` 可获取文档页面的 Markdown 版本。

## 删除模型响应

**delete** `/responses/{response_id}`

删除具有指定 ID 的模型响应。

### 路径参数

- `response_id: string`

### 返回

- `id: string`

- `deleted: boolean`

- `object: "response.deleted"`

  - `"response.deleted"`

### 示例

```http
curl https://api.openai.com/v1/responses/$RESPONSE_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "response.deleted"
}
```

### 示例

```http
curl -X DELETE https://api.openai.com/v1/responses/resp_123 \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "resp_123",
  "object": "response.deleted",
  "deleted": true
}
```
