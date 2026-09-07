# 为 Microsoft Azure 配置工作负载身份联合

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 来获取。

在以下任一场景中，可将 Microsoft Azure 用作工作负载身份提供方：

- **Azure 托管标识：** 将为托管标识颁发的 Microsoft Entra ID 访问令牌交换为短时效的 OpenAI 访问令牌。
- **AKS：** 将投影的 Azure Kubernetes Service (AKS) 服务账户令牌交换为短时效的 OpenAI 访问令牌。

对于 Codex，使用此页面获取并检查 Microsoft Entra 令牌。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) 将该令牌写入文件并指向 Codex。本页面上的服务账号映射和 SDK 示例适用于 OpenAI API。



## Azure 托管标识

Azure 托管标识允许 Azure 托管的工作负载请求 Microsoft Entra 令牌，而无需存储长期有效的密钥。在 OpenAI 工作负载标识联合中，托管标识令牌是 OpenAI 在颁发 OpenAI 访问令牌之前验证的主体令牌。

### 设置 Azure 托管标识

创建一个或使用一个现有的 Microsoft Entra 应用程序注册，用于表示 OpenAI 应信任的令牌受众。配置其 **应用程序 ID URI**；此 URI 是你的工作负载从 Azure 实例元数据服务 (IMDS) 请求的 `resource` 值，并作为已颁发令牌中的 `aud` 声明出现。有关 Microsoft 配置步骤，请参阅 Microsoft Entra 指南中的 [创建新的 Entra ID 应用程序和服务主体](https://learn.microsoft.com/en-au/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-azure-ad-and-create-a-service-principal).

在 Microsoft Entra ID 中配置的应用程序 ID URI、IMDS 的 `resource`
  参数、生成的令牌中的 `aud` 声明，以及 OpenAI 工作负载身份
  提供程序受众必须全部匹配。

[创建](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/manage-user-assigned-managed-identities-azure-portal?pivots=identity-mi-methods-azp) 一个托管标识，然后 [将该](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm#user-assigned-managed-identity) 托管标识分配给运行你的应用程序的 Azure 资源，例如虚拟机。该资源必须能够在运行时调用 IMDS。有关 Azure 配置详情，请参阅 Microsoft 的 [托管标识概述](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview) 以及相关的 Azure 资源文档以分配该标识。

### 获取 Azure 托管标识令牌

在已分配托管标识的 Azure 资源中，使用 Application ID URI 作为参数从 IMDS 请求令牌。 `resource` parameter。该令牌是 OpenAI 用来换取 OpenAI 颁发的访问令牌的主体令牌。

```bash
APPLICATION_ID_URI="api://<application-client-id>"

TOKEN=$(curl -sS -G -H "Metadata: true" \
  "http://169.254.169.254/metadata/identity/oauth2/token" \
  --data-urlencode "api-version=2018-02-01" \
  --data-urlencode "resource=${APPLICATION_ID_URI}" \
  | jq -r .access_token)
export TOKEN
```

如果资源具有多个用户分配的托管标识，请添加 `client_id`, `object_id`，或 `msi_res_id` 查询参数，以指定要使用的托管标识。Microsoft 在 [使用虚拟机上的托管标识获取访问令牌](https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/how-to-use-vm-token).

### 验证令牌

在配置工作负载身份联合之前，将 Microsoft Entra 令牌导出为 `TOKEN`，然后在本地运行以下脚本来检查其声明：

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


此命令会解码 JWT 负载，但不会验证令牌签名。生产令牌请使用本地解码器，避免将生产令牌粘贴到第三方工具中。

解码后的 Microsoft Entra ID 托管标识令牌如下所示：

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

- `iss`: 使用令牌中精确的 issuer 值。issuer 可能是 `https://login.microsoftonline.com/<tenant-id>/v2.0`，但不要假设该后缀。
- `aud`: 必须与 Application ID URI、IMDS `resource` 参数以及 OpenAI Workload Identity Provider 的受众匹配。
- `tid`: Microsoft Entra 租户 ID。
- `appid`: 托管标识的应用程序/客户端 ID（如果存在）。
- `iat` 和 `exp`: 检查令牌的完整生命周期， `exp - iat`，单位为秒。

对于 Codex，将提供方的 `max_assertion_lifetime_seconds` 设置为经过批准的
，以覆盖颁发方预期的令牌生命周期范围。不要使用
令牌的剩余有效期，也不要假设每个 Entra 令牌都持续一小时。
Microsoft 文档 [中说明了可变访问令牌
生命周期](https://learn.microsoft.com/en-us/entra/identity-platform/access-tokens#token-lifetime)
并且不支持 [配置托管标识令牌
生命周期](https://learn.microsoft.com/en-us/entra/identity-platform/configurable-token-lifetimes).
请参阅 [Admin API 提供方
示例](https://developers.openai.com/api/docs/guides/workload-identity-federation/admin-api#create-an-oidc-provider).

托管标识令牌还可以包含声明，例如 `azp`, `oid`, `sub`，或 `xms_mirid`。请将解码后的令牌作为真实来源，并选择能够标识你所信任的托管标识和资源边界的声明。

使用解码后的负载，将收到的令牌与 OpenAI 中配置的颁发者、受众和映射值进行比较。大多数配置问题在兑换令牌前都可以在 `iss`, `aud`, `tid`，以及托管标识声明中看到。

### 设置工作负载身份联合

在 OpenAI 中为 Microsoft Entra ID 颁发者创建工作负载身份提供者,然后添加一个与托管身份令牌中稳定声明匹配的服务账号映射。

请先配置工作负载身份提供者,然后再创建服务账号映射。

#### 配置 Workload Identity Provider

1. **创建工作负载身份提供者。** 设置 **Name** 为一个唯一值，例如 `azure-managed-identity-prod`。使用 **Description**，例如 `Production Azure managed identity workloads`，以帮助管理员识别该提供者。

2. **设置 issuer 和 audience。** 设置 **OIDC Issuer URL** 为令牌的 `iss` 声明的确切值。先获取一个示例托管身份令牌并检查其声明。例如，issuer 可能为 `https://login.microsoftonline.com/<tenant-id>/v2.0`。设置 **Audience** 为你配置的 Microsoft Entra 应用程序 ID URI，例如 `api://<application-client-id>`。此值必须与令牌的 `aud` 声明匹配。

3. **使用 Microsoft Entra 令牌验证。** 将 **Use uploaded JWKS for token verification** disabled。OpenAI 使用 Microsoft Entra issuer 元数据和 JWKS 来验证托管身份令牌。

4. **如果需要派生映射属性，请添加属性转换。** 例如，输入 `managed_identity_client_id` 并附带表达式 `assertion.appid` 以创建 `openai.managed_identity_client_id` 从托管身份 application/client ID 声明中获取。仪表板会自动应用 `openai.` 前缀。原始令牌声明中如果已经以 `openai.` 开头的，将被忽略用于 `openai.` 映射键，除非配置了匹配的转换。

#### 设置服务账户映射

1. **创建一个服务账号映射。** 设置 **Name** 为一个在该 Workload Identity Provider 内唯一的值，例如 `vm-openai-wif`。使用 **Description**，例如 `Production VM Azure managed identity workload`，以说明哪个工作负载可以使用该映射。

2. **匹配稳定的管理标识声明。** 添加一个 **键** 和 **值** 行，对每个必须匹配的声明分别设置一行。如果令牌包含 `appid`，请将 **键** 设置为 `appid` 和 **值** 为管理标识的客户端 ID。 `appid` 声明用于标识管理标识的应用程序/客户端 ID，通常是将映射绑定到特定管理标识时最稳定的声明。如果你的令牌不包含 `appid`，请使用解码后令牌中的其他稳定声明，例如 `azp`, `oid`, `sub`，或 `xms_mirid`。若要将映射绑定到一个租户，还需设置 **键** 设置为 `tid` 和 **值** 为 Microsoft Entra 租户 ID。从 IMDS 解码一个示例令牌，并使用对于你所信任的管理标识和资源稳定的声明。

3. **选择 OpenAI 目标。** 设置 **项目** 为拥有目标服务账号的 OpenAI 项目。设置 **服务账号** 可供 Azure 工作负载使用的 OpenAI 服务帐户，例如 `azure-managed-identity-prod-openai-wif`.

4. **根据需要收窄 API 权限。** 选择适当的 **权限** ，例如 `api.model.request` 和 `api.vector_store.read` 以进一步收窄从此映射颁发的访问令牌。将权限留空可避免添加 WIF 特定的 scope 限制；该令牌仍会以映射的服务帐户身份进行授权。

### 在代码中使用 token

配置你的 OpenAI SDK 客户端，从 IMDS 请求一个 Azure 托管身份令牌，并将其交换为 OpenAI 颁发的访问令牌。

设置为 `OPENAI_WIF_AUDIENCE` 配置为 Workload Identity Provider 受众的 Microsoft Entra Application ID URI。SDK 会为该受众请求一个托管身份令牌，将其交换为 OpenAI 颁发的访问令牌，并使用 OpenAI 令牌对 API 请求进行身份验证。

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

通过将 AKS 颁发的投影服务账户令牌交换为短期 OpenAI 访问令牌，将 AKS 用作 Workload Identity Provider。

AKS 工作负载还可以使用 Azure Workload Identity 获取附加到该工作负载的托管身份的 Microsoft Entra
  ID 访问令牌。在该
  配置中，OpenAI 验证的是 Microsoft Entra 令牌，而不是
  投影的 Kubernetes 服务账户令牌。配置 OpenAI workload identity
  联合身份认证，使用以下步骤 [Azure 托管
  标识](#azure-managed-identity)，并根据 Microsoft 的文档配置 Azure Workload Identity
  。

### 设置 AKS

检索与该 AKS 集群关联的 OIDC 颁发者 URL：

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

你在 OpenAI Workload Identity Provider 中配置的颁发者必须与此颁发者 URL 以及 `iss` 投影的 AKS 服务账户令牌中的 claim 相匹配。

为需要调用 OpenAI API 的 AKS 工作负载使用一个 Kubernetes `ServiceAccount` 。如果你还没有，请创建一个：

```bash
kubectl create serviceaccount openai-wif --namespace default
```

使用 OpenAI 期望的受众以及适合你的工作负载的过期时间来配置投影的服务账户令牌。OpenAI 会校验令牌的颁发者、签名、受众和过期时间。在本示例中，令牌文件挂载在 `/var/run/secrets/tokens/token`，使用受众 `https://api.openai.com/v1`，并在 3600 秒后过期。如果投影令牌的受众与 OpenAI Workload Identity Provider 的受众一致，你也可以使用其他受众。

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

在配置工作负载身份联合之前，请在本地解码一个投影的服务账户令牌样本并检查其声明。从一个已挂载投影令牌的运行中 Pod 里，检索令牌并将其导出为 `TOKEN`:

```bash
TOKEN=$(kubectl exec -n default openai-wif-app -- cat /var/run/secrets/tokens/token)
export TOKEN
```

然后运行此脚本：

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


此命令会解码 JWT 负载，但不会验证令牌签名。生产令牌请使用本地解码器，避免将生产令牌粘贴到第三方工具中。

解码后的 AKS 投影服务账户令牌类似于：

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

- `iss`: 必须与 OpenAI Workload Identity Provider 中配置的 AKS issuer URL 相匹配。
- `aud`: 必须与 projected service account token audience 以及 OpenAI Workload Identity Provider audience 相匹配。
- `sub`: 必须与你在服务账号映射中配置的 Kubernetes 服务账号 subject 相匹配。

使用解码后的负载，将收到的令牌与 OpenAI 中配置的颁发者、受众和映射值进行比较。大多数配置问题在兑换令牌前都可以在 `iss`, `aud`，并且 `sub` 在交换 token 之前进行声明校验。

### 设置工作负载身份联合

在 OpenAI 中为 AKS 签发者创建一个 Workload Identity Provider，然后添加一个与服务账号的映射，使其匹配所投影 token 中的属性。

请先配置工作负载身份提供者,然后再创建服务账号映射。

#### 配置 Workload Identity Provider

1. **创建工作负载身份提供者。** 设置 **Name** 为一个唯一值，例如 `azure-aks-prod`。使用 **Description**，例如 `Production AKS cluster`，帮助管理员识别集群。

2. **设置 issuer 和 audience。** 设置 **OIDC Issuer URL** 设置为 `az aks show --query "oidcIssuerProfile.issuerUrl"`。此值必须与投影的 `iss` 声明中的值一致。AKS 服务账户令牌中的相应声明。将 **Audience** 设置为与投影的服务账户令牌卷上配置的 audience 相同的值。在本例中，该值为 `https://api.openai.com/v1`.

3. **使用 AKS OIDC 发现。** 将 **Use uploaded JWKS for token verification** 默认禁用。OpenAI 使用 AKS issuer 的 OIDC 发现元数据和 JWKS 来验证投影的服务账户令牌。

4. **如果需要派生映射属性，请添加属性转换。** 例如，输入 `aks_subject` 并附带表达式 `assertion.sub` 以创建 `openai.aks_subject`。仪表板会应用 `openai.` 前缀。原始令牌声明中如果已经以 `openai.` 开头的，将被忽略用于 `openai.` 映射键，除非配置了匹配的转换。

#### 设置服务账户映射

1. **创建一个服务账号映射。** 设置 **Name** 为一个在该 Workload Identity Provider 内唯一的值，例如 `default-openai-wif`。使用 **Description**，例如 `Default namespace AKS OpenAI API workload`，以说明哪个工作负载可以使用该映射。

2. **匹配 AKS 服务账户 subject。** 设置 **键** 设置为 `sub` 和 **值** 设置为 `system:serviceaccount:default:openai-wif`。对于 AKS 服务账户，subject 格式为 `system:serviceaccount:<namespace>:<service-account-name>`.

   工作负载身份提供程序将令牌限制为已配置的 AKS issuer。服务账户映射进一步将访问权限限制为指定的 Kubernetes 服务账户 subject。

3. **选择 OpenAI 目标。** 设置 **项目** 为拥有目标服务账号的 OpenAI 项目。设置 **服务账号** 设置为 AKS 工作负载可以使用的 OpenAI 服务账户，例如 `azure-aks-prod-openai-wif`.

4. **根据需要收窄 API 权限。** 选择适当的 **权限** ，例如 `api.model.request` 和 `api.vector_store.read` 以进一步收窄从此映射颁发的访问令牌。将权限留空可避免添加 WIF 特定的 scope 限制；该令牌仍会以映射的服务帐户身份进行授权。

### 在代码中使用 token

配置你的 OpenAI SDK 客户端，使其读取投影的 AKS 服务账户令牌，并将其交换为 OpenAI 颁发的访问令牌。

使用挂载的令牌路径，例如 `/var/run/secrets/tokens/token`，作为 SDK 工作负载身份联合提供方的主体令牌来源。SDK 会将该 AKS 令牌交换为 OpenAI 颁发的访问令牌，并使用该 OpenAI 令牌对 API 请求进行身份验证。

下面的示例使用自定义主体令牌提供方初始化 OpenAI 客户端。该提供方从挂载的文件路径读取投影的 AKS 服务账户令牌，并将其用作工作负载身份联合的主体令牌。

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

- 尽可能使用托管标识。托管标识提供比手动分发凭据更简单、更安全的身份验证模型。
- 为不同的应用和环境使用单独的托管标识、Microsoft Entra 应用程序以及 OpenAI 映射。避免在开发、预发布和生产工作负载之间共享同一个标识。
- 限制接受的受众。仅配置 OpenAI 工作负载标识联合所需的受众。
- 使用专用的 Microsoft Entra ID 应用程序来划定安全边界。分离的应用程序能够提供更清晰的所有权、审计和访问管理。
- 优先使用针对特定工作负载的映射。根据特定工作负载的声明进行匹配，而不是使用范围广泛的租户级属性。
- 定期审查联合凭据配置。陈旧的联合凭据在工作负载退役后很久仍可能无意中持续授予访问权限。
- 分离生产与非生产标识。生产工作负载应通过不同的联合标识和 OpenAI 服务帐户进行身份验证。