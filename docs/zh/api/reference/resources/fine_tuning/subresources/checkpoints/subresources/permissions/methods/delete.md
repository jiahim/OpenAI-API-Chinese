> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

## 删除检查点权限

**删除** `/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions/{permission_id}`

**注意：** 此端点需要 [管理员 API 密钥](../admin-api-keys).

组织所有者可以使用此端点删除对微调模型检查点的权限。

### 路径参数

- `fine_tuned_model_checkpoint: string`

- `permission_id: string`

### 返回

- `id: string`

  已删除的微调模型检查点权限的 ID。

- `deleted: boolean`

  微调模型检查点权限是否已成功删除。

- `object: "checkpoint.permission"`

  对象类型，始终为“checkpoint.permission”。

  - `"checkpoint.permission"`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/$FINE_TUNED_MODEL_CHECKPOINT/permissions/$PERMISSION_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "deleted": true,
  "object": "checkpoint.permission"
}
```

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions/cp_zc4Q7MP6XxulcVzj4MZdwsAB \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "checkpoint.permission",
  "id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "deleted": true
}
```
