# 为 Microsoft Azure 配置工作负载身份联合

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 来获取。

在以下任一场景中，将 Microsoft Azure 用作 Workload Identity 身份提供方：

- **Azure 托管标识：** 将为托管标识颁发的 Microsoft Entra ID 访问令牌交换为短时 OpenAI 访问令牌。
- **AKS：** 将投射的 Azure Kubernetes Service (AKS) 服务账户令牌交换为短时 OpenAI 访问令牌。

对于 Codex，使用此页面获取并检查 Microsoft Entra 令牌。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 将该令牌写入文件并指向 Codex。本页面上的服务帐户映射和 SDK 示例适用于 OpenAI API。



## Azure 托管标识

Azure 托管标识使 Azure 上托管的工作负载无需存储长期密钥即可请求 Microsoft Entra 令牌。在 OpenAI 工作负载标识联合中，托管标识令牌是 OpenAI 在签发 OpenAI 访问令牌之前验证的主体令牌。

### 设置 Azure 托管标识

创建或使用一个 Microsoft Entra 应用程序注册，用于表示 OpenAI 应信任的令牌受众，并配置其 **Application ID URI**；此 URI 是你的工作负载从 Azure 实例元数据服务 (IMDS) 请求的 `resource` 值，并作为所颁发令牌中的 `aud` 声明出现。有关 Microsoft 配置步骤，请参阅 Microsoft Entra 关于 [创建新的 Entra ID 应用程序和服务主体](https://learn.microsoft.com/en-au/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-azure-ad-and-create-a-service-principal).

在 Microsoft Entra ID 中配置的 Application ID URI、IMDS `resource`
  参数、生成的令牌的 `aud` 声明，以及 OpenAI 工作负载身份
  提供程序受众必须全部匹配。

[创建](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal?pivots=identity-mi-methods-azp) 一个托管标识，然后 [将该](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#user-assigned-managed-identity) 托管标识分配给运行你的应用程序的 Azure 资源，例如虚拟机。该资源必须能够在运行时调用 IMDS。有关 Azure 配置详细信息，请参阅 Microsoft 的 [托管标识概述](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) 以及有关分配标识的相关 Azure 资源文档。

### 获取 Azure 托管标识令牌

从已分配托管标识的 Azure 资源，使用 Application ID URI 作为参数向 IMDS 请求令牌。 `resource` 该令牌是 OpenAI 用来换取 OpenAI 颁发的访问令牌的 subject token。

```bash
APPLICATION_ID_URI="api://<application-client-id>"

TOKEN=$(curl -sS -G -H "Metadata: true" \
  "http://169.254.169.254/metadata/identity/oauth2/token" \
  --data-urlencode "api-version=2018-02-01" \
  --data-urlencode "resource=${APPLICATION_ID_URI}" \
  | jq -r .access_token)
export TOKEN
```

如果资源有多个用户分配的托管标识，请添加 `client_id`, `object_id`，或 `msi_res_id` 查询参数来指定要使用的托管标识。Microsoft 在以下文档中说明了 IMDS 令牌请求参数： [使用虚拟机上的托管标识获取访问令牌](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-to-use-vm-token).

### 验证令牌

在配置工作负载身份联合之前，将 Microsoft Entra 令牌导出为 `TOKEN`，然后在本地运行以下脚本以检查其声明：

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


该命令会解码 JWT 负载，但不验证令牌签名。对于生产令牌，请使用本地解码器，避免将生产令牌粘贴到第三方工具中。

解码后的 Microsoft Entra ID 托管标识令牌的格式类似如下：

```json
{
  "iss": "https://login.microsoftonline.com/11111111-2222-3333-4444-555555555555/v2.0",
  "aud": "api://00000000-1111-2222-3333-444444444444",
  "tid": "11111111-2222-3333-4444-555555555555",
  "appid": "22222222-3333-4444-5555-666666666666",
  "oid": "33333333-4444-5555-6666-777777777777",
  "sub": "33333333-4444-5555-6666-777777777777",
  "xms_mirid": "/subscriptions/<subscription-id>/resourcegroups/my-resource-group/providers/Microsoft.Compute/virtualMachines/openai-wif-vm",
  "iat": 1716235422,
  "exp": 1716239022
}
```

请在 OpenAI 中核实你计划配置的声明：

- `iss`: 使用令牌中的精确 issuer 值。该 issuer 可能为 `https://login.microsoftonline.com/<tenant-id>/v2.0`，但不要假定该后缀。
- `aud`: 必须与 Application ID URI、IMDS `resource` 参数以及 OpenAI Workload Identity Provider 受众（audience）匹配。
- `tid`: Microsoft Entra 租户 ID。
- `appid`: 托管标识的应用程序/客户端 ID（如果存在）。
- `iat` 和 `exp`: 检查令牌的完整生命周期， `exp - iat`（以秒为单位）。

对于 Codex，将提供方的 `max_assertion_lifetime_seconds` 设置为已批准的
限制，使其覆盖颁发方预期的令牌生命周期范围。不要使用
令牌的剩余有效期，也不要假设每个 Entra 令牌都持续一小时。
Microsoft 文档 [可变访问令牌
生存期](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens#token-lifetime)
并且不支持 [配置托管标识令牌
生存期](https://learn.microsoft.com/en-us/entra/identity-platform/configurable-token-lifetimes).
请参阅 [Admin API 提供商
示例](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api#create-an-oidc-provider).

托管标识令牌还可能包含诸如 `azp`, `oid`, `sub`，或 `xms_mirid`。之类的声明。请将解码后的令牌作为真实来源，并选择那些能够精确标识你信任的托管标识和资源边界的声明。

请使用解码后的载荷，将你收到的令牌与 OpenAI 中配置的颁发者、受众和映射值进行比较。大多数配置问题都会在交换令牌前的 `iss`, `aud`, `tid`，以及托管标识声明中显现出来。

### 设置工作负载身份联合

在 OpenAI 中为 Microsoft Entra ID 颁发者创建一个工作负载身份提供方，然后添加一个服务账户映射，使其匹配托管身份令牌中的稳定声明。

请先配置工作负载身份提供方，再创建服务账户映射。

#### 设置 Workload Identity Provider

1. **创建工作负载身份提供程序。** 设置 **名称** 为唯一值，例如 `azure-managed-identity-prod`。使用 **描述**,例如 `Production Azure managed identity workloads`，以帮助管理员识别该提供程序。

2. **设置颁发者和受众。** 设置 **OIDC 颁发者 URL** 为令牌中 `iss` 声明的精确值。首先获取一个托管身份令牌样本并检查其声明。例如，颁发者可能是 `https://login.microsoftonline.com/<tenant-id>/v2.0`。设置 **受众** 为你配置的 Microsoft Entra 应用程序 ID URI,例如 `api://<application-client-id>`。该值必须与令牌的 `aud` 声明匹配。

3. **使用 Microsoft Entra 令牌验证。** 将 **使用上传的 JWKS 进行令牌验证** 已禁用。OpenAI 使用 Microsoft Entra 发行者元数据和 JWKS 验证托管标识令牌。

4. **如果需要派生映射属性，请添加属性转换。** 例如，输入 `managed_identity_client_id` 以及表达式 `assertion.appid` 以创建 `openai.managed_identity_client_id` ，取值自托管标识应用程序/客户端 ID 声明。控制面板会自动应用 `openai.` 此前缀。已以 `openai.` 开头的原始令牌声明不会用于 `openai.` 映射键，除非配置了匹配的转换。

#### 设置服务账号映射

1. **创建服务帐户映射。** 设置 **名称** 设置为一个在该 Workload Identity Provider 中唯一的值，例如 `vm-openai-wif`。使用 **描述**,例如 `Production VM Azure managed identity workload`，以说明哪个工作负载可以使用该映射。

2. **匹配稳定的托管标识声明。** 为每个必须匹配的声明添加一个 **键** 和 **值** 行。如果令牌包含 `appid`，则设置 **键** 为 `appid` 和 **值** 为托管标识客户端 ID。该 `appid` 声明用于标识托管标识的应用程序/客户端 ID，通常是将映射绑定到特定托管标识时最稳定的声明。如果你的令牌不包含 `appid`，则使用解码令牌中的其他稳定声明，例如 `azp`, `oid`, `sub`，或 `xms_mirid`。要将映射绑定到一个租户，还需设置 **键** 为 `tid` 和 **值** 为 Microsoft Entra 租户 ID。对来自 IMDS 的示例令牌进行解码，并使用对于你所信任的托管标识和资源而言稳定的声明。

3. **选择 OpenAI 目标。** 设置 **项目** 为拥有目标服务帐户的 OpenAI 项目。设置 **服务帐户** 授予 Azure 工作负载可以使用的 OpenAI 服务帐户的相应权限，例如 `azure-managed-identity-prod-openai-wif`.

4. **根据需要收窄 API 权限。** 选择适当的 **权限** ，例如 `api.model.request` 和 `api.vector_store.read` 以进一步收窄从此映射生成的访问令牌的权限范围。如果将权限留空，则不会添加特定于 WIF 的范围限制；该令牌仍会以映射的服务帐户身份进行授权。

### 在代码中使用令牌

配置你的 OpenAI SDK 客户端，以从 IMDS 请求 Azure 托管身份令牌，并将该令牌交换为由 OpenAI 签发的访问令牌。

将 `OPENAI_WIF_AUDIENCE` 设置为配置为工作负载身份提供程序受众的 Microsoft Entra 应用程序 ID URI。SDK 会为该受众请求托管身份令牌，将其交换为由 OpenAI 签发的访问令牌，并使用 OpenAI 令牌对 API 请求进行身份验证。

使用 Azure 托管身份令牌进行身份验证

```javascript
import OpenAI from "openai";

const imdsEndpoint = "http://169.254.169.254/metadata/identity/oauth2/token";

const identityProviderId = process.env.OPENAI_IDENTITY_PROVIDER_ID;
const serviceAccountId = process.env.OPENAI_SERVICE_ACCOUNT_ID;
const audience = process.env.OPENAI_WIF_AUDIENCE;

if (!identityProviderId || !serviceAccountId || !audience) {
  throw new Error(
    "Set OPENAI_IDENTITY_PROVIDER_ID, OPENAI_SERVICE_ACCOUNT_ID, and OPENAI_WIF_AUDIENCE"
  );
}

/** @returns {import("openai/auth/index").SubjectTokenProvider} */
function azureManagedIdentityTokenProvider(resource) {
  return {
    tokenType: "jwt",
    getToken: async () => {
      const url = new URL(imdsEndpoint);
      url.searchParams.set("api-version", "2018-02-01");
      url.searchParams.set("resource", resource);

      const clientId = process.env.AZURE_CLIENT_ID;
      if (clientId) {
        url.searchParams.set("client_id", clientId);
      }

      const response = await fetch(url, {
        headers: { Metadata: "true" },
      });

      if (!response.ok) {
        throw new Error(
          `Azure IMDS token request failed with status ${response.status}.`
        );
      }

      const body = await response.json();
      if (!body.access_token) {
        throw new Error("Azure IMDS did not return an access token.");
      }

      return body.access_token;
    },
  };
}

const client = new OpenAI({
  workloadIdentity: {
    identityProviderId,
    serviceAccountId,
    provider: azureManagedIdentityTokenProvider(audience),
  },
});

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "Say hello from Azure managed identity workload identity federation.",
});

console.log(response.output_text);
```

```python
import json
import os
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from openai import OpenAI
from openai.auth import SubjectTokenProvider

IMDS_ENDPOINT = "http://169.254.169.254/metadata/identity/oauth2/token"


def azure_managed_identity_token_provider(resource: str) -> SubjectTokenProvider:
    def get_token() -> str:
        params = {
            "api-version": "2018-02-01",
            "resource": resource,
        }

        client_id = os.environ.get("AZURE_CLIENT_ID")
        if client_id:
            params["client_id"] = client_id

        request = Request(
            f"{IMDS_ENDPOINT}?{urlencode(params)}",
            headers={"Metadata": "true"},
        )

        with urlopen(request, timeout=10) as response:
            body = json.loads(response.read().decode("utf-8"))

        token = body.get("access_token", "")
        if not token:
            raise RuntimeError("Azure IMDS did not return an access token.")
        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": azure_managed_identity_token_provider(
            os.environ["OPENAI_WIF_AUDIENCE"]
        ),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from Azure managed identity workload identity federation.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/auth"
	"github.com/openai/openai-go/v3/option"
	"github.com/openai/openai-go/v3/responses"
)

const azureIMDSEndpoint = "http://169.254.169.254/metadata/identity/oauth2/token"

type azureManagedIdentityTokenProvider struct {
	resource string
}

func (p azureManagedIdentityTokenProvider) TokenType() auth.SubjectTokenType {
	return auth.SubjectTokenTypeJWT
}

func (p azureManagedIdentityTokenProvider) GetToken(ctx context.Context, httpClient auth.HTTPDoer) (string, error) {
	values := url.Values{}
	values.Set("api-version", "2018-02-01")
	values.Set("resource", p.resource)
	if clientID := os.Getenv("AZURE_CLIENT_ID"); clientID != "" {
		values.Set("client_id", clientID)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, azureIMDSEndpoint+"?"+values.Encode(), nil)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "azure-managed-identity",
			Message:  "failed to build Azure IMDS token request",
			Cause:    err,
		}
	}
	req.Header.Set("Metadata", "true")

	resp, err := httpClient.Do(req)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "azure-managed-identity",
			Message:  "failed to request Azure managed identity token",
			Cause:    err,
		}
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", &auth.SubjectTokenProviderError{
			Provider: "azure-managed-identity",
			Message:  fmt.Sprintf("Azure IMDS token request failed with status %d", resp.StatusCode),
		}
	}

	var body struct {
		AccessToken string `json:"access_token"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "azure-managed-identity",
			Message:  "failed to decode Azure IMDS token response",
			Cause:    err,
		}
	}
	if body.AccessToken == "" {
		return "", &auth.SubjectTokenProviderError{
			Provider: "azure-managed-identity",
			Message:  "Azure IMDS did not return an access token",
		}
	}

	return body.AccessToken, nil
}

func main() {
	audience := os.Getenv("OPENAI_WIF_AUDIENCE")
	if audience == "" {
		log.Fatal("Set OPENAI_WIF_AUDIENCE")
	}

	client := openai.NewClient(
		option.WithWorkloadIdentity(auth.WorkloadIdentity{
			IdentityProviderID: os.Getenv("OPENAI_IDENTITY_PROVIDER_ID"),
			ServiceAccountID:   os.Getenv("OPENAI_SERVICE_ACCOUNT_ID"),
			Provider: azureManagedIdentityTokenProvider{
				resource: audience,
			},
		}),
	)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: openai.ChatModelGPT4_1Mini,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Say hello from Azure managed identity workload identity federation."),
		},
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(response.OutputText())
}
```

```java
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.auth.SubjectTokenProvider;
import com.openai.auth.SubjectTokenType;
import com.openai.auth.WorkloadIdentity;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.HttpClient;
import com.openai.errors.SubjectTokenProviderException;
import com.openai.models.responses.ResponseCreateParams;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;

public final class AzureManagedIdentityWorkloadIdentityExample {
  private static final String IMDS_ENDPOINT =
      "http://169.254.169.254/metadata/identity/oauth2/token";

  private AzureManagedIdentityWorkloadIdentityExample() {}

  static final class AzureManagedIdentityTokenProvider implements SubjectTokenProvider {
    private final String resource;

    AzureManagedIdentityTokenProvider(String resource) {
      this.resource = resource;
    }

    @Override
    public SubjectTokenType tokenType() {
      return SubjectTokenType.JWT;
    }

    @Override
    public String getToken(HttpClient httpClient, JsonMapper jsonMapper) {
      try {
        String query =
            "api-version=2018-02-01&resource="
                + URLEncoder.encode(resource, StandardCharsets.UTF_8);
        String clientId = System.getenv("AZURE_CLIENT_ID");
        if (clientId != null && !clientId.isEmpty()) {
          query += "&client_id=" + URLEncoder.encode(clientId, StandardCharsets.UTF_8);
        }

        HttpRequest request =
            HttpRequest.newBuilder()
                .uri(URI.create(IMDS_ENDPOINT + "?" + query))
                .header("Metadata", "true")
                .GET()
                .build();

        HttpResponse<String> response =
            java.net.http.HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
          throw new SubjectTokenProviderException(
              "azure-managed-identity",
              "Azure IMDS token request failed with status " + response.statusCode(),
              null);
        }

        JsonNode body = jsonMapper.readTree(response.body());
        String token = body.path("access_token").asText();
        if (token.isEmpty()) {
          throw new SubjectTokenProviderException(
              "azure-managed-identity", "Azure IMDS did not return an access token", null);
        }

        return token;
      } catch (SubjectTokenProviderException e) {
        throw e;
      } catch (Exception e) {
        throw new SubjectTokenProviderException(
            "azure-managed-identity", "failed to request Azure managed identity token", e);
      }
    }

    @Override
    public CompletableFuture<String> getTokenAsync(HttpClient httpClient, JsonMapper jsonMapper) {
      return CompletableFuture.supplyAsync(() -> getToken(httpClient, jsonMapper));
    }
  }

  public static void main(String[] args) {
    WorkloadIdentity workloadIdentity =
        WorkloadIdentity.builder()
            .identityProviderId(System.getenv("OPENAI_IDENTITY_PROVIDER_ID"))
            .serviceAccountId(System.getenv("OPENAI_SERVICE_ACCOUNT_ID"))
            .provider(new AzureManagedIdentityTokenProvider(System.getenv("OPENAI_WIF_AUDIENCE")))
            .build();

    OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("gpt-5.6-terra")
            .input("Say hello from Azure managed identity workload identity federation.")
            .build();

    client.responses().create(params).output().stream()
        .flatMap(item -> item.message().stream())
        .flatMap(message -> message.content().stream())
        .flatMap(content -> content.outputText().stream())
        .forEach(outputText -> System.out.println(outputText.text()));
  }
}
```

```ruby
require "json"
require "net/http"
require "openai"
require "uri"

