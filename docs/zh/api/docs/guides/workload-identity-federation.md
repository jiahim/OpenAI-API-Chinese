# Workload identity federation

> 如需完整的文档索引,请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 后追加 `.md` 获取文档页面的 Markdown 版本。

工作负载身份联合让受信工作负载使用它已有的身份，
而无需存储 OpenAI API 密钥或 ChatGPT 凭据。该工作负载
出示一个来自你身份提供商的短期令牌，OpenAI 将其
交换为短期的 OpenAI 访问令牌。

OpenAI API 工作负载还可以通过以下方式交换经过验证的证书身份：
X.509 工作负载身份联合。

你可以将工作负载身份联合与 OpenAI API 或 Codex 一起使用：

|                                    | OpenAI API                                                       | Codex                                                        |
| ---------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| **OpenAI 身份**                | API Platform 项目中的服务账户                     | 托管 ChatGPT 工作区中的用户或服务账户     |
| **管理员设置的位置** | OpenAI Platform                                                  | OpenAI Admin Portal                                          |
| **工作负载的连接方式**      | OpenAI SDK 或 token exchange 端点                     | Codex 环境变量和 identity-token 文件       |
| **访问令牌可使用的范围**  | 映射服务账户可用的 API 和权限 | 映射工作区主体可用的 Codex 访问 |

两种路径使用相同的信任模型，但管理和运行时配置有所不同。先阅读下文关于共享概念与身份提供方的指南，然后按你工作负载所使用的产品对应章节继续。
两种路径使用相同的信任模型，但管理和运行时配置有所不同。先阅读下文关于共享概念与身份提供方的指南，然后按你工作负载所使用的产品对应章节继续。
两种路径使用相同的信任模型，但管理和运行时配置有所不同。先阅读下文关于共享概念与身份提供方的指南，然后按你工作负载所使用的产品对应章节继续。

