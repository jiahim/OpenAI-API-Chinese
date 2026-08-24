# Configuring workload identity federation for Google Cloud

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use Google Cloud as a Workload Identity Provider in either of these scenarios:

- **Google workload identity:** Exchange a Google-signed OIDC token issued to an attached Google service account for a short-lived OpenAI access token.
- **Google Kubernetes Engine:** Exchange a projected GKE service account token for a short-lived OpenAI access token.



## Google workload identity

Google Cloud workloads can request signed OIDC identity tokens from the Google metadata server without storing long-lived service account keys. In OpenAI workload identity federation, the Google identity token is the subject token that OpenAI validates before issuing an OpenAI access token. This flow works on Compute Engine, Cloud Run, GKE workloads using attached Google service accounts, and other Google-managed runtimes that expose the metadata server identity endpoint.

### Setting up Google workload identity

Create a Google service account for the workload that needs to call the OpenAI API. For the full setup flow, see Google's guide to [create service accounts](https://docs.cloud.google.com/iam/docs/service-accounts-create).

For example, create a service account with the Google Cloud CLI:

```bash
gcloud iam service-accounts create openai-wif \
  --description="Service account for OpenAI workload identity federation" \
  --display-name="OpenAI workload identity federation"
```

Create the Compute Engine VM with the service account attached, or attach the service account to the Google Cloud resource running your application. The resource must be able to call the Google metadata server at runtime. For VM setup details, see Google's guide to [create a VM that uses a user-managed service account](https://docs.cloud.google.com/compute/docs/access/create-enable-service-accounts-for-instances).

Do not create or download service account keys for this flow. The workload uses the attached service account and the metadata server to request a short-lived OIDC token.

### Getting a Google identity token

From the Google Cloud resource with the service account attached, request an OIDC identity token from the metadata server with the configured audience. This token is the subject token that OpenAI exchanges for an OpenAI-issued access token.

```bash
AUDIENCE="https://api.openai.com/v1"

TOKEN=$(curl -sS -G -H "Metadata-Flavor: Google" \
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity" \
  --data-urlencode "audience=${AUDIENCE}")
export TOKEN
```

The metadata server returns a Google-signed JWT. For more information about the metadata server identity endpoint, see Google's guide to [verify VM identity](https://docs.cloud.google.com/compute/docs/instances/verifying-instance-identity).

### Verify the token

Before configuring workload identity federation, export the Google identity token as `TOKEN`, then run this script locally to inspect its claims:

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


This command decodes the JWT payload without verifying the token signature. Use a local decoder for production tokens, and avoid pasting production tokens into third-party tools.

A decoded Google metadata server identity token will look similar to:

```json
{
  "iss": "https://accounts.google.com",
  "aud": "https://api.openai.com/v1",
  "azp": "110123456789012345678",
  "sub": "110123456789012345678",
  "email": "openai-wif@my-project.iam.gserviceaccount.com",
  "email_verified": true,
  "iat": 1716235422,
  "exp": 1716239022
}
```

Use the decoded payload to compare the token you received with the issuer, audience, and mapping values configured in OpenAI. Most configuration issues are visible in the `iss`, `aud`, `email`, and `sub` claims before you exchange the token.

### Setting up workload identity federation

Create a Workload Identity Provider in OpenAI for Google-issued identity tokens, then add a service account mapping that matches stable claims from the token.

Configure the Workload Identity Provider first, then create the service account mapping.

#### Set up the Workload Identity Provider

1. **Create the Workload Identity Provider.** Set **Name** to a unique value, such as `google-workload-identity-prod`. Use **Description**, such as `Production Google Cloud workloads`, to help admins identify the provider.

2. **Set the issuer and audience.** Set **OIDC Issuer URL** to `https://accounts.google.com`. Set **Audience** to the custom audience your workload requests from the Google metadata server, such as `https://api.openai.com/v1`. This value must match the token's `aud` claim.

3. **Use Google OIDC discovery.** Leave **Use uploaded JWKS for token verification** disabled. OpenAI uses Google's OIDC discovery metadata and JWKS to verify the Google-signed identity token.

