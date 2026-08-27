# Private Link

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

OpenAI Private Link 让 Azure 工作负载通过 Azure Private Link 连接区域性的 OpenAI API 端点，而不是直接连接到公共 API 端点。为每个由 OpenAI 提供的区域性 Private Link Service 创建私有端点，在私有 DNS 中映射其区域主机名，并向该主机名发送正常的经过身份验证的 API 请求。

当你的组织有严格要求将流量保留在 Azure 专用网络中时，请使用 Private Link。如果没有专用网络要求，OpenAI 的公共端点更易于设置和操作。Private Link 与 IP 允许列表控制或双向 TLS（mTLS）不兼容；如果你需要帮助选择合适的企业网络控制，请联系 OpenAI。

Private Link 目前不是自助服务。请与你的 OpenAI 联系人合作，或
  [联系销售](https://openai.com/contact-sales/) 以请求访问权限，并
  获取你需要的区域性 Private Link Service 别名或资源标识符
  。

## 了解 Private Link 的工作原理

一些客户一直在使用传统的 Private Link 解决方案（v1），该方案将每个专用终结点连接到特定的OpenAI API集群。当前的区域解决方案在以下方面有所不同：

|                       | 传统专用链接 (v1)                                                    | 区域专用链接                                                                    |
| --------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 主机名             | 集群专属，例如 `privatelink.enterprise.unified-1.api.openai.com` | 区域专属，例如 `southcentralus.privatelink.api.openai.com`                            |
| OpenAI 路由        | 固定到单个 OpenAI API 集群                                            | 区域专用边缘网关，可路由到多个底层 OpenAI API 集群 |
| 客户健康检查 | 旧的 v1 健康检查路径                                                 | `GET /v2/privatelink_healthcheck`                                                        |

请求遵循以下路径：

1. 你的应用程序通过你的私有 DNS 解析一个区域性的 Private Link 主机名。
2. 该主机名解析为你虚拟网络中的一个 Azure 私有端点。
3. 该私有端点连接到区域性的 OpenAI 专用链接服务。
4. 该专用链接服务将请求发送到 OpenAI 的区域性私有边缘网关。
5. 该网关将请求路由到该区域轨道上一个支持企业级功能的底层 OpenAI API 集群。

在区域铁路内，Private Link 可以绕过不可用的后端集群进行路由，而OpenAI可以添加后端集群，无需你重新配置 Private Endpoints。它不会自动将流量从你选择的区域主机名转移到不同的区域 Private Endpoint。不要假设 Private Link 继承OpenAI的公共端点路由行为；请配置你的应用程序在区域之间进行故障转移。

## 选择区域端点

OpenAI 在上线过程中会提供确切的 Private Link Service 别名或资源标识符。当前生产区域主机名为：

| 区域标签       | 客户主机名                          |
| ------------------ | ------------------------------------------- |
| 美国中南部   | `southcentralus.privatelink.api.openai.com` |
| 美国西部            | `westus.privatelink.api.openai.com`         |
| 美国东部 2          | `eastus2.privatelink.api.openai.com`        |
| 西班牙中部 / 欧盟 | `spaincentral.privatelink.api.openai.com`   |

西班牙中部 / 欧盟主机名可以路由到其他欧盟区域的后端集群，例如北欧。

## 设置 Private Link

### 1. 提供接入信息

发送 OpenAI：

- 需要访问 OpenAI 专用链接服务的 Azure 订阅 ID。
- 你的 OpenAI 组织 ID。
- 你需要的区域。
- 用于维护和区域流量切换通知的运维联系人。

OpenAI 授予订阅对相应区域专用链接服务的可见性和审批权限，然后提供专用链接服务别名或资源标识符。

### 2. 创建私有端点

为每个选定区域创建一个专用终结点。Azure 要求专用终结点与客户虚拟网络的区域共享。设置 `--location` 为该区域，其可能与 OpenAI 专用链接服务区域不同。

以下命令使用了 OpenAI 提供的专用链接服务资源标识符：

```bash
az network private-endpoint create \
  --name openai-privatelink-southcentralus \
  --resource-group <customer-resource-group> \
  --location <customer-vnet-region> \
  --vnet-name <customer-vnet> \
  --subnet <customer-private-endpoint-subnet> \
  --private-connection-resource-id <openai-provided-pls-resource-id> \
  --connection-name openai-privatelink-southcentralus
```

如果 OpenAI 提供了别名，请使用该别名并添加 `--manual-request true`:

```bash
az network private-endpoint create \
  --name openai-privatelink-southcentralus \
  --resource-group <customer-resource-group> \
  --location <customer-vnet-region> \
  --vnet-name <customer-vnet> \
  --subnet <customer-private-endpoint-subnet> \
  --private-connection-resource-id <openai-provided-pls-alias> \
  --connection-name openai-privatelink-southcentralus \
  --manual-request true
```

Azure 要求 `--manual-request true` 用于 [别名连接](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview#connect-by-using-an-alias)；访问列表中的订阅仍可自动批准。

如果你的组织通过基础设施即代码管理专用终结点，请使用类似的 Azure 门户或 Terraform 工作流。

### 3. 在更改 DNS 之前测试连接

在 OpenAI 批准私有终结点且 Azure 完成配置后，捕获其私有 IP 地址。使用 `curl --resolve` 测试区域主机名，而无需全局更改 DNS：

```bash
curl -v \
  --resolve southcentralus.privatelink.api.openai.com:443:<PRIVATE_ENDPOINT_IP> \
  https://southcentralus.privatelink.api.openai.com/v2/privatelink_healthcheck
```

健康响应返回 HTTP `200` 并带有类似消息：

```json
{ "message": "Service is up" }
```

使用精确的健康检查路径： `/v2/privatelink_healthcheck`。保持自动化健康检查流量较低：每个区域终结点最多使用 1 QPS，除非 OpenAI 批准不同的速率。

### 4. 配置私有 DNS

创建私有 DNS 记录，使每个区域的 OpenAI Private Link 主机名在你的网络内解析为其对应的 Private Endpoint IP 地址：

| 主机名                                   | 私有端点 IP 地址            |
| ------------------------------------------- | -------------------------------------- |
| `southcentralus.privatelink.api.openai.com` | `<southcentralus-private-endpoint-ip>` |
| `westus.privatelink.api.openai.com`         | `<westus-private-endpoint-ip>`         |
| `eastus2.privatelink.api.openai.com`        | `<eastus2-private-endpoint-ip>`        |
| `spaincentral.privatelink.api.openai.com`   | `<spaincentral-private-endpoint-ip>`   |

从你的应用程序所使用的同一网络路径检查 DNS 和连接性：

```bash
nslookup southcentralus.privatelink.api.openai.com
curl -v https://southcentralus.privatelink.api.openai.com/v2/privatelink_healthcheck
```

### 5. 在区域之间进行故障转移

Private Link 提供区域前门，但你的流量仍指向所选的区域主机名。请配置你的客户端、服务网格、DNS 层或负载均衡层，以便在区域之间进行故障转移。

推荐行为：

- 对每个已配置的区域进行探测，使用 `GET /v2/privatelink_healthcheck`.
- 将 HTTP `200` 视为可用。
- 将 `5xx` 响应、连接错误、TLS 错误或重复超时视为不可用。
- 仅在连续出现少量错误后才进行故障转移，以避免抖动。
- 在后台持续探测不可用的区域，并根据你的运维策略进行故障恢复。

区域健康检查反映了私有边缘线路背后OpenAI API集群的健康状况。如果没有已知的后端集群、缺少健康配置或健康的后端集群不足，区域将返回错误。

如果你的路由决策依赖于特定的API或模型，请将此健康检查与从相同网络路径向该API和模型发送的低速率合成请求配合使用。

### 6. 更新应用程序基础 URL

使用区域的 Private Link 主机名作为 OpenAI API 的基本 URL：

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://southcentralus.privatelink.api.openai.com/v1",
)
```


SDK 会读取 `OPENAI_API_KEY` 来自你的环境变量。

你也可以直接调用区域端点：

```bash
curl https://southcentralus.privatelink.api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "input": "Say hello from Private Link."
  }'
