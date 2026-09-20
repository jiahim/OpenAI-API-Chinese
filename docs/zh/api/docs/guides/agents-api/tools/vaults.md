# Vaults

> 完整文档索引请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

保险库将凭证存储在你的智能体指令和配置之外。通过以下方式将其附加到会话中，以便会话可以使用这些凭证： `vault_ids` ，从而让会话可以使用这些凭证。

根据请求运行的位置选择凭证类型：

| Request                                   | 凭证类型                | 会话使用凭证的方式                                                                                                      |
| ----------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 来自 OpenAI 的 MCP 连接                | `static_bearer` 或 `mcp_oauth` | OpenAI 向已配置的 MCP 服务器进行身份验证。                                                                                       |
| 来自 OpenAI 托管沙箱的 API 请求 | `environment_variable`         | 代码使用包含占位符的环境变量。网络代理会针对经过批准的宿主，将占位符替换为该密钥。 |

例如，沙箱可以使用 vault 密钥来调用 GitHub REST API。请参阅 [在沙箱发出的 API 请求中使用 vault 密钥](#use-vault-secrets-for-api-requests-from-a-sandbox).

检索 vault 或凭证不会返回其密钥值。有关其他 MCP 连接，请参阅 [MCP 身份验证选项](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#add-authentication).

## 权限

对于受限的应用密钥，授予：

- `api.vaults.read` 列出并检索保管库和凭据。
- `api.vaults.write` 创建、更新或删除它们。








## 为 MCP 密钥创建并使用 vault

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


将凭据 ID 保存为 `credential_id` 以供后续更新。




在创建会话时传入已保存的 ID `vault_ids` 。在 MCP 配置中使用同一个服务器 URL：

将保险库挂载到会话

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


智能体 API 会选择与服务器 URL 匹配的凭据。如果存在多个匹配的已挂载凭据，请设置该 MCP 工具的 `credential_id` 以选择其中一个。




## 在沙箱中使用 vault 凭据发起 API 请求

使用 `environment_variable` 凭据向来自 API 请求的 OpenAI-hosted 沙箱提供密钥。沙箱会在指定的环境变量中收到一个占位符。真实密钥保留在沙箱之外。

此 工作流 需要一个 `openai_hosted` 环境。它不会向自托管环境或应用运行的 [function tools](https://developers.openai.com/api/docs/guides/agents-api/tools/functions).

### 存储 API 令牌

如上所示创建一个 vault。然后向其发送凭证创建请求 `POST /v1/vaults/{vault_id}/credentials` 包含以下字段：

| 字段                           | GitHub API 令牌的值                                            |
| ------------------------------- | ----------------------------------------------------------------------- |
| `name`                          | `GitHub API token`                                                      |
| `auth.type`                     | `environment_variable`                                                  |
| `auth.secret_name`              | `GITHUB_TOKEN`                                                          |
| `auth.secret_value`             | 该令牌，从你应用的密钥环境变量中读取。 |
| `auth.networking.type`          | `limited`                                                               |
| `auth.networking.allowed_hosts` | `["api.github.com"]`                                                    |

`secret_name` 是沙箱代码读取的环境变量。 `secret_value` 才是真实的凭据。请勿将其写入提示词、源文件或日志。

在中使用精确的主机名， `allowed_hosts`，不要包含协议、路径、端口或通配符。代理仅向 443 或 8443 端口的 HTTPS 目标提供密钥。

### 将保险库附加到托管会话

在创建会话时一并包含以下字段 `agent` 时 [创建会话](https://developers.openai.com/api/docs/guides/agents-api/sessions#create-a-session)。将 `vault_123` 替换为 API 返回的 vault ID：

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

这两个主机列表控制不同的内容。 `allowed_domains` 允许沙箱连接到主机。凭据的 `allowed_hosts` 允许代理向该主机提供密钥。

在受限网络访问下，将每个凭据主机都包含在 `allowed_domains`。中。请勿将 `network.access` 设置为 `disabled` ，以用于使用环境凭据的会话。

每个附加的环境凭据必须具有唯一的 `secret_name`。请勿在 `environment.env`.

### 从沙盒中调用 API

[向该智能体发送一条消息](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input) 要求它在沙箱中运行此命令：

```bash
curl https://api.github.com/user \
  -H "Authorization: Bearer $GITHUB_TOKEN"
```

该命令从以下位置读取占位符 `GITHUB_TOKEN`。代理在向 `api.github.com`。发送请求之前，会将其替换为真实的令牌。成功请求会以 JSON 形式返回已通过身份验证的 GitHub 用户账户详细信息。在沙箱内打印该变量时，显示的是占位符而不是令牌。

在 HTTPS 请求头中原样传递占位符。它无法为本地计算提供真实的密钥，例如对请求进行签名。对于此类任务，请将凭据保留在你的应用中，并通过一个 [函数工具](https://developers.openai.com/api/docs/guides/agents-api/tools/functions).




## 使用 OAuth 凭据

你的应用负责处理提供方的授权与同意流程。将获得的授权与 `auth.type: "mcp_oauth"`。一起存储。将 `expires_at` 设置为访问令牌的过期时间（RFC 3339 时间戳），如果已知的话。

下面的示例使用了来自你的提供方 OAuth 流程的值。包含 `refresh` 以让 智能体 API 刷新令牌：

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


使用提供方要求的令牌端点认证方法。示例使用 `none`; `client_secret_basic` 和 `client_secret_post` 也同样受支持。参见 [凭据创建参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/subresources/credentials/methods/create) 了解相关字段。

如果过期令牌无法刷新，请提供一个有效的替代令牌。令牌过期不会删除该凭据或其保险库。












## 轮换或移除凭证

[更新凭证](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/subresources/credentials/methods/update) 可在不更改其 ID 或身份验证类型的前提下替换其密钥。对于 MCP 凭证，服务器 URL 也保持不变。对于 OAuth，请使用已保存的 `vault_id` 和 `credential_id` 以及替换后的令牌和过期时间：

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


在替换后的令牌过期时包含 `expires_at` 。若提供新的访问令牌但未提供过期时间，则会清除已存储的过期时间；显式提供 `null` 也会将其清除。

对于环境凭证，请发送 `auth.type: "environment_variable"` 以及替换后的内容 `auth.secret_value` 设置为 `POST /v1/vaults/{vault_id}/credentials/{credential_id}`。创建一个新会话以使用替换后的值。更新保管库不会更改已在现有沙盒中配置的凭证。

若要更改 `secret_name` 或 `networking`，请创建一个新凭证。

[删除凭证](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/subresources/credentials/methods/delete) 当你不再需要它时。 [删除保管库](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/vaults/methods/delete) 以移除该保管库及其所有凭证。

删除已存储的凭证不会在提供方那里撤销原始令牌，也不会停止正在运行的会话。提供方侧的撤销和 [会话取消](https://developers.openai.com/api/docs/guides/agents-api/sessions#cancel-an-active-turn).