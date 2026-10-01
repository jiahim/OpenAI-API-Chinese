# 错误与恢复

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾附加 `.md` 获取。

有关常规 HTTP error 以及 SDK 异常的信息，请参阅通用的 [错误代码指南](https://developers.openai.com/api/docs/guides/error-codes).

## 检查错误

检查 HTTP 响应中的请求错误。对于轮次或环境设置期间发生的失败，请检查事件和保存的状态。
环境设置，请检查事件和保存的状态。

| 失败     | 查看位置                                                                                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API 请求 | 读取 HTTP 状态码以及响应中的 `error` 对象。                                                                                                                                            |
| Turn        | 开启 `agent.session.turn.failed`, [检索该 turn](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/turns/methods/retrieve) 并检查 `status` 和 `error`. |
| Session     | 开启 `agent.session.failed`, [检索该 session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#inspect-a-session) 并检查 `status` 和 `error`.                                                 |
| 环境 | 请阅读 `environment.error` 中的 `agent.session.environment.failed`。另请参阅 [sandbox 故障排查](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted#troubleshooting).                             |

对于结构化错误，请在应用逻辑中使用 `error.code` ，并在 `error.message`
中说明失败原因。
对于请求验证错误， `error.param` 可以指出需要修正的字段。
处理未知错误码和缺失的 `param` ，不要因此中断错误处理逻辑。

在 beta API (中,`OpenAI-Beta: agents=v1`),会话的 `error` 是一个消息字符串
或 `null`。请读取随附的 SSE `error` 事件以获取会话失败码。

## API 请求错误

这些错误描述了对 智能体 API 的请求。它们与
[轮次错误](#turn-errors) （在工作开始后返回）是分开的。

| Code                                                     | 概述                                                                                                                                                                                                                                           |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400: `invalid_request_error`                             | **原因：** 输入或配置的值无效或过大。 <br /> **解决方案：** 修正由 `error.param` 或 `error.message`。另请参阅 [修正无效输入](#correct-invalid-input).                                    |
| 400: `invalid_beta`                                      | **原因：** 该 `OpenAI-Beta` header 包含无效值。 <br /> **解决方案：** 检查你使用的 API 版本所要求的 header。                                                                                                          |
| 400: `agent_not_persisted`                               | **原因：** 提供的 `agent_id` 属于会话本地的 智能体。 <br /> **解决方案：** [创建已保存的 智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) 并使用其 ID。                                         |
| 400: `invalid_otlp_endpoint`, `invalid_otlp_header`      | **原因：** 追踪 端点或 header 无效。 <br /> **解决方案：** 修正你的 [追踪 配置](https://developers.openai.com/api/docs/guides/agents-api/tracing).                                                                                            |
| 401: `unauthorized`；403: `forbidden`                    | **原因：** 身份验证失败或调用方缺少访问权限。 <br /> **解决方案：** 请参阅共享的 [身份验证与权限指南](https://developers.openai.com/api/docs/guides/error-codes#python-library-error-types).                                                |
| 404: `not_found_error`, `model_not_found`                | **原因：** 此资源或模型不适用于该请求。 <br /> **解决方案：** 请检查 ID、模型、项目，以及资源是否已被删除。                                                                                         |
| 409: `conflict_error`                                    | **原因：** 该操作与当前资源状态冲突。 <br /> **解决方案：** 请阅读错误信息并在重试前获取当前状态。                                                                                          |
| 409: `executor_version_incompatible`                     | **原因：** 不支持当前执行器版本。 <br /> **解决方案：** 请升级执行器后重试。                                                                                                                                            |
| 424: `mcp_server_startup_failed`                         | **原因：** MCP 服务器启动失败。 <br /> **解决方案：** 请检查服务器的配置和凭据。请参阅 [排查连接问题](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#troubleshoot-connections).                                   |
| 500: `internal_error`                                    | **原因：** 服务遇到意外错误。 <br /> **解决方案：** [重试前请检查已保存的工作](#retry-transient-failures)。请参阅共享的 [服务端错误指南](https://developers.openai.com/api/docs/guides/error-codes#api-errors).                       |
| 503: `service_unavailable_error`, `server_is_overloaded` | **原因：** 服务或某个依赖项暂时不可用或过载。 <br /> **解决方案：** 遵循共享的 [503 指南](https://developers.openai.com/api/docs/guides/error-codes#api-errors) 和 [重试前检查已保存的工作](#retry-transient-failures). |

## Turn errors

一次失败的轮次包含 `status: "failed"` 以及一个 `error` ，其附带 `code` 和 `message`.
例如，模型过载可能产生：

```json
{
  "code": "server_overloaded",
  "message": "The model is temporarily overloaded. Please retry your request after a brief delay."
}
```

Turn 状态码本身没有对应的 HTTP 状态。例如，一次失败的轮次使用
`server_overloaded`；而一个 HTTP 响应可以使用 `server_is_overloaded`.

| Code                                                                     | 概述                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `invalid_request`                                                        | **原因：** 输入或配置无效。 <br /> **解决方案：** 请修正消息中描述的输入后再重试。                                                                                                                                                              |
| `context_length_exceeded`                                                | **原因：** 输入超出了模型的上下文窗口。 <br /> **解决方案：** 请减少输入。如果对话过长，请使用更短的摘要开启新会话。                                                                                                                        |
| `session_budget_exceeded`                                                | **原因：** 会话已达到其使用额度。 <br /> **解决方案：** 开启新会话以继续。                                                                                                                                                                                          |
| `credit_balance_exhausted`                                               | **原因：** 该组织已没有剩余的 API 额度。 <br /> **解决方案：** 请参阅 [额度余额指引](https://developers.openai.com/api/docs/guides/error-codes#api-errors).                                                                                                                                          |
| `project_spend_limit_exceeded`                                           | **原因：** 项目已达到其强制支出上限。 <br /> **解决方案：** 请参阅 [项目支出上限指引](https://developers.openai.com/api/docs/guides/error-codes#api-errors).                                                                                                                                      |
| `organization_spend_limit_exceeded`                                      | **原因：** 组织已达到其强制支出上限。 <br /> **解决方案：** 请参阅 [组织支出上限指引](https://developers.openai.com/api/docs/guides/error-codes#api-errors).                                                                                                                            |
| `organization_usage_limit_exceeded`                                      | **原因：** 该组织已达到其 OpenAI 分配的使用上限。 <br /> **解决方案：** 请参阅 [组织使用上限指引](https://developers.openai.com/api/docs/guides/error-codes#api-errors).                                                                                                                     |
| `usage_limit_exceeded`                                                   | **原因：** 在缺少更具体错误代码的情况下，遇到了账单或使用上限问题。 <br /> **解决方案：** 遵循共享的 [账单错误指引](https://developers.openai.com/api/docs/guides/error-codes#api-errors).                                                                                                         |
| `rate_limit_exceeded`                                                    | **原因：** 请求超过了可用的速率上限。 <br /> **解决方案：** 按照 [重试步骤](#retry-transient-failures).                                                                                                                                                                 |
| `server_overloaded`                                                      | **原因：** 模型服务暂时过载。 <br /> **解决方案：** [延迟后重试未完成的工作](#retry-transient-failures)。如果过载持续， [为后续轮次更换模型](https://developers.openai.com/api/docs/guides/agents-api/configuration#update-settings-for-an-existing-session). |
| `flex_unavailable`                                                       | **原因：** Flex 处理暂时不可用。 <br /> **解决方案：** 稍后重试或 [更改会话的服务层级](https://developers.openai.com/api/docs/guides/agents-api/configuration#update-settings-for-an-existing-session) 为标准处理（`default`）以用于后续轮次。                           |
| `connection_failed`, `request_timeout`, `server_error`, `internal_error` | **原因：** 连接、超时或服务故障导致无法完成。 <br /> **解决方案：** 检查已保存的工作，然后 [重试时限制尝试次数](#retry-transient-failures).                                                                                                             |
| `authentication_error`                                                   | **原因：** 由于凭证或权限，模型访问失败。 <br /> **解决方案：** 请参阅共享的 [身份验证与权限指南](https://developers.openai.com/api/docs/guides/error-codes#python-library-error-types).                                                                                    |
| `resource_not_found`                                                     | **原因：** 所请求的模型或资源不可用。 <br /> **解决方案：** 重试前检查模型和会话配置。                                                                                                                                                      |
| `sandbox_error`                                                          | **原因：** 环境无法完成某个操作。 <br /> **解决方案：** 检查环境错误并修复其配置或连接。                                                                                                                                        |
| `executor_version_incompatible`                                          | **原因：** 执行器无法运行此轮次。 <br /> **解决方案：** 升级执行器，然后在该会话尚未失败时重试。                                                                                                                                                     |
| `active_turn_not_steerable`                                              | **原因：** 当前轮次无法接受更多输入。 <br /> **解决方案：** 等待其完成后再发送下一条消息。                                                                                                                                                                  |
| `cyber_policy`, `misalignment_policy_violation`                          | **原因：** 安全系统阻止了该请求。 <br /> **解决方案：** 在提交修改后的输入之前，请根据适用的安全要求检查该请求。                                                                                                                              |

## 会话和环境错误

某次轮次失败并不一定意味着会话已失败。请检索该会话以
决定是否可以继续。如果 `status` 处于 `requires_action`，状态，请处理它的
[必需操作](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#handle-required-actions).
如果会话已失败，请修复原因，并使用你仍然需要的输入创建一个新会话。
仍然需要。

| Code                                                              | 概述                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `environment_connection_failed`, `environment_connection_timeout` | **原因：** 沙箱无法连接或连接耗时过长。 <br /> **解决方案：** 检查执行器启动情况和网络访问。对于自托管环境，请检查 [连接设置](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted). |
| `sandbox_error`                                                   | **原因：** 沙箱设置或执行失败。 <br /> **解决方案：** 检查设置命令、软件包、输入文件以及环境错误。                                                                                                           |
| `executor_version_incompatible`                                   | **原因：** 该会话的执行器版本不受支持。 <br /> **解决方案：** 请在创建新会话之前升级执行器。                                                                                                                    |
| `idle_timeout`                                                    | **原因：** 托管环境因长时间无活动而过期。 <br /> **解决方案：** 创建一个新会话并重新提供输入。                                                                                                                    |
| `internal_error`                                                  | **原因：** 内部故障导致会话或环境无法就绪。 <br /> **解决方案：** 请稍后重试设置。若持续失败，请联系支持团队。                                                                          |

## 恢复

### 重试瞬时失败

此流程用于处理速率限制、过载、超时和临时服务
故障。重试前请先修复无效输入、凭据和计费限制。

1. **检查结果。** 如果会话已创建，获取该会话、该轮以及 [已保存条目](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#fetch-items-and-turns)。如果该轮仍在进行中，则继续跟踪它。如果已完成，则使用其结果。
2. **检查已完成的操作。** 失败的轮次可能已经修改了文件或调用了外部工具。在要求智能体重做之前，请确认这些影响。
3. **等待并限制重试次数。** 遵循共享的 [重试指南](https://developers.openai.com/api/docs/guides/rate-limits#retrying-with-exponential-backoff)，遵守 `Retry-After` 对 HTTP 响应的处理方式，并设置尝试次数上限或截止时间。
4. **重试请求或开启新一轮。** 对于 HTTP 错误，在检查结果后重试原始操作。对于失败的轮次，等待会话变为 `idle`，后， [发送跟进消息](https://developers.openai.com/api/docs/guides/agents-api/sessions#continue-or-steer-the-work) 要求其仅继续未完成的工作。这将基于已有会话开启新一轮。

即使一轮对话已完成，也要检查工具结果。如果错误发生变化或已达到
重试上限，则停止自动重试。

### 修正无效输入

更正所标识的字段，然后重新提交。 `error.param` 或 `error.message` 然后重新提交。

对于大小错误，请缩减 [输入和输出架构](https://developers.openai.com/api/docs/guides/agents-api/sessions#input-size)
或 [工具结果](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 后再重试。
如果 [智能体 配置](https://developers.openai.com/api/docs/guides/agents-api/configuration) 过大，
请创建一个新的会话，使用更小的指令和工具定义。

有关上传要求和示例，请参阅 [解决上传错误](https://developers.openai.com/api/docs/guides/agents-api/environments/files#resolve-upload-errors).
如果消息标识了图像问题，请检查图像数据或 URL。

### 已断开的流

一个 `error` 事件或断开连接的流无法确认本次轮次的最终状态。
请按照 [恢复断开的流](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#how-to-recover-a-disconnected-stream)
中的步骤重新连接并检查已保存的工作，然后再重新提交输入。
如果获取到的会话具有 `status: "failed"` ，或者你收到 `agent.session.failed`,
，请停止重连并参阅
[会话恢复指南](#session-and-environment-errors).

如遇 [持续性错误](https://developers.openai.com/api/docs/guides/error-codes#persistent-errors)，请在提交支持请求时附上
请求 ID、会话 ID 和轮次 ID。