# Private Link

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

OpenAI Private Link lets Azure workloads reach regional OpenAI API endpoints through Azure Private Link instead of connecting directly to public API endpoints. Create a private endpoint for each OpenAI-provided regional Private Link Service, map its regional host name in private DNS, and send normal authenticated API requests to that host name.

Use Private Link when your organization has strict requirements to keep traffic on Azure private networking. If you don't have private-network requirements, OpenAI's public endpoints are simpler to set up and operate. Private Link isn't compatible with IP allowlist controls or mutual TLS (mTLS); contact OpenAI if you need help choosing the right enterprise network controls.

Private Link is currently not self-service. Work with your OpenAI contact or
  [contact sales](https://openai.com/contact-sales/) to request access and
  receive the regional Private Link Service aliases or resource identifiers you
  need.

## Understand how Private Link works

Some customers have been using the legacy Private Link solution (v1), which connects each Private Endpoint to a specific OpenAI API cluster. The current regional solution differs in these ways:

|                       | Legacy Private Link (v1)                                                    | Regional Private Link                                                                    |
| --------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Host name             | Cluster-specific, such as `privatelink.enterprise.unified-1.api.openai.com` | Regional, such as `southcentralus.privatelink.api.openai.com`                            |
| OpenAI routing        | Pinned to one OpenAI API cluster                                            | Regional private-edge gateway that can route to more than one backing OpenAI API cluster |
| Customer health check | Older v1 health check paths                                                 | `GET /v2/privatelink_healthcheck`                                                        |

A request follows this path:

1. Your application resolves a regional Private Link host name through your private DNS.
2. The host name resolves to an Azure Private Endpoint in your virtual network.
3. The Private Endpoint connects to the regional OpenAI Private Link Service.
4. The Private Link Service sends the request to OpenAI's regional private-edge gateway.
5. The gateway routes the request to an enterprise-enabled backing OpenAI API cluster for that regional rail.

Within a regional rail, Private Link can route around an unavailable backing cluster and OpenAI can add backing clusters without requiring you to reconfigure your Private Endpoints. It doesn't automatically move traffic from the regional host name you selected to a different regional Private Endpoint. Don't assume that Private Link inherits OpenAI's public endpoint routing behavior; configure how your application fails over between regions.

## Choose regional endpoints

OpenAI provides the exact Private Link Service alias or resource identifier during onboarding. The current production regional host names are:

| Region label       | Customer host name                          |
| ------------------ | ------------------------------------------- |
| South Central US   | `southcentralus.privatelink.api.openai.com` |
| West US            | `westus.privatelink.api.openai.com`         |
| East US 2          | `eastus2.privatelink.api.openai.com`        |
| Spain Central / EU | `spaincentral.privatelink.api.openai.com`   |

The Spain Central / EU host name can route to backing clusters in other EU regions, such as North Europe.

## Set up Private Link

### 1. Provide onboarding information

Send OpenAI:

- The Azure subscription IDs that need access to the OpenAI Private Link Services.
- Your OpenAI organization ID.
- The regions you need.
- Operational contacts for maintenance and regional traffic-switching notices.

OpenAI grants the subscriptions visibility and approval for the appropriate regional Private Link Services, then provides the Private Link Service aliases or resource identifiers.

### 2. Create private endpoints

Create one Private Endpoint for each selected region. Azure requires a Private Endpoint to share the region of the customer virtual network. Set `--location` to that region, which might differ from the OpenAI Private Link Service region.

The following command uses an OpenAI-provided Private Link Service resource identifier:

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

If OpenAI provides an alias, use the alias and add `--manual-request true`:

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

Azure requires `--manual-request true` for [alias connections](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview#connect-by-using-an-alias); subscriptions on the access list can still receive automatic approval.

Use a similar Azure portal or Terraform workflow if your organization manages Private Endpoints through infrastructure as code.

### 3. Test connectivity before changing DNS

After OpenAI approves the Private Endpoint and Azure provisions it, capture its private IP address. Use `curl --resolve` to test the regional host name without changing DNS globally:

```bash
curl -v \
  --resolve southcentralus.privatelink.api.openai.com:443:<PRIVATE_ENDPOINT_IP> \
  https://southcentralus.privatelink.api.openai.com/v2/privatelink_healthcheck
```

A healthy response returns HTTP `200` with a message like:

```json
{ "message": "Service is up" }
```

Use the exact health check path: `/v2/privatelink_healthcheck`. Keep automated health check traffic low: use at most 1 QPS per regional endpoint unless OpenAI approves a different rate.

### 4. Configure private DNS

Create private DNS records so each regional OpenAI Private Link host name resolves to its corresponding Private Endpoint IP address inside your network:

| Host name                                   | Private Endpoint IP address            |
| ------------------------------------------- | -------------------------------------- |
| `southcentralus.privatelink.api.openai.com` | `<southcentralus-private-endpoint-ip>` |
| `westus.privatelink.api.openai.com`         | `<westus-private-endpoint-ip>`         |
| `eastus2.privatelink.api.openai.com`        | `<eastus2-private-endpoint-ip>`        |
| `spaincentral.privatelink.api.openai.com`   | `<spaincentral-private-endpoint-ip>`   |

Check DNS and connectivity from the same network path your application uses:

```bash
nslookup southcentralus.privatelink.api.openai.com
curl -v https://southcentralus.privatelink.api.openai.com/v2/privatelink_healthcheck
```

### 5. Fail over between regions

Private Link provides a regional front door, but your traffic still targets the regional host name you select. Configure your client, service mesh, DNS layer, or load-balancing layer to fail over between regions.

Recommended behavior:

- Probe each configured region with `GET /v2/privatelink_healthcheck`.
- Treat HTTP `200` as available.
- Treat `5xx` responses, connection errors, TLS errors, or repeated timeouts as unavailable.
- Fail over only after a small number of consecutive errors to avoid flapping.
- Continue probing an unavailable region in the background and fail back according to your operational policy.

The regional health check reflects the health of the OpenAI API clusters behind the private-edge rail. A region with no known backing clusters, missing health configuration, or insufficient healthy backing clusters returns an error.

If your routing decision depends on a specific API or model, pair this health check with a low-rate synthetic request to that API and model from the same network path.

### 6. Update application base URLs

Use the regional Private Link host name as the OpenAI API base URL:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://southcentralus.privatelink.api.openai.com/v1",
)
```


The SDK reads `OPENAI_API_KEY` from your environment.

You can also call the regional endpoint directly:

```bash
curl https://southcentralus.privatelink.api.openai.com/v1/responses \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "input": "Say hello from Private Link."
  }'
