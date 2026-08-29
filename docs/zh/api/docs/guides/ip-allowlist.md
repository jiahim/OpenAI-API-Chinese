# IP allowlist

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

IP 白名单允许你将 OpenAI API 请求限制为你信任的 IP 地址或 CIDR 范围。启用白名单后,OpenAI 会拒绝来自其他 IP 地址的请求,即使这些请求带有有效的 API 密钥。

对于具有固定或明确网络出口的生产工作负载,可将 IP 白名单作为另一层保护。它仅适用于 API 请求,不会限制对 [platform.openai.com](https://platform.openai.com) 或用户登录的访问。

IP 白名单控制你的应用程序向 OpenAI 发起的请求。如果
  你需要允许 OpenAI 产品向你控制的服务发起请求,
  请改用已发布的 [IP 出口范围](https://developers.openai.com/api/docs/guides/ip-addresses) 。

## 在你启用允许列表之前

识别每个调用 API 的工作负载的公共出口 IP 地址或地址段。在任何网络地址转换（NAT）、VPN、防火墙或代理之后检查该地址，因为 API 会评估到达 OpenAI 的源 IP。

一个允许列表最多可包含 50 个单独的 IP 地址或 CIDR 地址段。组织所有者角色包含管理 IP 允许列表设置所需的 `Read` 和 `Write` 权限。有关权限的更多信息，请参阅 [在 OpenAI 平台中管理权限](https://developers.openai.com/api/docs/guides/rbac).

在将允许列表应用于整个组织之前，先从一个非关键项目开始。在测试配置时，保留一条来自已允许 IP 的经过测试的请求路径。

项目级允许列表优先于组织级允许列表。这些条目不会合并：拥有自己活动允许列表的项目使用该允许列表，而没有的项目使用组织级允许列表。

## 配置 IP 白名单

1. 打开 [Settings > Security > IP allowlist](https://platform.openai.com/settings/organization/security/ip-allowlist).
2. 添加你想要允许的各个 IP 地址或 CIDR 范围。例如，使用 `203.0.113.10` 表示单个地址，或使用 `203.0.113.0/24` 表示一个范围。
3. 可选地，使用 **Check** 工具确认允许列表包含指定的 IP 地址。
4. 为特定项目或你的整个组织启用允许列表。
5. 等待最多 15 分钟以使更改生效。
6. 从每个预期的环境发送 API 请求以验证访问权限。

启用组织级允许列表会影响没有自身生效允许列表的项目的 API 请求
  请确认每个受影响范围内的所有生产、
  预发布、CI 和灾难恢复出口路径，然后再
  启用它。

## 验证强制执行情况

从允许的网络路径发送一个具有代表性的 API 请求。例如：

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

该请求应根据 API 密钥的常规身份验证和授权顺利完成。从不在当前允许列表中的 IP 地址发送时，该请求将以 HTTP `401` 失败，并返回 `ip_not_authorized` 错误代码。

## 排查被阻止的请求

如果预期请求失败并提示 `ip_not_authorized`:

- 从发送 API 请求的同一网络路径确认工作负载的公共出站 IP。本地开发机器的公共 IP 可能与已部署服务不同。
- 检查 NAT 网关、VPN、防火墙、代理或云服务商是否更改了出站地址。
- 使用 **Check** 工具，在 [IP 白名单设置](https://platform.openai.com/settings/organization/security/ip-allowlist) 中检查该地址是否与已配置的条目匹配。
- 确认当前生效的白名单适用于与 API 密钥关联的组织或项目。
- 配置变更后等待最多 15 分钟，然后再次测试。

IP 白名单不能取代安全的 API 密钥存储、密钥轮换或账户安全。如果请求必须来自专用 Azure 网络而非公共 IP，请考虑 [Private Link](https://developers.openai.com/api/docs/guides/private-link)；Private Link 与 IP 白名单控制不兼容。