# 沙箱安全性

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

智能体生成的代码可以访问其环境中可用的文件、凭据和网络。




## 隔离工作负载

在隔离的计算环境（例如虚拟机）中运行工作负载。对于不得共享数据的用户或工作负载，请使用相互隔离的环境。为你的应用或工作负载创建一个专用的 OpenAI 项目。




## 限制网络访问

仅允许出站流量访问已批准的端点，包括执行者的 [必需的主机](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#network-access).

根据每个工具连接运行的位置配置网络访问：

- **Executor MCPs** 在你的环境中连接。允许访问它们所需的服务器。
- **远程 MCP** 从 OpenAI 的服务连接。其端点必须可从该服务访问。

请参阅 [MCP tools](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp) 以了解连接选项。




## 单独的凭据

授予你的应用程序密钥 `api.agents.read` 并 `api.agents.write` 用于会话，以及 `api.responses.write` 用于推理。添加 `api.vaults.read` 并 `api.vaults.write` 来管理存储库。

为执行器提供 [环境密钥](https://platform.openai.com/agents?tab=environments&environment_view=keys) 作为 `CODEX_API_KEY`。此密钥仅允许连接环境，无法授权任何其他 API 操作。参见 [执行器身份验证](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) 以进行设置。

智能体 生成的代码可以读取环境密钥。请将你的应用程序 API 密钥保存在环境外部。不要将密钥嵌入到镜像、源代码或日志中。必要时轮换或吊销密钥。




## 代理第三方访问

将第三方凭据留在环境之外。对于来自 API 请求的 OpenAI-hosted 沙箱，使用 [将 vault secrets 作为环境变量](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults#use-vault-secrets-for-api-requests-from-a-sandbox)。沙箱代码使用占位符；网络代理为批准的宿主提供真实凭据。

对于自托管环境，请配置受信任的代理或服务器以在环境之外提供凭据。这是你自己提供的基础设施。对于 [function tools](https://developers.openai.com/api/docs/guides/agents-api/tools/functions)，将凭据保留在处理调用的应用中，仅返回结果。

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/sandbox-security-1-mobile.webp"
    width="680"
    height="1252"
  />
  <img src="https://developers.openai.com/images/api/agents-api/sandbox-security-1.webp"
    width="1400"
    height="848"
    alt="In an example you configure, sandbox tools send requests to an external proxy that adds scoped credentials for approved destinations. The restricted executor key remains readable inside the sandbox."
    loading="lazy"
  />
</picture>

将长期凭据存储在机密管理器中。将存储的机密注入环境仍会将其暴露给 智能体 生成的代码。定期轮换凭据，如果怀疑发生泄露请立即撤销。