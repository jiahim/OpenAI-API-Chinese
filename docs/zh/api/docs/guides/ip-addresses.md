# IP egress ranges

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

某些 OpenAI 产品会向你控制的服务发起出站请求。如果你的网络需要 IP 白名单，请使用发起请求的产品的已发布 IP 段。

IP 白名单用于标识来自 OpenAI 运营网络的流量，而非特定用户或工作区，并且当你的集成需要身份验证或授权时，它不能替代这些机制。对于插件，请使用 [双向 TLS](https://developers.openai.com/plugins/build/auth#mutual-tls-mtls) 以将 ChatGPT 认证为 MCP 客户端。当你的插件需要用户身份验证时，请使用 OAuth 2.1 进行身份验证和用户授权。

## 出站 IP 地址

| 产品              | 用途                                                | 已发布的范围                                                 |
| -------------------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| ChatGPT 集成 | 插件、连接器、GPT Actions 和智能体商务  | [ChatGPT 连接器](https://openai.com/chatgpt-connectors.json) |
| Codex 云          | 从 Codex 云连接到 GitHub 等服务 | [ChatGPT 智能体](https://openai.com/chatgpt-agents.json)         |

每个 JSON 文件都包含一个 `creationTime` 和一个 `prefixes` 数组。这些范围可能会随 OpenAI 基础设施的变更而变化。请定期获取相关文件并自动更新你的允许列表。