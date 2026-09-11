# Private Link

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取文档页面的 Markdown 版本。

OpenAI Private Link 可让 Azure 工作负载通过 Azure Private Link 访问区域级 OpenAI API 端点,而无需直接连接公共 API 端点。为每个 OpenAI 提供的区域级 Private Link 服务创建专用终结点,在私有 DNS 中映射其区域主机名,然后将普通的已认证 API 请求发送至该主机名。

当你的组织严格要求流量仅在 Azure 专用网络上传输时,请使用 Private Link。如果你没有专用网络要求,OpenAI 的公共端点更易于设置和运维。Private Link 与 IP 允许列表控制或双向 TLS（mTLS）不兼容;如果你需要帮助选择合适的企业网络控制方案,请联系 OpenAI。

Private Link 目前不支持自助开通。请联系你的 OpenAI 对接人
  [联系销售](https://openai.com/contact-sales/) 申请访问权限,并
  获取你所需的区域级 Private Link 服务别名或资源标识符
  。

## 了解 Private Link 的工作原理

部分客户此前使用的是旧版 Private Link 方案 (v1)，该方案将每个私有端点连接到特定的 OpenAI API 集群。当前的区域方案在以下方面有所不同：

|                       | 旧版 Private Link (v1)                                                    | 区域 Private Link                                                                    |
| --------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 主机名             | 集群专属，例如 `privatelink.enterprise.unified-1.api.openai.com` | 区域，例如 `southcentralus.privatelink.api.openai.com`                            |
| OpenAI 路由        | 固定到单个 OpenAI API 集群                                            | 可路由到多个后端 OpenAI API 集群的区域私有边缘网关 |
| 客户健康检查 | 旧版 v1 健康检查路径                                                 | `GET /v2/privatelink_healthcheck`                                                        |

请求遵循以下路径：

1. 你的应用通过你的专用 DNS 解析区域专用链接主机名。
2. 该主机名解析为你虚拟网络中的 Azure 专用终结点。
3. 该专用终结点连接到 OpenAI 专用链接服务。
4. 专用链接服务将请求发送到 OpenAI 的区域专用边缘网关。
5. 网关将该请求路由到该区域轨道的已启用企业的 OpenAI API 后端集群。

在区域铁路内，Private Link 可以绕过不可用的后端集群进行路由，OpenAI 可以在不需要你重新配置 Private Endpoint 的情况下添加后端集群。它不会自动将流量从你选定的区域主机名迁移到不同的区域 Private Endpoint。不要假设 Private Link 继承了 OpenAI 的公共端点路由行为；请配置你的应用程序在区域之间故障转移的方式。

## 选择区域端点

OpenAI 会在接入期间提供确切的 Private Link Service 别名或资源标识符。当前的生产环境区域主机名为：

| 区域标签       | 客户主机名                          |
| ------------------ | ------------------------------------------- |
| South Central US   | `southcentralus.privatelink.api.openai.com` |
| West US            | `westus.privatelink.api.openai.com`         |
| East US 2          | `eastus2.privatelink.api.openai.com`        |
| Spain Central / EU | `spaincentral.privatelink.api.openai.com`   |

Spain Central / EU 主机名可以路由到其他 EU 区域的后端集群，例如 North Europe。

## 设置 Private Link

### 1. 提供接入信息

向 OpenAI 发送：

- 需要访问 OpenAI 专用链接服务的 Azure 订阅 ID。
- 你的 OpenAI 组织 ID。
- 你需要的区域。
- 用于维护和区域流量切换通知的运维联系人。

OpenAI 会授予订阅方对相应区域 Private Link 服务的可见性和审批权限，然后提供 Private Link 服务的别名或资源标识符。

### 2. 创建私有端点

为每个所选区域创建一个专用终结点。Azure 要求专用终结点与客户虚拟网络位于同一区域。将 `--location` 设置为该区域，它可能与 OpenAI Private Link Service 区域不同。

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

Azure 要求 `--manual-request true` 用于 [别名连接](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview#connect-by-using-an-alias)；访问列表中的订阅仍然可以获得自动批准。

如果你的组织通过基础设施即代码管理专用终结点，请使用类似的 Azure 门户或 Terraform 工作流。

### 3. 在更改 DNS 之前测试连通性

在 OpenAI 批准专用终结点并由 Azure 完成预配后，捕获其专用 IP 地址。使用 `curl --resolve` 可在不全局更改 DNS 的情况下测试区域主机名：

```bash
curl -v \
  --resolve southcentralus.privatelink.api.openai.com:443:<PRIVATE_ENDPOINT_IP> \
  https://southcentralus.privatelink.api.openai.com/v2/privatelink_healthcheck
```

健康的响应会返回 HTTP `200` 以及如下消息：

```json
{ "message": "Service is up" }
```

使用完全一致的健康检查路径： `/v2/privatelink_healthcheck`。请保持自动化健康检查流量处于较低水平：每个区域终结点最多使用 1 QPS，除非 OpenAI 批准使用其他速率。

### 4. 配置私有 DNS

创建私有 DNS 记录，使每个区域性的 OpenAI Private Link 主机名在你的网络内解析到其对应的 Private Endpoint IP 地址：

| 主机名                                   | Private Endpoint IP address            |
| ------------------------------------------- | -------------------------------------- |
| `southcentralus.privatelink.api.openai.com` | `<southcentralus-private-endpoint-ip>` |
| `westus.privatelink.api.openai.com`         | `<westus-private-endpoint-ip>`         |
| `eastus2.privatelink.api.openai.com`        | `<eastus2-private-endpoint-ip>`        |
| `spaincentral.privatelink.api.openai.com`   | `<spaincentral-private-endpoint-ip>`   |

使用与应用相同的网络路径检查 DNS 和连通性：

```bash
nslookup southcentralus.privatelink.api.openai.com
curl -v https://southcentralus.privatelink.api.openai.com/v2/privatelink_healthcheck
```

### 5. 在区域之间进行故障转移

Private Link 提供了一个区域前置入口，但你的流量仍会指向你所选的区域主机名。请配置你的客户端、服务网格、DNS 层或负载均衡层，以便在区域之间进行故障转移。

推荐行为：

- 使用以下方式探测每个已配置的区域 `GET /v2/privatelink_healthcheck`.
- 将 HTTP `200` 视为可用。
- 将 `5xx` 响应、连接错误、TLS 错误或反复超时视为不可用。
- 仅在出现少量连续错误后才进行故障转移，以避免抖动。
- 在后台继续探测不可用的区域，并根据你的运维策略进行回切。

区域健康检查反映了私有边缘轨道后端 OpenAI API 集群的健康状况。如果某个区域没有已知的后端集群、缺少健康配置，或健康的后端集群不足，则会返回错误。

如果你的路由决策依赖于特定的 API 或模型，请将此健康检查与从同一网络路径对该 API 和模型发起的低速率合成请求搭配使用。

### 6. 更新应用程序基础 URL

使用区域性的 Private Link 主机名作为 OpenAI API 的基础 URL：

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://southcentralus.privatelink.api.openai.com/v1",
)
```

```ruby
client = OpenAI::Client.new(
  base_url: "https://southcentralus.privatelink.api.openai.com/v1"
)
```


SDK 会从环境变量中读取 `OPENAI_API_KEY` 环境变量。

你也可以直接调用区域性端点：

```bash
curl https://southcentralus.privatelink.api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-6-astra",
    "input": "Say hello from Private Link."
  }'
