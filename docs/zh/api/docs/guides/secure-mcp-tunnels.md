# Secure MCP Tunnel

> 完整文档索引请参见 [llms.txt](/llms.txt). 可通过在页面 URL 后追加 `.md` 获取文档页面的 Markdown 版本。

Secure MCP Tunnel 允许你将私有 MCP 服务器连接到受支持的 OpenAI 产品，而无需开放入站防火墙端口，也无需将这些服务器暴露到公共互联网上。运行 `tunnel-client` 在能够访问你的 MCP 服务器的网络内部；它会向 OpenAI 打开一条出站 HTTPS 路径，拉取已排队的 MCP 任务，在本地转发请求，并通过同一隧道返回响应。

Secure MCP Tunnel 支持私有 MCP 连接，包括开发者模式
  测试。它不支持公共插件提交或分发。公共
  插件需要一个稳定的、可公开访问的 HTTPS MCP 端点。如果 MCP
  服务器必须保持私有，请暴露一个将请求转发到它的公共 HTTPS 代理。
  请参阅 [公共插件提交](https://developers.openai.com/plugins/deploy/submission) 了解端点
  和身份验证要求。

## 什么是 MCP 隧道？

MCP 隧道是从你网络内部的主机到 OpenAI 托管的 MCP 端点的仅出站连接。当你的 MCP 服务器是私有的、本地部署的或位于防火墙后，但 ChatGPT、Codex、Responses API 或其他受支持的 OpenAI 界面仍需要调用它时，可以使用该隧道。

安全 MCP 隧道在保持 MCP 服务器私有性的同时，为受支持的 OpenAI 产品提供了一条常规的 MCP 请求路径。 `tunnel-client` 通过同一隧道轮询 OpenAI 以获取任务，本地转发 MCP 请求，并通过同一隧道返回响应。

## 使用安全 MCP 隧道

- 你的 MCP 服务器运行在私有网络、本地环境、开发者机器上，或位于现有访问控制之后。
- 你希望 ChatGPT、Codex、Responses API 或其他受支持的 OpenAI 接口能够在不公开该 MCP 服务器的情况下使用它。
- 你的网络允许运行 `tunnel-client` 的主机向 `api.openai.com:443` 发起出站 HTTPS 请求， `mtls.api.openai.com:443` （在配置了控制面 mTLS 时），并能够访问该私有 MCP 服务器。
- 请先阅读 [MCP 和连接器指南](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 了解通用的 MCP 概念。

## 工作原理

1. 在 Platform 隧道设置中创建或管理一个 OpenAI 托管的 MCP 隧道端点。
2. 运行 `tunnel-client` 在能够访问你的私有 MCP 服务器的网络中。
3. 配置 `tunnel-client` 时使用隧道身份和私有 MCP 服务器地址。
4. OpenAI 产品将 MCP 请求发送到 OpenAI 托管的隧道端点。
5. `tunnel-client` 通过长轮询获取已排队的工作，将每个 `JSON-RPC` 请求转发到私有 MCP 服务器，并通过隧道将响应回传。

私有 MCP 服务器不需要公共监听器。OpenAI 托管的端点为受支持的产品提供了一条常规的 MCP 请求路径，同时网络发起点仍位于你的边界内。当连接器请求流式结果时，隧道路径可以转发中间的服务器推送事件。

<figure className="not-prose my-8">
  <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
    OpenAI products call the OpenAI-hosted tunnel endpoint; `tunnel-client`
    long-polls for queued work and returns the MCP response through the same
    tunnel.
  </figcaption>
</figure>

## 准备工作

你需要：

- 一个 `tunnel_id` from [Platform tunnel settings](https://platform.openai.com/settings/organization/tunnels).
- 运行时 API 密钥，用于 `tunnel-client`.
- 一个 MCP 服务器，可 `tunnel-client` 通过 stdio 或 HTTP 从你的网络内部访问。

## 权限与访问

[Platform 隧道权限](https://developers.openai.com/api/docs/guides/rbac) 与 ChatGPT 开发者模式访问是分开的：

- 创建或编辑隧道需要 Tunnels **读取** + **管理**.
- 运行 `tunnel-client` 或选择隧道（创建应用时）需要 Tunnels **读取** + **使用**.
- Tunnel 权限适用于 Platform 组织。Platform 组织所有者或 RBAC 管理员授予该隧道角色。
- ChatGPT 开发者模式是一项独立的工作区权限。对于 Enterprise/Edu，工作区管理员授予开发者模式访问权限；然后用户在 **Settings → Security and login**。中启用它。请参阅 [developer-mode Help Center 文章](https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta) 了解各套餐的具体政策。

向目标 ChatGPT 工作区的管理员申请开发者模式访问权限，并向目标 Platform 组织的所有者/RBAC 管理员申请 tunnel 权限。

## 将隧道关联到正确的组织和工作区

一个通道可以关联到一个或多个 Platform 组织或 ChatGPT 工作区。使用这些关联来定义应当被允许查找或使用该通道的每一个 OpenAI 上下文。

- 包含拥有或管理该隧道的 Platform 组织。
- 包含在创建应用时应列出该隧道的 ChatGPT 工作区。
- 包含另一个 Platform 组织，当 Codex、Responses API 或其他受支持的产品需要从该组织调用私有 MCP 服务器时。
- 使用相同的 `tunnel_id` 用于 `tunnel-client`；添加组织或工作区不会创建第二条隧道，也不会改变私有 MCP 服务器的端点。

对于个人账户，使用属于该账户的个人 Platform 组织。对于 ChatGPT 和 Codex 测试，将隧道与目标 ChatGPT workspace 以及 Codex 将要使用的 Platform 组织相关联。仅与个人 Platform 组织相关联的隧道不会自动出现在 Enterprise/Edu workspace 中。

如果 Platform 组织与 ChatGPT workspace 已关联，你可以在 [Platform tunnel settings](https://platform.openai.com/settings/organization/tunnels)。中添加缺失的组织或 workspace。如果你的企业设置无法自动验证（例如 Platform 组织没有对应的 ChatGPT workspace），请联系你的 OpenAI 客户团队，请求对应该使用该隧道的企业账户映射进行人工审核的关联覆盖。

## 网络要求

`tunnel-client` 不需要入站互联网访问。它需要到 OpenAI 的出站 HTTPS，以及对本地 MCP 服务器的网络可达性：

| 来源                         | 目标                                                     | 用途                                                            |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| 运行主机 `tunnel-client` | `api.openai.com:443` 通过 HTTPS `/v1/tunnel/*`      | 默认的轮询和响应提交。                               |
| 运行主机 `tunnel-client` | `mtls.api.openai.com:443` 通过 HTTPS `/v1/tunnel/*` | 在配置了控制面 mTLS 时的轮询和响应提交。 |
| 运行主机 `tunnel-client` | 配置的 stdio 命令或 MCP 服务器 URL         | 从你的网络内部转发 MCP 请求。                   |

## 设置 tunnel-client

打开 [Platform tunnel settings](https://platform.openai.com/settings/organization/tunnels)，然后使用该页面上的下载链接或最新的公开 `tunnel-client` 版本来自 [openai/tunnel-client](https://github.com/openai/tunnel-client/releases/latest)。让你的运维手册指向最新版本 URL，而不是硬编码某个特定的版本 URL。

如果你已经有二进制文件，可以从 `tunnel-client help quickstart`。开始。对于命名的本地 stdio 配置，使用：

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

对于 HTTP MCP 服务器，使用 `--mcp-server-url https://mcp.internal.example.com/mcp` 替代 `--mcp-command`.

保持 `tunnel-client run ...` 在你创建或测试应用时保持运行。应用发现和 MCP 工具调用依赖于正在运行的客户端。

<figure className="not-prose my-8">
  <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
    The local admin UI at `/ui` shows whether the running client is
    healthy, ready, and connected before you test from ChatGPT, Codex, or an API
    flow.
  </figcaption>
</figure>

## 选择运行 tunnel-client 的位置

运行 `tunnel-client` 在与私有 MCP 服务器相同的信任边界内。常见的部署模式包括：

- **Kubernetes sidecar：** 运行 `tunnel-client` 与同一 Pod 中的 MCP 服务器并置，并通过 `localhost`.
- **独立 Kubernetes 部署：** 运行 `tunnel-client` 独立部署，以应对 MCP 服务器已可通过私有 Service 访问的情况。
- **VM 或 systemd 服务：** 运行 `tunnel-client` 部署在能够通过私有网络访问 MCP 服务器的主机上。

## 从 ChatGPT 连接

前往 [ChatGPT Plugins](https://chatgpt.com/plugins)，点击加号按钮创建一个开发者模式应用，然后选择 **Tunnel** 位于 **Connection**。当 ChatGPT 列出隧道时选择一个可用的隧道，或者如果你已有隧道则粘贴一个有效的 `tunnel_id` （如果你已有的话）。

如果隧道没有出现在 ChatGPT 中，请确认该隧道关联的是目标 ChatGPT 工作区，而不仅仅是 Platform 组织，并且应用创建者拥有 Tunnels 的 **Read** + **Use**.

## 安全与网络

<figure className="not-prose my-8">
  <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
    The private MCP server stays inside the customer-controlled environment.
    `tunnel-client` reaches OpenAI over outbound HTTPS using the runtime API key
    and, when required, optional control-plane mTLS.
  </figcaption>
</figure>

- MCP 服务器地址保持私有，并且仅在所在环境内部使用， `tunnel-client` 在其中运行。
- `tunnel-client` 向 OpenAI 隧道控制面进行身份认证；受支持的 OpenAI 产品使用 OpenAI 托管的隧道端点。
- 隧道访问遵循现有的组织和workspace上下文，而不会引入额外的公共入口路径。
- `tunnel-client` 支持企业网络需求，例如出站代理、自定义 CA 包、控制面客户端证书以及 MCP 端的 `mTLS`.

### 日志边界

Secure MCP Tunnel 将隧道传输与应用层的产品日志分离：

- 隧道控制面鉴权、长轮询 / 响应流量以及单个隧道传输请求，不会由隧道路径作为 ChatGPT 合规平台应用事件发出。
- 隧道元数据变更通过 API 平台暴露 [审计日志](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/audit_logs) 中呈现， `tunnel.created`, `tunnel.updated`，以及 `tunnel.deleted`.
- 当 ChatGPT 通过安全 MCP 隧道访问自定义应用时，隧道仅作为传输路径。应用路径上的常规应用级合规日志仍然适用，包括应用调用日志和应用鉴权生命周期日志，例如 `APP_AUTH_LOG` 应用被链接或取消链接时。

## 高级：allowlisted HTTP callouts

Secure MCP Tunnel 还可以支持从受支持的智能体或API流程向客户网络发起范围受限的 HTTP 调用。 `tunnel-client` 包含一个嵌入式 MCP 服务器 Harpoon，它按标签公开已配置的 HTTP 目标，并允许调用方通过隧道发起调用，同时对请求/响应施加有界限制。

当你需要访问少量私有 REST 端点又不想将其公开暴露时，可以使用此功能。Harpoon 并非通用代理：调用方不能随意选择主机，且请求仅限于客户已配置的目标和方法。

## 故障排查

- **“在 Platform 隧道设置中显示 “需要隧道访问权限”：** 隧道权限属于组织级别，而非项目级别。选择目标 Platform 组织后，请联系组织所有者或 RBAC 管理员将你添加到具有 **读取** 权限的角色或组中以查看隧道，或 **读取** + **管理** 权限以创建、编辑或删除它们。如果不存在匹配的角色，他们可以创建一个新角色，将其分配给一个组，并将你添加到该组。你还需要 **使用** 才能运行 `tunnel-client` 或在连接器设置中选择一个隧道。新角色分配的生效可能需要长达 30 分钟。
- **在 ChatGPT 中看不到隧道：** 请检查该隧道是否包含目标 ChatGPT 工作区，而不仅仅是 Platform 组织；然后检查连接器操作员的 Tunnels **使用** 权限。如果企业账户的工作区无法自动关联，请联系你的 OpenAI 账户团队申请经审核的人工关联覆盖。
- **连接器发现或工具调用失败：** 请确认 `tunnel-client run ...` 仍在运行，然后重新运行 `tunnel-client doctor --profile <name> --explain`.
- **你可以查看隧道但无法编辑：** 该操作员可能拥有 Tunnels **读取** 权限，但没有 Tunnels **管理**.
- `tunnel-client` 暴露 `/healthz`, `/readyz`, `/metrics`，以及一个本地管理界面，地址为 `/ui`.
- 管理界面默认仅监听 loopback。仅当你确实需要让某个操作员网络远程访问它时，才将其对外暴露。
- 使用这些接口确认客户端处于健康、就绪且正在轮询的状态，然后再从 ChatGPT、Codex 或 API 流程进行测试。
- 如果客户端未连接，通过隧道的请求会一直失败，直到 `tunnel-client` 重连。
- 默认情况下，原始 HTTP 日志记录处于禁用状态，且支持导出会被脱敏处理。

## OAuth

- OAuth 发现可以穿过隧道路径传输，从而 MCP 服务器本身可以保持私有。
- 隧道保留了面向浏览器的 OAuth 流程所需的上游授权服务器元数据。
- 授权服务器本身不会被自动隧道化。如果授权服务器从公共互联网和 `tunnel-client` 主机都无法访问，那么即使 MCP 服务器可以访问，OAuth 流程仍可能失败。

## 在哪里配置

- 在管理 OpenAI 托管的 MCP 隧道端点时 [Platform tunnel settings](https://platform.openai.com/settings/organization/tunnels).
- 在创建开发者模式应用时使用隧道，请前往 [ChatGPT 插件](https://chatgpt.com/plugins).
- 对于 Codex 或 API 流程，请使用由受支持的产品界面所提供的、由隧道支持的 MCP 目标。

## Next steps

- 创建或管理隧道 [Platform tunnel settings](https://platform.openai.com/settings/organization/tunnels).
- 验证你的 `tunnel-client` 配置文件 `tunnel-client doctor --profile <profile> --explain`.
- 从中连接隧道 [ChatGPT 插件](https://chatgpt.com/plugins) 或你正在使用的受支持的OpenAI 界面。



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