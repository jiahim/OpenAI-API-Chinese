# Configuring workload identity federation for GitHub Actions

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use GitHub Actions as a Workload Identity Provider by exchanging a GitHub-issued OIDC token for a short-lived OpenAI access token. This lets workflows authenticate to the OpenAI API without storing a long-lived API key in GitHub secrets.

For Codex, use this page to get and inspect the GitHub token. Then [configure Codex workload identity](https://developers.openai.com/codex/enterprise/workload-identity) to write that token to a file and point Codex to it. The service-account mapping and SDK examples on this page apply to the OpenAI API.

GitHub can mint a signed OIDC JWT for a workflow job that has `id-token: write` permission and requests an identity token. OpenAI validates the token issuer, audience, signature, and mapping attributes before issuing an OpenAI access token.

## Setting up GitHub Actions

Grant the workflow or job permission to request a GitHub OIDC token:

```yaml
permissions:
  id-token: write
  contents: read
```

The `id-token: write` permission lets the job request an OIDC JWT. It does not grant write access to repository contents. The `contents: read` permission is needed by `actions/checkout`.

Request the token with the exact audience configured in your OpenAI Workload Identity Provider. Custom JavaScript actions can call `core.getIDToken("your-wif-audience")`; shell steps can call GitHub's OIDC request URL directly. Audience values containing reserved URL characters, such as `https://api.openai.com/v1`, should be URL encoded before being appended to the request URL:

```bash
AUDIENCE="https://api.openai.com/v1"
ENCODED_AUDIENCE=$(jq -rn --arg audience "$AUDIENCE" '$audience | @uri')

TOKEN=$(curl -sSf -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \
  "${ACTIONS_ID_TOKEN_REQUEST_URL}&audience=${ENCODED_AUDIENCE}" | jq -r .value)
export TOKEN
```

Important GitHub OIDC claims include:

- `iss`: The token issuer. For GitHub Actions, this is `https://token.actions.githubusercontent.com`.
- `aud`: The audience value requested by the workflow. Configure OpenAI to require the exact value you request, such as `your-wif-audience` or `https://api.openai.com/v1`.
- `sub`: The main subject string. GitHub builds it from workflow metadata such as repository, branch, tag, pull request, or environment.
- `repository`: The repository running the workflow, such as `my-org/my-repo`.
- `repository_owner`: The organization or user that owns the repository, such as `my-org`.
- `ref`: The Git ref that triggered the workflow, such as `refs/heads/main` or `refs/tags/v1.0.0`.
- `workflow`: The workflow claim. Use the actual claim value emitted by GitHub, such as `deploy` if that is the workflow claim in your job.
- `workflow_ref`: The workflow file path and ref, such as `my-org/my-repo/.github/workflows/deploy.yml@refs/heads/main`.
- `environment`: The GitHub environment name, such as `production`, when the job uses an environment.
- `run_id`, `run_number`, `run_attempt`, and `job_workflow_ref`: Run and job identifiers that can help with auditing or more advanced trust rules.

For the full claim list and subject formats, see GitHub's [OpenID Connect reference](https://docs.github.com/en/actions/reference/security/oidc).

## Verify the token

Before configuring workload identity federation, export the GitHub OIDC token as `TOKEN`, then run this script in the workflow runner to inspect its claims:

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


This command decodes the JWT payload without verifying the token signature. Use a local decoder for production tokens, and avoid pasting production tokens into third-party tools. Never log the raw GitHub OIDC token or the exchanged OpenAI access token.

A decoded GitHub Actions OIDC token will look similar to:

```json
{
  "iss": "https://token.actions.githubusercontent.com",
  "aud": "https://api.openai.com/v1",
  "sub": "repo:my-org/my-repo:environment:production",
  "repository": "my-org/my-repo",
  "repository_owner": "my-org",
  "ref": "refs/heads/main",
  "workflow": "deploy",
  "workflow_ref": "my-org/my-repo/.github/workflows/deploy.yml@refs/heads/main",
  "environment": "production",
  "run_id": "1234567890",
  "run_attempt": "1"
}
```

Use the decoded payload to compare the token you received with the issuer, audience, and mapping values configured in OpenAI. Most configuration issues are visible in the `iss`, `aud`, `repository`, `ref`, and `workflow_ref` claims before you exchange the token.

## Setting up workload identity federation

Create a Workload Identity Provider in OpenAI for GitHub Actions, then add a service account mapping that matches the GitHub workflow claims you trust.

Configure the Workload Identity Provider first, then create the service account mapping.

### Set up the Workload Identity Provider

1. **Create the Workload Identity Provider.** Set **Name** to a unique value, such as `github-actions-prod`. Use **Description**, such as `Production GitHub Actions workflows`, to help admins identify the provider.

2. **Set the issuer and audience.** Set **OIDC Issuer URL** to `https://token.actions.githubusercontent.com`. Set **Audience** to the exact audience your workflow requests, such as `your-wif-audience` or `https://api.openai.com/v1`.

3. **Use GitHub OIDC discovery.** Leave **Use uploaded JWKS for token verification** disabled. OpenAI uses GitHub's OIDC discovery metadata and JWKS to verify the GitHub-signed token.

4. **Add attribute transformations only if you need derived mapping attributes.** Raw GitHub claims such as `repository`, `ref`, and `workflow` can be used directly in mapping assertions. If you create derived attributes, the dashboard applies the `openai.` prefix automatically; for example, enter `github_repository` with expression `assertion.repository` to create `openai.github_repository`. Raw token claims that already start with `openai.` are ignored for `openai.` mapping keys unless a matching transformation is configured.

### Set up the service account mapping

1. **Create a service account mapping.** Set **Name** to a unique value within the Workload Identity Provider, such as `github-actions-main-deploy`. Use **Description**, such as `Production deploy workflow on main`, to explain which workflow can use the mapping.

2. **Add exact claim assertions.** Add one **Key** and **Value** row for each GitHub claim that must match. OpenAI requires every configured row to match before it issues an access token. For a production deploy workflow, use assertions like:

```text
   iss == "https://token.actions.githubusercontent.com"
   aud == "https://api.openai.com/v1"
   repository == "my-org/my-repo"
   ref == "refs/heads/main"
   workflow_ref == "my-org/my-repo/.github/workflows/deploy.yml@refs/heads/main"
```

   Prefer `workflow_ref` over `workflow` for privileged mappings because admins usually intend to trust a specific workflow file path and ref. Workflow names can be renamed, and multiple workflow files can share the same name.

   In the mapping UI, enter these as key/value rows, such as **Key** `repository` with **Value** `my-org/my-repo`, **Key** `ref` with **Value** `refs/heads/main`, and **Key** `workflow_ref` with **Value** `my-org/my-repo/.github/workflows/deploy.yml@refs/heads/main`. If the job uses a GitHub environment, also add **Key** `environment` with **Value** `production`.

   > **Caution:** Avoid overly broad mappings, such as trusting only `repository_owner == "my-org"`, unless every repository in that owner namespace should be able to mint OpenAI access tokens.

3. **Choose the OpenAI target.** Set **Project** to the OpenAI project that owns the target service account. Set **Service account** to the OpenAI service account the GitHub workflow can use, such as `github-actions-prod-deploy`.

4. **Narrow API permissions if needed.** Select appropriate **Permissions** such as `api.model.request` and `api.vector_store.read` to further narrow access tokens minted from this mapping. Leave permissions blank to avoid adding a WIF-specific scope restriction; the token still authorizes as the mapped service account.

## Using the token in a workflow

Configure your OpenAI SDK client to request a GitHub OIDC token and exchange it for an OpenAI-issued access token.

The workflow must grant `id-token: write` permission and pass the workload identity federation settings to the SDK code. The SDK requests the GitHub OIDC token from the `ACTIONS_ID_TOKEN_REQUEST_URL` and `ACTIONS_ID_TOKEN_REQUEST_TOKEN` environment variables that GitHub exposes to the job, then uses the exchanged OpenAI access token to authenticate API requests.

For example, run your application code from a workflow like this:

```yaml
name: deploy

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4

      - name: Run OpenAI SDK code
        env:
          OPENAI_WIF_AUDIENCE: ${{ vars.OPENAI_WIF_AUDIENCE }}
          OPENAI_IDENTITY_PROVIDER_ID: ${{ vars.OPENAI_IDENTITY_PROVIDER_ID }}
          OPENAI_SERVICE_ACCOUNT_ID: ${{ vars.OPENAI_SERVICE_ACCOUNT_ID }}
        run: node ./scripts/call-openai.js
```

Store `OPENAI_WIF_AUDIENCE`, `OPENAI_IDENTITY_PROVIDER_ID`, and `OPENAI_SERVICE_ACCOUNT_ID` as GitHub Actions variables. They identify the provider and service account but are not bearer credentials.

The following examples initialize an OpenAI client with a custom subject token provider. The provider requests a GitHub OIDC token for the configured audience and uses it as the subject token for workload identity federation.

Authenticate from a GitHub Actions OIDC token

```javascript
import OpenAI from "openai";

const identityProviderId = process.env.OPENAI_IDENTITY_PROVIDER_ID;
const serviceAccountId = process.env.OPENAI_SERVICE_ACCOUNT_ID;
const audience = process.env.OPENAI_WIF_AUDIENCE;
const requestURL = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
const requestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;

if (
  !identityProviderId ||
  !serviceAccountId ||
  !audience ||
  !requestURL ||
  !requestToken
) {
  throw new Error(
    "Set OPENAI_IDENTITY_PROVIDER_ID, OPENAI_SERVICE_ACCOUNT_ID, OPENAI_WIF_AUDIENCE, and run inside GitHub Actions with id-token: write"
  );
}

/** @returns {import("openai/auth/index").SubjectTokenProvider} */
function githubActionsOIDCTokenProvider(requestURL, requestToken, audience) {
  return {
    tokenType: "jwt",
    getToken: async () => {
      const url = new URL(requestURL);
      url.searchParams.set("audience", audience);

      const response = await fetch(url, {
        headers: { Authorization: `bearer ${requestToken}` },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to request GitHub OIDC token: ${response.status} ${response.statusText}`
        );
      }

      const body = await response.json();
      if (!body.value) {
        throw new Error("GitHub OIDC token response did not include a value.");
      }

      return body.value;
    },
  };
}

