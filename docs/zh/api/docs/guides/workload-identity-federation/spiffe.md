# 为 SPIFFE 配置工作负载身份联合

> 查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后添加 `.md` 来获取。

通过将 SPIFFE JWT-SVID 交换为短期 OpenAI 访问令牌，将 SPIFFE 用作工作负载身份提供程序。这允许由 SPIRE 或其他兼容 SPIFFE 的身份提供程序认证的工作负载调用 OpenAI API，而无需存储长期 API 密钥。

对于 Codex，使用此页面获取和检查 JWT-SVID。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 将该令牌写入文件并将 Codex 指向它。此页面上的服务账户映射和 SDK 示例适用于 OpenAI API。

OpenAI 支持可验证为 JWT 主题令牌的 SPIFFE JWT-SVID，这些令牌包含签发者、受众、过期时间、签发时间和 JWKS 支持的签名。OpenAI 不支持将 SPIFFE X.509-SVID 作为工作负载身份联合主题令牌。

JWT-SVID 规范要求 `sub`, `aud`，和 `exp` 声明。要将 JWT-SVID 与 OpenAI 一起使用，令牌还必须包含 `iss` 和 `iat` 声明以及 `kid` 头，以便 OpenAI 可以针对工作负载身份提供程序配置验证令牌。

JWT-SVID 不是 OpenID Connect ID 令牌。SPIRE OIDC 发现提供程序提供发现元数据和 JWKS 密钥，以便 OpenAI 可以验证 JWT-SVID；它不会改变令牌的 SPIFFE 语义，也不需要 OIDC 登录流程。

