> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取相应文档页面的 Markdown 版本。

## 列出模型

**get** `/models`

列出当前可用的模型，并提供每个模型的基本信息，例如所有者和可用性。

### Returns

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

    模型将下线的日期，如果尚未公布则为 null。

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
    }
  ]
}
```