```


先在开发或预发布环境中开始，然后逐步提升流量。

## 检查你的配置

在接入或迁移到 Private Link 时，请使用此清单：

- OpenAI 已确认你的 Azure 订阅 ID 可以访问所选的区域 Private Link 服务。
- 你创建了 Private Endpoints，并且 OpenAI 已为每个所选区域批准它们。
- 你记录了 Private Endpoint IP 地址。
- `curl --resolve` 成功针对 `/v2/privatelink_healthcheck`.
- Private DNS 将区域主机名解析为来自应用程序网络的 Private Endpoint IP 地址。
- 应用程序可以调用一个代表性的 `/v1` API 端点，通过区域主机名。
- 健康检查自动化受到速率限制，并记录区域、状态码和错误类型。
- 你通过在受控环境中强制一个区域不健康，测试了应用程序的故障转移。
- 你的运维文档明确了谁可以更改 DNS、Private Endpoint 配置以及应用程序的区域路由。

## 检查端点兼容性

以下矩阵反映了所列公开 API 路由背后服务的当前部署配置。它不能替代客户的实际验证：请在每个目标区域测试模型可用性、产品门控、下游依赖、请求大小限制、流式行为和 WebSocket 行为。 `Yes` 表示区域线路中的每个后端集群都有该路由； `No` 表示该后端的服务在该线路中不存在。

| 端点系列                         | 美国中南部 | 美国西部 | 美国东部 2 | 西班牙中部 / 欧盟 |
| --------------------------------------- | ---------------- | ------- | --------- | ------------------ |
| `/v1/responses`                         | 是              | 是     | 是       | 是                |
| `/v1/chat/completions`                  | 是              | 是     | 是       | 是                |
| `/v1/completions`                       | 是              | 是     | 是       | 是                |
| `/v1/embeddings`                        | 是              | 是     | 是       | 是                |
| `/v1/audio/*` （推理）               | 是              | 是     | 是       | 是                |
| `/v1/audio/*` （管理）              | 是              | 否      | 否        | 是                |
| `/v1/models`                            | 是              | 是     | 是       | 是                |
| `/v1/files`, `/v1/uploads`              | 是              | 是     | 是       | 是                |
| `/v1/batches`                           | 是              | 是     | 是       | 是                |
| `/v1/images/*`                          | 是              | 是     | 是       | 是                |
| `/v1/moderations`                       | 是              | 是     | 是       | 是                |
| `/v1/vector_stores`                     | 是              | 是     | 是       | 是                |
| `/v1/organization/audit_logs`           | 是              | 是     | 是       | 是                |
| 其他 `/v1/organization/*`, `/v1/usage` | 是              | 否      | 否        | 是                |
| `/v1/realtime`                          | 是              | 是     | 是       | 是                |

## 常见问题

### Private Link 是否会在区域之间自动故障转移？

不会。区域私有边缘轨道可以在其配置的后端集群之间路由流量，但它不会自动将你的流量移至不同的区域私有端点。请将你的应用程序配置为在你使用的区域端点之间进行故障转移。

### 我应该使用哪种健康检查？

使用 `GET /v2/privatelink_healthcheck` 位于区域主机名上。较旧的 v1 健康检查路径探测的是后端集群的健康状况，因此不要将它们用作面向客户的探测。

### 应用程序应使用哪个 API 主机名？

使用区域主机名和正常的 `/v1` API路径，例如 `https://southcentralus.privatelink.api.openai.com/v1`.

### AWS 或 Google Cloud 工作负载能否通过 Private Link 连接？

不可以直接使用。Private Link 连接是 Azure 特有的。AWS 或 Google Cloud 中的工作负载只能通过客户管理的网络连接到 Azure，例如 Azure 代理或跨云私有连接模式，然后从 Azure 通过 Azure Private Link 连接到 OpenAI。

### Private Link 会改变身份验证方式吗？

不会。Private Link 仅改变网络路径。请求仍需正常的 OpenAI API 认证和授权。

### 私有链接是否支持所有 OpenAI API？

不能。支持与否取决于所选择的区域轨道上的每个支撑集群是否都提供 API。以兼容性矩阵为起点，然后在每个目标区域中测试你需要的每个 API 表面和模型。