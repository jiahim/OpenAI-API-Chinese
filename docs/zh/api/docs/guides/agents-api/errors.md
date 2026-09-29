# 错误与恢复

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 来获取。

有关常规 HTTP 错误和 SDK 异常，请参阅共享的 [错误代码指南](https://developers.openai.com/api/docs/guides/error-codes).

## 检查错误

检查 HTTP 响应中的请求错误。对于某次轮次或环境设置过程中发生的失败，请检查事件和已保存的状态。
环境设置过程中的失败，请检查事件和已保存的状态。

| 失败     | 排查位置                                                                                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API 请求 | 查看 HTTP 状态码以及响应中的 `error` 对象。                                                                                                                                            |
| 轮次        | 开 `agent.session.turn.failed`, [检索该轮次](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/turns/methods/retrieve) 并检查 `status` 和 `error`. |
| Session     | 开 `agent.session.failed`, [retrieve the session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#inspect-a-session) 并检查 `status` 和 `error`.                                                 |
| Environment | 读取 `environment.error` 在 `agent.session.environment.failed`。详见 [sandbox troubleshooting](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted#troubleshooting).                             |

对于结构化错误，请在应用逻辑中使用 `error.code` 来解释失败原因。 `error.message`
。对于请求验证错误，
请使用， `error.param` 来定位需要修正的字段。
处理未知错误码和缺失的 `param` ，避免破坏你的错误处理逻辑。

在 beta API 中（`OpenAI-Beta: agents=v1`），会话的 `error` 是一条消息字符串
或 `null`。请阅读随附的 SSE `error` 事件以获取会话失败码。

## API 请求错误

这些错误描述了对 智能体 API 的请求。它们与
[轮次错误](#turn-errors) 是分开返回的，这些错误在工作开始后返回。

| Code                                                     | 概述                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400: `invalid_request_error`                             | **原因：** 输入或配置值无效。 <br /> **解决方案：** 更正由 `error.param` 或 `error.message`。详见 [更正无效输入](#correct-invalid-input).                                                                                              |
| 400: `invalid_beta`                                      | **原因：** 该 `OpenAI-Beta` 标头包含无效值。 <br /> **解决方案：** 检查你所使用的 API 版本所需的标头。                                                                                                                                                       |
| 400: `agent_not_persisted`                               | **原因：** 所提供的 `agent_id` 属于会话本地的 智能体。 <br /> **解决方案：** [创建一个已保存的 智能体](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) 并使用其 ID。                                                                                      |
| 400: `invalid_otlp_endpoint`, `invalid_otlp_header`      | **原因：** 追踪 端点或标头无效。 <br /> **解决方案：** 更正你的 [追踪 配置](https://developers.openai.com/api/docs/guides/agents-api/tracing).                                                                                                                                         |
| 401: `unauthorized`; 403: `forbidden`                    | **原因：** 身份验证失败或调用方缺少访问权限。 <br /> **解决方案：** 检查 API 密钥及其组织、项目和资源权限。                                                                                                                                    |
| 404: `not_found_error`, `model_not_found`                | **原因：** 该资源或模型不适用于本次请求。 <br /> **解决方案：** 检查 ID、模型、项目以及该资源是否已被删除。                                                                                                                                      |
| 409: `conflict_error`                                    | **原因：** 该操作与当前的资源状态冲突。 <br /> **解决方案：** 读取错误信息，并在重试前获取当前状态。                                                                                                                                       |
| 409: `executor_version_incompatible`                     | **原因：** 执行器版本不受支持。 <br /> **解决方案：** 升级执行器后重试。                                                                                                                                                                                         |
| 424: `mcp_server_startup_failed`                         | **原因：** MCP 服务器启动失败。 <br /> **解决方案：** 检查服务器的配置和凭据。请参阅 [排查连接问题](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#troubleshoot-connections).                                                                                |
| 500: `internal_error`                                    | **原因：** 服务遇到意外错误。 <br /> **解决方案：** [重试你的请求](#retry-transient-failures) 稍后重试，如果问题仍然存在，请联系我们。请查看 [状态页](https://status.openai.com/). |
| 503: `service_unavailable_error`, `server_is_overloaded` | **原因：** 服务或其依赖项暂时不可用或负载过高。 <br /> **解决方案：** Honor `Retry-After` 当存在时，按递增的延迟进行重试。                                                                                                                      |

## Turn 错误

失败的轮次包含 `status: "failed"` ，以及一个 `error` ，其 `code` 和 `message`.
例如，模型过载可能产生：

```json
{
  "code": "server_overloaded",
  "message": "The model is temporarily overloaded. Please retry your request after a brief delay."
}
```

轮次代码本身没有 HTTP 状态码。例如，一次失败的轮次使用
`server_overloaded`；HTTP 响应可以使用 `server_is_overloaded`.

| Code                                                                     | 概述                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `invalid_request`                                                        | **原因：** 输入或配置无效。 <br /> **解决方案：** 请先修正消息中描述的输入，然后再重试。                                                                                                                                                              |
| `context_length_exceeded`                                                | **原因：** 输入超出模型的上下文窗口。 <br /> **解决方案：** 请减少输入。如果会话过长，请使用更简短的摘要开启新会话。                                                                                                                        |
| `session_budget_exceeded`                                                | **原因：** 该会话已达到其使用配额。 <br /> **解决方案：** 请开启新会话以继续。                                                                                                                                                                                          |
| `credit_balance_exhausted`                                               | **原因：** 该组织没有剩余的 API 额度。 <br /> **解决方案：** 请在重试前添加额度。                                                                                                                                                                                     |
| `project_spend_limit_exceeded`                                           | **原因：** 该项目已达到强制支出上限。 <br /> **解决方案：** 提高或移除该项目的 [支出上限](https://developers.openai.com/api/docs/guides/spend-limits).                                                                                                                                    |
| `organization_spend_limit_exceeded`                                      | **原因：** 该组织已达到强制支出上限。 <br /> **解决方案：** 提高或移除该组织的 [支出上限](https://developers.openai.com/api/docs/guides/spend-limits).                                                                                                                          |
| `organization_usage_limit_exceeded`                                      | **原因：** 该组织已达到 OpenAI 分配的使用上限。 <br /> **解决方案：** 申请更高的 [使用上限](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers).                                                                                                                             |
| `usage_limit_exceeded`                                                   | **原因：** 已达到账单或使用上限，但没有更具体的错误代码。 <br /> **解决方案：** 请在重试前检查额度、支出上限和使用上限。                                                                                                                               |
| `rate_limit_exceeded`                                                    | **原因：** 请求超过了可用的速率上限。 <br /> **解决方案：** 降低请求速率并 [使用递增的延迟进行重试](#retry-transient-failures).                                                                                                                               |
| `server_overloaded`                                                      | **原因：** 模型服务暂时过载。 <br /> **解决方案：** [延迟后重试未完成的工作](#retry-transient-failures)。如果过载仍然存在， [为后续轮次更换模型](https://developers.openai.com/api/docs/guides/agents-api/configuration#update-settings-for-an-existing-session). |
| `flex_unavailable`                                                       | **原因：** Flex 处理暂时不可用。 <br /> **解决方案：** 稍后重试或 [更改会话的服务层级](https://developers.openai.com/api/docs/guides/agents-api/configuration#update-settings-for-an-existing-session) 为标准处理（`default`）用于后续轮次。                           |
| `connection_failed`, `request_timeout`, `server_error`, `internal_error` | **原因：** 连接、超时或服务故障导致无法完成。 <br /> **解决方案：** 检查已保存的工作，然后 [限制重试次数后重试](#retry-transient-failures).                                                                                                             |
| `authentication_error`                                                   | **原因：** 由于凭证或权限问题，模型访问失败。 <br /> **解决方案：** 检查 API 密钥及其组织、项目和模型访问权限。                                                                                                                                   |
| `resource_not_found`                                                     | **原因：** 请求的模型或资源不可用。 <br /> **解决方案：** 在重试前检查模型和会话配置。                                                                                                                                                      |
| `sandbox_error`                                                          | **原因：** 环境无法完成某项操作。 <br /> **解决方案：** 检查环境错误并修复其配置或连接问题。                                                                                                                                        |
| `executor_version_incompatible`                                          | **原因：** 执行器无法运行此轮次。 <br /> **解决方案：** 升级执行器,如果尚未失败则在同一会话上重试。                                                                                                                                                     |
| `active_turn_not_steerable`                                              | **原因：** 当前轮次无法再接受输入。 <br /> **解决方案：** 等待其完成后再发送下一条消息。                                                                                                                                                                  |
| `cyber_policy`, `misalignment_policy_violation`                          | **原因：** 安全系统阻止了该请求。 <br /> **解决方案：** 在提交修订后的输入之前,根据适用的安全要求检查该请求。                                                                                                                              |

计费错误需要采取计费相关的操作，而不是更快的重试循环。当没有更具体的原因时，
`usage_limit_exceeded` 仍然可能发生。

## 会话和环境错误

失败的轮次并不一定意味着会话已失败。检索该会话以
判断是否可以继续。如果 `status` 为 `requires_action`，请处理其
[required actions](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#handle-required-actions).
如果会话已失败，请修复原因，并使用你仍然需要的输入创建一个新会话。
。

| Code                                                              | 概述                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `environment_connection_failed`, `environment_connection_timeout` | **原因：** 沙箱无法连接或连接耗时过长。 <br /> **解决方案：** 检查执行器启动情况和网络访问。对于自托管环境，请检查 [连接设置](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted). |
| `sandbox_error`                                                   | **原因：** 沙箱设置或执行失败。 <br /> **解决方案：** 检查设置命令、软件包、输入文件以及环境错误。                                                                                                           |
| `executor_version_incompatible`                                   | **原因：** 该会话的执行器版本不受支持。 <br /> **解决方案：** 在创建新会话之前升级执行器。                                                                                                                    |
| `idle_timeout`                                                    | **原因：** 托管环境因长时间无活动而过期。 <br /> **解决方案：** 创建一个新会话并再次提供输入。                                                                                                                    |
| `internal_error`                                                  | **原因：** 内部故障导致会话或环境未能就绪。 <br /> **解决方案：** 稍后重试设置。如果问题持续，请联系支持团队。                                                                          |

## 恢复

### 重试暂时性故障

使用此流程处理速率限制、过载、超时和临时服务
failures. 修复无效输入、凭证和账单限额，然后再重试这些操作。

1. **检查结果。** 如果已创建会话，则获取该会话、该轮次以及 [已保存的项目](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#fetch-items-and-turns)。如果该轮次仍在进行中，继续跟踪它。如果已完成，则使用其结果。
2. **检查已完成的操作。** 失败的轮次可能已经修改了文件或调用了外部工具。在要求该 智能体 重做工作之前，请先确认这些影响。
3. **等待并限制重试次数。** 遵循 `Retry-After` 当 HTTP 响应中包含该值时。否则，使用 [带抖动的指数退避](https://developers.openai.com/api/docs/guides/rate-limits#retrying-with-exponential-backoff)：增加重试之间的延迟，并加入少量随机延迟。设置重试次数上限或截止时间。
4. **重试请求或开启新的轮次。** 对于 HTTP 错误，检查其结果后重试原始操作。对于失败的轮次，请等待会话进入 `idle`，然后 [发送后续消息](https://developers.openai.com/api/docs/guides/agents-api/sessions#continue-or-steer-the-work) 要求它仅继续未完成的工作。这将基于已有对话开启一个新的轮次。

即使一轮完成，也要检查工具结果。如果错误发生变化，请停止自动重试，否则
已达到重试上限。

### 更正无效输入

更正所标识的字段后 `error.param` 或 `error.message` 再重新提交。
有关上传要求和示例，请参阅 [解决上传错误](https://developers.openai.com/api/docs/guides/agents-api/environments/files#resolve-upload-errors).
如果该消息指出图像存在问题，请检查图像数据或 URL。

### 已断开的流

一个 `error` 事件或断开的流无法确认该轮的最终状态。
按照 [恢复断开的流](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#how-to-recover-a-disconnected-stream)
中的步骤重新连接，并在重新提交输入前检查已保存的内容。

如果问题仍然存在，请保留请求 ID、会话 ID、轮次 ID、错误代码以及
失败发生的时间，以便联系支持。