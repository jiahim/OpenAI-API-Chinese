# IP 出口范围

> 完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在 `.md` 后附加到页面 URL 获取。

某些 OpenAI 产品会向你所控制的服务发出出站请求。如果你的网络要求 IP 允许列表，请使用发起请求的产品的已发布范围。

IP 允许列表标识来自 OpenAI 运营网络的流量，而非特定用户或工作区，并且在你的集成需要请求身份验证或授权时，它不能替代这些机制。对于插件，请使用 [双向 TLS](https://developers.openai.com/plugins/build/auth#mutual-tls-mtls) 将 ChatGPT 作为 MCP 客户端进行身份验证。当你的插件需要用户身份验证时，使用 OAuth 2.1 对用户进行身份验证和授权。

## 出站 IP 地址

| 产品              | 用途                                                | 发布范围                                                 |
| -------------------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| ChatGPT 集成 | 插件、连接器、GPT Actions 和智能体商务  | [ChatGPT 连接器](https://openai.com/chatgpt-connectors.json) |
| Codex 云端          | 从 Codex 云端到 GitHub 等服务的连接 | [ChatGPT 智能体](https://openai.com/chatgpt-agents.json)         |

每个 JSON 文件都包含一个 `creationTime` 以及一个 `prefixes` 数组。范围可能随 OpenAI 基础设施的变化而改变。请定期获取相关文件并自动更新你的允许列表。