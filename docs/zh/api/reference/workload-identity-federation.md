# 工作负载身份令牌交换

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过追加 `.md` 到页面 URL 获取。

在配置可信提供方和服务账号映射后，使用此参考将外部颁发的身份令牌交换为短时效 OpenAI 访问令牌。它还介绍了 X.509 证书交换。有关概念、仪表板配置和设置指南，请参阅 [工作负载身份联合指南](https://developers.openai.com/api/docs/guides/workload-identity-federation).

## 交换 JWT 主体令牌

在 OpenAI 令牌端点交换外部 subject 令牌：

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
| `subject_token`        | 是      | 由你的工作负载身份提供商颁发的外部 OIDC JWT 或 SPIFFE JWT-SVID。          |
| `identity_provider_id` | 是      | 为外部颁发方配置的 OpenAI 工作负载身份提供商 ID。                     |
| `service_account_id`   | 是      | 要与对应服务账号映射进行解析的 OpenAI 服务账号 ID。           |

令牌交换使用在匹配的服务账号映射上配置的权限。 `scope` 请求体中的值不会授予访问权限。

## 交换 X.509 证书

在与专用 X.509 令牌端点进行 TLS 协商时出示客户端证书。不要在 `subject_token` 请求正文中包含。

有关提供商和服务账号映射配置，请参阅 [X.509 证书设置指南](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509). 有关证书要求、激活方式、mTLS 主机、CEL 过滤器以及证书轮换，请参阅 [Mutual TLS 指南](https://developers.openai.com/api/docs/guides/mutual-tls).

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
| `identity_provider_id` | 是      | OpenAI X.509 Workload Identity Provider ID。                                                      |
| `service_account_id`   | 是      | 针对该提供者的服务账号映射进行解析的 OpenAI 服务账号 ID。            |
| `subject_token`        | 否       | 省略此参数。OpenAI 仅从已认证的 TLS 连接中获取证书身份。 |

X.509 端点仅接受精确 `POST /oauth/token` 请求。其他方法和路径返回 HTTP `mtls.auth.openai.com`。 `403`.

## 身份验证

### JWT subject token 验证

OpenAI 会在解析映射之前验证外部主体令牌。该令牌必须满足以下条件：

- 使用以下格式的 JWT，并且 `kid` 受支持 `alg` 在 header 中。
- 包含 `iss`, `aud`, `sub`, `exp`，以及 `iat` 声明。
- 与配置的 Workload Identity Provider 的 issuer 和 audience 一致。
- 由配置的 JWKS 来源中的密钥签名。

如果验证失败，token 交换会返回身份验证错误，并且不会生成 OpenAI 访问令牌。

在主体 token 验证成功之后，OpenAI 会根据 token 的原始声明和派生属性解析所请求的服务账号映射。映射不匹配会导致 token 交换在映射解析阶段失败。

### X.509 证书验证

OpenAI 在解析后的组织和项目上下文中，针对当前生效的 Mutual TLS 根证书验证客户端证书。客户端必须提供建立证书链所需的任何中间证书。OpenAI 不会从证书 URL 中获取缺失的中间证书。

在证书验证期间，OpenAI 会应用与当前生效的 Mutual TLS 根证书一起配置的证书准入规则。验证成功后，OpenAI 会评估提供方的 **属性条件**，派生其 `openai.*` 属性，并为所请求的服务账号解析出恰好一个已启用的映射。X.509 提供方必须派生出一个非空的 `openai.subject` 值。

证书材料格式错误或缺失、证书链无效、根证书不匹配、证书不在有效期内，或被 Mutual TLS 证书准入规则拒绝时，将返回 `invalid_subject_token`。被提供方的 **属性条件** 表达式拒绝时，将返回 `invalid_grant`。其他提供方、映射或当前根证书配置失败也会返回 `invalid_grant`。X.509 请求绝不会回退到 OIDC 或其他 OAuth 流程。

## Response

成功的响应中包含一个短时效的 bearer 令牌：

```json
{
  "access_token": "eyJ...",
  "issued_token_type": "urn:ietf:params:oauth:token-type:access_token",
  "token_type": "Bearer",
  "expires_in": 3600,
  "expires_at": 1789045200,
  "scope": "api.model.read api.model.request"
}
```

响应中针对 JWT 和 X.509 交换均包含以下过期时间字段：

| 字段        | 类型    | 说明                                                                                                                                        |
| ------------ | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `expires_in` | 整数 | 访问令牌的生存时间（以秒为单位），自签发起算（`iat`）。处理或交付响应所耗费的时间会占用此生存时间的一部分。 |
| `expires_at` | 整数 | 绝对过期时间，以 Unix 时间戳表示，单位为秒，自 1970 年 1 月 1 日 00:00:00 UTC 起算。该值等于已签发访问令牌的 `exp` 声明。           |

该 `scope` 该属性仅在解析后的映射具有权限时返回。访问令牌最多一小时后过期。JWT 交换令牌的生命周期不会超过其外部主体令牌，X.509 交换令牌的生命周期不会超过已验证的客户端证书。令牌交换不会返回刷新令牌。

示例中的过期时间仅作说明。返回的生命周期可能更短，具体取决于外部主体令牌或已验证的客户端证书何时过期。如需安排另一次交换，请参阅 [令牌续签指南](https://developers.openai.com/api/docs/guides/workload-identity-federation#renew-the-access-token).

## Token exchange errors

如果令牌交换失败，OpenAI 不会签发访问令牌。常见原因包括：

| 错误类别                 | 典型原因                                                                                                                                                                                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 缺少 JWT 请求参数  | `subject_token`, `subject_token_type`, `identity_provider_id`，或 `service_account_id` 在 JWT 交换中缺失。                                                                                                                               |
| 不支持的令牌请求      | `subject_token_type` 不是受支持的 JWT 类型或 X.509 令牌类型，或者请求使用了该模式不接受字段。                                                                                                              |
| 提供方解析错误      | Workload Identity Provider ID 格式错误、未知、被禁用，或与所请求的交换模式不兼容。                                                                                                                                 |
| JWT 主体令牌验证 | JWT 格式错误，标头缺少 `kid` 或 `alg`，算法不受支持，签名无效，签发者或受众不匹配，缺少必需的声明，令牌已过期，或没有 JWKS 密钥与该令牌匹配 `kid`. |
| X.509 证书验证 | 客户端证书缺失或格式错误，所提交的证书路径未到达有效根证书，证书不在有效期内，或不满足配置的证书规则。                                                 |
| 映射解析             | 所请求的服务账号不存在映射，匹配的映射已禁用，身份属性与映射不匹配，或属性转换失败。                                                                        |

大多数主体令牌问题可以通过在本地解码 JWT 负载并将其 `iss`, `aud`, `sub`, `exp`, `iat`，与你的 Workload Identity Provider 和服务账号映射配置中的提供商特定声明进行比较来发现。

如果令牌交换成功，但后续的 OpenAI API 请求失败，请将已生成的访问令牌视为授权问题进行调试。该令牌仍然受到适用于普通 OpenAI API 请求的项目、服务账号、端点授权、IP 白名单以及其他策略检查。X.509 工作负载还必须随请求发送一个被接受的客户端证书， `mtls.api.openai.com` 在 API 请求上发送。

## 授权行为

工作负载身份访问令牌由 OpenAI 服务账号和项目提供支持。在 OpenAI API 接口上,它们的授权方式与服务账号 API 凭据类似,而非用户 OAuth 令牌。

如果映射定义了权限,这些权限会进一步收窄基于该映射生成的令牌的有效 API 访问范围。如果映射未定义权限,OpenAI 不会添加特定于工作负载身份联合的范围限制,授权将派生自已映射服务账号的项目和组织角色。

工作负载身份令牌不会绕过正常的端点授权。目标端点仍必须允许令牌所携带的有效权限和项目访问。

对于 X.509 交换,bearer 令牌会替换 API 密钥,而非客户端证书。bearer 令牌和 API mTLS 证书会被独立验证。bearer 令牌未绑定证书,也不使用 DPoP 或 a `cnf` 声明。

## 限制

工作负载身份联合目前存在以下限制：

- 工作负载身份访问令牌不能用于调用 Admin API 端点。对于 Admin API，请使用管理员 API 密钥。
- 每个组织最多可以创建 50 个工作负载身份提供方。每个工作负载身份提供方最多可以拥有 50 个服务账户映射。
- 以下端点不接受工作负载身份访问令牌： `DELETE /v1/models/{id}` 以及 `POST /v1/images/request_audit`.
- setup guides 中所记录的提供方之外的任意 OIDC 颁发者端点 [设置指南](https://developers.openai.com/api/docs/guides/workload-identity-federation) 目前尚不支持。
- X.509 工作负载身份提供方复用生效中的 Mutual TLS 根证书，没有单独的证书信任存储。
- X.509 证书交换不执行证书吊销列表 (CRL) 或 OCSP 检查。
- SPIFFE 支持仅限于 JWT-SVID 主体令牌。此令牌交换端点不支持 X.509-SVID。