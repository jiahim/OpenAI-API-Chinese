> 完整文档索引请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾添加 `.md` 可获取该页面的 Markdown 版本。

## 创建容器

**post** `/containers`

Create Container

### 正文参数

- `name: string`

  要创建的容器名称。

- `expires_after: optional object { anchor, minutes }`

  容器过期时间（秒），相对于“anchor”时间计算。

  - `anchor: "last_active_at"`

    过期时间的时间锚点。目前仅支持 “last_active_at”。

    - `"last_active_at"`

  - `minutes: number`

- `file_ids: optional array of string`

  要复制到容器中的文件 ID。

- `memory_limit: optional "1g" or "4g" or "16g" or "64g"`

  容器的可选内存限制。默认为 “1g”。

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

      仅允许向指定域发出站网络访问。始终 `allowlist`.

      - `"allowlist"`

    - `domain_secrets: optional array of ContainerNetworkPolicyDomainSecret`

      允许列表中域的可选域作用域密钥。

      - `domain: string`

        与该密钥关联的域。

      - `name: string`

        为该域注入的密钥名称。

      - `value: string`

        为该域注入的密钥值。

- `skills: optional array of SkillReference or InlineSkill`

  通过 id 或内联数据引用的可选技能列表。

  - `SkillReference object { skill_id, type, version }`

    - `skill_id: string`

      所引用技能的 ID。

    - `type: "skill_reference"`

      引用通过 /v1/skills 端点创建的技能。

      - `"skill_reference"`

    - `version: optional string`

      可选的技能版本。使用正整数或 “latest”。省略以使用默认值。

  - `InlineSkill object { description, name, source, type }`

    - `description: string`

      技能的描述。

    - `name: string`

      技能的名称。

    - `source: InlineSkillSource`

      内联技能负载

      - `data: string`

        Base64 编码的 skill zip 包。

      - `media_type: "application/zip"`

        内联 skill 负载的媒体类型。必须是 `application/zip`.

        - `"application/zip"`

      - `type: "base64"`

        内联 skill 源的类型。必须是 `base64`.

        - `"base64"`

    - `type: "inline"`

      为本次请求定义一个内联 skill。

      - `"inline"`

### 返回

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
  锚点是过期时间的参考点。
  minutes 是容器过期前相对于锚点的分钟数。

  - `anchor: optional "last_active_at"`

    过期时间的参考点。

    - `"last_active_at"`

  - `minutes: optional number`

    容器过期前相对于锚点的分钟数。

- `last_active_at: optional number`

  容器最近一次活跃时的 Unix 时间戳（以秒为单位）。

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

    当网络策略模式为 `type` 为 `allowlist`.

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
