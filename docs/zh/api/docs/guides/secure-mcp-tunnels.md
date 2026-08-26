# 安全 MCP 隧道

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后添加 `.md` 来获取。

Secure MCP 隧道让您可以连接私有 MCP 服务器到受支持的 OpenAI 产品，而无需打开入站防火墙端口或将那些服务器暴露在公共互联网上。运行 `tunnel-client` 在已经可以访问您的 MCP 服务器的网络内部；它会打开一条到 OpenAI 的出站 HTTPS 路径，拉取排队的 MCP 工作，在本地转发请求，并通过同一隧道返回响应。

Secure MCP 隧道支持私有 MCP 连接，包括开发者模式
  测试。它不支持公开插件的提交或分发。公开
  插件需要一个稳定、可公开访问的 HTTPS MCP 端点。如果 MCP
  服务器必须保持私有，请公开一个转发请求的 HTTPS 代理
  到它。参见 [公开插件提交](https://developers.openai.com/plugins/deploy/submission) 了解端点
  和认证要求。

## 什么是 MCP 隧道？

MCP 隧道是从你网络内的主机到 OpenAI 托管的 MCP 端点的仅出站连接。当你的 MCP 服务器是私有的、位于本地或防火墙后面，但 ChatGPT、Codex、Responses API 或其他受支持的 OpenAI 界面仍需要调用它时，请使用此隧道。

Secure MCP Tunnel 保持 MCP 服务器私有，同时为受支持的 OpenAI 产品提供正常的 MCP 请求路径。 `tunnel-client` 轮询 OpenAI 以获取工作，在本地转发 MCP 请求，并通过同一隧道返回响应。

## 在以下情况下使用安全 MCP 隧道：

- 你的 MCP 服务器运行在私有网络、本地部署、开发者机器上，或位于现有访问控制之后。
- 你希望 ChatGPT、Codex、Responses API 或其他受支持的OpenAI界面使用该服务器，同时无需将 MCP 服务器公开。
- 你的网络允许运行 `tunnel-client` 的主机在默认情况下或 `api.openai.com:443` 配置了控制面 mTLS 时，向 `mtls.api.openai.com:443` 发起出站 HTTPS 请求，并访问私有 MCP 服务器。
- 有关一般 MCP 概念，请先参阅 [MCP 和连接器指南](https://developers.openai.com/api/docs/guides/tools-connectors-mcp) 。

## 工作原理

1. 在 Platform 隧道设置中创建或管理 OpenAI 托管的 MCP 隧道端点。
2. 在 `tunnel-client` 网络中运行，该网络可以访问你的私有 MCP 服务器。
3. 配置 `tunnel-client` 使用隧道身份和私有 MCP 服务器地址。
4. OpenAI 产品将 MCP 请求发送到 OpenAI 托管的隧道端点。
5. `tunnel-client` 长时间轮询待处理的工作，转发每个 `JSON-RPC` 请求到私有 MCP 服务器，并通过隧道将响应返回。

私有 MCP 服务器不需要公共监听器。OpenAI 托管端点为受支持的产品提供正常的 MCP 请求路径，而网络发起点仍保留在你的边界内。当连接器请求流式结果时，隧道路径可以转发中间服务器发送的事件。

<figure className="not-prose my-8">
  <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
    OpenAI products call the OpenAI-hosted tunnel endpoint; `tunnel-client`
    long-polls for queued work and returns the MCP response through the same
    tunnel.
  </figcaption>
</figure>

## 开始之前

你需要：

- A `tunnel_id` from [Platform tunnel settings](https://platform.openai.com/settings/organization/tunnels).
- A runtime API key for `tunnel-client`.
- An MCP server that `tunnel-client` can reach over stdio or HTTP from inside your network.

## 权限与访问

[平台隧道权限](https://developers.openai.com/api/docs/guides/rbac) 与 ChatGPT 开发者模式访问权限是分开的：

- 创建或编辑隧道需要 Tunnels **读取** + **管理**.
- 运行 `tunnel-client` 或在创建应用时选择隧道需要 Tunnels **读取** + **使用**.
- 隧道权限适用于 Platform 组织。Platform 组织所有者或 RBAC 管理员授予隧道角色。
- ChatGPT 开发者模式是独立的工作区权限。对于企业版/教育版，工作区管理员授予开发者模式访问权限；用户随后在 **设置 → 安全与登录**。中启用。参见 [开发者模式帮助中心文章](https://help.openai.com/en/articles/12584461-developer-mode-apps-and-full-mcp-connectors-in-chatgpt-beta) 了解按计划的具体策略。

向目标 ChatGPT 工作区管理员申请开发者模式访问权限，并向目标平台组织所有者/RBAC 管理员申请隧道权限。

## 将隧道关联到正确的组织和工作区

一个隧道可以与一个或多个平台组织或 ChatGPT 工作区关联。使用这些关联来定义每个应被允许查找或使用该隧道的 OpenAI 上下文。

- 包含拥有或管理该隧道的 Platform 组织。
- 包含在创建应用时应列出该隧道的 ChatGPT 工作区。
- 当 Codex、Responses API 或另一个受支持的产品将从该组织调用私有 MCP 服务器时，包含另一个 Platform 组织。
- 使用相同的 `tunnel_id` 用于 `tunnel-client`；添加组织或工作区不会创建第二个隧道，也不会更改私有 MCP 服务器端点。

对于个人账户，请使用属于该账户的个人 Platform 组织。对于 ChatGPT 和 Codex 测试，请将隧道与目标 ChatGPT 工作区以及 Codex 将使用的 Platform 组织关联。仅与个人 Platform 组织关联的隧道不会自动出现在 Enterprise/Edu 工作区中。

如果 Platform 组织和 ChatGPT 工作区已关联，你可以在 [Platform 隧道设置](https://platform.openai.com/settings/organization/tunnels)。中添加缺失的组织或工作区。如果你的企业设置无法自动验证（例如 Platform 组织没有对应的 ChatGPT 工作区），请联系你的 OpenAI 客户团队，请求对应使用该隧道的企业账户映射进行人工审核的关联覆盖。

## 网络要求

`tunnel-client` 不需要入站互联网访问。它需要出站 HTTPS 到 OpenAI，并且本地可达私有 MCP 服务器：

| 从                         | 到                                                     | 用于                                                            |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| 运行主机 `tunnel-client` | `api.openai.com:443` 通过 HTTPS 在 `/v1/tunnel/*`      | 默认轮询和响应发布。                               |
| 运行主机 `tunnel-client` | `mtls.api.openai.com:443` 通过 HTTPS 在 `/v1/tunnel/*` | 配置控制平面 mTLS 时的轮询和响应发布。 |
| 运行主机 `tunnel-client` | 配置的 stdio 命令或 MCP 服务器 URL         | 从你的网络内部转发 MCP 请求。                   |

## 设置隧道客户端

打开 [平台隧道设置](https://platform.openai.com/settings/organization/tunnels)，然后使用那里的下载链接或最新的公共 `tunnel-client` 版本，来自 [openai/tunnel-client](https://github.com/openai/tunnel-client/releases/latest)。保持你的运行手册指向最新版本的 URL，而不是硬编码特定的版本 URL。

如果你已有二进制文件，从 `tunnel-client help quickstart`。开始。对于命名的本地 stdio 配置文件，使用：

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

保持 `tunnel-client run ...` 在创建或测试应用时健康运行。应用发现和 MCP 工具调用依赖于正在运行的客户端。

<figure className="not-prose my-8">
  <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
    The local admin UI at `/ui` shows whether the running client is
    healthy, ready, and connected before you test from ChatGPT, Codex, or an API
    flow.
  </figcaption>
</figure>

## 选择运行 tunnel-client 的位置

运行 `tunnel-client` 在与私有 MCP 服务器位于同一信任边界内。常见的部署模式包括：

- **Kubernetes 边车：** 运行 `tunnel-client` 在与 MCP 服务器相同的 Pod 中，并通过 `localhost`.
- **专用 Kubernetes 部署：** 运行 `tunnel-client` 单独运行，当 MCP 服务器已通过私有 Service 可达时。
- **虚拟机或 systemd 服务：** 运行 `tunnel-client` 在可通过私有网络访问 MCP 服务器的主机上。

## 从 ChatGPT 连接

前往 [ChatGPT Plugins](https://chatgpt.com/plugins)，选择加号按钮以创建开发者模式应用，并选择 **Tunnel** 下的 **Connection**。当 ChatGPT 列出可用隧道时选择一个，或粘贴有效的 `tunnel_id` （如果你已有的话）。

如果隧道未出现在 ChatGPT 中，请确认该隧道关联到目标 ChatGPT 工作区，而不仅仅是 Platform 组织，并且应用创建者拥有 Tunnels 的 **Read** + **Use**.

## 安全与网络

<figure className="not-prose my-8">
  <figcaption className="mt-3 text-sm text-gray-600 dark:text-gray-400">
    The private MCP server stays inside the customer-controlled environment.
    `tunnel-client` reaches OpenAI over outbound HTTPS using the runtime API key
    and, when required, optional control-plane mTLS.
  </figcaption>
</figure>

- MCP 服务器地址保持私有，仅从环境内部使用，其中 `tunnel-client` 运行。
- `tunnel-client` 对 OpenAI 隧道控制平面进行身份验证；受支持的 OpenAI 产品使用 OpenAI 托管的隧道端点。
- 隧道访问遵循现有的组织和工作区上下文，而不是引入单独的公共入口路径。
- `tunnel-client` 支持企业网络需求，如出站代理、自定义 CA 捆绑包、控制平面客户端证书和 MCP 侧 `mTLS`.

### 日志边界

安全 MCP 隧道将隧道传输与应用级产品日志分离：

- 隧道控制面认证、长轮询/响应流量以及各个隧道传输请求不会由隧道路径作为 ChatGPT 合规平台应用事件发出。
- 隧道元数据更改通过 API 平台 [审计日志](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/audit_logs) 体现为 `tunnel.created`, `tunnel.updated`，以及 `tunnel.deleted`.
- 当 ChatGPT 通过 Secure MCP Tunnel 访问自定义应用时，隧道仅作为传输路径。应用路径上仍适用正常的应用级合规日志记录，包括应用调用日志和应用认证生命周期日志，例如 `APP_AUTH_LOG` 应用被链接或取消链接时。

## 高级：白名单 HTTP 调用

安全 MCP 隧道还可以支持受支持的智能体或API流程中对客户网络的窄范围 HTTP 调用。 `tunnel-client` 包括一个嵌入式 MCP 服务器 Harpoon，它按标签公开配置的 HTTP 目标，并允许调用方通过隧道调用它们，且具有受限的请求/响应限制。

当你需要访问一小部分私有 REST 端点而无需公开暴露它们时，使用此功能。Harpoon 不是通用代理：调用方不能选择任意主机，并且请求仅限于客户配置的目标和方法。

## 故障排查

- **“Platform 通道设置中提示“需要通道访问权限”时：** 通道权限是组织级别的，而非项目级别的。选择目标 Platform 组织，然后请组织所有者或 RBAC 管理员将你添加到具有 **读取** 权限的角色或组中以查看通道，或者 **读取** + **管理** 权限以创建、编辑或删除通道。如果不存在匹配的角色，他们可以创建一个角色，将其分配给某个组，并将你添加到该组。你还需要 **使用** 权限来运行 `tunnel-client` 或在连接器设置中选择一个通道。新的角色分配可能需要最多 30 分钟才能生效。
- **ChatGPT 中看不到通道：** 请检查该通道是否包含目标 ChatGPT 工作区，而不仅仅是 Platform 组织；然后检查连接器操作员的通道 **使用** 权限。如果企业账户无法自动关联工作区，请联系你的OpenAI客户团队，申请人工关联覆盖的审核。
- **连接器发现或工具调用失败：** 确认 `tunnel-client run ...` 仍在运行，然后重新运行 `tunnel-client doctor --profile <name> --explain`.
- **你可以查看通道但无法编辑：** 操作员可能只具有通道的 **读取** 但不支持 Tunnels **管理**.
- `tunnel-client` 暴露 `/healthz`, `/readyz`, `/metrics`，以及一个本地管理界面，位于 `/ui`.
- 管理界面默认仅限回环访问。仅当你确实需要操作员网络访问时，才远程暴露它。
- 在从 ChatGPT、Codex 或 API 流程测试之前，使用这些界面确认客户端健康、就绪且正在轮询。
- 如果客户端未连接，通过隧道发出的请求将失败，直到 `tunnel-client` 重新连接。
- 原始 HTTP 日志默认禁用，支持导出内容经脱敏处理。

## OAuth

- OAuth 发现可以通过隧道路径进行，因此 MCP 服务器本身可以保持私有。
- 隧道保留了面向浏览器 OAuth 流程所需的上游授权服务器元数据。
- 授权服务器本身不会自动隧道化。如果它从公共互联网和 `tunnel-client` 主机无法访问，即使 MCP 服务器可达，OAuth 流程仍可能失败。

## 在哪里配置它

- 管理 OpenAI 托管的 MCP 隧道端点（位于 [平台隧道设置](https://platform.openai.com/settings/organization/tunnels).
- 在创建开发者模式应用时使用隧道，详见 [ChatGPT 插件](https://chatgpt.com/plugins).
- 对于 Codex 或 API 流程，请使用受支持产品界面公开的隧道支持的 MCP 目标。

## 后续步骤

- 在 [平台隧道设置](https://platform.openai.com/settings/organization/tunnels).
- 中创建或管理隧道。验证你的 `tunnel-client` 配置文件，然后通过 `tunnel-client doctor --profile <profile> --explain`.
- 从 [ChatGPT 插件](https://chatgpt.com/plugins) 或你正在使用的受支持的 OpenAI 界面连接隧道。



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