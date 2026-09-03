# 错误代码

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取该页面的 Markdown 版本。

本指南包含你可能从 [Responses [API](https://developers.openai.com/api/docs/concepts) 以及我们的 [官方 Python 库](https://developers.openai.com/api/docs/libraries#install-an-official-sdk)。看到的错误代码概述。概览中提到的每个错误代码都有专门的章节提供进一步指导。

## API 错误

| Code                                                         | Overview                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400 - 无效 `service_tier` 参数                        | **原因：** 所请求或解析的服务等级不允许用于该项目。 <br /> **解决方案：** 将 `service_tier` 设置为该项目允许的等级，或在 [项目设置](https://platform.openai.com/settings/).                                    |
| 401 - 身份验证无效                                 | **原因：** 身份验证无效 <br /> **解决方案：** 确保使用了正确的 [API 密钥](https://platform.openai.com/settings/organization/api-keys) 和请求组织。                                                                                                       |
| 401 - 提供的 API 密钥不正确                             | **原因：** 请求所使用的 API 密钥不正确。 <br /> **解决方案：** 确保使用的 API 密钥正确，清除浏览器缓存，或 [生成新的密钥](https://platform.openai.com/settings/organization/api-keys).                                                                         |
| 401 - 你必须是某个组织的成员才能使用 API | **原因：** 你的账户不属于任何组织。 <br /> **解决方案：** 联系我们以加入新组织，或让你的组织管理员 [邀请你加入组织](https://platform.openai.com/settings/organization/people).                                         |
| 401 - IP 未授权                                      | **原因：** 你的请求 IP 与项目或组织配置的 IP 白名单不匹配。 <br /> **解决方案：** 从正确的 IP 发送请求，或更新你的 [IP 白名单设置](https://platform.openai.com/settings/organization/security/ip-allowlist).               |
| 403 - 国家、地区或领土不受支持            | **原因：** 你正在从不受支持的国家、地区或领土访问 API。 <br /> **解决方案：** 请参阅 [此页面](https://developers.openai.com/api/docs/supported-countries) 了解更多信息。                                                                                                          |
| 429 - 信用额度已用尽                               | **代码：** `credit_balance_exhausted` <br /> **原因：** 你的组织没有剩余的预付信用额度。 <br /> **解决方案：** [充值信用额度](https://platform.openai.com/settings/organization/billing) 以继续使用 API。                                                               |
| 429 - 请求达到速率限制                        | **原因：** 你发送请求的速率过快。 <br /> **解决方案：** 调整请求节奏，并遵循 `Retry-After` header（如果存在）。阅读 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).                                                                                        |
| 429 - 请求过快                                              | **类型：** `rate_limit_error` <br /> **代码：** `slow_down` <br /> **原因：** 你的请求速率增长过快。 <br /> **解决方案：** 遵循 `Retry-After` header（如果存在），降低请求速率，并逐步提高。                                                 |
| 429 - 已达到组织支出上限                       | **代码：** `organization_spend_limit_exceeded` <br /> **原因：** 你的组织已达到强制支出上限。 <br /> **解决方案：** 提高或移除你的 [组织支出上限](https://platform.openai.com/settings/organization/limits).                                            |
| 429 - 已达到项目支出上限                            | **代码：** `project_spend_limit_exceeded` <br /> **原因：** 你的项目已达到强制支出上限。 <br /> **解决方案：** 在你的 [项目设置](https://platform.openai.com/settings/).                                                              |
| 429 - 已达到组织用量上限                       | **代码：** `organization_usage_limit_exceeded` <br /> **原因：** 你的组织已达到OpenAI分配的用量上限。 <br /> **解决方案：** 申请更高的 [批准用量上限](https://platform.openai.com/settings/organization/limits) 或 [联系支持](https://help.openai.com/). |
| 500 - 服务器在处理你的请求时发生错误  | **原因：** 我们服务器上的问题。 <br /> **解决方案：** 稍等片刻后重试请求，如果问题仍然存在，请联系我们。请查看 [状态页面](https://status.openai.com/).                                                                                                            |
| 503 - 模型暂时过载                           | **类型：** `service_unavailable_error` <br /> **代码：** `server_is_overloaded` <br /> **原因：** 所请求的模型暂时过载。 <br /> **解决方案：** 遵循 `Retry-After` 响应头（如果存在），然后重试请求。                                                   |

对于与计费相关的错误，请检查 `error.code` 以确定具体原因。范围更大的 `error.type` 仍然可以 `insufficient_quota`.

重试计费、支出或配额相关错误不会恢复 API 访问权限。请在发送下一个请求之前更新相关的额度或限额。

## WebSocket 模式错误

如果你正在使用 [Responses API 的 WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode)，你可能会遇到以下这些额外的错误：

- `previous_response_not_found`： `previous_response_id` 无法根据当前可用状态解析。请使用完整的输入上下文重试，并 `previous_response_id` 设置为 `null`.
- `websocket_connection_limit_reached`: 连接已达到 60 分钟的上限。请新建 WebSocket 连接并继续。



### 400 - Invalid service_tier argument


当请求选择或解析到该项目不允许的 service tier 时，API 会返回消息 "Invalid service_tier argument: The requested service tier is not allowed for this project."，并伴 `invalid_request_error` 随 `error.param` 设置为 `service_tier` 当请求选择或解析到该项目不允许的服务层级时。

项目限制适用于 `default`, `flex`，以及 `priority` 服务层级。 `fast` 服务层级评估为 `priority`。省略 `service_tier` 或将其设置为 `auto` 的请求如果解析到被禁用的层级，也可能返回此错误。Scale Tier 不受此项目策略限制。

若要解决此错误：

- 在 [项目设置](https://platform.openai.com/settings/).
- 将 `service_tier` 设置为该项目允许的层级。
- 如果请求使用了 `auto` 或省略了 `service_tier`，请更新项目设置，使解析后的层级被允许。







### 401 - 身份验证无效


此错误消息表明你的身份验证凭据无效。出现这种情况可能有多种原因，例如：

- 你正在使用一个已被吊销的 API 密钥。
- 你正在使用的 API 密钥与发起请求的组织或项目所分配的密钥不同。
- 你正在使用的 API 密钥没有调用该端点所需的权限。

要解决此错误，请按以下步骤操作：

- 检查你的请求头中使用的 API 密钥和组织 ID 是否正确。你可以在 [账户设置](https://platform.openai.com/settings/organization/api-keys) 中找到你的 API 密钥和组织 ID，也可以通过 [通用设置](https://platform.openai.com/settings/organization/general) 找到特定项目相关的密钥。方法是选择相应的项目。
- 如果你不确定你的 API 密钥是否有效，可以 [生成一个新的](https://platform.openai.com/settings/organization/api-keys)。请确保在请求中使用新的 API 密钥替换旧的密钥，并遵循我们的 [最佳实践指南](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).







### 401 - 提供的 API 密钥不正确


此错误消息表明你在请求中使用的 API 密钥不正确。可能由多种原因造成，例如：

- 你的 API 密钥中存在拼写错误或多余的空格。
- 你正在使用属于其他组织或项目的 API 密钥。
- 你正在使用一个已被删除或停用的 API 密钥。
- 旧的、已撤销的 API 密钥可能在本地被缓存。

要解决此错误，请按以下步骤操作：

- 尝试清除浏览器的缓存和 Cookie，然后重试。
- 检查你在请求头中使用的 API 密钥是否正确。
- 如果你不确定你的 API 密钥是否正确，你可以 [生成一个新的](https://platform.openai.com/settings/organization/api-keys)。请确保在代码库中替换旧的 API 密钥，并遵循我们的 [最佳实践指南](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).







### 401 - You must be a member of an organization to use the API


此错误信息表明你的账户不属于任何组织。这可能由多种原因导致，例如：

- 你已离开或被移出之前的组织。
- 你已离开或被移出之前的项目。
- 你的组织已被删除。

要解决此错误，请按以下步骤操作：

- 如果你已离开或被移出之前的组织，你可以申请一个新组织，或受邀加入现有组织。
- 若要申请新组织，请通过 help.openai.com 与我们联系。
- 现有组织所有者可以通过 [Team 页面](https://platform.openai.com/settings/organization/people) 邀请你加入他们的组织，也可以从 [Settings 页面](https://platform.openai.com/settings/organization/general).
- 如果你已离开或被移出之前的项目，你可以让你的组织所有者或项目所有者将你重新加入，或创建一个新项目。







### 429 - 信用额度已用完


该 `credit_balance_exhausted` 错误表明你所在组织的预付信用余额已用尽。

如需恢复 API 访问权限， [请前往账单设置添加额度](https://platform.openai.com/settings/organization/billing).







### 429 - 请求已达到速率限制


该错误信息表示你已触及所分配 API 的速率限制。这意味着你在短时间内提交了过多 token 或请求，已超出允许的请求数量。出现这种情况可能有多种原因，例如：

- 你正在使用循环或脚本发出频繁或并发的请求。
- 你正在与其他用户或应用共享你的 API 密钥。
- 你正在使用限速较低的免费套餐。
- 你已达到所在项目定义的上限

要解决此错误，请按以下步骤操作：

- 控制请求节奏，避免进行不必要或重复的调用。
- 如果响应中存在 `Retry-After` 标头，请至少等待其指定的时间后再重试。如果缺失该标头，请使用带抖动的指数退避策略，并限制重试次数。每个官方 SDK 在符合条件的重试中已经遵循此标头。更多信息请参阅我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).
- 如果你与他人共享组织，请注意限额是按组织而非按用户计算的。值得检查团队其他成员的使用情况，因为这也会计入限额。
- 如果你正在使用免费或低阶套餐，请考虑升级到提供更高速率限制的按量付费套餐。你可以参阅我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).
- 联系你的组织所有者以提高所在项目的速率限制







### 429 - 限速


一个 `429` response with the `rate_limit_error` type and `slow_down` code indicates that your request rate increased faster than the service can safely handle. It can occur even when your traffic is within its requests-per-minute and tokens-per-minute limits.

As a rule of thumb, once your traffic reaches 1 million input tokens per minute (TPM), increase it by no more than 50% every 15 minutes. The exact point at which the ramp-rate limit applies can vary by model and traffic conditions.

若要解决此错误：

- 如果响应中存在 `Retry-After` header 存在时，至少等待其指定的时长后再重试。如果缺少 header，则增大重试之间的延迟，并加入一个小的随机延迟。
- 降低请求速率，然后逐步提高。
- 保持流量模式稳定，以降低再次发生 `slow_down` 错误的几率。

按量付费流量经常触达速率提升上限的企业客户可以考虑 [Scale Tier](https://openai.com/api-scale-tier/) ，以在符合条件的模型上获得更可预期的容量。对于 GPT-5.6 及更高版本的模型，请参阅 [Reserved Tier](https://openai.com/api-reserved-tier/)。这些容量选项不能取代上述恢复步骤：请继续遵守 `Retry-After` 中的相关内容（如果存在），并逐步提升流量。







### 429 - 已达到组织支出限额


该 `organization_spend_limit_exceeded` 错误表明你的组织已达到强制执行的每月 [支出上限](https://developers.openai.com/api/docs/guides/spend-limits)。该上限适用于组织内所有项目的 API 流量。

要恢复 API 访问权限，请在你的 [组织限额设置](https://platform.openai.com/settings/organization/limits)。中提高或移除该上限。否则，访问将在每月限额重置后恢复。







### 429 - 项目支出限额已达上限


该 `project_spend_limit_exceeded` 错误表示你的项目已达到其强制月度 [支出上限](https://developers.openai.com/api/docs/guides/spend-limits)。其他项目可以继续运行，除非它们自己的限额或组织限额也已达到。

要恢复 API 访问权限，请在你的 [项目设置](https://platform.openai.com/settings/)。中提高或移除该上限。否则，访问将在每月限额重置后恢复。







### 429 - 已达到组织使用上限


该 `organization_usage_limit_exceeded` 错误表明你的组织已达到 OpenAI 分配的每月 [使用上限](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers). 该限额与你配置的组织及项目支出限额相互独立。

若要恢复 API 访问权限，请申请更高的 [已批准的使用上限](https://platform.openai.com/settings/organization/limits) 或 [联系支持团队](https://help.openai.com/).







### 503 - 模型暂时过载


一个 `503` response with the `service_unavailable_error` type and `server_is_overloaded` 错误代码表示所请求的模型当前没有足够的容量来处理你的请求。

如果响应中包含 `Retry-After` 头，请至少等待其指定的时长后再重试。如果该头缺失，请增大重试之间的间隔。如果错误仍然存在，请查看 [状态页](https://status.openai.com/) 以了解当前是否有正在发生的事件。





## Python 库错误类型

| 类型                     | Overview                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| APIConnectionError       | **原因：** 连接到我们的服务时出现问题。 <br /> **解决方案：** 检查你的网络设置、代理配置、SSL 证书或防火墙规则。                                                                                                                                                                                                                                                                                 |
| APITimeoutError          | **原因：** 请求超时。 <br /> **解决方案：** 短暂等待后重试你的请求，如果问题仍然存在，请联系我们。                                                                                                                                                                                                                                                                                                           |
| AuthenticationError      | **原因：** 你的 API 密钥或令牌无效、已过期或已被撤销。 <br /> **解决方案：** 检查你的 API 密钥或令牌，确保它正确且处于启用状态。你可能需要在你的账户控制台中重新生成一个。                                                                                                                                                                                                              |
| BadRequestError          | **原因：** 你的请求格式有误或缺少某些必需参数，例如令牌或输入。 <br /> **解决方案：** 错误消息应会提示你所犯的具体错误。请查阅 [文档](https://developers.openai.com/api/reference/overview) ，了解你正在调用的具体 API 方法，并确保你发送的参数有效且完整。你可能还需要检查请求数据的编码、格式或大小。 |
| ConflictError            | **原因：** 该资源已被另一个请求更新。 <br /> **解决方案：** 尝试再次更新该资源，并确保没有其他请求正在尝试更新它。                                                                                                                                                                                                                                                                      |
| InternalServerError      | **原因：** 我们这边出现了问题。 <br /> **解决方案：** 短暂等待后重试你的请求，如果问题仍然存在，请联系我们。                                                                                                                                                                                                                                                                                                           |
| NotFoundError            | **原因：** 请求的资源不存在。 <br /> **解决方案：** 请确认你使用的是正确的资源标识符。                                                                                                                                                                                                                                                                                                                       |
| PermissionDeniedError    | **原因：** 你没有访问所请求资源的权限。 <br /> **解决方案：** 请确认你使用的是正确的 API key、组织 ID 和资源 ID。                                                                                                                                                                                                                                                                             |
| RateLimitError           | **原因：** 你已达到分配的速率限制。 <br /> **解决方案：** 请合理控制请求节奏并遵循 `Retry-After` 提示（出现时使用）。每个官方 SDK 已自动遵循此响应头处理符合条件的重试。更多信息请参阅我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).                                                                                                                                                              |
| UnprocessableEntityError | **原因：** 请求格式正确但无法处理。 <br /> **解决方案：** 请重试该请求。                                                                                                                                                                                                                                                                                                            |



### APIConnectionError


一个 `APIConnectionError` 表示你的请求未能到达我们的服务器或未能建立安全连接。这可能是由于网络问题、代理配置、SSL 证书或防火墙规则导致的。

如果遇到 `APIConnectionError`，请尝试以下步骤：

- 检查你的网络设置，确保拥有稳定且快速的互联网连接。你可能需要切换到其他网络、使用有线连接，或减少占用带宽的设备或应用数量。
- 检查你的代理配置，确保它与我们的服务兼容。你可能需要更新代理设置、使用其他代理，或完全绕过代理。
- 检查你的 SSL 证书，确保它们有效且为最新版本。你可能需要安装或续订证书、使用其他证书颁发机构，或禁用 SSL 验证。
- 检查你的防火墙规则，确保它们没有阻止或过滤我们的服务。你可能需要修改防火墙设置。
- 在适用的情况下，检查你的容器是否具有发送和接收流量的正确权限。
- 如果问题仍然存在，请参阅我们关于持续性错误的下一步操作部分。







### APITimeoutError


一个 `APITimeoutError` error 表示你的请求耗时过长，服务器已关闭连接。这可能由网络问题、我们的服务负载过高，或请求过于复杂需要更多处理时间所导致。

如果遇到 `APITimeoutError` 错误，请尝试以下步骤：

- 等待几秒后重试请求。有时，网络拥塞或我们的服务负载可能会减轻，第二次尝试时请求可能会成功。
- 检查你的网络设置，确保拥有稳定且快速的互联网连接。你可能需要切换到其他网络、使用有线连接，或减少占用带宽的设备或应用数量。
- 如果问题仍然存在，请参阅我们关于持续性错误的下一步操作部分。







### AuthenticationError


一个 `AuthenticationError` 表示你的 API 密钥或令牌无效、已过期或已被吊销。这可能是由于拼写错误、格式错误或安全漏洞导致的。

如果遇到 `AuthenticationError`，请尝试以下步骤：

- 检查你的 API 密钥或令牌，确保其正确且处于激活状态。如果需要，可以从 API Key 控制台重新生成一个密钥，确保没有多余的空格或字符，或者在拥有多个密钥或令牌时使用其他可用的那个。
- 确保你已遵循正确的格式。







### BadRequestError



一个 `BadRequestError` (formerly `InvalidRequestError`)表示你的请求格式错误或缺少某些必需参数，例如令牌或输入。这可能是由于代码中存在拼写错误、格式错误或逻辑错误。

如果遇到 `BadRequestError`，请尝试以下步骤：

- 仔细阅读错误信息，明确具体的错误原因。错误信息应会告知你是哪个参数无效或缺失，以及期望的值或格式是什么。
- 查看 [API 参考](https://developers.openai.com/api/reference/overview) 针对你调用的具体 API 方法，确保你发送的参数有效且完整。你可能需要检查参数的名称、类型、值和格式，并确保它们与文档一致。
- 检查你请求数据的编码、格式或大小，确保它们与我们的服务兼容。如果数据过大，你可能需要将数据编码为 UTF-8、以 JSON 格式组织数据，或对数据进行压缩。
- 使用 Postman 或 curl 等工具测试你的请求，确保它按预期工作。你可能需要调试你的代码并修复请求逻辑中的任何错误或不一致之处。
- 如果问题仍然存在，请参阅我们关于持续性错误的下一步操作部分。







### InternalServerError


一个 `InternalServerError` 表明在处理你的请求时，我们这边出现了问题。这可能是由于临时错误、缺陷或系统故障导致的。

我们对由此带来的不便表示歉意，并会尽快解决这些问题。你可以 [查看我们的系统状态页面](https://status.openai.com/) 以获取更多信息。

如果遇到 `InternalServerError`，请尝试以下步骤：

- 稍等几秒后重试你的请求。有时问题可能会很快解决，第二次重试时请求就会成功。
- 查看我们的状态页，了解是否有任何可能影响我们服务的事故或维护。如果当前有进行中的事故，请关注更新并等待问题解决后再重试你的请求。
- 如果问题仍然存在，请查看我们的“持续性错误后续步骤”部分。

我们的支持团队将调查该问题并尽快回复你。由于需求量较大，我们的支持队列等待时间可能会比较长。你也可以 [在我们的社区论坛中发帖](https://community.openai.com) ，但请务必省略任何敏感信息。







### RateLimitError


一个 `RateLimitError` 表示你已触及分配的速率限制。这意味着你在给定时间段内发送了过多令牌或请求，我们的服务已暂时阻止你继续发送。

我们设置速率限制是为了确保资源被公平、高效地使用，并防止服务被滥用或过载。

如果遇到 `RateLimitError`，请尝试以下步骤：

- 减少发送的令牌或请求数量，或降低请求速度。你可以降低请求的频率或数量、将令牌分批发送，或者在重试时使用指数退避。 `Retry-After` 不存在时，你可以阅读我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits) 了解更多详情。
- 当 `Retry-After` 存在时，至少等待其指定的时间后再重试。官方 Python 库已对符合条件的重试遵守此响应头。
- 你也可以在账户仪表板中查看你的 API 使用统计信息。





### 持续性错误

如果问题仍然存在， [通过聊天联系我们的支持团队](https://help.openai.com/en/) 并向他们提供以下信息：

- 你正在使用的模型
- 你收到的错误消息和错误代码
- 你发送的请求数据和请求头
- 你请求的时间戳和时区
- 任何其他有助于我们排查问题的相关细节

我们的支持团队将调查该问题并尽快回复你。由于需求量较大，我们的支持队列等待时间可能会比较长。你也可以 [在我们的社区论坛中发帖](https://community.openai.com) ，但请务必省略任何敏感信息。

### 处理错误

建议你以编程方式处理 API 返回的错误。为此，你可以参考如下代码片段：

```javascript
import OpenAI from "openai";

const client = new OpenAI();

try {
  const response = await client.responses.create({
    model: "gpt-5.6",
    input: "Hello world",
  });
  console.log(response.output_text);
} catch (error) {
  if (error instanceof OpenAI.APIConnectionError) {
    console.error("Failed to connect to the OpenAI API:", error.message);
  } else if (error instanceof OpenAI.RateLimitError) {
    console.error("OpenAI API request exceeded its rate limit:", error.message);
  } else if (error instanceof OpenAI.APIError) {
    console.error("OpenAI API returned an error:", error.status, error.message);
  } else {
    throw error;
  }
}
```

```python
import openai
from openai import OpenAI

client = OpenAI()

try:
    response = client.responses.create(model="gpt-5.6", input="Hello world")
except openai.APIConnectionError as e:
    print(f"Failed to connect to OpenAI API: {e}")
except openai.RateLimitError as e:
    print(f"OpenAI API request exceeded rate limit: {e}")
except openai.APIError as e:
    print(f"OpenAI API returned an API Error: {e}")
else:
    print(response.output_text)
```

```go
package main

import (
	"context"
	"errors"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Hello world")},
	})
	if err != nil {
		var apiError *openai.Error
		if errors.As(err, &apiError) {
			fmt.Println("OpenAI API returned an API error:", apiError)
			return
		}
		fmt.Println("Failed to connect to OpenAI API:", err)
		return
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.errors.OpenAIServiceException;
import com.openai.models.responses.ResponseCreateParams;

try {
  var response =
      client
          .responses()
          .create(
              ResponseCreateParams.builder().model("gpt-5.6").input("Say hello.").build());

  response.output().stream()
      .flatMap(item -> item.message().stream())
      .flatMap(message -> message.content().stream())
      .flatMap(content -> content.outputText().stream())
      .forEach(text -> System.out.println(text.text()));
} catch (OpenAIServiceException error) {
  System.err.println(error.getMessage());
}
```

```ruby
require "openai"

client = OpenAI::Client.new
begin
  response = client.responses.create(model: "gpt-5.6", input: "Say hello.")
  puts(response.output_text)
rescue OpenAI::Errors::APIError => error
  warn(error.message)
end
```