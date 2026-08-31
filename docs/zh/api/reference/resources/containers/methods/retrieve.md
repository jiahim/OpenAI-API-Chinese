> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 检索容器

**get** `/containers/{container_id}`

检索容器

### 路径参数

- `container_id: string`

### 返回值

- `id: string`

  容器的唯一标识符。

- `created_at: number`

  容器创建时的 Unix 时间戳（单位：秒）。

- `name: string`

  容器的名称。

- `object: string`

  此对象的类型。

- `status: string`

  容器的状态（例如，active、deleted）。

- `expires_after: optional object { anchor, minutes }`

  容器将在此时段之后过期。
  锚点是过期时间的参考点。
  minutes 表示容器在锚点之后过期的分钟数。

  - `anchor: optional "last_active_at"`

    过期时间的参考点。

    - `"last_active_at"`

  - `minutes: optional number`

    容器在锚点之后过期的分钟数。

- `last_active_at: optional number`

  容器最近一次活跃时的 Unix 时间戳（单位：秒）。

- `memory_limit: optional "1g" or "4g" or "16g" or "64g"`

  为容器配置的内存上限。

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

    当处于 `type` 状态时允许的外出访问域名 `allowlist`.

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
