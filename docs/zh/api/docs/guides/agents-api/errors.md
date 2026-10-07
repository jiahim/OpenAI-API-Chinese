# 错误与恢复

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，请在页面 URL 末尾追加 `.md` 。

有关通用 HTTP 错误和 SDK 异常，请参阅共享的 [错误代码指南](https://developers.openai.com/api/docs/guides/error-codes).

## 检查错误

检查 HTTP 响应中的请求错误。对于某一轮次或环境设置过程中发生的失败，请检查事件和已保存的状态。
environment setup, check events and saved state.

| 失败     | 查看位置                                                                                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API 请求 | 查看 HTTP 状态码和响应中的 `error` 对象。                                                                                                                                            |
| Turn        | 开 `agent.session.turn.failed`, [retrieve the turn](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/turns/methods/retrieve) 并检查 `status` 和 `error`. |
| 会话     | 开 `agent.session.failed`, [获取会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#inspect-a-session) 并检查 `status` 和 `error`.                                                 |
| 环境 | 阅读 `environment.error` in `agent.session.environment.failed`。详见 [sandbox troubleshooting](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted#troubleshooting).                             |

对于结构化错误，请在应用逻辑中使用 `error.code` 并通过 `error.message`
来说明失败原因。
对于请求验证错误， `error.param` 可以定位需要修正的字段。
处理未知错误码以及缺失 `param` 的情况，避免破坏你的错误处理逻辑。

在 beta 版 API (中,)`OpenAI-Beta: agents=v1`，会话的 `error` 是一条消息字符串
或 `null`。请阅读伴随的 SSE `error` 事件以获取会话失败码。

## API 请求错误

这些错误描述了对智能体 API 的请求。它们与
[轮次错误](#turn-errors) 不同，后者是在工作开始后返回的。

| 代码                                                     | 概述                                                                                                                                                                                                                                           |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400： `invalid_request_error`                             | **原因：** 输入或配置的值无效或过大。 <br /> **解决方案：** 更正由以下标识的字段 `error.param` 或 `error.message`。详见 [更正无效输入](#correct-invalid-input).                                    |
| 400： `invalid_beta`                                      | **原因：** 该 `OpenAI-Beta` 标头包含无效值。 <br /> **解决方案：** 检查你使用的 API 版本所要求的标头。                                                                                                          |
| 400： `agent_not_persisted`                               | **原因：** 所提供的 `agent_id` 属于会话本地的 智能体。 <br /> **解决方案：** [创建已保存的 智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) 并使用其 ID。                                         |
| 400： `invalid_otlp_endpoint`, `invalid_otlp_header`      | **原因：** 追踪 端点或标头无效。 <br /> **解决方案：** 更正你的 [追踪 配置](https://developers.openai.com/api/docs/guides/agents-api/tracing).                                                                                            |
| 401： `unauthorized`；403: `forbidden`                    | **原因：** 身份验证失败或调用方缺乏访问权限。 <br /> **解决方案：** 请参阅共享的 [身份验证与权限指南](https://developers.openai.com/api/docs/guides/error-codes#python-library-error-types).                                                |
| 404: `not_found_error`, `model_not_found`                | **原因：** 该资源或模型对此请求不可用。 <br /> **解决方案：** 请检查 ID、模型、项目，以及该资源是否已被删除。                                                                                         |
| 409: `conflict_error`                                    | **原因：** 该操作与当前资源状态发生冲突。 <br /> **解决方案：** 请阅读该消息并在重试前获取当前状态。                                                                                          |
| 409: `executor_version_incompatible`                     | **原因：** 不支持当前执行器版本。 <br /> **解决方案：** 请升级执行器后再重试。                                                                                                                                            |
| 424: `mcp_server_startup_failed`                         | **原因：** MCP 服务器启动失败。 <br /> **解决方案：** 请检查服务器的配置和凭据。请参阅 [连接故障排查](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#troubleshoot-connections).                                   |
| 429: `files_api_rate_limit_exceeded`                     | **原因：** 文件请求超出你用户的 Files API 限额。 <br /> **解决方案：** 请减少并发请求，并遵循 [Files API 速率限制指南](#files-api-rate-limits).                                                       |
| 500: `internal_error`                                    | **原因：** 服务遇到了意外错误。 <br /> **解决方案：** [重试前检查已保存的工作](#retry-transient-failures)。请参阅共享的 [服务端错误指引](https://developers.openai.com/api/docs/guides/error-codes#api-errors).                       |
| 503: `service_unavailable_error`, `server_is_overloaded` | **原因：** 服务或依赖项暂时不可用或过载。 <br /> **解决方案：** 遵循共享的 [503 指引](https://developers.openai.com/api/docs/guides/error-codes#api-errors) 和 [重试前检查已保存的工作](#retry-transient-failures). |

### Files API 速率限制

会话创建和文件附加请求可能会返回 HTTP 429，
`files_api_rate_limit_exceeded`。智能体 API 通过 Files API 检查文件。
这些检查会消耗已认证用户的 Files API 配额。每个附加的文件可能都需要单独进行检查。

```json
{
  "error": {
    "type": "rate_limit_error",
    "code": "files_api_rate_limit_exceeded",
    "message": "The Files API rate limit for your user has been exceeded. Reduce the rate of requests that access files, then try again.",
    "param": null
  }
}
```

减少同时访问文件的并发请求数。使用指数
退避策略并限制重试次数。立即重试可能会继续消耗配
额。

此 HTTP 响应表示操作失败。它与会话或轮次在创建响应成功之后异
步失败的情况不同。请检查
`error.code` 以识别这种情况，而不是匹配消息文本。

## Turn errors

一次失败的轮次具有 `status: "failed"` ，以及 `error` ，带有 `code` ， `message`.
例如，模型过载可能产生：

```json
{
  "code": "server_overloaded",
  "message": "The model is temporarily overloaded. Please retry your request after a brief delay."
}
```

轮次代码本身没有对应的 HTTP 状态。例如，一次失败的轮次使用
`server_overloaded`；而 HTTP 响应可以使用 `server_is_overloaded`.

| 代码                                                                     | 概述                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `invalid_request`                                                        | **原因：** 输入或配置无效。 <br /> **解决方案：** 请先按消息中说明修正输入，然后再重试。                                                                                                                                                              |
| `context_length_exceeded`                                                | **原因：** 输入超出了模型的上下文窗口。 <br /> **解决方案：** 请减少输入。如果对话过长，请使用更简短的摘要开启新会话。                                                                                                                        |
| `session_budget_exceeded`                                                | **原因：** 本次会话已用完其用量预算。 <br /> **解决方案：** 请开启新会话以继续。                                                                                                                                                                                          |
| `credit_balance_exhausted`                                               | **原因：** 该组织没有剩余的 API 额度。 <br /> **解决方案：** 请参阅 [额度余额指南](https://developers.openai.com/api/docs/guides/error-codes#api-errors).                                                                                                                                          |
| `project_spend_limit_exceeded`                                           | **原因：** 该项目已达到强制消费上限。 <br /> **解决方案：** 请参阅 [项目消费上限指南](https://developers.openai.com/api/docs/guides/error-codes#api-errors).                                                                                                                                      |
| `organization_spend_limit_exceeded`                                      | **原因：** 该组织已达到强制消费上限。 <br /> **解决方案：** 请参阅 [组织消费上限指南](https://developers.openai.com/api/docs/guides/error-codes#api-errors).                                                                                                                            |
| `organization_usage_limit_exceeded`                                      | **原因：** 该组织已达到 OpenAI 分配的用量上限。 <br /> **解决方案：** 请参阅 [组织用量上限指南](https://developers.openai.com/api/docs/guides/error-codes#api-errors).                                                                                                                     |
| `usage_limit_exceeded`                                                   | **原因：** 在未提供更具体错误码的情况下，达到了计费或用量上限。 <br /> **解决方案：** 遵循共享的 [计费错误指南](https://developers.openai.com/api/docs/guides/error-codes#api-errors).                                                                                                         |
| `rate_limit_exceeded`                                                    | **原因：** 请求超过了可用的速率限制。 <br /> **解决方案：** 请按照 [重试步骤](#retry-transient-failures).                                                                                                                                                                 |
| `server_overloaded`                                                      | **原因：** 模型服务暂时过载。 <br /> **解决方案：** [稍后重试未完成的工作](#retry-transient-failures)。如果过载持续， [为后续轮次更换模型](https://developers.openai.com/api/docs/guides/agents-api/configuration#update-settings-for-an-existing-session). |
| `flex_unavailable`                                                       | **原因：** Flex 处理暂时不可用。 <br /> **解决方案：** 稍后重试或 [更改会话的服务层级](https://developers.openai.com/api/docs/guides/agents-api/configuration#update-settings-for-an-existing-session) 为标准处理（`default`）以用于后续轮次。                           |
| `connection_failed`, `request_timeout`, `server_error`, `internal_error` | **原因：** 连接、超时或服务故障导致无法完成。 <br /> **解决方案：** 检查已保存的工作，然后 [限制重试次数后重试](#retry-transient-failures).                                                                                                             |
| `authentication_error`                                                   | **原因：** 由于凭据或权限原因，模型访问失败。 <br /> **解决方案：** 请参阅共享的 [身份验证与权限指南](https://developers.openai.com/api/docs/guides/error-codes#python-library-error-types).                                                                                    |
| `resource_not_found`                                                     | **原因：** 请求的模型或资源不可用。 <br /> **解决方案：** 在重试前检查模型和会话配置。                                                                                                                                                      |
| `sandbox_error`                                                          | **原因：** 环境无法完成操作。 <br /> **解决方案：** 检查环境错误并修复其配置或连接。                                                                                                                                        |
| `executor_version_incompatible`                                          | **原因：** 执行器无法运行此轮次。 <br /> **解决方案：** 升级执行器，然后在同一会话上重试（如果尚未失败）。                                                                                                                                                     |
| `active_turn_not_steerable`                                              | **原因：** 当前活动轮次无法接受更多输入。 <br /> **解决方案：** 等待其完成后再发送下一条消息。                                                                                                                                                                  |
| `cyber_policy`, `misalignment_policy_violation`                          | **原因：** 安全系统阻止了该请求。 <br /> **解决方案：** 在提交修改后的输入之前，请根据适用的安全要求审查该请求。                                                                                                                              |

## 会话和环境错误

一次失败的轮次并不总是意味着整个会话失败。检索该会话以
判断是否可以继续它。如果 `status` 为 `requires_action`，请处理其
[必需的操作](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#handle-required-actions).
如果会话失败，请修复原因并使用你仍然需要的输入创建一个新会话
。

| 代码                                                              | 概述                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `environment_connection_failed`, `environment_connection_timeout` | **原因：** 沙箱无法连接或连接耗时过长。 <br /> **解决方案：** 检查执行器启动与网络访问。对于自托管环境，请检查 [连接配置](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted). |
| `sandbox_error`                                                   | **原因：** 沙箱设置或执行失败。 <br /> **解决方案：** 检查设置命令、软件包、输入文件以及环境错误。                                                                                                           |
| `executor_version_incompatible`                                   | **原因：** 该会话的执行器版本不受支持。 <br /> **解决方案：** 在创建新会话之前升级执行器。                                                                                                                    |
| `idle_timeout`                                                    | **原因：** 托管环境因长时间无活动而过期。 <br /> **解决方案：** 创建一个新会话并重新提供输入。                                                                                                                    |
| `internal_error`                                                  | **原因：** 内部故障导致会话或环境无法就绪。 <br /> **解决方案：** 稍后重试设置。如果持续失败，请联系支持人员。                                                                          |

## 恢复

### 重试瞬时失败

使用此流程处理速率限制、过载、超时以及临时性服务
故障。在重试前，请先修复无效输入、凭证以及账单额度问题。

1. **检查结果。** 如果会话已创建，检索该会话、对话轮次以及 [已保存的项](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#fetch-items-and-turns)。如果该对话轮次仍在进行，继续跟踪它。如果已完成，使用其结果。
2. **检查已完成的操作。** 一个失败的对话轮次可能已经修改了文件或调用了外部工具。在要求智能体重复工作之前，请先确认这些影响。
3. **等待并限制重试次数。** 遵循共享的 [重试指南](https://developers.openai.com/api/docs/guides/rate-limits#retrying-with-exponential-backoff)，根据 `Retry-After` HTTP 响应进行判断，并设置尝试次数上限或截止时间。
4. **重试该请求或开启新的对话轮次。** 对于 HTTP 错误，在检查其结果后重试原始操作。对于失败的对话轮次，请等待直到会话变为 `idle`，然后 [发送一条跟进消息](https://developers.openai.com/api/docs/guides/agents-api/sessions#continue-or-steer-the-work) 要求其仅继续未完成的工作。这将在现有会话中开启一个新的对话轮次。

即使在一个轮次完成后也要检查工具结果。如果错误发生变化或达到重试上限，则停止自动重试。
重试上限时停止自动重试。

### 修正无效输入

更正所标识的字段后再重新提交。 `error.param` 或 `error.message` 提交前。

减少 [input and output schema](https://developers.openai.com/api/docs/guides/agents-api/sessions#input-size)
或 [tool result](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 然后重试。
如果 [智能体 configuration](https://developers.openai.com/api/docs/guides/agents-api/configuration) 过大，
请使用更小的指令和工具定义创建一个新会话。

有关上传要求和示例，请参阅 [Resolve upload errors](https://developers.openai.com/api/docs/guides/agents-api/environments/files#resolve-upload-errors).
如果消息提示图像有问题，请检查图像数据或 URL。

### 断开的流

一个 `error` 事件或断开的流并不能确认该轮的最终状态。
按照 [恢复断开的流](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#how-to-recover-a-disconnected-stream)
中的说明重新连接，并在重新提交输入前检查已保存的工作。
如果取回的会话处于 `status: "failed"` 状态，或者你收到 `agent.session.failed`,
错误，请停止重新连接，并参阅
[会话恢复指南](#session-and-environment-errors).

如遇 [持续性错误](https://developers.openai.com/api/docs/guides/error-codes#persistent-errors)，请在提交支持请求时附上请求 ID、会话 ID 和轮次 ID。
the request ID, session ID, and turn ID with your support request.