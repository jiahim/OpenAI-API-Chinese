# 为 Google Cloud 配置工作负载身份联合

> 关于完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

在以下任一场景中，将 Google Cloud 用作工作负载身份提供方：

- **Google 工作负载身份：** 将颁发给已附加的 Google 服务账户的 Google 签名 OIDC 令牌交换为短期 OpenAI 访问令牌。
- **Google Kubernetes Engine：** 将投射的 GKE 服务账户令牌交换为短期 OpenAI 访问令牌。

对于 Codex，请使用此页面获取并检查 Google token。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 将 token 写入文件，并让 Codex 指向该文件。本页中的服务账号映射和 SDK 示例适用于 OpenAI API。



## Google 工作负载身份

Google Cloud 工作负载可以从 Google 元数据服务器请求签名的 OIDC 身份令牌，而无需存储长期有效的服务账号密钥。在 OpenAI 工作负载身份联合中，Google 身份令牌是 OpenAI 在签发 OpenAI 访问令牌之前验证的主体令牌。此流程适用于使用附加 Google 服务账号的 Compute Engine、Cloud Run、GKE 工作负载，以及其他公开元数据服务器身份端点的 Google 托管运行时。

### 设置 Google 工作负载身份

为需要调用 OpenAI API 的工作负载创建一个 Google 服务账号。完整的设置流程，请参阅 Google 指南： [创建服务账号](https://docs.cloud.google.com/iam/docs/service-accounts-create).

例如，使用 Google Cloud CLI 创建服务账号：

```bash
gcloud iam service-accounts create openai-wif \
  --description="Service account for OpenAI workload identity federation" \
  --display-name="OpenAI workload identity federation"
```

创建挂载了该服务账号的 Compute Engine VM，或将服务账号挂载到运行你的应用的 Google Cloud 资源上。该资源必须在运行时能够访问 Google 元数据服务器。有关 VM 设置的详细信息，请参阅 Google 指南： [创建使用用户管理服务账号的 VM](https://docs.cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances).

不要为此流程创建或下载服务账号密钥。工作负载使用挂载的服务账号和元数据服务器来请求短期 OIDC 令牌。

### 获取 Google 身份令牌

从附加了服务账号的 Google Cloud 资源中，向元数据服务器请求一个带有已配置受众的 OIDC 身份令牌。此令牌是 OpenAI 用来交换 OpenAI 签发的访问令牌的主题令牌。

```bash
AUDIENCE="https://api.openai.com/v1"

TOKEN=$(curl -sS -G -H "Metadata-Flavor: Google" \
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity" \
  --data-urlencode "audience=${AUDIENCE}")
export TOKEN
```

元数据服务器返回一个 Google 签名的 JWT。有关元数据服务器身份端点的更多信息，请参阅 Google 的指南： [验证虚拟机身份](https://docs.cloud.google.com/compute/docs/instances/verifying-instance-identity).

### 验证令牌

在配置工作负载身份联合之前，请将 Google 身份令牌导出为 `TOKEN`，然后在本机运行此脚本以检查其声明：

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


此命令解码 JWT 负载，而不验证令牌签名。对于生产令牌，请使用本地解码器，并避免将生产令牌粘贴到第三方工具中。

解码后的 Google 元数据服务器身份令牌将类似于：

```json
{
  "iss": "https://accounts.google.com",
  "aud": "https://api.openai.com/v1",
  "azp": "110123456789012345678",
  "sub": "110123456789012345678",
  "email": "openai-wif@my-project.iam.gserviceaccount.com",
  "email_verified": true,
  "iat": 1716235422,
  "exp": 1716239022
}
```

使用解码后的负载，将你收到的令牌与 OpenAI 中配置的签发者、受众和映射值进行比较。大多数配置问题在 `iss`, `aud`, `email`，和 `sub` 声明中可见，然后你再交换令牌。

### 设置工作负载身份联合

在 OpenAI 中为 Google 颁发的身份令牌创建工作负载身份提供程序，然后添加一个服务账户映射，该映射匹配令牌中的稳定声明。

先配置工作负载身份提供程序，再创建服务账户映射。

#### 设置 Workload Identity Provider

1. **创建工作负载身份提供程序。** 设置 **名称** 为唯一值，例如 `google-workload-identity-prod`。使用 **描述**，例如 `Production Google Cloud workloads`，以帮助管理员识别提供程序。

2. **设置签发者和受众。** 将 **OIDC 签发者 URL** 设置为 `https://accounts.google.com`。将 **受众** 设置为你的工作负载从 Google 元数据服务器请求的自定义受众，例如 `https://api.openai.com/v1`。此值必须与令牌的 `aud` 声明匹配。

3. **使用 Google OIDC 发现。** 保持 **使用上传的 JWKS 进行令牌验证** 禁用。OpenAI 使用 Google 的 OIDC 发现元数据和 JWKS 来验证 Google 签名的身份令牌。

4. **如果你需要派生映射属性，请添加属性转换。** 例如，输入 `subject` 使用表达式 `assertion.sub` 以从 subject 声明中创建 `openai.subject` 。仪表板会自动应用 `openai.` 前缀。原始令牌声明如果已以 `openai.` 开头，则会被忽略，用于 `openai.` 映射键，除非配置了匹配的转换。

#### 设置服务账号映射

1. **创建服务账号映射。** 将 **名称** 设置为工作负载身份提供方内的唯一值，例如 `compute-openai-wif`。使用 **描述**，例如 `Production Compute Engine OpenAI API workload`，以说明哪些工作负载可以使用该映射。

2. **匹配稳定的 Google 服务账号声明。** 为每个必须匹配的声明添加 **键** 和 **值** 行。使用 `sub` 作为主要身份绑定，因为它稳定且唯一。你还可以匹配 `email` 以提高可读性。

3. **选择 OpenAI 目标。** 将 **项目** 设置为拥有目标服务账号的 OpenAI 项目。将 **服务账号** 授予 Google Cloud 工作负载可使用的 OpenAI 服务账号，例如 `google-workload-identity-prod-openai-wif`.

4. **如有必要，缩小 API 权限范围。** 选择合适的 **权限** 例如 `api.model.request` 和 `api.vector_store.read` 以进一步缩小从该映射生成的访问令牌范围。将权限留空可避免添加特定于 WIF 的作用域限制；令牌仍会以映射的服务账号身份进行授权。

### 在代码中使用令牌

配置你的 OpenAI SDK 客户端，从元数据服务器请求 Google 身份令牌，并将其交换为 OpenAI 签发的访问令牌。

将 `OPENAI_WIF_AUDIENCE` 设置为 Workload Identity Provider 受众所配置的自定义受众。SDK 会为该受众请求 Google 身份令牌，将其交换为 OpenAI 签发的访问令牌，并使用 OpenAI 令牌来验证 API 请求。

使用 Google 元数据服务器身份令牌进行身份验证

```javascript
import OpenAI from "openai";

const metadataEndpoint =
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity";

const identityProviderId = process.env.OPENAI_IDENTITY_PROVIDER_ID;
const serviceAccountId = process.env.OPENAI_SERVICE_ACCOUNT_ID;
const audience = process.env.OPENAI_WIF_AUDIENCE;

if (!identityProviderId || !serviceAccountId || !audience) {
  throw new Error(
    "Set OPENAI_IDENTITY_PROVIDER_ID, OPENAI_SERVICE_ACCOUNT_ID, and OPENAI_WIF_AUDIENCE"
  );
}

/** @returns {import("openai/auth/index").SubjectTokenProvider} */
function googleMetadataIdentityTokenProvider(audience) {
  return {
    tokenType: "jwt",
    getToken: async () => {
      const url = new URL(metadataEndpoint);
      url.searchParams.set("audience", audience);
      url.searchParams.set("format", "full");

      const response = await fetch(url, {
        headers: { "Metadata-Flavor": "Google" },
      });

      if (!response.ok) {
        throw new Error(
          `Google metadata token request failed with status ${response.status}.`
        );
      }

      const token = (await response.text()).trim();
      if (!token) {
        throw new Error(
          "Google metadata server did not return an identity token."
        );
      }

      return token;
    },
  };
}

const client = new OpenAI({
  workloadIdentity: {
    identityProviderId,
    serviceAccountId,
    provider: googleMetadataIdentityTokenProvider(audience),
  },
});

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "Say hello from Google Cloud workload identity federation.",
});

console.log(response.output_text);
```

```python
import os
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from openai import OpenAI
from openai.auth import SubjectTokenProvider

METADATA_ENDPOINT = (
    "http://metadata.google.internal/computeMetadata/v1/instance/"
    "service-accounts/default/identity"
)


def google_metadata_identity_token_provider(audience: str) -> SubjectTokenProvider:
    def get_token() -> str:
        request = Request(
            f"{METADATA_ENDPOINT}?{urlencode({'audience': audience, 'format': 'full'})}",
            headers={"Metadata-Flavor": "Google"},
        )

        with urlopen(request, timeout=10) as response:
            token = response.read().decode("utf-8").strip()

        if not token:
            raise RuntimeError(
                "Google metadata server did not return an identity token."
            )
        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": google_metadata_identity_token_provider(
            audience=os.environ["OPENAI_WIF_AUDIENCE"]
        ),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from Google Cloud workload identity federation.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/auth"
	"github.com/openai/openai-go/v3/option"
	"github.com/openai/openai-go/v3/responses"
)

const googleMetadataEndpoint = "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity"

type googleMetadataIdentityTokenProvider struct {
	audience string
}

func (p googleMetadataIdentityTokenProvider) TokenType() auth.SubjectTokenType {
	return auth.SubjectTokenTypeJWT
}

func (p googleMetadataIdentityTokenProvider) GetToken(ctx context.Context, httpClient auth.HTTPDoer) (string, error) {
	values := url.Values{}
	values.Set("audience", p.audience)
	values.Set("format", "full")

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, googleMetadataEndpoint+"?"+values.Encode(), nil)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-metadata",
			Message:  "failed to build Google metadata token request",
			Cause:    err,
		}
	}
	req.Header.Set("Metadata-Flavor", "Google")

	resp, err := httpClient.Do(req)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-metadata",
			Message:  "failed to request Google identity token",
			Cause:    err,
		}
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-metadata",
			Message:  fmt.Sprintf("Google metadata token request failed with status %d", resp.StatusCode),
		}
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-metadata",
			Message:  "failed to read Google metadata token response",
			Cause:    err,
		}
	}

	token := strings.TrimSpace(string(data))
	if token == "" {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-metadata",
			Message:  "Google metadata server did not return an identity token",
		}
	}

	return token, nil
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
			Provider: googleMetadataIdentityTokenProvider{
				audience: audience,
			},
		}),
	)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: openai.ChatModelGPT4_1Mini,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Say hello from Google Cloud workload identity federation."),
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
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;

public final class GoogleWorkloadIdentityExample {
  private static final String METADATA_ENDPOINT =
      "http://metadata.google.internal/computeMetadata/v1/instance/"
          + "service-accounts/default/identity";

  private GoogleWorkloadIdentityExample() {}

  static final class GoogleMetadataIdentityTokenProvider implements SubjectTokenProvider {
    private final String audience;

    GoogleMetadataIdentityTokenProvider(String audience) {
      this.audience = audience;
    }

    @Override
    public SubjectTokenType tokenType() {
      return SubjectTokenType.JWT;
    }

    @Override
    public String getToken(HttpClient httpClient, JsonMapper jsonMapper) {
      try {
        String query =
            "audience=" + URLEncoder.encode(audience, StandardCharsets.UTF_8) + "&format=full";
        HttpRequest request =
            HttpRequest.newBuilder()
                .uri(URI.create(METADATA_ENDPOINT + "?" + query))
                .header("Metadata-Flavor", "Google")
                .GET()
                .build();

        HttpResponse<String> response =
            java.net.http.HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
          throw new SubjectTokenProviderException(
              "google-metadata",
              "Google metadata token request failed with status " + response.statusCode(),
              null);
        }

        String token = response.body().trim();
        if (token.isEmpty()) {
          throw new SubjectTokenProviderException(
              "google-metadata", "Google metadata server did not return an identity token", null);
        }

        return token;
      } catch (SubjectTokenProviderException e) {
        throw e;
      } catch (Exception e) {
        throw new SubjectTokenProviderException(
            "google-metadata", "failed to request Google identity token", e);
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
            .provider(new GoogleMetadataIdentityTokenProvider(System.getenv("OPENAI_WIF_AUDIENCE")))
            .build();

    OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("gpt-5.6-terra")
            .input("Say hello from Google Cloud workload identity federation.")
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
require "net/http"
require "openai"
require "uri"

class GoogleMetadataIdentityTokenProvider
  include OpenAI::Auth::SubjectTokenProvider

  METADATA_ENDPOINT =
    "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity"

  def initialize(audience:)
    @audience = audience
  end

  def token_type
    OpenAI::Auth::TokenType::ID
  end

  def get_token
    uri = URI(METADATA_ENDPOINT)
    uri.query = URI.encode_www_form(
      audience: @audience,
      format: "full"
    )

    request = Net::HTTP::Get.new(uri)
    request["Metadata-Flavor"] = "Google"

    response = Net::HTTP.start(uri.hostname, uri.port, read_timeout: 10) do |http|
      http.request(request)
    end

    unless response.is_a?(Net::HTTPSuccess)
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "Google metadata token request failed with status #{response.code}",
        provider: "google-metadata"
      )
    end

    token = response.body.strip
    if token.empty?
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "Google metadata server did not return an identity token",
        provider: "google-metadata"
      )
    end
    token
  rescue SystemCallError => e
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to request Google identity token: #{e.message}",
      provider: "google-metadata",
      cause: e
    )
  end
end

provider = GoogleMetadataIdentityTokenProvider.new(
  audience: ENV.fetch("OPENAI_WIF_AUDIENCE")
)

workload_identity = OpenAI::Auth::WorkloadIdentity.new(
  identity_provider_id: ENV.fetch("OPENAI_IDENTITY_PROVIDER_ID"),
  service_account_id: ENV.fetch("OPENAI_SERVICE_ACCOUNT_ID"),
  provider: provider
)

client = OpenAI::Client.new(workload_identity: workload_identity)

response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Say hello from Google Cloud workload identity federation."
)

puts(response.output_text)
```


  


  


## Google Kubernetes Engine

使用 Google Kubernetes Engine 作为工作负载身份提供方，通过将 GKE 签发的投射服务账户令牌兑换为短期 OpenAI 访问令牌。

GKE 工作负载可以使用以下任一方式进行身份验证：

- 由集群 OIDC 签发方颁发的 Kubernetes 服务账户令牌。
- 通过 GKE Workload Identity 获取的 Google 服务账户身份令牌，其中 Kubernetes 服务账户绑定到 Google 服务账户。

当你希望 OpenAI 直接信任集群的 OIDC 签发者时，可使用投射的 Kubernetes 服务账户令牌。当你的工作负载已依赖 Google 服务账户身份，且你希望 OpenAI 转而信任 Google 签发的身份令牌时，请使用 GKE Workload Identity。

如果你的 GKE 工作负载已配置 GKE Workload Identity，并且能够从元数据服务器请求
  Google 身份令牌，请遵循 [Google 工作负载
  身份](#google-workload-identity) 上述说明，而非 GKE
  投射令牌流程。

### 设置 GKE

这些说明假定使用的是托管 GKE 集群。对于自管理 Kubernetes 集群，请使用 [Kubernetes 指南](https://developers.openai.com/api/docs/guides/workload-identity-federation/kubernetes).

为需要调用 OpenAI API 的 GKE 工作负载使用一个 Kubernetes `ServiceAccount` 。如果你还没有，请创建一个：

```bash
kubectl create serviceaccount openai-wif --namespace default
```

检索与 GKE 集群关联的签发者 URL：

```bash
kubectl get --raw /.well-known/openid-configuration | jq -r .issuer
```

示例输出：

```text
https://container.googleapis.com/v1/projects/my-project/locations/us-central1/clusters/openai-wif
```

你在 OpenAI Workload Identity Provider 中配置的签发者必须与此签发者 URL 以及投影的 GKE 服务账户令牌中的 `iss` 声明匹配。

配置投影的服务账户令牌，使用 OpenAI 期望的受众和适合你工作负载的过期时间。OpenAI 会验证令牌的签发者、签名、受众和过期时间。在此示例中，令牌文件挂载在 `/var/run/secrets/tokens/token`，使用受众 `https://api.openai.com/v1`，并在 3600 秒后过期。如果投影令牌受众和 OpenAI Workload Identity Provider 受众匹配，则可以使用不同的受众：

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
        - name: gke-sa-token
          mountPath: /var/run/secrets/tokens
          readOnly: true
  volumes:
    - name: gke-sa-token
      projected:
        sources:
          - serviceAccountToken:
              path: token
              audience: "https://api.openai.com/v1"
              expirationSeconds: 3600
```

### 验证令牌

在配置工作负载身份联合之前，先在本地解码一个示例投射服务账号令牌并检查其声明。从挂载了投射令牌的运行中的 Pod 中检索令牌并将其导出为 `TOKEN`:

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


此命令解码 JWT 载荷时不验证令牌签名。对生产令牌请使用本地解码器，并避免将生产令牌粘贴到第三方工具中。

解码后的 GKE 投射服务账号令牌类似于：

```json
{
  "iss": "https://container.googleapis.com/v1/projects/my-project/locations/us-central1/clusters/openai-wif",
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

使用解码后的载荷将你收到的令牌与 OpenAI 中配置的签发者、受众和映射值进行比较。大多数配置问题在 `iss`, `aud`，以及 `sub` 声明中即可见，之后你才交换令牌。

### 设置工作负载身份联合

在 OpenAI 中为 GKE 颁发者创建工作负载身份提供方，然后添加一个服务账号映射，以匹配投影令牌中的属性。

先配置工作负载身份提供方，然后创建服务账号映射。

#### 设置工作负载身份提供商

1. **创建工作负载身份提供程序。** 将 **名称** 设置为唯一值，例如 `google-gke-prod`。使用 **描述**，例如 `Production GKE cluster`，以帮助管理员识别集群。

2. **设置签发者和受众。** 将 **OIDC 签发者 URL** 设置为由 `kubectl get --raw /.well-known/openid-configuration | jq -r .issuer`。返回的签发者。此值必须与 `iss` 中投射的 GKE 服务账号令牌中的声明匹配。将 **受众** 设置为在投射的服务账号令牌卷上配置的相同受众。在此示例中，该值为 `https://api.openai.com/v1`.

3. **使用 GKE OIDC 发现。** 将 **使用上传的 JWKS 进行令牌验证** 保持禁用。OpenAI 使用 GKE 签发者的 OIDC 发现元数据和 JWKS 来验证投射的服务账号令牌。

4. **如果你需要派生映射属性，请添加属性转换。** 例如，输入 `gke_subject` 并带有表达式 `assertion.sub` 以创建 `openai.gke_subject`。仪表盘会自动应用 `openai.` 前缀。已经以 `openai.` 开头的原始令牌声明在 `openai.` 映射键中会被忽略，除非配置了匹配的转换。

#### 设置服务账号映射

1. **创建服务账号映射。** 将 **名称** 设置为工作负载身份提供程序中的唯一值，例如 `default-openai-wif`。使用 **描述**，例如 `Default namespace GKE OpenAI API workload`，来说明哪些工作负载可以使用该映射。

2. **匹配 GKE 服务账号主体。** 将 **键** 设置为 `sub` ，并将 **值** 设置为 `system:serviceaccount:default:openai-wif`。对于 GKE 服务账号，主体格式为 `system:serviceaccount:<namespace>:<service-account-name>`.

3. **选择 OpenAI 目标。** 将 **项目** 设置为拥有目标服务账号的 OpenAI 项目。将 **服务账号** 将 OpenAI 服务账号授予 GKE 工作负载可使用，例如 `google-gke-prod-openai-wif`.

4. **如有需要，收窄 API 权限。** 选择适当的 **权限** ，例如 `api.model.request` 和 `api.vector_store.read` ，以进一步收窄从此映射生成的访问令牌。将权限留空以避免添加特定于 WIF 的范围限制；令牌仍会授权为映射的服务账号。

### 在代码中使用令牌

配置你的 OpenAI SDK 客户端，以读取投影的 GKE 服务账号令牌，并将其兑换为 OpenAI 签发的访问令牌。

使用挂载的令牌路径，例如 `/var/run/secrets/tokens/token`，作为 SDK 工作负载身份联合提供程序的主题令牌来源。SDK 将该 GKE 令牌兑换为 OpenAI 签发的访问令牌，并使用该 OpenAI 令牌对 API 请求进行身份验证。

以下示例使用自定义主题令牌提供程序初始化 OpenAI 客户端。该提供程序从挂载的文件路径读取投影的 GKE 服务账号令牌，并将其用作工作负载身份联合的主题令牌。

从 GKE 投影服务账号令牌进行身份验证

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
function mountedGkeServiceAccountTokenProvider(path) {
  return {
    tokenType: "jwt",
    getToken: async () => {
      const token = (await readFile(path, "utf8")).trim();
      if (!token) {
        throw new Error("The mounted GKE service account token file is empty.");
      }
      return token;
    },
  };
}

const client = new OpenAI({
  workloadIdentity: {
    identityProviderId,
    serviceAccountId,
    provider: mountedGkeServiceAccountTokenProvider(tokenPath),
  },
});

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "Say hello from Google GKE workload identity federation.",
});

console.log(response.output_text);
```

```python
import os
from pathlib import Path

from openai import OpenAI
from openai.auth import SubjectTokenProvider

TOKEN_PATH = "/var/run/secrets/tokens/token"


def mounted_gke_service_account_token_provider(token_path: str) -> SubjectTokenProvider:
    def get_token() -> str:
        token = Path(token_path).read_text().strip()
        if not token:
            raise RuntimeError("The mounted GKE service account token file is empty.")
        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": mounted_gke_service_account_token_provider(TOKEN_PATH),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from Google GKE workload identity federation.",
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

type mountedGkeServiceAccountTokenProvider struct {
	path string
}

func (p mountedGkeServiceAccountTokenProvider) TokenType() auth.SubjectTokenType {
	return auth.SubjectTokenTypeJWT
}

func (p mountedGkeServiceAccountTokenProvider) GetToken(_ context.Context, _ auth.HTTPDoer) (string, error) {
	data, err := os.ReadFile(p.path)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-gke",
			Message:  "failed to read mounted GKE service account token",
			Cause:    err,
		}
	}

	token := strings.TrimSpace(string(data))
	if token == "" {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-gke",
			Message:  "mounted GKE service account token is empty",
		}
	}

	return token, nil
}

func main() {
	client := openai.NewClient(
		option.WithWorkloadIdentity(auth.WorkloadIdentity{
			IdentityProviderID: os.Getenv("OPENAI_IDENTITY_PROVIDER_ID"),
			ServiceAccountID:   os.Getenv("OPENAI_SERVICE_ACCOUNT_ID"),
			Provider: mountedGkeServiceAccountTokenProvider{
				path: tokenPath,
			},
		}),
	)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: openai.ChatModelGPT4_1Mini,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Say hello from Google GKE workload identity federation."),
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

public final class GoogleGkeWorkloadIdentityExample {
  private static final String TOKEN_PATH = "/var/run/secrets/tokens/token";

  private GoogleGkeWorkloadIdentityExample() {}

  static final class MountedGkeServiceAccountTokenProvider implements SubjectTokenProvider {
    private final Path tokenPath;

    MountedGkeServiceAccountTokenProvider(String tokenPath) {
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
            "google-gke", "failed to read mounted GKE service account token", e);
      }

      if (token.isEmpty()) {
        throw new SubjectTokenProviderException(
            "google-gke", "mounted GKE service account token is empty", null);
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
            .provider(new MountedGkeServiceAccountTokenProvider(TOKEN_PATH))
            .build();

    OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("gpt-5.6-terra")
            .input("Say hello from Google GKE workload identity federation.")
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

class MountedGkeServiceAccountTokenProvider
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
        message: "Mounted GKE service account token is empty",
        provider: "google-gke"
      )
    end
    token
  rescue SystemCallError => e
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to read mounted GKE service account token: #{e.message}",
      provider: "google-gke",
      cause: e
    )
  end
end

provider = MountedGkeServiceAccountTokenProvider.new(token_path: TOKEN_PATH)

workload_identity = OpenAI::Auth::WorkloadIdentity.new(
  identity_provider_id: ENV.fetch("OPENAI_IDENTITY_PROVIDER_ID"),
  service_account_id: ENV.fetch("OPENAI_SERVICE_ACCOUNT_ID"),
  provider: provider
)

client = OpenAI::Client.new(workload_identity: workload_identity)

response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Say hello from Google GKE workload identity federation."
)

puts(response.output_text)
```



## Google Cloud 最佳实践

- 为每个工作负载使用专用的 Google 服务账号。避免在不同服务或环境之间共享服务账号。
- 使用工作负载身份流程，而不是长期有效的服务账号密钥。对于可以使用元数据服务器身份令牌或 GKE Workload Identity 的工作负载，避免分发和轮换 JSON 密钥文件。
- 将身份范围限制在最小的实际工作负载边界内。为单个应用分离服务账号可提供更清晰的审计和最小权限访问。
- 谨慎使用基于属性的映射。尽可能优先使用服务账号主题声明等稳定标识符，而不是可变的元数据。
- 将生产项目和非生产项目分离。不同的项目降低了意外权限共享的风险，并简化了审计。
- 仅授予所需的 IAM 权限。将 Google 身份限制为仅授予工作负载所需的权限。
- 监控服务账号使用情况。意外的令牌交换可能表明配置漂移或工作负载受损。