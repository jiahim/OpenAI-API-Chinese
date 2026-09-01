# 错误代码

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取该页面的 Markdown 版本。

本指南概述了你可能会遇到的错误代码，这些错误代码来自 [API](https://developers.openai.com/api/docs/concepts) 以及我们的 [官方 Python 库](https://developers.openai.com/api/docs/libraries#install-an-official-sdk)。概览中提到的每个错误代码都有专门的章节提供进一步的指导。

## API 错误

| 代码                                                             | 概述                                                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400 - 无效 `service_tier` 参数                            | **原因：** 所请求或解析的服务等级不允许用于该项目。 <br /> **解决方案：** 将 `service_tier` 设置为该项目允许的等级，或更新 [项目设置](https://platform.openai.com/settings/).                                    |
| 401 - 身份验证无效                                     | **原因：** 身份验证无效 <br /> **解决方案：** 确保使用了正确的 [API 密钥](https://platform.openai.com/settings/organization/api-keys) 以及对应的请求组织。                                                                                                       |
| 401 - 提供的 API 密钥不正确                                 | **原因：** 所使用的请求 API 密钥不正确。 <br /> **解决方案：** 确认使用的 API 密钥正确，清除浏览器缓存，或 [生成新密钥](https://platform.openai.com/settings/organization/api-keys).                                                                         |
| 401 - 你必须是某个组织的成员才能使用 API     | **原因：** 你的账号未隶属于任何组织。 <br /> **解决方案：** 联系我们以加入新组织，或请你的组织管理员 [邀请你加入组织](https://platform.openai.com/settings/organization/people).                                         |
| 401 - IP 未获授权                                          | **原因：** 你请求的 IP 与你的项目或组织配置的 IP 白名单不匹配。 <br /> **解决方案：** 从正确的 IP 发送请求，或更新你的 [IP 白名单设置](https://platform.openai.com/settings/organization/security/ip-allowlist).               |
| 403 - 国家、地区或区域不受支持                | **原因：** 你正在从不受支持的国家、地区或区域访问 API。 <br /> **解决方案：** 请参阅 [此页面](https://developers.openai.com/api/docs/supported-countries) 了解详细信息。                                                                                                          |
| 429 - 信用余额已用完                                   | **代码：** `credit_balance_exhausted` <br /> **原因：** 你的组织没有剩余的预付信用额度。 <br /> **解决方案：** [充值信用额度](https://platform.openai.com/settings/organization/billing) 以继续使用 API。                                                               |
| 429 - 请求已达到速率限制                            | **原因：** 你发送请求的速度过快。 <br /> **解决方案：** 请放慢请求速度，并遵循 `Retry-After` header 中获取该值（如果存在）。请参阅 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).                                                                                        |
| 429 - 已达到组织支出限额                           | **代码：** `organization_spend_limit_exceeded` <br /> **原因：** 你的组织已达到其强制支出限额。 <br /> **解决方案：** 调高或移除你的 [组织支出限额](https://platform.openai.com/settings/organization/limits).                                            |
| 429 - 已达到项目支出限额                                | **代码：** `project_spend_limit_exceeded` <br /> **原因：** 你的项目已达到其强制支出限额。 <br /> **解决方案：** 调高或移除你的 [项目设置](https://platform.openai.com/settings/).                                                              |
| 429 - 已达到组织用量限额                           | **代码：** `organization_usage_limit_exceeded` <br /> **原因：** 你的组织已达到 OpenAI 分配的用量限额。 <br /> **解决方案：** 申请更高的 [已批准用量限额](https://platform.openai.com/settings/organization/limits) 或 [联系支持团队](https://help.openai.com/). |
| 500 - 服务端在处理你的请求时发生错误      | **原因：** 我们的服务端出现问题。 <br /> **解决方案：** 请稍后重试，如果问题仍然存在，请联系我们。请查看 [状态页面](https://status.openai.com/).                                                                                                            |
| 503 - 引擎当前过载，请稍后重试 | **原因：** 我们的服务器正经历高流量。 <br /> **解决方案：** 请稍候片刻后重试你的请求。                                                                                                                                                                         |
| 503 - 请求过快                                                  | **原因：** 你的请求速率突然增加，正在影响服务可靠性。 <br /> **解决方案：** 请将请求速率降低至原有水平，保持稳定至少 15 分钟，然后再逐步提升。                                               |

对于与计费有关的错误，请检查 `error.code` 以确定具体原因。更广泛的 `error.type` 仍然可以 `insufficient_quota`.

重试计费、支出或配额错误不会恢复 API 访问权限。请先更新相关额度或限额，然后再发送另一个请求。

## WebSocket mode errors

如果你正在使用 [the Responses API WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode),你可能会遇到以下这些额外的错误：

- `previous_response_not_found`： `previous_response_id` 无法从当前状态解析。请使用完整的输入上下文重试，并 `previous_response_id` 设置为 `null`.
- `websocket_connection_limit_reached`：连接已达到 60 分钟的上限。请打开新的 WebSocket 连接并继续。



### 400 - Invalid service_tier argument


当请求选择或解析到项目中不允许的 API 服务层级时，接口 会返回消息 "Invalid service_tier argument: The requested service tier is not allowed for this project."。 `invalid_request_error` ，且 `error.param` 设置为 `service_tier` 时，会触发该错误。

项目限制适用于 `default`, `flex`，以及 `priority` 服务层级。 `fast` 服务层级会被评估为 `priority`。如果请求省略 `service_tier` 或将其设置为 `auto` ，但最终解析到了不允许的层级，也可能会返回此错误。Scale Tier 不受此项目策略影响。

解决此错误的方法：

- 请在 [项目设置](https://platform.openai.com/settings/).
- 中 `service_tier` 查看允许的服务层级，并将。
- 设置为项目允许的 `auto` 层级。如果请求使用 `service_tier`，或省略了该字段，请更新项目设置，使解析得到的层级在允许范围内。







### 401 - Invalid Authentication


此错误消息表明你的身份验证凭据无效。出现这种情况可能有多种原因，例如：

- 你正在使用已撤销的 API 密钥。
- 你正在使用的 API 密钥与请求组织或项目所分配的密钥不同。
- 你正在使用一个 API 密钥，该密钥不具有你所调用端点所需的权限。

若要解决此错误，请按照以下步骤操作：

- 请确认你在请求头中使用的 API 密钥和组织 ID 正确无误。你可以在 [你的账户设置](https://platform.openai.com/settings/organization/api-keys) 中找到你的 API 密钥和组织 ID，或在 [通用设置](https://platform.openai.com/settings/organization/general) 中选择所需项目后找到对应项目的密钥。
- 如果不确定你的 API 密钥是否有效，可以 [生成一个新的](https://platform.openai.com/settings/organization/api-keys). 确保在请求中使用新的 API 密钥替换旧密钥,并遵循我们的 [最佳实践指南](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).







### 401 - 提供的 API 密钥不正确


此错误信息表明你在请求中使用的 API 密钥不正确。出现这种情况可能有多种原因，例如：

- 你的 API 密钥中存在拼写错误或多余的空格。
- 你正在使用属于其他组织或项目的 API 密钥。
- 你正在使用已被删除或停用的 API 密钥。
- 旧的、已撤销的 API 密钥可能在本地被缓存。

若要解决此错误，请按照以下步骤操作：

- 尝试清除浏览器的缓存和 Cookie，然后重试。
- 检查你在请求头中使用的 API 密钥是否正确。
- 如果你不确定自己的 API 密钥是否正确，可以 [生成一个新的](https://platform.openai.com/settings/organization/api-keys)。请确保在代码库中替换旧的 API 密钥，并按照我们的 [最佳实践指南](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).







### 401 - 你必须是组织的成员才能使用 API


该错误消息表明你的账户不属于任何组织。这可能由多种原因导致，例如：

- 你已离开或被移出之前的组织。
- 你已离开或被移出之前的项目。
- 你的组织已被删除。

若要解决此错误，请按照以下步骤操作：

- 如果你已离开或被移出之前的组织，可以申请新建一个组织，或接受现有组织的邀请。
- 如需申请新建组织，请通过 help.openai.com 与我们联系。
- 现有组织所有者可以通过 [Team 页面](https://platform.openai.com/settings/organization/people) 邀请你加入他们的组织,也可以从 [Settings 页面](https://platform.openai.com/settings/organization/general).
- 如果你已离开或被移出之前的项目，可以请组织或项目所有者重新添加你，或创建一个新项目。







### 429 - 信用额度已用尽


该 `credit_balance_exhausted` 错误表明你的组织的预付信用额度已用完。

若要恢复 API 访问权限， [在你的账单设置中添加额度](https://platform.openai.com/settings/organization/billing).







### 429 - 请求已达到速率限制


此错误消息表明你已达到 API 的分配速率限制。这意味着你在短时间内提交了过多 token 或请求，已超过允许的请求数。出现这种情况可能有多种原因，例如：

- 你在使用循环或脚本发起频繁或并发的请求。
- 你正在与其他用户或应用共享你的 API 密钥。
- 你正在使用限速较低地免费套餐。
- 你已达到所在项目所设定的上限

若要解决此错误，请按照以下步骤操作：

- 请控制请求节奏，避免进行不必要或重复的调用。
- 如果响应中携带 `Retry-After` 头，请至少等待该头指定的时间后再重试；如果没有该头，请使用带抖动的指数退避策略并限制重试次数。每个官方 SDK 都会在符合条件时遵循该头。详情请参阅我们的 [限速指南](https://developers.openai.com/api/docs/guides/rate-limits).
- 如果你所在组织与他人共享，请注意限额是按组织而非按用户施加的。建议了解团队其他成员的使用情况，因为这也会计入限额。
- 如果你正在使用免费或低阶套餐，建议升级到限速更高的按量付费套餐。你可以在我们的 [限速指南](https://developers.openai.com/api/docs/guides/rate-limits).
- 联系你的组织所有者以提高所在项目的限速







### 429 - 已达到组织消费上限


该 `organization_spend_limit_exceeded` 错误表示你的组织已达到强制的每月 [支出上限](https://developers.openai.com/api/docs/guides/spend-limits)。该上限适用于组织内所有项目的API流量。

要恢复 API 访问权限，请在你的 [组织限额设置](https://platform.openai.com/settings/organization/limits)。中提高或移除该限制。否则，访问权限将在每月限额重置后恢复。







### 429 - 已达到项目支出上限


该 `project_spend_limit_exceeded` 错误表示你的项目已达到强制执行的每月 [支出上限](https://developers.openai.com/api/docs/guides/spend-limits)。其他项目可以继续运行，除非它们自身或组织层级也达到了相应上限。

要恢复 API 访问权限，请在你的 [项目设置](https://platform.openai.com/settings/)。中提高或移除该限制。否则，访问权限将在每月限额重置后恢复。







### 429 - 已达到组织使用上限


该 `organization_usage_limit_exceeded` 错误表示你的组织已达到 OpenAI 分配的每月 [用量上限](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers). 该限制与组织及项目层级的消费额度相互独立，由你自行配置。

若要恢复 API 的访问权限，请申请更高的 [已批准的使用上限](https://platform.openai.com/settings/organization/limits) 或 [联系支持团队](https://help.openai.com/).







### 503 - 引擎当前负载过高，请稍后重试


该错误信息表示我们的服务器当前流量较高，暂时无法处理你的请求。出现这种情况可能有多种原因，例如：

- 我们的服务出现了突然的需求激增或飙升。
- 我们的服务器正在执行计划内或计划外的维护或更新。
- 我们的服务器发生了意外或不可避免的停机或事故。

若要解决此错误，请按照以下步骤操作：

- 短暂等待后重试你的请求。我们建议使用指数退避策略，或遵循响应头和速率限制的合理重试逻辑。你可以在我们的速率限制 [最佳实践](https://help.openai.com/en/articles/6891753-rate-limit-advice).
- 查看我们的 [状态页面](https://status.openai.com/) ，了解有关我们服务和服务器的任何更新或公告。
- 如果在合理时间后你仍然遇到此错误，请联系我们以获取进一步帮助。对于由此带来的不便，我们深表歉意，并感谢你的耐心和理解。







### 503 - Slow Down


该错误可能在使用按量付费模型时发生，这些模型由所有 OpenAI 用户共享。这表示你的流量显著增加，导致模型过载，并触发了临时限流以维持服务稳定性。

若要解决此错误，请按照以下步骤操作：

- 将请求速率恢复到原有水平，稳定保持至少 15 分钟，然后逐步提升。
- 保持一致的流量模式，以尽可能降低被限流的可能性。如果你的请求量保持稳定，很少会遇到此错误。
- 考虑升级到 [Scale Tier](https://openai.com/api-scale-tier/) ，以获得有保障的容量和性能，从而在高需求时段获得更可靠的访问。





## Python 库错误类型

| 类型                     | 概述                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| APIConnectionError       | **原因：** 无法连接到我们的服务。 <br /> **解决方案：** 检查你的网络设置、代理配置、SSL 证书或防火墙规则。                                                                                                                                                                                                                                                                                 |
| APITimeoutError          | **原因：** 请求超时。 <br /> **解决方案：** 稍等片刻后重试你的请求，如果问题仍然存在，请联系我们。                                                                                                                                                                                                                                                                                                           |
| AuthenticationError      | **原因：** 你的 API key 或 token 无效、已过期或已被吊销。 <br /> **解决方案：** 检查你的 API key 或 token，确认其正确且处于启用状态。你可能需要在你的账户控制台中重新生成一个。                                                                                                                                                                                                              |
| BadRequestError          | **原因：** 你的请求格式有误或缺少某些必需参数，例如 token 或输入。 <br /> **解决方案：** 错误消息应当会就你所遇到的具体错误给出建议。请参阅你所调用的 [文档](https://developers.openai.com/api/reference/overview) 了解你正在调用的特定 API 方法，并确保你发送的参数有效且完整。你可能还需要检查请求数据的编码、格式或大小。 |
| ConflictError            | **原因：** 该资源已被其他请求更新。 <br /> **解决方案：** 尝试再次更新该资源，并确保没有其他请求在尝试更新它。                                                                                                                                                                                                                                                                      |
| InternalServerError      | **原因：** 我们这边出现了问题。 <br /> **解决方案：** 稍等片刻后重试你的请求，如果问题仍然存在，请联系我们。                                                                                                                                                                                                                                                                                                           |
| NotFoundError            | **原因：** 请求的资源不存在。 <br /> **解决方案：** 请确认你使用的是正确的资源标识符。                                                                                                                                                                                                                                                                                                                       |
| PermissionDeniedError    | **原因：** 你没有访问所请求资源的权限。 <br /> **解决方案：** 请确认你使用的是正确的 API key、组织 ID 和资源 ID。                                                                                                                                                                                                                                                                             |
| RateLimitError           | **原因：** 你已触及分配的速率上限。 <br /> **解决方案：** 请合理控制请求节奏，并遵循 `Retry-After` 标头（出现的话）。每个官方 SDK 已对符合条件的重试遵守该标头。更多信息请参阅我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).                                                                                                                                                              |
| UnprocessableEntityError | **原因：** 请求格式正确，但无法处理该请求。 <br /> **解决方案：** 请重试该请求。                                                                                                                                                                                                                                                                                                            |



### APIConnectionError


一个 `APIConnectionError` 表示你的请求无法到达我们的服务器或未能建立安全连接。这可能是由网络问题、代理配置、SSL 证书或防火墙规则引起的。

如果遇到 `APIConnectionError`，请尝试以下步骤：

- 检查你的网络设置，确保拥有稳定且快速的互联网连接。你可能需要切换到其他网络、使用有线连接，或减少占用带宽的设备或应用程序数量。
- 检查你的代理配置，确保其与我们的服务兼容。你可能需要更新代理设置、使用其他代理，或完全绕过代理。
- 检查你的 SSL 证书，确保它们有效且为最新版本。你可能需要安装或续期证书、更换证书颁发机构，或禁用 SSL 验证。
- 检查你的防火墙规则，确保它们没有阻止或过滤我们的服务。你可能需要修改防火墙设置。
- 在适用的情况下，检查你的容器是否具有发送和接收流量的正确权限。
- 如果问题仍然存在，请参阅我们针对持续性错误的后续步骤部分。







### APITimeoutError


一个 `APITimeoutError` 错误表示你的请求耗时过长，我们的服务端关闭了连接。这可能是由于网络问题、我们的服务负载过高，或者请求较为复杂需要更多处理时间。

如果遇到此错误 `APITimeoutError` 错误，请尝试以下步骤：

- 稍等几秒后重试请求。有时网络拥塞或服务负载会下降，第二次尝试时请求可能会成功。
- 检查你的网络设置，确保拥有稳定且快速的互联网连接。你可能需要切换到其他网络、使用有线连接，或减少占用带宽的设备或应用程序数量。
- 如果问题仍然存在，请参阅我们针对持续性错误的后续步骤部分。







### AuthenticationError


一个 `AuthenticationError` 表示你的 API 密钥或令牌无效、已过期或已被吊销。这可能是由于拼写错误、格式问题或安全漏洞所致。

如果遇到 `AuthenticationError`，请尝试以下步骤：

- 检查你的 API 密钥或令牌，确认其正确且处于启用状态。你可能需要在 API 密钥控制台重新生成一个密钥，确保没有多余的空格或字符，或者如果有多个密钥或令牌，则换用其他可用的密钥或令牌。
- 确保遵循了正确的格式。







### BadRequestError



一个 `BadRequestError` (formerly `InvalidRequestError`) 表示你的请求格式有误或缺少某些必填参数，例如 token 或输入。这可能是由于代码中存在拼写错误、格式错误或逻辑错误所致。

如果遇到 `BadRequestError`，请尝试以下步骤：

- 仔细阅读错误消息并确定具体的错误。错误消息应提示你哪个参数无效或缺失，以及期望的值或格式是什么。
- 查阅相关 [API 参考](https://developers.openai.com/api/reference/overview) ，确认你正在调用的具体 API 方法，并确保你发送的参数有效且完整。你可能需要核对参数名称、类型、值和格式，并确保它们与文档一致。
- 检查请求数据的编码、格式或大小，并确保它们与我们的服务兼容。你可能需要将数据编码为 UTF-8，将数据格式化为 JSON，或者在数据过大时进行压缩。
- 使用 Postman 或 curl 等工具测试你的请求，并确保它按预期工作。你可能需要调试你的代码，并修复请求逻辑中的任何错误或不一致之处。
- 如果问题仍然存在，请参阅我们针对持续性错误的后续步骤部分。







### InternalServerError


一个 `InternalServerError` 表示在处理你的请求时，我们这边出现了问题。这可能是由于临时错误、缺陷或系统故障导致的。

对于由此带来的不便，我们深表歉意，并会尽快解决相关问题。你可以 [查看我们的系统状态页面](https://status.openai.com/) 以获取更多信息。

如果遇到 `InternalServerError`，请尝试以下步骤：

- 等待几秒后重试你的请求。有时问题会很快自行消除，第二次请求就可能成功。
- 查看我们的状态页面，了解是否有正在发生的事件或维护可能影响我们的服务。如果有正在处理的事件，请关注最新进展，并等到事件解决后再重试你的请求。
- 如果问题仍然存在，请参阅我们的“持续性错误后续步骤”部分。

我们的支持团队将调查该问题并尽快回复你。由于需求量大，我们的支持队列等待时间可能较长。你也可以 [在我们的社区论坛中发帖](https://community.openai.com) ，但请务必省略任何敏感信息。







### RateLimitError


一个 `RateLimitError` 表示你已达到分配到的速率上限。这说明你在给定时间段内发送了过多 token 或请求，我们的服务已暂时阻止你继续发送。

我们设置速率上限是为了确保资源使用的公平与高效，并防止服务被滥用或过载。

如果遇到此错误 `RateLimitError`，请尝试以下步骤：

- 减少发送的令牌或请求，或降低请求速度。你可能需要降低请求的频率或数量，对令牌进行批处理，或在重试时使用指数退避，当 `Retry-After` 不存在时。你可以阅读我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits) 了解更多信息。
- 当 `Retry-After` 存在时，请在重试前至少等待其指定的时间。官方 Python 库已经对符合条件的重试遵守了该响应头。
- 你也可以在账户仪表板中查看 API 使用情况统计。





### 持久性错误

如果问题仍然存在， [通过聊天联系我们的支持团队](https://help.openai.com/en/) 并向他们提供以下信息：

- 你正在使用的模型
- 你收到的错误信息和错误代码
- 你发送的请求数据和请求头
- 你请求的时间戳和时区
- 任何其他可能有助于我们诊断问题的相关细节

我们的支持团队将调查该问题并尽快回复你。由于需求量大，我们的支持队列等待时间可能较长。你也可以 [在我们的社区论坛中发帖](https://community.openai.com) ，但请务必省略任何敏感信息。

### 处理错误

建议你通过编程方式处理 API 返回的错误。为此，你可以参考如下代码片段：

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