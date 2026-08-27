# 为 Kubernetes 配置工作负载身份联合

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

通过将投射的 Kubernetes 服务账户令牌交换为短期 OpenAI 访问令牌，将 Kubernetes 用作工作负载身份提供程序。

对于 Codex，请使用此页面获取并检查投射令牌。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 以将 Codex 指向挂载的令牌文件。此页面上的服务账户映射和 SDK 示例适用于 OpenAI API。

## 设置 Kubernetes

本指南假定已启用 Kubernetes 服务账户令牌投影功能，该功能在现代 Kubernetes 版本中默认可用。OpenAI 工作负载身份联合要求使用兼容 OIDC 的投影服务账户令牌。不支持存储在 Secrets 中的旧版 Kubernetes 服务账户令牌。

为需要调用 OpenAI API 的工作负载使用一个 Kubernetes `ServiceAccount` 。如果你还没有，可以先创建它：

```bash
kubectl create serviceaccount openai-wif --namespace default
```

获取你的 Kubernetes 集群的 OIDC 签发者：

```bash
kubectl get --raw /.well-known/openid-configuration | jq -r .issuer
```

即使你上传了 JWKS 且 OpenAI 不对 OIDC 签发者执行 JWKS 发现，该签发者也必须与工作负载身份提供者中配置的签发者匹配。

获取集群的 JWKS 并保存返回的密钥集。在你配置工作负载身份提供者时会用到它：

```bash
kubectl get --raw /openid/v1/jwks
```

使用 OpenAI 期望的受众和适合你工作负载的过期时间配置投影的服务账户令牌。OpenAI 会验证令牌的签发者、签名、受众和过期时间。在此示例中，令牌文件被挂载到 `/var/run/secrets/tokens/token`，使用受众 `https://api.openai.com/v1`，并在 3600 秒后过期。如果投影令牌受众与 OpenAI 工作负载身份提供者受众匹配，你可以使用不同的受众：

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
        - name: ksa-token
          mountPath: /var/run/secrets/tokens
          readOnly: true
  volumes:
    - name: ksa-token
      projected:
        sources:
          - serviceAccountToken:
              path: token
              audience: "https://api.openai.com/v1"
              expirationSeconds: 3600
