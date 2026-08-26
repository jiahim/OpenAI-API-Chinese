# API 概述

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

使用此参考来查找 OpenAI API 端点、请求和响应
模式、流式事件、客户端库方法，以及共享行为，如
身份验证、错误、速率限制和请求 ID。

## 从这里开始

1. 为你的应用选择合适的 API 界面：
   - [Responses](https://developers.openai.com/api/reference/responses/overview) 用于直接模型请求、工具使用、音频、图像和文本输入，以及有状态交互。
   - [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 用于通过 WebRTC、WebSocket 或 SIP 进行的低延迟语音或音频会话。使用 [客户端事件](https://developers.openai.com/api/reference/resources/realtime/client-events) 和 [服务器事件](https://developers.openai.com/api/reference/resources/realtime/server-events) 参考来构建会话。
   - [Administration](https://developers.openai.com/api/reference/administration/overview) 用于组织工作流，如用户、邀请、项目、API 密钥和审计日志。
2. 创建凭据。使用标准 [API 密钥](https://platform.openai.com/settings/organization/api-keys) 用于应用请求， [Admin API 密钥](https://platform.openai.com/settings/organization/admin-keys) 用于 Administration 端点，或 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation) 用于短期访问令牌。
3. 从 [库页面](https://developers.openai.com/api/docs/libraries)，或从任何支持 HTTP 请求的环境中直接调用 HTTP API。
4. 使用 [开发者快速入门](https://developers.openai.com/api/docs/quickstart) 发出第一个请求，或直接查看 [Responses 创建参考](https://developers.openai.com/api/reference/resources/responses/methods/create).
5. 在生产环境之前，请查看 [错误代码](https://developers.openai.com/api/docs/guides/error-codes), [速率限制](https://developers.openai.com/api/docs/guides/rate-limits)，以及下方的请求 ID 日志记录。

## 身份验证

OpenAI API 接受来自 API 密钥或通过短期访问令牌创建的 Bearer 凭据，这些令牌由 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation).

**请记住，你的 API 密钥属于机密。** 不要与他人共享，也不要在浏览器或应用等任何客户端代码中暴露。请在服务端通过环境变量或密钥管理服务加载 API 密钥。

API 密钥的撤销会在几秒内生效。大多数影响
  API 密钥认证结果的更新会在 15 分钟内传播，但
  可能需要更长时间。

通过以下方式提供 API 凭据： [HTTP Bearer 认证](https://swagger.io/docs/specification/v3_0/authentication/bearer-authentication/).

```bash
Authorization: Bearer OPENAI_API_KEY_OR_ACCESS_TOKEN
```

如果你属于多个组织，或通过传统用户 API 密钥访问项目，请传入一个头来指定 API 请求应使用的组织和项目：

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Organization: $ORGANIZATION_ID" \
  -H "OpenAI-Project: $PROJECT_ID"
```

来自这些 API 请求的使用量会计入指定组织和项目的用量。在你的 [仪表板设置](https://platform.openai.com/settings/organization/general).

## 请求头

为在不同 API 路径和 HTTP 版本中保持可靠行为，请将总大小
限制在 64 KiB 以下。该预算包括 API 请求中所有标头的名称和
值，包括常见标头，如 `Authorization`,
`Content-Type`，以及 `User-Agent`，以及任何自定义标头。

为给必需标头和中间层添加的标头留出空间，请将
任何单个自定义标头的值以及所有自定义标头值的总大小
保持在 60 KiB 或以下。标头过大的请求可能在到达
API 之前就失败，因此你可能不会收到响应或 `x-request-id`.

## 调试请求

[错误代码](https://developers.openai.com/api/docs/guides/error-codes) 描述从API响应返回的失败情况。检查 HTTP 响应头以获取请求的唯一 ID 和速率限制详情。常见的响应头包括：

**API元信息**

- `openai-organization`： [组织](https://developers.openai.com/api/docs/guides/production-best-practices#setting-up-your-organization) 与请求关联
- `openai-processing-ms`：处理您的 API 请求所花费的时间
- `openai-version`：用于此请求的 REST API 版本（当前 `2020-10-01`)
- `x-request-id`：此 API 请求的唯一标识符（用于故障排查）

**[限流信息](https://developers.openai.com/api/docs/guides/rate-limits)**

- `x-ratelimit-limit-requests`
- `x-ratelimit-limit-tokens`
- `x-ratelimit-remaining-requests`
- `x-ratelimit-remaining-tokens`
- `x-ratelimit-reset-requests`
- `x-ratelimit-reset-tokens`
- `x-ratelimit-limit-project-tokens`
- `x-ratelimit-remaining-project-tokens`
- `x-ratelimit-reset-project-tokens`

当项目级令牌限制适用时，可能会存在项目令牌标头。

**OpenAI 建议在生产部署中记录请求 ID** ，以便更高效地与 [支持团队](https://help.openai.com/en/)进行故障排查。官方 [客户端库](https://developers.openai.com/api/docs/libraries) 在顶层响应对象上提供一个属性，包含 `x-request-id` 标头的值。

### 使用你自己的请求 ID `X-Client-Request-Id`

除了服务端生成的 `x-request-id`之外，你还可以通过 `X-Client-Request-Id` 请求头为每个请求提供你自己的唯一标识符。此请求头不会自动添加；你必须显式地在请求中设置它。

当你包含 `X-Client-Request-Id`:

- 你控制ID格式（例如，UUID或内部追踪ID），但它必须仅包含ASCII字符，且长度不超过512个字符；否则，请求将以400错误失败。请确保每次请求此值唯一。

- OpenAI 在支持的端点（包括 chat/completions、embeddings、responses 等）内部记录此值。

- 在超时或网络问题等无法获取 `X-Request-Id` 响应头的情况下，你可以将 `X-Client-Request-Id` 该值与支持团队分享，以查询OpenAI是否收到请求以及何时收到。

**示例：**

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "X-Client-Request-Id: 123e4567-e89b-12d3-a456-426614174000"
```

## 向后兼容性

OpenAI 通过在合理可行的情况下避免 API 主要版本中的破坏性变更，为 API 用户提供稳定性。这包括：

- REST API（目前 `v1`)
- 第一方 [客户端库](https://developers.openai.com/api/docs/libraries) （已发布的库遵循 [语义化版本](https://semver.org/))
- [模型](https://developers.openai.com/api/docs/models) 系列（如 `gpt-4o` 或 `o4-mini`)

**快照之间的模型提示行为可能会发生变化**.
模型输出本质上具有可变性，因此请预期快照之间的提示和模型行为会发生变化。确保提示行为和模型输出一致的最佳方式是使用固定模型版本，并运行 [评估](https://developers.openai.com/api/docs/guides/evals) 以用于你的应用程序。

**向后兼容的API更改**:

- 向 REST API 和客户端库添加新资源（URL）
- 添加新的可选 API 参数
- 向 JSON 响应对象或事件数据添加新属性
- 更改 JSON 响应对象中属性的顺序
- 更改不透明字符串（如资源标识符）的长度或格式
- 在流式 API 中添加新的事件类型

请参阅 [更新日志](https://developers.openai.com/api/docs/changelog) 以获取向后兼容性变更及少数破坏性变更的列表。