class AzureManagedIdentityTokenProvider
  include OpenAI::Auth::SubjectTokenProvider

  IMDS_ENDPOINT = "http://169.254.169.254/metadata/identity/oauth2/token"

  def initialize(resource:)
    @resource = resource
  end

  def token_type
    OpenAI::Auth::TokenType::JWT
  end

  def get_token
    uri = URI(IMDS_ENDPOINT)
    params = {
      "api-version" => "2018-02-01",
      "resource" => @resource
    }
    params["client_id"] = ENV["AZURE_CLIENT_ID"] if ENV["AZURE_CLIENT_ID"]
    uri.query = URI.encode_www_form(params)

    request = Net::HTTP::Get.new(uri)
    request["Metadata"] = "true"

    response = Net::HTTP.start(uri.hostname, uri.port, read_timeout: 10) do |http|
      http.request(request)
    end

    unless response.is_a?(Net::HTTPSuccess)
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "Azure IMDS token request failed with status #{response.code}",
        provider: "azure-managed-identity"
      )
    end

    token = JSON.parse(response.body).fetch("access_token", "")
    if token.empty?
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "Azure IMDS did not return an access token",
        provider: "azure-managed-identity"
      )
    end
    token
  rescue JSON::ParserError, SystemCallError => e
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to request Azure managed identity token: #{e.message}",
      provider: "azure-managed-identity",
      cause: e
    )
  end
