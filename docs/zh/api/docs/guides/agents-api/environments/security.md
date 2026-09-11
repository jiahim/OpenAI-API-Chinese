# 沙盒安全

> 完整文档索引请参阅 [llms.txt](/llms.txt).文档页面的 Markdown 版本可通过在页面 URL 末尾附加 `.md` 获取。

智能体 生成的代码可以访问其环境中可用的文件、凭据和网络。




## 隔离工作负载

在隔离的计算环境（如虚拟机）中运行工作负载。对于不得共享数据的用户或工作负载，应使用独立的环境。为你的应用或工作流创建一个专用的 OpenAI 项目。




## 限制网络访问

仅允许对外流量发往已批准的端点，包括执行器的 [必需主机](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#network-access).

根据每个工具连接的运行位置配置网络访问：

- **Executor MCPs** 从你的环境连接。允许其访问所需的服务器。
- **Remote MCPs** 从 OpenAI 的服务连接。其端点必须可从该服务访问。

参见 [MCP tools](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp) 了解连接选项。




## Separate credentials

授予你的应用程序密钥 `api.agents.read` 并 `api.agents.write` 用于会话，以及 `api.responses.write` 用于推理。添加 `api.vaults.read` 并 `api.vaults.write` 以管理保险库。

为执行者提供 [环境密钥](https://platform.openai.com/agents?tab=environments&environment_view=keys) 作为 `CODEX_API_KEY`。该密钥仅允许连接环境，无法授权任何其他 API 操作。请参阅 [Executor authentication](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) 了解设置方法。

智能体-生成的代码可以读取环境密钥。请将你的应用程序 API 密钥放在环境之外。不要将密钥嵌入到镜像、源代码或日志中。需要时请轮换或撤销密钥。




## 中介第三方访问

将第三方凭据保留在环境之外。尽可能通过凭据代理路由请求。代理会将密钥注入到已批准的出站请求中，而不会将其放入智能体的环境中。

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

将长期有效的凭据存储在密钥管理器中。将存储的密钥注入环境仍会使其暴露给智能体生成的代码。定期轮换凭据，并在怀疑泄露时立即撤销。