# Workload identity federation

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

工作负载身份联合让受信的工作负载使用其已有的身份，而
无需存储 OpenAI API 密钥或 ChatGPT 凭证。工作负载
会出示来自你的身份提供方的短期令牌，然后 OpenAI 将其
换为短期 OpenAI 访问令牌。

OpenAI API 工作负载也可以通过以下方式交换经验证的证书身份：
X.509 工作负载身份联合。

你可以在 OpenAI API 或 Codex 中使用工作负载身份联合：

|                                    | OpenAI API                                                       | Codex                                                        |
| ---------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| **OpenAI 身份**                | API Platform 项目中的服务账号                     | 受管 ChatGPT 工作区中的用户或服务账号     |
| **由管理员设置** | OpenAI Platform                                                  | OpenAI Admin Portal                                          |
| **工作负载的连接方式**      | OpenAI SDK 或令牌交换端点                     | Codex 环境变量和身份令牌文件       |
| **访问令牌可使用的范围**  | 映射后的服务账号可用的 API 和权限 | 映射后的工作区主体可用的 Codex 访问权限 |

两条路径使用相同的信任模型，但管理和运行时配置不同。从共享概念和身份提供商开始
配置有所不同。从共享概念和身份提供商入手
参考下方指引，然后按你的工作负载所使用的产品进入对应章节。

