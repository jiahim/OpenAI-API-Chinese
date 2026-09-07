# 为 SPIFFE 配置工作负载身份联合

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

使用 SPIFFE 作为工作负载身份提供方，通过交换 SPIFFE JWT-SVID 获取短期 OpenAI 访问令牌。这样，经 SPIRE 或其他兼容 SPIFFE 的身份提供方认证的工作负载可以在不存储长期 API 密钥的情况下调用 OpenAI API。

对于 Codex，请使用本页获取并检查 JWT-SVID。然后 [配置 Codex 工作负载身份](https://developers.openai.com/codex/enterprise/workload-identity) ，将该令牌写入文件并指向 Codex。本页的服务账号映射和 SDK 示例适用于 OpenAI API。

OpenAI 支持可作为 JWT 主体令牌验证的 SPIFFE JWT-SVID，其中包含签发方、受众、过期时间、签发时间戳以及由 JWKS 签名的签名。OpenAI 不支持将 SPIFFE X.509-SVID 作为工作负载身份联合主体令牌。

JWT-SVID 规范要求 `sub`, `aud`，以及 `exp` 声明。要将 JWT-SVID 用于 OpenAI，令牌还必须包含 `iss` 和 `iat` 声明以及一个 `kid` 头，以便 OpenAI 能够根据工作负载身份提供方配置验证该令牌。

JWT-SVID 不是 OpenID Connect ID 令牌。SPIRE OIDC Discovery Provider 提供发现元数据和 JWKS 密钥，以便 OpenAI 验证 JWT-SVID；它不会改变令牌的 SPIFFE 语义，也不需要 OIDC 登录流程。

有关 SPIFFE 术语和令牌要求，请参阅 SPIFFE [JWT-SVID 规范](https://spiffe.io/docs/latest/spiffe-specs/jwt-svid/) 和 [工作负载 API 规范](https://spiffe.io/docs/latest/spiffe-specs/spiffe_workload_api/).

## 设置 SPIFFE

将你的 SPIFFE 提供方配置为向需要调用 OpenAI API 的工作负载签发 JWT-SVID。这些说明使用的是 SPIRE 术语，但相同的 OpenAI 配置也适用于任何能够签发带有 issuer 和 JWKS 签名材料的 JWT-SVID、且能被 OpenAI 验证的 SPIFFE 兼容提供方。

你的 SPIFFE 配置必须提供：

- 工作负载的稳定 SPIFFE ID，例如 `spiffe://example.org/ns/production/sa/openai-wif`.
- 专用于 OpenAI 访问的单一 JWT-SVID 受众（audience），例如 `https://api.openai.com/v1` 或你自行选择的其他不透明值。
- JWT-SVID 中出现的、用于 OpenAI 校验的 JWT 颁发者 URL，位于 `iss` 声明中。
- JWT-SVID 签名密钥的公共 JWKS，可通过 OIDC 发现机制提供，也可上传 JWKS。
- 工作负载侧从 SPIFFE Workload API 获取最新 JWT-SVID 的方式。

audience 是一个精确匹配的标识符，并不一定是一个接收 JWT-SVID 的端点。你可以使用 `https://api.openai.com/v1` 或特定于服务的其他值，只要 SPIFFE Workload API 请求和 OpenAI 提供方配置匹配即可。

尽可能通过你的 SPIRE OIDC Discovery Provider 暴露 SPIFFE 颁发者。配置 SPIRE Server `jwt_issuer` 和 OIDC Discovery Provider `jwt_issuer` 使用你将在 OpenAI 中配置的同一个 HTTPS issuer URL。

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

OIDC Discovery Provider 配置还需要一个密钥材料来源，例如 `server_api`, `workload_api`，或者 `file`，以及一种服务机制，例如 ACME、TLS 证书或 Unix socket。详见 [SPIRE OIDC Discovery Provider 文档](https://github.com/spiffe/spire/tree/main/support/oidc-discovery-provider) 了解完整的配置选项。

SPIFFE 信任域与 JWT 颁发者是不同的概念。在本例中，JWT-SVID 的 subject 是位于 `example.org` 信任域下的 SPIFFE ID，而 issuer 是 HTTPS issuer URL：

```json
{
  "sub": "spiffe://example.org/ns/production/sa/openai-wif",
  "iss": "https://spire-oidc.example.org"
}
```

SPIRE OIDC Discovery Provider 提供一个 OIDC 发现文档和一个 JWKS 端点，OpenAI 可以在以下情况下使用： **使用已上传的 JWKS 进行令牌验证** 已禁用。

如果 OpenAI 无法访问你的 issuer 发现端点，请改用已上传 JWKS 模式。在该模式下，OpenAI 仍会将 Workload Identity Provider issuer 与 JWT-SVID 的 `iss` 声明进行比较，但会根据你在 Workload Identity Provider 上保存的 JWKS JSON 来验证签名。

> **注意：** SPIFFE JWT-SVID 规范将 JWT 头部 `kid` 可选，但 OpenAI 要求 JWT subject token 包含一个 `kid` header 以便它可以从配置的 JWKS 中选择签名密钥。如果你的 SPIFFE 提供方可以省略 `kid`，将其配置为包含一个用于 OpenAI 工作负载身份联合的条目。

要从能够调用 SPIFFE Workload API 的工作负载中检查 JWT-SVID，请为将在 OpenAI 中配置的同一 audience 请求一个。在与应用程序相同的工作负载上下文中运行此命令，因为 Workload API 授权取决于调用进程的身份。

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

在配置工作负载身份联合之前，将 JWT-SVID 导出为 `TOKEN`，然后在本地运行以下示例之一以检查其 header 和声明：

```javascript
const parts = process.env.TOKEN?.split(".") ?? [];
if (parts.length !== 3) {
  throw new Error("Expected a compact JWT with three segments");
}

const decode = (segment) => {
  if (!/^[A-Za-z0-9_-]+$/.test(segment) || segment.length % 4 === 1) {
    throw new Error("JWT segment is not valid Base64URL");
  }
  const bytes = Buffer.from(segment, "base64url");
  if (bytes.toString("base64url") !== segment) {
    throw new Error("JWT segment is not valid Base64URL");
  }
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  const value = JSON.parse(decoded);
  if (value === null || Array.isArray(value) || typeof value !== "object") {
    throw new Error("JWT segment is not a JSON object");
  }
  return decoded;
};

console.log("Header:");
console.log(decode(parts[0]));
console.log("\nPayload:");
console.log(decode(parts[1]));
```

```python
import base64
import json
import os
import re


def reject_non_json_constant(value):
    raise ValueError(f"JWT segment contains non-JSON constant: {value}")


parts = os.environ.get("TOKEN", "").split(".")
if len(parts) != 3:
    raise ValueError("Expected a compact JWT with three segments")


def decode(segment):
    if re.fullmatch(r"[A-Za-z0-9_-]+", segment) is None or len(segment) % 4 == 1:
        raise ValueError("JWT segment is not valid Base64URL")
    padded_segment = segment + "=" * (-len(segment) % 4)
    decoded = base64.b64decode(padded_segment, altchars=b"-_", validate=True)
    if base64.urlsafe_b64encode(decoded).rstrip(b"=").decode("ascii") != segment:
        raise ValueError("JWT segment is not valid Base64URL")
    decoded_text = decoded.decode("utf-8")
    value = json.loads(decoded_text, parse_constant=reject_non_json_constant)
    if not isinstance(value, dict):
        raise ValueError("JWT segment is not a JSON object")
    return decoded_text


print("Header:")
print(decode(parts[0]))
print("\nPayload:")
print(decode(parts[1]))
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

func printJSON(label string, value json.RawMessage) error {
	formatted, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		return err
	}
	fmt.Printf("%s:\n%s\n", label, formatted)
	return nil
}

func main() {
	parts := strings.Split(os.Getenv("TOKEN"), ".")
	if len(parts) != 3 {
		panic("Expected a compact JWT with three segments")
	}

	header, err := decodeSegment(parts[0])
	if err != nil {
		panic(err)
	}
	payload, err := decodeSegment(parts[1])
	if err != nil {
		panic(err)
	}
	if err := printJSON("Header", header); err != nil {
		panic(err)
	}
	fmt.Println()
	if err := printJSON("Payload", payload); err != nil {
		panic(err)
	}
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

public final class DecodeJwtExample {
  private static final ObjectMapper JSON =
      new ObjectMapper().enable(DeserializationFeature.FAIL_ON_TRAILING_TOKENS);

  private DecodeJwtExample() {}

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
    System.out.println("Header:");
    System.out.println(decodeSegment(parts[0]));
    System.out.println("\nPayload:");
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

Console.WriteLine("Header:");
Console.WriteLine(DecodeSegment(parts[0]));
Console.WriteLine("\nPayload:");
Console.WriteLine(DecodeSegment(parts[1]));
```

```ruby
require "base64"
require "json"

parts = ENV.fetch("TOKEN", "").split(".", -1)
raise "Expected a compact JWT with three segments" unless parts.length == 3

decode = lambda do |segment|
  unless segment.match?(/\A[A-Za-z0-9_-]+\z/) && segment.length % 4 != 1
    raise "JWT segment is not valid Base64URL"
  end

  padded = segment.ljust((segment.length + 3) & ~3, "=")
  begin
    decoded = Base64.urlsafe_decode64(padded)
  rescue ArgumentError
    raise "JWT segment is not valid Base64URL"
  end
  unless Base64.urlsafe_encode64(decoded, padding: false) == segment
    raise "JWT segment is not valid Base64URL"
  end
  decoded.force_encoding(Encoding::UTF_8)
  raise "JWT segment is not valid UTF-8" unless decoded.valid_encoding?

  value = JSON.parse(decoded)
  raise "JWT segment is not a JSON object" unless value.is_a?(Hash)

  decoded
end

puts("Header:")
puts(decode.call(parts[0]))
puts("\nPayload:")
puts(decode.call(parts[1]))
```


每个示例都会解码 JWT，但不验证令牌签名。生产令牌请使用本地解码器，避免将生产令牌粘贴到第三方工具中。

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

在交换令牌之前，请使用解码后的令牌与 OpenAI 配置进行比较。请检查 header 中的 `alg` 和 `kid` 以及负载中的 `iss`, `aud`, `sub`, `iat`，以及 `exp` 。具体的 `alg` 值取决于你的 SPIRE Server JWT 签名密钥配置。

## 设置工作负载身份联合

在 OpenAI 中为 SPIFFE JWT-SVID 颁发者创建一个工作负载身份提供方，然后添加一个与受信任的 SPIFFE ID 匹配的服务账号映射。

### 设置 Workload Identity Provider

1. **创建 Workload Identity Provider。** 设置 **Name** 为唯一值，例如 `spiffe-prod`。使用 **Description**，例如 `Production SPIFFE workloads`，以便管理员识别提供方。

2. **设置 issuer 和 audience。** 设置 **OIDC Issuer URL** 设为 JWT-SVID 的精确值 `iss` 声明，例如 `https://spire-oidc.example.org`。设置 **Audience** 为 SPIFFE Workload API 请求的 audience 值。在本示例中，该值为 `https://api.openai.com/v1`.

3. **选择 JWKS 来源。** 当 **Use uploaded JWKS for token verification** 未启用时，OpenAI 可以访问你的 SPIRE OIDC 发现提供程序。OpenAI 使用 OIDC 发现机制以及发现的 JWKS 来验证 JWT-SVID 签名。

   如果 OpenAI 无法访问该发行方，请启用 **Use uploaded JWKS for token verification**，然后将 **JWKS JSON** 设置为 JWT-SVID 签名密钥对应的公钥集合。上传完整的 JWKS 对象，并包含外层的 `keys` 数组。不要包含任何私钥材料。

4. **仅在需要派生映射属性时，才添加属性转换。** 在直接从 `sub`。进行映射时，不需要使用属性转换。只有当你需要从一个或多个 token 声明派生映射值时，才使用它们。相关内容参见 [主工作负载身份联合指南](https://developers.openai.com/api/docs/guides/workload-identity-federation#transform-token-claims-with-cel) 中的转换行为说明。

### 设置服务账号映射

1. **创建一个服务账号映射。** 设置 **Name** 到 Workload Identity Provider 中的唯一值，例如 `production-openai-wif`。使用 **Description**，例如 `Production SPIFFE workload for OpenAI API access`，用于说明哪些工作负载可以使用该映射。

2. **匹配 SPIFFE ID。** 设置 **Key** to `sub` and **Value** 设置为该工作负载的 SPIFFE ID，例如 `spiffe://example.org/ns/production/sa/openai-wif`.

   对于特权工作负载，优先使用精确的 SPIFFE ID 匹配。仅在该前缀下的所有 SPIFFE ID 都应能够签发 OpenAI 访问令牌时，才使用尾部通配符。例如： `spiffe://example.org/ns/production/sa/*` 允许任何匹配的生产服务账号路径。

3. **选择 OpenAI 目标。** 设置 **项目** 设置为拥有该目标服务账号的 OpenAI 项目。设置 **服务账号** 为 SPIFFE 工作负载可用的 OpenAI 服务账号，例如 `spiffe-prod-openai-wif`。勾选 `Create a new service account in this project` 如果你希望为此映射创建新的服务账号，而不是复用现有账号。

4. **如需收窄 API 权限。** 选择适当的 **Permissions** such as `api.model.request` and `api.vector_store.read` 以进一步收窄从此映射生成的访问令牌的范围。将权限留空可避免添加 WIF 专属的作用域限制；该令牌仍会以映射的服务账户身份进行授权。

## 在代码中使用 token

配置你的 OpenAI SDK 客户端，以使用新的 SPIFFE JWT-SVID 换取 OpenAI 颁发的访问令牌。

下面的 SDK 示例假设你的 SPIFFE 集成会刷新 JWT-SVID 并将其写入 `/var/run/spiffe/openai.jwt`。请确保该文件仅对工作负载可读。由于 JWT-SVID 有效期较短，请在令牌过期前刷新文件。作为替代方案，如果条件允许，可在 subject token provider 中使用特定语言的 SPIFFE 库直接从 SPIFFE Workload API 获取 JWT-SVID，以避免使用过期的令牌文件。

在工作负载环境中设置 `OPENAI_IDENTITY_PROVIDER_ID` 和 `OPENAI_SERVICE_ACCOUNT_ID` 。该令牌文件包含外部 subject token。 `OPENAI_IDENTITY_PROVIDER_ID` 标识 OpenAI Workload Identity Provider，而 `OPENAI_SERVICE_ACCOUNT_ID` 标识目标 OpenAI 服务账号。OpenAI 然后会根据令牌声明找到该 Provider 与服务账号的匹配映射。

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

- 使用 JWT-SVID 进行 OpenAI 工作负载身份联邦。X.509-SVID 适用于双向 TLS，但不能用于 OpenAI 令牌交换端点。
- 为 OpenAI 访问使用单个专用受众。避免使用像整个信任域或环境名称这样宽泛的受众。
- 尽可能精确匹配 SPIFFE ID。仅在有意共享的信任边界内使用通配符映射。
- 保持 JWT-SVID 的较短有效期，以降低持有者令牌的重放风险。OpenAI 访问令牌的有效期绝不会超过用于交换的外部主体令牌。
- 谨慎轮换签名密钥。在轮换窗口期间通过 OIDC 发现同时发布旧的和新的公钥，或者在签发使用新 `kid`.
- 保持 SPIRE Server 与工作负载时钟同步。明显的时钟偏差可能导致原本有效的 JWT-SVID 因尚未生效、过旧或已过期而被拒绝。
- 保护 SPIFFE 工作负载 API 套接字。任何能够获取工作负载 JWT-SVID 的进程都可以尝试将其交换为 OpenAI 访问令牌。
- 使 OpenAI 服务账号边界与你的应用和环境权限边界保持一致。不要在无关的 SPIFFE 工作负载之间共享高权限服务账号。
- 监控令牌交换失败情况，以发现颁发者、受众、签名密钥和映射之间的不匹配。