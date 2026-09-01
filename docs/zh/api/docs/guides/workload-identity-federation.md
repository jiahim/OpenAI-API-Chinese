# Workload identity federation

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取该页面的 Markdown 版本。

工作负载身份联合让受信工作负载使用其已有的身份，
而无需存储 OpenAI API 密钥或 ChatGPT 凭据。工作负载
提供来自你身份提供方的短期令牌，OpenAI 将其
交换为短期 OpenAI 访问令牌。

OpenAI API 工作负载也可以通过
X.509 工作负载身份联合来交换经过验证的证书身份。

你可以将工作负载身份联合与 OpenAI API 或 Codex 配合使用：

|                                    | OpenAI API                                                       | Codex                                                        |
| ---------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| **OpenAI 身份**                | API Platform 项目中的服务账号                     | 托管 ChatGPT 工作区中的用户或服务账号     |
| **由管理员设置的位置** | OpenAI Platform                                                  | OpenAI Admin Portal                                          |
| **工作负载的连接方式**      | OpenAI SDK 或令牌交换端点                     | Codex 环境变量和身份令牌文件       |
| **访问令牌可使用的范围**  | 映射的服务账号可用的 API 与权限 | 映射的工作区主体可用的 Codex 访问 |

两条路径采用相同的信任模型，但它们的管理和运行时配置不同。请从共享概念和身份提供方开始
配置方面入手。
然后按照你所使用产品对应的小节继续操作。

