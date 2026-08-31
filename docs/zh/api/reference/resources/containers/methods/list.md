> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取 Markdown 版本的文档页面。

## 列出容器

**get** `/containers`

List Containers

### Query Parameters

- `after: optional string`

  用于分页的光标。 `after` 是一个对象 ID，用于标识你在列表中的位置。例如，如果你发起列表请求并收到 100 个对象，以 obj_foo 结尾，则后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `limit: optional number`

  要返回的对象数量限制。限制范围为 1 到 100，默认为 20。

- `name: optional string`

  按容器名称过滤结果。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of object { id, created_at, name, 6 more }`

  容器列表。

  - `id: string`

    容器的唯一标识符。

  - `created_at: number`

    容器创建时的 Unix 时间戳（以秒为单位）。

  - `name: string`

    容器的名称。

  - `object: string`

    此对象的类型。

  - `status: string`

    容器的状态（例如，active、deleted）。

  - `expires_after: optional object { anchor, minutes }`

    容器将在此时间周期之后过期。
    锚点是过期时间的参考点。
    minutes 表示容器在锚点之后多少分钟过期。

    - `anchor: optional "last_active_at"`

      过期时间的参考点。

      - `"last_active_at"`

    - `minutes: optional number`

      容器在锚点之后多少分钟过期。

  - `last_active_at: optional number`

    容器最近活跃时的 Unix 时间戳（以秒为单位）。

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

      在以下模式下的允许的出站域名 `type` 为 `allowlist`.

- `first_id: string`

  列表中第一个容器的 ID。

- `has_more: boolean`

  是否还有更多容器可用。

- `last_id: string`

  列表中最后一个容器的 ID。

- `object: "list"`

  返回的对象类型，必须为 'list'。

  - `"list"`

### 示例

```http
curl https://api.openai.com/v1/containers \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
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
  ],
  "first_id": "first_id",
  "has_more": true,
  "last_id": "last_id",
  "object": "list"
}
```

### 示例

```http
curl https://api.openai.com/v1/containers \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "object": "list",
  "data": [
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
  ],
  "first_id": "container_123",
  "last_id": "container_123",
  "has_more": false
}
```