- **OpenAI API：** 继续阅读 [将工作负载身份用于 OpenAI
  API](#use-workload-identity-with-the-openai-api).
- **Codex:** 请参阅 [将工作负载身份用于 Codex](#use-workload-identity-with-codex).

请参阅 [Codex
联盟规则
参考](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules) 了解
规则与生命周期行为。

## 工作原理

管理员在工作负载连接之前需要配置三项内容：

1. 一个 **identity provider** 告知 OpenAI 信任哪个外部颁发方以及如何
   验证其已签名的令牌或证书身份。
2. 一个 **access rule** 描述 OpenAI 接受哪些令牌属性以及哪些
   OpenAI 身份工作负载可以充当。OpenAI API 配置将此称为
   服务账号映射。Codex 配置将其称为联合规则。
3. 一个 **OpenAI 主体** 接收最终访问权限。对于 OpenAI API，
   该主体是 Platform 服务账号。对于 Codex，该主体是托管工作区中的
   ChatGPT 用户或服务账号。

在运行时：

1. 工作负载会收到一个短期的 OIDC JWT 或 SPIFFE JWT-SVID，或由 OpenAI
   API 工作负载出示的 X.509 证书。
2. 工作负载使用其所需的 ID 出示其外部身份，
   产品。
3. OpenAI 验证令牌或证书，然后评估配置的
   映射或规则。
4. OpenAI 为映射后的主体返回短期访问令牌。

Token exchange 不会创建 principal、project 或 workspace 成员资格。
管理员会在设置过程中创建或选择这些资源。

<a id="choose-a-setup-guide"></a>

## 获取身份令牌

选择与你的工作负载运行环境对应的指南：



  - **[X.509 证书](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509)**：为 OpenAI API 工作负载配置基于证书的交换。
- **[Kubernetes](https://developers.openai.com/api/docs/guides/workload-identity-federation/kubernetes)**：在自管集群中使用投影的服务账户令牌。
- **[AWS](https://developers.openai.com/api/docs/guides/workload-identity-federation/aws)**：使用出站身份联合或 Amazon EKS 投影令牌。
- **[Microsoft Azure](https://developers.openai.com/api/docs/guides/workload-identity-federation/microsoft-azure)**：使用托管身份令牌或 AKS 投影的服务账户令牌。
- **[Google Cloud](https://developers.openai.com/api/docs/guides/workload-identity-federation/google-cloud)**：使用元数据服务器身份令牌或 GKE 投影的服务账户令牌。
- **[Oracle Cloud Infrastructure](https://developers.openai.com/api/docs/guides/workload-identity-federation/oracle-cloud)**：使用来自 Oracle 身份域的实例主体令牌。
- **[GitHub Actions](https://developers.openai.com/api/docs/guides/workload-identity-federation/github-actions)**：在持续集成工作流中使用 OIDC 令牌。
- **[SPIFFE](https://developers.openai.com/api/docs/guides/workload-identity-federation/spiffe)**：使用由 SPIRE 或兼容提供商颁发的 SPIFFE JWT-SVID。



OpenAI 在文档所述配置中支持 OIDC 兼容的 JWT subject token，包括 SPIFFE JWT-SVID。
对于 OpenAI API，如果你的 OIDC 提供方未列出，请联系 OpenAI
支持。对于 Codex，请在 **Custom OIDC** 中选择
OpenAI 管理门户。

每个 OIDC 提供商指南都会说明如何颁发和检查令牌。对于 Codex，
仅需按照其中的令牌颁发步骤操作，然后返回到
[将工作负载身份与 Codex 配合使用](#use-workload-identity-with-codex)。这些
指南中的 OpenAI 设置和 SDK 示例适用于 OpenAI API 路径。X.509
联合身份验证仅支持 OpenAI API 路径。

## 在 OpenAI API 中使用工作负载身份

当你的工作负载直接调用 OpenAI API 时使用此路径。你需要
拥有管理 Workload Identity Provider 和服务账号映射的
权限。

前往 [Organization Settings > Security > Workload Identity Provider](https://platform.openai.com/settings/organization/security/workload-identity-provider).
先创建 provider，然后从 provider 详情页面
配置其服务账号映射。

### X.509 providers

X.509 提供方从客户端证书派生工作负载身份属性，由 OpenAI 根据你组织的现有 Mutual TLS 配置进行验证。它不存储证书，也不维护独立的信任库。

在创建提供方之前，请先配置并激活用于锚定你的客户端证书的可信证书
，路径为 [Organization Settings > Security >
Mutual TLS](https://platform.openai.com/settings/organization/security/mtls).
该 [Mutual TLS 指南](https://developers.openai.com/api/docs/guides/mutual-tls) 说明了相关权限，
证书要求、激活范围、mTLS 主机、证书链
行为、CEL 过滤器以及轮换。

接下来，创建 X.509 提供方，派生一个非空 `openai.subject` 值，并将该身份映射到仅具有工作负载所需权限的项目服务账号。工作负载向 X.509 令牌端点出示其证书以获取短期持有者令牌，然后将该持有者令牌和一个可接受的客户端证书一起发送到 API mTLS 端点。

请参阅 [X.509 证书设置指南](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 以了解完整的控制台和请求流程。

### 配置 OIDC 工作负载身份提供方

为每个你信任的外部颁发方创建一个工作负载身份提供者。OpenAI
API 工作负载身份支持 OIDC JWT 主体令牌。其配置
包括：

| Option                                   | Description                                                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 名称                                     | 你组织中 Workload Identity Provider 的唯一名称。                                                                                       |
| OIDC Issuer URL                          | 预期的 OIDC issuer URL。Issuer 比较会忽略末尾的斜杠。                                                                                    |
| Audience                                 | 外部 subject token 上预期的 `aud` claim。                                                                                                      |
| Description                              | Workload Identity Provider 的可选描述。                                                                                                     |
| 为 OIDC 发现使用自定义 URL        | 启用后，OpenAI 会从一个公共 HTTPS URL 获取 OIDC 发现元数据，该 URL 可以与 token issuer 不同。                                          |
| 自定义 OIDC 发现 URL                | 启用自定义发现时使用的发现基础 URL 或完整的 `/.well-known/openid-configuration` URL。                                            |
| 使用上传的 JWKS 进行 token 验证 | 启用后，OpenAI 会使用上传的 JWKS 验证 token，而不是从 OIDC 发现获取密钥。                                                  |
| JWKS JSON                                | 启用上传的 JWKS 验证时使用的已上传公共 JWKS 对象。JWKS 必须包含一个非空的 `keys` 数组，并且不包含任何私钥材料。 |
| 属性转换                | 可选的 CEL 表达式，用于从令牌声明中派生自定义 `openai.*` 属性，以便进行映射决策。                                                   |

自定义 OIDC 发现与上传的 JWKS 互斥。启用
自定义发现会隐藏上传的 JWKS 选项。自定义发现 URL 必须
使用公共 HTTPS，且不能包含凭据、自定义端口、查询参数或
片段。

如果 **"使用自定义 URL 进行 OIDC 发现"** 未在你的控制台中显示，请使用
标准 OIDC 发现或启用 **"使用上传的 JWKS 进行令牌验证"**
代替。请使用你的身份提供商发布的公共 JWKS，并在提供商
轮换其签名密钥时进行更新。

当令牌签发方与发现主机不同时，请将 **OIDC 签发方 URL** 设置为
令牌的 `iss` 声明，并将 **自定义 OIDC 发现 URL** 设置为发布
该提供商发现文档的主机。OpenAI 仍会根据已配置的签发方校验令牌；自定义 URL 仅决定从何处获取发现
文档的位置。
元数据和公开签名密钥。

#### 使用 CEL 转换令牌声明

属性转换使用 Common Expression Language (CEL)。OpenAI
支持
[langdef.md](https://github.com/google/cel-spec/blob/master/doc/langdef.md) 中指定的标准 CEL 运算符，
且未添加自定义的工作负载身份联合函数。每个表达式
接收一个根对象：

- `assertion`: 已验证的 JWT 声明集合。

仪表板会自动应用 `openai.` 前缀。请输入
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
使用如下表达式读取声明值 `assertion.sub` 或
`assertion.repository`。不支持的语法或函数会导致映射失败
resolution.

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

Transformation results must be scalar values: strings, `true` 或 `false`
values, integers, or finite numbers. Arrays, objects, null values, and
evaluation errors fail mapping resolution. OpenAI converts scalar
transformation results to strings before comparing them to mapping values. For
example, `true` becomes `"true"` 中指定的标准 CEL 运算符， `7` becomes `"7"`.

Mapping keys that start with `openai.` resolve only from attribute
transformations. Raw subject token claims that already use an `openai.` prefix
除非你配置了匹配的变换，否则不会影响映射决策。

#### 管理 JWKS 和密钥轮换

OpenAI 使用在以下位置配置的身份源密钥验证 OIDC subject 令牌
Workload Identity Provider：

- **OIDC 发现：** OpenAI 获取颁发者的
  `/.well-known/openid-configuration`，然后获取发现的 `jwks_uri`.
  OpenAI 会对发现文档和远程 JWKS 负载缓存 600 秒。
- **自定义 OIDC 发现：** OpenAI 获取
  `/.well-known/openid-configuration` 来自已配置的自定义发现基础
  URL，然后获取发现的 `jwks_uri`。token 的 `iss` 声明必须
  仍然匹配 **OIDC Issuer URL**.
- **未命中时刷新密钥：** 如果某个 token `kid` 在缓存的 JWKS 中未找到，
  OpenAI 会刷新 JWKS 并在拒绝该
  token 之前再次尝试查找。
- **上传的 JWKS：** 当 **使用上传的 JWKS 进行 token 验证** is
  enabled，OpenAI 使用存储在提供商上的已上传 JWKS，不会
  执行 OIDC 发现或远程 JWKS 获取。在提供商更新可
  用于令牌交换后，新的交换将使用已保存的 JWKS。
- **密钥集：** 一个 JWKS 可以包含多个公钥。每个密钥必须具有
  唯一且非空的 `kid`.

在签名密钥轮换期间，请在签发方的
JWKS 中同时发布新旧公钥。这样，由旧密钥签名的令牌可以继续
使用，同时 OpenAI 可以接受由新密钥签名的令牌。对于上传的 JWKS，
请在使用新密钥签发令牌之前更新提供方 `kid`；OpenAI 将拒绝
由已配置 JWKS 中不存在的密钥签发的令牌。

<a id="configure-service-account-mappings"></a>

### 配置服务账号映射

服务账户映射定义了哪些外部身份可以为其铸造访问
令牌，用于 OpenAI 服务账户。

对于 X.509 提供商，映射键使用派生的 `openai.*` 属性。建议使用精确的
映射。 `openai.subject` 原始 JWT 声明（例如 `sub`, `aud`），以及 `iss`
仅适用于 OIDC 提供商。

其配置包括：

| Option          | Description                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 名称            | 在 Workload Identity Provider 中映射的唯一名称。                                                                                         |
| Key             | 要匹配的属性键。使用原始 token 声明，例如 `sub`, `aud`，或 `iss`，或派生属性，例如 `openai.subject`.                             |
| Value           | 在 OpenAI 签发 token 之前必须匹配的属性值。                                                                                            |
| Description     | 映射的可选描述。                                                                                                                        |
| Project         | 拥有目标服务账号的项目。                                                                                                            |
| Service account | 工作负载可使用的服务账号。你可以在所选项目中创建新的服务账号，或选择现有的服务账号。                |
| Permissions     | 可选的 API 权限，用于进一步收窄从此映射铸造的访问令牌。这些权限不能授予超出映射服务账号范围的访问权限。 |

属性值必须是标量 JSON 值。字符串值可以在末尾使用一个带有非空前缀的
通配符，例如 `repo:example/*`。单独的通配符
或位于值中间的通配符不受支持。

有效的通配符值：

- `repo:openai/*`
- `repository:my-org/*`

无效的通配符值：

- `*`
- `repo:*:prod`
- `repo/*/main`

控制台会将映射限制显示为 **Permissions**。Token 交换
响应会在以下字段中暴露与 OAuth 范围相同的限制： `scope`
属性。映射不能包含 Admin API 范围，常规的下游 API
授权仍然适用。

#### 映射解析示例

映射解析在 OpenAI 验证外部身份之后开始。
OpenAI 会查找所请求的映射 `identity_provider_id` 中指定的标准 CEL 运算符，
`service_account_id`，跳过未启用的映射，仅评估每个映射所需的
属性，并且仅当恰好有一个已启用映射匹配所有配置的属性时才会签发令牌。
已启用映射匹配每一个配置的属性。

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

提供者可以派生出一个属性：

```json
[
  {
    "attribute": "openai.repository_ref",
    "expression": "assertion.repository + \"@\" + assertion.ref"
  }
]
```

然后，服务账号映射可以同时要求原始属性和派生属性：

| Key                     | Value                                         |
| ----------------------- | --------------------------------------------- |
| `iss`                   | `https://token.actions.githubusercontent.com` |
| `sub`                   | `repo:my-org/my-repo:*`                       |
| `openai.repository_ref` | `my-org/my-repo@refs/heads/main`              |

三个值都必须匹配。该 `sub` 值使用了尾部通配符，因此它
会匹配任何带有此前缀的值。 `repo:my-org/my-repo:`。这些
`openai.repository_ref` 键从属性转换中解析，而不是从
同名的原始令牌声明中解析。

如果有多个已启用映射匹配同一个交换，OpenAI 会拒绝它。OpenAI
为每个 `(provider, service account)` 对强制唯一映射，并且
不会合并来自不同映射的权限。

### 连接工作负载

在你的身份提供商指南中使用 SDK 示例， [身份提供商指南](#get-an-identity-token),
或直接调用令牌交换端点。有关请求和响应字段、
授权行为以及当前限制，请参阅
[工作负载身份令牌交换参考](https://developers.openai.com/api/reference/workload-identity-federation).

#### 刷新访问令牌

如果你直接管理令牌交换，请在将凭据从令牌服务传递到应用程序时保持 `access_token` 中指定的标准 CEL 运算符， `expires_at`
它们在一起。
该 `expires_at` 字段是一个绝对的 UTC 过期时间，以 Unix
时间戳（秒）表示。请在该时间之前安排续期，并预留出时钟
差异和请求延迟的余量。

该 `expires_in` 字段是令牌自签发起的有效期，以秒为单位。例如，
在 UTC 12:00 签发的令牌，其 `expires_in: 3600` 为 13:00
UTC，即使另一个服务在 UTC 12:05 收到它也是如此。传输和处理
时间不会延长令牌的有效期。详见 [响应
字段](https://developers.openai.com/api/reference/workload-identity-federation#response) 说明。

令牌交换不会返回刷新令牌。若要续期，请使用有效的外部身份令牌或客户端证书重复执行
交换。

## 将工作负载身份与 Codex 配合使用

在受管的 ChatGPT 工作区中，对受信任的 Codex 自动化使用此路径。
Codex 将工作负载映射到 ChatGPT 用户或服务账号，而非 API
平台服务账号。

Codex 工作负载身份联合处于测试阶段，必须为你的
  工作区启用。要申请访问权限，请联系你的 OpenAI 代表或 [OpenAI
  支持团队](https://help.openai.com/en/articles/6614161-how-can-i-contact-support).

该 [联盟规则
参考](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules)
解释了单条规则如何在映射到一个
ChatGPT 主体的同时接受多个外部主体。

## 排查连接问题

### OpenAI 拒绝身份令牌

在本地解码该令牌并将其 `iss`, `aud`, `sub`, `exp`, `iat`），以及
针对提供商的特定声明与所配置提供商进行核对。不要将生产环境下的
令牌粘贴到第三方 JWT 工具中。

对于 OpenAI API，还需将令牌属性与所选服务
账号映射进行核对。对于 Codex，则将其与所选联合规则进行核对。

### OpenAI API 映射不匹配

确认请求使用了预期的身份提供方和服务账户 ID
确认映射处于活动状态，且恰好有一条匹配项。
请参阅 [token exchange error reference](https://developers.openai.com/api/reference/workload-identity-federation#token-exchange-errors)
以获取详细的错误类别信息。

### Codex 报告配置不完整

确认 Codex 进程同时具有所需的工作负载身份环境
变量,并且 `OPENAI_IDENTITY_TOKEN_FILE` 包含指向
当前 token 的绝对路径。检查该文件及其父目录的权限。

### Codex 使用另一套凭据

将两个必需的工作负载身份变量加载到 Codex 进程中。
存在任一变量时，将优先选择 WIF 而非 API 密钥、访问令牌和
已存储的登录信息。启动一个新进程并加载已下载的配置，
然后再次运行 `codex login status` 。

## 安全建议

- 为每个应用或工作负载使用专用的主体。
- 将生产环境与非生产环境分开。
- 优先使用精确的声明匹配，而不是宽泛的模式。
- 仅授予工作负载所需的访问权限。
- 使用较短的访问令牌生命周期。
- 审查并移除未使用的提供方、映射和规则。
- 审查令牌交换错误和意外的访问模式。

## 相关文档

- [Codex federation rule reference](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules)
- [Workload identity token exchange reference](https://developers.openai.com/api/reference/workload-identity-federation)
- [Codex authentication](https://developers.openai.com/codex/auth)
- [Codex environment variables](https://developers.openai.com/codex/config-file/environment-variables)
- [Codex non-interactive mode](https://developers.openai.com/codex/non-interactive-mode)