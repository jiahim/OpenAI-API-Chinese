# Private Link

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取 Markdown 版本的文档页面。

OpenAI Private Link 允许 Azure 工作负载通过 Azure Private Link 访问区域 OpenAI API 端点，而不是直接连接到公共 API 端点。为每个 OpenAI 提供的区域 Private Link 服务创建一个专用终结点，在专用 DNS 中映射其区域主机名，并向该主机名发送正常的已身份验证 API 请求。

当你的组织有严格要求需要将流量保留在 Azure 专用网络时，请使用 Private Link。如果你没有专用网络要求，OpenAI 的公共端点更易于设置和运维。Private Link 与 IP 白名单控制或双向 TLS（mTLS）不兼容；如果你需要帮助选择合适的企业网络控制措施，请联系 OpenAI。

Private Link 目前不支持自助开通。请与你的 OpenAI 联系人合作，或
  [联系销售](https://openai.com/contact-sales/) 以申请访问权限并
  获取你所在区域的 Private Link Service 别名或资源标识符
  所需信息。

## 了解 Private Link 的工作原理

部分客户一直在使用旧版 Private Link 解决方案（v1），该方案会将每个专用终结点连接到特定的 OpenAI API 集群。当前的区域方案存在以下差异：

|                       | Legacy Private Link (v1)                                                    | Regional Private Link                                                                    |
| --------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 主机名             | 集群专用，例如 `privatelink.enterprise.unified-1.api.openai.com` | 区域专用，例如 `southcentralus.privatelink.api.openai.com`                            |
| OpenAI 路由        | 固定到单个 OpenAI API 集群                                            | 区域私有边缘网关，可路由到多个后端 OpenAI API 集群 |
| 客户健康检查 | 旧版 v1 健康检查路径                                                 | `GET /v2/privatelink_healthcheck`                                                        |

一个请求会沿以下路径处理：

1. 你的应用通过你的专用 DNS 解析区域 Private Link 主机名。
2. 该主机名解析为你虚拟网络中的 Azure 专用终结点。
3. 该专用终结点连接到区域 OpenAI Private Link 服务。
4. Private Link 服务将请求发送到 OpenAI 的区域专用边缘网关。
5. 网关将该请求路由到该区域线路支持企业的 OpenAI API 后端集群。

在区域轨道交通中，Private Link 可以在某个后端集群不可用时绕开它进行路由，OpenAI 可以添加后端集群而无需你重新配置 Private Endpoint。它不会自动将你选定区域主机名的流量迁移到另一个区域 Private Endpoint。请勿假设 Private Link 会沿用 OpenAI 的公共端点路由行为；请自行配置应用程序在区域之间的故障转移方式。

## 选择区域性端点

OpenAI 在接入流程中提供确切的 Private Link Service 别名或资源标识符。当前生产环境区域主机名为：

| 区域标签       | 客户主机名                          |
| ------------------ | ------------------------------------------- |
| 美国中南部   | `southcentralus.privatelink.api.openai.com` |
| 美国西部            | `westus.privatelink.api.openai.com`         |
| 美国东部 2          | `eastus2.privatelink.api.openai.com`        |
| 西班牙中部 / 欧盟 | `spaincentral.privatelink.api.openai.com`   |

Spain Central / EU 主机名可以路由到其他 EU 区域（例如 North Europe）的后端集群。

## 设置 Private Link

### 1. 提供入驻信息

发送 OpenAI：

- 需要访问 OpenAI 专用链接服务的 Azure 订阅 ID。
- 你的 OpenAI 组织 ID。
- 你需要的区域。
- 用于维护和区域流量切换通知的运维联系人。

OpenAI 授予相应区域 Private Link 服务的订阅可见性与审批权限，然后提供 Private Link 服务别名或资源标识符。

### 2. 创建私有端点

为每个所选区域创建一个专用终结点。Azure 要求专用终结点与客户虚拟网络位于同一区域。设置为该区域，它可能与 该公司 Private Link Service 区域不同。 `--location` OpenAI Private Link Service 区域。

以下命令使用 OpenAI 提供的 Private Link Service 资源标识符：

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

Azure 要求 `--manual-request true` 用于 [别名连接](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview#connect-by-using-an-alias)；访问列表中的订阅仍然可以接收自动批准。

如果你的组织通过基础设施即代码来管理专用终结点，请使用类似的 Azure 门户或 Terraform 工作流。

### 3. 在更改 DNS 之前测试连通性

在 OpenAI 批准专用终结点并由 Azure 完成预配后，记录其专用 IP 地址。可使用 `curl --resolve` 在无需全局更改 DNS 的情况下测试区域主机名：

```bash
curl -v \
  --resolve southcentralus.privatelink.api.openai.com:443:<PRIVATE_ENDPOINT_IP> \
  https://southcentralus.privatelink.api.openai.com/v2/privatelink_healthcheck
```

正常响应会返回 HTTP `200` ，响应消息类似：

```json
{ "message": "Service is up" }
```

请使用完全一致的健康检查路径： `/v2/privatelink_healthcheck`。请保持较低的健康检查流量：除非 OpenAI 批准了其他速率，否则每个区域终结点最多使用 1 QPS。

### 4. 配置私有 DNS

创建私有 DNS 记录，使每个区域的 OpenAI Private Link 主机名能在你的网络内解析到其对应的 Private Endpoint IP 地址：

| 主机名                                   | Private Endpoint IP 地址            |
| ------------------------------------------- | -------------------------------------- |
| `southcentralus.privatelink.api.openai.com` | `<southcentralus-private-endpoint-ip>` |
| `westus.privatelink.api.openai.com`         | `<westus-private-endpoint-ip>`         |
| `eastus2.privatelink.api.openai.com`        | `<eastus2-private-endpoint-ip>`        |
| `spaincentral.privatelink.api.openai.com`   | `<spaincentral-private-endpoint-ip>`   |

使用与你的应用程序相同的网络路径检查 DNS 和连接性：

```bash
nslookup southcentralus.privatelink.api.openai.com
curl -v https://southcentralus.privatelink.api.openai.com/v2/privatelink_healthcheck
```

### 5. 在不同区域之间进行故障转移

Private Link 提供区域级前端入口，但你的流量仍然指向你所选的区域主机名。请将客户端、服务网格、DNS 层或负载均衡层配置为在区域之间进行故障转移。

推荐行为：

- 使用以下命令探测每个已配置的区域 `GET /v2/privatelink_healthcheck`.
- 将 HTTP `200` 视为可用。
- 将 `5xx` 响应、连接错误、TLS 错误或反复出现的超时视为不可用。
- 仅在少量连续错误后才进行故障转移，以避免抖动。
- 在后台持续探测不可用的区域，并根据你的运维策略进行回切。

区域健康检查反映了私有边缘轨道背后的 OpenAI API 集群的健康状况。没有任何已知后端集群、缺少健康配置或健康后端集群不足的区域将返回错误。

如果你的路由决策依赖于特定的 API 或模型，请将此健康检查与对同一网络路径下的该 API 和模型的低速率合成请求搭配使用。

### 6. 更新应用基址 URL

使用区域 Private Link 主机名作为 OpenAI API 基础 URL：

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://southcentralus.privatelink.api.openai.com/v1",
)
```


SDK 从 `OPENAI_API_KEY` 你的环境中读取。

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


先在开发或预发布环境中启动，然后逐步提升流量。

## 检查你的配置

在接入或迁移到 Private Link 时使用以下清单：

- OpenAI 已确认你的 Azure 订阅 ID 可以访问所选的各区域 Private Link 服务。
- 你已创建专用终结点，且 OpenAI 已为每个所选区域批准了这些终结点。
- 你已记录这些专用终结点的 IP 地址。
- `curl --resolve` 针对成功完成 `/v2/privatelink_healthcheck`.
- 专用 DNS 在应用网络中将各区域的主机名解析为专用终结点的 IP 地址。
- 应用可通过区域主机名调用一个具有代表性的 API 终结点。 `/v1` 通过区域主机名调用。
- 健康检查自动化受到速率限制，并会在出错时记录区域、状态码和错误类型。
- 你已在受控环境中通过强制将某个区域标记为不健康来测试应用的故障转移方式。
- 你的运维文档已明确说明谁可以更改 DNS、专用终结点配置以及应用的区域路由。

## 检查端点兼容性

下表反映了所列公共 API 路由背后服务的当前部署配置。它不能替代实际的客户验证：请在每个目标区域测试模型可用性、产品门禁、下游依赖、请求大小限制、流式行为和 WebSocket 行为。 `Yes` 表示该区域轨道中的每个后备集群均已部署该路由； `No` 表示该轨道中不存在该后备服务。

| 端点族                         | 美国中南部 | 美国西部 | 美国东部 2 | 西班牙中部 / 欧盟 |
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

不会。区域私有边缘轨道可以在其配置的后备集群之间路由流量，但不会自动将你的流量迁移到另一个区域的私有终结点。请配置你的应用程序，以便在你使用的各区域终结点之间进行故障转移。

### 我应该使用哪种健康检查？

使用 `GET /v2/privatelink_healthcheck` 区域主机名。旧的 v1 健康检查路径探测的是后端集群的健康轨道，因此不要将它们用作面向客户的探测。

### 应用应使用哪个 API 主机名？

使用区域主机名以及常规 `/v1` API 路径，例如 `https://southcentralus.privatelink.api.openai.com/v1`.

### AWS 或 Google Cloud 的工作负载能否通过 Private Link 连接？

不能直接连接。Private Link 连接是 Azure 特有的。AWS 或 Google Cloud 中的工作负载只能通过客户自管理的网络接入 Azure，例如 Azure 代理或跨云私有连接模式，然后从 Azure 通过 Azure Private Link 连接到 OpenAI。

### Private Link 是否会影响身份验证？

不会。Private Link 仅改变网络路径。请求仍需正常的 OpenAI API 身份验证与授权。

### Private Link 是否支持所有 OpenAI API？

否。是否支持取决于所选区域轨道的每个后端集群是否都提供该 API。可先以兼容性矩阵为起点，然后在每个目标区域中测试你所需的每个 API 表面和模型。