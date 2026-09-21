# Vaults

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

A vault stores credentials outside your agent's instructions and configuration. Attach it to a session with `vault_ids` so the session can use those credentials.

Choose the credential type based on where the request runs:

| Request                                   | Credential type                | How the session uses the credential                                                                                                      |
| ----------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| MCP connection from OpenAI                | `static_bearer` or `mcp_oauth` | OpenAI authenticates to the configured MCP server.                                                                                       |
| API request from an OpenAI-hosted sandbox | `environment_variable`         | Code uses an environment variable containing a placeholder. A network proxy replaces the placeholder with the secret for approved hosts. |

For example, a sandbox can use a vault secret to call the GitHub REST API. Follow [Use vault secrets for API requests from a sandbox](#use-vault-secrets-for-api-requests-from-a-sandbox).

Retrieving a vault or credential does not return its secret values. For other MCP connections, see [MCP authentication options](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#add-authentication).

## Permissions

For a restricted application key, grant:

- `api.vaults.read` to list and retrieve vaults and credentials.
- `api.vaults.write` to create, update, or delete them.








## Create and use a vault for MCP secrets

Use your API client, the MCP server URL (`mcp_url`), and an access token for that server (`access_token`). The examples use GitHub tools.

First, create a vault:

Create a vault

```javascript
const vault = await client.beta.agents.vaults.create({
  name: "GitHub credentials",
  metadata: {
    external_user_id: "user_123",
  },
});
```

```python
vault = client.beta.agents.vaults.create(
    name="GitHub credentials", metadata={"external_user_id": "user_123"}
)
```

```go
vault, err := client.Beta.Agents.Vaults.New(ctx,
	openai.BetaAgentVaultNewParams{
		Name:     openai.String("GitHub credentials"),
		Metadata: map[string]string{"external_user_id": "user_123"},
	})
if err != nil {
	panic(err)
}
```

```java
var vault =
    client
        .beta()
        .agents()
        .vaults()
        .create(
            VaultCreateParams.builder()
                .name("GitHub credentials")
                .metadata(
                    VaultCreateParams.Metadata.builder()
                        .putAdditionalProperty("external_user_id", JsonValue.from("user_123"))
                        .build())
                .build());
```

```ruby
vault = client.beta.agents.vaults.create(
  name: "GitHub credentials",
  metadata: { external_user_id: "user_123" }
)
```


Save its ID as `vault_id`, then add the token. `mcp_server_url` binds the credential to that server:

Store a bearer token

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.
const vaultId = "vault_123";
const mcpUrl = "https://api.githubcopilot.com/mcp/";
const accessToken = process.env.GITHUB_TOKEN;

const credential = await client.beta.agents.vaults.credentials.create(vaultId, {
  name: "GitHub access token",
  auth: {
    type: "static_bearer",
    mcp_server_url: mcpUrl,
    token: accessToken,
  },
});
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.
vault_id = "vault_123"
mcp_url = "https://api.githubcopilot.com/mcp/"
access_token = os.environ["GITHUB_TOKEN"]

credential = client.beta.agents.vaults.credentials.create(
    vault_id,
    name="GitHub access token",
    auth={
        "type": "static_bearer",
        "mcp_server_url": mcp_url,
        "token": access_token,
    },
)
```

```go
// Replace the illustrative IDs and URLs below with your own resource values.
vaultId := "vault_123"
mcpUrl := "https://api.githubcopilot.com/mcp/"
accessToken := os.Getenv("GITHUB_TOKEN")

credential, err := client.Beta.Agents.Vaults.Credentials.New(ctx,
	vaultId,
	openai.BetaAgentVaultCredentialNewParams{
		Name: "GitHub access token",
		Auth: openai.CredentialAuthCreateParamUnion{
			OfParamStaticBearer: &openai.CredentialAuthCreateParamStaticBearer{
				McpServerURL: mcpUrl,
				Token:        accessToken,
			},
		},
	})
if err != nil {
	panic(err)
}
```

```java
// Replace the illustrative IDs and URLs below with your own resource values.
String vaultId = "vault_123";
String mcpUrl = "https://api.githubcopilot.com/mcp/";
String accessToken = System.getenv("GITHUB_TOKEN");

var credential =
    client
        .beta()
        .agents()
        .vaults()
        .credentials()
        .create(
            CredentialCreateParams.builder()
                .vaultId(vaultId)
                .name("GitHub access token")
                .auth(
                    CredentialAuthCreateParam.StaticBearer.builder()
                        .mcpServerUrl(mcpUrl)
                        .token(accessToken)
                        .build())
                .build());
```

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
vault_id = "vault_123"
mcp_url = "https://api.githubcopilot.com/mcp/"
access_token = ENV.fetch("GITHUB_TOKEN")

credential = client.beta.agents.vaults.credentials.create(
  vault_id,
  name: "GitHub access token",
  auth: {
    type: "static_bearer",
    mcp_server_url: mcp_url,
    token: access_token
  }
)
```


Save the credential ID as `credential_id` for later updates.




Pass the saved ID in `vault_ids` when creating a session. Use the same server URL in the MCP configuration:

Attach the vault to a session

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.
const mcpUrl = "https://api.githubcopilot.com/mcp/";
const vaultId = "vault_123";

const session = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    tools: [
      {
        type: "mcp",
        server_label: "github",
        transport: {
          type: "http",
          server_url: mcpUrl,
        },
        allowed_tools: ["search_issues", "issue_read"],
        required: true,
        connection_origin: "service",
      },
    ],
  },
  environment: {
    type: "none",
  },
  input: "Find open bugs reported in the last week.",
  vault_ids: [vaultId],
});
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.
mcp_url = "https://api.githubcopilot.com/mcp/"
vault_id = "vault_123"

