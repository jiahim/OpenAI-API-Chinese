# Containers

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取 Markdown 版本的文档页面。

## 创建容器

**post** `/containers`

创建容器

### Body 参数

- `name: string`

  要创建的容器名称。

- `expires_after: optional object { anchor, minutes }`

  相对“anchor”时间的容器过期时间（以秒为单位）。

  - `anchor: "last_active_at"`

    过期时间的时间锚点。目前仅支持 'last_active_at'。

    - `"last_active_at"`

  - `minutes: number`

- `file_ids: optional array of string`

  要复制到容器中的文件 ID。

- `memory_limit: optional "1g" or "4g" or "16g" or "64g"`

  容器的可选内存限制。默认为 "1g"。

  - `"1g"`

  - `"4g"`

  - `"16g"`

  - `"64g"`

- `network_policy: optional ContainerNetworkPolicyDisabled or ContainerNetworkPolicyAllowlist`

  容器的网络访问策略。

  - `ContainerNetworkPolicyDisabled object { type }`

    - `type: "disabled"`

      禁用出站网络访问。始终 `disabled`.

      - `"disabled"`

  - `ContainerNetworkPolicyAllowlist object { allowed_domains, type, domain_secrets }`

    - `allowed_domains: array of string`

      当 type 为 `allowlist`.

    - `type: "allowlist"`

      仅允许对指定域进行出站网络访问。始终 `allowlist`.

      - `"allowlist"`

    - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

      针对白名单域的可选域范围密钥。

      - `domain: string`

        与该密钥关联的域。

      - `name: string`

        为该域注入的密钥名称。

      - `value: string`

        为该域注入的密钥值。

- `skills: optional array of SkillReference or InlineSkill`

  通过 ID 引用或内联数据的可选技能列表。

  - `SkillReference object { skill_id, type, version }`

    - `skill_id: string`

      所引用技能的 ID。

    - `type: "skill_reference"`

      引用通过 /v1/skills 端点创建的技能。

      - `"skill_reference"`

    - `version: optional string`

      可选的技能版本。使用正整数或 'latest'。省略以使用默认值。

  - `InlineSkill object { description, name, source, type }`

    - `description: string`

      技能的描述。

    - `name: string`

      技能的名称。

    - `source: InlineSkillSource`

      内联技能负载

      - `data: string`

        经过 Base64 编码的技能 zip 包。

      - `media_type: "application/zip"`

        内联技能负载的媒体类型。必须为 `application/zip`.

        - `"application/zip"`

      - `type: "base64"`

        内联技能源的类型。必须为 `base64`.

        - `"base64"`

    - `type: "inline"`

      为本次请求定义一个内联技能。

      - `"inline"`

### Returns

- `id: string`

  容器的唯一标识符。

- `created_at: number`

  容器创建时的 Unix 时间戳（以秒为单位）。

- `name: string`

  容器的名称。

- `object: string`

  此对象的类型。

- `status: string`

  容器的状态（例如 active、deleted）。

- `expires_after: optional object { anchor, minutes }`

  容器在此时间周期后将过期。
  anchor 是过期时间的参考点。
  minutes 是 anchor 之后到容器过期之前的分钟数。

  - `anchor: optional "last_active_at"`

    过期时间的参考点。

    - `"last_active_at"`

  - `minutes: optional number`

    anchor 之后到容器过期之前的分钟数。

- `last_active_at: optional number`

  容器最近一次活跃时的 Unix 时间戳（以秒为单位）。

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

    当 network_policy.mode 为 `type` 时允许的出站域名 `allowlist`.

### 示例

```http
curl https://api.openai.com/v1/containers \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "name": "name"
        }'
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
curl https://api.openai.com/v1/containers \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "name": "My Container",
        "memory_limit": "4g",
        "skills": [
          {
            "type": "skill_reference",
            "skill_id": "skill_4db6f1a2c9e73508b41f9da06e2c7b5f"
          },
          {
            "type": "skill_reference",
            "skill_id": "openai-spreadsheets",
            "version": "latest"
          }
        ],
        "network_policy": {
          "type": "allowlist",
          "allowed_domains": ["api.buildkite.com"]
        }
      }'
```

#### 响应

