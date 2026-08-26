> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过追加 `.md` 到页面 URL 获取。

## 检索模型

**get** `/models/{model}`

检索一个模型实例，提供有关该模型的基本信息，如所有者与权限。

### 路径参数

- `model: string`

### 返回

- `Model object { id, created, object, 2 more }`

  描述一个可与 OpenAIAPI 一起使用的模型产品。

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

    模型停用的日期，若未公布则为 null。

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
