# 为 Microsoft Azure 配置工作负载身份联合

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

在以下任一场景中，使用 Microsoft Azure 作为工作负载身份提供者：

- **Azure 托管标识：** 将为托管标识签发的 Microsoft Entra ID 访问令牌兑换为短期OpenAI访问令牌。
- **AKS：** 将投射的 Azure Kubernetes Service（AKS）服务账户令牌兑换为短期OpenAI访问令牌。

对于 Codex，请使用此页面获取并检查 Microsoft Entra 令牌。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 以将该令牌写入文件并让 Codex 指向它。此页面上的服务账户映射和 SDK 示例适用于 OpenAI API。



## Azure 托管身份

Azure 托管标识让 Azure 托管的工作负载请求 Microsoft Entra 令牌，而无需存储长期机密。在 OpenAI 工作负载身份联合中，托管标识令牌是 OpenAI 在颁发 OpenAI 访问令牌之前验证的主体令牌。

### 设置 Azure 托管身份

创建一个 Microsoft Entra 应用程序注册，它代表令牌受众 OpenAI 应信任的。配置其 **应用程序 ID URI**；此 URI 是 `resource` 你的工作负载从 Azure 实例元数据服务 (IMDS) 请求的值，并作为 `aud` 声明出现在颁发的令牌中。有关 Microsoft 设置步骤，请参阅 Microsoft Entra 指南以 [创建新的 Entra ID 应用程序和服务主体](https://learn.microsoft.com/en-au/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-azure-ad-and-create-a-service-principal).

在 Microsoft Entra ID 中配置的应用程序 ID URI、IMDS `resource`
  参数、生成的令牌的 `aud` 声明，以及 OpenAI Workload Identity
  提供商受众必须全部匹配。

[创建](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal?pivots=identity-mi-methods-azp) 一个托管标识，然后 [分配](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#user-assigned-managed-identity) 该托管标识给运行你的应用程序的 Azure 资源，例如虚拟机。该资源必须在运行时能够调用 IMDS。有关 Azure 设置详细信息，请参阅 Microsoft 的 [托管标识概述](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) 以及相关 Azure 资源文档以分配该标识。

### 获取 Azure 托管标识令牌

从分配了托管身份的 Azure 资源中，以应用程序 ID URI 作为 `resource` 参数向 IMDS 请求令牌。此令牌是 OpenAI 用来交换 OpenAI 签发的访问令牌的主体令牌。

```bash
APPLICATION_ID_URI="api://<application-client-id>"

TOKEN=$(curl -sS -G -H "Metadata: true" \
  "http://169.254.169.254/metadata/identity/oauth2/token" \
  --data-urlencode "api-version=2018-02-01" \
  --data-urlencode "resource=${APPLICATION_ID_URI}" \
  | jq -r .access_token)
export TOKEN
```

如果资源具有多个用户分配的托管身份，请添加 `client_id`, `object_id`，或 `msi_res_id` 用于指定要使用的托管身份的查询参数。Microsoft 在以下文档中说明了 IMDS 令牌请求参数： [使用虚拟机上的托管身份获取访问令牌](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-to-use-vm-token).

### 验证令牌

在配置工作负载身份联合之前，请导出 Microsoft Entra 令牌为 `TOKEN`，然后在本地运行此脚本以检查其声明：

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


此命令解码 JWT 负载而不验证令牌签名。对于生产令牌，请使用本地解码器，并避免将生产令牌粘贴到第三方工具中。

解码后的 Microsoft Entra ID 托管身份令牌将类似于：

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

验证你计划在 OpenAI 中配置的声明：

- `iss`：使用令牌中准确的颁发者值。颁发者可能为 `https://login.microsoftonline.com/<tenant-id>/v2.0`，但不要假定该后缀。
- `aud`：必须与应用程序 ID URI、IMDS `resource` 参数以及 OpenAI 工作负载身份提供方受众匹配。
- `tid`：Microsoft Entra 租户 ID。
- `appid`：托管标识的应用/客户端 ID（如果存在）。
- `iat` 以及 `exp`：检查令牌的完整生命周期， `exp - iat`，以秒为单位。

对于 Codex，请将提供商的 `max_assertion_lifetime_seconds` 设置为一个已获批准的
限制值，该限制值应覆盖签发方预期的令牌生存时间范围。请勿使用
令牌的剩余有效期，也不要假设每个 Entra 令牌的持续时间都是一小时。
Microsoft 记录了 [可变量的访问令牌
生存时间](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens#token-lifetime)
并且不支持 [配置托管身份令牌
生存时间](https://learn.microsoft.com/en-us/entra/identity-platform/configurable-token-lifetimes).
请参阅 [管理员 API 提供商
示例](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api#create-an-oidc-provider).

托管身份令牌还可能包含以下声明： `azp`, `oid`, `sub`，或 `xms_mirid`。请将解码后的令牌视为事实来源，并选择能够准确标识你信任的托管身份和资源边界的声明。

使用解码后的负载，将你收到的令牌与 OpenAI 中配置的签发方、受众和映射值进行比较。大多数配置问题都可在 `iss`, `aud`, `tid`，以及交换令牌之前的托管身份声明中看到。

### 设置工作负载身份联合

为 Microsoft Entra ID 颁发者在 OpenAI 中创建工作负载身份提供程序，然后添加与托管身份令牌中的稳定声明匹配的服务账户映射。

先配置工作负载身份提供程序，再创建服务账户映射。

#### 设置 Workload Identity Provider

1. **创建工作负载身份提供程序。** 将 **名称** 设置为唯一值，例如 `azure-managed-identity-prod`。使用 **描述**，例如 `Production Azure managed identity workloads`，以帮助管理员识别提供程序。

2. **设置颁发者和受众。** 将 **OIDC 颁发者 URL** 设置为令牌的精确值 `iss` 声明。首先获取一个示例托管身份令牌并检查其声明。例如，颁发者可能是 `https://login.microsoftonline.com/<tenant-id>/v2.0`。将 **受众** 设置为你配置的 Microsoft Entra 应用程序 ID URI，例如 `api://<application-client-id>`。此值必须与令牌的 `aud` 声明匹配。

3. **使用 Microsoft Entra 令牌验证。** 保留 **使用上传的 JWKS 进行令牌验证** 禁用时。OpenAI 使用 Microsoft Entra 颁发者元数据和 JWKS 来验证托管身份令牌。

4. **如果需要派生的映射属性，请添加属性转换。** 例如，输入 `managed_identity_client_id` 并使用表达式 `assertion.appid` 以从托管身份应用程序/客户端 ID 声明创建 `openai.managed_identity_client_id` 。仪表板会自动应用 `openai.` 前缀。已经以 `openai.` 开头的原始令牌声明将被忽略，不用于 `openai.` 映射键，除非配置了匹配的转换。

#### 设置服务账户映射

1. **创建服务账号映射。** 将 **Name** 设置为在该 Workload Identity Provider 内唯一的值，例如 `vm-openai-wif`。使用 **Description**（例如 `Production VM Azure managed identity workload`）来说明哪些工作负载可以使用该映射。

2. **匹配稳定的托管身份声明。** 为每个必须匹配的声明添加一行 **Key** 和 **Value** 。如果令牌包含 `appid`，则将 **Key** 设为 `appid` ，并将 **Value** 设为托管身份客户端 ID。该 `appid` claim 识别托管标识的应用/客户端 ID，通常是将映射绑定到特定托管标识时最稳定的 claim。如果你的令牌不包含 `appid`，请使用解码令牌中的另一个稳定 claim，例如 `azp`, `oid`, `sub`，或 `xms_mirid`。要将映射绑定到单个租户，还需将 **Key** 设置为 `tid` 并将 **Value** 设置为 Microsoft Entra 租户 ID。从 IMDS 解码示例令牌，并使用对你信任的托管标识和资源稳定的 claim。

3. **选择 OpenAI 目标。** 将 **Project** 设置为拥有目标服务账户的 OpenAI 项目。将 **Service account** 设置为 Azure 工作负载可使用的 OpenAI 服务账户，例如 `azure-managed-identity-prod-openai-wif`.

4. **根据需要缩小 API 权限范围。** 选择适当的 **Permissions** ，例如 `api.model.request` 和 `api.vector_store.read` 以进一步收窄从此映射铸造的访问令牌。将权限留空可避免添加 WIF 特定的作用域限制；该令牌仍将以映射的服务账号身份进行授权。

### 在代码中使用令牌

配置你的 OpenAI SDK 客户端，从 IMDS 请求 Azure 托管身份令牌，并将其交换为 OpenAI 颁发的访问令牌。

将 `OPENAI_WIF_AUDIENCE` 设置为配置为工作负载身份提供方受众的 Microsoft Entra 应用程序 ID URI。SDK 为该受众请求托管身份令牌，将其交换为 OpenAI 颁发的访问令牌，并使用 OpenAI 令牌对 API 请求进行身份验证。

从 Azure 托管身份令牌进行身份验证

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

通过将 OpenAI 访问令牌换出 AKS 签发的投射服务账户令牌，将 AKS 用作工作负载身份提供程序。

AKS 工作负载还可以使用 Azure 工作负载身份来获取附加到工作负载的托管身份的 Microsoft Entra
  ID 访问令牌。在该
  配置中，OpenAI 验证的是 Microsoft Entra 令牌，而非
  投射的 Kubernetes 服务账户令牌。按照以下步骤配置 OpenAI 工作负载身份
  联合，然后根据 [Azure 托管
  身份](#azure-managed-identity)，文档中的步骤配置 Azure 工作负载身份，
  并遵循 Microsoft 的文档。

### 设置 AKS

检索与 AKS 集群关联的 OIDC issuer URL：

```bash
az aks show \
  --name <cluster-name> \
  --resource-group <resource-group> \
  --query "oidcIssuerProfile.issuerUrl" \
  --output tsv
```

如果 issuer URL 为空，请为集群启用 AKS OIDC issuer。使用以下命令：

```bash
az aks update \
    --resource-group <resource-group> \
    --name <cluster-name> \
    --enable-oidc-issuer
```

你在 OpenAI 工作负载身份提供程序中配置的 issuer 必须与此 issuer URL 以及 `iss` 投影的 AKS 服务账户令牌中的 claim 匹配。

使用 Kubernetes `ServiceAccount` 来处理需要调用 OpenAI API 的 AKS 工作负载。如果你还没有，请创建一个：

```bash
kubectl create serviceaccount openai-wif --namespace default
```

使用 OpenAI 期望的 audience 和适合你的工作负载的过期时间配置投影的服务账户令牌。OpenAI 会验证令牌的 issuer、签名、audience 和过期时间。在此示例中，令牌文件挂载在 `/var/run/secrets/tokens/token`，使用 audience `https://api.openai.com/v1`，并在 3600 秒后过期。如果投影令牌 audience 与 OpenAI 工作负载身份提供程序的 audience 匹配，你可以使用不同的 audience。

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

在配置工作负载身份联合之前，先在本地解码一个示例投影服务账户令牌并检查其声明。从挂载了投影令牌的运行中 Pod 中检索该令牌，并将其导出为 `TOKEN`:

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


此命令解码 JWT 负载，但不验证令牌签名。对生产令牌使用本地解码器，并避免将生产令牌粘贴到第三方工具中。

解码后的 AKS 投影服务账户令牌将类似于：

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

验证你计划在 OpenAI 中配置的声明：

- `iss`：必须匹配在 OpenAI 工作负载身份提供程序中配置的 AKS 签发者 URL。
- `aud`：必须匹配投影的服务账户令牌受众以及 OpenAI 工作负载身份提供程序的受众。
- `sub`：必须匹配你在服务账户映射中配置的 Kubernetes 服务账户主体。

使用解码后的载荷，将你收到的令牌与 OpenAI 中配置的签发者、受众和映射值进行比较。大多数配置问题都可以在 `iss`, `aud`，以及 `sub` 声明中看到，然后你再交换令牌。

### 设置工作负载身份联合

为 AKS 签发者在 OpenAI 中创建工作负载身份提供程序，然后添加一个服务账户映射，以匹配投影令牌中的属性。

先配置工作负载身份提供程序，然后创建服务账户映射。

#### 设置工作负载身份提供方

1. **创建工作负载身份提供程序。** 将 **名称** 设置为唯一值，例如 `azure-aks-prod`。使用 **描述**，例如 `Production AKS cluster`，以帮助管理员识别集群。

2. **设置颁发者和受众。** 将 **OIDC 颁发者 URL** 设置为 `az aks show --query "oidcIssuerProfile.issuerUrl"`。返回的颁发者。此值必须与 `iss` 中的 **受众** 设置为与投影的服务账户令牌卷上配置的相同受众。在此示例中，该值为 `https://api.openai.com/v1`.

3. **使用 AKS OIDC 发现。** 保持 **使用上传的 JWKS 进行令牌验证** OpenAI 使用 AKS 颁发者的 OIDC 发现元数据和 JWKS 来验证投影的服务账户令牌。

4. **如果需要派生的映射属性，请添加属性变换。** 例如，输入 `aks_subject` 并使用表达式 `assertion.sub` 来创建 `openai.aks_subject`。仪表板会自动应用 `openai.` 前缀。已经以 `openai.` 开头的原始令牌声明在 `openai.` 映射键时将被忽略，除非配置了匹配的变换。

#### 设置服务账号映射

1. **创建服务账号映射。** 将 **Name** 设置为该 Workload Identity Provider 内唯一的值，例如 `default-openai-wif`。使用 **Description**，例如 `Default namespace AKS OpenAI API workload`，来说明哪些工作负载可以使用该映射。

2. **匹配 AKS 服务账号主题。** 将 **Key** 设置为 `sub` ，并将 **Value** 设置为 `system:serviceaccount:default:openai-wif`。对于 AKS 服务账号，主题格式为 `system:serviceaccount:<namespace>:<service-account-name>`.

   Workload Identity Provider 将令牌限制为配置的 AKS 签发者。服务账号映射进一步将访问限制为指定的 Kubernetes 服务账号主题。

3. **选择 OpenAI 目标。** 将 **Project** 到拥有目标服务账户的 OpenAI 项目。设置 **Service account** 为 AKS 工作负载可使用的 OpenAI 服务账户，例如 `azure-aks-prod-openai-wif`.

4. **如有需要，缩小 API 权限范围。** 选择合适的 **Permissions** ，例如 `api.model.request` 和 `api.vector_store.read` ，以进一步缩小从此映射生成的访问令牌。将权限留空可避免添加 WIF 特定的范围限制；令牌仍会以映射的服务账户身份授权。

### 在代码中使用令牌

配置你的 OpenAI SDK 客户端，以读取投影的 AKS 服务账户令牌，并将其交换为 OpenAI 签发的访问令牌。

使用挂载的令牌路径，例如 `/var/run/secrets/tokens/token`，作为 SDK 工作负载身份联合提供程序的主题令牌源。SDK 将该 AKS 令牌交换为 OpenAI 签发的访问令牌，并使用 OpenAI 令牌来认证 API 请求。

以下示例使用自定义主题令牌提供程序初始化 OpenAI 客户端。该提供程序从挂载的文件路径读取投影的 AKS 服务账户令牌，并将其用作工作负载身份联合的主题令牌。

从 AKS 投影的服务账户令牌进行认证

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

- 尽可能使用托管身份。托管身份比手动分发凭据提供更简单、更安全的身份验证模型。
- 为不同的应用程序和环境使用单独的托管身份、Microsoft Entra 应用程序和OpenAI映射。避免在开发、预发布和生产工作负载之间共享一个身份。
- 限制接受的受众。仅配置OpenAI工作负载身份联合所需的受众。
- 使用专用的 Microsoft Entra ID 应用程序来界定安全边界。独立的应用程序提供更清晰的归属、审计和访问管理。
- 优先使用特定于工作负载的映射。匹配工作负载特定的声明，而不是广泛的租户级属性。
- 定期审查联合凭据配置。过时的联合凭据可能在工作负载停用后继续无意中授予访问权限。
- 分离生产和非生产身份。生产工作负载应通过不同的联合身份和OpenAI服务账户进行身份验证。