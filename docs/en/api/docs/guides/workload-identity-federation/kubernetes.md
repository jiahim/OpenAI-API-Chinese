# Configuring workload identity federation for Kubernetes

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use Kubernetes as a Workload Identity Provider by exchanging a projected Kubernetes service account token for a short-lived OpenAI access token.

For Codex, use this page to get and inspect the projected token. Then [configure Codex workload identity](https://developers.openai.com/codex/enterprise/workload-identity) to point Codex to the mounted token file. The service-account mapping and SDK examples on this page apply to the OpenAI API.

## Setting up Kubernetes

This guide assumes Kubernetes service account token projection is enabled, which is available by default in modern Kubernetes releases. OpenAI workload identity federation requires OIDC-compatible projected service account tokens. Legacy Kubernetes service account tokens stored in Secrets are not supported.

Use a Kubernetes `ServiceAccount` for the workload that needs to call the OpenAI API. If you do not already have one, create it:

```bash
kubectl create serviceaccount openai-wif --namespace default
```

Get the OIDC issuer for your Kubernetes cluster:

```bash
kubectl get --raw /.well-known/openid-configuration | jq -r .issuer
```

Even if you upload the JWKS and OpenAI does not perform JWKS discovery against the OIDC issuer, this issuer must match the issuer configured in the Workload Identity Provider.

Get the cluster JWKS and save the returned key set. You will need it when configuring the Workload Identity Provider:

```bash
kubectl get --raw /openid/v1/jwks
```

Configure the projected service account token with the audience OpenAI expects and an expiration suitable for your workload. OpenAI validates the token's issuer, signature, audience, and expiration. In this example, the token file is mounted at `/var/run/secrets/tokens/token`, uses the audience `https://api.openai.com/v1`, and expires after 3600 seconds. You may use a different audience if the projected token audience and OpenAI Workload Identity Provider audience match:

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

## Verify the token

Before configuring workload identity federation, decode a sample projected service account token locally and inspect its claims. From a running pod with the projected token mounted, retrieve the token and export it as `TOKEN`:

```bash
TOKEN=$(kubectl exec -n default openai-wif-app -- cat /var/run/secrets/tokens/token)
export TOKEN
```

Then run this script:

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


This command decodes the JWT payload without verifying the token signature. Use a local decoder for production tokens, and avoid pasting production tokens into third-party tools.

A decoded Kubernetes projected service account token will look similar to:

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

Use the decoded payload to compare the token you received with the issuer, audience, and mapping values configured in OpenAI. Most configuration issues are visible in the `iss`, `aud`, and `sub` claims before you exchange the token.

## Setting up workload identity federation

Create a Workload Identity Provider in OpenAI for the Kubernetes issuer, then add a service account mapping that matches attributes from the projected token.

Configure the Workload Identity Provider first, then create the service account mapping.

### Set up the Workload Identity Provider

1. **Create the Workload Identity Provider.** Set **Name** to a unique value, such as `kubernetes-prod`. Use **Description**, such as `Production Kubernetes cluster`, to help admins identify the cluster.

2. **Set the issuer and audience.** Set **OIDC Issuer URL** to the issuer returned by `kubectl get --raw /.well-known/openid-configuration | jq -r .issuer`. This value must match the `iss` claim in the projected token. Set **Audience** to the same opaque audience string configured on the projected service account token volume. In this example, that value is `https://api.openai.com/v1`.

3. **Upload the Kubernetes JWKS.** Enable **Use uploaded JWKS for token verification**, then set **JWKS JSON** to the output from `kubectl get --raw /openid/v1/jwks`. OpenAI uses this public key set to verify projected Kubernetes service account tokens. Upload the full key set including the surrounding `keys`.

   > **Note:** For self-hosted Kubernetes clusters, OpenAI supports only local JWKS mode. Upload the JWKS returned by your cluster; OpenAI does not perform OIDC discovery against the configured issuer. OpenAI still compares the configured issuer with the `iss` field in the token.

   If your cluster rotates service account signing keys, update the uploaded JWKS in the Workload Identity Provider configuration. Tokens signed by keys that are not present in the configured JWKS are rejected. If the JWKS contains multiple active public keys, include the full `keys` array.

4. **Add attribute transformations only if you need derived mapping attributes.** Raw token claims such as `sub`, `aud`, and `iss` can be used directly in mapping assertions. If you plan to match on transformed attributes rather than raw token claims, the dashboard applies the `openai.` prefix automatically; for example, enter `workload_subject` with expression `assertion.sub` to create `openai.workload_subject`. Raw token claims that already start with `openai.` are ignored for `openai.` mapping keys unless a matching transformation is configured.

### Set up the service account mapping

1. **Create a service account mapping.** Set **Name** to a unique value within the Workload Identity Provider, such as `openai-mapping-kubernetes`. Use **Description**, such as `Workload Identity Provider Mapping for Kubernetes Workloads`, to explain which workload can use the mapping.

2. **Match the Kubernetes service account subject.** Set **Key** to `sub` and **Value** to `system:serviceaccount:default:openai-wif`. For Kubernetes service accounts, the subject format is `system:serviceaccount:<namespace>:<service-account-name>`.

3. **Choose the OpenAI target.** Set **Project** to the OpenAI project that owns the target service account. Set **Service account** to the OpenAI service account the Kubernetes workload can use, such as `kubernetes-prod-openai-wif`. Check `Create a new service account in this project` if you wish to create a new service account for this mapping rather than reuse an existing one.

4. **Narrow API permissions if needed.** Select appropriate **Permissions** such as `api.model.request` and `api.vector_store.read` to further narrow access tokens minted from this mapping. Leave permissions blank to avoid adding a WIF-specific scope restriction; the token still authorizes as the mapped service account.

## Using the token in code

Configure your OpenAI SDK client to read the projected Kubernetes token and exchange it for an OpenAI-issued access token.

Use the mounted token path, such as `/var/run/secrets/tokens/token`, as the subject token source for the SDK workload identity federation provider. The SDK exchanges that Kubernetes token for an OpenAI-issued access token and uses the OpenAI token to authenticate API requests.

The following examples initialize an OpenAI client with a custom subject token provider. The provider reads the projected Kubernetes service account token from the mounted file path and uses it as the subject token for workload identity federation.

Authenticate from a Kubernetes projected service account token

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


## Kubernetes best practices

- Use a stable OIDC issuer. The issuer URL must match the projected service account token `iss` claim and should remain stable across cluster upgrades and maintenance operations.
- Protect signing keys carefully. Anyone with access to the cluster's service account signing keys can mint tokens that may be accepted by OpenAI.
- Use dedicated service accounts for OpenAI integrations. Avoid reusing service accounts that are also used for unrelated infrastructure or application access.
- Keep the uploaded JWKS current. OpenAI uses the configured JWKS to validate workload identity tokens in local JWKS mode, so update the Workload Identity Provider before rotating to new signing keys.
- Minimize custom claim complexity. Prefer matching on standard claims such as `sub` and `aud`, or transformed attributes derived directly from those claims.
- Treat namespace ownership as part of your security model. If namespace administrators can create service accounts, ensure mappings are scoped appropriately to prevent unintended privilege escalation.
- Monitor issuer and signing key changes. Rotating signing keys without updating the Workload Identity Provider JWKS can cause token exchange failures.