# Workload identity token exchange

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

使用本参考文档，可在配置可信提供方和服务账号映射之后，将外部签发的身份令牌交换为短期OpenAI访问令牌。本文档还会介绍 X.509 证书交换。相关概念、面板配置和设置指南，请参阅 [工作负载身份联合指南](https://developers.openai.com/api/docs/guides/workload-identity-federation).

## 交换 JWT 主体令牌

在 OpenAI 令牌端点处交换外部主体令牌：

```bash
curl https://auth.openai.com/oauth/token \
  -H "Content-Type: application/json" \
  -d '{
    "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
    "subject_token_type": "urn:ietf:params:oauth:token-type:jwt",
    "subject_token": "'"$EXTERNAL_OIDC_JWT"'",
    "identity_provider_id": "'"$IDENTITY_PROVIDER_ID"'",
    "service_account_id": "'"$SERVICE_ACCOUNT_ID"'"
  }'
```

### 请求参数

| 参数              | 必填 | 说明                                                                                      |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `grant_type`           | 是      | 必须为 `urn:ietf:params:oauth:grant-type:token-exchange`.                                       |
| `subject_token_type`   | 是      | 支持 `urn:ietf:params:oauth:token-type:jwt` 和 `urn:ietf:params:oauth:token-type:id_token`. |
| `subject_token`        | 是      | 来自你的工作负载身份提供商的外部签发的 OIDC JWT 或 SPIFFE JWT-SVID。          |
| `identity_provider_id` | 是      | 为外部签发方配置的 OpenAI 工作负载身份提供商 ID。                     |
| `service_account_id`   | 是      | 需要针对匹配的服务账号映射进行解析的 OpenAI 服务账号 ID。           |

令牌交换使用在匹配的服务账号映射上配置的权限。A `scope` 请求体中的值不会授予访问权限。

## 交换 X.509 证书

在与专用 X.509 令牌端点进行 TLS 协商时出示客户端证书。不要在请求正文中包含 `subject_token` 。

有关提供方和服务账户映射配置，请参阅 [X.509 证书配置指南](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509)。有关证书要求、激活、mTLS 主机、CEL 过滤器以及轮换，请参阅 [双向 TLS 指南](https://developers.openai.com/api/docs/guides/mutual-tls).

```bash
curl --cert "$OPENAI_MTLS_CERT_CHAIN" \
  --key "$OPENAI_MTLS_KEY" \
  --request POST "https://mtls.auth.openai.com/oauth/token" \
  --header "Content-Type: application/json" \
  --data @- <<JSON
{
  "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
  "subject_token_type": "urn:openai:params:oauth:token-type:x509",
  "identity_provider_id": "${OPENAI_IDENTITY_PROVIDER_ID}",
  "service_account_id": "${OPENAI_SERVICE_ACCOUNT_ID}"
}
JSON
```

### X.509 请求参数

| 参数              | 必填 | 说明                                                                                          |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `grant_type`           | 是      | 必须为 `urn:ietf:params:oauth:grant-type:token-exchange`.                                           |
| `subject_token_type`   | 是      | 必须为 `urn:openai:params:oauth:token-type:x509`.                                                   |
| `identity_provider_id` | 是      | OpenAI X.509 工作负载身份提供方 ID。                                                      |
| `service_account_id`   | 是      | 要针对该提供方的服务账号映射进行解析的 OpenAI 服务账号 ID。            |
| `subject_token`        | 否       | 省略此参数。OpenAI 仅通过已认证的 TLS 连接获取证书身份。 |

X.509 端点仅接受完全匹配的 `POST /oauth/token` 请求，其他方法和路径会返回 HTTP `mtls.auth.openai.com`。 `403`.

## 身份验证

### JWT subject token 验证

OpenAI 在解析映射之前会验证外部 subject token。该 token 必须满足：

- 是一个 JWT，包含一个 `kid` 并且支持 `alg` 在请求头中。
- 包含 `iss`, `aud`, `sub`, `exp`，和 `iat` 声明。
- 与已配置的 Workload Identity Provider 颁发者（issuer）和受众（audience）匹配。
- 由配置的 JWKS 源中的某个密钥签名。

如果验证失败，token 交换会返回身份验证错误，并且不会生成 OpenAI 访问令牌。

在主体令牌验证成功后，OpenAI 会根据令牌的原始声明和派生属性解析所请求的服务账户映射。如果映射不匹配，则 token 交换会在映射解析阶段失败。

### X.509 证书验证

OpenAI 会在已解析的组织和项目上下文中，根据当前生效的 Mutual TLS 根证书对客户端证书进行校验。客户端必须提供建立证书链所需的任何中间证书。OpenAI 不会从证书 URL 拉取缺失的中间证书。

在校验证书期间，OpenAI 会应用与当前 Mutual TLS 根证书一同配置的证书准入规则。校验通过后，OpenAI 会评估提供方的 **属性条件**，推导其 `openai.*` 属性，并为所请求的服务账号解析出恰好一条已启用的映射。X.509 提供方必须推导出一个非空的 `openai.subject` 值。

证书材料格式错误或缺失、证书链无效、根证书不匹配、证书超出有效期，或被 Mutual TLS 证书准入规则拒绝时，将返回 `invalid_subject_token`。被提供方的 **属性条件** 表达式拒绝时，将返回 `invalid_grant`。其他提供方、映射或当前根证书相关的配置错误也会返回 `invalid_grant`。X.509 请求绝不会回退到 OIDC 或其他 OAuth 流程。

## Response

成功响应包含一个短期 bearer token：

```json
{
  "access_token": "eyJ...",
  "issued_token_type": "urn:ietf:params:oauth:token-type:access_token",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "api.model.read api.model.request"
}
```

该 `scope` 属性仅在已解析的映射具有权限时返回。访问令牌最多在一小时后过期。JWT 交换令牌的存续时间绝不会超过其外部主体令牌，X.509 交换令牌的存续时间也绝不会超过已验证的客户端证书。令牌交换不返回刷新令牌。

该 `expires_in` 值为 `3600` 仅供示例说明。当已验证的客户端证书更早到期时，返回的存续时间可能更短。

## 令牌交换错误

如果令牌交换失败，OpenAI 不会签发访问令牌。常见原因包括：

| 错误类别                 | 常见原因                                                                                                                                                                                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 缺少 JWT 请求参数  | `subject_token`, `subject_token_type`, `identity_provider_id`，或 `service_account_id` 在 JWT 交换中缺失。                                                                                                                               |
| 不支持的令牌请求      | `subject_token_type` 不是受支持的 JWT 类型或 X.509 令牌类型，或者该请求使用了在该模式下不被接受的字段。                                                                                                              |
| 身份提供者解析错误      | Workload Identity Provider ID 格式无效、未知、已禁用，或与所请求的交换模式不兼容。                                                                                                                                 |
| JWT 主体令牌验证 | JWT 格式无效，缺少头部 `kid` 或 `alg`，算法不受支持，签名无效，签发者或受众不匹配，缺少必需的声明，令牌已过期，或没有 JWKS 密钥与该令牌匹配 `kid`. |
| X.509 证书验证 | 客户端证书缺失或格式无效，所提交的证书链未到达有效的根证书，证书不在有效期内，或不满足配置的证书规则。                                                 |
| 映射解析             | 所请求的服务账号不存在对应的映射，匹配的映射已禁用，身份属性与映射不匹配，或属性转换失败。                                                                        |

大多数主体令牌问题可以通过在本地解码 JWT 有效负载并将其与你的 Workload Identity Provider 及服务账号映射配置进行比较来发现 `iss`, `aud`, `sub`, `exp`, `iat`，以及提供商特定的声明（claims）。

如果令牌交换成功，但后续的 OpenAI API 请求失败，请将已签发的访问令牌作为授权问题进行调试。该令牌仍会受到项目、服务账号、端点授权、IP 白名单以及其他适用于普通 OpenAI API 请求的策略检查。X.509 工作负载还必须随请求一起发送一份被接受的客户端证书 `mtls.api.openai.com` 到 API 请求上。

## Authorization behavior

Workload identity access tokens are backed by an OpenAI service account and project. On OpenAI API surfaces, they authorize like service-account API credentials rather than user OAuth tokens.

If a mapping defines permissions, those permissions further narrow the effective API access for tokens minted from that mapping. If a mapping doesn't define permissions, OpenAI doesn't add a workload identity federation-specific scope restriction, and authorization is derived from the mapped service account's project and organization roles.

Workload identity tokens don't bypass normal endpoint authorization. The target endpoint must still allow the effective permissions and project access carried by the token.

For X.509 exchanges, the bearer token replaces the API key, not the client certificate. The bearer and API mTLS certificate are verified independently. The bearer isn't certificate-bound and doesn't use DPoP or a `cnf` claim.

## 限制

工作负载身份联合目前存在以下限制：

- Workload identity 访问令牌无法用于调用 Admin API 端点。对于 Admin API，请使用 admin API key。
- 每个组织最多可以创建 50 个 Workload Identity Provider。每个 Workload Identity Provider 最多可以有 50 个服务账号映射。
- 这些端点不接受 Workload identity 访问令牌： `DELETE /v1/models/{id}` 以及 `POST /v1/images/request_audit`.
- 除在 [设置指南](https://developers.openai.com/api/docs/guides/workload-identity-federation) 中记录的 provider 之外的其他任意 OIDC issuer 端点。
- X.509 Workload Identity Provider 复用活动的 Mutual TLS 根证书，没有单独的证书信任存储。
- X.509 证书交换不执行证书吊销列表 (CRL) 或 OCSP 检查。
- SPIFFE 支持仅限于 JWT-SVID subject token。此令牌交换端点不支持 X.509-SVID。