4. **Add attribute transformations if you need derived mapping attributes.** For example, enter `subject` with expression `assertion.sub` to create `openai.subject` from the subject claim. The dashboard applies the `openai.` prefix automatically. Raw token claims that already start with `openai.` are ignored for `openai.` mapping keys unless a matching transformation is configured.

#### Set up the service account mapping

1. **Create a service account mapping.** Set **Name** to a unique value within the Workload Identity Provider, such as `compute-openai-wif`. Use **Description**, such as `Production Compute Engine OpenAI API workload`, to explain which workload can use the mapping.

2. **Match stable Google service account claims.** Add one **Key** and **Value** row for each claim that must match. Use `sub` as the primary identity binding because it is stable and unique. You may additionally match `email` for readability.

3. **Choose the OpenAI target.** Set **Project** to the OpenAI project that owns the target service account. Set **Service account** to the OpenAI service account the Google Cloud workload can use, such as `google-workload-identity-prod-openai-wif`.

4. **Narrow API permissions if needed.** Select appropriate **Permissions** such as `api.model.request` and `api.vector_store.read` to further narrow access tokens minted from this mapping. Leave permissions blank to avoid adding a WIF-specific scope restriction; the token still authorizes as the mapped service account.

### Using the token in code

Configure your OpenAI SDK client to request a Google identity token from the metadata server and exchange it for an OpenAI-issued access token.

Set `OPENAI_WIF_AUDIENCE` to the custom audience configured as the Workload Identity Provider audience. The SDK requests a Google identity token for that audience, exchanges it for an OpenAI-issued access token, and uses the OpenAI token to authenticate API requests.

Authenticate from a Google metadata server identity token

```javascript
import OpenAI from "openai";

const metadataEndpoint =
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity";

const identityProviderId = process.env.OPENAI_IDENTITY_PROVIDER_ID;
const serviceAccountId = process.env.OPENAI_SERVICE_ACCOUNT_ID;
const audience = process.env.OPENAI_WIF_AUDIENCE;

if (!identityProviderId || !serviceAccountId || !audience) {
  throw new Error(
    "Set OPENAI_IDENTITY_PROVIDER_ID, OPENAI_SERVICE_ACCOUNT_ID, and OPENAI_WIF_AUDIENCE"
  );
}

/** @returns {import("openai/auth/index").SubjectTokenProvider} */
function googleMetadataIdentityTokenProvider(audience) {
  return {
    tokenType: "jwt",
    getToken: async () => {
      const url = new URL(metadataEndpoint);
      url.searchParams.set("audience", audience);
      url.searchParams.set("format", "full");

      const response = await fetch(url, {
        headers: { "Metadata-Flavor": "Google" },
      });

      if (!response.ok) {
        throw new Error(
          `Google metadata token request failed with status ${response.status}.`
        );
      }

      const token = (await response.text()).trim();
      if (!token) {
        throw new Error(
          "Google metadata server did not return an identity token."
        );
      }

      return token;
    },
  };
}

const client = new OpenAI({
  workloadIdentity: {
    identityProviderId,
    serviceAccountId,
    provider: googleMetadataIdentityTokenProvider(audience),
  },
});

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "Say hello from Google Cloud workload identity federation.",
});

console.log(response.output_text);
```

