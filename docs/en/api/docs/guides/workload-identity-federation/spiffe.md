# Configuring workload identity federation for SPIFFE

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use SPIFFE as a Workload Identity Provider by exchanging a SPIFFE JWT-SVID for a short-lived OpenAI access token. This lets workloads authenticated by SPIRE or another SPIFFE-compatible identity provider call the OpenAI API without storing long-lived API keys.

For Codex, use this page to get and inspect the JWT-SVID. Then [configure Codex workload identity](https://developers.openai.com/codex/enterprise/workload-identity) to write that token to a file and point Codex to it. The service-account mapping and SDK examples on this page apply to the OpenAI API.

OpenAI supports SPIFFE JWT-SVIDs that can be validated as JWT subject tokens with an issuer, audience, expiration, issued-at timestamp, and JWKS-backed signature. OpenAI doesn't support SPIFFE X.509-SVIDs as workload identity federation subject tokens.

The JWT-SVID specification requires the `sub`, `aud`, and `exp` claims. To use a JWT-SVID with OpenAI, the token must also include `iss` and `iat` claims and a `kid` header so OpenAI can validate the token against the Workload Identity Provider configuration.

A JWT-SVID is not an OpenID Connect ID token. The SPIRE OIDC Discovery Provider supplies discovery metadata and JWKS keys so OpenAI can validate the JWT-SVID; it doesn't change the token's SPIFFE semantics or require an OIDC login flow.

For SPIFFE terminology and token requirements, see the SPIFFE [JWT-SVID specification](https://spiffe.io/docs/latest/spiffe-specs/jwt-svid/) and [Workload API specification](https://spiffe.io/docs/latest/spiffe-specs/spiffe_workload_api/).

## Setting up SPIFFE

Configure your SPIFFE provider to issue JWT-SVIDs for workloads that need to call the OpenAI API. These instructions use SPIRE terminology, but the same OpenAI configuration applies to any SPIFFE-compatible provider that emits JWT-SVIDs with issuer and JWKS signing material that OpenAI can validate.

Your SPIFFE setup must provide:

- A stable SPIFFE ID for the workload, such as `spiffe://example.org/ns/production/sa/openai-wif`.
- A single JWT-SVID audience dedicated to OpenAI access, such as `https://api.openai.com/v1` or another opaque value you choose.
- A JWT issuer URL that appears in the JWT-SVID `iss` claim for OpenAI validation.
- A public JWKS for the JWT-SVID signing keys, either through OIDC discovery or an uploaded JWKS.
- A workload-side way to fetch fresh JWT-SVIDs from the SPIFFE Workload API.

The audience is an exact-match identifier, not necessarily an endpoint that receives the JWT-SVID. You may use `https://api.openai.com/v1` or another service-specific value as long as the SPIFFE Workload API request and OpenAI provider configuration match.

When possible, expose the SPIFFE issuer through your SPIRE OIDC Discovery Provider. Configure the SPIRE Server `jwt_issuer` and the OIDC Discovery Provider `jwt_issuer` to the same HTTPS issuer URL that you will configure in OpenAI.

In the SPIRE Server configuration:

```hcl
server {
  trust_domain = "example.org"
  jwt_issuer   = "https://spire-oidc.example.org"
}
```

In the separate SPIRE OIDC Discovery Provider configuration:

```hcl
# Relevant issuer fields only
domains    = ["spire-oidc.example.org"]
jwt_issuer = "https://spire-oidc.example.org"
```

The OIDC Discovery Provider configuration also needs a key-material source, such as `server_api`, `workload_api`, or `file`, and a serving mechanism, such as ACME, a TLS certificate, or a Unix socket. See the [SPIRE OIDC Discovery Provider documentation](https://github.com/spiffe/spire/tree/main/support/oidc-discovery-provider) for the complete configuration options.

The SPIFFE trust domain and JWT issuer are different concepts. In this example, the JWT-SVID subject is a SPIFFE ID in the `example.org` trust domain, while the issuer is the HTTPS issuer URL:

```json
{
  "sub": "spiffe://example.org/ns/production/sa/openai-wif",
  "iss": "https://spire-oidc.example.org"
}
```

The SPIRE OIDC Discovery Provider serves an OIDC discovery document and a JWKS endpoint that OpenAI can use when **Use uploaded JWKS for token verification** is disabled.

If OpenAI can't reach your issuer discovery endpoint, use uploaded JWKS mode instead. In that mode, OpenAI still compares the Workload Identity Provider issuer with the JWT-SVID `iss` claim, but verifies signatures against the JWKS JSON you save on the Workload Identity Provider.

> **Note:** The SPIFFE JWT-SVID specification makes the JWT header `kid` optional, but OpenAI requires JWT subject tokens to include a `kid` header so it can select the signing key from the configured JWKS. If your SPIFFE provider can omit `kid`, configure it to include one for OpenAI workload identity federation.

To inspect a JWT-SVID from a workload that can call the SPIFFE Workload API, request one for the same audience you will configure in OpenAI. Run this command in the same workload context as the application, because Workload API authorization depends on the identity of the calling process.

```bash
TOKEN=$(spire-agent api fetch jwt \
  -socketPath /run/spire/sockets/agent.sock \
  -audience "https://api.openai.com/v1" | sed -n '2p')
export TOKEN
```

If your workload has more than one SPIFFE ID, request the specific identity:

```bash
TOKEN=$(spire-agent api fetch jwt \
  -socketPath /run/spire/sockets/agent.sock \
  -spiffeID "spiffe://example.org/ns/production/sa/openai-wif" \
  -audience "https://api.openai.com/v1" | sed -n '2p')
export TOKEN
```

## Verify the token

Before configuring workload identity federation, export the JWT-SVID as `TOKEN`, then run one of these examples locally to inspect its header and claims:

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


Each example decodes the JWT without verifying the token signature. Use a local decoder for production tokens, and avoid pasting production tokens into third-party tools.

A decoded SPIFFE JWT-SVID will look similar to:

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

Use the decoded token to compare the token you received with the OpenAI configuration before you exchange it. Check `alg` and `kid` in the header, and `iss`, `aud`, `sub`, `iat`, and `exp` in the payload. The exact `alg` value depends on your SPIRE Server JWT signing-key configuration.

## Setting up workload identity federation

Create a Workload Identity Provider in OpenAI for the SPIFFE JWT-SVID issuer, then add a service account mapping that matches the SPIFFE IDs you trust.

### Set up the Workload Identity Provider

1. **Create the Workload Identity Provider.** Set **Name** to a unique value, such as `spiffe-prod`. Use **Description**, such as `Production SPIFFE workloads`, to help admins identify the provider.

2. **Set the issuer and audience.** Set **OIDC Issuer URL** to the exact value of the JWT-SVID `iss` claim, such as `https://spire-oidc.example.org`. Set **Audience** to the audience value requested from the SPIFFE Workload API. In this example, that value is `https://api.openai.com/v1`.

3. **Choose the JWKS source.** Leave **Use uploaded JWKS for token verification** disabled when OpenAI can reach your SPIRE OIDC Discovery Provider. OpenAI uses OIDC discovery and the discovered JWKS to verify JWT-SVID signatures.

   If the issuer isn't reachable from OpenAI, enable **Use uploaded JWKS for token verification**, then set **JWKS JSON** to the public key set for JWT-SVID signing keys. Upload the full public JWKS object, including the surrounding `keys` array. Do not include private key material.

4. **Add attribute transformations only if you need derived mapping attributes.** Attribute transformations aren't required when mapping directly from `sub`. Use them only when you need to derive a mapping value from one or more token claims. See the [main workload identity federation guide](https://developers.openai.com/api/docs/guides/workload-identity-federation#transform-token-claims-with-cel) for transformation behavior.

### Set up the service account mapping

1. **Create a service account mapping.** Set **Name** to a unique value within the Workload Identity Provider, such as `production-openai-wif`. Use **Description**, such as `Production SPIFFE workload for OpenAI API access`, to explain which workload can use the mapping.

2. **Match the SPIFFE ID.** Set **Key** to `sub` and **Value** to the workload's SPIFFE ID, such as `spiffe://example.org/ns/production/sa/openai-wif`.

   Prefer exact SPIFFE ID matching for privileged workloads. Use a trailing wildcard only when every SPIFFE ID under that prefix should be able to mint OpenAI access tokens. For example, `spiffe://example.org/ns/production/sa/*` allows any matching production service account path.

3. **Choose the OpenAI target.** Set **Project** to the OpenAI project that owns the target service account. Set **Service account** to the OpenAI service account the SPIFFE workload can use, such as `spiffe-prod-openai-wif`. Check `Create a new service account in this project` if you wish to create a new service account for this mapping rather than reuse an existing one.

4. **Narrow API permissions if needed.** Select appropriate **Permissions** such as `api.model.request` and `api.vector_store.read` to further narrow access tokens minted from this mapping. Leave permissions blank to avoid adding a WIF-specific scope restriction; the token still authorizes as the mapped service account.

## Using the token in code

Configure your OpenAI SDK client to exchange a fresh SPIFFE JWT-SVID for an OpenAI-issued access token.

The SDK samples below assume your SPIFFE integration refreshes a JWT-SVID and writes it to `/var/run/spiffe/openai.jwt`. Keep the file readable only by the workload. Because JWT-SVIDs are short lived, refresh the file before the token expires. As an alternative, use a language-specific SPIFFE library to fetch the JWT-SVID directly from the SPIFFE Workload API in the subject token provider when possible to avoid stale token files.

Set `OPENAI_IDENTITY_PROVIDER_ID` and `OPENAI_SERVICE_ACCOUNT_ID` in the workload environment. The token file contains the external subject token. `OPENAI_IDENTITY_PROVIDER_ID` identifies the OpenAI Workload Identity Provider, and `OPENAI_SERVICE_ACCOUNT_ID` identifies the target OpenAI service account. OpenAI then finds a matching mapping for that provider and service account based on the token claims.

Authenticate from a SPIFFE JWT-SVID

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


## SPIFFE best practices

- Use JWT-SVIDs for OpenAI workload identity federation. X.509-SVIDs are useful for mutual TLS but aren't accepted by the OpenAI token exchange endpoint.
- Use a single dedicated audience for OpenAI access. Avoid broad audiences such as a whole trust domain or environment name.
- Match exact SPIFFE IDs where possible. Use wildcard mappings only for intentionally shared trust boundaries.
- Keep JWT-SVID lifetimes short to reduce bearer-token replay risk. OpenAI access tokens never outlive the external subject token used for the exchange.
- Rotate signing keys carefully. Publish both old and new public keys through OIDC discovery during the rotation window, or update the uploaded public JWKS before issuing JWT-SVIDs with a new `kid`.
- Keep SPIRE Server and workload clocks synchronized. Significant clock skew can cause otherwise valid JWT-SVIDs to be rejected as not yet valid, too old, or expired.
- Protect the SPIFFE Workload API socket. A process that can fetch a workload's JWT-SVID can attempt to exchange it for OpenAI access.
- Align OpenAI service account boundaries with your application and environment permission boundaries. Don't share a highly privileged service account across unrelated SPIFFE workloads.
- Monitor token exchange failures for issuer, audience, signing key, and mapping mismatches.