```

## 验证令牌

在配置工作负载身份联合之前，先在本地解码一个示例投影服务账户令牌并检查其声明。从已挂载投影令牌的运行中的 Pod 中检索令牌，并将其导出为 `TOKEN`:

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


此命令在不验证令牌签名的情况下解码 JWT 负载。对于生产令牌，请使用本地解码器，并避免将生产令牌粘贴到第三方工具中。

解码后的 Kubernetes 投影服务账户令牌将类似于：

```json
{
  "iss": "https://kubernetes.example.com",
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

使用解码后的负载来将你收到的令牌与OpenAI中配置的签发者、受众和映射值进行比较。大多数配置问题在 `iss`, `aud`，和 `sub` 声明中可见，然后再进行令牌交换。

## 设置工作负载身份联合

在 OpenAI 中为 Kubernetes 颁发者创建工作负载身份提供程序，然后添加一个服务账户映射，使其与投影令牌中的属性匹配。

先配置工作负载身份提供程序，再创建服务账户映射。

### 设置 Workload Identity Provider

1. **创建工作负载身份提供程序。** 将 **名称** 设置为唯一值，例如 `kubernetes-prod`。使用 **描述**，例如 `Production Kubernetes cluster`，以帮助管理员识别集群。

2. **设置发行方和受众。** 将 **OIDC 发行方 URL** 设置为 `kubectl get --raw /.well-known/openid-configuration | jq -r .issuer`。返回的发行方。此值必须与投影令牌中的 `iss` 声明匹配。将 **受众** 设置为投影服务账户令牌卷上配置的相同不透明受众字符串。在此示例中，该值为 `https://api.openai.com/v1`.

3. **上传 Kubernetes JWKS。** 启用 **使用上传的 JWKS 进行令牌验证**，然后设置 **JWKS JSON** 添加到输出中 `kubectl get --raw /openid/v1/jwks`。OpenAI 使用此公钥集合来验证投射的 Kubernetes 服务账户令牌。上传完整的密钥集合，包括周围的 `keys`.

   > **注意：** 对于自托管的 Kubernetes 集群，OpenAI 仅支持本地 JWKS 模式。上传集群返回的 JWKS；OpenAI 不会对配置的颁发者执行 OIDC 发现。OpenAI 仍会将配置的颁发者与 `iss` 令牌中的字段进行比较。

   如果集群轮换服务账户签名密钥，请更新 Workload Identity Provider 配置中上传的 JWKS。由配置的 JWKS 中不存在的密钥签名的令牌将被拒绝。如果 JWKS 包含多个活动公钥，请包含完整的 `keys` 数组。

4. **仅当需要派生映射属性时，才添加属性转换。** 原始令牌声明，如 `sub`, `aud`，以及 `iss` 可以直接用于映射断言。如果你计划匹配转换后的属性而不是原始令牌声明，仪表板会自动应用 `openai.` 前缀；例如，输入 `workload_subject` 并使用表达式 `assertion.sub` 来创建 `openai.workload_subject`。已经以 `openai.` 开头的原始令牌声明将被忽略，用于 `openai.` 映射键，除非配置了匹配的转换。

### 设置服务账号映射

1. **创建服务账号映射。** 将 **名称** 设置为工作负载身份提供程序中的唯一值，例如 `openai-mapping-kubernetes`。使用 **描述**，例如 `Workload Identity Provider Mapping for Kubernetes Workloads`，来说明哪些工作负载可以使用该映射。

2. **匹配 Kubernetes 服务账号主题。** 将 **键** 设置为 `sub` ，并将 **值** 设置为 `system:serviceaccount:default:openai-wif`。对于 Kubernetes 服务账号，主题格式为 `system:serviceaccount:<namespace>:<service-account-name>`.

3. **选择 OpenAI 目标。** 将 **项目** 设置为拥有目标服务账号的 OpenAI 项目。将 **服务账号** 到 OpenAI 服务账号，Kubernetes 工作负载可以使用该账号，例如 `kubernetes-prod-openai-wif`。请查看 `Create a new service account in this project` 如果你希望为此映射创建新的服务账号，而非复用现有账号。

4. **如有需要，收窄 API 权限。** 选择合适的 **权限** ，例如 `api.model.request` 和 `api.vector_store.read` ，以进一步收窄从此映射铸造的访问令牌。将权限留空可避免添加 WIF 特定的作用域限制；该令牌仍会以映射的服务账号进行授权。

## 在代码中使用令牌

配置你的 OpenAI SDK 客户端，读取投射的 Kubernetes 令牌，并将其换取为 OpenAI 签发的访问令牌。

使用已挂载的令牌路径，例如 `/var/run/secrets/tokens/token`，作为 SDK 工作负载身份联合提供者的主题令牌来源。SDK 将该 Kubernetes 令牌换为 OpenAI 签发的访问令牌，并使用该 OpenAI 令牌来认证 API 请求。

以下示例使用自定义的主题令牌提供者初始化一个 OpenAI 客户端。该提供者从已挂载的文件路径读取投射的 Kubernetes 服务账户令牌，并将其用作工作负载身份联合的主题令牌。

从 Kubernetes 投射的服务账户令牌进行认证

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
function mountedServiceAccountTokenProvider(path) {
  return {
    tokenType: "jwt",
    getToken: async () => {
      const token = (await readFile(path, "utf8")).trim();
      if (!token) {
        throw new Error("The mounted service account token file is empty.");
      }
      return token;
    },
  };
}

const client = new OpenAI({
  workloadIdentity: {
    identityProviderId,
    serviceAccountId,
    provider: mountedServiceAccountTokenProvider(tokenPath),
  },
});

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "Say hello from Kubernetes workload identity federation.",
});

console.log(response.output_text);
```

```python
import os
from pathlib import Path

from openai import OpenAI
from openai.auth import SubjectTokenProvider

TOKEN_PATH = "/var/run/secrets/tokens/token"


def mounted_service_account_token_provider(token_path: str) -> SubjectTokenProvider:
    def get_token() -> str:
        token = Path(token_path).read_text().strip()
        if not token:
            raise RuntimeError("The mounted service account token file is empty.")
        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": mounted_service_account_token_provider(TOKEN_PATH),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from Kubernetes workload identity federation.",
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

