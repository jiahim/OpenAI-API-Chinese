# 为 Microsoft Azure 配置工作负载身份联合

> 完整文档索引请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

在以下任意场景中，可将 Microsoft Azure 用作 Workload Identity Provider：

- **Azure 托管标识：** 将为托管标识颁发的 Microsoft Entra ID 访问令牌交换为短时 OpenAI 访问令牌。
- **AKS：** 将 Azure Kubernetes Service (AKS) 服务账户的投影令牌交换为短时 OpenAI 访问令牌。

对于 Codex，使用此页面获取并检查 Microsoft Entra 令牌，然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 将该令牌写入文件并指向 Codex。本页面中的服务账号映射和 SDK 示例适用于 OpenAI API。



## Azure managed identity

Azure 托管标识使 Azure 上托管的工作负载无需存储长期密钥即可请求 Microsoft Entra 令牌。在 OpenAI 工作负载身份联合中，托管标识令牌是 OpenAI 在颁发 OpenAI 访问令牌之前进行验证的 subject token。

### 配置 Azure 托管标识

创建一个 Microsoft Entra 应用注册或使用现有的应用注册来表示 OpenAI 应信任的令牌受众，并配置其 **Application ID URI**；此 URI 是你的工作负载从 Azure 实例元数据服务（IMDS）请求的 `resource` 值，它会作为 `aud` 声明出现在已颁发的令牌中。有关 Microsoft 的设置步骤，请参阅 Microsoft Entra 指南中关于 [创建新的 Entra ID 应用程序和服务主体的内容](https://learn.microsoft.com/en-au/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-azure-ad-and-create-a-service-principal).

在 Microsoft Entra ID 中配置的 Application ID URI、IMDS 的 `resource`
  参数、生成的令牌中的 `aud` 声明，以及 OpenAI Workload Identity
  Provider 的受众必须全部匹配。

[创建](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal?pivots=identity-mi-methods-azp) 一个托管标识，然后 [分配](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#user-assigned-managed-identity) 该托管标识到运行你应用程序的 Azure 资源（例如虚拟机）。该资源必须能够在运行时调用 IMDS。有关 Azure 设置的详细信息，请参阅 Microsoft 的 [托管标识概述](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) 以及有关分配标识的相关 Azure 资源文档。

### 获取 Azure 托管标识令牌

在已分配托管标识的 Azure 资源上，使用 Application ID URI 作为参数向 IMDS 请求令牌。 `resource` 该令牌是 OpenAI 用于交换 OpenAI 颁发的访问令牌的 subject token。

```bash
APPLICATION_ID_URI="api://<application-client-id>"

TOKEN=$(curl -sS -G -H "Metadata: true" \
  "http://169.254.169.254/metadata/identity/oauth2/token" \
  --data-urlencode "api-version=2018-02-01" \
  --data-urlencode "resource=${APPLICATION_ID_URI}" \
  | jq -r .access_token)
export TOKEN
```

如果该资源有多个用户分配的托管标识，请添加 `client_id`, `object_id`，或 `msi_res_id` 查询参数来指定要使用的托管标识。Microsoft 在 [在虚拟机上使用托管标识获取访问令牌](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-to-use-vm-token).

### 验证令牌

在配置工作负载身份联合之前，将 Microsoft Entra 令牌导出为 `TOKEN`，然后在本地运行此脚本以检查其声明：

```javascript
const parts = process.env.TOKEN?.split(".") ?? [];
if (parts.length !== 3) {
  throw new Error("Expected a compact JWT with three segments");
}
if (!/^[A-Za-z0-9_-]+$/.test(parts[1]) || parts[1].length % 4 === 1) {
  throw new Error("JWT payload is not valid Base64URL");
}

const bytes = Buffer.from(parts[1], "base64url");
if (bytes.toString("base64url") !== parts[1]) {
  throw new Error("JWT payload is not valid Base64URL");
}
const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
const claims = JSON.parse(decoded);
if (claims === null || Array.isArray(claims) || typeof claims !== "object") {
  throw new Error("JWT payload is not a JSON object");
}
console.log(decoded);
```

```python
import base64
import json
import os
import re


def reject_non_json_constant(value):
    raise ValueError(f"JWT payload contains non-JSON constant: {value}")


parts = os.environ.get("TOKEN", "").split(".")
if len(parts) != 3:
    raise ValueError("Expected a compact JWT with three segments")

payload = parts[1]
if re.fullmatch(r"[A-Za-z0-9_-]+", payload) is None or len(payload) % 4 == 1:
    raise ValueError("JWT payload is not valid Base64URL")
padded_payload = payload + "=" * (-len(payload) % 4)
decoded = base64.b64decode(padded_payload, altchars=b"-_", validate=True)
if base64.urlsafe_b64encode(decoded).rstrip(b"=").decode("ascii") != payload:
    raise ValueError("JWT payload is not valid Base64URL")
decoded_text = decoded.decode("utf-8")
claims = json.loads(decoded_text, parse_constant=reject_non_json_constant)
if not isinstance(claims, dict):
    raise ValueError("JWT payload is not a JSON object")
print(decoded_text)
```

```go
package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"unicode/utf8"
)

func decodeSegment(segment string) (json.RawMessage, error) {
	if !isBase64URLSegment(segment) {
		return nil, fmt.Errorf("JWT segment is not valid Base64URL")
	}
	decoded, err := base64.RawURLEncoding.DecodeString(segment)
	if err != nil {
		return nil, err
	}
	if base64.RawURLEncoding.EncodeToString(decoded) != segment {
		return nil, fmt.Errorf("JWT segment is not valid Base64URL")
	}
	if !utf8.Valid(decoded) {
		return nil, fmt.Errorf("JWT segment is not valid UTF-8")
	}

	var value json.RawMessage
	if err := json.Unmarshal(decoded, &value); err != nil {
		return nil, err
	}
	if trimmed := bytes.TrimSpace(value); len(trimmed) == 0 || trimmed[0] != '{' {
		return nil, fmt.Errorf("JWT segment is not a JSON object")
	}
	return value, nil
}

func isBase64URLSegment(segment string) bool {
	if segment == "" || len(segment)%4 == 1 {
		return false
	}
	for _, character := range segment {
		if !('A' <= character && character <= 'Z') &&
			!('a' <= character && character <= 'z') &&
			!('0' <= character && character <= '9') &&
			character != '-' &&
			character != '_' {
			return false
		}
	}
	return true
}

func main() {
	parts := strings.Split(os.Getenv("TOKEN"), ".")
	if len(parts) != 3 {
		panic("Expected a compact JWT with three segments")
	}

	payload, err := decodeSegment(parts[1])
	if err != nil {
		panic(err)
	}
	formatted, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(formatted))
}
```

```java
// Add Jackson (com.fasterxml.jackson.core:jackson-databind) to your project.
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public final class DecodeJwtPayloadExample {
  private static final ObjectMapper JSON =
      new ObjectMapper().enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS);

  private DecodeJwtPayloadExample() {}

  static String decodeUtf8(byte[] bytes) throws IOException {
    try {
      return StandardCharsets.UTF_8
          .newDecoder()
          .onMalformedInput(CodingErrorAction.REPORT)
          .onUnmappableCharacter(CodingErrorAction.REPORT)
          .decode(ByteBuffer.wrap(bytes))
          .toString();
    } catch (CharacterCodingException exception) {
      throw new IOException("JWT segment is not valid UTF-8", exception);
    }
  }

  static String decodeSegment(String segment) throws IOException {
    if (!isBase64UrlSegment(segment)) {
      throw new IllegalArgumentException("JWT segment is not valid Base64URL");
    }
    byte[] bytes = Base64.getUrlDecoder().decode(segment);
    if (!Base64.getUrlEncoder().withoutPadding().encodeToString(bytes).equals(segment)) {
      throw new IllegalArgumentException("JWT segment is not valid Base64URL");
    }
    String decoded = decodeUtf8(bytes);
    JsonNode value = JSON.readTree(decoded);
    if (value == null || value.isMissingNode() || !value.isObject()) {
      throw new IOException("JWT segment is not a JSON object");
    }
    return decoded;
  }

  static boolean isBase64UrlSegment(String segment) {
    if (segment.isEmpty() || segment.length() % 4 == 1) {
      return false;
    }
    return segment
        .chars()
        .allMatch(
            character ->
                character >= 'A' && character <= 'Z'
                    || character >= 'a' && character <= 'z'
                    || character >= '0' && character <= '9'
                    || character == '-'
                    || character == '_');
  }

  static String[] requireCompactJwt(String token) {
    if (token == null) {
      throw new IllegalArgumentException("Expected a compact JWT with three segments");
    }
    String[] parts = token.split("\\.", -1);
    if (parts.length != 3) {
      throw new IllegalArgumentException("Expected a compact JWT with three segments");
    }
    return parts;
  }

  public static void main(String[] args) throws IOException {
    String[] parts = requireCompactJwt(System.getenv("TOKEN"));
    System.out.println(decodeSegment(parts[1]));
  }
}
```

```csharp
using System.Text;
using System.Text.Json;

static string DecodeSegment(string segment)
{
    if (
        segment.Length % 4 == 1 ||
        segment.Any(
            character =>
                !(
                    character is >= 'A' and <= 'Z' ||
                    character is >= 'a' and <= 'z' ||
                    character is >= '0' and <= '9' ||
                    character is '-' or '_'
                )
        )
    )
    {
        throw new FormatException("JWT segment is not valid Base64URL");
    }

    byte[] decoded = Convert.FromBase64String(
        segment.Replace('-', '+').Replace('_', '/') +
        new string('=', (4 - segment.Length % 4) % 4)
    );
    string canonicalSegment = Convert
        .ToBase64String(decoded)
        .TrimEnd('=')
        .Replace('+', '-')
        .Replace('/', '_');
    if (canonicalSegment != segment)
    {
        throw new FormatException("JWT segment is not valid Base64URL");
    }
    string decodedJson = new UTF8Encoding(false, true).GetString(decoded);
    using JsonDocument document = JsonDocument.Parse(decodedJson);
    if (document.RootElement.ValueKind is not JsonValueKind.Object)
    {
        throw new FormatException("JWT segment is not a JSON object");
    }
    return decodedJson;
}

string? token = Environment.GetEnvironmentVariable("TOKEN");
if (token is null)
{
    throw new InvalidOperationException(
        "Expected a compact JWT with three segments"
    );
}
string[] parts = token.Split('.');
if (parts.Length != 3)
{
    throw new InvalidOperationException(
        "Expected a compact JWT with three segments"
    );
}

Console.WriteLine(DecodeSegment(parts[1]));
```

```ruby
require "base64"
require "json"

parts = ENV.fetch("TOKEN", "").split(".", -1)
raise "Expected a compact JWT with three segments" unless parts.length == 3

unless parts[1].match?(/\A[A-Za-z0-9_-]+\z/) && parts[1].length % 4 != 1
  raise "JWT payload is not valid Base64URL"
end

begin
  payload = Base64.urlsafe_decode64(parts[1].ljust((parts[1].length + 3) & ~3, "="))
rescue ArgumentError
  raise "JWT payload is not valid Base64URL"
end
unless Base64.urlsafe_encode64(payload, padding: false) == parts[1]
  raise "JWT payload is not valid Base64URL"
end

payload.force_encoding(Encoding::UTF_8)
raise "JWT payload is not valid UTF-8" unless payload.valid_encoding?

claims = JSON.parse(payload)
raise "JWT payload is not a JSON object" unless claims.is_a?(Hash)

puts(payload)
```


此命令解码 JWT 负载而不验证令牌签名。对生产令牌使用本地解码器，避免将生产令牌粘贴到第三方工具中。

解码后的 Microsoft Entra ID 托管标识令牌类似于：

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

- `iss`: 使用令牌中的确切 issuer 值。该 issuer 可能 `https://login.microsoftonline.com/<tenant-id>/v2.0`，但不要假设存在此前缀。
- `aud`: 必须与 Application ID URI、IMDS `resource` 参数以及 OpenAI Workload Identity Provider 受众匹配。
- `tid`: Microsoft Entra 租户 ID。
- `appid`: 托管标识的 application/client ID（如果存在）。
- `iat` 与 `exp`: 检查令牌的完整生命周期， `exp - iat`，单位为秒。

对于 Codex，设置提供方的 `max_assertion_lifetime_seconds` 为一个已批准的
覆盖颁发者预期令牌有效时长范围的限制。不要使用该
令牌的剩余有效期，也不要假设每个 Entra 令牌都持续一小时。
Microsoft 文档 [变量访问令牌
生命周期](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens#token-lifetime)
并且不支持 [配置托管标识令牌
生命周期](https://learn.microsoft.com/en-us/entra/identity-platform/configurable-token-lifetimes).
请参阅 [Admin API 提供方
示例](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api#create-an-oidc-provider).

托管标识令牌还可以包含如下声明 `azp`, `oid`, `sub`，或 `xms_mirid`。请将解码后的令牌作为真实来源，并选择能够标识你信任的精确托管标识和资源边界的声明。

使用解码后的负载，将你收到的令牌与 OpenAI 中配置的颁发者、受众和映射值进行比较。大多数配置问题在交换令牌之前就可以在 `iss`, `aud`, `tid`，以及托管标识声明中看到。

### Setting up workload identity federation

在 OpenAI 中为 Microsoft Entra ID 颁发方创建一个 Workload Identity Provider，然后添加一个与受管身份令牌中稳定声明相匹配的服务账号映射。

先配置 Workload Identity Provider，然后创建服务账号映射。

#### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 设置 **Name** 为唯一值，例如 `azure-managed-identity-prod`。使用 **Description**，例如 `Production Azure managed identity workloads`，以帮助管理员识别该提供方。

2. **设置 issuer 和 audience。** 设置 **OIDC Issuer URL** 为令牌中 `iss` 声明的精确值。先获取一个托管身份令牌样本并检查其声明。例如，issuer 可能是 `https://login.microsoftonline.com/<tenant-id>/v2.0`。设置 **Audience** 为你配置的 Microsoft Entra 应用程序 ID URI，例如 `api://<application-client-id>`。该值必须与令牌的 `aud` 声明匹配。

3. **使用 Microsoft Entra 令牌验证。** 将 **Use uploaded JWKS for token verification** 已禁用。OpenAI 使用 Microsoft Entra 颁发者元数据和 JWKS 来验证托管身份令牌。

4. **如果需要派生映射属性，请添加属性转换。** 例如，输入 `managed_identity_client_id` 并附带表达式 `assertion.appid` 以创建 `openai.managed_identity_client_id` 从托管身份应用程序/客户端 ID 声明派生而来。仪表板会自动应用 `openai.` 前缀。已经以 `openai.` 开头的原始令牌声明会用于 `openai.` 映射键，除非配置了匹配的转换。

#### 设置服务账户映射

1. **创建服务账号映射。** 设置 **Name** 为该值，使其在该 Workload Identity Provider 中唯一，例如 `vm-openai-wif`。使用 **Description**，例如 `Production VM Azure managed identity workload`，以说明哪个工作负载可以使用该映射。

2. **匹配稳定的管理标识声明。** 添加一个 **Key** 与 **Value** 行，对应每个必须匹配的声明。如果令牌包含 `appid`，则将 **Key** 设为 `appid` 与 **Value** 为管理标识的客户端 ID。OpenAI `appid` 声明标识管理标识的应用程序/客户端 ID，通常是将映射绑定到特定管理标识最稳定的声明。如果你的令牌不包含 `appid`，请使用解码令牌中的另一个稳定声明，例如 `azp`, `oid`, `sub`，或 `xms_mirid`。若要将映射绑定到单个租户，还要将 **Key** 设为 `tid` 与 **Value** 设置为 Microsoft Entra 租户 ID。从 IMDS 解码一个示例令牌，并使用对你所信任的管理标识和资源稳定的声明。

3. **选择 该公司 目标。** 设置 **Project** 为拥有目标服务账号的 OpenAI 项目。设置 **Service account** Azure 工作负载可使用的 OpenAI 服务帐户，例如 `azure-managed-identity-prod-openai-wif`.

4. **如需要，收窄 API 权限。** 选择合适的 **权限** 例如 `api.model.request` 与 `api.vector_store.read` 以进一步收窄从此映射颁发的访问令牌。将权限留空可避免添加 WIF 特定的 scope 限制；令牌仍会以映射的服务帐户身份进行授权。

### 在代码中使用令牌

配置你的 OpenAI SDK 客户端，从 IMDS 请求 Azure 托管身份令牌，并将其交换为由 OpenAI 颁发的访问令牌。

将 `OPENAI_WIF_AUDIENCE` 设置为配置为 Workload Identity Provider 受众的 Microsoft Entra Application ID URI。SDK 会为该受众请求托管身份令牌，将其交换为 OpenAI 颁发的访问令牌，并使用该 OpenAI 令牌对 API 请求进行身份验证。

通过 Azure 托管身份令牌进行身份验证

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

使用 AKS 作为工作负载身份提供方，通过将 AKS 颁发的投射服务账户令牌交换为短期 OpenAI 访问令牌。

AKS 工作负载也可以使用 Azure Workload Identity 获取用于附加到该工作负载的托管身份的 Microsoft Entra
  ID 访问令牌。在该配置中，OpenAI 会验证 Microsoft Entra 令牌而不是投射的 Kubernetes 服务账户令牌。请按照以下步骤配置 OpenAI 工作负载身份
  联合，并按照 Microsoft 文档配置 Azure Workload Identity。
  projected Kubernetes service account token. Configure 该公司 workload identity
  联合，请按照以下步骤进行： [Azure 托管
  身份](#azure-managed-identity)，并根据 Microsoft 的文档配置 Azure Workload Identity。
  根据 Microsoft 的文档进行配置。

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

你在 OpenAI Workload Identity Provider 中配置的颁发者必须与此颁发者 URL 以及 `iss` 投射的 AKS 服务账户令牌中的 claim 相匹配。

为需要调用 OpenAI API 的 AKS 工作负载使用一个 Kubernetes `ServiceAccount` 。如果还没有，请创建一个：

```bash
kubectl create serviceaccount openai-wif --namespace default
```

使用 OpenAI 期望的 audience 和适合你的工作负载的过期时间配置投射的服务账户令牌。OpenAI 会校验令牌的颁发者、签名、audience 和过期时间。在本示例中，令牌文件挂载于 `/var/run/secrets/tokens/token`，使用的 audience 为 `https://api.openai.com/v1`，并在 3600 秒后过期。如果投射令牌的 audience 与 OpenAI Workload Identity Provider 的 audience 一致，你也可以使用其他 audience。

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

在配置工作负载身份联合之前，请在本地解码一个示例投射的服务账户令牌并检查其 claim。从一个已挂载投射令牌的运行中的 pod 中，检索该令牌并导出为 `TOKEN`:

```bash
TOKEN=$(kubectl exec -n default openai-wif-app -- cat /var/run/secrets/tokens/token)
export TOKEN
```

然后运行以下脚本：

```javascript
const parts = process.env.TOKEN?.split(".") ?? [];
if (parts.length !== 3) {
  throw new Error("Expected a compact JWT with three segments");
}
if (!/^[A-Za-z0-9_-]+$/.test(parts[1]) || parts[1].length % 4 === 1) {
  throw new Error("JWT payload is not valid Base64URL");
}

const bytes = Buffer.from(parts[1], "base64url");
if (bytes.toString("base64url") !== parts[1]) {
  throw new Error("JWT payload is not valid Base64URL");
}
const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
const claims = JSON.parse(decoded);
if (claims === null || Array.isArray(claims) || typeof claims !== "object") {
  throw new Error("JWT payload is not a JSON object");
}
console.log(decoded);
```

```python
import base64
import json
import os
import re


def reject_non_json_constant(value):
    raise ValueError(f"JWT payload contains non-JSON constant: {value}")


parts = os.environ.get("TOKEN", "").split(".")
if len(parts) != 3:
    raise ValueError("Expected a compact JWT with three segments")

payload = parts[1]
if re.fullmatch(r"[A-Za-z0-9_-]+", payload) is None or len(payload) % 4 == 1:
    raise ValueError("JWT payload is not valid Base64URL")
padded_payload = payload + "=" * (-len(payload) % 4)
decoded = base64.b64decode(padded_payload, altchars=b"-_", validate=True)
if base64.urlsafe_b64encode(decoded).rstrip(b"=").decode("ascii") != payload:
    raise ValueError("JWT payload is not valid Base64URL")
decoded_text = decoded.decode("utf-8")
claims = json.loads(decoded_text, parse_constant=reject_non_json_constant)
if not isinstance(claims, dict):
    raise ValueError("JWT payload is not a JSON object")
print(decoded_text)
```

```go
package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"unicode/utf8"
)

func decodeSegment(segment string) (json.RawMessage, error) {
	if !isBase64URLSegment(segment) {
		return nil, fmt.Errorf("JWT segment is not valid Base64URL")
	}
	decoded, err := base64.RawURLEncoding.DecodeString(segment)
	if err != nil {
		return nil, err
	}
	if base64.RawURLEncoding.EncodeToString(decoded) != segment {
		return nil, fmt.Errorf("JWT segment is not valid Base64URL")
	}
	if !utf8.Valid(decoded) {
		return nil, fmt.Errorf("JWT segment is not valid UTF-8")
	}

	var value json.RawMessage
	if err := json.Unmarshal(decoded, &value); err != nil {
		return nil, err
	}
	if trimmed := bytes.TrimSpace(value); len(trimmed) == 0 || trimmed[0] != '{' {
		return nil, fmt.Errorf("JWT segment is not a JSON object")
	}
	return value, nil
}

func isBase64URLSegment(segment string) bool {
	if segment == "" || len(segment)%4 == 1 {
		return false
	}
	for _, character := range segment {
		if !('A' <= character && character <= 'Z') &&
			!('a' <= character && character <= 'z') &&
			!('0' <= character && character <= '9') &&
			character != '-' &&
			character != '_' {
			return false
		}
	}
	return true
}

func main() {
	parts := strings.Split(os.Getenv("TOKEN"), ".")
	if len(parts) != 3 {
		panic("Expected a compact JWT with three segments")
	}

	payload, err := decodeSegment(parts[1])
	if err != nil {
		panic(err)
	}
	formatted, err := json.MarshalIndent(payload, "", "  ")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(formatted))
}
```

```java
// Add Jackson (com.fasterxml.jackson.core:jackson-databind) to your project.
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public final class DecodeJwtPayloadExample {
  private static final ObjectMapper JSON =
      new ObjectMapper().enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS);

  private DecodeJwtPayloadExample() {}

  static String decodeUtf8(byte[] bytes) throws IOException {
    try {
      return StandardCharsets.UTF_8
          .newDecoder()
          .onMalformedInput(CodingErrorAction.REPORT)
          .onUnmappableCharacter(CodingErrorAction.REPORT)
          .decode(ByteBuffer.wrap(bytes))
          .toString();
    } catch (CharacterCodingException exception) {
      throw new IOException("JWT segment is not valid UTF-8", exception);
    }
  }

  static String decodeSegment(String segment) throws IOException {
    if (!isBase64UrlSegment(segment)) {
      throw new IllegalArgumentException("JWT segment is not valid Base64URL");
    }
    byte[] bytes = Base64.getUrlDecoder().decode(segment);
    if (!Base64.getUrlEncoder().withoutPadding().encodeToString(bytes).equals(segment)) {
      throw new IllegalArgumentException("JWT segment is not valid Base64URL");
    }
    String decoded = decodeUtf8(bytes);
    JsonNode value = JSON.readTree(decoded);
    if (value == null || value.isMissingNode() || !value.isObject()) {
      throw new IOException("JWT segment is not a JSON object");
    }
    return decoded;
  }

  static boolean isBase64UrlSegment(String segment) {
    if (segment.isEmpty() || segment.length() % 4 == 1) {
      return false;
    }
    return segment
        .chars()
        .allMatch(
            character ->
                character >= 'A' && character <= 'Z'
                    || character >= 'a' && character <= 'z'
                    || character >= '0' && character <= '9'
                    || character == '-'
                    || character == '_');
  }

  static String[] requireCompactJwt(String token) {
    if (token == null) {
      throw new IllegalArgumentException("Expected a compact JWT with three segments");
    }
    String[] parts = token.split("\\.", -1);
    if (parts.length != 3) {
      throw new IllegalArgumentException("Expected a compact JWT with three segments");
    }
    return parts;
  }

  public static void main(String[] args) throws IOException {
    String[] parts = requireCompactJwt(System.getenv("TOKEN"));
    System.out.println(decodeSegment(parts[1]));
  }
}
```

```csharp
using System.Text;
using System.Text.Json;

static string DecodeSegment(string segment)
{
    if (
        segment.Length % 4 == 1 ||
        segment.Any(
            character =>
                !(
                    character is >= 'A' and <= 'Z' ||
                    character is >= 'a' and <= 'z' ||
                    character is >= '0' and <= '9' ||
                    character is '-' or '_'
                )
        )
    )
    {
        throw new FormatException("JWT segment is not valid Base64URL");
    }

    byte[] decoded = Convert.FromBase64String(
        segment.Replace('-', '+').Replace('_', '/') +
        new string('=', (4 - segment.Length % 4) % 4)
    );
    string canonicalSegment = Convert
        .ToBase64String(decoded)
        .TrimEnd('=')
        .Replace('+', '-')
        .Replace('/', '_');
    if (canonicalSegment != segment)
    {
        throw new FormatException("JWT segment is not valid Base64URL");
    }
    string decodedJson = new UTF8Encoding(false, true).GetString(decoded);
    using JsonDocument document = JsonDocument.Parse(decodedJson);
    if (document.RootElement.ValueKind is not JsonValueKind.Object)
    {
        throw new FormatException("JWT segment is not a JSON object");
    }
    return decodedJson;
}

string? token = Environment.GetEnvironmentVariable("TOKEN");
if (token is null)
{
    throw new InvalidOperationException(
        "Expected a compact JWT with three segments"
    );
}
string[] parts = token.Split('.');
if (parts.Length != 3)
{
    throw new InvalidOperationException(
        "Expected a compact JWT with three segments"
    );
}

Console.WriteLine(DecodeSegment(parts[1]));
```

```ruby
require "base64"
require "json"

parts = ENV.fetch("TOKEN", "").split(".", -1)
raise "Expected a compact JWT with three segments" unless parts.length == 3

unless parts[1].match?(/\A[A-Za-z0-9_-]+\z/) && parts[1].length % 4 != 1
  raise "JWT payload is not valid Base64URL"
end

begin
  payload = Base64.urlsafe_decode64(parts[1].ljust((parts[1].length + 3) & ~3, "="))
rescue ArgumentError
  raise "JWT payload is not valid Base64URL"
end
unless Base64.urlsafe_encode64(payload, padding: false) == parts[1]
  raise "JWT payload is not valid Base64URL"
end

payload.force_encoding(Encoding::UTF_8)
raise "JWT payload is not valid UTF-8" unless payload.valid_encoding?

claims = JSON.parse(payload)
raise "JWT payload is not a JSON object" unless claims.is_a?(Hash)

puts(payload)
```


此命令解码 JWT 负载而不验证令牌签名。对生产令牌使用本地解码器，避免将生产令牌粘贴到第三方工具中。

解码后的 AKS 投射服务账户令牌类似如下：

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

- `iss`: 必须与 OpenAI Workload Identity Provider 中配置的 AKS issuer URL 一致。
- `aud`: 必须与投射的服务账户令牌受众以及 OpenAI Workload Identity Provider 的受众一致。
- `sub`: 必须与你在服务账户映射中配置的 Kubernetes 服务账户主体一致。

使用解码后的负载，将你收到的令牌与 OpenAI 中配置的颁发者、受众和映射值进行比较。大多数配置问题在交换令牌之前就可以在 `iss`, `aud`，并且 `sub` 在交换令牌之前声明它们。

### Setting up workload identity federation

在 OpenAI 中为 AKS 颁发者创建工作负载身份提供方，然后添加一个服务账号映射，使其与投影令牌中的属性匹配。

先配置 Workload Identity Provider，然后创建服务账号映射。

#### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 设置 **Name** 为唯一值，例如 `azure-aks-prod`。使用 **Description**，例如 `Production AKS cluster`，以帮助管理员识别集群。

2. **设置 issuer 和 audience。** 设置 **OIDC Issuer URL** 到返回的 issuer `az aks show --query "oidcIssuerProfile.issuerUrl"`。该值必须与 `iss` 投影 AKS 服务账号令牌中的声明匹配。设置 **Audience** 为与投影服务账号令牌卷上配置的 audience 相同的值。在本示例中，该值为 `https://api.openai.com/v1`.

3. **使用 AKS OIDC 发现。** 将 **Use uploaded JWKS for token verification** 禁用。OpenAI 使用 AKS issuer 的 OIDC 发现元数据和 JWKS 来验证投影的服务账号令牌。

4. **如果需要派生映射属性，请添加属性转换。** 例如，输入 `aks_subject` 并附带表达式 `assertion.sub` 以创建 `openai.aks_subject`。仪表板将应用 `openai.` 前缀。已经以 `openai.` 开头的原始令牌声明会用于 `openai.` 映射键，除非配置了匹配的转换。

#### 设置服务账户映射

1. **创建服务账号映射。** 设置 **Name** 为该值，使其在该 Workload Identity Provider 中唯一，例如 `default-openai-wif`。使用 **Description**，例如 `Default namespace AKS OpenAI API workload`，以说明哪个工作负载可以使用该映射。

2. **匹配 AKS 服务账号 subject。** 设置 **Key** 设为 `sub` 与 **Value** 设为 `system:serviceaccount:default:openai-wif`。对于 AKS 服务账号，subject 格式为 `system:serviceaccount:<namespace>:<service-account-name>`.

   Workload Identity Provider 将令牌限制为配置的 AKS issuer。服务账号映射进一步将访问限制为指定的 Kubernetes 服务账号 subject。

3. **选择 该公司 目标。** 设置 **Project** 为拥有目标服务账号的 OpenAI 项目。设置 **Service account** 为 AKS 工作负载可以使用的 OpenAI 服务账号，例如 `azure-aks-prod-openai-wif`.

4. **如需要，收窄 API 权限。** 选择合适的 **权限** 例如 `api.model.request` 与 `api.vector_store.read` 以进一步收窄从此映射颁发的访问令牌。将权限留空可避免添加 WIF 特定的 scope 限制；令牌仍会以映射的服务帐户身份进行授权。

### 在代码中使用令牌

配置你的 OpenAI SDK 客户端，以读取已投影的 AKS 服务账户令牌，并将其交换为 OpenAI 颁发的访问令牌。

将已挂载的令牌路径（例如 `/var/run/secrets/tokens/token`）用作 SDK 工作负载身份联合提供程序的 subject token 来源。SDK 会将该 AKS 令牌交换为 OpenAI 颁发的访问令牌，并使用该 OpenAI 令牌对 API 请求进行身份验证。

以下示例使用自定义 subject token 提供程序初始化 OpenAI 客户端。该提供程序从已挂载的文件路径读取已投影的 AKS 服务账户令牌，并将其用作工作负载身份联合的 subject token。

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

- 尽可能使用托管标识。托管标识提供比手动分发凭据更简单、更安全的身份验证模型。
- 为不同的应用和环境使用单独的托管标识、Microsoft Entra 应用以及 OpenAI 映射。避免在开发、预生产和生产工作负载之间共享同一个标识。
- 限制接受的受众。仅配置 OpenAI 工作负载身份联合所需的受众。
- 使用专用的 Microsoft Entra ID 应用来划定安全边界。独立的应用可以提供更清晰的所有权、审计和访问管理。
- 优先采用针对特定工作负载的映射。根据工作负载特定的声明进行匹配，而不是使用范围广泛的租户级属性。
- 定期审查联合凭据配置。过期的联合凭据可能在工作负载下线后很长时间内仍然无意地授予访问权限。
- 分离生产与非生产环境的标识。生产工作负载应通过不同的联合标识和 OpenAI 服务账号进行身份验证。