```python
import os
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from openai import OpenAI
from openai.auth import SubjectTokenProvider

METADATA_ENDPOINT = (
    "http://metadata.google.internal/computeMetadata/v1/instance/"
    "service-accounts/default/identity"
)


def google_metadata_identity_token_provider(audience: str) -> SubjectTokenProvider:
    def get_token() -> str:
        request = Request(
            f"{METADATA_ENDPOINT}?{urlencode({'audience': audience, 'format': 'full'})}",
            headers={"Metadata-Flavor": "Google"},
        )

        with urlopen(request, timeout=10) as response:
            token = response.read().decode("utf-8").strip()

        if not token:
            raise RuntimeError(
                "Google metadata server did not return an identity token."
            )
        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": google_metadata_identity_token_provider(
            audience=os.environ["OPENAI_WIF_AUDIENCE"]
        ),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from Google Cloud workload identity federation.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/auth"
	"github.com/openai/openai-go/v3/option"
	"github.com/openai/openai-go/v3/responses"
)

const googleMetadataEndpoint = "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity"

type googleMetadataIdentityTokenProvider struct {
	audience string
}

func (p googleMetadataIdentityTokenProvider) TokenType() auth.SubjectTokenType {
	return auth.SubjectTokenTypeJWT
}

func (p googleMetadataIdentityTokenProvider) GetToken(ctx context.Context, httpClient auth.HTTPDoer) (string, error) {
	values := url.Values{}
	values.Set("audience", p.audience)
	values.Set("format", "full")

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, googleMetadataEndpoint+"?"+values.Encode(), nil)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-metadata",
			Message:  "failed to build Google metadata token request",
			Cause:    err,
		}
	}
	req.Header.Set("Metadata-Flavor", "Google")

	resp, err := httpClient.Do(req)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-metadata",
			Message:  "failed to request Google identity token",
			Cause:    err,
		}
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-metadata",
			Message:  fmt.Sprintf("Google metadata token request failed with status %d", resp.StatusCode),
		}
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-metadata",
			Message:  "failed to read Google metadata token response",
			Cause:    err,
		}
	}

	token := strings.TrimSpace(string(data))
	if token == "" {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-metadata",
			Message:  "Google metadata server did not return an identity token",
		}
	}

	return token, nil
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
			Provider: googleMetadataIdentityTokenProvider{
				audience: audience,
			},
		}),
	)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: openai.ChatModelGPT4_1Mini,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Say hello from Google Cloud workload identity federation."),
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
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.CompletableFuture;

public final class GoogleWorkloadIdentityExample {
  private static final String METADATA_ENDPOINT =
      "http://metadata.google.internal/computeMetadata/v1/instance/"
          + "service-accounts/default/identity";

  private GoogleWorkloadIdentityExample() {}

  static final class GoogleMetadataIdentityTokenProvider implements SubjectTokenProvider {
    private final String audience;

    GoogleMetadataIdentityTokenProvider(String audience) {
      this.audience = audience;
    }

    @Override
    public SubjectTokenType tokenType() {
      return SubjectTokenType.JWT;
    }

    @Override
    public String getToken(HttpClient httpClient, JsonMapper jsonMapper) {
      try {
        String query =
            "audience=" + URLEncoder.encode(audience, StandardCharsets.UTF_8) + "&format=full";
        HttpRequest request =
            HttpRequest.newBuilder()
                .uri(URI.create(METADATA_ENDPOINT + "?" + query))
                .header("Metadata-Flavor", "Google")
                .GET()
                .build();

        HttpResponse<String> response =
            java.net.http.HttpClient.newHttpClient()
                .send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
          throw new SubjectTokenProviderException(
              "google-metadata",
              "Google metadata token request failed with status " + response.statusCode(),
              null);
        }

        String token = response.body().trim();
        if (token.isEmpty()) {
          throw new SubjectTokenProviderException(
              "google-metadata", "Google metadata server did not return an identity token", null);
        }

        return token;
      } catch (SubjectTokenProviderException e) {
        throw e;
      } catch (Exception e) {
        throw new SubjectTokenProviderException(
            "google-metadata", "failed to request Google identity token", e);
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
            .provider(new GoogleMetadataIdentityTokenProvider(System.getenv("OPENAI_WIF_AUDIENCE")))
            .build();

    OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("gpt-5.6-terra")
            .input("Say hello from Google Cloud workload identity federation.")
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
require "net/http"
require "openai"
require "uri"

class GoogleMetadataIdentityTokenProvider
  include OpenAI::Auth::SubjectTokenProvider

  METADATA_ENDPOINT =
    "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity"

  def initialize(audience:)
    @audience = audience
  end

  def token_type
    OpenAI::Auth::TokenType::ID
  end

  def get_token
    uri = URI(METADATA_ENDPOINT)
    uri.query = URI.encode_www_form(
      audience: @audience,
      format: "full"
    )

    request = Net::HTTP::Get.new(uri)
    request["Metadata-Flavor"] = "Google"

    response = Net::HTTP.start(uri.hostname, uri.port, read_timeout: 10) do |http|
      http.request(request)
    end

    unless response.is_a?(Net::HTTPSuccess)
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "Google metadata token request failed with status #{response.code}",
        provider: "google-metadata"
      )
    end

    token = response.body.strip
    if token.empty?
      raise OpenAI::Errors::SubjectTokenProviderError.new(
        message: "Google metadata server did not return an identity token",
        provider: "google-metadata"
      )
    end
    token
  rescue SystemCallError => e
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to request Google identity token: #{e.message}",
      provider: "google-metadata",
      cause: e
    )
  end
end

provider = GoogleMetadataIdentityTokenProvider.new(
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
  input: "Say hello from Google Cloud workload identity federation."
)

puts(response.output_text)
```


  


  