end

provider = AzureManagedIdentityTokenProvider.new(
  resource: ENV.fetch("OPENAI_WIF_AUDIENCE")
)

workload_identity = OpenAI::Auth::WorkloadIdentity.new(
  identity_provider_id: ENV.fetch("OPENAI_IDENTITY_PROVIDER_ID"),
  service_account_id: ENV.fetch("OPENAI_SERVICE_ACCOUNT_ID"),
  provider: provider
)

client = OpenAI::Client.new(workload_identity: workload_identity)

response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Say hello from Azure managed identity workload identity federation."
)

puts(response.output_text)
```


  


  


## Azure Kubernetes Service (AKS)

使用 AKS 作为工作负载身份提供方，通过将 AKS 颁发的投影服务账户令牌交换为短时效的 OpenAI 访问令牌。

AKS 工作负载也可以使用 Azure 工作负载身份来获取附加到该工作负载的托管身份的 Microsoft Entra
  ID 访问令牌。在这种
  配置下，OpenAI 会校验 Microsoft Entra 令牌，而不是
  投影的 Kubernetes 服务账户令牌。按照以下步骤配置 OpenAI 工作负载身份
  联合： [Azure 托管
  身份](#azure-managed-identity)，并根据 Microsoft 的文档配置 Azure 工作负载身份。
  according to Microsoft's documentation.

### 设置 AKS

检索与 AKS 集群关联的 OIDC 颁发者 URL：

```bash
az aks show \
  --name <cluster-name> \
  --resource-group <resource-group> \
  --query "oidcIssuerProfile.issuerUrl" \
  --output tsv
