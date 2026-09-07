# 错误代码

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

本指南概述了你可能在以下两种情况下看到的错误代码： [API](https://developers.openai.com/api/docs/concepts) 以及我们的 [官方 Python 库](https://developers.openai.com/api/docs/libraries#install-an-official-sdk)。概览中提到的每个错误代码都有专门的小节提供进一步指导。

## API 错误

| 代码                                                         | 概述                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400 - 无效 `service_tier` 参数                        | **原因：** 所请求或已解析的服务等级不允许用于该项目。 <br /> **解决方案：** 将 `service_tier` 设置为该项目允许的等级，或者在 [项目设置](https://platform.openai.com/settings/).                                    |
| 401 - 身份验证无效                                 | **原因：** 身份验证无效 <br /> **解决方案：** 确保使用正确的 [API 密钥](https://platform.openai.com/settings/organization/api-keys) 以及发起请求的组织。                                                                                                       |
| 401 - 提供的 API 密钥不正确                             | **原因：** 发起请求的 API 密钥不正确。 <br /> **解决方案：** 确保使用的 API 密钥正确，清除浏览器缓存，或者 [生成新密钥](https://platform.openai.com/settings/organization/api-keys).                                                                         |
| 401 - 你必须是某个组织的成员才能使用 API | **原因：** 你的账户不属于任何组织。 <br /> **解决方案：** 联系我们以加入新组织，或让你的组织管理员 [邀请你加入组织](https://platform.openai.com/settings/organization/people).                                         |
| 401 - IP 未获授权                                      | **原因：** 你的请求 IP 与项目或组织配置的 IP 白名单不匹配。 <br /> **解决方案：** 从正确的 IP 发送请求，或更新你的 [IP 白名单设置](https://platform.openai.com/settings/organization/security/ip-allowlist).               |
| 403 - 不支持的国家、区域或地区            | **原因：** 你正在从不支持的国家、区域或地区访问 API。 <br /> **解决方案：** 请参阅 [此页面](https://developers.openai.com/api/docs/supported-countries) 了解更多信息。                                                                                                          |
| 429 - 信用额度已用尽                               | **代码：** `credit_balance_exhausted` <br /> **原因：** 你的组织已没有剩余的预付信用额度。 <br /> **解决方案：** [充值信用额度](https://platform.openai.com/settings/organization/billing) 以继续使用 API。                                                               |
| 429 - 请求已达到速率限制                        | **原因：** 你发送请求的频率过高。 <br /> **解决方案：** 调整请求节奏，并遵循 `Retry-After` header（如有）。请参阅 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).                                                                                        |
| 429 - 请求过快                                              | **类型：** `rate_limit_error` <br /> **代码：** `slow_down` <br /> **原因：** 你的请求速率增长过快。 <br /> **解决方案：** 请遵循 `Retry-After` header（如有），降低请求速率，并逐步提升。                                                 |
| 429 - 已达到组织消费额度上限                       | **代码：** `organization_spend_limit_exceeded` <br /> **原因：** 你的组织已达到强制消费额度上限。 <br /> **解决方案：** 提高或移除你的 [组织消费额度](https://platform.openai.com/settings/organization/limits).                                            |
| 429 - 已达到项目消费额度上限                            | **代码：** `project_spend_limit_exceeded` <br /> **原因：** 你的项目已达到强制消费额度上限。 <br /> **解决方案：** 在你的 [项目设置](https://platform.openai.com/settings/).                                                              |
| 429 - 已达到组织用量上限                       | **代码：** `organization_usage_limit_exceeded` <br /> **原因：** 你的组织已达到OpenAI分配的用量上限。 <br /> **解决方案：** 申请更高的 [已批准用量上限](https://platform.openai.com/settings/organization/limits) 或 [联系客服](https://help.openai.com/). |
| 500 - 服务器在处理你的请求时发生错误  | **原因：** 我们服务器上的问题。 <br /> **解决方案：** 请稍等片刻后重试，如果问题仍然存在，请联系我们。查看 [状态页面](https://status.openai.com/).                                                                                                            |
| 503 - 模型暂时过载                           | **类型：** `service_unavailable_error` <br /> **代码：** `server_is_overloaded` <br /> **原因：** 所请求的模型暂时过载。 <br /> **解决方案：** 请遵循 `Retry-After` 请求头（如果存在），然后重试你的请求。                                                   |

对于与计费相关的错误，请检查 `error.code` 以确定具体原因。整体 `error.type` 仍然可以 `insufficient_quota`.

重试计费、支出或配额错误不会恢复 API 访问权限。请在发送另一个请求之前更新相应的额度或限额。

## WebSocket 模式错误

如果你正在使用 [Responses API 的 WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode)，你可能会遇到以下这些额外的错误：

- `previous_response_not_found`: The `previous_response_id` 无法根据当前可用状态解析。请附带完整输入上下文重试，并 `previous_response_id` 设置为 `null`.
- `websocket_connection_limit_reached`: 连接已达到 60 分钟上限。请新建 WebSocket 连接并继续。



### 400 - 无效的 service_tier 参数


该 API 返回消息 "Invalid service_tier argument: The requested service tier is not allowed for this project."，并在 `invalid_request_error` 设置为 `error.param` 为 `service_tier` 当请求选择或解析到该项目不允许的服务层级时。

项目限制适用于 `default`, `flex`，以及 `priority` 服务层级。 `fast` 服务层级被评估为 `priority`。省略 `service_tier` 或将其设置为 `auto` 的请求，如果解析到不允许的层级，也可能会返回此错误。Scale Tier 不在此项目策略范围内。

要解决此错误：

- 在 [项目设置](https://platform.openai.com/settings/).
- 中查看允许的服务层级 `service_tier` 设置为该项目允许的层级。
- 如果请求使用 `auto` 或省略 `service_tier`，请更新项目设置，以允许解析后的层级。







### 401 - 身份验证无效


此错误消息表明你的身份验证凭据无效。出现这种情况可能有多种原因，例如：

- 你正在使用一个已撤销的 API 密钥。
- 你使用的 API 密钥与请求所属组织或项目分配的密钥不同。
- 你使用的 API 密钥没有调用该接口所需的权限。

要解决此错误，请按照以下步骤操作：

- 检查你的请求标头中使用的 API 密钥和组织 ID 是否正确。你可以在 [账户设置](https://platform.openai.com/settings/organization/api-keys) 中找到你的 API 密钥和组织 ID，或者你可以在 [通用设置](https://platform.openai.com/settings/organization/general) 中找到特定项目相关的密钥，方法是选择所需项目。
- 如果不确定你的 API 密钥是否有效，可以 [生成一个新的](https://platform.openai.com/settings/organization/api-keys)。请确保在请求中使用新的 API 密钥替换旧密钥，并遵循我们的 [最佳实践指南](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).







### 401 - 提供的 API 密钥不正确


该错误消息表明你在请求中使用的 API 密钥不正确。可能的原因包括：

- 你的 API 密钥中存在拼写错误或多余的空格。
- 你正在使用属于其他组织或项目的 API 密钥。
- 你正在使用一个已被删除或停用的 API 密钥。
- 旧的、已撤销的 API 密钥可能在本地被缓存。

要解决此错误，请按照以下步骤操作：

- 尝试清除浏览器的缓存和 cookie，然后重试。
- 检查你的请求头中是否使用了正确的 API 密钥。
- 如果你不确定自己的 API 密钥是否正确，可以 [生成一个新的](https://platform.openai.com/settings/organization/api-keys)。请确保在代码库中替换掉旧的 API 密钥，并按照我们的 [最佳实践指南](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).







### 401 - 您必须是组织的成员才能使用 API


此错误消息表明你的账号不属于任何组织。出现这种情况可能有多种原因，例如：

- 你已离开或被移出原先的组织。
- 你已离开或被移出原先的项目。
- 你的组织已被删除。

要解决此错误，请按照以下步骤操作：

- 如果你已离开或被移出原先的组织，可以申请一个新的组织，或接受邀请加入已有组织。
- 如需申请新的组织，请通过 help.openai.com 与我们联系
- 已有组织的管理者可以通过 [Team 页面](https://platform.openai.com/settings/organization/people) 邀请你加入其组织，也可以从 [Settings 页面](https://platform.openai.com/settings/organization/general).
- 如果你已离开或被移出原先的项目，可以请你的组织或项目所有者重新添加你，或创建一个新项目。







### 429 - 信用余额已用尽


该 `credit_balance_exhausted` 错误表明你所在组织的预付信用余额已用尽。

要恢复 API 访问权限， [请在账单设置中添加额度](https://platform.openai.com/settings/organization/billing).







### 429 - 已达到请求速率限制


此错误消息表示你已达到 API 的速率上限。这意味着你在短时间内提交了过多 token 或请求，已超出允许的请求数量。出现此情况可能有多种原因，例如：

- 你正在使用循环或脚本发起频繁或并发的请求。
- 你正在与其他用户或应用共享你的 API 密钥。
- 你正在使用速率限制较低的计划。
- 你已达到所在项目的既定上限

要解决此错误，请按照以下步骤操作：

- 控制请求节奏，避免进行不必要或重复的调用。
- 如果响应 `Retry-After` 中包含相关标头，请在重试前至少等待该标头指定的时间；如果没有该标头，请使用带抖动的指数退避策略，并限制重试次数。SDK 对较长服务端延迟的支持因版本和配置而异。详情请参阅我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits#retrying-with-exponential-backoff).
- 如果你与他人共享你的组织，请注意限速是按组织而非按用户施加的。建议查看团队其他成员的使用情况，因为这部分用量也会计入限额。
- 如果你正在使用免费或低层级计划，请考虑升级到提供更高速率限制的按量付费计划。你可以在我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).
- 联系你的组织所有者以提升项目的速率限制







### 429 - Slow down


一个 `429` 包含以下字段的 `rate_limit_error` type 和 `slow_down` code 表示你的请求速率增长过快，超出了服务能够安全处理的范围。即使你的流量仍在每分钟请求数和每分钟 token 数限制之内，也可能出现这种情况。

作为经验法则，一旦你的流量达到每分钟 100 万输入 token（TPM），每 15 分钟的增长幅度不要超过 50%。斜坡速率限制的精确触发点可能因模型和流量状况而异。

要解决此错误：

- 如果响应 `Retry-After` 如果存在 header，请至少等待它指定的时长后再重试。如果缺失，请在重试之间增大延迟，并添加一个较小的随机延迟。
- 降低你的请求速率，然后再逐步提高。
- 保持稳定的流量模式，以降低再次出现 `slow_down` 错误的概率。

按量付费流量经常触及速率提升上限的企业客户可以考虑 [Scale Tier](https://openai.com/api-scale-tier/) ，以在符合条件模型上获得更可预期的容量。对于 GPT-5.6 及更高版本的模型，请参阅 [Reserved Tier](https://openai.com/api-reserved-tier/)。这些容量选项不能取代上述恢复步骤：请继续遵循 `Retry-After` 中的相关指引，并在出现时按提示逐步提升流量。







### 429 - 已达到组织消费上限


该 `organization_spend_limit_exceeded` 错误表明你的组织已达到强制执行的每月 [消费上限](https://developers.openai.com/api/docs/guides/spend-limits)。该上限适用于组织内所有项目的 API 流量。

若要恢复 API 访问权限，请在你的 [组织限额设置](https://platform.openai.com/settings/organization/limits)。中提高或移除该限制。否则，访问权限将在每月限额重置后恢复。







### 429 - 已达到项目支出限额


该 `project_spend_limit_exceeded` error indicates that your project reached its enforced monthly [消费上限](https://developers.openai.com/api/docs/guides/spend-limits). 其他项目可以继续运行，除非它们自身的限额或组织限额也已达到。

若要恢复 API 访问权限，请在你的 [项目设置](https://platform.openai.com/settings/)。中提高或移除该限制。否则，访问权限将在每月限额重置后恢复。







### 429 - 已达到组织使用上限


该 `organization_usage_limit_exceeded` 错误表示你的组织已达到 OpenAI 分配的每月 [用量上限](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers)。此上限与你配置的组织及项目支出限制是相互独立的。

要恢复 API 访问权限，请申请更高的 [批准用量上限](https://platform.openai.com/settings/organization/limits) 或 [联系支持团队](https://help.openai.com/).







### 503 - 模型暂时过载


一个 `503` 包含以下字段的 `service_unavailable_error` type 和 `server_is_overloaded` code 表示所请求的模型当前没有足够的容量来处理你的请求。

如果存在 `Retry-After` 头，请在重试前至少等待其所指定的时间。如果该头缺失，请增加重试之间的间隔。如果错误仍然存在，请查看 [状态页](https://status.openai.com/) 以了解是否有正在发生的事件。





## Python 库错误类型

Python 会针对 `RateLimitError` 和 `429` 响应抛出 `InternalServerError` 和 `503` 响应。如果你的处理器之前只捕获了其中一类用于处理限流和过载,请同时处理这两类并检查 `error.code`。例如,视频过载现在返回 `503` ,而此前返回的是 `429`。请参阅 [迁移指南](https://developers.openai.com/api/docs/guides/rate-limits#update-existing-error-handlers) 了解各端点的具体变更。

| 类型                     | 概述                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| APIConnectionError       | **原因：** 连接我们的服务时出现问题。 <br /> **解决方案：** 检查你的网络设置、代理配置、SSL 证书或防火墙规则。                                                                                                                                                                                                                                                                                 |
| APITimeoutError          | **原因：** 请求超时。 <br /> **解决方案：** 短暂等待后重试你的请求，如果问题仍然存在，请联系我们。                                                                                                                                                                                                                                                                                                           |
| AuthenticationError      | **原因：** 你的 API 密钥或令牌无效、已过期或已被撤销。 <br /> **解决方案：** 检查你的 API 密钥或令牌，确保它正确且处于有效状态。你可能需要在账户控制台中生成一个新的。                                                                                                                                                                                                              |
| BadRequestError          | **原因：** 你的请求格式错误或缺少某些必需参数，例如令牌或输入。 <br /> **解决方案：** 错误消息应提示你具体的错误所在。请查阅 [文档](https://developers.openai.com/api/reference/overview) 了解你所调用的具体 API 方法，并确保你发送的参数有效且完整。你可能还需要检查请求数据的编码、格式或大小。 |
| ConflictError            | **原因：** 该资源已被其他请求更新。 <br /> **解决方案：** 尝试再次更新该资源，并确保没有其他请求在同时更新它。                                                                                                                                                                                                                                                                      |
| InternalServerError      | **原因：** 我们这边出现问题。 <br /> **解决方案：** 短暂等待后重试你的请求，如果问题仍然存在，请联系我们。                                                                                                                                                                                                                                                                                                           |
| NotFoundError            | **原因：** 请求的资源不存在。 <br /> **解决方案：** 请确认你使用的是正确的资源标识符。                                                                                                                                                                                                                                                                                                                       |
| PermissionDeniedError    | **原因：** 你没有访问所请求资源的权限。 <br /> **解决方案：** 请确保你使用的API密钥、组织 ID 和资源 ID 都正确无误。                                                                                                                                                                                                                                                                             |
| RateLimitError           | **原因：** 你已达到分配的速率限制，或者流量增长过快。 <br /> **解决方案：** 请合理控制请求节奏，并遵循 `Retry-After` 中的指引（若返回了相关提示），同时遵守你的重试限制。更多信息请参阅我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits#retrying-with-exponential-backoff).                                                                                                                                |
| UnprocessableEntityError | **原因：** 请求格式正确，但无法处理。 <br /> **解决方案：** 请重试该请求。                                                                                                                                                                                                                                                                                                            |



### API 连接错误


一个 `APIConnectionError` 表明你的请求无法抵达我们的服务器或无法建立安全连接。这可能是由网络问题、代理配置、SSL 证书或防火墙规则引起的。

如果你遇到 `APIConnectionError`，请尝试以下步骤：

- 检查你的网络设置，并确保你拥有稳定且快速的网络连接。你可能需要切换到其他网络、使用有线连接，或减少占用带宽的设备或应用程序数量。
- 检查你的代理配置，并确保其与我们的服务兼容。你可能需要更新代理设置、使用其他代理，或完全绕过代理。
- 检查你的 SSL 证书，并确保它们有效且为最新版本。你可能需要安装或更新证书、更换证书颁发机构，或禁用 SSL 验证。
- 检查你的防火墙规则，并确保它们未阻止或过滤我们的服务。你可能需要修改防火墙设置。
- 如适用，请检查你的容器是否具有发送和接收流量的正确权限。
- 如果问题仍然存在，请查看我们关于持续性错误的下一步操作部分。







### APITimeoutError


一个 `APITimeoutError` 错误表明你的请求耗时过长，我们的服务器已关闭连接。这可能是由于网络问题、我们的服务负载过高，或者请求过于复杂需要更多处理时间。

如果遇到 `APITimeoutError` 错误，请尝试以下步骤：

- 请稍候几秒后重试请求。有时，网络拥塞或服务负载会在稍后降低，第二次重试即可成功。
- 检查你的网络设置，并确保你拥有稳定且快速的网络连接。你可能需要切换到其他网络、使用有线连接，或减少占用带宽的设备或应用程序数量。
- 如果问题仍然存在，请查看我们关于持续性错误的下一步操作部分。







### AuthenticationError


一个 `AuthenticationError` 表示你的 API 密钥或令牌无效、已过期或已被吊销。这可能是由于拼写错误、格式错误或安全漏洞导致的。

如果你遇到 `AuthenticationError`，请尝试以下步骤：

- 检查你的 API 密钥或令牌，确认其正确且处于启用状态。如果有多个密钥或令牌，你可能需要在 API Key 控制台中重新生成一个新密钥，确认没有多余空格或字符，或者改用其他可用的密钥或令牌。
- 确保遵循正确的格式。







### BadRequestError



一个 `BadRequestError` (formerly `InvalidRequestError`) 表明你的请求格式错误或缺少某些必需参数，例如 token 或输入。这可能是由代码中的拼写错误、格式错误或逻辑错误导致的。

如果你遇到 `BadRequestError`，请尝试以下步骤：

- 仔细阅读错误消息并找出具体的错误。错误消息会提示你哪个参数无效或缺失，以及期望的值或格式是什么。
- 请参阅 [API 参考文档](https://developers.openai.com/api/reference/overview) 中你所调用的具体 API 方法，确保你发送的参数有效且完整。你可能需要检查参数的名称、类型、取值和格式，并确认它们与文档一致。
- 检查请求数据的编码、格式或大小，确保它们与我们的服务兼容。你可能需要将数据编码为 UTF-8、将数据格式化为 JSON，或者在数据过大时对其进行压缩。
- 使用 Postman 或 curl 等工具测试你的请求，确保它能按预期工作。你可能需要调试你的代码，修复请求逻辑中的任何错误或不一致。
- 如果问题仍然存在，请查看我们关于持续性错误的下一步操作部分。







### InternalServerError


一个 `InternalServerError` 表示我们这边在处理你的请求时出现了问题。这可能是由于临时错误、缺陷或系统故障导致的。

我们对由此带来的不便表示歉意，并正在努力尽快解决所有问题。你可以 [查看我们的系统状态页面](https://status.openai.com/) 以获取更多信息。

如果你遇到 `InternalServerError`，请尝试以下步骤：

- 稍等几秒后重试你的请求。有时问题会很快解决，第二次重试时请求就能成功。
- 查看我们的状态页面，确认是否有正在发生的故障或维护可能影响到服务。如果有正在处理的故障，请关注更新，并等待其解决后再重试你的请求。
- 如果问题仍然存在，请参阅我们“持续性错误的后续步骤”部分。

我们的支持团队将调查该问题并尽快与你联系。请注意，由于需求量大，我们的支持队列可能需要较长的时间。你也可以 [在我们的社区论坛中发帖](https://community.openai.com) 但请务必省略任何敏感信息。







### RateLimitError


一个 `RateLimitError` 表示你已达到分配给你的速率限制。这意味着你在给定时间段内发送了过多令牌或请求，我们的服务已暂时阻止你继续发送。

我们施加速率限制是为了确保资源得到公平高效的使用，并防止我们的服务被滥用或过载。

如果遇到 `RateLimitError`，请尝试以下步骤：

- 减少发送的令牌或请求数量，或降低请求速度。你可能需要降低请求的频率或数量，对令牌进行批处理，或在重试时使用指数退避。 `Retry-After` 字段不存在。你可以参阅我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits) 了解更多详情。
- 当 `Retry-After` 字段存在时，至少等待其指定的时长后再重试。当服务端延迟超出 Python 库支持的上限时，它会停止自动重试。如果你在应用层进行重试，请遵守原始延迟，并考虑 SDK 已进行的重试次数。
- 你也可以在账户仪表板中查看 API 的使用统计信息。





### 持续性错误

如果问题仍然存在， [通过聊天联系我们的支持团队](https://help.openai.com/en/) 并向他们提供以下信息：

- 你正在使用的模型
- 你收到的错误消息和错误码
- 你发送的请求数据和请求头
- 你的请求的时间戳和时区
- 任何其他可能帮助我们诊断问题的相关信息

我们的支持团队将调查该问题并尽快与你联系。请注意，由于需求量大，我们的支持队列可能需要较长的时间。你也可以 [在我们的社区论坛中发帖](https://community.openai.com) 但请务必省略任何敏感信息。

### 处理错误

我们建议你通过编程方式处理 API 返回的错误。为此，你可以参考如下代码片段：

```javascript
import OpenAI from "openai";

const client = new OpenAI();

try {
  const response = await client.responses.create({
    model: "gpt-6-astra",
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
    response = client.responses.create(model="gpt-6-astra", input="Hello world")
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
		Model: "gpt-6-astra",
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
              ResponseCreateParams.builder().model("gpt-6-astra").input("Say hello.").build());

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
  response = client.responses.create(model: "gpt-6-astra", input: "Say hello.")
  puts(response.output_text)
rescue OpenAI::Errors::APIError => error
  warn(error.message)
end
```