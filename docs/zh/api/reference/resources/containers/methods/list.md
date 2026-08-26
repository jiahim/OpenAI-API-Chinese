> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 列出容器

**获取** `/containers`

列出容器

### 查询参数

- `after: optional string`

  用于分页的游标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发出一个列表请求并收到 100 个对象（以 obj_foo 结尾），你的后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `limit: optional number`

  对返回对象数量的限制。限制范围可在 1 到 100 之间，默认为 20。

- `name: optional string`

  按容器名称筛选结果。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 用于升序排列， `desc` 用于降序排列。

  - `"asc"`

  - `"desc"`

### 返回

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

    容器将在此时段后过期。
    锚点是过期的参考点。
    分钟数是锚点之后、容器过期之前的分钟数。

    - `anchor: optional "last_active_at"`

      过期的参考点。

      - `"last_active_at"`

    - `minutes: optional number`

      锚点之后、容器过期之前的分钟数。

  - `last_active_at: optional number`

    容器最后一次活动时的 Unix 时间戳（以秒为单位）。

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

      允许的出站域名，当 `type` 为 `allowlist`.

- `first_id: string`

  列表中第一个容器的 ID。

- `has_more: boolean`

  是否有更多可用容器。

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