```

如果颁发者 URL 为空，请为该集群启用 AKS OIDC 颁发者。使用以下命令：

```bash
az aks update \
    --resource-group <resource-group> \
    --name <cluster-name> \
    --enable-oidc-issuer
```

你在 OpenAI Workload Identity Provider 中配置的颁发者必须与此颁发者 URL 和 `iss` 投射的 AKS 服务账号令牌中的 claim 相匹配。

使用 Kubernetes `ServiceAccount` 为需要调用 OpenAI API 的 AKS 工作负载创建相应的资源。如果你还没有，请创建一个：

```bash
kubectl create serviceaccount openai-wif --namespace default
```

将投射的服务账号令牌配置为使用 OpenAI 所需的 audience 以及适合你工作负载的过期时间。OpenAI 会校验令牌的颁发者、签名、audience 和过期时间。在本示例中，令牌文件挂载于 `/var/run/secrets/tokens/token`，使用的 audience 为 `https://api.openai.com/v1`，并在 3600 秒后过期。如果投射令牌的 audience 与 OpenAI Workload Identity Provider 的 audience 匹配，你也可以使用其他 audience。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: openai-wif-app
  namespace: default
spec:
  serviceAccountName: openai-wif
  containers:
    - name: app
      image: my-image
      volumeMounts:
        - name: aks-sa-token
          mountPath: /var/run/secrets/tokens
          readOnly: true
  volumes:
    - name: aks-sa-token
      projected:
        sources:
          - serviceAccountToken:
              path: token
              audience: "https://api.openai.com/v1"
              expirationSeconds: 3600
