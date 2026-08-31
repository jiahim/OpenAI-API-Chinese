> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾追加 `.md` 可获取文档页面的 Markdown 版本。

## Retrieve model

**get** `/models/{model}`

获取模型实例，并提供该模型的基本信息，例如所有者和权限配置。

### 路径参数

- `model: string`

### 返回

- `Model object { id, created, object, 2 more }`

  描述可与 API 配合使用的 OpenAI 模型产品。

  - `id: string`

    模型标识符，可在 API 端点中引用。

  - `created: number`

    模型创建时的 Unix 时间戳（以秒为单位）。

  - `object: "model"`

    对象类型，始终为 "model"。

    - `"model"`

  - `owned_by: string`

    拥有该模型的组织。

  - `shutdown_date: optional string or null`

    模型将下线的日期，若未公布则为 null。

### 示例

```http
curl https://api.openai.com/v1/models/$MODEL \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created": 0,
  "object": "model",
  "owned_by": "owned_by",
  "shutdown_date": "2019-12-27"
}
```

### 示例

```http
curl https://api.openai.com/v1/models/VAR_chat_model_id \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "VAR_chat_model_id",
  "object": "model",
  "created": 1686935002,
  "owned_by": "openai",
  "shutdown_date": "2026-10-23"
}
```
