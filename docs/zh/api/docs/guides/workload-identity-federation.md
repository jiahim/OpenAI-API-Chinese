# 工作负载身份联合

> 完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

工作负载身份联合允许可信工作负载使用它已有的身份
，而不是存储 OpenAI API 密钥或 ChatGPT 凭据。该工作负载
会出示来自你的身份提供者的短期令牌，OpenAI 会将其交换
为短期 OpenAI 访问令牌。

OpenAI API 工作负载还可以通过
X.509 工作负载身份联合测试版交换经过验证的证书身份。

你可以将工作负载身份联合与 OpenAI API 或 Codex 结合使用：

|                                    | OpenAI API                                                       | Codex                                                        |
| ---------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| **OpenAI 身份**                | API Platform 项目中的服务账号                     | 托管 ChatGPT 工作区中的用户或服务账号     |
| **由管理员进行设置的位置** | OpenAI Platform                                                  | OpenAI Admin Portal                                          |
| **工作负载的连接方式**      | OpenAI SDK 或令牌交换端点                     | Codex 环境变量和身份令牌文件       |
| **访问令牌可用范围**  | 映射服务账号可用的 API 和权限 | 映射工作区主体可用的 Codex 访问权限 |

两条路径使用相同的信任模型，但它们的配置管理和运行时
配置有所不同。首先阅读下面的共享概念和身份提供者
指南，然后按照你的工作负载所使用的产品的相应章节操作。