有关 SPIFFE 术语和令牌要求，请参阅 SPIFFE [JWT-SVID 规范](https://spiffe.io/docs/latest/spiffe-specs/jwt-svid/) 和 [工作负载 API 规范](https://spiffe.io/docs/latest/spiffe-specs/spiffe_workload_api/).

## 设置 SPIFFE

配置你的 SPIFFE 提供程序，为需要调用 OpenAI API 的工作负载签发 JWT-SVID。这些说明使用 SPIRE 术语，但相同的 OpenAI 配置适用于任何与 SPIFFE 兼容的提供程序，只要其签发的 JWT-SVID 具有 OpenAI 能够验证的发行者和 JWKS 签名材料。

你的 SPIFFE 设置必须提供：

- 工作负载的稳定 SPIFFE ID，例如 `spiffe://example.org/ns/production/sa/openai-wif`.
- 专用于 OpenAI 访问的单个 JWT-SVID 受众，例如 `https://api.openai.com/v1` 或你选择的其他不透明值。
- 出现在 JWT-SVID 中的 JWT 签发者 URL `iss` 声明，供 OpenAI 验证。
- JWT-SVID 签名密钥的公共 JWKS，可通过 OIDC 发现或上传的 JWKS 获取。
- 从 SPIFFE Workload API 获取新 JWT-SVID 的工作负载端方式。

受众是一个精确匹配的标识符，不一定是要接收 JWT-SVID 的端点。你可以使用 `https://api.openai.com/v1` 或其他特定于服务的值，只要 SPIFFE Workload API 请求和 OpenAI 提供者配置匹配即可。

如果可能，请通过你的 SPIRE OIDC Discovery Provider 暴露 SPIFFE 签发者。配置 SPIRE Server `jwt_issuer` 和 OIDC Discovery Provider `jwt_issuer` 使用同一个 HTTPS 签发者 URL，你将在此 URL 中配置 OpenAI。

在 SPIRE Server 配置中：

```hcl
server {
  trust_domain = "example.org"
  jwt_issuer   = "https://spire-oidc.example.org"
}
```

在单独的 SPIRE OIDC Discovery Provider 配置中：

```hcl
# Relevant issuer fields only
domains    = ["spire-oidc.example.org"]
jwt_issuer = "https://spire-oidc.example.org"
```

OIDC Discovery Provider 配置还需要一个密钥材料源，例如 `server_api`, `workload_api`，或 `file`，以及一个提供机制，例如 ACME、TLS 证书或 Unix 套接字。请参阅 [SPIRE OIDC Discovery Provider 文档](https://github.com/spiffe/spire/tree/main/support/oidc-discovery-provider) 以获取完整的配置选项。

SPIFFE 信任域和 JWT 签发者是不同的概念。在此示例中，JWT-SVID 主题是 `example.org` 信任域中的 SPIFFE ID，而签发者是 HTTPS 签发者 URL：

```json
{
  "sub": "spiffe://example.org/ns/production/sa/openai-wif",
  "iss": "https://spire-oidc.example.org"
}
```

SPIRE OIDC Discovery Provider 提供服务 OIDC 发现文档和 JWKS 端点，OpenAI 可以在以下情况下使用 **使用上传的 JWKS 进行令牌验证** 被禁用时。

如果 OpenAI 无法访问你的签发者发现端点，请改用上传的 JWKS 模式。在该模式下，OpenAI 仍会将 Workload Identity Provider 签发者与 JWT-SVID `iss` 声明进行比较，但会根据你保存在 Workload Identity Provider 上的 JWKS JSON 验证签名。

> **注意：** SPIFFE JWT-SVID 规范使 JWT 头部 `kid` 成为可选，但 OpenAI 要求 JWT 主体令牌包含 `kid` 头部，以便从配置的 JWKS 中选择签名密钥。如果你的 SPIFFE 提供程序可以省略 `kid`，请配置它包含一个用于 OpenAI 工作负载身份联合。

要检查能够调用 SPIFFE Workload API 的工作负载的 JWT-SVID，请为你在 OpenAI 中配置的同一受众请求一个。在与应用程序相同的工作负载上下文中运行此命令，因为 Workload API 授权取决于调用进程的身份。

```bash
TOKEN=$(spire-agent api fetch jwt \
  -socketPath /run/spire/sockets/agent.sock \
  -audience "https://api.openai.com/v1" | sed -n '2p')
export TOKEN
```

如果你的工作负载有多个 SPIFFE ID，请请求特定身份：

```bash
TOKEN=$(spire-agent api fetch jwt \
  -socketPath /run/spire/sockets/agent.sock \
  -spiffeID "spiffe://example.org/ns/production/sa/openai-wif" \
  -audience "https://api.openai.com/v1" | sed -n '2p')
export TOKEN
```

## 验证令牌

在配置工作负载身份联合之前，请将 JWT-SVID 导出为 `TOKEN`，然后在本地运行此脚本以检查其头部和声明：

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


此命令解码 JWT 时不验证令牌签名。请对生产令牌使用本地解码器，并避免将生产令牌粘贴到第三方工具中。

解码后的 SPIFFE JWT-SVID 看起来类似于：

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

在交换令牌之前，请使用解码后的令牌将收到的令牌与 OpenAI 配置进行比较。检查 `alg` 和 `kid` 在头部中，以及 `iss`, `aud`, `sub`, `iat`，并且 `exp` 在负载中。确切的 `alg` 值取决于你的 SPIRE Server JWT 签名密钥配置。

## 设置工作负载身份联合

在 OpenAI 中为 SPIFFE JWT-SVID 颁发者创建一个工作负载身份提供者，然后添加一个与你信任的 SPIFFE ID 匹配的服务账户映射。

### 设置工作负载身份提供程序

1. **创建工作负载身份提供方。** 将 **名称** 设置为唯一值，例如 `spiffe-prod`。使用 **描述**，例如 `Production SPIFFE workloads`，以帮助管理员识别该提供方。

2. **设置签发方和受众。** 将 **OIDC 签发方 URL** 设置为 JWT-SVID 的 `iss` 声明的确切值，例如 `https://spire-oidc.example.org`。将 **受众** 设置为从 SPIFFE Workload API 请求的受众值。在本示例中，该值为 `https://api.openai.com/v1`.

3. **选择 JWKS 来源。** 当 OpenAI 能够访问你的 SPIRE OIDC 发现提供方时，保持 **使用上传的 JWKS 进行令牌验证** 为禁用状态。OpenAI 使用 OIDC 发现及发现的 JWKS 来验证 JWT-SVID 签名。

   如果令牌颁发者无法从 OpenAI 访问，请启用 **使用上传的 JWKS 进行令牌验证**，然后设置 **JWKS JSON** 为 JWT-SVID 签名密钥的公共密钥集。上传完整的公共 JWKS 对象，包括周围的 `keys` 数组。不要包含私钥材料。

4. **仅当你需要派生的映射属性时，才添加属性转换。** 直接从 `sub`。映射时，属性转换不是必需的。仅当你需要从一个或多个令牌声明中派生映射值时，才使用它们。有关转换行为，请参见 [主要工作负载身份联合指南](https://developers.openai.com/api/docs/guides/workload-identity-federation#transform-token-claims-with-cel) 。

### 设置服务账号映射

1. **创建服务账号映射。** 将 **名称** 设置为工作负载身份提供方内的唯一值，例如 `production-openai-wif`。使用 **描述**，例如 `Production SPIFFE workload for OpenAI API access`，以说明哪个工作负载可以使用该映射。

2. **匹配 SPIFFE ID。** 将 **键** 设置为 `sub` 并将 **值** 设置为工作负载的 SPIFFE ID，例如 `spiffe://example.org/ns/production/sa/openai-wif`.

   对于特权工作负载，建议使用精确的 SPIFFE ID 匹配。仅当该前缀下的每个 SPIFFE ID 都应能够铸造 OpenAI 访问令牌时，才使用尾部通配符。例如， `spiffe://example.org/ns/production/sa/*` 允许任何匹配的生产服务账号路径。

3. **选择 OpenAI 目标。** 将 **项目** 到拥有目标服务账号的OpenAI项目。设置 **Service account** 为SPIFFE工作负载可以使用的OpenAI服务账号，例如 `spiffe-prod-openai-wif`. 检查 `Create a new service account in this project` 如果你希望为此映射创建新的服务账号，而不是复用现有账号。

4. **如需，则收紧API权限。** 选择合适的 **Permissions** ，例如 `api.model.request` 和 `api.vector_store.read` ，以进一步缩小由此映射铸造的访问令牌范围。将权限留空以避免添加WIF特定的范围限制；令牌仍然以映射服务账号的身份授权。

## 在代码中使用令牌

配置你的 OpenAI SDK 客户端，将新的 SPIFFE JWT-SVID 交换为 OpenAI 签发的访问令牌。

下面的 SDK 示例假设你的 SPIFFE 集成会刷新 JWT-SVID 并将其写入 `/var/run/spiffe/openai.jwt`。保持该文件仅对工作负载可读。由于 JWT-SVID 是短期的，请在令牌过期前刷新文件。或者，尽可能在主题令牌提供程序中使用特定语言的 SPIFFE 库直接从 SPIFFE Workload API 获取 JWT-SVID，以避免令牌文件过期。

设置 `OPENAI_IDENTITY_PROVIDER_ID` 和 `OPENAI_SERVICE_ACCOUNT_ID` 在工作负载环境中。令牌文件包含外部主体令牌。 `OPENAI_IDENTITY_PROVIDER_ID` 标识 OpenAI Workload Identity Provider，且 `OPENAI_SERVICE_ACCOUNT_ID` 标识目标 OpenAI 服务账号。OpenAI 然后根据令牌声明为该提供程序和服务账号查找匹配的映射。

从 SPIFFE JWT-SVID 进行身份验证

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

- 使用 JWT-SVID 进行 OpenAI 工作负载身份联合。X.509-SVID 适用于双向 TLS，但 OpenAI 令牌交换端点不接受它们。
- 为 OpenAI 访问使用单一专用受众。避免使用过宽的受众，如整个信任域或环境名称。
- 尽可能匹配精确的 SPIFFE ID。仅对有意共享的信任边界使用通配符映射。
- 保持 JWT-SVID 生命周期短以减少承载令牌重放风险。OpenAI 访问令牌永远不会超过用于交换的外部主体令牌。
- 谨慎轮换签名密钥。在轮换窗口期间通过 OIDC 发现发布新旧公钥，或在使用新密钥签发 JWT-SVID 之前更新上传的公钥 JWKS `kid`.
- 保持 SPIRE Server 和工作负载时钟同步。显著的时钟偏差可能导致原本有效的 JWT-SVID 被拒绝，因为尚未生效、过期或已失效。
- 保护 SPIFFE 工作负载 API 套接字。能够获取工作负载 JWT-SVID 的进程可能会尝试将其交换为 OpenAI 访问权限。
- 使 OpenAI 服务账户边界与你的应用程序和环境权限边界对齐。不要在无关的 SPIFFE 工作负载之间共享高权限服务账户。
- 监控令牌交换失败，以及颁发者、受众、签名密钥和映射不匹配。