```json
{
    "id": "cntr_682e30645a488191b6363a0cbefc0f0a025ec61b66250591",
    "object": "container",
    "created_at": 1747857508,
    "status": "running",
    "expires_after": {
        "anchor": "last_active_at",
        "minutes": 20
    },
    "last_active_at": 1747857508,
    "network_policy": {
        "type": "allowlist",
        "allowed_domains": ["api.buildkite.com"]
    },
    "memory_limit": "4g",
    "name": "My Container"
}
```

## 删除容器

**delete** `/containers/{container_id}`

Delete Container

### 路径参数

- `container_id: string`

### 示例

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 示例

```http
curl -X DELETE https://api.openai.com/v1/containers/cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
    "id": "cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863",
    "object": "container.deleted",
    "deleted": true
}
```

## 列出容器

**get** `/containers`

列出容器

### 查询参数

- `after: optional string`

  用于分页的光标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发起列表请求并收到 100 个对象，以 obj_foo 结尾，那么你的后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `limit: optional number`

  要返回的对象数量上限。限制范围为 1 到 100，默认为 20。

- `name: optional string`

  按容器名称筛选结果。

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

    容器的状态（例如 active、deleted）。

  - `expires_after: optional object { anchor, minutes }`

    容器在此时间周期后将过期。
    anchor 是过期时间的参考点。
    minutes 是 anchor 之后到容器过期之前的分钟数。

    - `anchor: optional "last_active_at"`

      过期时间的参考点。

      - `"last_active_at"`

    - `minutes: optional number`

      anchor 之后到容器过期之前的分钟数。

  - `last_active_at: optional number`

    容器最近一次活跃时的 Unix 时间戳（以秒为单位）。

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

      当 network_policy.mode 为 `type` 时允许的出站域名 `allowlist`.

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

## 检索容器

**get** `/containers/{container_id}`

Retrieve Container

### 路径参数

- `container_id: string`

### Returns

- `id: string`

  容器的唯一标识符。

- `created_at: number`

  容器创建时的 Unix 时间戳（以秒为单位）。

- `name: string`

  容器的名称。

- `object: string`

  此对象的类型。

- `status: string`

  容器的状态（例如 active、deleted）。

- `expires_after: optional object { anchor, minutes }`

  容器在此时间周期后将过期。
  anchor 是过期时间的参考点。
  minutes 是 anchor 之后到容器过期之前的分钟数。

  - `anchor: optional "last_active_at"`

    过期时间的参考点。

    - `"last_active_at"`

  - `minutes: optional number`

    anchor 之后到容器过期之前的分钟数。

- `last_active_at: optional number`

  容器最近一次活跃时的 Unix 时间戳（以秒为单位）。

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

    当 network_policy.mode 为 `type` 时允许的出站域名 `allowlist`.

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

## Domain Types

### Container Create Response

- `ContainerCreateResponse object { id, created_at, name, 6 more }`

  - `id: string`

    容器的唯一标识符。

  - `created_at: number`

    容器创建时的 Unix 时间戳（以秒为单位）。

  - `name: string`

    容器的名称。

  - `object: string`

    此对象的类型。

  - `status: string`

    容器的状态（例如 active、deleted）。

  - `expires_after: optional object { anchor, minutes }`

    容器在此时间周期后将过期。
    anchor 是过期时间的参考点。
    minutes 是 anchor 之后到容器过期之前的分钟数。

    - `anchor: optional "last_active_at"`

      过期时间的参考点。

      - `"last_active_at"`

    - `minutes: optional number`

      anchor 之后到容器过期之前的分钟数。

  - `last_active_at: optional number`

    容器最近一次活跃时的 Unix 时间戳（以秒为单位）。

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

      当 network_policy.mode 为 `type` 时允许的出站域名 `allowlist`.

### Container List Response

- `ContainerListResponse object { id, created_at, name, 6 more }`

  - `id: string`

    容器的唯一标识符。

  - `created_at: number`

    容器创建时的 Unix 时间戳（以秒为单位）。

  - `name: string`

    容器的名称。

  - `object: string`

    此对象的类型。

  - `status: string`

    容器的状态（例如 active、deleted）。

  - `expires_after: optional object { anchor, minutes }`

    容器在此时间周期后将过期。
    anchor 是过期时间的参考点。
    minutes 是 anchor 之后到容器过期之前的分钟数。

    - `anchor: optional "last_active_at"`

      过期时间的参考点。

      - `"last_active_at"`

    - `minutes: optional number`

      anchor 之后到容器过期之前的分钟数。

  - `last_active_at: optional number`

    容器最近一次活跃时的 Unix 时间戳（以秒为单位）。

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

      当 network_policy.mode 为 `type` 时允许的出站域名 `allowlist`.

