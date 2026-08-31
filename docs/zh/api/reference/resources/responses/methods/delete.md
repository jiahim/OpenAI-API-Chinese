> 完整文档索引请参见 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本文档。

## 删除模型响应

**delete** `/responses/{response_id}`

删除具有给定 ID 的模型响应。

### 路径参数

- `response_id: string`

### 示例

```http
curl https://api.openai.com/v1/responses/$RESPONSE_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
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
  "id": "resp_6786a1bec27481909a17d673315b29f6",
  "object": "response",
  "deleted": true
}
```
