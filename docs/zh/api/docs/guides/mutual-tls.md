# Mutual TLS

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 。

Mutual TLS（mTLS）为 OpenAI API 请求添加 TLS 客户端证书验证。
在为组织或项目激活受信任证书后，该范围内的请求除了常规的
bearer 凭证外，还必须出示一份被接受的客户端证书。
bearer 凭证。

当工作负载可以安全保存客户端私钥，并且你希望在授权 API 请求前让 OpenAI 验证其证书身份时，请使用 mTLS。
请求。
mTLS 不能替代 API 密钥、服务账号凭证或工作负载
身份访问令牌。

X.509 工作负载身份联合使用同一组有效 mTLS 信任锚点。
  证书交换会返回一个短时效的 bearer 令牌，后续的 API
  调用仍然会同时发送该 bearer 令牌和一份被接受的 API mTLS 证书。参阅
  [使用 X.509 配置工作负载身份联合
  证书](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509).

## 配置 mTLS 之前

任何 API 组织都可以通过常规的基于角色的访问控制
（RBAC）管理 mTLS：

- `api.mtls.read` 允许主体列出、查看和测试证书设置。
- `api.mtls.write` 允许主体上传、更新、激活、停用以及
  删除证书。

组织所有者角色包含这些权限，但你可以通过自定义角色授予它们
。有关详细信息，请参阅 [在以下位置管理权限
OpenAI 平台](https://developers.openai.com/api/docs/guides/rbac).

准备工作：

- 每个工作负载的客户端证书及其私钥。
- 构建从客户端证书到你的信任锚点的证书链所需的任何中间证书
  。
- 一个稳定的 PEM 编码信任锚点,你可以在组织
  或项目级别激活它。
- 在生产环境中启用 mTLS 之前,需要一个非关键型项目以及经过测试的恢复路径
  。

将私钥排除在源代码管理之外。不要记录私钥、证书
内容或持有者凭据。

## 上传并启用信任

Upload stores a certificate but does not enforce mTLS. Activation is the step
that changes request behavior.

1. 打开 [Organization settings > Security > Mutual
   TLS](https://platform.openai.com/settings/organization/security/mtls).
2. 为每个证书对象上传一个 PEM 编码的可信锚。给它指定一个
   能够标识该机构及轮换世代的名称。
3. （可选）添加一个 [CEL 过滤器](#filter-client-certificates-with-cel) ，
   用于限制该可信锚可接受的客户端证书范围。
4. 先在非关键项目中启用该证书。通过一个
   从每个预期的工作负载发出 [mTLS API 主机](#use-an-mtls-host) 发出
   具有代表性的请求。
5. 在验证成功之后，再为其他项目或组织启用该证书。
   。

你也可以通过 API 管理证书：

| Task                                        | Endpoint                                                                                                                                                                                                 |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 上传证书                        | `POST /v1/organization/certificates`                                                                                                                                                                     |
| 列出组织证书              | `GET /v1/organization/certificates`                                                                                                                                                                      |
| 检索、更新或删除证书   | `GET`, `POST`，或 `DELETE /v1/organization/certificates/{certificate_id}`                                                                                                                                |
| 激活或停用组织的证书  | `POST /v1/organization/certificates/activate` 或 `POST /v1/organization/certificates/deactivate`                                                                                                         |
| 列出、激活或停用项目的证书 | `GET /v1/organization/projects/{project_id}/certificates`, `POST /v1/organization/projects/{project_id}/certificates/activate`，或 `POST /v1/organization/projects/{project_id}/certificates/deactivate` |

使用具有所需 `api.mtls.read` 或 `api.mtls.write`
权限的凭据。有关请求和响应架构，请参阅 [organization
certificates API 参考](https://developers.openai.com/api/reference/resources/admin/subresources/organization).

## 证书要求

每个证书对象使用一个 PEM 编码的可信锚。上传必须
包含一张有效期至少比上传时间晚一天的有效证书。
客户端证书必须包含 Authority Key Identifier (AKI) 以用于请求
验证。

要使请求通过 mTLS：

- 客户端证书在请求时必须有效，并且适用于 TLS
  客户端身份验证。
- 客户端证书必须能够构建到有效的组织级或
  项目级信任锚的合法路径。
- 如果该路径包含中间证书，客户端必须在
  TLS 握手期间提供这些证书。
- 配置的信任锚和客户端链必须通过标准的 X.509
  客户端证书路径验证。

如果一次上传包含多个 PEM 编码的证书，请求链
验证仅使用第一个配置的证书作为锚点；请勿
依赖 PEM 捆绑包语义。

OpenAI 不会从 Authority Information Access
(AIA) URL 获取缺失的中间证书，也不会执行证书吊销列表 (CRL) 或 Online
Certificate Status Protocol (OCSP) 检查。请提供完整的必需链，
并通过证书轮换、停用以及
你自己的证书生命周期控制来管理事件响应。

## 了解验证顺序

OpenAI 会在活动组织级证书之前检查活动项目级证书。
如果这两个作用域都没有处于活动状态的证书，
mMTLS 不会为该请求添加证书检查。

当存在有效证书时，OpenAI 按以下顺序验证客户端身份：
order:

1. OpenAI 首先尝试现有的直连路径，直接将客户端
   证书与活动锚点进行校验，无需请求
   中间证书。
2. 在普通的直连路径未匹配后，OpenAI 会尝试请求链
   验证，使用客户端证书以及 TLS 连接中
   提供的中间证书。
3. 如果某条路径验证通过，OpenAI 会评估该活动证书的 CEL 过滤器（如果
   存在），并对照已验证的客户端证书进行匹配。

Request-chain 验证默认可用。

请求链路径是普通无匹配之后的回退路径，而非针对每条直连路径错误的恢复路径
路径。证书材料缺失或格式错误、AKI 缺失，或在直连路径选定
anchor 后出现确定性错误，都可能在未尝试所呈现链的情况下使请求失败。
anchor 之后出错都可能在未尝试所呈链的情况下导致请求失败。

## 使用 CEL 过滤客户端证书

为已上传的证书附加一个可选的通用表达式语言（CEL）过滤器，以约束该锚点接受的已验证客户端证书。
certificate to constrain the verified client certificates that anchor accepts.
该表达式必须求值为布尔值，并针对直接路径和请求链路径上的已验证客户端证书运行。
certificate on both the direct and request-chain paths.

CEL 公开以下字段：

- `subject.common_name`, `subject.country_code`, `subject.organization`,
  `subject.organizational_unit`, `subject.locality`, `subject.province`,
  `subject.street_address`，以及 `subject.postal_code`.
- `subject_alt_names`，一个其条目公开以下内容的列表 `type`, `value`，以及 `oid`.
  支持的 SAN 类型标识符包括 `DNS`, `EMAIL`, `IP_ADDRESS`, `URI`，以及
  `CUSTOM`.

例如，要求生产组织单元和 DNS SAN
特定命名空间：

```text
subject.organizational_unit == "Production" &&
subject_alt_names.exists(san, san.type == DNS && san.value.endsWith(".example.com"))
```

验证通过但不匹配过滤条件的证书会因以下错误而失败：
`certificate_attribute_verification_failed`。OpenAI 会在你保存未通过验证的策略时拒绝该策略。

## 使用 mTLS 主机

将 API 流量发送到 mTLS 主机，而不是 `api.openai.com`:

| Host                     | Use                                   |
| ------------------------ | ------------------------------------- |
| `mtls.api.openai.com`    | 默认 API mTLS 主机。                |
| `mtls-us.api.openai.com` | 美国区域 API mTLS 主机。 |
| `mtls-eu.api.openai.com` | 欧盟区域 API mTLS 主机。            |

mTLS 是基于主机的。使用与对应 `/v1` API 接口相同的路由，并测试你的工作负载所使用的每个
API 和模型。各区域主机之间的路由和模型可用性可能不同。
各区域主机之间的路由和模型可用性可能不同。

例如，向默认 mTLS 主机同时发送普通的 bearer 凭证和客户端证书：
默认 mTLS 主机：

```bash
export OPENAI_MTLS_CERT_CHAIN="/path/to/client-chain.pem"
export OPENAI_MTLS_KEY="/path/to/client-key.pem"

curl https://mtls.api.openai.com/v1/models \
  --cert "$OPENAI_MTLS_CERT_CHAIN" \
  --key "$OPENAI_MTLS_KEY" \
  --header "Authorization: Bearer $OPENAI_API_KEY"
```

证书链文件应先包含客户端证书，
后跟任何所需的中间证书。不要在请求头中
HTTP 标头或请求体。

X.509 工作负载身份联合使用一个独立的精确交换端点：
`POST https://mtls.auth.openai.com/oauth/token`。该交换会生成一个
短期持有者令牌；它不提供仅限证书的 API 身份验证。有关
完整的请求格式，请参阅 [工作负载身份令牌交换
参考](https://developers.openai.com/api/reference/workload-identity-federation#exchange-an-x509-certificate).

## Rotate certificates

通过带重叠的方式轮换信任锚点，使现有工作负载继续工作：

1. 上传新的信任锚，不要停用旧的信任锚。
2. 在每个目标项目或组织中激活新的信任锚
   级别。
3. 更新工作负载，使其提供链接到新信任锚的客户端
   锚点证书，然后测试它们使用的每个 mTLS 主机和 API 接入面。
4. 在所有工作负载迁移完成后再停用旧的信任锚。
5. 仅在为组织停用旧证书后才能删除它，
   并对每个项目都执行此操作。

你可以在不更改已配置信任锚的情况下轮换中间证书。
在后续请求中提供新的完整证书链。

## 排查请求问题

使用稳定的错误代码来区分配置错误与临时
服务错误：

| 错误代码                                  | 检查项                                                                                                                           |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `certificate_required`                      | 活动证书有效，但请求未提供所需的客户端证书材料。                                    |
| `invalid_certificate`                       | OpenAI 无法解码或解析客户端证书，或证书缺少验证所需的 AKI。                       |
| `certificate_verification_failed`           | 客户端证书或所提供的证书链未到达有效的信任锚点。                                                        |
| `certificate_attribute_verification_failed` | 证书路径验证通过，但 CEL 过滤器拒绝了已验证的客户端证书。                                             |
| `authentication_temporarily_unavailable`    | 验证器超时、内部依赖错误或 CEL 求值器错误导致了 HTTP `503`。请按照常规的瞬态错误重试策略重试。 |

对于管理请求， `mtls_certificate_invalid` 表示上传的 PEM
未通过校验， `expired_certificate` 表示它过期过早或已
过期， `mtls_cel_policy_invalid` 表示该过滤器未通过校验，且
`certificate_in_use` 表示你必须在删除之前停用该证书
。

## 当前的局限性

- 一个组织最多可上传 50 个证书对象。
- mTLS 在常规 API 身份验证的基础上增加了证书验证；它不提供
  仅限证书的 API 授权。
- OpenAI 不会获取 AIA 中间证书，也不会执行 CRL 或 OCSP
  检查。
- Private Link 与 mTLS 不兼容。请参阅 [Private
  Link](https://developers.openai.com/api/docs/guides/private-link) 了解何时需要使用 Azure 专用网络
  路径。
- 支持的 API mTLS 主机为 `mtls.api.openai.com`,
  `mtls-us.api.openai.com`，以及 `mtls-eu.api.openai.com`。请勿假设每个
  其他区域 API 主机都有对应的 mTLS 主机。
- X.509 工作负载身份联合不会返回刷新令牌，并且不会
  不使用 DPoP、 `cnf` 声明或证书绑定的持有者令牌。请参阅
  [使用 X.509 证书配置工作负载身份联合
  证书](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509).