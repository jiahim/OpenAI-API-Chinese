# 为 Kubernetes 配置工作负载身份联合

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获得该页面的 Markdown 版本。

通过将 Kubernetes 投影的服务账户令牌交换为短期 OpenAI 访问令牌，将 Kubernetes 用作工作负载身份提供方。

对于 Codex，使用此页面获取并检查投影令牌。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 以使 Codex 指向已挂载的令牌文件。本页面上的服务账户映射和 SDK 示例适用于 OpenAI API。

## Setting up Kubernetes

本指南假定 Kubernetes 服务账号令牌投射（service account token projection）已启用，这在现代 Kubernetes 版本中是默认提供的。OpenAI 工作负载身份联合（workload identity federation）需要兼容 OIDC 的投射式服务账号令牌。不支持存储在 Secrets 中的旧版 Kubernetes 服务账号令牌。

为需要调用 OpenAI API 的工作负载使用一个 Kubernetes `ServiceAccount` 。如果你还没有，请创建一个：

```bash
kubectl create serviceaccount openai-wif --namespace default
```

获取你的 Kubernetes 集群的 OIDC 颁发者（issuer）：

```bash
kubectl get --raw /.well-known/openid-configuration | jq -r .issuer
```

即使你上传了 JWKS 并且 OpenAI 不会针对 OIDC 颁发者执行 JWKS 发现，此颁发者也必须与 Workload Identity Provider 中配置的颁发者一致。

获取集群 JWKS 并保存返回的密钥集。在配置 Workload Identity Provider 时你需要用到它：

```bash
kubectl get --raw /openid/v1/jwks
```

使用 OpenAI 期望的受众（audience）和适合你工作负载的过期时间来配置投射式服务账号令牌。OpenAI 会校验令牌的颁发者、签名、受众和过期时间。在本示例中，令牌文件挂载在 `/var/run/secrets/tokens/token`，使用的受众为 `https://api.openai.com/v1`，并在 3600 秒后过期。如果投射令牌的受众与 OpenAI Workload Identity Provider 的受众一致，你也可以使用其他受众：

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

在配置工作负载身份联合之前，请在本地解码一个示例的投射服务账户令牌并检查其声明。在已挂载投射令牌的运行中 Pod 中，检索该令牌并将其导出为 `TOKEN`:

```bash
TOKEN=$(kubectl exec -n default openai-wif-app -- cat /var/run/secrets/tokens/token)
export TOKEN
```

然后运行以下脚本：

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


此命令会在不验证令牌签名的情况下解码 JWT 负载。生产环境令牌请使用本地解码器，避免将生产环境令牌粘贴到第三方工具中。

解码后的 Kubernetes 投射服务账户令牌类似如下：

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

使用解码后的负载，比对你收到的令牌与在 OpenAI 中配置的 issuer、audience 和 mapping 值。在交换令牌之前，大多数配置问题都会体现在 `iss`, `aud`，以及 `sub` 声明中。

## 设置工作负载身份联合

在 OpenAI 中为 Kubernetes 颁发者创建一个 Workload Identity Provider，然后添加一个服务账号映射，以匹配来自投影令牌（projected token）的属性。

先配置 Workload Identity Provider，再创建服务账号映射。

### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 设置 **Name** 为唯一值，例如 `kubernetes-prod`。使用 **Description**，例如 `Production Kubernetes cluster`，以帮助管理员识别该集群。

2. **设置 issuer 和 audience。** 设置 **OIDC Issuer URL** 为以下命令返回的 issuer： `kubectl get --raw /.well-known/openid-configuration | jq -r .issuer`。此值必须与 `iss` 声明匹配，位于 projected token 中。设置 **Audience** 为 projected service account token volume 上配置的同一个不透明 audience 字符串。在本示例中，该值为 `https://api.openai.com/v1`.

