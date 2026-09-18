# Secure MCP Tunnel

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

Secure MCP Tunnel 可让你将私有 MCP 服务器连接到受支持的 OpenAI 产品，而无需开放入站防火墙端口或将此类服务器暴露到公共互联网。请在 `tunnel-client` 能够访问你 MCP 服务器的网络中运行它；它会向 OpenAI 打开一条出站 HTTPS 通道，拉取排队的 MCP 任务，在本地转发请求，并通过同一隧道返回响应。

Secure MCP Tunnel 支持私有 MCP 连接，包括开发者模式
  测试。它不支持公共插件的提交或分发。公共
  插件需要一个稳定、可公开访问的 HTTPS MCP 端点。如果 MCP
  服务器必须保持私有，请公开一个将请求转发到该服务器的公共 HTTPS 代理。
  请参阅 [公共插件提交](https://developers.openai.com/plugins/deploy/submission) 了解端点
  与认证要求。

## 什么是 MCP 隧道？

MCP 隧道是从你网络内部的主机到 OpenAI 托管的 MCP 端点的单向出站连接。当你的 MCP 服务器是私有的、本地部署的或位于防火墙之后，但 ChatGPT、Codex、Responses API 或其他受支持的 OpenAI 界面仍需要调用它时，可以使用 MCP 隧道。

安全 MCP 隧道在保持 MCP 服务器私有的同时，为受支持的 OpenAI 产品提供一条常规的 MCP 请求路径。 `tunnel-client` 轮询 OpenAI 以获取任务，在本地转发 MCP 请求，并通过同一隧道返回响应。

## 使用安全 MCP 隧道

- 你的 MCP 服务器运行在私有网络、本地环境、开发者机器上，或位于现有的访问控制之后。
- 你希望 ChatGPT、Codex、Responses API 或其他受支持的 OpenAI 界面能够在不将 MCP 服务器公开的情况下使用该服务器。
- 你的网络允许运行以下服务的主机 `tunnel-client` 默认情况下向 `api.openai.com:443` 发出出站 HTTPS 请求，或在配置了控制面 mTLS 时 `mtls.api.openai.com:443` 能够到达该私有 MCP 服务器。
- 从 [MCP 服务器指南](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 开始了解通用 MCP 概念。

## 工作原理

1. 在 Platform 隧道设置中创建或管理 OpenAI 托管的 MCP 隧道端点。
2. 在能访问你的私有 MCP 服务器的网络中运行 `tunnel-client` 。
3. 使用隧道身份 `tunnel-client` 和私有 MCP 服务器地址进行配置。
4. OpenAI 产品将 MCP 请求发送到 OpenAI 托管的隧道端点。
5. `tunnel-client` 长轮询队列中的任务，将每个 `JSON-RPC` 请求转发到私有 MCP 服务器，并通过隧道将响应回传。

私有 MCP 服务器无需公网监听端点。OpenAI 托管的端点为支持的产品提供正常的 MCP 请求路径，而网络发起点仍位于你的边界内。当连接器请求流式结果时，隧道路径可以转发中间的服务器发送事件。

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

- 一个 `tunnel_id` 来自 [平台隧道设置](https://platform.openai.com/settings/organization/tunnels).
- 一个运行时API密钥，用于 `tunnel-client`.
- An MCP server that `tunnel-client` 可通过 stdio 或 HTTP 在你的网络内部访问。

## 权限与访问

[Platform 隧道权限](https://developers.openai.com/api/docs/guides/rbac) 和 ChatGPT 开发者模式访问权限是分开授予的：

- 创建或编辑隧道需要 Tunnels **Read** + **Manage**.
- Running `tunnel-client` 或在创建应用时选择隧道也需要 Tunnels **Read** + **Use**.
- Tunnel 权限适用于 Platform 组织。Platform 组织所有者或 RBAC 管理员授予 tunnel 角色。
- ChatGPT 开发者模式是独立的工作区权限。对于 Enterprise/Edu，工作区管理员授予开发者模式访问权限；用户随后可在 **Settings → Security and login**。中启用。参阅 [开发者模式帮助中心文章](https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta) 以了解各方案的具体策略。

向目标 ChatGPT workspace 的管理员申请开发者模式访问权限，并向目标 Platform 组织的负责人/RBAC 管理员申请 tunnel 权限。

## 将隧道与正确的组织和工作区关联

一个隧道可以关联一个或多个 Platform 组织或 ChatGPT 工作区。使用这些关联来定义应允许查找或使用该隧道的每个 OpenAI 上下文。

- 包含拥有或管理该隧道的 Platform 组织。
- 包含在创建应用时应列出该隧道的 ChatGPT 工作区。
- 在 Codex、Responses API 或其他受支持产品需要从该组织调用私有 MCP 服务器时，包含另一个 Platform 组织。
- 使用同一个 `tunnel_id` ， `tunnel-client`；添加组织或工作区不会创建第二个隧道，也不会更改私有 MCP 服务器的端点。

对于个人账户，请使用该账户所属的个人 Platform 组织。对于 ChatGPT 和 Codex 测试，请将隧道关联到目标 ChatGPT workspace 以及 Codex 将使用的 Platform 组织。仅与个人 Platform 组织关联的隧道不会自动出现在 Enterprise/Edu workspace 中。

如果 Platform 组织和 ChatGPT workspace 已经在中链接，你可以在 [Platform 隧道设置](https://platform.openai.com/settings/organization/tunnels)。中添加缺失的组织或 workspace。如果你的企业设置无法自动验证（例如 Platform 组织没有对应的 ChatGPT workspace），请联系你的OpenAI 客户团队，请求为应使用该隧道的企业账户映射提供经过审核的手动关联覆盖。

## 网络要求

`tunnel-client` 不需要入站互联网访问。它需要向 OpenAI 进行出站 HTTPS 访问，并需要能够本地访问私有 MCP 服务器：

| From                         | To                                                     | 用途                                                            |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| 运行主机 `tunnel-client` | `api.openai.com:443` 通过 HTTPS 连接 `/v1/tunnel/*`      | 默认的轮询和响应提交。                               |
| 运行主机 `tunnel-client` | `mtls.api.openai.com:443` 通过 HTTPS 连接 `/v1/tunnel/*` | 当配置了控制面 mTLS 时的轮询和响应提交。 |
| 运行主机 `tunnel-client` | 已配置的 stdio 命令或 MCP 服务器 URL         | 从你的网络内部转发 MCP 请求。                   |

## 设置 tunnel-client

Open [Platform 隧道设置](https://platform.openai.com/settings/organization/tunnels)，然后使用其中的下载链接，或来自 `tunnel-client` 的最新 [openai/tunnel-client](https://github.com/openai/tunnel-client/releases/latest)。让你的运行手册指向 latest-release URL，而不是硬编码某个具体的 release URL。

如果你已经有二进制文件，请从 `tunnel-client help quickstart`。开始。对于命名的本地 stdio 配置文件，使用：

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

对于 HTTP MCP 服务器，使用 `--mcp-server-url https://mcp.internal.example.com/mcp` 代替 `--mcp-command`.

保持 `tunnel-client run ...` 在创建或测试应用期间保持运行。应用发现和 MCP 工具调用依赖于正在运行的客户端。

<figure className="not-prose my-8">
  

![Live local tunnel-client admin UI showing health, readiness, tunnel metadata, and channel status.](<https://developers.openai.com/images/platform/guides/secure-mcp-tunnels/tunnel-client-admin-ui.png>)


  <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
    The local admin UI at `/ui` shows whether the running client is
    healthy, ready, and connected before you test from ChatGPT, Codex, or an API
    flow.
  </figcaption>
</figure>

## 选择运行 tunnel-client 的位置

运行 `tunnel-client` 在同一个信任边界中，该边界已经可以访问私有 MCP 服务器。常见的部署模式包括：

- **Kubernetes sidecar：** 在能访问你的私有 MCP 服务器的网络中运行 `tunnel-client` 与 MCP 服务器部署在同一个 Pod 中，并通过 `localhost`.
- **独立的 Kubernetes 部署：** 在能访问你的私有 MCP 服务器的网络中运行 `tunnel-client` 在 MCP 服务器已可通过私有 Service 访问时单独部署。
- **虚拟机或 systemd 服务：** 在能访问你的私有 MCP 服务器的网络中运行 `tunnel-client` 部署在能够通过私有网络访问 MCP 服务器的主机上。

## 从 ChatGPT 连接

前往 [ChatGPT Plugins](https://chatgpt.com/plugins),选择加号按钮以创建开发者模式应用,并选择 **Tunnel** 位于 **Connection**。当 ChatGPT 列出可用的 tunnel 时选择其中一个,或粘贴一个有效的 `tunnel_id` (如果你已有的话)。

如果 ChatGPT 中未显示该 tunnel,请确认该 tunnel 与目标 ChatGPT 工作区相关联,而不仅仅与某个 Platform 组织相关联,并确认应用创建者拥有 Tunnels 的 **读取** + **使用**.

## 从 Responses API 进行连接

将隧道标识符作为 `tunnel_id` 传入 MCP 工具定义中。不要将 OpenAI 托管的隧道端点作为 `server_url`；请仅在 `server_url` Responses API 可以直接访问的 MCP 服务器中使用。

将 Secure MCP Tunnel 与 Responses API 一起使用

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

- MCP 服务器地址保持私有，仅在运行该 `tunnel-client` 的环境内部使用。
- `tunnel-client` 对 OpenAI 隧道控制平面进行身份验证；受支持的 OpenAI 产品使用 OpenAI 托管的隧道端点。
- 隧道访问遵循现有的组织和workspace 上下文，而非引入额外的公共入口路径。
- `tunnel-client` 支持企业网络需求，例如出站代理、自定义 CA 证书包、控制平面客户端证书以及 MCP 端 `mTLS`.

### 日志边界

安全 MCP 隧道将隧道传输与应用层产品日志分离：

- 隧道控制平面鉴权、长轮询 / 响应流量以及单个隧道传输请求不会由隧道路径作为 ChatGPT 合规平台应用事件发出。
- 隧道元数据变更通过 API 平台进行公开 [审计日志](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/audit_logs) 页面中显示， `tunnel.created`, `tunnel.updated`，并且 `tunnel.deleted`.
- 当 ChatGPT 通过安全 MCP 隧道访问自定义应用时，隧道仅作为传输路径。正常的应用级合规日志记录仍适用于应用路径，包括应用调用日志以及应用鉴权生命周期日志，例如 `APP_AUTH_LOG` 当应用被关联或解除关联时。

## 高级：白名单 HTTP 调用

Secure MCP Tunnel 还可以支持从支持的智能体或API 工作流中，以受限范围向客户网络发起 HTTP 调用。 `tunnel-client` 它包含一个嵌入式 MCP 服务器 Harpoon，该服务器按标签暴露已配置的 HTTP 目标，并允许调用方通过隧道以有界的请求/响应限制来调用它们。

当你需要访问少量私有 REST 端点而又不希望将其公开暴露时，可以使用此功能。Harpoon 并非通用代理：调用方不能选择任意主机，且请求仅限于客户所配置的目标和方法。

## 故障排查

- **“在 Platform 隧道设置中显示 “Tunnels access required”：** 隧道权限属于组织级别，而非项目级别。请选择目标 Platform 组织，然后请组织所有者或 RBAC 管理员将你添加到一个拥有 **Read** 查看隧道的角色或用户组，或者 **Read** + **Manage** 来创建、编辑或删除隧道。如果不存在匹配的角色，他们可以新建一个角色，将其分配给一个用户组，并将你添加到该用户组。你还需要 **Use** 才能运行 `tunnel-client` 或在连接器设置中选择隧道。新角色的分配生效最长可能需要 30 分钟。
- **在 ChatGPT 中看不到隧道：** 请确认该隧道包含目标 ChatGPT 工作区，而不仅仅是 Platform 组织；然后检查连接器操作员的 Tunnels **Use** 权限。如果企业账户的工作区无法自动关联，请联系你的 OpenAI 账户团队，申请经过审核的手动关联覆盖。
- **连接器发现或工具调用失败：** 请确认 `tunnel-client run ...` 仍在运行，然后重新运行 `tunnel-client doctor --profile <name> --explain`.
- **你可以查看隧道但无法编辑它：** 该操作员可能拥有 Tunnels **Read** 权限，但没有 Tunnels **Manage**.
- `tunnel-client` 暴露 `/healthz`, `/readyz`, `/metrics`，以及一个本地管理 UI，位于 `/ui`.
- 默认情况下，管理 UI 仅绑定 loopback。仅当你确实需要操作员网络远程访问时，才将其对外暴露。
- 在从 ChatGPT、Codex 或 API 流程进行测试之前，可通过这些界面确认客户端处于健康、就绪并正在轮询的状态。
- 如果客户端未连接，则通过隧道的请求会失败，直到 `tunnel-client` 重新连接。
- 原始 HTTP 日志默认处于禁用状态，且支持导出内容已被脱敏处理。

## OAuth

- OAuth 发现可以沿隧道路径转发，因此 MCP 服务器本身可以保持私有。
- 该隧道会保留面向浏览器的 OAuth 流程所需的上游授权服务器元数据。
- 授权服务器本身不会被自动隧道化。如果授权服务器从公网和 `tunnel-client` 主机都无法访问，那么即使 MCP 服务器可访问，OAuth 流程仍可能失败。

## 配置位置

- 在 manage 列表中管理 OpenAI 托管的 MCP 隧道端点 [平台隧道设置](https://platform.openai.com/settings/organization/tunnels).
- 在开发者模式应用中创建应用时使用隧道 [ChatGPT 插件](https://chatgpt.com/plugins).
- 对于 Codex 或 API 工作流，使用受支持的产品界面所暴露的、由隧道支持的 MCP 目标。

## 后续步骤

- 在其中创建或管理隧道 [平台隧道设置](https://platform.openai.com/settings/organization/tunnels).
- 验证你的 `tunnel-client` 配置文件，使用 `tunnel-client doctor --profile <profile> --explain`.
- 从中连接隧道， [ChatGPT 插件](https://chatgpt.com/plugins) 或你正在使用的受支持的OpenAI 表面。



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
  <figure>
    [<img src="https://developers.openai.com/images/platform/guides/secure-mcp-tunnels/chatgpt-connectors-tunnel.png"
        alt="Sanitized ChatGPT app creation screenshot with Tunnel selected."
        loading="lazy"
        class="w-full rounded-md border border-gray-200 dark:border-gray-800"
      />](https://chatgpt.com/plugins)
    <figcaption class="mt-3 text-sm text-gray-600 dark:text-gray-400">
      Select Tunnel when connecting a ChatGPT developer-mode app to a private
      MCP server.
    </figcaption>
  </figure>