session = client.beta.agents.sessions.create(
    agent={
        "model": "gpt-6-astra",
        "tools": [
            {
                "type": "mcp",
                "server_label": "github",
                "transport": {
                    "type": "http",
                    "server_url": mcp_url,
                },
                "allowed_tools": ["search_issues", "issue_read"],
                "required": True,
                "connection_origin": "service",
            }
        ],
    },
    environment={"type": "none"},
    input="Find open bugs reported in the last week.",
    vault_ids=[vault_id],
)
```

```go
// Replace the illustrative IDs and URLs below with your own resource values.
mcpUrl := "https://api.githubcopilot.com/mcp/"
vaultId := "vault_123"

session, err := client.Beta.Agents.Sessions.New(ctx,
	openai.BetaAgentSessionNewParams{
		Agent: openai.BetaAgentSessionNewParamsAgent{
			Model: openai.String("gpt-6-astra"),
			Tools: []openai.AgentToolParamUnion{
				{
					OfParamMcp: &openai.AgentToolParamMcp{
						ServerLabel:      "github",
						Transport:        openai.McpTransportParamUnion{OfParamHTTP: &openai.McpTransportParamHTTP{ServerURL: mcpUrl}},
						AllowedTools:     []string{"search_issues", "issue_read"},
						Required:         openai.Bool(true),
						ConnectionOrigin: "service",
					},
				},
			},
		},
		Environment: openai.EnvironmentParamUnion{OfParamNone: &openai.EnvironmentParamNone{}},
		Input:       openai.BetaAgentSessionNewParamsInputUnion{OfString: openai.String("Find open bugs reported in the last week.")},
		VaultIDs:    []string{vaultId},
	})
if err != nil {
	panic(err)
}
```

```java
// Replace the illustrative IDs and URLs below with your own resource values.
String mcpUrl = "https://api.githubcopilot.com/mcp/";
String vaultId = "vault_123";

var session =
    client
        .beta()
        .agents()
        .sessions()
        .create(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .addTool(
                            AgentToolParam.Mcp.builder()
                                .serverLabel("github")
                                .transport(
                                    McpTransportParam.Http.builder().serverUrl(mcpUrl).build())
                                .allowedTools(List.of("search_issues", "issue_read"))
                                .required(true)
                                .connectionOrigin(
                                    AgentToolParam.Mcp.ConnectionOrigin.of("service"))
                                .build())
                        .build())
                .environmentNone()
                .input("Find open bugs reported in the last week.")
                .vaultIds(List.of(vaultId))
                .build());
```

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
mcp_url = "https://api.githubcopilot.com/mcp/"
vault_id = "vault_123"

session = client.beta.agents.sessions.create(
  agent: {
    model: "gpt-6-astra",
    tools: [
      {
        type: "mcp",
        server_label: "github",
        transport: {
          type: "http",
          server_url: mcp_url
        },
        allowed_tools: [
          "search_issues",
          "issue_read"
        ],
        required: true,
        connection_origin: "service"
      }
    ]
  },
  environment: { type: "none" },
  input: "Find open bugs reported in the last week.",
  vault_ids: [vault_id]
)
```


The Agents API selects a credential that matches the server URL. If several attached credentials match, set the MCP tool's `credential_id` to select one.




## Use vault secrets for API requests from a sandbox

