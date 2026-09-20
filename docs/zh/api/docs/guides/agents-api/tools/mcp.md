# MCP connections

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取相应文档页面的 Markdown 版本。

MCP 服务器发布工具定义并运行工具调用。智能体 API 发现这些工具，调用服务器，并将结果返回给智能体。你的应用无需处理每一次调用。

根据服务器可达的位置选择连接的运行位置：

| 连接                                         | 运行位置                           | 是否需要环境 |
| -------------------------------------------------- | --------------------------------------- | ----------------------- |
| HTTP with `connection_origin: "service"` (默认) | OpenAI                                  | 否                      |
| HTTP with `connection_origin: "environment"`       | 会话的环境              | 是                     |
| stdio                                              | 会话环境中运行的进程 | 是                     |






## 从 OpenAI 连接

添加一个 HTTP MCP 服务器到 `agent.tools`。该服务器必须可从 OpenAI 访问。无论是否使用会话环境均可使用此功能。

例如，OpenAI 文档 MCP 允许匿名访问：

```json
{
  "type": "mcp",
  "server_label": "openai_docs",
  "transport": {
    "type": "http",
    "server_url": "https://developers.openai.com/mcp"
  },
  "connection_origin": "service",
  "required": true
}
```

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/remote-mcps-1-mobile.webp"
    width="680"
    height="956"
  />
  <img src="https://developers.openai.com/images/api/agents-api/remote-mcps-1.webp"
    width="1400"
    height="624"
    alt="The Agents API service connects to a remote MCP server and exchanges calls and results. An optional attached vault supplies a credential matched to the server URL."
    loading="lazy"
  />
</picture>






## Connect from your environment

Executor MCP 从会话的环境进行连接。可将其用于私有网络上的服务器或安装在该环境中的软件。

将会话的 `environment.type` 设置为 `self_hosted` 或 `openai_hosted`。对于自托管环境，请， [在 智能体 使用其工具之前](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 连接 executor。

### 通过 HTTP 连接

对已在运行的服务器使用 HTTP。将以下条目添加到 `agent.tools`，将其中的 URL 替换为你的环境可以访问的地址：

```json
{
  "type": "mcp",
  "server_label": "internal_search",
  "transport": {
    "type": "http",
    "server_url": "https://mcp.internal.example.com/search"
  },
  "connection_origin": "environment",
  "required": true
}
```

此处，localhost URL 指的是会话所在的环境。如果省略 `connection_origin`，OpenAI 会改为发起连接。






### 通过 stdio 启动服务

使用 stdio 让执行器启动服务端进程。请先在环境中安装该服务端及其依赖。

对于这个客户查询示例，请安装 MCP SDK：

```bash
python3 -m venv /workspace/mcp-demo
/workspace/mcp-demo/bin/python -m pip install 'mcp==1.26.0'
```

将服务端另存为 `/workspace/lookup_mcp.py`:

运行客户查询 MCP 服务端

```python
import sys

from mcp.server.fastmcp import FastMCP

server = FastMCP("customer-lookup", host="127.0.0.1", port=8765, stateless_http=True)


@server.tool()
def get_customer(customer_id: str) -> dict:
    """Look up a customer in the example data."""
    customers = {"123": {"name": "Example Customer", "plan": "pro"}}
    return {"customer": customers.get(customer_id)}


if __name__ == "__main__":
    transport = sys.argv[1] if len(sys.argv) > 1 else "streamable-http"
    server.run(transport=transport)
```


将该服务端添加到 `agent.tools`。该 `stdio` 参数用于选择脚本的传输方式：

```json
{
  "type": "mcp",
  "server_label": "customer_lookup",
  "transport": {
    "type": "stdio",
    "command": "/workspace/mcp-demo/bin/python",
    "args": ["/workspace/lookup_mcp.py", "stdio"],
    "cwd": "/workspace"
  },
  "required": true
}
```

对于 stdio， `command` 以及一个绝对 `cwd` 是必需的； `args` 是可选的。省略 `connection_origin`.

发送一条消息，让 智能体 查询客户 `123`。该工具会返回 `Example Customer` ，结果会显示在 `pro` 计划上。

对于 OpenAI 托管的 stdio MCP，请省略网络策略或将其设置为 `enabled`。该 `disabled` 和 `restricted` 这些连接不支持网络策略。












## 添加身份验证

对于允许匿名访问的服务器，省略身份验证字段， `vault_ids`. 否则，请为你的连接选择凭据来源：

- **单个会话的 HTTP 凭据：** 设置 `transport.authorization` 或 `transport.headers` 时填写。智能体 API 会加密这些值，并从返回的会话资源中省略它们。
- **可复用的 HTTP 凭据：** 将 MCP 凭据存储在 [vault](https://developers.openai.com/api/docs/guides/agents-api/tools/vaults) 中，并通过 `vault_ids`。附加。基于 vault 的 MCP 认证仅适用于来自 OpenAI 的连接。凭据与服务器 URL 匹配；当存在多个匹配项时，使用 `credential_id` 选择其中一个。
- **Stdio 凭据：** 在环境中提供这些值，并在 `transport.env_vars`。中列出它们的名称。这些值可被运行在该环境中的代码读取。自托管会话不接受在 `transport.env`.

例如，HTTP 传输可以包含一个 bearer token 和另一个 header：

```json
{
  "type": "http",
  "server_url": "https://mcp.example.com/mcp",
  "authorization": "Bearer YOUR_MCP_ACCESS_TOKEN",
  "headers": { "X-Tenant-ID": "tenant_123" }
}
```

对单一来源使用 `Authorization`：内联配置或匹配的 vault 凭据。其他 header 可以与 vault 身份验证一起使用。来自环境的 HTTP 不使用 vault 凭据；请使用内联身份验证或受信任的代理。

不要将密钥放入可复用的智能体定义、插件归档和日志中。若要使凭据对智能体生成的代码不可访问，请使用 [受信任的代理或服务器](https://developers.openai.com/api/docs/guides/agents-api/environments/security#broker-third-party-access) 在环境外部提供这些凭据。




## 控制工具访问与启动

设置 `allowed_tools` 以限制该智能体可发现和调用的工具。设置 `required: true` 以在服务器无法初始化时使当前回合失败。默认情况下初始化是可选的。

请参阅 [创建会话参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/methods/create) 以了解所有 MCP 配置字段。






## 排查连接问题

如果必需的服务端无法初始化，请在 `agent.session.turn.failed`. 中查看错误。对于 stdio 服务端，还需检查 MCP 进程日志。

- **网络访问：** 检查 URL 并 `connection_origin`。对于环境连接，请检查执行器是否已连接，以及其网络能否访问服务器。
- **凭据：** 检查令牌或请求头。对于 vault，请检查凭据是否与服务器 URL 匹配。
- **可执行文件与依赖：** 检查所配置的命令能否在该环境中运行。
- **工作目录：** 使用已有的绝对 `cwd` 用于内联 stdio 配置。




## 相关指南

- [Plugins](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins) 将 MCP 配置和技能打包以便在多个会话间复用。
- [Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search#agents-api) 介绍在支持的模型和提供商上的自动 MCP 工具发现。