```

### 验证令牌

在配置工作负载身份联邦之前，请在本地解码一个示例投射服务账号令牌并检查其 claim。在运行中的 Pod 中（已挂载投射令牌），获取该令牌并将其导出为 `TOKEN`:

```bash
TOKEN=$(kubectl exec -n default openai-wif-app -- cat /var/run/secrets/tokens/token)
export TOKEN
```

然后运行此脚本：

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


该命令会解码 JWT 负载，但不验证令牌签名。对于生产令牌，请使用本地解码器，避免将生产令牌粘贴到第三方工具中。

一个解码后的 AKS 投射服务账号令牌将类似于：

```json
{
  "iss": "https://eastus.oic.prod-aks.azure.com/11111111-2222-3333-4444-555555555555/22222222-3333-4444-5555-666666666666/",
  "aud": ["https://api.openai.com/v1"],
  "sub": "system:serviceaccount:default:openai-wif",
  "iat": 1716235422,
  "exp": 1716239022,
  "kubernetes.io": {
    "namespace": "default",
    "serviceaccount": {
      "name": "openai-wif",
      "uid": "11111111-2222-3333-4444-555555555555"
    }
  }
}
```

请在 OpenAI 中核实你计划配置的声明：

- `iss`: 必须与 OpenAI Workload Identity Provider 中配置的 AKS 颁发者 URL 匹配。
- `aud`: 必须与投射的服务账户令牌受众以及 OpenAI Workload Identity Provider 的受众匹配。
- `sub`: 必须与你在服务账户映射中配置的 Kubernetes 服务账户主体匹配。

请使用解码后的载荷，将你收到的令牌与 OpenAI 中配置的颁发者、受众和映射值进行比较。大多数配置问题都会在交换令牌前的 `iss`, `aud`，并且 `sub` 在交换令牌之前先检查这些声明。

### 设置工作负载身份联合

在 OpenAI 中为 AKS 颁发者创建一个 Workload Identity Provider，然后添加一个服务账号映射，使其与投影令牌中的属性相匹配。

请先配置工作负载身份提供方，再创建服务账户映射。

#### 设置 Workload Identity Provider

1. **创建工作负载身份提供程序。** 设置 **名称** 为唯一值，例如 `azure-aks-prod`。使用 **描述**,例如 `Production AKS cluster`,以帮助管理员识别集群。

2. **设置颁发者和受众。** 设置 **OIDC 颁发者 URL** 设置为由 `az aks show --query "oidcIssuerProfile.issuerUrl"`。返回的 issuer。该值必须与 `iss` claim 在投射的 AKS 服务账号令牌中匹配。将 **受众** 设置为与投射的服务账号令牌卷上配置的 audience 相同。在本示例中,该值为 `https://api.openai.com/v1`.

