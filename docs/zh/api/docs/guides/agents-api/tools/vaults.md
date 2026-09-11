# Vaults

> 完整文档索引请参见 [llms.txt](/llms.txt).可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

保险库用于存储来自 OpenAI 的 MCP 连接凭证。将其挂载到会话中，以便 智能体 能够在不接收密钥值的情况下使用经过身份验证的工具。

保险库支持 bearer 令牌以及已有的 OAuth 授权。对于来自你所在环境的连接，请使用其他的 [MCP 身份验证选项](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#add-authentication).

## 权限

对于受限的应用程序密钥，授予：

- `api.vaults.read` 用于列出和检索保险库和凭据。
- `api.vaults.write` 用于创建、更新或删除它们。




## 创建并使用保险库

使用你的 API 客户端、MCP 服务器的 URL（`mcp_url`）以及该服务器的一个访问令牌（`access_token`）。示例使用 GitHub 工具。

首先，创建一个保险库：

创建保险库

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


将其 ID 保存为 `vault_id`，然后添加令牌。 `mcp_server_url` 将凭证绑定到该服务器：

存储一个 bearer 令牌

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


将凭证 ID 保存为 `credential_id` 以供后续更新使用。




在创建会话时传入已保存的 ID `vault_ids` 。在 MCP 配置中使用相同的服务器 URL：

将保险库附加到会话

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


智能体 API 会选择与服务器 URL 匹配的凭证。如果存在多个匹配的附加凭证，请设置 MCP 工具的 `credential_id` 来选择其中一个。检索保险库或凭证不会返回其密钥值。




## 使用 OAuth 凭证

你的应用负责处理提供商的授权与同意流程。将得到的授权凭证与 `auth.type: "mcp_oauth"`。一同存储。将 `expires_at` 设置为访问令牌的过期时间（若已知），格式为 RFC 3339 时间戳。

下面的示例使用了来自你提供商 OAuth 流程的值。传入 `refresh` ，以便 智能体 API 刷新该令牌：

存储 OAuth 授权

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


使用提供商要求的令牌端点鉴权方式。示例使用了 `none`; `client_secret_basic` ， `client_secret_post` 也受支持。参见 [凭据创建参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/subresources/credentials/methods/create) 了解相关字段。

如果过期令牌无法刷新，请提供一个有效的新令牌。令牌过期不会删除该凭据或其保管库中的内容。












## 轮换或移除凭证

[更新凭据](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/subresources/credentials/methods/update) 以替换其令牌，而不更改其 ID、身份验证类型或服务端 URL。对于 OAuth，请使用已保存的 `vault_id` ， `credential_id` 以及替换令牌和过期时间：

轮换 OAuth 令牌

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


请包含 `expires_at` ，用于指示替换令牌的过期时间。如果只提供新的访问令牌而不提供过期时间，则会清除已存储的过期时间；显式设置 `null` 也会将其清除。

[删除凭据](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/subresources/credentials/methods/delete) （当你不再需要它时）。 [删除保险库](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/methods/delete) 以移除该保险库及其所有凭据。

删除已存储的凭据并不会撤销其在提供方处的原始令牌，也不会停止正在运行的会话。提供商侧的令牌撤销和 [会话取消](https://developers.openai.com/api/docs/guides/agents-api/sessions#cancel-an-active-turn).