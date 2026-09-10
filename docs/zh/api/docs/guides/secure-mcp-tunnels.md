# Secure MCP Tunnel

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。可在页面 URL 末尾追加 `.md` 以获取文档页面的 Markdown 版本。

Secure MCP Tunnel 让你在无需开放入站防火墙端口或将这些服务器暴露给公网的前提下，将私有 MCP 服务器连接到受支持的 OpenAI 产品。在可访问你的 MCP 服务器的网络内运行； `tunnel-client` 它会打开一条到 OpenAI 的出站 HTTPS 通道，拉取排队的 MCP 任务，在本地转发请求，并通过同一隧道返回响应。

Secure MCP Tunnel 支持私有 MCP 连接，包括开发者模式
  测试。它不支持公开插件提交或分发。公开
  插件要求使用一个稳定的、可公开访问的 HTTPS MCP 端点。如果 MCP
  服务器必须保持私有，请暴露一个将请求转发到它的公共 HTTPS 代理。参见
  公开插件提交 [public plugin submission](https://developers.openai.com/plugins/deploy/submission) 以了解端点
  和身份验证要求。

## 什么是 MCP 隧道？

MCP 隧道是从你网络内部的主机到 OpenAI 托管的 MCP 端点的仅出站连接。当你的 MCP 服务器是私有的、本地部署的或位于防火墙后，但仍需要被 ChatGPT、Codex、Responses API 或其他受支持的 OpenAI 接口调用时，请使用它。

安全 MCP 隧道在保持 MCP 服务器私有的同时，为受支持的 OpenAI 产品提供正常的 MCP 请求路径。 `tunnel-client` 从 OpenAI 拉取工作，在本地转发 MCP 请求，并通过同一隧道返回响应。

## 使用安全 MCP 隧道时

- 你的 MCP 服务器运行在专有网络、本地环境、开发者机器上，或位于现有访问控制之后。
- 你希望 ChatGPT、Codex、Responses API 或其他受支持的 OpenAI 界面能够使用该服务器，而无需将 MCP 服务器公开。
- 你的网络允许运行 `tunnel-client` 的主机向 `api.openai.com:443` 发起出站 HTTPS 请求（默认情况下，或 `mtls.api.openai.com:443` 在配置了控制面 mTLS 时），并能够访问该私有 MCP 服务器。
- 从 [MCP 与连接器指南](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 开始了解通用的 MCP 概念。

## 工作原理

1. 在 Platform 隧道设置中创建或管理一个 OpenAI 托管的 MCP 隧道端点。
2. 运行 `tunnel-client` 在能够访问你的私有 MCP 服务器的网络内部。
3. 配置 `tunnel-client` 隧道身份和私有 MCP 服务器地址。
4. OpenAI 产品将 MCP 请求发送到 OpenAI 托管的隧道端点。
5. `tunnel-client` 对排队的任务进行长轮询，并将每个 `JSON-RPC` 请求转发到私有 MCP 服务器，再通过隧道将响应回传。

私有 MCP 服务器不需要公共监听器。OpenAI 托管的端点为受支持的产品提供了一条常规的 MCP 请求路径，同时网络发起点仍位于你的边界内。当连接器请求流式结果时，隧道路径可以转发中间的 server-sent 事件。

<figure className="not-prose my-8">
  

![Diagram showing an OpenAI product sending MCP JSON-RPC through the OpenAI tunnel service to tunnel-client, which forwards the request to a private MCP server and returns the response through the same tunnel.](<https://developers.openai.com/images/platform/guides/secure-mcp-tunnels/request-flow-diagram.png>)


  <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
    OpenAI products call the OpenAI-hosted tunnel endpoint; `tunnel-client`
    long-polls for queued work and returns the MCP response through the same
    tunnel.
  </figcaption>
</figure>

## 开始之前

你需要：

- 一个 `tunnel_id` 从 [Platform 隧道设置](https://platform.openai.com/settings/organization/tunnels).
- 用于的运行时 API 密钥 `tunnel-client`.
- 一个 MCP 服务器 `tunnel-client` 可以通过 stdio 或 HTTP 从你的网络内部访问。

## 权限与访问

[Platform tunnel 权限](https://developers.openai.com/api/docs/guides/rbac) 与 ChatGPT 开发者模式访问是分开的：

- 创建或编辑隧道需要 Tunnels **Read** + **Manage**.
- Running `tunnel-client` 或在创建应用时选择该隧道需要 Tunnels **Read** + **Use**.
- 隧道权限适用于 Platform 组织。Platform 组织所有者或 RBAC 管理员授予该隧道角色。
- ChatGPT 开发者模式是独立的工作区权限。对于 Enterprise/Edu，由工作区管理员授予开发者模式访问权限；随后用户在 **Settings → Security and login**。中启用。请参阅 [developer-mode Help Center article](https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta) 了解各套餐的具体策略。

向目标 ChatGPT 工作区的管理员申请开发者模式访问权限，并向目标 Platform 组织所有者/RBAC 管理员申请隧道权限。

## 将隧道与正确的组织和工作区关联

一个隧道可以关联到一个或多个 Platform 组织或 ChatGPT 工作区。使用这些关联来定义所有应当被允许发现或使用该隧道的 OpenAI 上下文。

- 包含拥有或管理该隧道（tunnel）的 Platform 组织。
- 包含在创建应用时应列出该隧道的 ChatGPT 工作区。
- 在 Codex、Responses API 或其他受支持的产品将从该组织调用私有 MCP 服务器时，包含另一个 Platform 组织。
- 对所有目标使用同一 `tunnel_id` ；添加组织或 `tunnel-client`；工作区不会创建第二个隧道，也不会更改私有 MCP 服务器的端点。

对于个人账户，请使用该账户所属的个人 Platform 组织。对于 ChatGPT 和 Codex 测试，请将隧道与目标 ChatGPT 工作区以及 Codex 将使用的 Platform 组织相关联。仅与个人 Platform 组织关联的隧道不会自动出现在 Enterprise/Edu 工作区中。

如果 Platform 组织与 ChatGPT 工作区已经关联，你可以在 [Platform 隧道设置](https://platform.openai.com/settings/organization/tunnels)。中添加缺失的组织或工作区。如果你的企业设置无法自动验证（例如 Platform 组织没有对应的 ChatGPT 工作区），请联系你的 OpenAI 账户团队，申请对应当使用该隧道的企业账户映射进行人工审核关联覆盖。

## 网络要求

`tunnel-client` 不需要入站互联网访问。它需要向 OpenAI 进行出站 HTTPS 访问，并且能够在本地访问私有 MCP 服务器：

| 从                         | 到                                                     | 用于                                                            |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| 运行主机 `tunnel-client` | `api.openai.com:443` 通过 HTTPS 在 `/v1/tunnel/*`      | 默认轮询和响应发布。                               |
| 运行主机 `tunnel-client` | `mtls.api.openai.com:443` 通过 HTTPS 在 `/v1/tunnel/*` | 配置控制平面 mTLS 时的轮询和响应发布。 |
| 运行主机 `tunnel-client` | 配置的 stdio 命令或 MCP 服务器 URL         | 从网络内部转发 MCP 请求。                   |

## 设置 tunnel-client

打开 [Platform 隧道设置](https://platform.openai.com/settings/organization/tunnels)，然后使用该页面中的下载链接，或使用 `tunnel-client` 中的最新 [openai/tunnel-client](https://github.com/openai/tunnel-client/releases/latest)。公共版本。让你的运行手册指向 latest-release URL，而不是硬编码某个具体的发布版本 URL。

如果你已经有可执行文件，请从 `tunnel-client help quickstart`。开始。对于已命名的本地 stdio 配置，使用：

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

对于 HTTP MCP 服务器，使用 `--mcp-server-url https://mcp.internal.example.com/mcp` 而不是 `--mcp-command`.

保持 `tunnel-client run ...` 在创建或测试应用时保持运行。应用发现和 MCP 工具调用都依赖于正在运行的客户端。

<figure className="not-prose my-8">
  

![Live local tunnel-client admin UI showing health, readiness, tunnel metadata, and channel status.](<https://developers.openai.com/images/platform/guides/secure-mcp-tunnels/tunnel-client-admin-ui.png>)


  <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
    The local admin UI at `/ui` shows whether the running client is
    healthy, ready, and connected before you test from ChatGPT, Codex, or an API
    flow.
  </figcaption>
</figure>

## 选择 tunnel-client 的运行位置

Run `tunnel-client` 在同一受信边界内运行，该受信边界已可访问私有 MCP 服务器。常见的部署模式包括：

- **Kubernetes sidecar：** 运行 `tunnel-client` 与 MCP 服务器部署在同一 Pod 中，并通过 `localhost`.
- **专用 Kubernetes 部署：** 运行 `tunnel-client` 单独部署；适用于已可通过私有 Service 访问 MCP 服务器的情况。
- **VM 或 systemd 服务：** 运行 `tunnel-client` 部署在可通过私有网络访问 MCP 服务器的主机上。

## Connect from ChatGPT

前往 [ChatGPT Plugins](https://chatgpt.com/plugins),选择加号按钮以创建开发者模式应用,然后选择 **Tunnel** 位于 **Connection**.当 ChatGPT 列出时可选择可用的 tunnel,或粘贴一个有效的 `tunnel_id` 如果你已经有一个的话。

如果 tunnel 未出现在 ChatGPT 中,请验证该 tunnel 与目标 ChatGPT 工作区相关联,而不仅仅是与某个 Platform 组织相关联,并且应用创建者拥有 Tunnels 的 **读取** + **使用**.

## 从 Responses API 连接

将隧道标识符作为 `tunnel_id` 传入 MCP 工具定义中。不要将 OpenAI 托管的隧道端点作为 `server_url`；传入；请改用 `server_url` ，仅用于 Responses API 能够直接访问的 MCP 服务器。

将安全 MCP 隧道与 Responses API 配合使用

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

- MCP 服务器地址保持私有，且仅在以下环境中使用： `tunnel-client` 运行。
- `tunnel-client` 向 OpenAI 隧道控制平面进行身份验证；受支持的 OpenAI 产品使用 OpenAI 托管的隧道端点。
- 隧道访问遵循现有的组织和 workspace 上下文，而不会引入单独的公共入口路径。
- `tunnel-client` 支持企业网络需求，例如出站代理、自定义 CA 包、控制平面客户端证书以及 MCP 端的 `mTLS`.

### Logging boundaries

Secure MCP Tunnel 将隧道传输与应用层产品日志分离：

- 隧道控制平面认证、长轮询 / 响应流量以及单个隧道传输请求不会由隧道路径作为 ChatGPT 合规平台应用事件发出。
- 隧道元数据变更通过 API 平台暴露 [审计日志](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/audit_logs) 呈现为 `tunnel.created`, `tunnel.updated`，并且 `tunnel.deleted`.
- 当 ChatGPT 通过 Secure MCP Tunnel 访问自定义应用时，该隧道仅作为传输路径。常规的应用级合规日志记录仍会在应用路径上生效，包括应用调用日志和应用认证生命周期日志，例如 `APP_AUTH_LOG` 当应用被关联或解除关联时。

## 高级：允许列表中的 HTTP 调用

Secure MCP Tunnel 还可以支持来自受支持 智能体 或 API 流程的范围受限的 HTTP 调用，进入客户网络。 `tunnel-client` 包含一个嵌入式 MCP 服务器 Harpoon，它通过标签公开已配置的 HTTP 目标，并允许调用方通过隧道在有界的请求/响应限制内调用它们。

当你需要访问少量私有 REST 端点而又不将其公开时，可使用该功能。Harpoon 并非通用代理：调用方无法选择任意主机，并且请求仅限于客户配置的目标和方法。

## 故障排查

- **“在 Platform 隧道设置中显示“Tunnels access required”：** 隧道权限属于组织层级，而非项目层级。选择目标 Platform 组织，然后请组织所有者或 RBAC 管理员将你添加到一个具有 **Read** 权限的角色或组以查看隧道，或 **Read** + **Manage** 权限的角色或组以创建、编辑或删除它们。如果不存在匹配的角色，他们可以创建一个角色，将其分配给一个组，并将你添加到这个组。你还需要 **Use** 权限才能运行 `tunnel-client` 或在连接器设置中选择一个隧道。新角色分配生效最多需要等待 30 分钟。
- **在 ChatGPT 中看不到隧道：** 检查隧道是否包含目标 ChatGPT 工作区，而不仅仅是 Platform 组织；然后检查连接器操作者的 Tunnels **Use** 权限。如果企业账户的工作区无法自动关联，请联系你的OpenAI账户团队申请经审核的手动关联覆盖。
- **连接器发现或工具调用失败：** 确认 `tunnel-client run ...` 仍在运行，然后重新运行 `tunnel-client doctor --profile <name> --explain`.
- **你可以查看隧道但无法编辑：** 操作者很可能拥有 Tunnels **Read** 权限，但没有 Tunnels **Manage**.
- `tunnel-client` 暴露 `/healthz`, `/readyz`, `/metrics`，以及一个本地管理 UI，位于 `/ui`.
- 管理 UI 默认仅监听回环地址。仅当你确实需要操作者网络远程访问它时，才对外暴露。
- 在通过 ChatGPT、Codex 或 API 流程进行测试之前，使用这些接口确认客户端处于健康、就绪并正在轮询的状态。
- 如果客户端未连接，通过隧道的请求会失败，直到 `tunnel-client` 重新连接。
- 默认情况下,原始 HTTP 日志记录处于禁用状态,并且支持导出会进行脱敏处理。

## OAuth

- OAuth 发现可以通过隧道路径传输，从而使 MCP 服务器本身保持私有。
- 该隧道会保留面向浏览器的 OAuth 流程所需的上游授权服务器元数据。
- 授权服务器本身不会被自动隧道化。如果授权服务器无法从公共互联网以及从 `tunnel-client` 主机访问，那么即使 MCP 服务器可访问，OAuth 流程仍可能失败。

## 配置位置

- 在 ChatGPT 中管理 OpenAI 托管的 MCP 隧道端点 [Platform 隧道设置](https://platform.openai.com/settings/organization/tunnels).
- 在创建开发者模式应用时使用隧道 [ChatGPT 插件](https://chatgpt.com/plugins).
- 对于 Codex 或 API 流程，请使用受支持的产品界面所提供的、由隧道支撑的 MCP 目标。

## 下一步

- 在以下位置创建或管理隧道 [Platform 隧道设置](https://platform.openai.com/settings/organization/tunnels).
- 验证你的 `tunnel-client` 配置文件，使用 `tunnel-client doctor --profile <profile> --explain`.
- 从以下位置连接隧道 [ChatGPT 插件](https://chatgpt.com/plugins) 或你所使用的受支持的 OpenAI 界面。



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