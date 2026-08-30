# 为 SPIFFE 配置工作负载身份联合

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取对应文档页面的 Markdown 版本。

使用 SPIFFE 作为工作负载身份提供方，通过交换 SPIFFE JWT-SVID 来获取短时OpenAI 访问令牌。这使得经 SPIRE 或其他兼容 SPIFFE 的身份提供方认证的工作负载能够调用 OpenAI API，而无需存储长期有效的 API 密钥。

对于 Codex，使用本页获取并检查 JWT-SVID。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 以将该令牌写入文件并指向 Codex。本页中的服务账号映射和 SDK 示例同样适用于 OpenAI API。

OpenAI 支持可作为 JWT 主体令牌进行验证的 SPIFFE JWT-SVID，其包含 issuer、audience、expiration、issued-at 时间戳以及由 JWKS 支持的签名。OpenAI 不支持将 SPIFFE X.509-SVID 作为工作负载身份联合的主体令牌。

JWT-SVID 规范要求提供 `sub`, `aud`，以及 `exp` 声明。要将 JWT-SVID 用于 OpenAI，该令牌还必须包含 `iss` 和 `iat` 声明以及一个 `kid` 请求头，以便 OpenAI 能够根据工作负载身份提供方配置验证该令牌。

JWT-SVID 不是 OpenID Connect ID token。SPIRE OIDC 发现服务提供发现元数据和 JWKS 密钥，使 OpenAI 能够验证 JWT-SVID；它不会改变令牌的 SPIFFE 语义，也不需要 OIDC 登录流程。

