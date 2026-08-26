# GPT 操作身份验证

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。此外，在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

操作提供不同的认证方案，以满足各种使用场景。要为你的操作指定认证方案，请使用 GPT 编辑器并选择“None”、“API Key”或“OAuth”。

默认情况下，所有操作的认证方式均设为“None”，但你可以更改此设置，并允许不同操作使用不同的认证方式。

## 无需认证

我们支持无需认证的流程，适用于用户可以直接向你的 API 发送请求而无需 API 密钥或通过 OAuth 登录的应用程序。

考虑在初始用户交互时不使用认证，因为如果用户被迫登录应用程序，可能会导致用户流失。你可以创建“已登出”体验，然后通过启用单独操作将用户移至“已登录”体验。

## API 密钥认证

正如用户可能已经在使用你的 API 一样，我们也允许通过 GPT 编辑器界面使用 API 密钥认证。我们在数据库中存储密钥时会对其进行加密，以确保你的 API 密钥安全。

如果你有一个 API 执行的操作比无认证流程更具影响力，但又不需要单个用户登录，这种方法就会很有用。添加 API 密钥认证可以保护你的 API，并为你提供更精细的访问控制以及请求来源的可见性。

## OAuth

操作允许每位用户进行 OAuth 登录。这是提供个性化体验并让用户获得最强大功能的最佳方式。带操作功能的 OAuth 流程的一个简单示例如下：

- 首先，在 GPT 编辑器界面中选择“认证”，然后选择“OAuth”。
- 系统将提示你输入 OAuth 客户端 ID、客户端密钥、授权 URL、令牌 URL 和作用域。
  - 客户端 ID 和密钥可以是简单的文本字符串，但应 [遵循 OAuth 最佳实践](https://www.oauth.com/oauth2-servers/client-registration/client-id-secret/).
  - 我们会存储客户端密钥的加密版本，而客户端 ID 对最终用户可见。
- OAuth 请求将包含以下信息： `request={'grant_type': 'authorization_code', 'client_id': 'YOUR_CLIENT_ID', 'client_secret': 'YOUR_CLIENT_SECRET', 'code': 'abc123', 'redirect_uri': 'https://chat.openai.com/aip/{g-YOUR-GPT-ID-HERE}/oauth/callback'}` 注意： `https://chatgpt.com/aip/{g-YOUR-GPT-ID-HERE}/oauth/callback` 也是有效的。
- 为了让用户使用带 OAuth 的操作，他们需要发送一条调用该操作的消息，然后在 ChatGPT 界面中会显示一个“登录 [域名]”按钮。
- 该 `authorization_url` 端点应返回如下响应：
  `{ "access_token": "example_token", "token_type": "bearer", "refresh_token": "example_token", "expires_in": 59 }`
- 在用户登录过程中，ChatGPT 会向你的 `authorization_url` 发出请求，使用指定的 `authorization_content_type`，我们期望收到一个访问令牌，以及可选的 [刷新令牌](https://auth0.com/learn/refresh-tokens) ，我们用它定期获取新的访问令牌。
- 每次用户向该操作发出请求时，用户的令牌都会在 Authorization 头中传递：（"Authorization": "[Bearer/Basic] [user's token]"）。
- 我们要求 OAuth 应用使用 [状态参数](https://auth0.com/docs/secure/attack-protection/state-parameters#set-and-compare-state-parameter-values) 以确保安全。

自定义 GPT 上无法登录的问题（重定向 URL）？

- 请务必在 OAuth 应用中启用此重定向 URL：
- #1 重定向 URL： `https://chat.openai.com/aip/{g-YOUR-GPT-ID-HERE}/oauth/callback` （某些客户端可能使用不同域名）
- #2 重定向 URL： `https://chatgpt.com/aip/{g-YOUR-GPT-ID-HERE}/oauth/callback` （保存后在 ChatGPT 界面 URL 栏中获取你的 GPT ID）如果你有多个 GPT，需要为每个 GPT 启用，或根据风险承受能力使用通配符。
- 调试说明：你的身份验证提供程序通常会记录失败（例如“redirect_uri 未注册到客户端”），这也有助于排查登录问题。