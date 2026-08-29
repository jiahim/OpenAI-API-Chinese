# GPT Action 身份验证

> 完整文档索引请参阅 [llms.txt](/llms.txt)。你也可以在页面 URL 末尾追加 `.md` 来获取对应文档页面的 Markdown 版本。

Actions 提供不同的身份验证方案以适应各种用例。若要为你的 action 指定身份验证方案，请使用 GPT 编辑器并选择 "None"、"API Key" 或 "OAuth"。

默认情况下，所有 actions 的身份验证方法均设置为 "None"，但你可以更改此设置，并允许不同的 action 使用不同的身份验证方法。

## 无身份验证

我们支持无认证流程，适用于用户可以直接向你的API发送请求而无需API密钥或通过 OAuth 登录的应用场景。

对于初次用户交互，请考虑使用无认证方式，因为强制用户登录应用可能会导致用户流失。你可以创建一个“未登录”体验，然后通过启用单独的操作将用户迁移到“已登录”体验。

## API 密钥认证

就像用户可能已经在使用你的 API 一样，我们也允许通过 GPT 编辑器界面进行 API 密钥身份验证。我们在将密钥存入数据库时对其加密，以确保你的 API 密钥安全。

如果你的 API 会执行比无身份验证流程影响稍大的操作，但又不要求每个用户单独登录，那么这种做法非常有用。添加 API 密钥身份验证可以保护你的 API，并提供更细粒度的访问控制，以及对请求来源的可观测性。

## OAuth

Actions 允许为每个用户进行 OAuth 登录。这是提供个性化体验并让用户使用最强大的 actions 的最佳方式。下面是使用 actions 的 OAuth 流程的一个简单示例：

- 首先，在 GPT 编辑器界面中选择 “Authentication”，然后选择 “OAuth”。
- 系统会提示你输入 OAuth 客户端 ID、客户端密钥、授权 URL、令牌 URL 和 scope（作用域）。
  - 客户端 ID 和密钥可以是简单的文本字符串，但应当 [遵循 OAuth 最佳实践](https://www.oauth.com/oauth2-servers/client-registration/client-id-secret/).
  - 我们会存储加密后的客户端密钥，而客户端 ID 对终端用户可见。
- OAuth 请求将包含以下信息： `request={'grant_type': 'authorization_code', 'client_id': 'YOUR_CLIENT_ID', 'client_secret': 'YOUR_CLIENT_SECRET', 'code': 'abc123', 'redirect_uri': 'https://chat.openai.com/aip/{g-YOUR-GPT-ID-HERE}/oauth/callback'}` 注意： `https://chatgpt.com/aip/{g-YOUR-GPT-ID-HERE}/oauth/callback` 同样有效。
- 若要使某人能够使用带有 OAuth 的操作，他们需要发送一条会触发该操作的消息，随后用户将在 ChatGPT 界面中看到一个 “Sign in to [domain]” 按钮。
- 该 `authorization_url` 端点应返回如下所示的响应：
  `{ "access_token": "example_token", "token_type": "bearer", "refresh_token": "example_token", "expires_in": 59 }`
- 在用户登录过程中，ChatGPT 会向你的 `authorization_url` 发起请求，使用指定的 `authorization_content_type`，我们预期会收到一个访问令牌，以及可选的 [刷新令牌](https://auth0.com/learn/refresh-tokens) ，我们用它定期获取新的访问令牌。
- 每当用户向该操作发起请求时，用户的令牌将通过 Authorization 头传递：（"Authorization": "[Bearer/Basic] [user's token]"）。
- 我们要求 OAuth 应用程序使用 [state 参数](https://auth0.com/docs/secure/attack-protection/state-parameters#set-and-compare-state-parameter-values) 以确保安全。

自定义 GPT 上的登录失败问题（重定向 URL）？

- 请确保在你的 OAuth 应用中启用此重定向 URL：
- #1 重定向 URL： `https://chat.openai.com/aip/{g-YOUR-GPT-ID-HERE}/oauth/callback` （某些客户端的域名可能不同）
- #2 重定向 URL： `https://chatgpt.com/aip/{g-YOUR-GPT-ID-HERE}/oauth/callback` （保存后在 ChatGPT 界面的 URL 栏中获取你的 GPT ID）如果你有多个 GPT，需要分别为每个启用，或根据风险偏好使用通配符。
- 调试提示：你的身份提供方通常会记录失败信息（例如“redirect_uri is not registered for client”），这也有助于排查登录问题。