3. **使用 AKS OIDC 发现。** 将 **使用上传的 JWKS 进行令牌验证** 已禁用。OpenAI 使用 AKS issuer 的 OIDC 发现元数据和 JWKS 来验证投射的服务账号令牌。

4. **如果需要派生映射属性，请添加属性转换。** 例如，输入 `aks_subject` 以及表达式 `assertion.sub` 以创建 `openai.aks_subject`。该仪表板会应用 `openai.` 此前缀。已以 `openai.` 开头的原始令牌声明不会用于 `openai.` 映射键，除非配置了匹配的转换。

#### 设置服务账号映射

1. **创建服务帐户映射。** 设置 **名称** 设置为一个在该 Workload Identity Provider 中唯一的值，例如 `default-openai-wif`。使用 **描述**,例如 `Default namespace AKS OpenAI API workload`，以说明哪个工作负载可以使用该映射。

2. **匹配 AKS 服务账号主体。** 设置 **键** 为 `sub` 和 **值** 为 `system:serviceaccount:default:openai-wif`。对于 AKS 服务账号,subject 格式为 `system:serviceaccount:<namespace>:<service-account-name>`.

   Workload Identity Provider 将令牌限制在配置的 AKS issuer 上。服务账号映射进一步将访问限制到指定的 Kubernetes 服务账号主体。

