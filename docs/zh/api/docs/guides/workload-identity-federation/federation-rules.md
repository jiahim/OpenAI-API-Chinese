# Codex federation rule reference

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

一条联合规则决定哪些已验证的工作负载身份可以充当一个
ChatGPT 用户或服务账号。OpenAI 仅评估由
Codex 进程命名的规则。它不会搜索每条规则来寻找匹配项。

每条规则有一个目标主体，并可接受一个或多个上游
身份。若要在一条规则中接受一组主体，可使用尾部前缀
主体或 CEL 条件。你也可以为同一
主体创建多条规则。

有关设置步骤，请参阅 [将工作负载身份与
Codex](https://developers.openai.com/codex/enterprise/workload-identity)。配合使用。要通过代码管理规则，请参阅
[workload identity Admin
API](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api).

## 规则模型

| 部分                  | 用途                                                         |
| --------------------- | --------------------------------------------------------------- |
| Provider              | 定义 OpenAI 所信任的颁发方和签名密钥。              |
| Workspace             | 将生成的访问权限限制在一个托管的 ChatGPT workspace 内。   |
| Principal             | 在该 workspace 中选择一个现有用户或服务账户。 |
| Identity checks       | 限制哪些已验证的身份令牌可以使用该规则。       |
| Scopes                | 可选择地收窄现有的 Codex OAuth 范围。              |
| Access token lifetime | 将 OpenAI 访问令牌限制为 60 到 3,600 秒。     |

主体及其工作区成员资格必须在交换之前存在。换句话说，规则不会在
工作负载连接时自动创建用户、服务账号或成员资格。

## 身份校验如何组合

一条规则可以使用以下检查：

| 检查              | 行为                                                              | 使用场景                                               |
| ------------------ | --------------------------------------------------------------------- | -------------------------------------------------------- |
| 主体            | 完全匹配 `sub` 值或一个末尾 `*` 前缀。                         | 一个工作负载身份或受控的主体命名空间。 |
| 受众 | 一到 32 个受众字符串。令牌必须至少包含一个。 | 专为 OpenAI 颁发的令牌。                   |
| 精确声明       | 最多 32 个精确的顶级标量声明值。                         | 稳定的字符串、数字、true/false 值或 null。     |
| CEL 条件      | 针对已验证声明映射的布尔表达式，名称为 `assertion`.   | 列表、嵌套声明或一组允许的值。        |

至少设置一个 subject、exact-claim 或 CEL 检查。仅指定一个接受的
受众不足以识别工作负载。如果你配置了多种
检查类型，则每种都必须通过。

提供商验证先进行。规则无法覆盖提供商的
颁发者、签名、过期时间、断言生命周期、重放或提供商级别的 CEL
检查。

## Subject matching

当存在一个稳定的标识符能唯一标识该工作负载时，请使用精确的主题 `sub` ：

```text
repo:example-company/payments:environment:production
```

一个尾部 `*` 执行前缀匹配：

```text
system:serviceaccount:production:codex-*
```

通配符必须是最后一个字符，并且必须跟在非空前缀之后。
OpenAI 不接受 `*`, `repo:*:production`，或者 `repo/*/main`.

当一个更稳定的声明能够区分特权
工作负载时，不要使用宽泛的前缀。例如，GitHub 规则应当匹配仓库、
工作流 文件、ref 或受保护的环境，而不是某个组织拥有的所有仓库
。

## 精确声明

精确匹配在不转换类型的情况下比较顶层 JWT claims。字符串仅匹配相同的字符串，布尔值仅匹配相同的布尔值，A
数字仅匹配相同的数字，依此类推。
并且数字必须与相同的数值匹配。不支持将列表和对象用作精确值。
。

例如：

```json
{
  "repository": "example-company/payments",
  "ref": "refs/heads/main",
  "environment": "production"
}
```

不要将 `sub` 包含在精确声明映射中。请使用 subject 字段或 CEL。
对嵌套的提供商声明和列表成员关系使用 CEL。

## CEL 条件

CEL 条件接收完整的已验证 JWT 声明映射作为 `assertion` 并
必须返回 `true` 或 `false`。OpenAI 支持有界的 CEL 子集，因此规则
求值过程保持可预测。

若要在一条规则中允许一组精确的主体：

```text
assertion.sub in [
  "repo:example-company/payments:environment:production",
  "repo:example-company/billing:environment:production"
]
```

若要求一个仓库以及两个引用之一：

```text
assertion.repository == "example-company/payments" &&
assertion.ref in ["refs/heads/main", "refs/heads/release"]
```

若要读取嵌套或可选声明：

```text
has(assertion.environment) &&
assertion.environment == "production"
```

受支持的工具包括 `has`, `size`, `contains`, `startsWith`，以及
`endsWith`。正则表达式匹配、诸如
`all` 或 `exists`，之类的集合迭代宏、任意函数，以及除 `assertion`
以外的标识符均不受支持。请保持表达式简洁，在能表达相同策略时优先使用精确检查。
能够表达相同的策略时，优先使用精确检查。

缺失的声明、不受支持的操作、非布尔结果或求值错误
会拒绝此次交换。

## 受众匹配

提供商可以设置一个预期受众（audience）。规则也可以改为设置一个或多个
可接受的受众。当规则的受众列表存在时，令牌中
的声明 `aud` claim 必须出现在该列表中。

如果你的提供商支持，请为 OpenAI 使用专用受众。SPIFFE
JWT-SVID 规则必须设置一个被接受的 audience。如果 OIDC 提供方未定义提供商级 audience，OIDC 规则也必须设置一个。
提供商级 audience。

Audience 匹配和身份检查是可累加的。匹配的 audience 并不能
弥补未通过的 subject、精确声明或 CEL 检查。

## 主体基数

一条规则恰好映射到一个主体：

```text
many accepted external identities -> one federation rule -> one OpenAI principal
```

这支持工作负载副本、作业，或作为同一用户或服务账户的已批准主体。它不允许一条规则根据声明选择不同的
主体。当工作负载需要不同的主体、工作区、作用域或令牌生命周期时，请创建单独的规则。
主体、工作区、作用域或令牌生命周期时，请创建单独的规则。
主体、工作区、作用域或令牌生命周期。

多条规则可以指向同一主体。当你需要为每个工作负载设置独立的生命周期控制或更清晰的审计归属时，请使用单独的规则。
独立生命周期控制或更清晰的审计归属。

## 作用域与授权

该规则可以缩小已签发访问令牌中的 OAuth 作用域范围。它无法授予
目标主体或工作空间尚未拥有的权限。

当省略作用域时，OpenAI 使用标准的 Codex 作用域： `openid`,
`profile`, `email`，以及 Codex 本地访问权限。如果通过 Admin
API 设置作用域，请包含 `chatgpt.workspace.feature.allow-codex-local-access.access` 并使用
仅这四个支持的值。

首先选择最小权限的主体和工作空间权限。将
规则作用域视为第二层限制，而不是主要的授权边界。

## Token 生命周期

将 OpenAI 访问令牌的生存时间设置为 60 到 3,600 秒。OpenAI 采用
两者中的较小值：

- 上游身份令牌的剩余生命周期。
- 该规则配置的访问令牌生命周期。

较短的生命周期会缩短已签发令牌在策略修订后仍可继续使用的时间，
但会增加兑换频率。除非你的工作负载需要不同的平衡，否则 10 分钟的生命周期是一个实用的起
始值。

## 回放保护

提供商级别的重放保护使用 JWT `jti` 声明。当管理员
开启 **Prevent assertion replay（防止断言重放）** 并且令牌具有非空的 `jti`, OpenAI
仅接受该声明一次 `jti` ，在该声明到期之前，针对该提供商仅接受一次。

工作负载必须在每次交换之前获取一个具有新的 `jti` 的新断言，包括，
结果未知的交换之后的重试。没有
`jti` 的断言仍然可用，但不会获得重放保护。空值、null 或
非字符串 `jti` 值无法通过验证。

## 变更、停用与归档

对身份检查、作用域或令牌生命周期的普通编辑仅对新交换生效。
编辑前签发的访问令牌可在其现有 TTL
到期前继续保持有效。

禁用规则或提供商会阻止新交换，并撤销通过它签发的 OpenAI 访问
令牌。归档会产生同样的效果，且无法撤销。
更改提供方信任设置（例如颁发者或 JWKS 设置）会在新信任配置生效之前撤销已签发的令牌。
更改提供方信任设置（例如颁发者或 JWKS 设置）会在新信任配置生效之前撤销已签发的令牌。

在紧急停止或临时暂停时使用禁用。归档资源
仅在你不再需要该资源时进行。

## 限制

| 资源                                | 限制               |
| --------------------------------------- | ------------------- |
| 每个组织的非归档提供商 | 50                  |
| 每个提供商的非归档规则         | 50                  |
| 每条规则的精确声明                   | 32                  |
| 每条规则的接受受众             | 32 个唯一值    |
| 主题长度                          | 4,096 字节         |
| 精确声明映射或 CEL 条件        | 16 KiB              |
| Access token lifetime                   | 60 至 3,600 秒 |

为需要独立发行方的信任边界创建单独的提供者、
密钥、重放或生命周期控制。在一个提供者下创建单独的规则
适用于共享信任但需要不同主体或访问策略的工作负载。