Use an `environment_variable` credential to supply a secret for API requests from an OpenAI-hosted sandbox. The sandbox receives a placeholder in the named environment variable. The real secret stays outside the sandbox.

This workflow requires an `openai_hosted` environment. It does not supply credentials to self-hosted environments or application-run [function tools](https://developers.openai.com/api/docs/guides/agents-api/tools/functions).

### Store the API token

Create a vault as shown above. Then send a credential creation request to `POST /v1/vaults/{vault_id}/credentials` with these fields:

| Field                           | Value for a GitHub API token                                            |
| ------------------------------- | ----------------------------------------------------------------------- |
| `name`                          | `GitHub API token`                                                      |
| `auth.type`                     | `environment_variable`                                                  |
| `auth.secret_name`              | `GITHUB_TOKEN`                                                          |
| `auth.secret_value`             | The token, read from a secret environment variable in your application. |
| `auth.networking.type`          | `limited`                                                               |
| `auth.networking.allowed_hosts` | `["api.github.com"]`                                                    |

`secret_name` is the environment variable that sandbox code reads. `secret_value` is the real credential. Keep it out of prompts, source files, and logs.

Use exact host names in `allowed_hosts`, without a scheme, path, port, or wildcard. The proxy supplies secrets only to HTTPS destinations on port 443 or 8443.

### Attach the vault to a hosted session

Include the following fields alongside `agent` when [creating a session](https://developers.openai.com/api/docs/guides/agents-api/sessions#create-a-session). Replace `vault_123` with the vault ID returned by the API:

```json
{
  "vault_ids": ["vault_123"],
  "environment": {
    "type": "openai_hosted",
    "network": {
      "access": "restricted",
      "allowed_domains": ["api.github.com"]
    }
  }
}
```

The two host lists control different things. `allowed_domains` lets the sandbox connect to a host. The credential's `allowed_hosts` lets the proxy supply the secret to that host.

With restricted network access, include every credential host in `allowed_domains`. Do not set `network.access` to `disabled` for a session with environment credentials.

Each attached environment credential must have a unique `secret_name`. Do not also define that name in `environment.env`.

### Call the API from the sandbox

[Send the agent a message](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input) asking it to run this command in the sandbox:

```bash
curl https://api.github.com/user \
  -H "Authorization: Bearer $GITHUB_TOKEN"
```

The command reads the placeholder from `GITHUB_TOKEN`. The proxy replaces it with the real token before sending the request to `api.github.com`. A successful request returns the authenticated GitHub user's account details as JSON. Printing the variable inside the sandbox shows the placeholder, not the token.

Pass the placeholder unchanged in the HTTPS request header. It cannot supply the real secret for local computation, such as signing a request. For those tasks, keep the credential in your application and expose the operation through a [function tool](https://developers.openai.com/api/docs/guides/agents-api/tools/functions).




## Use OAuth credentials

Your application handles the provider's authorization and consent flow. Store the resulting grant with `auth.type: "mcp_oauth"`. Set `expires_at` to the access token's expiry as an RFC 3339 timestamp, if known.

The following example uses values from your provider's OAuth flow. Include `refresh` to let the Agents API refresh the token:

Store an OAuth grant

```javascript
// Replace the illustrative expiry with your access token's actual expiry.
// Replace the illustrative IDs and URLs below with your own resource values.
const vaultId = "vault_123";
const mcpUrl = "https://mcp.example.com/mcp";
const accessToken = process.env.OAUTH_ACCESS_TOKEN;
const expiresAt = "2030-01-01T00:00:00Z";
const tokenEndpoint = "https://auth.example.com/oauth/token";
const clientId = "example-client-id";
const refreshToken = process.env.OAUTH_REFRESH_TOKEN;

const credential = await client.beta.agents.vaults.credentials.create(vaultId, {
  name: "Example MCP OAuth credential",
  auth: {
    type: "mcp_oauth",
    mcp_server_url: mcpUrl,
    access_token: accessToken,
    expires_at: expiresAt,
    refresh: {
      token_endpoint: tokenEndpoint,
      client_id: clientId,
      refresh_token: refreshToken,
      token_endpoint_auth: {
        type: "none",
      },
    },
  },
});
```

```python
# Replace the illustrative expiry with your access token's actual expiry.
# Replace the illustrative IDs and URLs below with your own resource values.
vault_id = "vault_123"
mcp_url = "https://mcp.example.com/mcp"
access_token = os.environ["OAUTH_ACCESS_TOKEN"]
expires_at = "2030-01-01T00:00:00Z"
token_endpoint = "https://auth.example.com/oauth/token"
client_id = "example-client-id"
refresh_token = os.environ["OAUTH_REFRESH_TOKEN"]

credential = client.beta.agents.vaults.credentials.create(
    vault_id,
    name="Example MCP OAuth credential",
    auth={
        "type": "mcp_oauth",
        "mcp_server_url": mcp_url,
        "access_token": access_token,
        "expires_at": expires_at,
        "refresh": {
            "token_endpoint": token_endpoint,
            "client_id": client_id,
            "refresh_token": refresh_token,
            "token_endpoint_auth": {"type": "none"},
        },
    },
)
```

```go
// Replace the illustrative expiry with your access token's actual expiry.
// Replace the illustrative IDs and URLs below with your own resource values.
vaultId := "vault_123"
mcpUrl := "https://mcp.example.com/mcp"
accessToken := os.Getenv("OAUTH_ACCESS_TOKEN")
expiresAt := "2030-01-01T00:00:00Z"
tokenEndpoint := "https://auth.example.com/oauth/token"
clientId := "example-client-id"
refreshToken := os.Getenv("OAUTH_REFRESH_TOKEN")

credential, err := client.Beta.Agents.Vaults.Credentials.New(ctx,
	vaultId,
	openai.BetaAgentVaultCredentialNewParams{
		Name: "Example MCP OAuth credential",
		Auth: openai.CredentialAuthCreateParamUnion{
			OfParamMcpOAuth: &openai.CredentialAuthCreateParamMcpOAuth{
				McpServerURL: mcpUrl,
				AccessToken:  accessToken,
				ExpiresAt:    openai.String(expiresAt),
				Refresh: openai.CredentialAuthCreateParamMcpOAuthRefresh{
					TokenEndpoint:     tokenEndpoint,
					ClientID:          clientId,
					RefreshToken:      refreshToken,
					TokenEndpointAuth: openai.McpOAuthTokenEndpointAuthCreateParamUnion{OfParamNone: &openai.McpOAuthTokenEndpointAuthCreateParamNone{}},
				},
			},
		},
	})
if err != nil {
	panic(err)
}
```

```java
// Replace the illustrative expiry with your access token's actual expiry.
// Replace the illustrative IDs and URLs below with your own resource values.
String vaultId = "vault_123";
String mcpUrl = "https://mcp.example.com/mcp";
String accessToken = System.getenv("OAUTH_ACCESS_TOKEN");
String expiresAt = "2030-01-01T00:00:00Z";
String tokenEndpoint = "https://auth.example.com/oauth/token";
String clientId = "example-client-id";
String refreshToken = System.getenv("OAUTH_REFRESH_TOKEN");

var credential =
    client
        .beta()
        .agents()
        .vaults()
        .credentials()
        .create(
            CredentialCreateParams.builder()
                .vaultId(vaultId)
                .name("Example MCP OAuth credential")
                .auth(
                    CredentialAuthCreateParam.McpOAuth.builder()
                        .mcpServerUrl(mcpUrl)
                        .accessToken(accessToken)
                        .expiresAt(expiresAt)
                        .refresh(
                            CredentialAuthCreateParam.McpOAuth.Refresh.builder()
                                .tokenEndpoint(tokenEndpoint)
                                .clientId(clientId)
                                .refreshToken(refreshToken)
                                .tokenEndpointAuthNone()
                                .build())
                        .build())
                .build());
```

```ruby
# Replace the illustrative expiry with your access token's actual expiry.
# Replace the illustrative IDs and URLs below with your own resource values.
vault_id = "vault_123"
mcp_url = "https://mcp.example.com/mcp"
access_token = ENV.fetch("OAUTH_ACCESS_TOKEN")
expires_at = "2030-01-01T00:00:00Z"
token_endpoint = "https://auth.example.com/oauth/token"
client_id = "example-client-id"
refresh_token = ENV.fetch("OAUTH_REFRESH_TOKEN")

credential = client.beta.agents.vaults.credentials.create(
  vault_id,
  name: "Example MCP OAuth credential",
  auth: {
    type: "mcp_oauth",
    mcp_server_url: mcp_url,
    access_token: access_token,
    expires_at: expires_at,
    refresh: {
      token_endpoint: token_endpoint,
      client_id: client_id,
      refresh_token: refresh_token,
      token_endpoint_auth: { type: "none" }
    }
  }
)
```


Use the token endpoint authentication method required by your provider. The example uses `none`; `client_secret_basic` and `client_secret_post` are also supported. See the [credential creation reference](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/subresources/credentials/methods/create) for the fields.

If an expired token cannot be refreshed, supply a valid replacement. Token expiry does not delete the credential or its vault.












## Rotate or remove credentials

[Update a credential](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/subresources/credentials/methods/update) to replace its secret without changing its ID or authentication type. For MCP credentials, the server URL also stays the same. For OAuth, use the saved `vault_id` and `credential_id` with the replacement token and expiry:

Rotate an OAuth token

```javascript
// Replace the illustrative expiry with your access token's actual expiry.
// Replace the illustrative IDs and URLs below with your own resource values.
const credentialId = "cred_123";
const vaultId = "vault_123";
const accessToken = process.env.OAUTH_ACCESS_TOKEN;
const expiresAt = "2030-01-01T00:00:00Z";

const credential = await client.beta.agents.vaults.credentials.update(
  credentialId,
  {
    vault_id: vaultId,
    ...{
      auth: {
        type: "mcp_oauth",
        access_token: accessToken,
        expires_at: expiresAt,
      },
    },
  }
);
```

```python
# Replace the illustrative expiry with your access token's actual expiry.
# Replace the illustrative IDs and URLs below with your own resource values.
credential_id = "cred_123"
vault_id = "vault_123"
access_token = os.environ["OAUTH_ACCESS_TOKEN"]
expires_at = "2030-01-01T00:00:00Z"

credential = client.beta.agents.vaults.credentials.update(
    credential_id,
    vault_id=vault_id,
    auth={
        "type": "mcp_oauth",
        "access_token": access_token,
        "expires_at": expires_at,
    },
)
```

```go
// Replace the illustrative expiry with your access token's actual expiry.
// Replace the illustrative IDs and URLs below with your own resource values.
vaultId := "vault_123"
credentialId := "cred_123"
accessToken := os.Getenv("OAUTH_ACCESS_TOKEN")
expiresAt := "2030-01-01T00:00:00Z"

credential, err := client.Beta.Agents.Vaults.Credentials.Update(ctx,
	vaultId,
	credentialId,
	openai.BetaAgentVaultCredentialUpdateParams{
		Auth: openai.CredentialAuthRotateParamUnion{
			OfParamMcpOAuth: &openai.CredentialAuthRotateParamMcpOAuth{
				AccessToken: openai.String(accessToken),
				ExpiresAt:   openai.String(expiresAt),
			},
		},
	})
if err != nil {
	panic(err)
}
```

```java
// Replace the illustrative expiry with your access token's actual expiry.
// Replace the illustrative IDs and URLs below with your own resource values.
String credentialId = "cred_123";
String vaultId = "vault_123";
String accessToken = System.getenv("OAUTH_ACCESS_TOKEN");
String expiresAt = "2030-01-01T00:00:00Z";

var credential =
    client
        .beta()
        .agents()
        .vaults()
        .credentials()
        .update(
            CredentialUpdateParams.builder()
                .credentialId(credentialId)
                .vaultId(vaultId)
                .auth(
                    CredentialAuthRotateParam.McpOAuth.builder()
                        .accessToken(accessToken)
                        .expiresAt(expiresAt)
                        .build())
                .build());
```

```ruby
# Replace the illustrative expiry with your access token's actual expiry.
# Replace the illustrative IDs and URLs below with your own resource values.
credential_id = "cred_123"
vault_id = "vault_123"
access_token = ENV.fetch("OAUTH_ACCESS_TOKEN")
expires_at = "2030-01-01T00:00:00Z"

credential = client.beta.agents.vaults.credentials.update(
  credential_id,
  vault_id: vault_id,
  auth: {
    type: "mcp_oauth",
    access_token: access_token,
    expires_at: expires_at
  }
)
```


Include `expires_at` when the replacement token expires. Supplying a new access token without an expiry clears the stored expiry; an explicit `null` also clears it.

For an environment credential, send `auth.type: "environment_variable"` and the replacement `auth.secret_value` to `POST /v1/vaults/{vault_id}/credentials/{credential_id}`. Create a new session to use the replacement. Updating the vault does not change the credential already configured in an existing sandbox.

To change `secret_name` or `networking`, create a new credential.

[Delete a credential](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/subresources/credentials/methods/delete) when you no longer need it. [Delete a vault](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/methods/delete) to remove the vault and all its credentials.

Deleting stored credentials does not revoke the original tokens with their providers or stop a running session. Your application handles provider-side revocation and [session cancellation](https://developers.openai.com/api/docs/guides/agents-api/sessions#cancel-an-active-turn).