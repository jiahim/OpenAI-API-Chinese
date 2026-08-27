# 工作负载身份令牌交换

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

在配置受信任的提供商和服务账号映射后，可使用此参考将外部颁发的身份令牌兑换为短期 OpenAI 访问令牌。本文还介绍了 beta 版 X.509 证书交换。有关概念、仪表盘配置和设置指南，请参阅 [工作负载身份联合指南](https://developers.openai.com/api/docs/guides/workload-identity-federation).

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

| 参数              | 必需 | 描述                                                                                      |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `grant_type`           | 是      | 必须为 `urn:ietf:params:oauth:grant-type:token-exchange`.                                       |
| `subject_token_type`   | 是      | 支持 `urn:ietf:params:oauth:token-type:jwt` 和 `urn:ietf:params:oauth:token-type:id_token`. |
| `subject_token`        | 是      | 来自你的工作负载身份提供方外部颁发的 OIDC JWT 或 SPIFFE JWT-SVID。          |
| `identity_provider_id` | 是      | 为外部签发方配置的 OpenAI 工作负载身份提供方 ID。                     |
| `service_account_id`   | 是      | 用于依据匹配的服务账号映射进行解析的 OpenAI 服务账号 ID。           |

令牌交换使用匹配的服务账号映射上配置的权限。请求体中的值不授予访问权限。 `scope` 请求体中的值不授予访问权限。

## 交换 X.509 证书

X.509 证书交换已进入测试版。如果 X.509 未作为提供程序类型出现，请联系你的系统管理员。你的管理员可以与 OpenAI 合作，为你的组织启用此测试版。

在与专用 X.509 令牌端点进行 TLS 协商时出示客户端证书。不要包含 `subject_token` 在请求体中。

有关提供商和服务账户映射配置，请遵循 [X.509 证书设置指南](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509)。有关证书要求、激活、支持的端点及客户端配置，请参阅 [OpenAI Mutual TLS 测试版计划](https://help.openai.com/en/articles/10876024-openai-mutual-tls-beta-program).

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

| 参数              | 必需 | 描述                                                                                          |
| ---------------------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `grant_type`           | 是      | 必须为 `urn:ietf:params:oauth:grant-type:token-exchange`.                                           |
| `subject_token_type`   | 是      | 必须为 `urn:openai:params:oauth:token-type:x509`.                                                   |
| `identity_provider_id` | 是      | OpenAI X.509 工作负载身份提供方 ID。                                                      |
| `service_account_id`   | 是      | OpenAI 服务账号 ID，用于根据提供方的服务账号映射进行解析。            |
| `subject_token`        | 否       | 省略此参数。OpenAI 仅从已认证的 TLS 连接获取证书身份。 |

X.509 端点仅接受精确 `POST /oauth/token` 请求 `mtls.auth.openai.com`。其他方法和路径返回 HTTP `403`.

## 身份验证

### JWT 主题令牌验证

OpenAI 在解析映射前会验证外部主体令牌。该令牌必须：

- 为 JWT，且包含 `kid` ，并支持 `alg` 于请求头中。
- 包含 `iss`, `aud`, `sub`, `exp`，以及 `iat` 声明。
- 匹配所配置的工作负载身份提供方签发者与受众。
- 由所配置的 JWKS 来源中的密钥签名。

如果验证失败，令牌交换将返回认证错误，并且不会生成 OpenAI 访问令牌。

主体令牌验证成功后，OpenAI 会根据令牌的原始声明和派生属性解析所请求的服务账户映射。映射不匹配会在映射解析期间导致令牌交换失败。

### X.509 证书验证

OpenAI 会根据解析出的组织和项目上下文中的活动 Mutual TLS 根证书来验证客户端证书。客户端必须提供构建证书链所需的任何中间证书。OpenAI 不会从证书 URL 获取缺失的中间证书。

在证书验证过程中，OpenAI 会应用与活动 Mutual TLS 根证书一起配置的证书准入规则。验证成功后，OpenAI 会评估提供方的 **属性条件**，派生其 `openai.*` 属性，并为请求的服务账户解析恰好一个启用的映射。X.509 提供方必须派生一个非空的 `openai.subject` 值。

证书材料格式错误或缺失、证书链无效、根证书不匹配、证书超出有效期，或被 Mutual TLS 证书准入规则拒绝时，将返回 `invalid_subject_token`. 被提供方的 **属性条件** 表达式拒绝时，返回 `invalid_grant`。其他提供方、映射、推出或活动根证书配置失败也会返回 `invalid_grant`。X.509 请求永远不会回退到 OIDC 或其他 OAuth 流程。

## 响应

成功响应会包含一个短期有效的 bearer token：

```json
{
  "access_token": "eyJ...",
  "issued_token_type": "urn:ietf:params:oauth:token-type:access_token",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "api.model.read api.model.request"
}
```

该 `scope` 属性仅在解析出的映射具有权限时返回。访问令牌最多一小时后过期。JWT exchange 令牌的寿命不会超过其外部主体令牌，X.509 exchange 令牌的寿命不会超过已验证的客户端证书。令牌交换不会返回刷新令牌。

该 `expires_in` 在示例中的 `3600` 值仅用于说明。当已验证的客户端证书提前过期时，返回的寿命可能会更短。

## Token 交换错误

如果令牌交换失败，OpenAI 不会生成访问令牌。常见原因包括：

| 错误类别                 | 典型原因                                                                                                                                                                                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 缺少 JWT 请求参数  | `subject_token`, `subject_token_type`, `identity_provider_id`，或 `service_account_id` 在 JWT 交换中缺失。                                                                                                                               |
| 不支持的令牌请求      | `subject_token_type` 不是受支持的 JWT 类型或 X.509 令牌类型，或请求使用了该模式不接受的字�段。                                                                                                              |
| 提供方解析错误      | 工作负载身份提供方 ID 格式错误、未知、已禁用，或与请求的交换模式不兼容。                                                                                                                                 |
| JWT 主题令牌验证 | JWT 格式错误，头部缺失 `kid` 或 `alg`，算法不受支持，签名无效，签发方或受众不匹配，所需声明缺失，令牌已过期，或没有 JWKS 密钥匹配该令牌 `kid`. |
| X.509 证书验证 | 客户端证书缺失或格式错误，提供的证书路径未到达有效根证书，证书超出有效期，或不符合配置的证书规则。                                                 |
| 映射解析             | 所请求的服务账号不存在映射，匹配的映射已禁用，身份属性与映射不匹配，或属性转换失败。                                                                        |

大多数主体令牌问题可以通过在本地解码 JWT 载荷并比较其 `iss`, `aud`, `sub`, `exp`, `iat`，以及特定于提供商的声明与你的工作负载身份提供商和服务账户映射配置来发现。

如果令牌交换成功但后续 OpenAI API 请求失败，请将铸造的访问令牌作为授权问题调试。该令牌仍需通过正常 OpenAI API 请求所适用的项目、服务账户、端点授权、IP 允许列表及其他策略检查。X.509 工作负载还必须发送可接受的客户端证书 `mtls.api.openai.com` 到 API 请求中。

## 授权行为

工作负载身份访问令牌由 OpenAI 服务账号和项目支持。在 OpenAI API 界面上，它们像服务账号 API 凭据一样授权，而不是用户 OAuth 令牌。

如果映射定义了权限，这些权限会进一步缩窄从该映射铸造的令牌的有效 API 访问权限。如果映射未定义权限，OpenAI 不会添加工作负载身份联合特定的范围限制，授权将根据映射服务账号的项目和组织角色进行。

工作负载身份令牌不会绕过正常的端点授权。目标端点必须仍然允许令牌携带的有效权限和项目访问权限。

对于 X.509 交换，bearer 令牌替换 API 密钥，而不是客户端证书。bearer 和 API mTLS 证书是独立验证的。bearer 不绑定证书，且不使用 DPoP 或 `cnf` claim。

## 限制

工作负载身份联合目前存在以下限制：

- 工作负载身份访问令牌不能用于调用管理 API 端点。对于管理 API，请使用管理 API 密钥。
- 每个组织最多可创建 50 个工作负载身份提供方。每个工作负载身份提供方最多可拥有 50 个服务账户映射。
- 这些端点不接受工作负载身份访问令牌： `DELETE /v1/models/{id}` 以及 `POST /v1/images/request_audit`.
- 除文档中所述的提供方之外的其他 OIDC 签发方端点 [设置指南](https://developers.openai.com/api/docs/guides/workload-identity-federation) 尚不受支持。
- X.509 工作负载身份提供方会复用现有的互相 TLS 根证书，并且没有单独的证书信任库。
- X.509 证书交换不执行证书吊销列表（CRL）或 OCSP 检查。
- SPIFFE 支持仅限于 JWT-SVID 主题令牌。此令牌交换端点不支持 X.509-SVID。