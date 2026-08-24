# IP egress ranges

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Some OpenAI products make outbound requests to services you control. If your network requires an IP allowlist, use the published ranges for the product making the request.

An IP allowlist identifies traffic from an OpenAI-operated network, not a specific user or workspace, and does not replace request authentication or authorization when your integration requires them. For plugins, use [mutual TLS](https://developers.openai.com/plugins/build/auth#mutual-tls-mtls) to authenticate ChatGPT as the MCP client. When your plugin requires user authentication, use OAuth 2.1 to authenticate and authorize the user.

## Outbound IP addresses

| Product              | Used for                                                | Published ranges                                                 |
| -------------------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| ChatGPT integrations | Plugins, connectors, GPT Actions, and agentic commerce  | [ChatGPT connectors](https://openai.com/chatgpt-connectors.json) |
| Codex cloud          | Connections from Codex cloud to services such as GitHub | [ChatGPT agents](https://openai.com/chatgpt-agents.json)         |

Each JSON file includes a `creationTime` and a `prefixes` array. The ranges can change as OpenAI infrastructure changes. Fetch the relevant file regularly and update your allowlist automatically.