- **OpenAI API：** 继续阅读 [将工作负载身份与 OpenAI 结合使用
  API](#use-workload-identity-with-the-openai-api).
- **Codex：** 遵循 [将工作负载身份与
  Codex](https://developers.openai.com/codex/enterprise/workload-identity) 以获取完整的 Admin Portal 和
  运行时设置。

管理员还可以 [通过 Admin
API](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api)。管理 Codex 提供方和规则。参见 [Codex
联合规则
参考](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules) ，了解
规则和生命周期行为。

## 工作原理

管理员在工作负载连接之前配置三件事：

1. 一个 **身份提供方** 告诉OpenAI信任哪个外部签发方以及
   如何验证其签名令牌或证书身份。
2. 一个 **访问规则** 描述OpenAI接受哪些令牌属性以及
   OpenAI身份工作负载可以充当哪些角色。OpenAI API配置将其称为
   服务账户映射。Codex 配置将其称为联合规则。
3. 一个 **OpenAI主体** 接收最终访问权限。对于OpenAI API，
   主体是 Platform 服务账户。对于 Codex，主体是
   托管工作区中的 ChatGPT 用户或服务账户。

在运行时：

1. 工作负载接收短期 OIDC JWT 或 SPIFFE JWT-SVID，或 OpenAI
   API 工作负载出示 X.509 证书。
2. 工作负载以其产品所需的 ID 出示其外部身份，
   以匹配产品。
3. OpenAI 验证令牌或证书，然后评估配置的
   映射或规则。
4. OpenAI 返回映射主体的短期访问令牌。

令牌交换永远不会创建主体、项目或工作区成员资格。
管理员在设置期间创建或选择这些资源。

<a id="choose-a-setup-guide"></a>

## 获取身份令牌

选择与你工作负载运行环境对应的指南：



  - **[X.509 证书（测试版）](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509)**：使用 X.509 测试版配置证书背书交换。
- **[Kubernetes](https://developers.openai.com/api/docs/guides/workload-identity-federation/kubernetes)**：在自管理集群中使用投射服务账户令牌。
- **[AWS](https://developers.openai.com/api/docs/guides/workload-identity-federation/aws)**：使用出站身份联合或 Amazon EKS 投射令牌。
- **[Microsoft Azure](https://developers.openai.com/api/docs/guides/workload-identity-federation/microsoft-azure)**：使用托管身份令牌或 AKS 投射服务账户令牌。
- **[Google Cloud](https://developers.openai.com/api/docs/guides/workload-identity-federation/google-cloud)**：使用元数据服务器身份令牌或 GKE 投射服务账户令牌。
- **[Oracle Cloud Infrastructure](https://developers.openai.com/api/docs/guides/workload-identity-federation/oracle-cloud)**：使用来自 Oracle 身份域实例主体令牌。
- **[GitHub Actions](https://developers.openai.com/api/docs/guides/workload-identity-federation/github-actions)**：在持续集成工作流中使用 OIDC 令牌。
- **[SPIFFE](https://developers.openai.com/api/docs/guides/workload-identity-federation/spiffe)**：使用由 SPIRE 或兼容提供方签发的 SPIFFE JWT-SVID。



OpenAI 支持文档中所述配置中符合 OIDC 标准的 JWT 主题令牌
，包括 SPIFFE JWT-SVID。对于 OpenAI API，如果你的 OIDC 提供商未列出，请联系 OpenAI
支持。对于 Codex，请选择 **Custom OIDC** 中的
OpenAI Admin Portal。

每个 OIDC 提供商指南都说明了如何签发和检查令牌。对于 Codex，
仅遵循这些令牌签发步骤，然后返回
[Use workload identity with Codex](#use-workload-identity-with-codex)。指南中的
OpenAI 设置和 SDK 示例适用于 OpenAI API 路径。X.509
联合仅支持 OpenAI API 路径。

## 将工作负载身份与 OpenAI API 配合使用

当你的工作负载直接调用 OpenAI API 时使用此路径。你必须
是组织所有者才能配置它。

前往 [组织设置 > 安全 > 工作负载身份提供者](https://platform.openai.com/settings/organization/security/workload-identity-provider).
先创建提供者，然后从
提供者详情页面配置其服务账号映射。

### X.509 提供商（测试版）

X.509 工作负载身份联合目前处于测试阶段。如果 X.509 没有
  显示为提供者类型，请联系你的系统管理员。你的
  管理员可以与 OpenAI 协作，为你的组织启用该测试版。

X.509 提供者从客户端证书中派生工作负载身份属性，OpenAI 会针对你组织的现有 Mutual TLS 配置验证该证书。它不存储证书，也不维护单独的信任库。

在创建提供者之前，请配置并激活将你的客户端证书锚定的受信任 CA 证书，该操作在 [组织设置 > 安全 > Mutual TLS](https://platform.openai.com/settings/organization/security/mtls)。中进行。关于 [OpenAI Mutual TLS 测试计划](https://help.openai.com/en/articles/10876024-openai-mutual-tls-beta-program) 说明了证书要求、激活范围、受支持的 API 端点、证书链行为以及客户端配置限制。

接下来，创建 X.509 提供者，派生一个非空 `openai.subject` 值，并将该身份映射到项目服务账号，仅授予工作负载所需的权限。工作负载将其证书呈现给 X.509 令牌端点以获取短期持有者令牌，然后将持有者令牌和可接受的客户端证书发送到 API 的 mTLS 端点。

遵循 [X.509 证书设置指南](https://developers.openai.com/api/docs/guides/workload-identity-federation/x509) 了解完整的仪表板和请求流程。

### 配置 OIDC 工作负载身份提供程序

为你信任的每个外部颁发者创建一个工作负载身份提供程序。 OpenAI
API 工作负载身份支持 OIDC JWT 主题令牌。其配置
包括：

| 选项                                   | 描述                                                                                                                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 名称                                     | 你所在组织中工作负载身份提供程序的唯一名称。                                                                                       |
| OIDC 签发者 URL                          | 预期的 OIDC 签发者 URL。签发者比较会忽略尾部斜杠。                                                                                    |
| 受众                                 | 外部主题令牌上预期的 `aud` 声明。                                                                                                      |
| 描述                              | 工作负载身份提供程序的可选描述。                                                                                                     |
| 为 OIDC 发现使用自定义 URL        | 启用后，OpenAI 从可不同于令牌签发者的公共 HTTPS URL 获取 OIDC 发现元数据。                                          |
| 自定义 OIDC 发现 URL                | 启用自定义发现时使用的发现基 URL 或完整 `/.well-known/openid-configuration` URL。                                            |
| 使用上传的 JWKS 进行令牌验证 | 启用后，OpenAI 将针对上传的 JWKS 验证令牌，而不是从 OIDC 发现获取密钥。                                                  |
| JWKS JSON                                | 启用上传的 JWKS 验证时使用的已上传公共 JWKS 对象。JWKS 必须包含非空的 `keys` 数组，且不包含私钥材料。 |
| 属性转换                | 可选的 CEL 表达式，用于从令牌声明中 `openai.*` 派生自定义属性，以辅助映射决策。                                                   |

自定义 OIDC 发现和上传的 JWKS 互斥。启用
自定义发现会隐藏上传的 JWKS 选项。自定义发现 URL 必须
使用公共 HTTPS，不能包含凭据、自定义端口、查询或
片段。

如果 **为 OIDC 发现使用自定义 URL** 未出现在你的仪表盘中，请使用
标准 OIDC 发现或启用 **使用上传的 JWKS 进行令牌验证**
。请使用你的身份提供者发布的公共 JWKS，并在提供者轮换其签名密钥时更新它
。

当令牌签发者和发现主机不同时，设置 **OIDC 签发者 URL** 为
令牌的 `iss` 声明，并将 **自定义 OIDC 发现 URL** 设置为发布
提供者发现文档的主机。OpenAI 仍会根据
配置的签发者检查令牌；自定义 URL 仅决定其获取发现文档的位置
元数据和公开签名密钥。

#### 使用 CEL 转换令牌声明

属性转换使用通用表达式语言（CEL）。OpenAI
支持标准 CEL 运算符，详见
[langdef.md](https://github.com/google/cel-spec/blob/master/doc/langdef.md) 且
不添加自定义工作负载身份联合函数。每个表达式
接收一个根对象：

- `assertion`：已验证的 JWT 声明集。

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
通过表达式读取声明值，例如 `assertion.sub` 或
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
值、整数或有限数字。数组、对象、空值和
求值错误会导致映射解析失败。OpenAI 会将标量
转换结果转换为字符串，然后再与映射值进行比较。例如
， `true` 变为 `"true"` 和 `7` 变为 `"7"`.

以 `openai.` 开头的映射键
仅从属性转换中解析。原始的subject令牌声明中已经使用 `openai.` 前缀
的不会影响映射决策，除非你配置了匹配的转换。

#### 管理 JWKS 和密钥轮换

OpenAI 使用在工作负载身份提供者上配置的密钥源验证 OIDC 主题令牌：
工作负载身份提供者：

- **OIDC 发现：** OpenAI 获取签发者的
  `/.well-known/openid-configuration`，然后获取发现的 `jwks_uri`.
  OpenAI 将发现文档和远程 JWKS 负载缓存 600 秒。
- **自定义 OIDC 发现：** OpenAI 获取
  `/.well-known/openid-configuration` 来自已配置的自定义发现基
  URL，然后获取发现的 `jwks_uri`。令牌的 `iss` 声明必须
  仍然匹配 **OIDC 签发者 URL**.
- **未命中时刷新密钥：** 如果令牌 `kid` 未在缓存的 JWKS 中找到，
  OpenAI 会刷新 JWKS 并再次尝试查找，然后再拒绝该
  令牌。
- **上传的 JWKS：** 当 **使用上传的 JWKS 进行令牌验证** 已启用时，OpenAI 使用提供商上存储的上传 JWKS，而不
  执行 OIDC 发现或远程 JWKS 获取。提供商更新
  可供令牌交换使用后，新的交换将使用保存的 JWKS。
  密钥集：
- **一个 JWKS 可以包含多个公钥。每个密钥必须具有：** 唯一、非空的
  唯一、非空的 `kid`.

在签名密钥轮换期间，在颁发者中同时发布旧公钥和新公钥
JWKS 在轮换窗口内。这可以让旧密钥签发的令牌保持
有效，OpenAI 接受新密钥签发的令牌。对于上传的 JWKS，
在签发使用新密钥的令牌之前更新提供方 `kid`；OpenAI 拒绝
由配置的 JWKS 中不存在的密钥签发的令牌。

<a id="configure-service-account-mappings"></a>

### 配置服务账号映射

服务账号映射定义了哪些外部身份可以签发访问
令牌给一个 OpenAI 服务账号。

对于 X.509 提供商，映射键使用派生的 `openai.*` 属性。优先使用
精确 `openai.subject` 映射。原始 JWT 声明，如 `sub`, `aud`，以及 `iss`
仅适用于 OIDC 提供商。

其配置包括：

| 选项          | 描述                                                                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 名称            | 工作负载身份提供程序中映射的唯一名称。                                                                                         |
| 键             | 要匹配的属性键。使用原始令牌声明，如 `sub`, `aud`，或 `iss`，或派生属性如 `openai.subject`.                             |
| 值           | 在OpenAI签发令牌之前必须匹配的属性值。                                                                                            |
| 描述     | 映射的可选描述。                                                                                                                        |
| 项目         | 拥有目标服务账户的项目。                                                                                                            |
| 服务账户 | 工作负载可以使用的服务账户。你可以在所选项目中创建新的服务账户，或选择现有的服务账户。                |
| 权限     | 可选的API权限，可进一步限制从此映射铸造的访问令牌。这些权限不能授予超出所映射服务账户的访问权限。 |

属性值必须是标量 JSON 值。字符串值可以使用一个尾随
通配符，且前缀非空，例如 `repo:example/*`。单独的通配符
或位于值中间的通配符不受支持。

有效的通配符值：

- `repo:openai/*`
- `repository:my-org/*`

不支持的通配符值：

- `*`
- `repo:*:prod`
- `repo/*/main`

仪表盘将映射限制显示为 **权限**。令牌交换
响应暴露与 OAuth 范围相同的限制，详见 `scope`
属性。映射不能包含 Admin API 范围，且正常的下游 API
授权仍然适用。

#### 映射解析示例

映射解析在 OpenAI 验证外部身份后开始。
OpenAI 查找所请求的映射 `identity_provider_id` 和
`service_account_id`，跳过未启用的映射，仅评估每个映射所需的
属性，并且仅当恰好一个
启用的映射匹配所有配置的属性时才签发令牌。

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

提供商可以派生一个属性：

```json
[
  {
    "attribute": "openai.repository_ref",
    "expression": "assertion.repository + \"@\" + assertion.ref"
  }
]
```

服务账户映射随后可以要求同时具备原始属性和派生属性：

| 键                     | 值                                         |
| ----------------------- | --------------------------------------------- |
| `iss`                   | `https://token.actions.githubusercontent.com` |
| `sub`                   | `repo:my-org/my-repo:*`                       |
| `openai.repository_ref` | `my-org/my-repo@refs/heads/main`              |

所有三个值必须匹配。 `sub` 值使用尾部通配符，因此它
匹配任何具有该前缀的值 `repo:my-org/my-repo:`。
`openai.repository_ref` 键从属性转换中解析，而不是来自
具有该名称的原始令牌声明。

如果多个启用的映射匹配一次交换，OpenAI 会拒绝它。OpenAI
强制每个 `(provider, service account)` 对使用唯一映射，并且
不会组合来自不同映射的权限。

### 连接工作负载

在你的 [身份提供商指南](#get-an-identity-token),
中使用SDK示例，或直接调用令牌交换端点。关于请求和响应字段、
授权行为及当前限制，请参阅
[工作负载身份令牌交换参考](https://developers.openai.com/api/reference/workload-identity-federation).

## 将工作负载身份与 Codex 结合使用

在托管的 ChatGPT 工作区中使用此路径进行受信任的 Codex 自动化。
Codex 将工作负载映射到 ChatGPT 用户或服务账户，而不是 API
平台服务账户。

Codex 工作负载身份联邦处于测试阶段，必须为你的
  工作区启用。要请求访问权限，请联系你的 OpenAI 代表或 [OpenAI
  支持](https://help.openai.com/en/articles/6614161-how-can-i-contact-support).

关注 [将工作负载身份与
Codex](https://developers.openai.com/codex/enterprise/workload-identity) 配合使用，了解完整的管理员和
运行时流程。它涵盖了特定于提供程序的令牌源、联合规则、
所需的令牌文件配置、凭据优先级、受支持的 Codex
表面、轮换和验证。对于可选的审计归因，Codex
接受 `OPENAI_WORKLOAD_IDENTITY_CONTEXT`; Codex 指南定义了其模式、
隐私限制和审计行为。

使用 [管理
API](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api) 以编程方式管理 Codex
提供商和规则。该 [联合规则
参考](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules)
说明了如何让一条规则在映射到一个
ChatGPT 主体的同时，接受多个外部主体。

## 排查连接问题

### OpenAI 拒绝身份令牌

在本地解码令牌，并将其 `iss`, `aud`, `sub`, `exp`, `iat`，与
提供商特定的声明与配置的提供商进行比较。不要将生产环境中的
令牌粘贴到第三方 JWT 工具中。

对于 OpenAI API，还需将令牌属性与所选服务
账户映射进行比较。对于 Codex，将它们与所选联合规则进行比较。

### OpenAI API 映射不匹配

确认请求使用预期的身份提供商和服务
账户 ID，映射处于活动状态，并且恰好有一条映射匹配。
参见 [令牌交换错误参考](https://developers.openai.com/api/reference/workload-identity-federation#token-exchange-errors)
了解详细的错误类别。

### Codex 报告配置不完整

确认 Codex 进程具备所需的工作负载身份环境
变量，并且 `OPENAI_IDENTITY_TOKEN_FILE` 包含指向
当前令牌的绝对路径。检查文件和父目录的权限。

### Codex 使用另一种凭据

将两个必需的工作负载身份变量加载到 Codex 进程中。
任一变量的存在都会优先选择 WIF，而非 API 密钥、访问令牌和
已存储的登录信息。使用已加载的下载配置启动新进程，
然后运行 `codex login status` 。

## 安全建议

- 为每个应用或工作负载使用专用主体。
- 分离生产环境与非生产环境。
- 优先使用精确声明匹配而非宽泛模式。
- 仅授予工作负载所需的访问权限。
- 使用短生命周期的访问令牌。
- 审查并移除未使用的提供程序、映射和规则。
- 审查令牌交换错误和意外的访问模式。

## 相关文档

- [将工作负载身份与 Codex 配合使用](https://developers.openai.com/codex/enterprise/workload-identity)
- [Codex 联合规则参考](https://developers.openai.com/api/docs/guides/workload-identity-federation/federation-rules)
- [使用管理 API 管理 Codex 工作负载身份](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api)
- [工作负载身份令牌交换参考](https://developers.openai.com/api/reference/workload-identity-federation)
- [Codex 认证](https://developers.openai.com/codex/auth)
- [Codex 环境变量](https://developers.openai.com/codex/config-file/environment-variables)
- [Codex 非交互模式](https://developers.openai.com/codex/non-interactive-mode)