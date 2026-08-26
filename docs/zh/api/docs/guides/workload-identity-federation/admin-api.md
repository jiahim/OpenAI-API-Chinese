# 使用管理API管理 Codex 工作负载身份

> 有关完整的文档索引，请参见 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

使用组织管理员API从基础设施工具或 CI 管理 Codex 工作负载身份提供程序和
联合规则。该API公开了与
OpenAI 管理门户相同的提供程序和规则模型。

该API在路径和响应对象中调用联合规则 `mappings` 。本
页使用 **联合规则** 来表示产品概念，并且 `mapping` 仅当其
指代API字段或路径时才使用。

这些端点管理托管
  ChatGPT 工作区的 Codex 工作负载身份联合测试版。要请求访问权限，请联系你的OpenAI代表或
  [OpenAI
  支持](https://help.openai.com/en/articles/6614161-how-can-i-contact-support).
  这些端点不会取代现有的OpenAI API工作负载身份
  提供程序和服务账户映射API。

## 先决条件

你需要：

- 已为你的组织启用工作负载身份联合，并由托管
  ChatGPT 工作区管理。
- 一个 [管理员 API 密钥](https://platform.openai.com/settings/organization/admin-keys)
  其所有者是允许管理工作负载身份的活跃管理员。
- 托管 ChatGPT 工作区的 ID。
- 该工作区中现有的活跃人类或服务账号的 OpenAI 用户 ID
  。
- 工作负载的 OIDC 令牌或 SPIFFE 的签发者、受众和声明
  JWT-SVID。

WIF 端点使用资源 ID 而非名称。它们不会列出或创建
ChatGPT 工作区或主体。请从你的预置系统中提供这些 ID。
如果你不通过编程方式管理这些资源，请使用 OpenAI Admin
门户创建或选择主体并连接该工作负载。

在你的环境中设置 Admin API 密钥：

```bash
export OPENAI_ADMIN_KEY="<admin-api-key>"
```

Admin API 密钥是长期凭证。请将密钥存储在密钥管理器中，
不要将其提交到代码库，也不要将其用于 Codex 运行时身份验证。

## 端点

所有请求均使用 `https://api.openai.com` ，并在 Bearer 授权头中携带 Admin API 密钥
。

| 操作                    | 方法和路径                                                                           |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| 列出 provider               | `GET /v1/organization/workload_identity/providers`                                        |
| 创建 provider            | `POST /v1/organization/workload_identity/providers`                                       |
| 获取 provider               | `GET /v1/organization/workload_identity/providers/{provider_id}`                          |
| 更新或禁用 provider | `POST /v1/organization/workload_identity/providers/{provider_id}`                         |
| 归档 provider           | `DELETE /v1/organization/workload_identity/providers/{provider_id}`                       |
| 列出规则                   | `GET /v1/organization/workload_identity/providers/{provider_id}/mappings`                 |
| 创建规则                | `POST /v1/organization/workload_identity/providers/{provider_id}/mappings`                |
| 获取规则                   | `GET /v1/organization/workload_identity/providers/{provider_id}/mappings/{mapping_id}`    |
| 更新或禁用规则     | `POST /v1/organization/workload_identity/providers/{provider_id}/mappings/{mapping_id}`   |
| 归档规则               | `DELETE /v1/organization/workload_identity/providers/{provider_id}/mappings/{mapping_id}` |

列表响应使用 `{ "object": "list", "data": [...] }`。这些端点不
使用分页。

## 创建 OIDC 提供方

为每个要独立管理的签发方和信任边界创建一个提供方。
将示例签发方和受众替换为来自
样例令牌的准确值。检查令牌的 `iat` 和 `exp` 声明，然后选择能够覆盖签发方预期
范围的 `exp - iat`
可接受断言生命周期。OpenAI 检查的是完整持续时间，而非令牌剩余的有效期。

对于 Microsoft Entra，不要假设断言的有效期为一个小时。 [访问令牌生命周期
各不相同，](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens#token-lifetime),
且 Microsoft 不支持 [配置托管标识令牌
生命周期](https://learn.microsoft.com/en-us/entra/identity-platform/configurable-token-lifetimes).
将 `MAX_ASSERTION_LIFETIME_SECONDS` 替换为 1 到
176,400 之间的已批准整数。此提供方限制与 OpenAI 访问权限
令牌的生命周期是分开的，后者由联合规则颁发。

```bash
MAX_ASSERTION_LIFETIME_SECONDS="<accepted-issuer-lifetime-seconds>"

jq -n \
  --argjson max_assertion_lifetime_seconds "$MAX_ASSERTION_LIFETIME_SECONDS" \
  '{
    name: "entra-production",
    type: "oidc",
    issuer: "https://login.microsoftonline.com/00000000-0000-0000-0000-000000000000/v2.0",
    audience: "api://openai-codex-production",
    description: "Production Codex workloads in Microsoft Azure",
    max_assertion_lifetime_seconds: $max_assertion_lifetime_seconds,
    check_jti: true
  }' > provider.json

curl --fail-with-body --silent --show-error \
  https://api.openai.com/v1/organization/workload_identity/providers \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  --data @provider.json \
  --output provider-response.json

PROVIDER_ID="$(jq -r .id provider-response.json)"
printf 'Created provider %s\n' "$PROVIDER_ID"
```

预期输出以身份提供方 ID 开头：

```text
Created provider idp_...
```

默认情况下，OIDC 提供方在其签发方 URL 处使用发现机制。当公共发现文档位于其他位置时，使用 `custom_url`
。 `jwks_uri` 用于
显式公共 JWKS URL，或 `jwks_local: true` 使用 `jwks` 上传公共
密钥。不要包含私钥材料。

## 创建 SPIFFE JWT-SVID 提供程序

设置 `type` 为 `spiffe_jwt`, 设置 `issuer` 为规范信任域，并且
提供公共包 URL 或上传的 SPIFFE 包。SPIFFE 规则
还必须设置 `audiences`.

```json
{
  "name": "spiffe-production",
  "type": "spiffe_jwt",
  "issuer": "spiffe://example.com",
  "jwks_uri": "https://spiffe.example.com/bundle.json",
  "max_assertion_lifetime_seconds": 3600,
  "check_jti": true
}
```

对于上传的包，设置 `jwks_local` 为 `true`, 将 `jwks_uri` 替换为
`jwks` 对象，并且至少包含一个公钥，其 `use` 为 `jwt-svid`.

## 创建联邦规则

规则针对一个现有主体，并且可以匹配一个或多个外部
工作负载身份。此示例接受一个 Azure 托管身份主体：

```bash
export WORKSPACE_ID="<managed-chatgpt-workspace-id>"
export PRINCIPAL_ID="<existing-openai-user-id>"

jq -n \
  --arg workspace_id "$WORKSPACE_ID" \
  --arg principal_id "$PRINCIPAL_ID" \
  '{
    name: "entra-payments-production",
    description: "Production payments workload",
    workspace_id: $workspace_id,
    principal_id: $principal_id,
    external_subject: "11111111-2222-3333-4444-555555555555",
    audiences: ["api://openai-codex-production"],
    access_token_lifetime_seconds: 600,
    enabled: true
  }' > rule.json

curl --fail-with-body --silent --show-error \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  --data @rule.json \
  --output rule-response.json

FEDERATION_RULE_ID="$(jq -r .id rule-response.json)"
printf 'Created federation rule %s\n' "$FEDERATION_RULE_ID"
```

预期输出以映射 ID 开头。这是 Codex 用作
`OPENAI_FEDERATION_RULE_ID`:

```text
Created federation rule idpm_...
```

对于单条规则中的一组允许主体，省略 `external_subject` 并使用 CEL
条件：

```json
{
  "condition": "assertion.sub in [\"workload-a\", \"workload-b\"]"
}
```

至少设置以下之一 `external_subject`, `claims`，或 `condition`。所有配置的
身份检查必须通过。参见 [联合规则
参考](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules) 以了解
基数、CEL、受众、范围和生存期行为。

## 列出并核对资源

在创建提供程序之前先列出已有的提供程序，以便你的自动化能够将预期的
配置与当前状态进行比较：

```bash
curl --fail-with-body --silent --show-error \
  https://api.openai.com/v1/organization/workload_identity/providers \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" | jq .
```

然后，在提供程序下列出规则：

```bash
curl --fail-with-body --silent --show-error \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" | jq .
```

API 未定义幂等键契约。将返回的 ID 存储在你的
已批准的配置状态中，在更改资源前先读取当前资源，
并按 ID 更新。不要每次运行时都创建替换项。

## 更新或禁用资源

更新使用 `POST` 且只包含你想更改的字段。以下示例更改
规则的生存时间：

```bash
curl --fail-with-body --silent --show-error \
  -X POST \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings/$FEDERATION_RULE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"access_token_lifetime_seconds": 300}' | jq .
```

禁用规则以立即停止：

```bash
curl --fail-with-body --silent --show-error \
  -X POST \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings/$FEDERATION_RULE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}' | jq .
```

设置 `enabled` 为 `false` 位于提供程序路径上，以停止该
提供程序下的所有规则。禁用会阻止新交换，并撤销通过该资源发放的访问令牌
。在其主体、工作区、
绑定和提供程序均处于活动状态后，你可以重新启用它。

普通规则编辑仅影响新交换。编辑前发放的令牌可以
在 TTL 到期前保持有效。提供程序信任编辑会在新信任生效前撤销已发放的令牌
。

## 归档资源

`DELETE` 归档提供方或规则而不是将其删除。归档会阻止新的
交换、撤销已颁发的令牌、将资源从普通列表结果中隐藏，
并且无法撤销。

归档规则：

```bash
curl --fail-with-body --silent --show-error \
  -X DELETE \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings/$FEDERATION_RULE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY"
```

归档提供方：

```bash
curl --fail-with-body --silent --show-error \
  -X DELETE \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY"
```

归档提供方会撤销其 Codex 规则的访问权限。你必须先移除任何
非 Codex 产品映射，然后才能归档该提供方。这可以保护
现有的 OpenAI API 工作负载身份配置。

## 提供方字段

创建需要 `name` 和 `issuer`。更新接受除
`type`.

| 字段                            | 类型和行为                                                                                                |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `name`                           | 非空显示名称。                                                                                          |
| `type`                           | `oidc` 默认情况下，或 `spiffe_jwt`。创建后无法更改。                                         |
| `issuer`                         | 精确的 OIDC `iss` URL 或规范的 SPIFFE 信任域。                                                           |
| `audience`                       | 可选的服务商级受众。当此项缺失时，设置规则受众。                                       |
| `description`                    | 可选的管理员描述。                                                                              |
| `custom_url`                     | 可选的公共 HTTPS OIDC 发现 URL。仅限 OIDC。                                                             |
| `jwks_uri`                       | 可选的公共 HTTPS JWKS 或 SPIFFE 捆绑包 URL。                                                                 |
| `jwks_local`                     | 设置为 `true` 时提供 `jwks`.                                                                             |
| `jwks`                           | 上传的公共 JWKS 对象，最多 100 个密钥和 1 MiB。                                                           |
| `custom_ca_certificate`          | 可选的 PEM CA 捆绑包，用于 JWKS HTTPS，最大 256 KiB。                                                            |
| `attribute_conditions`           | 可选的有限 CEL 条件，在规则匹配前应用。使用 `assertion` 获取已验证的声明。            |
| `max_assertion_lifetime_seconds` | 可接受的上游断言有效期，1 至 176,400 秒。OIDC 使用完整的 `exp - iat`。默认值：3,600。 |
| `check_jti`                      | 当 `true`，则拒绝重复的非空 JWT `jti`。默认值： `false`.                                            |
| `enabled`                        | 仅更新开关，用于接受或阻止交换。                                                             |

发现以及显式或上传的密钥是替代的验证模式。
签发者、发现和 JWKS URL 的验证要求在
[工作负载身份概述](https://developers.openai.com/api/docs/guides/workload-identity-federation#manage-jwks-and-key-rotation).

## 联邦规则字段

创建需要 `workspace_id` 和 `principal_id`，以及至少一个身份
检查。创建后无法更改工作区或主体。

| 字段                           | 类型和行为                                                                                    |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `workspace_id`                  | 现有受管理的 ChatGPT 工作区 ID。仅创建时设置。                                                  |
| `principal_id`                  | 工作区中现有的活跃 OpenAI 用户或服务账户 ID。仅创建时设置。                     |
| `external_subject`              | 精确 `sub` 或一个尾部-`*` 前缀，最长 4,096 字节。                                           |
| `claims`                        | 最多 32 个精确的顶层标量声明。不要包含 `sub`.                                        |
| `audiences`                     | 1 到 32 个唯一接受的受众。对于 SPIFFE 以及提供方没有受众时是必需的。 |
| `condition`                     | 有界的 CEL 布尔条件，作用于 `assertion`，最长 16 KiB。                                        |
| `scopes`                        | 四个受支持的 Codex 作用域的可选子集。省略以使用默认集。                     |
| `access_token_lifetime_seconds` | 60 到 3,600 秒。默认值：3,600。                                                            |
| `name`                          | 可选显示名称。                                                                               |
| `description`                   | 可选管理员描述。                                                                  |
| `enabled`                       | 规则是否接受交换。默认值： `true`.                                                 |

提供方响应使用 `workload_identity_provider`；规则响应使用
`workload_identity_mapping`。两者都包含 `id`, `enabled`, `created_at`，且
`updated_at`。时间戳为 Unix 秒。

## 限制与错误

一个组织最多可以有 50 个未归档的提供商。一个提供商最多可以有
50 个未归档的规则。API 返回：

- `400` 用于请求字段错误、提供方信任设置、规则条件、作用域或
  非活跃主体成员资格。
- `403` 当 Admin API 密钥所有者无法管理工作负载身份时。
- `404` 当组织没有租户关联或请求的
  资源超出组织和租户边界时。
- `409` 用于提供方或规则限制、主体冲突、非活跃绑定或
  生命周期冲突。

将 `404` 视为非披露性：服务不会揭示由另一组织或租户拥有的提供方或规则
。对于瞬时 `429` 以及 `5xx`
响应，请使用有界延迟进行重试，每次尝试后延迟递增。不要在没有更改请求或管理员
状态的情况下重试验证或权限错误
。