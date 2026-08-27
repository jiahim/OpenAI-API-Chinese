> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 删除微调模型

**删除** `/models/{model}`

删除一个微调模型。你在组织内必须拥有所有者角色才能删除模型。

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