```


Start in a development or staging environment, then promote traffic gradually.

## Check your configuration

Use this checklist while onboarding or migrating to Private Link:

- OpenAI has confirmed that your Azure subscription IDs can access the selected regional Private Link Services.
- You created Private Endpoints, and OpenAI approved them for each selected region.
- You recorded the Private Endpoint IP addresses.
- `curl --resolve` succeeds against `/v2/privatelink_healthcheck`.
- Private DNS resolves regional host names to Private Endpoint IP addresses from the application network.
- The application can call a representative `/v1` API endpoint through the regional host name.
- Health check automation is rate-limited and logs the region, status code, and error type for errors.
- You tested how the application fails over by forcing a region unhealthy in a controlled environment.
- Your operational documentation identifies who can change DNS, Private Endpoint configuration, and application regional routing.

## Check endpoint compatibility

The following matrix reflects the current deployment configuration for services behind the listed public API routes. It doesn't replace live customer validation: test model availability, product gates, downstream dependencies, request-size limits, streaming behavior, and WebSocket behavior in each target region. `Yes` means every backing cluster in the regional rail has the route; `No` means the backing service is absent from that rail.

| Endpoint family                         | South Central US | West US | East US 2 | Spain Central / EU |
| --------------------------------------- | ---------------- | ------- | --------- | ------------------ |
| `/v1/responses`                         | Yes              | Yes     | Yes       | Yes                |
| `/v1/chat/completions`                  | Yes              | Yes     | Yes       | Yes                |
| `/v1/completions`                       | Yes              | Yes     | Yes       | Yes                |
| `/v1/embeddings`                        | Yes              | Yes     | Yes       | Yes                |
| `/v1/audio/*` (Inference)               | Yes              | Yes     | Yes       | Yes                |
| `/v1/audio/*` (management)              | Yes              | No      | No        | Yes                |
| `/v1/models`                            | Yes              | Yes     | Yes       | Yes                |
| `/v1/files`, `/v1/uploads`              | Yes              | Yes     | Yes       | Yes                |
| `/v1/batches`                           | Yes              | Yes     | Yes       | Yes                |
| `/v1/images/*`                          | Yes              | Yes     | Yes       | Yes                |
| `/v1/moderations`                       | Yes              | Yes     | Yes       | Yes                |
| `/v1/vector_stores`                     | Yes              | Yes     | Yes       | Yes                |
| `/v1/organization/audit_logs`           | Yes              | Yes     | Yes       | Yes                |
| Other `/v1/organization/*`, `/v1/usage` | Yes              | No      | No        | Yes                |
| `/v1/realtime`                          | Yes              | Yes     | Yes       | Yes                |

## Frequently asked questions

### Does Private Link fail over between regions automatically?

No. The regional private-edge rail can route across its configured backing clusters, but it doesn't automatically move your traffic to a different regional Private Endpoint. Configure your application to fail over across the regional endpoints you use.

### Which health check should I use?

Use `GET /v2/privatelink_healthcheck` on the regional host name. The older v1 health check paths probe the backing-cluster health rail, so don't use them as customer-facing probes.

### Which API host name should applications use?

Use the regional host name with the normal `/v1` API path, such as `https://southcentralus.privatelink.api.openai.com/v1`.

### Can AWS or Google Cloud workloads connect through Private Link?

Not directly. Private Link connectivity is Azure-specific. Workloads in AWS or Google Cloud can connect only through customer-managed networking into Azure, such as an Azure proxy or cross-cloud private connectivity pattern, and then from Azure to OpenAI over Azure Private Link.

### Does Private Link change authentication?

No. Private Link changes only the network path. Requests still need normal OpenAI API authentication and authorization.

### Does Private Link support every OpenAI API?

No. Support depends on whether an API is available on every backing cluster for the selected regional rail. Use the compatibility matrix as a starting point, then test each API surface and model you need in every target region.