- **OpenAI API：** 继续阅读 [将工作负载身份用于 OpenAI
  API](#use-workload-identity-with-the-openai-api).
- **Codex：** 按照 [将工作负载身份用于
  Codex](https://developers.openai.com/codex/enterprise/workload-identity) 中的说明完成完整的 Admin Portal 与
  运行时配置。

管理员还可以 [通过 Admin 管理 Codex 提供商和规则
API](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api)。参见 [Codex
联邦规则
参考](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules) 了解
规则及生命周期行为。

## 工作原理

在负载连接之前，管理员需要配置三件事：

1. 一个 **身份提供方** 告诉 OpenAI 信任哪个外部签发方以及如何
   验证其已签名的令牌或证书身份。
2. 一个 **访问规则** 描述 OpenAI 接受哪些令牌属性以及工作负载可以
   以哪个 OpenAI 身份执行操作。OpenAI API 配置将此类规则称为
   服务账号映射。Codex 配置将其称为联合规则。
3. 一个 **OpenAI 主体** 获得最终的访问权限。对于 OpenAI API，
   主体是 Platform 服务账号。对于 Codex，主体是
   托管工作区中的 ChatGPT 用户或服务账号。

在运行时：

1. 工作负载收到一个短时效的 OIDC JWT 或 SPIFFE JWT-SVID，或 OpenAI
   API 工作负载出示 X.509 证书。
2. 工作负载随其所需的 ID 一并出示其外部身份，该 ID 由其
   产品决定。
3. OpenAI 验证该令牌或证书，然后评估已配置的
   映射或规则。
4. OpenAI 为映射的主体返回短时效访问令牌。

令牌交换不会创建主体、项目或工作区成员资格。
管理员在设置过程中创建或选择这些资源。

<a id="choose-a-setup-guide"></a>

## 获取身份令牌

选择适用于你工作负载运行环境的指南：



  - **[X.509 证书](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509)**：为 OpenAI API 工作负载配置基于证书的交换。
- **[Kubernetes](https://developers.openai.com/api/docs/guides/workload-identity-federation/kubernetes)**：在自管集群中使用 projected service account token。
- **[AWS](https://developers.openai.com/api/docs/guides/workload-identity-federation/aws)**：使用出站身份联合或 Amazon EKS projected token。
- **[Microsoft Azure](https://developers.openai.com/api/docs/guides/workload-identity-federation/microsoft-azure)**：使用托管身份令牌或 AKS projected service account token。
- **[Google Cloud](https://developers.openai.com/api/docs/guides/workload-identity-federation/google-cloud)**：使用元数据服务器身份令牌或 GKE projected service account token。
- **[Oracle Cloud Infrastructure](https://developers.openai.com/api/docs/guides/workload-identity-federation/oracle-cloud)**：使用来自 Oracle 身份域的实例主体令牌。
- **[GitHub Actions](https://developers.openai.com/api/docs/guides/workload-identity-federation/github-actions)**：在持续集成工作流中使用 OIDC 令牌。
- **[SPIFFE](https://developers.openai.com/api/docs/guides/workload-identity-federation/spiffe)**：使用由 SPIRE 或兼容提供方签发的 SPIFFE JWT-SVID。



OpenAI 支持 OIDC 兼容的 JWT 主题令牌，包括 SPIFFE JWT-SVID。
所支持的配置均已在文档中列出。如果你的 OIDC 提供商不在列表中，对于 OpenAI API，请联系 OpenAI
support；对于 Codex，请在 **Custom OIDC** 中选择
OpenAI Admin Portal。

每个 OIDC 提供方指南都会介绍如何签发和检查令牌。对于 Codex,
只需按照其中的令牌签发步骤操作，然后返回到
[将工作负载身份与 Codex 配合使用](#use-workload-identity-with-codex)。这些
指南中的 OpenAI 配置和 SDK 示例适用于 OpenAI API 路径。X.509
联合身份验证仅支持 OpenAI API 路径。

## 将工作负载身份与 OpenAI API 配合使用

当你的工作负载直接调用 OpenAI API 时使用此路径。你需要
管理 Workload Identity Provider 和服务账号映射的权限
。

前往 [Organization Settings > Security > Workload Identity Provider](https://platform.openai.com/settings/organization/security/workload-identity-provider).
首先创建 provider，然后从
provider 详情页面配置其服务账号映射。

### X.509 providers

X.509 提供方会从客户端证书中派生工作负载身份属性，OpenAI 会根据你组织现有的 Mutual TLS 配置进行验证。它不会存储证书，也不会维护单独的信任库。

在创建提供方之前，请先配置并激活受信证书
作为客户端证书的锚点，配置位置在 [Organization Settings > Security >
Mutual TLS](https://platform.openai.com/settings/organization/security/mtls).
该 [Mutual TLS guide](https://developers.openai.com/api/docs/guides/mutual-tls) 其中说明了权限、
证书要求、激活范围、mTLS 主机、证书链
行为、CEL 过滤器以及证书轮换。

接下来，创建 X.509 提供方，派生一个非空的 `openai.subject` 取值，并将该身份映射到仅拥有工作负载所需权限的项目服务账户。工作负载向 X.509 令牌端点出示其证书以获取短期有效的持有者令牌，然后将持有者令牌与一个可接受的客户端证书一起发送到 API 的 mTLS 端点。

请参考 [X.509 certificate setup guide](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 以了解完整的控制台和请求流程。

### 配置 OIDC 工作负载身份提供方

为每个你信任的外部签发方创建一个工作负载身份提供方。OpenAI
API 工作负载身份支持 OIDC JWT 主题令牌。其配置
包括：

| 选项                                   | 说明                                                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 名称                                     | 组织中 Workload Identity Provider 的唯一名称。                                                                                       |
| OIDC 颁发者 URL                          | 预期的 OIDC 颁发者 URL。颁发者比较时会忽略末尾的斜杠。                                                                                    |
| 受众                                 | 外部主体令牌上预期的 `aud` 声明。                                                                                                      |
| 说明                              | Workload Identity Provider 的可选说明。                                                                                                     |
| 使用自定义 URL 进行 OIDC 发现        | 启用后，OpenAI 从一个公共 HTTPS URL 获取 OIDC 发现元数据，该 URL 可以与令牌颁发者不同。                                          |
| 自定义 OIDC 发现 URL                | 启用自定义发现时使用的发现基 URL 或完整 `/.well-known/openid-configuration` URL。                                            |
| 使用上传的 JWKS 进行令牌验证 | 启用后，OpenAI 使用上传的 JWKS 验证令牌，而不是从 OIDC 发现获取密钥。                                                  |
| JWKS JSON                                | 启用上传的 JWKS 验证时所使用的已上传公共 JWKS 对象。该 JWKS 必须包含非空的 `keys` 数组，且不包含任何私钥材料。 |
| 属性转换                | 可选的 CEL 表达式，用于从 token 声明派生自定义 `openai.*` 属性以供映射决策使用。                                                   |

自定义 OIDC 发现和已上传的 JWKS 互斥。启用
自定义发现会隐藏已上传的 JWKS 选项。自定义发现 URL 必须
使用公共 HTTPS，且不能包含凭据、自定义端口、查询参数或
片段。

如果 **为 OIDC 发现使用自定义 URL** 未在你的控制台中显示，请使用
标准 OIDC 发现或启用 **使用已上传的 JWKS 进行令牌验证**
。使用你的身份提供商发布的公共 JWKS，并在提供商轮换签名密钥时予以更新。
当令牌颁发者和发现主机不同时，将。

OIDC 颁发者 URL **设置为** 令牌的
声明，将 `iss` 声明，并将 **自定义 OIDC 发现 URL** 设置为发布
提供商发现文档的主机。OpenAI 仍会根据配置的颁发者对令牌进行校验；自定义 URL 仅决定从哪里获取发现
文档。
metadata and public signing keys.

#### 使用 CEL 转换令牌声明

属性转换使用通用表达式语言 (CEL)。OpenAI
支持
[langdef.md](https://github.com/google/cel-spec/blob/master/doc/langdef.md) 中指定的标准 CEL 运算符，
并且未添加自定义的工作负载身份联合函数。每个表达式
接收一个根对象：

- `assertion`：经验证的 JWT 声明集。

仪表盘会自动应用 `openai.` 前缀。输入
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
通过如下表达式读取声明值： `assertion.sub` 或
`assertion.repository`。不支持的语法或函数会导致映射失败
解析度。

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
值、整数或有限数。数组、对象、null 值以及
评估错误会导致映射解析失败。OpenAI 在将标量
转换结果与映射值进行比较之前，会先将其转换为字符串。例如，
例如， `true` 变为 `"true"` 中指定的标准 CEL 运算符， `7` 变为 `"7"`.

以 `openai.` 开头的映射键只能从属性转换中
解析。已经使用了某个 `openai.` prefix
除非你配置了匹配的转换，否则不会影响映射决策。

#### 管理 JWKS 与密钥轮换

OpenAI 会使用在以下位置配置的密钥源对 OIDC subject 令牌进行校验：
Workload Identity Provider:

- **OIDC 发现：** OpenAI 获取颁发者的
  `/.well-known/openid-configuration`，然后获取发现的 `jwks_uri`.
  OpenAI 缓存发现文档和远程 JWKS 负载 600 秒。
- **自定义 OIDC 发现：** OpenAI 获取
  `/.well-known/openid-configuration` 来自已配置的自定义发现基础
  URL，然后获取发现的 `jwks_uri`。令牌的 `iss` 声明必须
  仍然匹配 **OIDC 颁发者 URL**.
- **未命中时刷新密钥：** 如果某个令牌 `kid` 在缓存的 JWKS 中未找到，
  OpenAI 会刷新 JWKS 并在拒绝该
  令牌之前再次尝试查找。
- **已上传的 JWKS：** 当 **使用已上传的 JWKS 进行令牌验证** is
  启用后，OpenAI 使用存储在提供方上的已上传 JWKS，且不
  执行 OIDC 发现或远程 JWKS 获取。在提供方更新可用于
  令牌交换后，新的交换将使用已保存的 JWKS。
- **密钥集：** 一个 JWKS 可以包含多个公钥。每个密钥必须具有一个
  唯一的、非空的 `kid`.

在签名密钥轮换期间，将旧公钥和新公钥同时发布到 issuer
的 JWKS，覆盖整个轮换窗口。这样由旧密钥签名的令牌可以继续
使用，而 OpenAI 同时接受由新密钥签名的令牌。对于已上传的 JWKS，
在使用新密钥签发令牌前更新 provider `kid`；OpenAI 会拒绝
由已配置的 JWKS 中不存在的密钥所签名的令牌。

<a id="configure-service-account-mappings"></a>

### 配置服务账号映射

服务账号映射定义了哪些外部身份可以为某个 OpenAI 服务账号签发访问
令牌。

对于 X.509 提供方，映射键使用派生的 `openai.*` 属性。建议使用精确的
映射。原始 JWT 声明（如 `openai.subject` 映射。原始 JWT 声明（如 `sub`, `aud`）仅适用于 OIDC 提供方。 `iss`
）仅适用于 OIDC 提供方。

其配置包括：

| 选项          | 说明                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 名称            | 在该 Workload Identity Provider 中映射的唯一名称。                                                                                         |
| Key             | 要匹配的属性键。使用原始令牌声明，例如 `sub`, `aud`，或 `iss`，或派生属性，例如 `openai.subject`.                             |
| Value           | 在 OpenAI 签发令牌之前必须匹配的属性值。                                                                                            |
| 说明     | 该映射的可选描述。                                                                                                                        |
| Project         | 拥有目标服务账号的项目。                                                                                                            |
| Service account | 工作负载可以使用的服务账号。你可以在所选项目中创建新的服务账号，或选择现有的服务账号。                |
| Permissions     | 可选的 API 权限，用于进一步收窄从此映射铸造的访问令牌。这些权限无法授予超出所映射服务账号范围的访问权限。 |

属性值必须是标量 JSON 值。字符串值可以使用一个结尾的
通配符并带有非空前缀，例如 `repo:example/*`. 仅使用通配符本身
或值中间使用通配符。

有效的通配符值：

- `repo:openai/*`
- `repository:my-org/*`

不支持的通配符值：

- `*`
- `repo:*:prod`
- `repo/*/main`

仪表板将映射限制显示为 **Permissions**。令牌交换
响应会暴露与 OAuth 作用域相同的限制，体现在 `scope`
属性中。映射不能包含 Admin API 作用域，并且下游普通的 API
授权仍然适用。

#### 映射解析示例

映射解析在 OpenAI 验证外部身份之后开始。
OpenAI 会为所请求的对象查找映射 `identity_provider_id` 中指定的标准 CEL 运算符，
`service_account_id`，跳过未启用的映射，仅评估每个映射所需的
属性，并且仅当恰好有一个启用的映射匹配每个已配置的属性时才会颁发令牌。
当且仅当一个已启用的映射匹配所有已配置的属性。

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

提供方可以派生出一个属性：

```json
[
  {
    "attribute": "openai.repository_ref",
    "expression": "assertion.repository + \"@\" + assertion.ref"
  }
]
```

服务账户映射随后可以同时要求原始属性和派生属性：

| Key                     | Value                                         |
| ----------------------- | --------------------------------------------- |
| `iss`                   | `https://token.actions.githubusercontent.com` |
| `sub`                   | `repo:my-org/my-repo:*`                       |
| `openai.repository_ref` | `my-org/my-repo@refs/heads/main`              |

三个值都必须匹配。该 `sub` 值使用了尾部通配符，因此它
会匹配任何带此前缀的值 `repo:my-org/my-repo:`。这些
`openai.repository_ref` 键来自属性转换，而不是使用该名称的
原始令牌声明。

如果有多个已启用的映射匹配同一交换，OpenAI 将拒绝该请求。OpenAI
会强制每个 `(provider, service account)` 对必须是唯一的映射，
并且不会合并来自不同映射的权限。

### 连接工作负载

在身份提供方指南中使用 SDK 示例 [identity-provider guide](#get-an-identity-token),
或直接调用令牌交换端点。有关请求和响应字段、
授权行为以及当前限制，请参阅
[workload identity token exchange reference](https://developers.openai.com/api/reference/workload-identity-federation).

#### 刷新访问令牌

如果你直接管理令牌交换，请保留 `access_token` 中指定的标准 CEL 运算符， `expires_at`
以便在从令牌服务向应用程序传递凭证时一起使用。
该 `expires_at` 字段是绝对的 UTC 过期时间，以 Unix
时间戳（秒）表示。请在该时间之前安排续期，并留出时钟
差异以及请求延迟。

该 `expires_in` 字段表示令牌自签发以来的有效期（以秒为单位）。例如，
在 12:00 UTC 签发的令牌若 `expires_in: 3600` 则于 13:00 过期
UTC，即使另一个服务在 12:05 UTC 收到它。传输和处理
时间不会延长令牌的生命周期。详见 [response
fields](https://developers.openai.com/api/reference/workload-identity-federation#response) 。

令牌交换不会返回刷新令牌。要续期，请使用有效的外部身份令牌或客户端证书重新执行交换
。

## 将工作负载身份与 Codex 配合使用

在受管的 ChatGPT 工作区中，对可信的 Codex 自动化使用此路径。
Codex 将该工作负载映射到 ChatGPT 用户或服务账号，而不是 API
Platform 服务账户。

Codex 工作负载身份联合目前处于测试阶段，必须为你的
  工作区启用。如需申请访问权限，请联系你的 OpenAI 销售代表，或 [OpenAI
  支持](https://help.openai.com/en/articles/6614161-how-can-i-contact-support).

遵循 [配合工作负载身份使用
Codex](https://developers.openai.com/codex/enterprise/workload-identity) 获取完整的管理员与
运行时操作流程。该指南涵盖特定于提供方的令牌来源、联合规则、
必需的令牌文件配置、凭证优先级、受支持的 Codex
接入面、轮换以及验证方法。针对可选的审计归因，Codex
接受 `OPENAI_WORKLOAD_IDENTITY_CONTEXT`；Codex 指南定义了它的架构、
隐私限制和审计行为。

使用 [Admin
API](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api) 以编程方式管理 Codex
提供方和规则。 [联邦规则
参考](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules)
解释了一个规则如何在映射到一个
ChatGPT 主体时接受多个外部主体。

## 排查连接问题

### OpenAI 拒绝身份令牌

在本地解码令牌并将其中的 `iss`, `aud`, `sub`, `exp`, `iat`）仅适用于 OIDC 提供方。
提供商特有的声明与所配置提供商进行比较。不要将生产环境
令牌粘贴到第三方 JWT 工具中。

对于 OpenAI API，还需将令牌属性与所选服务
账户映射进行比较。对于 Codex，请将其与所选联合规则进行比较。

### The OpenAI API mapping doesn't match

确认请求使用了预期的身份提供方和服务
账户 ID，且映射处于激活状态，并恰好有一条映射匹配。
请参阅 [令牌交换错误参考](https://developers.openai.com/api/reference/workload-identity-federation#token-exchange-errors)
以获取详细的错误类别说明。

### Codex reports incomplete configuration

确认 Codex 进程同时具备所需的工作负载标识环境
变量，并且 `OPENAI_IDENTITY_TOKEN_FILE` 包含当前令牌的绝对路径。请检查文件和父目录的权限。
当前令牌。检查文件和父目录的权限。

### Codex 使用另一种凭据

将两个所需的工作负载身份变量加载到 Codex 进程中。
任一变量的存在都会优先选择 WIF 而非 API 密钥、访问令牌和
存储的登录信息。启动一个新进程并加载下载的配置，然后，
再次运行 `codex login status` 。

## 安全建议

- 为每个应用或工作负载使用专用的主体。
- 隔离生产与非生产环境。
- 优先使用精确的声明匹配，而不是宽泛的模式。
- 仅授予工作负载所需的访问权限。
- 使用较短的访问令牌有效期。
- 审查并移除未使用的提供方、映射和规则。
- 审查令牌交换错误和异常的访问模式。

## 相关文档

- [将工作负载身份与 Codex 配合使用](https://developers.openai.com/codex/enterprise/workload-identity)
- [Codex 联合身份认证规则参考](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules)
- [通过 Admin API 管理 Codex 工作负载身份](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api)
- [工作负载身份令牌交换参考](https://developers.openai.com/api/reference/workload-identity-federation)
- [Codex 身份认证](https://developers.openai.com/codex/auth)
- [Codex 环境变量](https://developers.openai.com/codex/config-file/environment-variables)
- [Codex 非交互模式](https://developers.openai.com/codex/non-interactive-mode)