const client = new OpenAI({
  workloadIdentity: {
    identityProviderId,
    serviceAccountId,
    provider: githubActionsOIDCTokenProvider(
      requestURL,
      requestToken,
      audience
    ),
  },
});

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "Say hello from GitHub Actions workload identity federation.",
});

console.log(response.output_text);
```

```python
import json
import os
import urllib.parse
import urllib.request

from openai import OpenAI
from openai.auth import SubjectTokenProvider


def github_actions_oidc_token_provider(audience: str) -> SubjectTokenProvider:
    request_url = os.environ["ACTIONS_ID_TOKEN_REQUEST_URL"]
    request_token = os.environ["ACTIONS_ID_TOKEN_REQUEST_TOKEN"]

    def get_token() -> str:
        parsed_url = urllib.parse.urlparse(request_url)
        query = dict(urllib.parse.parse_qsl(parsed_url.query, keep_blank_values=True))
        query["audience"] = audience
        url = urllib.parse.urlunparse(
            parsed_url._replace(query=urllib.parse.urlencode(query))
        )

        request = urllib.request.Request(
            url,
            headers={"Authorization": f"bearer {request_token}"},
        )
        with urllib.request.urlopen(request) as response:
            payload = json.loads(response.read().decode("utf-8"))

        token = payload.get("value")
        if not token:
            raise RuntimeError("GitHub OIDC token response did not include a value.")
        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": github_actions_oidc_token_provider(
            os.environ["OPENAI_WIF_AUDIENCE"]
        ),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from GitHub Actions workload identity federation.",
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

