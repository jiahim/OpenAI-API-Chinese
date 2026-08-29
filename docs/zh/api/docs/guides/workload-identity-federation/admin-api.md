# 通过 Admin API 管理 Codex 工作负载身份

> 完整的文档索引请参见 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

使用组织管理员 API 从基础设施工具或 CI 中管理 Codex 工作负载身份提供方
和联合身份验证规则。该 API 公开了与
OpenAI 管理门户相同的提供方和规则模型。

该 API 在路径和响应对象中调用联合身份验证规则。本页 `mappings` 在路径和响应对象中调用联合身份验证规则。本
页使用 **联合身份验证规则** 来表示该产品概念，并且仅在 `mapping` 仅在它
指代 API 字段或路径时才这样做。

这些端点为托管 ChatGPT 工作区管理 Codex 工作负载身份联合身份验证测试版。要申请访问权限，请联系你的
  OpenAI 代表或
  [OpenAI
  支持](https://help.openai.com/en/articles/6614161-how-can-i-contact-support).
  这些端点不会取代现有的 OpenAI API 工作负载身份
  提供方和服务账户映射 API。

## 前提条件

你需要：

- 已为你的组织启用 workload identity federation 并进行托管
  ChatGPT 工作区。
- 一个 [管理员 API 密钥](https://platform.openai.com/settings/organization/admin-keys)
  其所有者是允许管理工作负载身份的有效管理员。
- 托管 ChatGPT 工作区的 ID。
- 该 OpenAI 用户 ID 对应于该
  工作区中的一个现有有效人类或服务账号。
- 工作负载的 OIDC 令牌或 SPIFFE
  JWT-SVID 的颁发者、受众和声明。

WIF 端点使用资源 ID 而非名称。它们不会列出或创建
ChatGPT workspace 或主体。请从你的资源调配系统中提供这些 ID。
如果不通过编程方式管理这些资源,请使用 OpenAI Admin
控制台来创建或选择主体并连接该工作负载。

在你的环境中设置 Admin API 密钥:

```bash
export OPENAI_ADMIN_KEY="<admin-api-key>"
```

Admin API 密钥是长期凭证。请将密钥存储在密钥管理器中,
不要提交它,也不要将其用于 Codex 运行时的身份验证。

## Endpoints

所有请求均使用 `https://api.openai.com` 以及一个 Admin API 密钥作为 bearer
授权请求头。

| Operation                    | 方法和路径                                                                           |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| 列出提供商               | `GET /v1/organization/workload_identity/providers`                                        |
| 创建提供商            | `POST /v1/organization/workload_identity/providers`                                       |
| 获取提供商               | `GET /v1/organization/workload_identity/providers/{provider_id}`                          |
| 更新或停用提供商 | `POST /v1/organization/workload_identity/providers/{provider_id}`                         |
| 归档提供商           | `DELETE /v1/organization/workload_identity/providers/{provider_id}`                       |
| 列出规则                   | `GET /v1/organization/workload_identity/providers/{provider_id}/mappings`                 |
| 创建规则                | `POST /v1/organization/workload_identity/providers/{provider_id}/mappings`                |
| 获取规则                   | `GET /v1/organization/workload_identity/providers/{provider_id}/mappings/{mapping_id}`    |
| 更新或停用规则     | `POST /v1/organization/workload_identity/providers/{provider_id}/mappings/{mapping_id}`   |
| 归档规则               | `DELETE /v1/organization/workload_identity/providers/{provider_id}/mappings/{mapping_id}` |

List 响应使用 `{ "object": "list", "data": [...] }`。这些端点不使用
分页。

## 创建 OIDC 提供方

为每个需要独立管理的颁发者和信任边界创建一个提供者
。将示例颁发者和受众替换为某个
示例令牌中的实际值。在本地检查令牌的 `iat` 和 `exp` 声明，然后选择一个覆盖该颁发者预期
有效时长的可接受断言有效期。OpenAI 会校验完整的这个时长，而不是令牌的剩余有效期。 `exp - iat`
范围。该公司 会校验完整的这个时长，而不是令牌的剩余有效期。

对于 Microsoft Entra，请勿假设断言有效期为一小时。 [访问令牌有效期
差异较大](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens#token-lifetime),
且 Microsoft 不支持 [配置托管标识令牌
生存期](https://learn.microsoft.com/en-us/entra/identity-platform/configurable-token-lifetimes).
将 `MAX_ASSERTION_LIFETIME_SECONDS` 替换为 1 到
176,400 之间的一个合法整数。该提供方的限制独立于 OpenAI 访问
令牌（由联合身份认证规则颁发）的生存期。

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

默认情况下，OIDC 提供方会在其 issuer URL 上使用发现机制。请使用 `custom_url`
在公共发现文档位于其他位置时， `jwks_uri` for an
显式公共 JWKS URL，或 `jwks_local: true` 使用 `jwks` 上传公共
密钥。不要包含私钥材料。

## 创建 SPIFFE JWT-SVID 提供者

将 `type` 设置为 `spiffe_jwt`，将 `issuer` 设置为规范信任域，并
提供公共 bundle URL 或已上传的 SPIFFE bundle。SPIFFE 规则还
必须设置 `audiences`.

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

对于已上传的 bundle，将 `jwks_local` 设置为 `true`，替换 `jwks_uri` 为
`jwks` 对象，并至少包含一个其 `use` 为 `jwt-svid`.

## 创建联合规则

规则针对一个现有的主体，并可匹配一个或多个外部
工作负载身份。本示例接受一个 Azure 托管身份主体：

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

对于一条规则中允许的多个主体，请省略 `external_subject` 并使用 CEL
条件：

```json
{
  "condition": "assertion.sub in [\"workload-a\", \"workload-b\"]"
}
```

至少设置以下之一 `external_subject`, `claims`，或 `condition`。所有已配置的
身份校验都必须通过。请参阅 [联合规则
参考](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules) 了解基数、CEL、受众、作用域和生命周期行为。
基数、CEL、受众、作用域和生命周期行为。

## 列出并核对资源

在创建提供方之前先列出它们，以便你的自动化可以比较预期的
配置与当前状态：

```bash
curl --fail-with-body --silent --show-error \
  https://api.openai.com/v1/organization/workload_identity/providers \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" | jq .
```

然后列出某个提供方下的规则：

```bash
curl --fail-with-body --silent --show-error \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" | jq .
```

API 没有定义幂等性键合约。请将返回的 ID 存储到你的
已批准的配置状态中，在修改前先读取当前资源，
并通过 ID 进行更新。不要在每次运行时都创建新的资源。

## 更新或禁用资源

更新使用 `POST` 仅包含你想要更改的字段。此示例更改
规则的生存周期：

```bash
curl --fail-with-body --silent --show-error \
  -X POST \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings/$FEDERATION_RULE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"access_token_lifetime_seconds": 300}' | jq .
```

为立即停用而禁用规则：

```bash
curl --fail-with-body --silent --show-error \
  -X POST \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings/$FEDERATION_RULE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"enabled": false}' | jq .
```

将 `enabled` 设置为 `false` 在提供方路径上，停止该提供方下所有规则
。禁用操作会阻止新的交换并撤销已签发
通过该资源访问。你可以在其主体、工作区，
绑定和提供方均处于活动状态后重新启用它。

普通规则编辑仅影响新的交互。编辑前签发的令牌在其
TTL 结束之前仍然有效。提供方信任编辑会在新信任生效之前吊销已签发
的令牌。

## 归档资源

`DELETE` 归档某个 provider 或规则，而不是将其删除。归档操作会阻止新的
交互、撤销已签发的令牌，并使该资源在常规列表结果中不可见，
且不可撤销。

归档规则：

```bash
curl --fail-with-body --silent --show-error \
  -X DELETE \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID/mappings/$FEDERATION_RULE_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY"
```

归档 provider：

```bash
curl --fail-with-body --silent --show-error \
  -X DELETE \
  "https://api.openai.com/v1/organization/workload_identity/providers/$PROVIDER_ID" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY"
```

归档某个 provider 会撤销其 Codex 规则的访问权限。你必须先移除所有
非 Codex 产品的映射，然后才能归档该 provider。此举用于保护现有的
OpenAI API 工作负载身份配置。

## Provider fields

Create requires `name` 和 `issuer`。Update 接受除
`type`.

| 字段                            | 类型与行为                                                                                                |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `name`                           | 非空显示名称。                                                                                          |
| `type`                           | `oidc` 默认为 `spiffe_jwt`。创建后无法更改。                                         |
| `issuer`                         | 精确的 OIDC `iss` URL 或规范的 SPIFFE 信任域。                                                           |
| `audience`                       | 可选的提供方级受众。当此项缺失时设置规则受众。                                       |
| `description`                    | 可选的管理员描述。                                                                              |
| `custom_url`                     | 可选的公共 HTTPS OIDC 发现 URL。仅限 OIDC。                                                             |
| `jwks_uri`                       | 可选的公共 HTTPS JWKS 或 SPIFFE bundle URL。                                                                 |
| `jwks_local`                     | 设置为 `true` 当提供 `jwks`.                                                                             |
| `jwks`                           | 已上传的公共 JWKS 对象，最多 100 个密钥，大小不超过 1 MiB。                                                           |
| `custom_ca_certificate`          | JWKS HTTPS 可选的 PEM CA 捆绑包，最大 256 KiB。                                                            |
| `attribute_conditions`           | 在规则匹配之前应用的可选有界 CEL 条件。使用 `assertion` 获取已验证的声明。            |
| `max_assertion_lifetime_seconds` | 接受的上游断言生命周期，范围为 1 到 176,400 秒。OIDC 使用完整的 `exp - iat`。默认值：3,600。 |
| `check_jti`                      | 当 `true`，拒绝重复的非空 JWT `jti`。默认值： `false`.                                            |
| `enabled`                        | 仅用于更新的开关，用于接受或阻止交换。                                                             |

Discovery 与显式或上传的密钥是其他可选的验证模式。
Issuer、discovery 和 JWKS URL 的验证要求详见
[workload identity 概述](https://developers.openai.com/api/docs/guides/workload-identity-federation#manage-jwks-and-key-rotation).

## 联合规则字段

Create requires `workspace_id` 和 `principal_id`，以及至少一个身份
检查。创建后无法更改工作区或主体。

| 字段                           | 类型与行为                                                                                    |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `workspace_id`                  | 已有的托管 ChatGPT 工作区 ID。仅创建时可设置。                                                  |
| `principal_id`                  | 工作区中已有的活跃 OpenAI 用户或服务账号 ID。仅创建时可设置。                     |
| `external_subject`              | Exact `sub` 或一个结尾-`*` 前缀，最多 4,096 字节。                                           |
| `claims`                        | 最多 32 个精确的顶级标量声明。不包含 `sub`.                                        |
| `audiences`                     | 1 到 32 个唯一已接受的受众。对于 SPIFFE 以及提供者没有受众的情况为必填。 |
| `condition`                     | 针对的有限 CEL 布尔条件 `assertion`，最多 16 KiB。                                        |
| `scopes`                        | 四个支持的 Codex 作用域的可选子集。省略则使用默认集合。                     |
| `access_token_lifetime_seconds` | 60 到 3,600 秒。默认值：3,600。                                                            |
| `name`                          | 可选的显示名称。                                                                               |
| `description`                   | 可选的管理员描述。                                                                  |
| `enabled`                       | 规则是否接受 exchanges。默认值： `true`.                                                 |

Provider 响应使用 `workload_identity_provider`；规则响应使用
`workload_identity_mapping`。两者都包含 `id`, `enabled`, `created_at`，以及
`updated_at`。时间戳为 Unix 秒。

## 限制与错误

一个组织最多可以有 50 个未归档的提供商。一个提供商最多可以拥有
50 个未归档的规则。API 返回：

- `400` 针对请求字段错误、提供方信任设置、规则条件、范围，或
  非活动的主体成员资格。
- `403` 当 Admin API 密钥所有者无法管理工作负载标识时。
- `404` 当组织没有租户关联，或所请求的
  资源位于组织和租户边界之外。
- `409` 针对提供方或规则限制、主体冲突、非活动绑定，或
  生命周期冲突。

将 `404` 视为非披露：该服务不会暴露由其他组织或租户拥有的提供方或规则
。对临时性响应进行重试，每次尝试后逐步增加延迟。除非更改请求或管理员 `429` 和 `5xx`
状态，否则不要对校验或权限错误进行重试
后再次发起请求。
状态。