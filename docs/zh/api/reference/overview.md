# API 概述

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

使用此参考来查找 OpenAI API 端点、请求和响应
模式、流式事件、客户端库方法以及共享行为，例如
身份验证、错误、速率限制和请求 ID。

## 从这里开始

1. 为你的应用选择 API 接口：
   - [Responses](https://developers.openai.com/api/reference/responses/overview) 用于直接的模型请求、工具使用、音频、图像和文本输入，以及有状态的交互。
   - [Realtime API](https://developers.openai.com/api/docs/guides/realtime) 用于通过 WebRTC、WebSocket 或 SIP 进行低延迟的语音或音频会话。请参阅 [客户端事件](https://developers.openai.com/api/reference/resources/realtime/client-events) 和 [服务端事件](https://developers.openai.com/api/reference/resources/realtime/server-events) 参考来构建会话。
   - [Administration](https://developers.openai.com/api/reference/administration/overview) 用于组织工作流，例如用户、邀请、项目、API 密钥和审计日志。
2. 创建凭据。使用标准的 [API 密钥](https://platform.openai.com/settings/organization/api-keys) 用于应用请求，使用 [Admin API 密钥](https://platform.openai.com/settings/organization/admin-keys) 用于 Administration 端点，或使用 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation) 来获取短期访问令牌。
3. 从 [库页面](https://developers.openai.com/api/docs/libraries)，或者直接从任何支持 HTTP 请求的环境调用 HTTP API。
4. 使用以下链接发出第一个请求： [开发者快速入门](https://developers.openai.com/api/docs/quickstart) ，或直接查阅 [Responses create 参考](https://developers.openai.com/api/reference/resources/responses/methods/create).
5. 在投入生产之前，请先查看 [错误码](https://developers.openai.com/api/docs/guides/error-codes), [速率限制](https://developers.openai.com/api/docs/guides/rate-limits)，以及下面的请求 ID 日志记录。

## 身份验证

OpenAI API 接受来自 API 密钥或通过以下方式创建的短期访问令牌的持有者凭证 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation).

**请记住，你的 API 密钥是一个秘密。** 不要与他人共享，也不要在任何客户端代码（例如浏览器或应用）中暴露它。请从环境变量或服务端密钥管理服务加载 API 密钥。

对 API 密钥的吊销会在几秒内生效。大多数会影响
  API 密钥身份验证结果的更新会在 15 分钟内传播，但
  有时可能需要更长时间。

通过以下方式提供 API 凭证 [HTTP Bearer 身份验证](https://swagger.io/docs/specification/v3_0/authentication/bearer-authentication/).

```bash
Authorization: Bearer OPENAI_API_KEY_OR_ACCESS_TOKEN
```

如果你属于多个组织，或通过旧版用户 API 密钥访问项目，请通过请求头来指定用于 API 请求的组织与项目：

```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "OpenAI-Organization: $ORGANIZATION_ID" \
  -H "OpenAI-Project: $PROJECT_ID"
```

这些 API 请求所产生的用量会计入指定组织与项目的用量。可在你的 [仪表板设置](https://platform.openai.com/settings/organization/general).

## 请求标头

为了在不同 API 路径和 HTTP 版本下保持稳定的行为，请将
API 请求头的总大小控制在 64 KiB 以内。该预算包含所有头的名称和
值，包括常见头，例如 `Authorization`,
`Content-Type`，以及 `User-Agent`，以及任何自定义头。

为必需头和中间件添加的头预留空间，请将
任何单个自定义头的值以及所有自定义头值的总大小
控制在 60 KiB 或以下。头更大的请求可能在到达
API 之前就失败了，因此你可能不会收到响应或 `x-request-id`.

## 调试请求

[错误代码](https://developers.openai.com/api/docs/guides/error-codes) 描述从 API 响应返回的失败原因。检查 HTTP 响应头以获取请求的唯一 ID 和速率限制详情。常见的响应头包括：

**API 元信息**

- `openai-organization`: The [organization](https://developers.openai.com/api/docs/guides/production-best-practices#setting-up-your-organization) associated with the request
- `openai-processing-ms`: 处理 API 请求所花费的时间
- `openai-version`: 此请求使用的 REST API 版本（当前为 `2020-10-01`)
- `x-request-id`: 此 API 请求的唯一标识符（用于排查问题）

**[速率限制信息](https://developers.openai.com/api/docs/guides/rate-limits)**

- `x-ratelimit-limit-requests`
- `x-ratelimit-limit-tokens`
- `x-ratelimit-remaining-requests`
- `x-ratelimit-remaining-tokens`
- `x-ratelimit-reset-requests`
- `x-ratelimit-reset-tokens`
- `x-ratelimit-limit-project-tokens`
- `x-ratelimit-remaining-project-tokens`
- `x-ratelimit-reset-project-tokens`

当存在项目范围的令牌限制时，可能会出现项目令牌标头。

**OpenAI 建议在生产部署中记录请求 ID** 以便在需要时与 [支持团队](https://help.openai.com/en/)，进行更高效的故障排查。官方 [客户端库](https://developers.openai.com/api/docs/libraries) 在顶级响应对象上提供了一个属性，其中包含该 `x-request-id` 标头的值。

### 通过提供你自己的请求 ID `X-Client-Request-Id`

除了服务端生成的 `x-request-id`，之外，你还可以通过 `X-Client-Request-Id` 请求标头为每个请求提供自己的唯一标识符。此标头不会自动添加；你必须在请求中显式设置它。

当你包含 `X-Client-Request-Id`:

- 你可以控制 ID 的格式（例如 UUID 或你内部的 追踪 ID），但它只能包含 ASCII 字符且长度不超过 512 个字符；否则请求将以 400 错误失败。每个请求请确保该值唯一。

- OpenAI 会在支持的端点（包括 chat/completions、embeddings、responses 等）内部记录此值。

- 在遇到超时或网络问题而无法获取 `X-Request-Id` 响应头时，你可以将 `X-Client-Request-Id` 值提供给支持团队，以便他们查询 OpenAI 是否收到了请求以及何时收到。

**示例：**

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "X-Client-Request-Id: 123e4567-e89b-12d3-a456-426614174000"
```

## 向后兼容性

OpenAI 通过在合理可行的范围内避免在主要 API 版本中进行破坏性变更，为 API 用户提供稳定性。这包括：

- REST API（目前 `v1`)
- 第一方 [客户端库](https://developers.openai.com/api/docs/libraries) （已发布的库遵循 [语义化版本](https://semver.org/))
- [模型](https://developers.openai.com/api/docs/models) 系列（例如 `gpt-4o` 或 `o4-mini`)

**快照之间的模型提示行为可能会发生变化**.
模型输出本质上具有可变性，因此请预期快照之间的提示和模型行为会有所差异。确保提示行为和模型输出一致性的最佳方式是使用固定的模型版本，并为你的应用运行 [评估](https://developers.openai.com/api/docs/guides/evals) 。

**向后兼容的 API 变更**:

- 向 REST API 和客户端库添加新的资源（URL）
- 在 API 中添加新的可选参数
- 向 JSON 响应对象或事件数据添加新的属性
- 更改 JSON 响应对象中属性的顺序
- 更改不透明字符串（如资源标识符）的长度或格式
- 在流式 API 中添加新的事件类型

请参阅 [更新日志](https://developers.openai.com/api/docs/changelog) ，以了解向后兼容的变更以及罕见的破坏性变更列表。