type githubActionsOIDCTokenProvider struct {
	requestURL   string
	requestToken string
	audience     string
}

func (p githubActionsOIDCTokenProvider) TokenType() auth.SubjectTokenType {
	return auth.SubjectTokenTypeJWT
}

func (p githubActionsOIDCTokenProvider) GetToken(ctx context.Context, httpClient auth.HTTPDoer) (string, error) {
	if httpClient == nil {
		httpClient = http.DefaultClient
	}

	oidcURL, err := url.Parse(p.requestURL)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "github-actions",
			Message:  "failed to parse GitHub OIDC request URL",
			Cause:    err,
		}
	}
	query := oidcURL.Query()
	query.Set("audience", p.audience)
	oidcURL.RawQuery = query.Encode()

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, oidcURL.String(), nil)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "github-actions",
			Message:  "failed to create GitHub OIDC token request",
			Cause:    err,
		}
	}
	req.Header.Set("Authorization", "bearer "+p.requestToken)

	resp, err := httpClient.Do(req)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "github-actions",
			Message:  "failed to request GitHub OIDC token",
			Cause:    err,
		}
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", &auth.SubjectTokenProviderError{
			Provider: "github-actions",
			Message:  fmt.Sprintf("GitHub OIDC token request failed with status %s", resp.Status),
		}
	}

	var body struct {
		Value string `json:"value"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "github-actions",
			Message:  "failed to decode GitHub OIDC token response",
			Cause:    err,
		}
	}
	if body.Value == "" {
		return "", &auth.SubjectTokenProviderError{
			Provider: "github-actions",
			Message:  "GitHub OIDC token response did not include a value",
		}
	}

	return body.Value, nil
}

func main() {
	client := openai.NewClient(
		option.WithWorkloadIdentity(auth.WorkloadIdentity{
			IdentityProviderID: os.Getenv("OPENAI_IDENTITY_PROVIDER_ID"),
			ServiceAccountID:   os.Getenv("OPENAI_SERVICE_ACCOUNT_ID"),
			Provider: githubActionsOIDCTokenProvider{
				requestURL:   os.Getenv("ACTIONS_ID_TOKEN_REQUEST_URL"),
				requestToken: os.Getenv("ACTIONS_ID_TOKEN_REQUEST_TOKEN"),
				audience:     os.Getenv("OPENAI_WIF_AUDIENCE"),
			},
		}),
	)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: openai.ChatModelGPT4_1Mini,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Say hello from GitHub Actions workload identity federation."),
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
import com.openai.errors.SubjectTokenProviderException;
import com.openai.models.responses.ResponseCreateParams;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;

public final class GitHubActionsWorkloadIdentityExample {
  private GitHubActionsWorkloadIdentityExample() {}

  static final class GitHubActionsOidcTokenProvider implements SubjectTokenProvider {
    private final String requestUrl;
    private final String requestToken;
    private final String audience;

    GitHubActionsOidcTokenProvider(String requestUrl, String requestToken, String audience) {
      this.requestUrl = requestUrl;
      this.requestToken = requestToken;
      this.audience = audience;
    }

    @Override
    public SubjectTokenType tokenType() {
      return SubjectTokenType.JWT;
    }

    @Override
    public String getToken(com.openai.core.http.HttpClient httpClient, JsonMapper jsonMapper) {
      try {
        String separator = requestUrl.contains("?") ? "&" : "?";
        URI uri =
            URI.create(
                requestUrl
                    + separator
                    + "audience="
                    + URLEncoder.encode(audience, StandardCharsets.UTF_8));

        HttpRequest request =
            HttpRequest.newBuilder(uri)
                .header("Authorization", "bearer " + requestToken)
                .GET()
                .build();

        HttpResponse<String> response =
            java.net.http.HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
          throw new SubjectTokenProviderException(
              "github-actions",
              "GitHub OIDC token request failed with status " + response.statusCode(),
              null);
        }

        JsonNode payload = jsonMapper.readTree(response.body());
        String token = payload.path("value").asText("");
        if (token.isEmpty()) {
          throw new SubjectTokenProviderException(
              "github-actions", "GitHub OIDC token response did not include a value", null);
        }

        return token;
      } catch (SubjectTokenProviderException e) {
        throw e;
      } catch (Exception e) {
        throw new SubjectTokenProviderException(
            "github-actions", "failed to request GitHub OIDC token", e);
      }
    }

    @Override
    public CompletableFuture<String> getTokenAsync(
        com.openai.core.http.HttpClient httpClient, JsonMapper jsonMapper) {
      return CompletableFuture.supplyAsync(() -> getToken(httpClient, jsonMapper));
    }
  }

  public static void main(String[] args) {
    WorkloadIdentity workloadIdentity =
        WorkloadIdentity.builder()
            .identityProviderId(System.getenv("OPENAI_IDENTITY_PROVIDER_ID"))
            .serviceAccountId(System.getenv("OPENAI_SERVICE_ACCOUNT_ID"))
            .provider(
                new GitHubActionsOidcTokenProvider(
                    System.getenv("ACTIONS_ID_TOKEN_REQUEST_URL"),
                    System.getenv("ACTIONS_ID_TOKEN_REQUEST_TOKEN"),
                    System.getenv("OPENAI_WIF_AUDIENCE")))
            .build();

    OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("gpt-5.6-terra")
            .input("Say hello from GitHub Actions workload identity federation.")
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

class GitHubActionsOIDCTokenProvider
  include OpenAI::Auth::SubjectTokenProvider

  def initialize(request_url:, request_token:, audience:)
    @request_url = request_url
    @request_token = request_token
    @audience = audience
  end

  def token_type
    OpenAI::Auth::TokenType::JWT
  end

  def get_token
    uri = URI(@request_url)
    params = URI.decode_www_form(uri.query || "")
    params.reject! { |key, _| key == "audience" }
    params << ["audience", @audience]
    uri.query = URI.encode_www_form(params)

    request = Net::HTTP::Get.new(uri)
    request["Authorization"] = "bearer #{@request_token}"

    response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") do |http|
      http.request(request)
    end

    unless response.is_a?(Net::HTTPSuccess)
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "GitHub OIDC token request failed with status #{response.code}",
        provider: "github-actions"
      )
    end

    token = JSON.parse(response.body).fetch("value", "").to_s
    if token.empty?
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "GitHub OIDC token response did not include a value",
        provider: "github-actions"
      )
    end

    token
  rescue JSON::ParserError, SystemCallError => e
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to request GitHub OIDC token: #{e.message}",
      provider: "github-actions",
      cause: e
    )
  end
end

provider = GitHubActionsOIDCTokenProvider.new(
  request_url: ENV.fetch("ACTIONS_ID_TOKEN_REQUEST_URL"),
  request_token: ENV.fetch("ACTIONS_ID_TOKEN_REQUEST_TOKEN"),
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
  input: "Say hello from GitHub Actions workload identity federation."
)

puts(response.output_text)
```


## GitHub Actions best practices

- Use environment protections for production deployments. Require approvals or branch restrictions before workflows can access production OpenAI resources.
- Restrict mappings by repository. Match on repository-specific claims whenever possible instead of allowing access from all repositories within an organization.
- Restrict mappings by branch or workflow. Consider matching claims such as `repository`, `ref`, `environment`, or `workflow_ref` to limit token issuance.
- Use separate OpenAI service accounts for CI/CD and production workloads. Build pipelines often require different permissions than deployed applications.
- Avoid granting access to pull requests from untrusted forks. Forked pull requests may execute attacker-controlled code and should not receive production credentials.
- Use short-lived exchanges. GitHub OIDC tokens are intended for ephemeral authentication and should be exchanged only when needed.
- Audit repository ownership changes. Repository transfers, renames, and permission changes can affect the security assumptions behind existing mappings.
- Prefer exact claim matching. Match on claims such as `repository`, `ref`, and `environment` instead of relying on organization-wide trust relationships.