## Google Kubernetes Engine

Use Google Kubernetes Engine as a Workload Identity Provider by exchanging a GKE-issued projected service account token for a short-lived OpenAI access token.

GKE workloads can authenticate using either:

- A projected Kubernetes service account token issued by the cluster OIDC issuer.
- A Google service account identity token obtained through GKE Workload Identity, where a Kubernetes service account is bound to a Google service account.

Use projected Kubernetes service account tokens when you want OpenAI to trust the cluster's OIDC issuer directly. Use GKE Workload Identity when your workload already relies on a Google service account identity and you want OpenAI to trust Google-issued identity tokens instead.

If your GKE workload is configured with GKE Workload Identity and can request
  Google identity tokens from the metadata server, follow the [Google workload
  identity](#google-workload-identity) instructions above instead of the GKE
  projected token flow.

### Setting up GKE

These instructions assume a managed GKE cluster. For a self-managed Kubernetes cluster, use the [Kubernetes guide](https://developers.openai.com/api/docs/guides/workload-identity-federation/kubernetes).

Use a Kubernetes `ServiceAccount` for the GKE workload that needs to call the OpenAI API. If you do not already have one, create it:

```bash
kubectl create serviceaccount openai-wif --namespace default
```

Retrieve the issuer URL associated with the GKE cluster:

```bash
kubectl get --raw /.well-known/openid-configuration | jq -r .issuer
```

Example output:

```text
https://container.googleapis.com/v1/projects/my-project/locations/us-central1/clusters/openai-wif
```

The issuer you configure in the OpenAI Workload Identity Provider must match this issuer URL and the `iss` claim in the projected GKE service account token.

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
        - name: gke-sa-token
          mountPath: /var/run/secrets/tokens
          readOnly: true
  volumes:
    - name: gke-sa-token
      projected:
        sources:
          - serviceAccountToken:
              path: token
              audience: "https://api.openai.com/v1"
              expirationSeconds: 3600
```

### Verify the token

Before configuring workload identity federation, decode a sample projected service account token locally and inspect its claims. From a running pod with the projected token mounted, retrieve the token and export it as `TOKEN`:

```bash
TOKEN=$(kubectl exec -n default openai-wif-app -- cat /var/run/secrets/tokens/token)
export TOKEN
```

Then run this script:

```python
import base64
import json
import os

payload = os.environ["TOKEN"].split(".")[1]
payload += "=" * (-len(payload) % 4)
print(json.dumps(json.loads(base64.urlsafe_b64decode(payload)), indent=2))
```


This command decodes the JWT payload without verifying the token signature. Use a local decoder for production tokens, and avoid pasting production tokens into third-party tools.

A decoded GKE projected service account token will look similar to:

```json
{
  "iss": "https://container.googleapis.com/v1/projects/my-project/locations/us-central1/clusters/openai-wif",
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

### Setting up workload identity federation

Create a Workload Identity Provider in OpenAI for the GKE issuer, then add a service account mapping that matches attributes from the projected token.

Configure the Workload Identity Provider first, then create the service account mapping.

#### Set up the Workload Identity Provider

1. **Create the Workload Identity Provider.** Set **Name** to a unique value, such as `google-gke-prod`. Use **Description**, such as `Production GKE cluster`, to help admins identify the cluster.

2. **Set the issuer and audience.** Set **OIDC Issuer URL** to the issuer returned by `kubectl get --raw /.well-known/openid-configuration | jq -r .issuer`. This value must match the `iss` claim in the projected GKE service account token. Set **Audience** to the same audience configured on the projected service account token volume. In this example, that value is `https://api.openai.com/v1`.

3. **Use GKE OIDC discovery.** Leave **Use uploaded JWKS for token verification** disabled. OpenAI uses the GKE issuer's OIDC discovery metadata and JWKS to verify the projected service account token.

4. **Add attribute transformations if you need derived mapping attributes.** For example, enter `gke_subject` with expression `assertion.sub` to create `openai.gke_subject`. The dashboard applies the `openai.` prefix automatically. Raw token claims that already start with `openai.` are ignored for `openai.` mapping keys unless a matching transformation is configured.

#### Set up the service account mapping

1. **Create a service account mapping.** Set **Name** to a unique value within the Workload Identity Provider, such as `default-openai-wif`. Use **Description**, such as `Default namespace GKE OpenAI API workload`, to explain which workload can use the mapping.

2. **Match the GKE service account subject.** Set **Key** to `sub` and **Value** to `system:serviceaccount:default:openai-wif`. For GKE service accounts, the subject format is `system:serviceaccount:<namespace>:<service-account-name>`.

3. **Choose the OpenAI target.** Set **Project** to the OpenAI project that owns the target service account. Set **Service account** to the OpenAI service account the GKE workload can use, such as `google-gke-prod-openai-wif`.

4. **Narrow API permissions if needed.** Select appropriate **Permissions** such as `api.model.request` and `api.vector_store.read` to further narrow access tokens minted from this mapping. Leave permissions blank to avoid adding a WIF-specific scope restriction; the token still authorizes as the mapped service account.

### Using the token in code

Configure your OpenAI SDK client to read the projected GKE service account token and exchange it for an OpenAI-issued access token.

Use the mounted token path, such as `/var/run/secrets/tokens/token`, as the subject token source for the SDK workload identity federation provider. The SDK exchanges that GKE token for an OpenAI-issued access token and uses the OpenAI token to authenticate API requests.

The following examples initialize an OpenAI client with a custom subject token provider. The provider reads the projected GKE service account token from the mounted file path and uses it as the subject token for workload identity federation.

Authenticate from a GKE projected service account token

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
function mountedGkeServiceAccountTokenProvider(path) {
  return {
    tokenType: "jwt",
    getToken: async () => {
      const token = (await readFile(path, "utf8")).trim();
      if (!token) {
        throw new Error("The mounted GKE service account token file is empty.");
      }
      return token;
    },
  };
}

const client = new OpenAI({
  workloadIdentity: {
    identityProviderId,
    serviceAccountId,
    provider: mountedGkeServiceAccountTokenProvider(tokenPath),
  },
});

const response = await client.responses.create({
  model: "gpt-5.6-terra",
  input: "Say hello from Google GKE workload identity federation.",
});

console.log(response.output_text);
```

```python
import os
from pathlib import Path

from openai import OpenAI
from openai.auth import SubjectTokenProvider

TOKEN_PATH = "/var/run/secrets/tokens/token"


def mounted_gke_service_account_token_provider(token_path: str) -> SubjectTokenProvider:
    def get_token() -> str:
        token = Path(token_path).read_text().strip()
        if not token:
            raise RuntimeError("The mounted GKE service account token file is empty.")
        return token

    return {"token_type": "jwt", "get_token": get_token}


client = OpenAI(
    workload_identity={
        "identity_provider_id": os.environ["OPENAI_IDENTITY_PROVIDER_ID"],
        "service_account_id": os.environ["OPENAI_SERVICE_ACCOUNT_ID"],
        "provider": mounted_gke_service_account_token_provider(TOKEN_PATH),
    },
)

response = client.responses.create(
    model="gpt-5.6-terra",
    input="Say hello from Google GKE workload identity federation.",
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

type mountedGkeServiceAccountTokenProvider struct {
	path string
}

func (p mountedGkeServiceAccountTokenProvider) TokenType() auth.SubjectTokenType {
	return auth.SubjectTokenTypeJWT
}

func (p mountedGkeServiceAccountTokenProvider) GetToken(_ context.Context, _ auth.HTTPDoer) (string, error) {
	data, err := os.ReadFile(p.path)
	if err != nil {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-gke",
			Message:  "failed to read mounted GKE service account token",
			Cause:    err,
		}
	}

	token := strings.TrimSpace(string(data))
	if token == "" {
		return "", &auth.SubjectTokenProviderError{
			Provider: "google-gke",
			Message:  "mounted GKE service account token is empty",
		}
	}

	return token, nil
}

func main() {
	client := openai.NewClient(
		option.WithWorkloadIdentity(auth.WorkloadIdentity{
			IdentityProviderID: os.Getenv("OPENAI_IDENTITY_PROVIDER_ID"),
			ServiceAccountID:   os.Getenv("OPENAI_SERVICE_ACCOUNT_ID"),
			Provider: mountedGkeServiceAccountTokenProvider{
				path: tokenPath,
			},
		}),
	)

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: openai.ChatModelGPT4_1Mini,
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Say hello from Google GKE workload identity federation."),
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

public final class GoogleGkeWorkloadIdentityExample {
  private static final String TOKEN_PATH = "/var/run/secrets/tokens/token";

  private GoogleGkeWorkloadIdentityExample() {}

  static final class MountedGkeServiceAccountTokenProvider implements SubjectTokenProvider {
    private final Path tokenPath;

    MountedGkeServiceAccountTokenProvider(String tokenPath) {
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
            "google-gke", "failed to read mounted GKE service account token", e);
      }

      if (token.isEmpty()) {
        throw new SubjectTokenProviderException(
            "google-gke", "mounted GKE service account token is empty", null);
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
            .provider(new MountedGkeServiceAccountTokenProvider(TOKEN_PATH))
            .build();

    OpenAIClient client = OpenAIOkHttpClient.builder().workloadIdentity(workloadIdentity).build();

    ResponseCreateParams params =
        ResponseCreateParams.builder()
            .model("gpt-5.6-terra")
            .input("Say hello from Google GKE workload identity federation.")
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

class MountedGkeServiceAccountTokenProvider
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
        message: "Mounted GKE service account token is empty",
        provider: "google-gke"
      )
    end
    token
  rescue SystemCallError => e
    raise OpenAI::Errors::SubjectTokenProviderError.new(
      message: "Failed to read mounted GKE service account token: #{e.message}",
      provider: "google-gke",
      cause: e
    )
  end
end

provider = MountedGkeServiceAccountTokenProvider.new(token_path: TOKEN_PATH)

workload_identity = OpenAI::Auth::WorkloadIdentity.new(
  identity_provider_id: ENV.fetch("OPENAI_IDENTITY_PROVIDER_ID"),
  service_account_id: ENV.fetch("OPENAI_SERVICE_ACCOUNT_ID"),
  provider: provider
)

client = OpenAI::Client.new(workload_identity: workload_identity)

response = client.responses.create(
  model: "gpt-5.6-terra",
  input: "Say hello from Google GKE workload identity federation."
)

puts(response.output_text)
```



## Google Cloud best practices

- Use dedicated Google service accounts for each workload. Avoid sharing service accounts across unrelated services or environments.
- Use workload identity flows instead of long-lived service account keys. Avoid distributing and rotating JSON key files for workloads that can use metadata-server identity tokens or GKE Workload Identity.
- Scope identities to the smallest practical workload boundary. Separate service accounts for individual applications provide clearer auditing and least-privilege access.
- Use attribute-based mappings carefully. Prefer stable identifiers such as service account subject claims over mutable metadata where possible.
- Separate production and non-production projects. Distinct projects reduce the risk of accidental privilege sharing and simplify auditing.
- Grant only required IAM permissions. Restrict the Google identity to only the permissions required for the workload.
- Monitor service account usage. Unexpected token exchanges may indicate configuration drift or compromised workloads.