3. **选择 OpenAI 目标。** 设置 **项目** 为拥有目标服务帐户的 OpenAI 项目。设置 **服务帐户** 设置为 OpenAI 服务账号,AKS 工作负载可以使用该服务账号,例如 `azure-aks-prod-openai-wif`.

4. **根据需要收窄 API 权限。** 选择适当的 **权限** ，例如 `api.model.request` 和 `api.vector_store.read` 以进一步收窄从此映射生成的访问令牌的权限范围。如果将权限留空，则不会添加特定于 WIF 的范围限制；该令牌仍会以映射的服务帐户身份进行授权。

### 在代码中使用令牌

配置你的 OpenAI SDK 客户端，以读取投影的 AKS 服务账户令牌，并将其交换为由 OpenAI 签发的访问令牌。

使用挂载的令牌路径，例如 `/var/run/secrets/tokens/token`，作为 SDK 工作负载身份联合提供程序的主体令牌来源。SDK 会将该 AKS 令牌交换为由 OpenAI 签发的访问令牌，并使用该 OpenAI 令牌对 API 请求进行身份验证。

以下示例使用自定义主体令牌提供程序初始化 OpenAI 客户端。提供程序会从挂载的文件路径读取投影的 AKS 服务账户令牌，并将其用作工作负载身份联合的主体令牌。

使用 AKS 投影的服务账户令牌进行身份验证

```javascript
import { readFile } from "node:fs/promises";
import OpenAI from "openai";

const tokenPath = "/var/run/secrets/tokens/token";
const identityProviderId = process.env.OPENAI_IDENTITY_PROVIDER_ID;
const serviceAccountId = process.env.OPENAI_SERVICE_ACCOUNT_ID;

if (!identityProviderId || !serviceAccountId) {
  throw new Error(
    "Set OPENAI_IDENTITY_PROVIDER_ID and OPENAI_SERVICE_ACCOUNT_ID"
  );
}

/** @returns {import("openai/auth/index").SubjectTokenProvider} */
function mountedAksServiceAccountTokenProvider(path) {
  return {
    tokenType: "jwt",
    getToken: async () => {
      const token = (await readFile(path, "utf8")).trim();
      if (!token) {
        throw new Error("The mounted AKS service account token file is empty.");
      }
      return token;
    },
  };
}

const client = new OpenAI({
  workloadIdentity: {
    identityProviderId,
    serviceAccountId,
    provider: mountedAksServiceAccountTokenProvider(tokenPath),
  },
});

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "Say hello from AKS workload identity federation.",
});

console.log(response.output_text);
```

```python
import os
from pathlib import Path

from openai import OpenAI
from openai.auth import SubjectTokenProvider

TOKEN_PATH = "/var/run/secrets/tokens/token"


def mounted_aks_service_account_token_provider(token_path: str) -> SubjectTokenProvider:
    def get_token() -> str:
        token = Path(token_path).read_text().strip()
        if not token:
            raise RuntimeError("The mounted AKS service account token file is empty.")
        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": mounted_aks_service_account_token_provider(TOKEN_PATH),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from AKS workload identity federation.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/auth"
	"github.com/openai/openai-go/v3/option"
	"github.com/openai/openai-go/v3/responses"
)

const tokenPath = "/var/run/secrets/tokens/token"

type mountedAksServiceAccountTokenProvider struct {
	path string
}

func (p mountedAksServiceAccountTokenProvider) TokenType() auth.SubjectTokenType {
	return auth.SubjectTokenTypeJWT
}

func (p mountedAksServiceAccountTokenProvider) GetToken(_ context.Context, _ auth.HTTPDoer) (string, error) {
	data, err := os.ReadFile(p.path)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "azure-aks",
			Message:  "failed to read mounted AKS service account token",
			Cause:    err,
		}
	}

	token := strings.TrimSpace(string(data))
	if token == "" {
		return "", &auth.SubjectTokenProviderError{
			Provider: "azure-aks",
			Message:  "mounted AKS service account token is empty",
		}
	}

	return token, nil
}

func main() {
	client := openai.NewClient(
		option.WithWorkloadIdentity(auth.WorkloadIdentity{
			IdentityProviderID: os.Getenv("OPENAI_IDENTITY_PROVIDER_ID"),
			ServiceAccountID:   os.Getenv("OPENAI_SERVICE_ACCOUNT_ID"),
			Provider: mountedAksServiceAccountTokenProvider{
				path: tokenPath,
			},
		}),
	)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: openai.ChatModelGPT4_1Mini,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Say hello from AKS workload identity federation."),
		},
	})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(response.OutputText())
}
```

