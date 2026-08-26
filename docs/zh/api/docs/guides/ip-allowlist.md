# IP 允许列表

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

IP 允许列表可让你将 OpenAI API 请求限制为你信任的 IP 地址或 CIDR 范围。启用允许列表后，OpenAI 会拒绝来自其他 IP 地址的请求，即使这些请求包含有效的 API 密钥。

将 IP 允许列表作为对具有固定或明确网络出口的生产工作负载的额外保护层。它仅适用于 API 请求，不限制对 [platform.openai.com](https://platform.openai.com) 的访问或用户登录。

IP 允许列表控制你的应用程序发送给 OpenAI 的请求。如果
  你需要允许 OpenAI 产品向你控制的服务发送请求，
  请使用已发布的 [IP 出口范围](https://developers.openai.com/api/docs/guides/ip-addresses) 。

## 启用白名单之前

识别每个调用 API 的工作负载的公共出口 IP 地址或范围。请在网络地址转换 (NAT)、VPN、防火墙或代理之后检查地址，因为 API 会评估到达 OpenAI 的源 IP。

允许列表最多可包含 50 个单独的 IP 地址或 CIDR 范围。组织所有者角色包含 `Read` 和 `Write` 权限，用于管理 IP 允许列表设置。有关权限的更多信息，请参阅 [在 OpenAI 平台中管理权限](https://developers.openai.com/api/docs/guides/rbac).

在将允许列表应用于整个组织之前，先从一个非关键项目开始。在测试配置时，保持从允许的 IP 到测试请求路径的可用性。

项目级允许列表优先于组织级允许列表。条目不合并：具有自身有效允许列表的项目使用该允许列表，而没有的项目则使用组织级允许列表。

## 配置 IP 允许列表

1. 打开 [设置 > 安全 > IP 允许列表](https://platform.openai.com/settings/organization/security/ip-allowlist).
2. 添加你想要允许的单个 IP 地址或 CIDR 范围。例如，使用 `203.0.113.10` 用于单个地址，或 `203.0.113.0/24` 用于一个范围。
3. （可选）使用 **检查** 工具来确认允许列表包含特定的 IP 地址。
4. 为特定项目或整个组织启用允许列表。
5. 等待最多 15 分钟，更改才会生效。
6. 从每个预期环境发送 API 请求以验证访问。

启用组织级允许列表会影响 API 对项目的请求
  （这些项目没有自己的活跃允许列表）。在启用之前，请确认每个受影响范围内所有生产、
  预发布、CI 和灾难恢复出口路径，
  然后才启用它。

## 验证执行

从允许的网络路径发送一个具有代表性的 API 请求。例如：

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

该请求应根据 API 密钥的正常认证和授权完成。从未包含在活动允许列表中的 IP 地址发出请求时，该请求将以 HTTP `401` 和 `ip_not_authorized` 错误码失败。

## 排查被阻止的请求

如果预期的请求失败并返回 `ip_not_authorized`:

- 从发送API请求的同一网络路径确认工作负载的公网出口 IP。本地开发机器的公网 IP 可能与部署服务不同。
- 检查 NAT 网关、VPN、防火墙、代理或云提供商是否更改了出口地址。
- 使用 **检查** 工具中的 [IP 允许列表设置](https://platform.openai.com/settings/organization/security/ip-allowlist) 对照配置的条目检查地址。
- 确认活动的允许列表适用于与 API 密钥关联的组织或项目。
- 配置更改后最多等待 15 分钟，然后再次测试。

IP 允许列表并不能替代安全的 API 密钥存储、密钥轮换或账户安全。如果请求必须从 Azure 私有网络而非公共 IP 发起，请考虑 [Private Link](https://developers.openai.com/api/docs/guides/private-link)；Private Link 与 IP 允许列表控件不兼容。