有关 SPIFFE 术语和令牌要求，请参阅 SPIFFE [JWT-SVID 规范](https://spiffe.io/docs/latest/spiffe-specs/jwt-svid/) 和 [Workload API 规范](https://spiffe.io/docs/latest/spiffe-specs/spiffe_workload_api/).

## Setting up SPIFFE

将你的 SPIFFE 提供方配置为向需要调用 OpenAI API 的工作负载签发 JWT-SVID。这些说明使用了 SPIRE 术语，但相同的 OpenAI 配置同样适用于任何与 SPIFFE 兼容、且所签发的 JWT-SVID 带有 OpenAI 可验证的 issuer 和 JWKS 签名材料的提供方。

你的 SPIFFE 配置必须提供：

- 工作负载的稳定 SPIFFE ID，例如 `spiffe://example.org/ns/production/sa/openai-wif`.
- 专用于 OpenAI 访问的单一 JWT-SVID 受众，例如 `https://api.openai.com/v1` 或你选择的其他不透明值。
- JWT-SVID 中用于 OpenAI 验证的 JWT 颁发者 URL 声明 `iss` 。
- JWT-SVID 签名密钥对应的公共 JWKS，可通过 OIDC 发现机制获取或上传 JWKS。
- 在工作负载侧从 SPIFFE Workload API 获取最新 JWT-SVID 的方式。

audience 是一个精确匹配的标识符，不一定是接收 JWT-SVID 的端点。你可以使用 `https://api.openai.com/v1` 或其他特定于服务的值，只要 SPIFFE Workload API 请求和 OpenAI 提供方配置相匹配。

如果可能，请通过你的 SPIRE OIDC Discovery Provider 公开 SPIFFE 颁发者。配置 SPIRE Server `jwt_issuer` 和 OIDC Discovery Provider `jwt_issuer` 为同一个 HTTPS 颁发者 URL，你将在 OpenAI 中配置该 URL。

在 SPIRE Server 配置中：

```hcl
server {
  trust_domain = "example.org"
  jwt_issuer   = "https://spire-oidc.example.org"
}
```

在独立的 SPIRE OIDC Discovery Provider 配置中：

```hcl
# Relevant issuer fields only
domains    = ["spire-oidc.example.org"]
jwt_issuer = "https://spire-oidc.example.org"
```

OIDC Discovery Provider 配置还需要一个密钥材料来源，例如 `server_api`, `workload_api`，或 `file`，以及一个服务机制，例如 ACME、TLS 证书或 Unix 套接字。请参阅 [SPIRE OIDC Discovery Provider 文档](https://github.com/spiffe/spire/tree/main/support/oidc-discovery-provider) 了解完整的配置选项。

SPIFFE 信任域和 JWT 颁发者是不同的概念。在本示例中，JWT-SVID subject 是位于 `example.org` 信任域中的 SPIFFE ID，而颁发者是 HTTPS 颁发者 URL：

```json
{
  "sub": "spiffe://example.org/ns/production/sa/openai-wif",
  "iss": "https://spire-oidc.example.org"
}
```

SPIRE OIDC Discovery Provider 提供 OIDC 发现文档和 JWKS 端点，OpenAI 可以在 **使用上传的 JWKS 进行令牌验证** 被禁用时使用它们。

如果 OpenAI 无法访问你的颁发者发现端点，请改用上传的 JWKS 模式。在该模式下，OpenAI 仍会将 Workload Identity Provider 颁发者与 JWT-SVID `iss` claim 进行比较，但会根据你在 Workload Identity Provider 上保存的 JWKS JSON 来验证签名。

> **注意：** SPIFFE JWT-SVID 规范将 JWT 头部设为可选，但 `kid` OpenAI 要求 JWT subject 令牌必须包含 `kid` header，以便从已配置的 JWKS 中选择签名密钥。如果你的 SPIFFE 提供方可以省略 `kid`，将其配置为包含一个用于 OpenAI 工作负载身份联合的凭据。

要从可以调用 SPIFFE Workload API 的工作负载中检查 JWT-SVID，请为将在 OpenAI 中配置的同一个 audience 请求一个 SVID。请在与应用程序相同的工作负载上下文中运行此命令，因为 Workload API 授权依赖于调用进程的身份。

```bash
TOKEN=$(spire-agent api fetch jwt \
  -socketPath /run/spire/sockets/agent.sock \
  -audience "https://api.openai.com/v1" | sed -n '2p')
export TOKEN
```

如果你的工作负载具有多个 SPIFFE ID，请请求特定的身份：

```bash
TOKEN=$(spire-agent api fetch jwt \
  -socketPath /run/spire/sockets/agent.sock \
  -spiffeID "spiffe://example.org/ns/production/sa/openai-wif" \
  -audience "https://api.openai.com/v1" | sed -n '2p')
export TOKEN
```

## 验证令牌

在配置 workload identity federation 之前，将 JWT-SVID 导出为 `TOKEN`，然后在本地运行此脚本以检查其 header 和 claims：

```python
import base64
import json
import os

parts = os.environ["TOKEN"].split(".")
if len(parts) != 3:
    raise ValueError("Expected a compact JWT with three segments")


def decode(segment):
    segment += "=" * (-len(segment) % 4)
    return json.loads(base64.urlsafe_b64decode(segment))


print("Header:")
print(json.dumps(decode(parts[0]), indent=2))
print("\nPayload:")
print(json.dumps(decode(parts[1]), indent=2))
```


该命令在不验证令牌签名的情况下解码 JWT。在生产环境中请使用本地解码器，并避免将生产令牌粘贴到第三方工具中。

解码后的 SPIFFE JWT-SVID 看起来类似：

```json
{
  "alg": "ES256",
  "kid": "jwt-svid-key-1"
}
```

```json
{
  "iss": "https://spire-oidc.example.org",
  "aud": ["https://api.openai.com/v1"],
  "sub": "spiffe://example.org/ns/production/sa/openai-wif",
  "iat": 1716235422,
  "exp": 1716235722
}
```

在交换令牌之前，使用解码后的令牌将你收到的令牌与 OpenAI 配置进行比较。请检查 `alg` 和 `kid` header 中的相应字段，以及 `iss`, `aud`, `sub`, `iat`，以及 `exp` payload 中的相应字段。具体的 `alg` 值取决于你的 SPIRE Server JWT signing-key 配置。

## 设置工作负载身份联合

在 OpenAI 中为 SPIFFE JWT-SVID 颁发者创建一个工作负载身份提供方（Workload Identity Provider），然后添加一个与你所信任的 SPIFFE ID 相匹配的服务账号映射。

### 配置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 将 **Name** 设置为唯一值，例如 `spiffe-prod`。使用 **Description**，例如 `Production SPIFFE workloads`，以帮助管理员识别该 Provider。

2. **设置 issuer 和 audience。** 将 **OIDC Issuer URL** 为 JWT-SVID 的 `iss` 声明的确切值，例如 `https://spire-oidc.example.org`。将 **Audience** 设置为 SPIFFE Workload API 所请求的 audience 值。在本示例中，该值为 `https://api.openai.com/v1`.

3. **选择 JWKS 来源。** 保留 **Use uploaded JWKS for token verification** 处于禁用状态当 OpenAI 可以访问你的 SPIRE OIDC Discovery Provider 时。OpenAI 使用 OIDC discovery 以及发现的 JWKS 来验证 JWT-SVID 签名。

   如果 OpenAI 无法访问该 issuer，请启用 **Use uploaded JWKS for token verification**，然后将 **JWKS JSON** 设置为用于 JWT-SVID 签名的公钥集。上传完整的公钥 JWKS 对象，包括外层的 `keys` 数组。请勿包含私钥材料。

4. **仅在需要派生映射属性时添加属性转换。** 直接从 `sub`。进行映射时无需使用属性转换。仅当需要从一个或多个令牌声明派生映射值时才使用它们。参阅 [工作负载身份联合主指南](https://developers.openai.com/api/docs/guides/workload-identity-federation#transform-token-claims-with-cel) 了解转换行为。

### 设置服务账户映射

1. **创建一个服务账号映射。** 将 **Name** 映射到 Workload Identity Provider 内的唯一值，例如 `production-openai-wif`。使用 **Description**，例如 `Production SPIFFE workload for OpenAI API access`，以说明哪些工作负载可以使用该映射。

2. **匹配 SPIFFE ID。** 将 **Key** 为 `sub` ，Value **为** 工作负载的 SPIFFE ID，例如 `spiffe://example.org/ns/production/sa/openai-wif`.

   对于特权工作负载，应优先使用精确 SPIFFE ID 匹配。仅在该前缀下的每个 SPIFFE ID 都应能够生成 OpenAI 访问令牌时，才使用尾部通配符。例如， `spiffe://example.org/ns/production/sa/*` 允许任何匹配的生产环境服务账号路径。

3. **选择 OpenAI 目标。** 将 **Project** 设置为拥有目标服务账号的 OpenAI 项目；将 **Service account** 设置为 SPIFFE 工作负载可以使用的 OpenAI 服务账号，例如 `spiffe-prod-openai-wif`。勾选 `Create a new service account in this project` 可为此映射新建一个服务账号，而不是复用现有服务账号。

4. **根据需要收窄 API 权限。** 选择适当的 **Permissions** such as `api.model.request` ，Value `api.vector_store.read` 以进一步收窄从此映射生成的访问令牌。保持权限留空可避免添加 WIF 专属的范围限制；该令牌仍会以所映射服务账号的身份授权。

## 在代码中使用 token

配置你的 OpenAI SDK 客户端，使用新的 SPIFFE JWT-SVID 换取 OpenAI 颁发的访问令牌。

下面的 SDK 示例假设你的 SPIFFE 集成会刷新 JWT-SVID 并将其写入 `/var/run/spiffe/openai.jwt`。请将该文件设为仅对工作负载可读。由于 JWT-SVID 生命周期较短，请在令牌过期前刷新该文件。或者，尽可能在 subject token provider 中使用特定语言的 SPIFFE 库直接从 SPIFFE Workload API 获取 JWT-SVID，以避免令牌文件过期。

在 `OPENAI_IDENTITY_PROVIDER_ID` 和 `OPENAI_SERVICE_ACCOUNT_ID` 中设置。工作负载环境中的令牌文件包含外部 subject token。 `OPENAI_IDENTITY_PROVIDER_ID` 标识 OpenAI 工作负载身份提供方，而 `OPENAI_SERVICE_ACCOUNT_ID` 标识目标 OpenAI 服务账号。OpenAI 然后会根据令牌声明为该提供方和服务账号查找匹配的映射。

使用 SPIFFE JWT-SVID 进行身份验证

```javascript
import { readFile } from "node:fs/promises";
import OpenAI from "openai";

const tokenPath = "/var/run/spiffe/openai.jwt";
const identityProviderId = process.env.OPENAI_IDENTITY_PROVIDER_ID;
const serviceAccountId = process.env.OPENAI_SERVICE_ACCOUNT_ID;

if (!identityProviderId || !serviceAccountId) {
  throw new Error(
    "Set OPENAI_IDENTITY_PROVIDER_ID and OPENAI_SERVICE_ACCOUNT_ID"
  );
}

/** @returns {import("openai/auth/index").SubjectTokenProvider} */
function spiffeJwtSvidProvider(path) {
  return {
    tokenType: "jwt",
    getToken: async () => {
      const token = (await readFile(path, "utf8")).trim();
      if (!token) {
        throw new Error("The SPIFFE JWT-SVID file is empty.");
      }
      return token;
    },
  };
}

const client = new OpenAI({
  workloadIdentity: {
    identityProviderId,
    serviceAccountId,
    provider: spiffeJwtSvidProvider(tokenPath),
  },
});

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "Say hello from SPIFFE workload identity federation.",
});

console.log(response.output_text);
```

```python
import os
from pathlib import Path

from openai import OpenAI
from openai.auth import SubjectTokenProvider

TOKEN_PATH = "/var/run/spiffe/openai.jwt"


def spiffe_jwt_svid_provider(token_path: str) -> SubjectTokenProvider:
    def get_token() -> str:
        token = Path(token_path).read_text().strip()
        if not token:
            raise RuntimeError("The SPIFFE JWT-SVID file is empty.")
        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": spiffe_jwt_svid_provider(TOKEN_PATH),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from SPIFFE workload identity federation.",
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

const tokenPath = "/var/run/spiffe/openai.jwt"

type spiffeJWTSVIDProvider struct {
	path string
}

func (p spiffeJWTSVIDProvider) TokenType() auth.SubjectTokenType {
	return auth.SubjectTokenTypeJWT
}

func (p spiffeJWTSVIDProvider) GetToken(ctx context.Context, _ auth.HTTPDoer) (string, error) {
	data, err := os.ReadFile(p.path)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "spiffe",
			Message:  "failed to read SPIFFE JWT-SVID",
			Cause:    err,
		}
	}

	token := strings.TrimSpace(string(data))
	if token == "" {
		return "", &auth.SubjectTokenProviderError{
			Provider: "spiffe",
			Message:  "SPIFFE JWT-SVID file is empty",
		}
	}

	return token, nil
}

func main() {
	client := openai.NewClient(
		option.WithWorkloadIdentity(auth.WorkloadIdentity{
			IdentityProviderID: os.Getenv("OPENAI_IDENTITY_PROVIDER_ID"),
			ServiceAccountID:   os.Getenv("OPENAI_SERVICE_ACCOUNT_ID"),
			Provider: spiffeJWTSVIDProvider{
				path: tokenPath,
			},
		}),
	)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: openai.ChatModelGPT4_1Mini,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Say hello from SPIFFE workload identity federation."),
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

public final class SpiffeWorkloadIdentityExample {
  private static final String TOKEN_PATH = "/var/run/spiffe/openai.jwt";

  private SpiffeWorkloadIdentityExample() {}

  static final class SpiffeJwtSvidProvider implements SubjectTokenProvider {
    private final Path tokenPath;

    SpiffeJwtSvidProvider(String tokenPath) {
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
        throw new SubjectTokenProviderException("spiffe", "failed to read SPIFFE JWT-SVID", e);
      }

      if (token.isEmpty()) {
        throw new SubjectTokenProviderException("spiffe", "SPIFFE JWT-SVID file is empty", null);
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
            .provider(new SpiffeJwtSvidProvider(TOKEN_PATH))
            .build();

    OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("gpt-5.6-terra")
            .input("Say hello from SPIFFE workload identity federation.")
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

TOKEN_PATH = "/var/run/spiffe/openai.jwt"

class SpiffeJWTSVIDProvider
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
        message: "SPIFFE JWT-SVID file is empty",
        provider: "spiffe"
      )
    end
    token
  rescue SystemCallError => e
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to read SPIFFE JWT-SVID: #{e.message}",
      provider: "spiffe",
      cause: e
    )
  end
end

provider = SpiffeJWTSVIDProvider.new(token_path: TOKEN_PATH)

workload_identity = OpenAI::Auth::WorkloadIdentity.new(
  identity_provider_id: ENV.fetch("OPENAI_IDENTITY_PROVIDER_ID"),
  service_account_id: ENV.fetch("OPENAI_SERVICE_ACCOUNT_ID"),
  provider: provider
)

client = OpenAI::Client.new(workload_identity: workload_identity)

response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Say hello from SPIFFE workload identity federation."
)

puts(response.output_text)
```


## SPIFFE 最佳实践

- 使用 JWT-SVID 进行 OpenAI 工作负载身份联邦。X.509-SVID 适用于双向 TLS，但不被 OpenAI 令牌交换端点接受。
- 为 OpenAI 访问使用单一专用受众。避免使用诸如整个信任域或环境名称之类的宽泛受众。
- 尽可能匹配精确的 SPIFFE ID。仅在有意共享的信任边界中使用通配符映射。
- 保持较短的 JWT-SVID 生命周期，以降低持有者令牌重放风险。OpenAI 访问令牌的生命周期永远不会超过用于交换的外部主体令牌。
- 谨慎轮换签名密钥。在轮换窗口期内通过 OIDC 发现同时发布新旧公钥，或在用新密钥签发 JWT-SVID 之前更新已上传的公钥 JWKS `kid`.
- 保持 SPIRE Server 与工作负载时钟同步。显著的时钟偏差可能导致原本有效的 JWT-SVID 被视为尚未生效、过旧或已过期而被拒绝。
- 保护 SPIFFE Workload API 套接字。能够获取某个工作负载 JWT-SVID 的进程可以尝试将其交换为 OpenAI 访问权限。
- 将 OpenAI 服务账号边界与你的应用和环境权限边界对齐。不要在无关的 SPIFFE 工作负载之间共享高权限服务账号。
- 监控发行方、受众、签名密钥以及映射不匹配导致的令牌交换失败。