### Container Retrieve Response

- `ContainerRetrieveResponse object { id, created_at, name, 6 more }`

  - `id: string`

    容器的唯一标识符。

  - `created_at: number`

    容器创建时的 Unix 时间戳（以秒为单位）。

  - `name: string`

    容器的名称。

  - `object: string`

    此对象的类型。

  - `status: string`

    容器的状态（例如 active、deleted）。

  - `expires_after: optional object { anchor, minutes }`

    容器在此时间周期后将过期。
    anchor 是过期时间的参考点。
    minutes 是 anchor 之后到容器过期之前的分钟数。

    - `anchor: optional "last_active_at"`

      过期时间的参考点。

      - `"last_active_at"`

    - `minutes: optional number`

      anchor 之后到容器过期之前的分钟数。

  - `last_active_at: optional number`

    容器最近一次活跃时的 Unix 时间戳（以秒为单位）。

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

      当 network_policy.mode 为 `type` 时允许的出站域名 `allowlist`.

# Files

## Create container file

**post** `/containers/{container_id}/files`

创建容器文件

你可以发送包含原始文件内容的 multipart/form-data 请求，或发送包含文件 ID 的 JSON 请求。

### 路径参数

- `container_id: string`

### Body 参数

- `file: optional string`

  要上传的 File 对象（非文件名）。

- `file_id: optional string`

  要创建的文件的名称。

### Returns

- `id: string`

  文件的唯一标识符。

- `bytes: number`

  文件的大小（以字节为单位）。

- `container_id: string`

  此文件所属的容器。

- `created_at: number`

  文件创建时的 Unix 时间戳（以秒为单位）。

- `object: string`

  此对象的类型（`container.file`).

- `path: string`

  文件在容器中的路径。

- `source: string`

  文件的来源（例如， `user`, `assistant`).

### 示例

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{}'
```

#### 响应

```json
{
  "id": "id",
  "bytes": 0,
  "container_id": "container_id",
  "created_at": 0,
  "object": "object",
  "path": "path",
  "source": "source"
}
```

### 示例

```http
curl https://api.openai.com/v1/containers/cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04/files \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F file="@example.txt"
```

#### 响应

```json
{
  "id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
  "object": "container.file",
  "created_at": 1747848842,
  "bytes": 880,
  "container_id": "cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04",
  "path": "/mnt/data/88e12fa445d32636f190a0b33daed6cb-tsconfig.json",
  "source": "user"
}
```

## 删除容器文件

**delete** `/containers/{container_id}/files/{file_id}`

删除容器文件

### 路径参数

- `container_id: string`

- `file_id: string`

### 示例

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files/$FILE_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 示例

```http
curl -X DELETE https://api.openai.com/v1/containers/cntr_682dfebaacac8198bbfe9c2474fb6f4a085685cbe3cb5863/files/cfile_682e0e8a43c88191a7978f477a09bdf5 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
    "id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
    "object": "container.file.deleted",
    "deleted": true
}
```

## 列出容器文件

**get** `/containers/{container_id}/files`

列出 Container 文件

### 路径参数

- `container_id: string`

### 查询参数

- `after: optional string`

  用于分页的光标。 `after` 是一个对象 ID，用于定义你在列表中的位置。例如，如果你发起列表请求并收到 100 个对象，以 obj_foo 结尾，那么你的后续调用可以包含 after=obj_foo 以获取列表的下一页。

- `limit: optional number`

  要返回的对象数量上限。限制范围为 1 到 100，默认为 20。

- `order: optional "asc" or "desc"`

  按对象的 `created_at` 时间戳排序。 `asc` 表示升序， `desc` 表示降序。

  - `"asc"`

  - `"desc"`

### Returns

- `data: array of object { id, bytes, container_id, 4 more }`

  容器文件列表。

  - `id: string`

    文件的唯一标识符。

  - `bytes: number`

    文件的大小（以字节为单位）。

  - `container_id: string`

    此文件所属的容器。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `object: string`

    此对象的类型（`container.file`).

  - `path: string`

    文件在容器中的路径。

  - `source: string`

    文件的来源（例如， `user`, `assistant`).

- `first_id: string`

  列表中第一个文件的 ID。

- `has_more: boolean`

  是否有更多文件可用。

- `last_id: string`

  列表中最后一个文件的 ID。

- `object: "list"`

  返回的对象类型，必须为 'list'。

  - `"list"`

### 示例

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "data": [
    {
      "id": "id",
      "bytes": 0,
      "container_id": "container_id",
      "created_at": 0,
      "object": "object",
      "path": "path",
      "source": "source"
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
curl https://api.openai.com/v1/containers/cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04/files \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
    "object": "list",
    "data": [
        {
            "id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
            "object": "container.file",
            "created_at": 1747848842,
            "bytes": 880,
            "container_id": "cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04",
            "path": "/mnt/data/88e12fa445d32636f190a0b33daed6cb-tsconfig.json",
            "source": "user"
        }
    ],
    "first_id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
    "has_more": false,
    "last_id": "cfile_682e0e8a43c88191a7978f477a09bdf5"
}
```