type mountedServiceAccountTokenProvider struct {
	path string
}

func (p mountedServiceAccountTokenProvider) TokenType() auth.SubjectTokenType {
	return auth.SubjectTokenTypeJWT
}

func (p mountedServiceAccountTokenProvider) GetToken(ctx context.Context, _ auth.HTTPDoer) (string, error) {
	data, err := os.ReadFile(p.path)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "kubernetes",
			Message:  "failed to read mounted service account token",
			Cause:    err,
		}
	}

	token := strings.TrimSpace(string(data))
	if token == "" {
		return "", &auth.SubjectTokenProviderError{
			Provider: "kubernetes",
			Message:  "mounted service account token is empty",
		}
	}

	return token, nil
}

func main() {
	client := openai.NewClient(
		option.WithWorkloadIdentity(auth.WorkloadIdentity{
			IdentityProviderID: os.Getenv("OPENAI_IDENTITY_PROVIDER_ID"),
			ServiceAccountID:   os.Getenv("OPENAI_SERVICE_ACCOUNT_ID"),
			Provider: mountedServiceAccountTokenProvider{
				path: tokenPath,
			},
		}),
	)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: openai.ChatModelGPT4_1Mini,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Say hello from Kubernetes workload identity federation."),
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

public final class KubernetesWorkloadIdentityExample {
  private static final String TOKEN_PATH = "/var/run/secrets/tokens/token";

  private KubernetesWorkloadIdentityExample() {}

  static final class MountedServiceAccountTokenProvider implements SubjectTokenProvider {
    private final Path tokenPath;

    MountedServiceAccountTokenProvider(String tokenPath) {
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
            "kubernetes", "failed to read mounted service account token", e);
      }

      if (token.isEmpty()) {
        throw new SubjectTokenProviderException(
            "kubernetes", "mounted service account token is empty", null);
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
            .provider(new MountedServiceAccountTokenProvider(TOKEN_PATH))
            .build();

    OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("gpt-5.6-terra")
            .input("Say hello from Kubernetes workload identity federation.")
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

class MountedServiceAccountTokenProvider
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
        message: "Mounted service account token is empty",
        provider: "kubernetes"
      )
    end
    token
  rescue SystemCallError => e
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to read mounted service account token: #{e.message}",
      provider: "kubernetes",
      cause: e
    )
  end
end

provider = MountedServiceAccountTokenProvider.new(token_path: TOKEN_PATH)

workload_identity = OpenAI::Auth::WorkloadIdentity.new(
  identity_provider_id: ENV.fetch("OPENAI_IDENTITY_PROVIDER_ID"),
  service_account_id: ENV.fetch("OPENAI_SERVICE_ACCOUNT_ID"),
  provider: provider
)

client = OpenAI::Client.new(workload_identity: workload_identity)

response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Say hello from Kubernetes workload identity federation."
)

puts(response.output_text)
```


## Kubernetes 最佳实践

- 使用稳定的 OIDC 签发者。签发者 URL 必须与投射的服务账户令牌中的声明匹配 `iss` ，并且应在集群升级和维护操作期间保持稳定。
- 谨慎保护签名密钥。任何能访问集群服务账户签名密钥的人都可以铸造可能被 OpenAI 接受的令牌。
- 为 OpenAI 集成使用专用服务账户。避免复用也用于无关基础设施或应用访问的服务账户。
- 保持上传的 JWKS 为最新。在本地 JWKS 模式下，OpenAI 使用配置的 JWKS 来验证工作负载身份令牌，因此在轮换到新的签名密钥之前，请更新 Workload Identity Provider。
- 尽量降低自定义声明复杂度。优先匹配标准声明，如 `sub` 和 `aud`，或直接由这些声明推导出的转换属性。
- 将命名空间所有权视为安全模型的一部分。如果命名空间管理员可以创建服务账户，请确保映射范围设置适当，以防止意外的权限提升。
- 监控签发者和签名密钥变更。在未更新 Workload Identity Provider JWKS 的情况下轮换签名密钥会导致令牌交换失败。