```


先在开发或预发布环境中启动，然后逐步推广流量。

## 检查你的配置

在接入或迁移到 Private Link 时可参考以下清单：

- OpenAI 已确认你的 Azure 订阅 ID 可以访问所选的区域 Private Link Services。
- 你已创建专用终结点，且 OpenAI 已在每个所选区域批准它们。
- 你已记录专用终结点的 IP 地址。
- `curl --resolve` 针对以下目标成功： `/v2/privatelink_healthcheck`.
- 专用 DNS 将区域主机名解析为来自应用网络的专用终结点 IP 地址。
- 应用可以通过区域主机名调用一个具有代表性的 `/v1` API 终结点。
- 健康检查自动化受到速率限制，并针对错误记录区域、状态码和错误类型。
- 你已通过在受控环境中强制将某个区域置于不健康状态，测试了应用的故障转移方式。
- 你的运维文档明确了哪些人可以更改 DNS、专用终结点配置以及应用的区域路由。

## 检查端点兼容性

下表反映了所列公共 API 路由背后服务当前的部署配置。它不能替代实际的客户验证：请在每个目标区域测试模型可用性、产品闸门、下游依赖、请求大小限制、流式行为以及 WebSocket 行为。 `Yes` 表示该区域内每个后端集群都已具备该路由； `No` 表示该区域内缺失对应的后端服务。

| 端点系列                         | South Central US | West US | East US 2 | Spain Central / EU |
| --------------------------------------- | ---------------- | ------- | --------- | ------------------ |
| `/v1/responses`                         | 是              | 是     | 是       | 是                |
| `/v1/chat/completions`                  | 是              | 是     | 是       | 是                |
| `/v1/completions`                       | 是              | 是     | 是       | 是                |
| `/v1/embeddings`                        | 是              | 是     | 是       | 是                |
| `/v1/audio/*` (推理)               | 是              | 是     | 是       | 是                |
| `/v1/audio/*` (管理)              | 是              | 否      | 否        | 是                |
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

### Private Link 会在不同区域之间自动故障转移吗？

不会。区域私有边缘轨道可以在其配置的后备集群之间路由流量，但不会自动将你的流量迁移到其他区域的私有终结点。请将你的应用程序配置为在你使用的各区域终结点之间进行故障转移。

### 应该使用哪种健康检查？

使用 `GET /v2/privatelink_healthcheck` 区域主机名。较旧的 v1 健康检查路径探测的是后端集群的健康状况通道，请勿将其用作面向客户的探测。

### 应用程序应使用哪个 API 主机名？

使用区域主机名并搭配正常的 `/v1` API 路径，例如 `https://southcentralus.privatelink.api.openai.com/v1`.

### AWS 或 Google Cloud 工作负载能否通过 Private Link 连接？

不支持。Private Link 连接是 Azure 特有的。AWS 或 Google Cloud 中的工作负载只能通过客户自管的网络接入 Azure（例如 Azure 代理或跨云私有连接模式），然后再通过 Azure Private Link 从 Azure 连接到 OpenAI。

### Private Link 是否会更改身份验证？

否。Private Link 仅改变网络路径。请求仍需正常的 OpenAI API 身份验证和授权。

### Private Link 是否支持所有 OpenAI API？

不支持。支持取决于所选区域线路的每个后端集群是否都提供 API。请以兼容性矩阵为起点，然后在每个目标区域中测试你需要的每个 API 接口和模型。