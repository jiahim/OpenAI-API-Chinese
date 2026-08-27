> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 创建检查点权限

**发布** `/fine_tuning/checkpoints/{fine_tuned_model_checkpoint}/permissions`

**注意：** 调用此端点需要使用 [管理员 API 密钥](../admin-api-keys).

这使得组织所有者可以将微调模型与组织中的其他项目共享。

### 路径参数

- `fine_tuned_model_checkpoint: string`

### 请求体参数

- `project_ids: array of string`

  授予访问权限的项目标识符。

### 返回

- `data: array of object { id, created_at, object, project_id }`

  - `id: string`

    权限标识符，可在 API 端点中引用。

  - `created_at: number`

    权限创建时的 Unix 时间戳（以秒为单位）。

  - `object: "checkpoint.permission"`

    对象类型，始终为 "checkpoint.permission"。

    - `"checkpoint.permission"`

  - `project_id: string`

    该权限对应的项目标识符。

- `has_more: boolean`

- `object: "list"`

  - `"list"`

- `first_id: optional string or null`

- `last_id: optional string or null`

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/$FINE_TUNED_MODEL_CHECKPOINT/permissions \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "project_ids": [
            "string"
          ]
        }'
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "created_at": 0,
      "object": "checkpoint.permission",
      "project_id": "project_id"
    }
  ],
  "has_more": true,
  "object": "list",
  "first_id": "first_id",
  "last_id": "last_id"
}
```

### 示例

```http
curl https://api.openai.com/v1/fine_tuning/checkpoints/ft:gpt-4o-mini-2024-07-18:org:weather:B7R9VjQd/permissions \
  -H "Authorization: Bearer $OPENAI_API_KEY"
  -d '{"project_ids": ["proj_abGMw1llN8IrBb6SvvY5A1iH"]}'
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "object": "checkpoint.permission",
      "id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
      "created_at": 1721764867,
      "project_id": "proj_abGMw1llN8IrBb6SvvY5A1iH"
    }
  ],
  "first_id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "last_id": "cp_zc4Q7MP6XxulcVzj4MZdwsAB",
  "has_more": false
}
```
