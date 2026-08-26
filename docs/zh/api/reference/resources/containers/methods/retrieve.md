> 完整文档索引见 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

## 检索容器

**获取** `/containers/{container_id}`

检索容器

### 路径参数

- `container_id: string`

### 返回

- `id: string`

  容器的唯一标识符。

- `created_at: number`

  容器创建时的 Unix 时间戳（秒）。

- `name: string`

  容器的名称。

- `object: string`

  此对象的类型。

- `status: string`

  容器的状态（例如，active、deleted）。

- `expires_after: optional object { anchor, minutes }`

  容器将在此时间段后过期。
  锚点是过期的参考点。
  分钟数是指从锚点开始到容器过期前的分钟数。

  - `anchor: optional "last_active_at"`

    过期的参考点。

    - `"last_active_at"`

  - `minutes: optional number`

    从锚点开始到容器过期前的分钟数。

- `last_active_at: optional number`

  容器最后一次活跃时的 Unix 时间戳（秒）。

- `memory_limit: optional "1g" or "4g" or "16g" or "64g"`

  为容器配置的内存限制。

  - `"1g"`

  - `"4g"`

  - `"16g"`

  - `"64g"`

- `network_policy: optional object { type, allowed_domains }`

  容器的网络访问策略。

  - `type: "allowlist" or "disabled"`

    网络策略模式。

    - `"allowlist"`

    - `"disabled"`

  - `allowed_domains: optional array of string`

    当 `type` 为 `allowlist`.

### 示例

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "created_at": 0,
  "name": "name",
  "object": "object",
  "status": "status",
  "expires_after": {
    "anchor": "last_active_at",
    "minutes": 0
  },
  "last_active_at": 0,
  "memory_limit": "1g",
  "network_policy": {
    "type": "allowlist",
    "allowed_domains": [
      "string"
    ]
  }
}
```

### 示例

```http
curl https://api.openai.com/v1/containers/cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
    "id": "cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863",
    "object": "container",
    "created_at": 1747844794,
    "status": "running",
    "expires_after": {
        "anchor": "last_active_at",
        "minutes": 20
    },
    "last_active_at": 1747844794,
    "memory_limit": "4g",
    "name": "My Container"
}
```
