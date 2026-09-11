# Vaults

> 完整的文档索引请参见 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

保险库用于存储来自OpenAI的 MCP 连接的凭证。将其挂载到会话上，以便智能体能够使用经过身份验证的工具，而无需接收密钥值。

保险库支持 bearer 令牌和已有的 OAuth 授权。针对来自你所在环境的连接，请使用其他 [MCP 身份验证选项](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#add-authentication).

## 权限

对于受限的应用密钥，请授予：

- `api.vaults.read` 用于列出和检索 vaults 与凭据。
- `api.vaults.write` 用于创建、更新或删除它们。




## 创建并使用保险库

使用你的 API 客户端、MCP 服务器 URL（`mcp_url`）以及该服务器的访问令牌（`access_token`）。示例使用 GitHub 工具。

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


将其 ID 保存为 `vault_id`，然后添加令牌。 `mcp_server_url` 将凭据绑定到该服务器：

存储一个持有者令牌

```javascript
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


将凭据 ID 保存为 `credential_id` 以便后续更新。




在创建会话时在 `vault_ids` 中传入已保存的 ID。在 MCP 配置中使用相同的服务器 URL：

将保险库附加到会话

```javascript
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


智能体 API 会选择与服务器 URL 匹配的凭据。如果有多个附加的凭据匹配，设置 MCP 工具的 `credential_id` 以选择其中一个。检索保险库或凭据不会返回其密钥内容。




## 使用 OAuth 凭据

你的应用负责处理提供方的授权和同意流程。将最终获得的授权结果与 `auth.type: "mcp_oauth"`。一起存储。将 `expires_at` 设置为访问令牌的过期时间（RFC 3339 时间戳格式），如果已知的话。

下面的示例使用了来自你提供方 OAuth 流程中的值。请包含 `refresh` 以允许 智能体 API 刷新令牌：

存储 OAuth 授权

```javascript
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


使用你的提供方所要求的令牌端点认证方式。示例中使用了 `none`; `client_secret_basic` 和 `client_secret_post` 。更多支持的字段请参阅 [凭据创建参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/subresources/credentials/methods/create) 中的字段说明。

如果过期的令牌无法被刷新，请提供一个有效的替代令牌。令牌过期不会删除该凭据或它的保险库。












## 轮换或移除凭据

[更新凭证](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/subresources/credentials/methods/update) 以替换其令牌，但不会更改其 ID、身份验证类型或服务端 URL。对于 OAuth，请使用已保存的 `vault_id` 和 `credential_id` 并提供替换令牌及过期时间：

轮换 OAuth 令牌

```javascript
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


包含 `expires_at` ，用于指定替换令牌的过期时间。如果提供新的访问令牌但未指定过期时间，则会清除已存储的过期时间；显式设置 `null` 也会将其清除。

[删除凭证](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/subresources/credentials/methods/delete) ，以在不再需要时将其删除。 [删除保险库](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/methods/delete) ，以移除该保险库及其所有凭证。

删除已存储的凭证不会在提供方侧撤销原始令牌，也不会停止正在运行的会话。提供商侧的撤销和 [会话取消](https://developers.openai.com/api/docs/guides/agents-api/sessions#cancel-an-active-turn).