3. **上传 Kubernetes JWKS。** 启用 **Use uploaded JWKS for token verification**，然后设置 **JWKS JSON** 到输出中的 `kubectl get --raw /openid/v1/jwks`。OpenAI 使用该公钥集来验证投射的 Kubernetes 服务账户令牌。上传完整的密钥集,包括其周围的 `keys`.

   > **注意:** 对于自托管 Kubernetes 集群,OpenAI 仅支持本地 JWKS 模式。上传你的集群返回的 JWKS;OpenAI 不会针对已配置的 issuer 执行 OIDC 发现。OpenAI 仍会将已配置的 issuer 与令牌中的 `iss` 字段进行比较。

   如果你的集群轮换服务账户签名密钥,请在 Workload Identity Provider 配置中更新已上传的 JWKS。使用未在已配置 JWKS 中出现的密钥签名的令牌将被拒绝。如果 JWKS 包含多个活跃的公钥,请包含完整的 `keys` 数组。

4. **仅在需要派生映射属性时才添加属性转换。** 原始令牌声明,例如 `sub`, `aud`、和 `iss` 可以直接在映射断言中使用。如果你计划基于转换后的属性(而非原始令牌声明)进行匹配,控制面板会自动应用 `openai.` 前缀;例如,输入 `workload_subject` 并附带表达式 `assertion.sub` 以创建 `openai.workload_subject`。已经以 `openai.` 开头的原始令牌声明会在 `openai.` 映射键时被忽略,除非配置了匹配的转换。

### 设置服务账户映射

1. **创建服务账号映射。** 设置 **Name** 为 Workload Identity Provider 内的唯一值，例如 `openai-mapping-kubernetes`。使用 **Description**，例如 `Workload Identity Provider Mapping for Kubernetes Workloads`，以说明哪些工作负载可以使用该映射。

2. **匹配 Kubernetes 服务账号主体。** 设置 **Key** 为 `sub` ， **Value** 为 `system:serviceaccount:default:openai-wif`。对于 Kubernetes 服务账号，主体格式为 `system:serviceaccount:<namespace>:<service-account-name>`.

3. **选择 OpenAI 目标。** 设置 **Project** 为拥有目标服务账号的 OpenAI 项目。将 **Service account** 设置为 Kubernetes 工作负载可以使用的 OpenAI 服务账号，例如 `kubernetes-prod-openai-wif`。勾选 `Create a new service account in this project` ，如果你希望为此映射新建一个服务账号，而不是复用现有账号。

4. **根据需要收窄 API 权限。** 选择合适的 **Permissions** ，例如 `api.model.request` ， `api.vector_store.read` 以进一步收窄基于此映射签发的访问令牌。留空权限可避免添加特定于 WIF 的范围限制；该令牌仍会以映射的服务帐号身份授权。

## Using the token in code

配置你的 OpenAI SDK 客户端，以读取已投射的 Kubernetes 令牌并将其交换为 OpenAI 颁发的访问令牌。

将已挂载的令牌路径（例如 `/var/run/secrets/tokens/token`）用作 SDK 工作负载身份联合提供方的主体令牌来源。SDK 会将该 Kubernetes 令牌交换为 OpenAI 颁发的访问令牌，并使用该 OpenAI 令牌对 API 请求进行身份验证。

以下示例演示如何使用自定义主体令牌提供方初始化 OpenAI 客户端。该提供方从已挂载的文件路径读取已投射的 Kubernetes 服务账户令牌，并将其用作工作负载身份联合的主体令牌。

使用 Kubernetes 投射的服务账户令牌进行身份验证

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

- 使用稳定的 OIDC 颁发者。颁发者 URL 必须与预期的服务账号令牌 `iss` 声明匹配，并在集群升级和维护操作期间保持稳定。
- 妥善保护签名密钥。任何能够访问集群服务账号签名密钥的人员都可以生成可能被 OpenAI 接受的令牌。
- 为 OpenAI 集成使用专用的服务账号。避免重复使用同时用于无关基础设施或应用程序访问的服务账号。
- 保持上传的 JWKS 为最新。OpenAI 使用配置的 JWKS 在本地 JWKS 模式下验证工作负载身份令牌，因此请在轮换到新签名密钥之前更新 Workload Identity Provider。
- 尽量降低自定义声明的复杂性。建议匹配标准声明，例如 `sub` ， `aud`，或直接由这些声明派生的转换后的属性。
- 将命名空间所有权视为安全模型的一部分。如果命名空间管理员可以创建服务账号，请确保映射的作用范围设置恰当，以防止意外的权限提升。
- 监控颁发者和签名密钥的更改。在不更新 Workload Identity Provider JWKS 的情况下轮换签名密钥可能导致令牌交换失败。