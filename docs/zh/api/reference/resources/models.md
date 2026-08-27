# 模型

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 获取。

## 删除微调模型

**删除** `/models/{model}`

删除一个已微调模型。你必须拥有所在组织的所有者角色才能删除模型。

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

## 列出模型

**get** `/models`

列出当前可用的模型，并提供关于每个模型的基本信息，例如所有者及其可用性。

### 返回

- `data: array of Model`

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

    模型将下架的日期，若未公布则为 null。

- `object: "list"`

  - `"list"`

### 示例

```http
curl https://api.openai.com/v1/models \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "created": 0,
      "object": "model",
      "owned_by": "owned_by",
      "shutdown_date": "2019-12-27"
    }
  ],
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "list",
  "data": [
    {
      "id": "model-id-0",
      "object": "model",
      "created": 1686935002,
      "owned_by": "organization-owner",
      "shutdown_date": null
    },
    {
      "id": "model-id-1",
      "object": "model",
      "created": 1686935002,
      "owned_by": "organization-owner",
      "shutdown_date": null
    },
    {
      "id": "model-id-2",
      "object": "model",
      "created": 1686935002,
      "owned_by": "openai",
      "shutdown_date": "2026-10-23"
    },
  ]
}
```

## 检索模型

**获取** `/models/{model}`

检索模型实例，提供有关模型的基本信息，例如所有者和权限。

### 路径参数

- `model: string`

### 返回

- `Model object { id, created, object, 2 more }`

  描述一种可与 API 一起使用的 OpenAI 模型产品。

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

    模型停用的日期；若未公布则为 null。

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

## 域类型

### 模型

- `Model object { id, created, object, 2 more }`

  描述了一种可与 OpenAI API 一起使用的模型产品。

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

    模型将关闭的日期，如果尚未公布则为 null。

### 模型已删除

- `ModelDeleted object { id, deleted, object }`

  - `id: string`

  - `deleted: boolean`

  - `object: string`
