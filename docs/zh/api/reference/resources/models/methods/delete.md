> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾追加 `.md` 以获取该页面的 Markdown 版本。

## 删除微调模型

**delete** `/models/{model}`

删除微调模型。要删除模型，你必须在组织中拥有 Owner 角色。

### 路径参数

- `model: string`

### 返回

- `ModelDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: string`

### 示例

```http
curl https://api.openai.com/v1/models/$MODEL \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "object"
}
```

### 示例

```http
curl https://api.openai.com/v1/models/ft:gpt-4o-mini:acemeco:suffix:abc123 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "ft:gpt-4o-mini:acemeco:suffix:abc123",
  "object": "model",
  "deleted": true
}
```