- **OpenAI API:** 继续阅读 [将工作负载身份与 OpenAI
  API](#use-workload-identity-with-the-openai-api).
- **Codex:** 请按照 [将工作负载身份与
  Codex](https://developers.openai.com/codex/enterprise/workload-identity) 的完整管理门户和
  运行时配置。

管理员还可以 [通过 Admin 管理 Codex 提供商和规则
API](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api)。请参阅 [Codex
联合规则
参考](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules) 了解
规则和生命周期行为。

## 工作原理

管理员在工作负载连接之前配置三项内容：

1. 一个 **身份提供方** 告知 OpenAI 信任哪个外部签发方以及如何
   验证其签名令牌或证书身份。
2. 一个 **访问规则** 描述 OpenAI 接受哪些令牌属性，以及
   工作负载可以充当哪个 OpenAI 身份。OpenAI API 配置将此称为
   服务账号映射。Codex 配置将其称为联合规则。
3. 一个 **OpenAI 主体** 接收生成的访问权限。对于 OpenAI API，
   该主体是 Platform 服务账号。对于 Codex，主体是
   托管工作区中的 ChatGPT 用户或服务账号。

在运行时：

1. 工作负载接收一个短时效的 OIDC JWT 或 SPIFFE JWT-SVID，或者 OpenAI
   API 工作负载出示 X.509 证书。
2. 工作负载使用其外部身份以及所需的 ID 进行
   产品验证。
3. OpenAI 验证令牌或证书，然后评估配置的
   映射或规则。
4. OpenAI 为映射的主体返回一个短时效的访问令牌。

Token 交换不会创建主体、项目或工作区成员资格。
管理员在设置过程中创建或选择这些资源。

<a id="choose-a-setup-guide"></a>

## 获取身份令牌

请根据你的工作负载所运行的环境选择对应指南：



  - **[X.509 证书](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509)**: 为 OpenAI API 工作负载配置基于证书的交换。
- **[Kubernetes](https://developers.openai.com/api/docs/guides/workload-identity-federation/kubernetes)**: 在自管集群中使用投射的服务账户令牌。
- **[AWS](https://developers.openai.com/api/docs/guides/workload-identity-federation/aws)**: 使用出站身份联合或 Amazon EKS 投射令牌。
- **[Microsoft Azure](https://developers.openai.com/api/docs/guides/workload-identity-federation/microsoft-azure)**: 使用托管身份令牌或 AKS 投射的服务账户令牌。
- **[Google Cloud](https://developers.openai.com/api/docs/guides/workload-identity-federation/google-cloud)**: 使用元数据服务器身份令牌或 GKE 投射的服务账户令牌。
- **[Oracle Cloud Infrastructure](https://developers.openai.com/api/docs/guides/workload-identity-federation/oracle-cloud)**: 使用来自 Oracle 身份域的实例主体令牌。
- **[GitHub Actions](https://developers.openai.com/api/docs/guides/workload-identity-federation/github-actions)**: 在持续集成工作流中使用 OIDC 令牌。
- **[SPIFFE](https://developers.openai.com/api/docs/guides/workload-identity-federation/spiffe)**: 使用由 SPIRE 或兼容提供方签发的 SPIFFE JWT-SVID。



OpenAI 在文档所述的配置中支持兼容 OIDC 的 JWT 主体令牌（subject tokens），包括 SPIFFE JWT-SVID。
对于 OpenAI API，如果你的 OIDC 提供方未在列表中，请联系 OpenAI
support。对于 Codex，请在 **Custom OIDC** 中选择
OpenAI 管理门户中的对应选项。

每篇 OIDC 提供商指南都会说明如何签发和检查令牌。对于 Codex，
仅按其中的令牌签发步骤操作，然后返回到
[将工作负载身份与 Codex 配合使用](#use-workload-identity-with-codex)。这些指南中的 OpenAI 配置和 SDK 示例适用于 OpenAI API 路径。X.509
联合身份验证仅支持 该公司 接口 路径。
联合身份验证仅支持 OpenAI API 路径。

## 通过 OpenAI API 使用工作负载身份

当你的工作负载直接调用 OpenAI API 时使用此路径。你需要
拥有管理 Workload Identity Providers 和服务账户映射的权限
才能操作该组织。

前往 [组织设置 > 安全 > Workload Identity Provider](https://platform.openai.com/settings/organization/security/workload-identity-provider).
先创建 provider，然后从
provider 详情页面配置其服务账户映射。

### X.509 providers

X.509 提供程序会从客户端证书派生工作负载身份属性，OpenAI 会根据你组织现有的 Mutual TLS 配置进行验证。它不会存储证书，也不会维护单独的信任库。

在创建提供程序之前，请先配置并激活用于锚定你客户端证书的可信证书
，相关设置位于 [Organization Settings > Security >
Mutual TLS](https://platform.openai.com/settings/organization/security/mtls).
该 [Mutual TLS guide](https://developers.openai.com/api/docs/guides/mutual-tls) 中，其中说明了权限、
证书要求、激活范围、mTLS 主机、证书链
行为、CEL 过滤器以及轮换。

接下来，创建 X.509 提供程序，派生一个非空的 `openai.subject` 值，并将该身份映射到一个仅拥有工作负载所需权限的项目服务账号。工作负载向 X.509 令牌端点出示其证书以获取短期有效的持有者令牌，然后将持有者令牌和可接受的客户端证书一并发送到 API 的 mTLS 端点。

请参考 [X.509 certificate setup guide](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) ，了解完整的控制台操作和请求流程。

### 配置 OIDC 工作负载身份提供方

为你信任的每个外部签发方创建一个工作负载身份提供方。OpenAI
API 工作负载身份支持 OIDC JWT 主体令牌。其配置
包括：

| 选项                                   | 描述                                                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 名称                                     | 组织内 Workload Identity Provider 的唯一名称。                                                                                       |
| OIDC 颁发者 URL                          | 预期的 OIDC 颁发者 URL。颁发者比较时会忽略结尾的斜杠。                                                                                    |
| 受众                                 | 外部主体令牌上预期的 `aud` 声明。                                                                                                      |
| 描述                              | Workload Identity Provider 的可选描述。                                                                                                     |
| 为 OIDC 发现使用自定义 URL        | 启用后，OpenAI 会从一个公共 HTTPS URL 获取 OIDC 发现元数据，该 URL 可以与令牌颁发者不同。                                          |
| 自定义 OIDC 发现 URL                | 启用自定义发现时使用的发现基 URL 或完整 `/.well-known/openid-configuration` URL。                                            |
| 使用上传的 JWKS 进行令牌验证 | 启用后，OpenAI 会使用上传的 JWKS 验证令牌，而不是通过 OIDC 发现获取密钥。                                                  |
| JWKS JSON                                | 启用上传 JWKS 验证时所使用的已上传公共 JWKS 对象。该 JWKS 必须包含非空的 `keys` 数组，并且不得包含任何私钥材料。 |
| 属性转换                | 可选的 CEL 表达式，用于从令牌声明中派生自定义 `openai.*` 属性，以用于映射决策。                                                   |

自定义 OIDC 发现与上传的 JWKS 互斥。启用
自定义发现后会隐藏上传的 JWKS 选项。自定义发现 URL 必须
使用公共 HTTPS，且不能包含凭据、自定义端口、查询参数或片段标识符。
片段。

如果 **使用自定义 URL 进行 OIDC 发现** 未在你的控制台中显示，请使用
标准 OIDC 发现，或启用 **使用上传的 JWKS 进行令牌验证**
作为替代。使用你的身份提供商发布的公共 JWKS，并及时更新它
当提供方轮换其签名密钥时。

当令牌签发方与发现主机不同时，请将 **OIDC Issuer URL** 设置为
令牌的 `iss` 声明，并将 **Custom OIDC discovery URL** 设置为发布
提供方发现文档的地址。OpenAI 仍然会根据配置的签发方来校验令牌；
自定义 URL 仅用于确定从哪里获取发现文档
元数据和公共签名密钥。

#### 使用 CEL 转换 token 声明

属性转换使用通用表达式语言 (CEL)。OpenAI
支持
[langdef.md](https://github.com/google/cel-spec/blob/master/doc/langdef.md) 并且
不会添加自定义的工作负载身份联合函数。每个表达式
接收一个根对象：

- `assertion`: 经过验证的 JWT 声明集合。

仪表板会自动应用 `openai.` 前缀。输入
后缀，例如 `subject`，以及一个表达式，例如 `assertion.sub`。API
会将派生属性存储为 `openai.subject`.

```json
[
  {
    "attribute": "openai.subject",
    "expression": "assertion.sub"
  },
  {
    "attribute": "openai.repository",
    "expression": "assertion.repository"
  }
]
```

使用 CEL 语言规范定义的 CEL 语法。例如，你可以
使用如下表达式读取声明值： `assertion.sub` 或
`assertion.repository`。不支持的语法或函数会导致映射
解析失败。

```json
[
  {
    "attribute": "openai.repository_ref",
    "expression": "assertion.repository + \"@\" + assertion.ref"
  },
  {
    "attribute": "openai.production",
    "expression": "assertion.ref == \"refs/heads/main\""
  }
]
```

转换结果必须是标量值：字符串、 `true` 或 `false`
值、整数或有限数字。数组、对象、null 值以及
求值错误会导致映射解析失败。OpenAI 会在与映射值进行比较之前将标量
转换结果转换为字符串。例如，
例如， `true` 变为 `"true"` 并且 `7` 变为 `"7"`.

以 `openai.` 开头的映射键只能从属性
转换中解析。已经使用 `openai.` 前缀
除非配置了匹配的转换，否则不会影响映射决策。

#### 管理 JWKS 和密钥轮换

OpenAI 使用在 Workload Identity Provider 上配置的密钥源来验证 OIDC 主体令牌
：

- **OIDC 发现：** OpenAI 获取颁发者的
  `/.well-known/openid-configuration`，然后获取已发现的 `jwks_uri`.
  OpenAI 会将发现文档和远程 JWKS 负载缓存 600 秒。
- **自定义 OIDC 发现：** OpenAI 获取
  `/.well-known/openid-configuration` 从已配置的自定义发现基础
  URL，然后获取已发现的 `jwks_uri`。令牌的 `iss` 声明仍必须
  匹配 **OIDC 颁发者 URL**.
- **未命中时刷新密钥：** 如果某个令牌 `kid` 在缓存的 JWKS 中未找到，
  OpenAI 会刷新 JWKS 并在拒绝该
  令牌前再次尝试查找。
- **已上传的 JWKS：** 当 **使用已上传的 JWKS 进行令牌验证** is
  enabled, OpenAI 使用提供方上存储的已上传 JWKS,不会
  执行 OIDC 发现或远程 JWKS 获取。当提供方更新对
  token 交换可用时,新的交换将使用已保存的 JWKS。
- **密钥集:** 一个 JWKS 可以包含多个公钥。每个密钥必须具有
  唯一且非空的 `kid`.

在签名密钥轮换期间，在签发方的
JWKS 中同时发布旧公钥和新公钥，跨越整个轮换窗口。这样由旧密钥签名的令牌仍可
正常使用，而 OpenAI 接受由新密钥签名的令牌。对于上传的 JWKS，
请在使用新密钥签发令牌之前更新提供方 `kid`；OpenAI 会拒绝
由已配置 JWKS 中不存在的密钥签名的令牌。

<a id="configure-service-account-mappings"></a>

### 配置服务账号映射

服务账号映射定义了哪些外部身份可以为某个
OpenAI 服务账号签发访问令牌。

对于 X.509 提供方，映射键使用派生的 `openai.*` 属性。优先使用
精确 `openai.subject` 映射。原始 JWT 声明（如 `sub`, `aud`）仅适用于 OIDC 提供方。 `iss`
apply only to OIDC providers.

其配置包括：

| 选项          | 描述                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 名称            | Workload Identity Provider 内该映射的唯一名称。                                                                                         |
| Key             | 用于匹配的属性键。使用原始令牌声明，例如 `sub`, `aud`，或 `iss`，或派生属性，例如 `openai.subject`.                             |
| Value           | 在 OpenAI 颁发令牌之前必须匹配的属性值。                                                                                            |
| 描述     | 该映射的可选描述。                                                                                                                        |
| Project         | 拥有目标服务账号的项目。                                                                                                            |
| Service account | 工作负载可使用的服务账号。你可以在所选项目中创建新的服务账号，或选择现有的服务账号。                |
| Permissions     | 可选的 API 权限，用于进一步收窄从此映射生成的访问令牌。这些权限不能授予超出已映射服务账号范围的访问权限。 |

属性值必须是标量 JSON 值。字符串值可以使用一个尾随
通配符，并带有非空前缀，例如 `repo:example/*`。单独的通配符
或位于值中间的形式不受支持。

有效的通配符值：

- `repo:openai/*`
- `repository:my-org/*`

不支持的通配符值：

- `*`
- `repo:*:prod`
- `repo/*/main`

仪表板将映射限制显示为 **权限**。令牌交换
响应会在同一字段中暴露与 OAuth 作用域相同的限制。映射不能包含 Admin API 作用域，并且常规的下游 API `scope`
property. Mappings can't include Admin 接口 scopes, and normal downstream 接口
授权仍然适用。

#### 映射解析度示例

映射解析在 OpenAI 验证外部身份之后开始。
OpenAI 查找所请求的映射， `identity_provider_id` 并且
`service_account_id`，跳过未启用的映射，只评估每个映射所需的
属性，并且仅当恰好有一个启用的映射匹配每个
已配置属性时才签发令牌。

假设一个 GitHub Actions 令牌包含以下声明：

```json
{
  "iss": "https://token.actions.githubusercontent.com",
  "aud": "https://api.openai.com/v1",
  "sub": "repo:my-org/my-repo:ref:refs/heads/main",
  "repository": "my-org/my-repo",
  "ref": "refs/heads/main"
}
```

该提供方可以派生出一个属性：

```json
[
  {
    "attribute": "openai.repository_ref",
    "expression": "assertion.repository + \"@\" + assertion.ref"
  }
]
```

随后，服务账号映射可以同时要求原始属性和派生属性：

| Key                     | Value                                         |
| ----------------------- | --------------------------------------------- |
| `iss`                   | `https://token.actions.githubusercontent.com` |
| `sub`                   | `repo:my-org/my-repo:*`                       |
| `openai.repository_ref` | `my-org/my-repo@refs/heads/main`              |

所有三个值都必须匹配。该 `sub` 值使用了尾部通配符，因此它
会匹配任何具有该前缀的值。 `repo:my-org/my-repo:`。这些指南中的 OpenAI 配置和 SDK 示例适用于 OpenAI API 路径。X.509
`openai.repository_ref` 键解析自属性转换，而不是具有该名称的
原始令牌声明。

如果有多个启用的映射匹配某个交换，OpenAI 会拒绝该交换。OpenAI
对每个外部 `(provider, service account)` 对强制要求唯
一映射，并且不会合并来自不同映射的权限。

### 连接工作负载

在你的 SDK 示例中使用 [身份提供方指南](#get-an-identity-token),
，或者直接调用令牌交换端点。有关请求和响应字段、
授权行为以及当前的限制，请参阅
[工作负载身份令牌交换参考](https://developers.openai.com/api/reference/workload-identity-federation).

## 将工作负载身份与 Codex 配合使用

在受管的 ChatGPT 工作区中，针对可信的 Codex 自动化使用此路径。
Codex 将工作负载映射到 ChatGPT 用户或服务账户，而不是API
Platform 服务账户。

Codex 工作负载身份联合处于测试阶段，必须为你的
  工作区启用。如需申请访问权限，请联系你的OpenAI 销售代表或 [OpenAI
  支持](https://help.openai.com/en/articles/6614161-how-can-i-contact-support).

请参阅 [将工作负载身份与
Codex](https://developers.openai.com/codex/enterprise/workload-identity) 结合使用，以获取完整的管理员和
运行时操作流程。它涵盖特定提供商的令牌来源、联合规则、
必需的令牌文件配置、凭证优先级、受支持的 Codex
使用场景、轮换与验证。对于可选的审计归因，Codex
接受 `OPENAI_WORKLOAD_IDENTITY_CONTEXT`；Codex 指南定义了它的架构、
隐私限制与审计行为。

使用 [Admin
API](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api) 以编程方式管理 Codex
提供者和规则。 [联合规则
参考](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules)
解释了单条规则如何在映射到一个 ChatGPT principal 的同时接受多个外部 subject
。

## 排查连接问题

### OpenAI 拒绝身份令牌

在本地解码该令牌并将其 `iss`, `aud`, `sub`, `exp`, `iat`）仅适用于 OIDC 提供方。
针对提供商的特定声明与所配置的提供商进行对比。不要将生产
令牌粘贴到第三方 JWT 工具中。

对于 OpenAI API，还需将令牌属性与所选服务的
账户映射进行对比。对于 Codex，请将其与所选联合规则进行对比。

### OpenAI API 映射不匹配

确认请求使用了预期的身份提供方和服务
账户 ID，确认映射处于活动状态，并且恰好有一个匹配项。
请参阅 [令牌交换错误参考](https://developers.openai.com/api/reference/workload-identity-federation#token-exchange-errors)
了解详细的错误类别。

### Codex reports incomplete configuration

确认 Codex 进程同时拥有所需的工作负载身份环境
变量，并且 `OPENAI_IDENTITY_TOKEN_FILE` 包含指向当前
token 的绝对路径。检查该文件及其父目录的权限。

### Codex 使用另一组凭据

将这两个必需的工作负载身份变量加载到 Codex 进程中。
只要存在任一该变量，就会优先于 API 密钥、访问令牌和存储的登录凭据选择 WIF，
请启动一个新进程并加载下载的配置，然后运行，
再次运行 `codex login status` 即可。

## 安全建议

- 为每个应用或工作负载使用专用主体。
- 分离生产环境和非生产环境。
- 优先使用精确的声明匹配，而非宽泛的模式。
- 仅授予工作负载所需的访问权限。
- 使用较短的访问令牌有效期。
- 审查并移除未使用的提供方、映射和规则。
- 审查令牌交换错误和意外的访问模式。

## 相关文档

- [将工作负载身份与 Codex 配合使用](https://developers.openai.com/codex/enterprise/workload-identity)
- [Codex 联合规则参考](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules)
- [通过 Admin API 管理 Codex 工作负载身份](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api)
- [工作负载身份令牌交换参考](https://developers.openai.com/api/reference/workload-identity-federation)
- [Codex 身份验证](https://developers.openai.com/codex/auth)
- [Codex 环境变量](https://developers.openai.com/codex/config-file/environment-variables)
- [Codex 非交互模式](https://developers.openai.com/codex/non-interactive-mode)