# Secure MCP Tunnel

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

Secure MCP Tunnel 让你将私有 MCP 服务器连接到受支持的 OpenAI 产品,而无需打开入站防火墙端口或将服务器暴露到公共互联网。在网络内运行 `tunnel-client` 该网络已经可以访问你的 MCP 服务器;它会打开一条到 OpenAI 的出站 HTTPS 路径,拉取排队的 MCP 任务,在本地转发请求,并通过同一隧道返回响应。

Secure MCP Tunnel 支持私有 MCP 连接,包括自定义 MCP
  服务器测试。它不支持公共插件提交或分发。
  公共插件需要一个稳定的、可公开访问的 HTTPS MCP 端点。如果
  MCP 服务器必须保持私有,请暴露一个将请求转发
  到它的公共 HTTPS 代理。参见 [公共插件提交](https://developers.openai.com/plugins/deploy/submission) 了解
  端点和身份验证要求。

## 什么是 MCP 隧道？

MCP 隧道是一种从你网络内部的主机到 OpenAI 托管的 MCP 端点的仅出站连接。当你的 MCP 服务器是私有的、本地部署的，或位于防火墙之后，但仍需要被 ChatGPT、Codex、Responses API 或其他受支持的 OpenAI 接口调用时，可以使用它。

Secure MCP Tunnel 在使 MCP 服务器保持私有的同时，为受支持的 OpenAI 产品提供一条正常的 MCP 请求路径。 `tunnel-client` 从 OpenAI 拉取任务，在本地转发 MCP 请求，并通过同一隧道返回响应。

## 使用安全 MCP 隧道当

- 你的 MCP 服务器运行在私有网络、本地环境、开发者机器上，或者位于现有的访问控制之后。
- 你希望 ChatGPT、Codex、Responses API 或其他受支持的 OpenAI 接入方式能够使用该服务器，而无需将 MCP 服务器公开。
- 你的网络允许运行以下主机的机器 `tunnel-client` 默认情况下向 `api.openai.com:443` 发起出站 HTTPS 请求，或者在配置了控制面 mTLS 时 `mtls.api.openai.com:443` 能够访问该私有 MCP 服务器。
- 从 [MCP 服务器指南](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 开始了解一般的 MCP 概念。

## 工作原理

1. 在 Platform 隧道设置中创建或管理一个由 OpenAI 托管的 MCP 隧道端点。
2. 运行 `tunnel-client` 在可访问你的私有 MCP 服务器的网络内部。
3. 配置 `tunnel-client` 使用隧道身份和私有 MCP 服务器地址。
4. OpenAI 产品将 MCP 请求发送到由 OpenAI 托管的隧道端点。
5. `tunnel-client` 长轮询以获取排队的任务，将每个 `JSON-RPC` 请求转发到私有 MCP 服务器，并通过隧道将响应回传。

私有 MCP 服务器无需公开监听端口。OpenAI 托管的端点为受支持的产品提供了一条常规的 MCP 请求路径，而网络发起点仍位于你的边界内。当连接器请求流式结果时，隧道路径可以转发中间的服务器发送事件。

<figure className="not-prose my-8">
  

![Diagram showing an OpenAI product sending MCP JSON-RPC through the OpenAI tunnel service to tunnel-client, which forwards the request to a private MCP server and returns the response through the same tunnel.](<https://developers.openai.com/images/platform/guides/secure-mcp-tunnels/request-flow-diagram.png>)


  <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
    OpenAI products call the OpenAI-hosted tunnel endpoint; `tunnel-client`
    long-polls for queued work and returns the MCP response through the same
    tunnel.
  </figcaption>
</figure>

## 准备工作

你需要：

- 一个 `tunnel_id` 从 [平台隧道设置](https://platform.openai.com/settings/organization/tunnels).
- 一个用于以下用途的运行时 API 密钥： `tunnel-client`.
- 一个可以通过 stdio 或 HTTP 从你的网络内部访问的 MCP 服务器，该服务器 `tunnel-client` 可以从你的网络内部通过 stdio 或 HTTP 进行访问。

## 权限与访问

[Platform tunnel 权限](https://developers.openai.com/api/docs/guides/rbac) 与 ChatGPT 自定义 MCP 服务器访问是分开的：

- 创建或编辑隧道需要 Tunnels **Read** + **Manage**.
- Running `tunnel-client` 或在创建应用时选择隧道需要 Tunnels **Read** + **Use**.
- Tunnel 权限适用于 Platform 组织。由 Platform 组织所有者或 RBAC 管理员授予隧道角色。
- 在 ChatGPT 中添加和使用自定义 MCP 服务器仍受工作区权限和安全限制的约束。请参阅 [Add custom MCP server](https://developers.openai.com/api/docs/guides/custom-mcp-server).

向目标 ChatGPT workspace 管理员申请添加和使用自定义 MCP 服务器的权限，并向目标 Platform 组织所有者/RBAC 管理员申请 tunnel 权限。

## 将隧道关联到正确的组织和工作区

一个隧道可以关联一个或多个 Platform 组织或 ChatGPT 工作区。使用这些关联来定义每个应当被允许查找或使用该隧道的 OpenAI 上下文。

- 包含拥有或管理该隧道（tunnel）的 Platform 组织。
- 包含在创建应用时应列出该隧道（tunnel）的 ChatGPT 工作区。
- 包含另一个 Platform 组织，前提是 Codex、Responses API 或其他受支持的产品将需要从该组织调用私有 MCP 服务器。
- 请使用同一个 `tunnel_id` 用于 `tunnel-client`；添加组织或工作区不会创建第二条隧道，也不会更改私有 MCP 服务器的端点。

对于个人账户，请使用该账户所属的个人 Platform 组织。对于 ChatGPT 和 Codex 测试，请将隧道与目标 ChatGPT workspace 以及 Codex 将使用的 Platform 组织相关联。仅与个人 Platform 组织关联的隧道不会自动出现在 Enterprise/Edu workspace 中。

如果 Platform 组织和 ChatGPT workspace 已经关联，你可以在 [Platform 隧道设置](https://platform.openai.com/settings/organization/tunnels)。中添加缺失的组织或 workspace。如果你的企业设置无法自动验证（例如 Platform 组织没有对应的 ChatGPT workspace），请联系你的OpenAI 账户团队，请求对应该使用该隧道的企业账户映射进行审核后的人工关联覆盖。

## 网络要求

`tunnel-client` 无需入站互联网访问。它需要到 OpenAI 的出站 HTTPS，以及与本地 MCP 服务器的可达性：

| From                         | To                                                     | 用于                                                            |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| Host running `tunnel-client` | `api.openai.com:443` over HTTPS on `/v1/tunnel/*`      | 默认的轮询和响应发送。                               |
| Host running `tunnel-client` | `mtls.api.openai.com:443` over HTTPS on `/v1/tunnel/*` | 在配置了控制面 mTLS 时的轮询和响应发送。 |
| Host running `tunnel-client` | 配置的 stdio 命令或 MCP 服务器 URL         | 从你的网络内部转发 MCP 请求。                   |

## 设置 tunnel-client

Open [Platform 隧道设置](https://platform.openai.com/settings/organization/tunnels)，然后使用该处的下载链接，或使用来自 `tunnel-client` 的 [openai/tunnel-client](https://github.com/openai/tunnel-client/releases/latest)。让你的运行手册始终指向最新发布版本的 URL，而不是硬编码某个特定版本的 URL。

如果你已有二进制文件，可以从 `tunnel-client help quickstart`。开始。对于命名的本地 stdio 配置，请使用：

```bash
export CONTROL_PLANE_API_KEY="sk-..."

tunnel-client init \
  --sample sample_mcp_stdio_local \
  --profile local-stdio \
  --tunnel-id tunnel_0123456789abcdef0123456789abcdef \
  --mcp-command "python /path/to/server.py"

tunnel-client doctor --profile local-stdio --explain
tunnel-client run --profile local-stdio
```

对于 HTTP MCP 服务器，请使用 `--mcp-server-url https://mcp.internal.example.com/mcp` 代替 `--mcp-command`.

保持 `tunnel-client run ...` 在创建或测试应用期间保持运行。应用发现和 MCP 工具调用都依赖于正在运行的客户端。

<figure className="not-prose my-8">
  

![Live local tunnel-client admin UI showing health, readiness, tunnel metadata, and channel status.](<https://developers.openai.com/images/platform/guides/secure-mcp-tunnels/tunnel-client-admin-ui.png>)


  <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
    The local admin UI at `/ui` shows whether the running client is
    healthy, ready, and connected before you test from ChatGPT, Codex, or an API
    flow.
  </figcaption>
</figure>

## 选择运行 tunnel-client 的位置

Run `tunnel-client` 在同一个信任边界中运行，该信任边界已经能够访问私有 MCP 服务器。常见的部署模式包括：

- **Kubernetes sidecar：** 运行 `tunnel-client` 与 MCP 服务器同处一个 Pod 中，并通过以下方式连接 `localhost`.
- **专用 Kubernetes 部署：** 运行 `tunnel-client` ，当 MCP 服务器已可通过私有 Service 访问时单独运行。
- **虚拟机或 systemd 服务：** 运行 `tunnel-client` ，在能够通过私有网络访问 MCP 服务器的主机上运行。

## 从 ChatGPT 连接

前往 [ChatGPT Plugins](https://chatgpt.com/plugins),选择加号按钮,然后 **添加自定义 MCP 服务器**,并选择 **Tunnel** 于 **连接**。当 ChatGPT 列出可用的隧道时选择一个可用的隧道,或者粘贴一个有效的 `tunnel_id` (如果你已有的话)。配置身份验证,查看风险警告,然后选择 **我理解并希望继续**,然后 **创建为插件**.

如果隧道未在 ChatGPT 中显示,请确认该隧道关联到目标 ChatGPT 工作区,而不仅仅是某个 Platform 组织,并且应用创建者对 Tunnels 具有 **读取** + **使用**.

## 通过 Responses API 连接

在 MCP 工具定义中将隧道标识符作为 server_url 传入 `tunnel_id` 传入。不要将 OpenAI 托管的隧道端点作为 server_url 传入；该端点仅供 Responses API 可直接访问的 MCP 服务器使用 `server_url`；使用 `server_url` ，仅供 响应接口 可直接访问的 MCP 服务器使用。

将 Secure MCP Tunnel 与 Responses API 配合使用

```bash
curl https://api.openai.com/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-6-astra",
    "input": "Use the private MCP server to answer my request.",
    "tools": [
      {
        "type": "mcp",
        "server_label": "private_mcp",
        "tunnel_id": "tunnel_0123456789abcdef0123456789abcdef"
      }
    ]
  }'
```


## 安全与网络

<figure className="not-prose my-8">
  

![Diagram showing tunnel-client inside the customer-controlled environment connecting outbound to the OpenAI-managed tunnel control plane while the private MCP server remains inside the customer network.](<https://developers.openai.com/images/platform/guides/secure-mcp-tunnels/trust-boundaries-diagram.png>)


  <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
    The private MCP server stays inside the customer-controlled environment.
    `tunnel-client` reaches OpenAI over outbound HTTPS using the runtime API key
    and, when required, optional control-plane mTLS.
  </figcaption>
</figure>

- MCP 服务器地址保持私有，并且仅在以下环境中使用 `tunnel-client` 运行。
- `tunnel-client` 对 OpenAI 隧道控制平面进行身份验证；受支持的 OpenAI 产品使用由 OpenAI 托管的隧道端点。
- 隧道访问遵循现有的组织和 workspace 上下文，而不是引入单独的公共入口路径。
- `tunnel-client` 支持企业网络需求，例如出站代理、自定义 CA 捆绑包、控制平面客户端证书，以及 MCP 端 `mTLS`.

### 日志边界

Secure MCP Tunnel 将隧道传输与应用层产品日志分离：

- 隧道控制平面鉴权、长轮询 / 响应流量以及单个隧道传输请求，不会由隧道路径作为 ChatGPT 合规平台应用事件发出。
- 隧道元数据变更通过 API 平台暴露 [审计日志](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/audit_logs) 以 `tunnel.created`, `tunnel.updated`，呈现，并且 `tunnel.deleted`.
- 当 ChatGPT 通过安全 MCP 隧道访问自定义应用时，隧道仅作为传输路径。应用层面的常规合规日志记录仍然适用于应用路径，包括应用调用日志以及应用鉴权生命周期日志，例如 `APP_AUTH_LOG` 应用被链接或取消链接时。

## 高级：允许列表中的 HTTP 调用

Secure MCP Tunnel 也可以支持来自受支持的 智能体 或 API 流程的窄范围 HTTP 调用，进入客户网络。 `tunnel-client` 包含一个嵌入式 MCP 服务器 Harpoon，它按标签暴露已配置的 HTTP 目标，并允许调用方通过隧道调用它们，同时对请求/响应大小加以限制。

当你需要访问少量私有 REST 端点但又不想将其公开暴露时，可以使用此功能。Harpoon 并不是通用代理：调用方无法选择任意主机，且请求仅限于客户配置的目标和 HTTP 方法。

## 故障排查

- **“在 Platform 隧道设置中显示 “Tunnels access required”：** 隧道权限属于组织级别，而非项目级别。选择目标 Platform 组织，然后请组织所有者或 RBAC 管理员将你添加到具有 **Read** 权限的角色或组中以查看隧道，或者 **Read** + **Manage** 权限以创建、编辑或删除隧道。如果不存在匹配的角色，他们可以创建一个新角色，将其分配给一个组，并将你添加到该组。你还需要 **Use** 才能运行 `tunnel-client` 或在连接器设置中选择一个隧道。新角色分配生效可能需要等待最多 30 分钟。
- **在 ChatGPT 中看不到隧道：** 检查该隧道是否包含目标 ChatGPT 工作区，而不仅仅是某个 Platform 组织；然后检查连接器操作员的 Tunnels **Use** 权限。如果企业账户的工作区无法自动关联，请联系你的 OpenAI 客户团队，以申请经审核的手动关联覆盖。
- **连接器发现或工具调用失败：** 确认 `tunnel-client run ...` 仍在运行，然后重新运行 `tunnel-client doctor --profile <name> --explain`.
- **你可以检查一个隧道但无法编辑它：** 该操作员可能拥有 Tunnels **Read** 权限，但没有 Tunnels **Manage**.
- `tunnel-client` 暴露 `/healthz`, `/readyz`, `/metrics`，以及位于 `/ui`.
- 的管理界面。默认情况下，该管理界面仅监听 loopback。仅当你有意让某个操作员网络访问时，才将其远程暴露。
- 在从 ChatGPT、Codex 或某个 API 流程发起测试之前，使用这些界面确认客户端健康、就绪且正在轮询。
- 如果客户端未连接，则通过该隧道的请求会一直失败，直到 `tunnel-client` 重新连接。
- 默认情况下原始 HTTP 日志记录处于禁用状态，且支持导出内容会进行脱敏处理。

## OAuth

- OAuth 发现可以穿越隧道路径传输，从而 MCP 服务器本身可以保持私有。
- 该隧道保留了面向浏览器的 OAuth 流程所需的上游授权服务器元数据。
- 授权服务器本身不会被自动隧道化。如果从公共互联网和 `tunnel-client` 主机都无法访问授权服务器，那么即使 MCP 服务器可访问，OAuth 流程仍可能失败。

## 在哪里配置

- 在 该公司 中管理 OpenAI 托管的 MCP 隧道端点 [平台隧道设置](https://platform.openai.com/settings/organization/tunnels).
- 在以下情况下使用隧道： [添加自定义 MCP 服务器](https://developers.openai.com/api/docs/guides/custom-mcp-server) 在 [ChatGPT Plugins](https://chatgpt.com/plugins).
- 对于 Codex 或 API 工作流，请使用由受支持的产品界面公开的、由隧道支持的 MCP 目标。

## Next steps

- 在以下位置创建或管理隧道 [平台隧道设置](https://platform.openai.com/settings/organization/tunnels).
- 验证你的 `tunnel-client` 配置文件 `tunnel-client doctor --profile <profile> --explain`.
- 从以下位置连接隧道 [ChatGPT Plugins](https://chatgpt.com/plugins) 或你正在使用的受支持的 OpenAI 接口。



  <figure>
    [<img src="https://developers.openai.com/images/platform/guides/secure-mcp-tunnels/platform-tunnels-settings.png"
        alt="Sanitized OpenAI Platform tunnel settings screenshot."
        loading="lazy"
        class="w-full rounded-md border border-gray-200 dark:border-gray-800"
      />](https://platform.openai.com/settings/organization/tunnels)
    <figcaption class="mt-3 text-sm text-gray-600 dark:text-gray-400">
      Create and manage OpenAI-hosted MCP tunnel endpoints from Platform tunnel
      settings.
    </figcaption>
  </figure>