```java
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.auth.SubjectTokenProvider;
import com.openai.auth.SubjectTokenType;
import com.openai.auth.WorkloadIdentity;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.HttpClient;
import com.openai.errors.SubjectTokenProviderException;
import com.openai.models.responses.ResponseCreateParams;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.concurrent.CompletableFuture;

public final class AzureAksWorkloadIdentityExample {
  private static final String TOKEN_PATH = "/var/run/secrets/tokens/token";

  private AzureAksWorkloadIdentityExample() {}

  static final class MountedAksServiceAccountTokenProvider implements SubjectTokenProvider {
    private final Path tokenPath;

    MountedAksServiceAccountTokenProvider(String tokenPath) {
      this.tokenPath = Path.of(tokenPath);
    }

    @Override
    public SubjectTokenType tokenType() {
      return SubjectTokenType.JWT;
    }

    @Override
    public String getToken(HttpClient httpClient, JsonMapper jsonMapper) {
      String token;
      try {
        token = Files.readString(tokenPath).trim();
      } catch (Exception e) {
        throw new SubjectTokenProviderException(
            "azure-aks", "failed to read mounted AKS service account token", e);
      }

      if (token.isEmpty()) {
        throw new SubjectTokenProviderException(
            "azure-aks", "mounted AKS service account token is empty", null);
      }

      return token;
    }

    @Override
    public CompletableFuture<String> getTokenAsync(HttpClient httpClient, JsonMapper jsonMapper) {
      return CompletableFuture.supplyAsync(() -> getToken(httpClient, jsonMapper));
    }
  }

  public static void main(String[] args) {
    WorkloadIdentity workloadIdentity =
        WorkloadIdentity.builder()
            .identityProviderId(System.getenv("OPENAI_IDENTITY_PROVIDER_ID"))
            .serviceAccountId(System.getenv("OPENAI_SERVICE_ACCOUNT_ID"))
            .provider(new MountedAksServiceAccountTokenProvider(TOKEN_PATH))
            .build();

    OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("gpt-5.6-terra")
            .input("Say hello from AKS workload identity federation.")
            .build();

    client.responses().create(params).output().stream()
        .flatMap(item -> item.message().stream())
        .flatMap(message -> message.content().stream())
        .flatMap(content -> content.outputText().stream())
        .forEach(outputText -> System.out.println(outputText.text()));
  }
}
```

```ruby
require "openai"

TOKEN_PATH = "/var/run/secrets/tokens/token"

class MountedAksServiceAccountTokenProvider
  include OpenAI::Auth::SubjectTokenProvider

  def initialize(token_path:)
    @token_path = token_path
  end

  def token_type
    OpenAI::Auth::TokenType::JWT
  end

  def get_token
    token = File.read(@token_path).strip
    if token.empty?
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "Mounted AKS service account token is empty",
        provider: "azure-aks"
      )
    end
    token
  rescue SystemCallError => e
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to read mounted AKS service account token: #{e.message}",
      provider: "azure-aks",
      cause: e
    )
  end
end

provider = MountedAksServiceAccountTokenProvider.new(token_path: TOKEN_PATH)

workload_identity = OpenAI::Auth::WorkloadIdentity.new(
  identity_provider_id: ENV.fetch("OPENAI_IDENTITY_PROVIDER_ID"),
  service_account_id: ENV.fetch("OPENAI_SERVICE_ACCOUNT_ID"),
  provider: provider
)

client = OpenAI::Client.new(workload_identity: workload_identity)

response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Say hello from AKS workload identity federation."
)

puts(response.output_text)
```



## Microsoft Azure 最佳实践

- 尽可能使用托管标识。托管标识提供了一种比手动分发凭据更简单、更安全的身份验证模型。
- 为不同的应用和环境使用单独的托管标识、Microsoft Entra 应用以及 OpenAI 映射。避免在开发、预发布和生产工作负载之间共享同一个标识。
- 限制接受的受众。仅配置 OpenAI 工作负载标识联合身份验证所需的受众。
- 使用专用的 Microsoft Entra ID 应用来划分安全边界。独立的应用能够提供更清晰的所有权、审计和访问管理。
- 优先采用针对工作负载的映射。基于工作负载特定的声明进行匹配，而不是使用宽泛的全租户属性。
- 定期审查联合凭据配置。过期的联合凭据可能在工作负载下线后很长时间内仍无意中继续授予访问权限。
- 将生产环境与非生产环境的标识分开。生产工作负载应通过不同的联合标识和 OpenAI 服务帐户进行身份验证。