## Retrieve container file

**get** `/containers/{container_id}/files/{file_id}`

检索容器文件

### 路径参数

- `container_id: string`

- `file_id: string`

### Returns

- `id: string`

  文件的唯一标识符。

- `bytes: number`

  文件的大小（以字节为单位）。

- `container_id: string`

  此文件所属的容器。

- `created_at: number`

  文件创建时的 Unix 时间戳（以秒为单位）。

- `object: string`

  此对象的类型（`container.file`).

- `path: string`

  文件在容器中的路径。

- `source: string`

  文件的来源（例如， `user`, `assistant`).

### 示例

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files/$FILE_ID \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
  "id": "id",
  "bytes": 0,
  "container_id": "container_id",
  "created_at": 0,
  "object": "object",
  "path": "path",
  "source": "source"
}
```

### 示例

```http
curl https://api.openai.com/v1/containers/container_123/files/file_456 \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
{
    "id": "cfile_682e0e8a43c88191a7978f477a09bdf5",
    "object": "container.file",
    "created_at": 1747848842,
    "bytes": 880,
    "container_id": "cntr_682e0e7318108198aa783fd921ff305e08e78805b9fdbb04",
    "path": "/mnt/data/88e12fa445d32636f190a0b33daed6cb-tsconfig.json",
    "source": "user"
}
```

## Domain Types

### 文件创建响应

- `FileCreateResponse object { id, bytes, container_id, 4 more }`

  - `id: string`

    文件的唯一标识符。

  - `bytes: number`

    文件的大小（以字节为单位）。

  - `container_id: string`

    此文件所属的容器。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `object: string`

    此对象的类型（`container.file`).

  - `path: string`

    文件在容器中的路径。

  - `source: string`

    文件的来源（例如， `user`, `assistant`).

### 文件列表响应

- `FileListResponse object { id, bytes, container_id, 4 more }`

  - `id: string`

    文件的唯一标识符。

  - `bytes: number`

    文件的大小（以字节为单位）。

  - `container_id: string`

    此文件所属的容器。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `object: string`

    此对象的类型（`container.file`).

  - `path: string`

    文件在容器中的路径。

  - `source: string`

    文件的来源（例如， `user`, `assistant`).

### 文件检索响应

- `FileRetrieveResponse object { id, bytes, container_id, 4 more }`

  - `id: string`

    文件的唯一标识符。

  - `bytes: number`

    文件的大小（以字节为单位）。

  - `container_id: string`

    此文件所属的容器。

  - `created_at: number`

    文件创建时的 Unix 时间戳（以秒为单位）。

  - `object: string`

    此对象的类型（`container.file`).

  - `path: string`

    文件在容器中的路径。

  - `source: string`

    文件的来源（例如， `user`, `assistant`).

# 内容

## 检索容器文件内容

**get** `/containers/{container_id}/files/{file_id}/content`

Retrieve Container File Content

### 路径参数

- `container_id: string`

- `file_id: string`

### 示例

```http
curl https://api.openai.com/v1/containers/$CONTAINER_ID/files/$FILE_ID/content \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 示例

```http
curl https://api.openai.com/v1/containers/container_123/files/cfile_456/content \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### 响应

```json
<binary content of the file>
```
