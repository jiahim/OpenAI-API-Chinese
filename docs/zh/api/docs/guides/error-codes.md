# 错误代码

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

本指南概述了您可能从 [API](https://developers.openai.com/api/docs/concepts) 以及我们的 [官方 Python 库](https://developers.openai.com/api/docs/libraries#install-an-official-sdk)。中看到的错误代码。概述中提到的每个错误代码都有专门章节提供进一步指导。

## API 错误

| 代码                                                             | 概述                                                                                                                                                                                                                                                                                          |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 401 - 无效认证                                     | **原因：** 无效认证 <br /> **解决方案：** 确保使用正确的 [API 密钥](https://platform.openai.com/settings/organization/api-keys) 以及所请求的组织。                                                                                                       |
| 401 - 提供的 API 密钥不正确                                 | **原因：** 请求所使用的 API 密钥不正确。 <br /> **解决方案：** 确保使用的 API 密钥正确，清除浏览器缓存，或 [生成一个新密钥](https://platform.openai.com/settings/organization/api-keys).                                                                         |
| 401 - 你必须是组织的成员才能使用 API     | **原因：** 你的账户不属于任何组织。 <br /> **解决方案：** 联系我们以加入新组织，或请你的组织管理员 [邀请你加入一个组织](https://platform.openai.com/settings/organization/people).                                         |
| 401 - 未经授权的 IP                                          | **原因：** 你的请求 IP 与为你的项目或组织配置的 IP 允许列表不匹配。 <br /> **解决方案：** 从正确的 IP 发送请求，或更新你的 [IP 允许列表设置](https://platform.openai.com/settings/organization/security/ip-allowlist).               |
| 403 - 不支持的国家、地区或领土                | **原因：** 你从不支持的国家、地区或领土访问 API。 <br /> **解决方案：** 请参阅 [此页面](https://developers.openai.com/api/docs/supported-countries) 了解更多信息。                                                                                                          |
| 429 - 信用余额已用完                                   | **代码：** `credit_balance_exhausted` <br /> **原因：** 你的组织没有剩余的预付费信用。 <br /> **解决方案：** [添加信用](https://platform.openai.com/settings/organization/billing) 以继续使用 API。                                                               |
| 429 - 请求速率限制已达到                            | **原因：** 你发送请求的速度太快。 <br /> **解决方案：** 调整你的请求节奏，并遵循 `Retry-After` （当存在时）。阅读 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).                                                                                        |
| 429 - 组织消费限额已达到                           | **代码：** `organization_spend_limit_exceeded` <br /> **原因：** 你的组织已达到强制消费限额。 <br /> **解决方案：** 提高或移除你的 [组织消费限额](https://platform.openai.com/settings/organization/limits).                                            |
| 429 - 项目消费限额已达到                                | **代码：** `project_spend_limit_exceeded` <br /> **原因：** 你的项目已达到强制消费限额。 <br /> **解决方案：** 在您的 [项目设置](https://platform.openai.com/settings/).                                                              |
| 429 - 已达到组织用量限制                           | **代码：** `organization_usage_limit_exceeded` <br /> **原因：** 您的组织已达到 OpenAI 分配的用量限制。 <br /> **解决方案：** 申请更高的 [批准的用量限制](https://platform.openai.com/settings/organization/limits) 或 [联系支持](https://help.openai.com/). |
| 500 - 服务器在处理您的请求时出错      | **原因：** 我们的服务器出现问题。 <br /> **解决方案：** 稍等片刻后重试您的请求，如果问题仍然存在，请联系我们。请查看 [状态页面](https://status.openai.com/).                                                                                                            |
| 503 - 引擎当前过载，请稍后重试 | **原因：** 我们的服务器正经历高流量。 <br /> **解决方案：** 请稍等片刻后重试您的请求。                                                                                                                                                                         |
| 503 - 慢速限制                                                  | **原因：** 您的请求速率突然增加，影响了服务可靠性。 <br /> **解决方案：** 请将您的请求速率降低到原始水平，保持一致的速率至少 15 分钟，然后逐步增加。                                               |

对于计费相关的错误，检查 `error.code` 以确定具体原因。更广泛的 `error.type` 仍然可以 `insufficient_quota`.

重试计费、支出或配额错误不会恢复 API 访问。在发送另一个请求之前，请更新相关的额度或限制。

## WebSocket 模式错误

如果你正在使用 [Responses API WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode)，你可能会看到以下附加错误：

- `previous_response_not_found`：该 `previous_response_id` 无法从可用状态解析。请使用完整输入上下文重试，并将 `previous_response_id` 设为 `null`.
- `websocket_connection_limit_reached`：连接达到 60 分钟限制。请打开新的 WebSocket 连接并继续。

401 - 无效的身份验证

此错误消息表示你的身份验证凭据无效。这可能由多种原因导致，例如：

- 你正在使用一个已被吊销的 API 密钥。
- 你正在使用的 API 密钥与分配给请求组织或项目的密钥不同。
- 你正在使用的 API 密钥没有调用该端点所需的权限。

要解决这个错误，请按照以下步骤操作：

- 检查你是否在请求头中使用了正确的API密钥和组织 ID。你可以在 [账户设置](https://platform.openai.com/settings/organization/api-keys) 中找到你的API密钥和组织 ID，或者你也可以在 [常规设置](https://platform.openai.com/settings/organization/general) 下找到特定项目相关的密钥，通过选择所需项目即可。
- 如果你不确定你的API密钥是否有效，你可以 [生成一个新密钥](https://platform.openai.com/settings/organization/api-keys)。确保在请求中将旧API密钥替换为新密钥，并遵循我们的 [最佳实践指南](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).

401 - 提供的 API 密钥不正确

此错误消息表示你的请求中使用的 API 密钥不正确。这可能是由多种原因导致的，例如：

- 你的 API 密钥中存在拼写错误或多余空格。
- 你使用的 API 密钥属于其他组织或项目。
- 你使用的 API 密钥已被删除或停用。
- 本地可能缓存了已撤销的旧 API 密钥。

要解决此错误，请按照以下步骤操作：

- 尝试清除浏览器的缓存和 Cookie，然后重试。
- 检查请求头中使用的 API 密钥是否正确。
- 如果不确定 API 密钥是否正确，你可以 [生成一个新密钥](https://platform.openai.com/settings/organization/api-keys)。请确保替换代码库中的旧 API 密钥，并遵循我们的 [最佳实践指南](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).

401 - 你必须是某个组织的成员才能使用API

此错误消息表示你的账户不属于任何组织。这种情况可能由多种原因导致，例如：

- 你已离开或已被移出之前的组织。
- 你已离开或已被移出之前的项目。
- 你的组织已被删除。

要解决此错误，请按照以下步骤操作：

- 如果你已离开或被移出之前的组织，你可以申请创建新组织，或被邀请加入现有组织。
- 如需申请新组织，请通过 help.openai.com 联系我们
- 现有组织所有者可通过 [团队页面](https://platform.openai.com/settings/organization/people) 邀请你加入其组织，或通过 [设置页面](https://platform.openai.com/settings/organization/general).
- 如果你已离开或被移出之前的项目，你可以请求组织或项目所有者将你添加回去，或创建新项目。

429 - 积分余额已用尽

该 `credit_balance_exhausted` 该错误表示你所在组织的预付费积分余额已用尽。

要恢复 API 访问， [请在账单设置中添加积分](https://platform.openai.com/settings/organization/billing).

429 - 请求已达到速率限制

此错误消息表示你已达到 API 的指定速率限制。这意味着你在短时间内提交了过多的令牌或请求，超出了允许的请求数量。这可能是由多种原因造成的，例如：

- 你正在使用循环或脚本发起频繁或并发请求。
- 你正在与其他用户或应用程序共享你的API密钥。
- 你正在使用速率限制较低的免费套餐。
- 你已达到了项目上定义的限制

要解决此错误，请按照以下步骤操作：

- 控制请求频率，避免发出不必要或重复的调用。
- 如果 `Retry-After` 标头存在，请至少等待其指定的时长后再重试。如果缺失，请使用带抖动的指数退避，并限制重试次数。每个官方 SDK 在符合条件的重试中已遵循此标头。更多信息请参阅我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).
- 如果你与组织中的其他用户共享资源，请注意限制是按组织而非按用户应用的。建议检查团队其他成员的使用情况，因为这会共同计入限制。
- 如果你使用免费或低层级套餐，请考虑升级到提供更高速率限制的按量付费套餐。你可以在我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).
- 联系你的组织所有者，以提升项目的速率限制。

429 - 已达到组织支出限额

该 `organization_spend_limit_exceeded` 错误表示你的组织已达到强制执行的月度 [支出限额](https://developers.openai.com/api/docs/guides/spend-limits)。该限额适用于组织中所有项目的 API 流量。

要恢复 API 访问权限，请在 [组织限额设置](https://platform.openai.com/settings/organization/limits)。中增加或移除限制。否则，访问将在月度限额重置后恢复。

429 - 已达到项目支出限额

该 `project_spend_limit_exceeded` 错误表示你的项目已达到强制执行的月度 [支出限额](https://developers.openai.com/api/docs/guides/spend-limits)。其他项目可以继续运行，除非它们自己的限额或组织限额也已达到。

要恢复 API 访问权限，请在 [项目设置](https://platform.openai.com/settings/)。中增加或移除限制。否则，访问将在月度限额重置后恢复。

429 - 已达到组织用量限额

该 `organization_usage_limit_exceeded` 错误表示你的组织已达到 OpenAI 分配的月度 [用量限额](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers)。此限制与你配置的组织和项目支出限额是分开的。

要恢复API访问权限，请申请更高的 [已批准的使用限额](https://platform.openai.com/settings/organization/limits) 或 [联系支持](https://help.openai.com/).

503 - 引擎当前过载，请稍后重试

此错误消息表明我们的服务器正经历高流量，暂时无法处理你的请求。这可能是由多种原因导致的，例如：

- 我们的服务需求突然激增或飙升。
- 我们的服务器进行计划内或计划外维护或更新。
- 我们的服务器发生意外或不可避免的中断或事件。

要解决此错误，请按照以下步骤操作：

- 稍等片刻后重试你的请求。我们建议使用指数退避策略，或采用尊重响应头和速率限制的重试逻辑。你可以阅读更多关于我们速率限制的 [最佳实践](https://help.openai.com/en/articles/6891753-rate-limit-advice).
- 请查看我们的 [状态页面](https://status.openai.com/) ，以获取有关我们服务和服务器的最新动态或公告。
- 如果在合理时间后你仍然遇到此错误，请联系我们寻求进一步帮助。对于由此带来的不便，我们深表歉意，并感谢你的耐心和理解。

503 - 操作过慢

此错误可能出现在按量付费模型中，这些模型由所有OpenAI用户共享。它表示你的流量显著增加，使模型过载并触发临时限流以维持服务稳定性。

要解决此错误，请按照以下步骤操作：

- 将请求速率降低到原始水平，保持稳定至少15分钟，然后逐步提升。
- 保持稳定的流量模式，以最大程度减少触发限流的可能性。如果请求量保持稳定，你通常不会遇到此错误。
- 考虑升级到 [Scale Tier](https://openai.com/api-scale-tier/) 以获得有保障的容量和性能，确保在高峰需求期间更可靠的访问。

## Python 库错误类型

| 类型                     | 概述                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| APIConnectionError       | **原因：** 连接我们的服务时出现问题。 <br /> **解决方案：** 检查你的网络设置、代理配置、SSL 证书或防火墙规则。                                                                                                                                                                                                                                                                                 |
| APITimeoutError          | **原因：** 请求超时。 <br /> **解决方案：** 稍等片刻后重试你的请求，如果问题仍然存在，请联系我们。                                                                                                                                                                                                                                                                                                           |
| AuthenticationError      | **原因：** 你的 API 密钥或令牌无效、已过期或已被吊销。 <br /> **解决方案：** 检查你的 API 密钥或令牌，确保其正确且处于激活状态。你可能需要从账户仪表板生成一个新的。                                                                                                                                                                                                              |
| BadRequestError          | **原因：** 你的请求格式错误或缺少某些必需参数，例如令牌或输入。 <br /> **解决方案：** 错误消息应指出你犯的具体错误。请检查 [文档](https://developers.openai.com/api/reference/overview) ，了解你所调用的 API 方法，并确保你发送了有效且完整的参数。你可能还需要检查请求数据的编码、格式或大小。 |
| ConflictError            | **原因：** 资源已被另一个请求更新。 <br /> **解决方案：** 尝试再次更新资源，并确保没有其他请求正在尝试更新它。                                                                                                                                                                                                                                                                      |
| InternalServerError      | **原因：** 我们这边的问题。 <br /> **解决方案：** 稍等片刻后重试你的请求，如果问题仍然存在，请联系我们。                                                                                                                                                                                                                                                                                                           |
| NotFoundError            | **原因：** 请求的资源不存在。 <br /> **解决方案：** 确保你使用了正确的资源标识符。                                                                                                                                                                                                                                                                                                                       |
| PermissionDeniedError    | **原因：** 你没有访问所请求资源的权限。 <br /> **解决方案：** 确保你使用的是正确的 API 密钥、组织 ID 和资源 ID。                                                                                                                                                                                                                                                                             |
| RateLimitError           | **原因：** 你已达到分配给你的速率限制。 <br /> **解决方案：** 调整请求节奏并遵循 `Retry-After` 当存在该头部时。每个官方 SDK 已在符合条件的重试中遵循此头部。更多信息请参阅我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits).                                                                                                                                                              |
| UnprocessableEntityError | **原因：** 请求格式正确，但无法处理。 <br /> **解决方案：** 请重试该请求。                                                                                                                                                                                                                                                                                                            |

APIConnectionError

一个 `APIConnectionError` 表示你的请求无法到达我们的服务器或建立安全连接。这可能是由于网络问题、代理配置、SSL 证书或防火墙规则导致的。

如果你遇到 `APIConnectionError`，请尝试以下步骤：

- 检查你的网络设置，确保网络连接稳定且快速。你可能需要切换到其他网络、使用有线连接，或减少占用带宽的设备或应用数量。
- 检查你的代理配置，确保其与我们的服务兼容。你可能需要更新代理设置、使用不同的代理，或完全绕过代理。
- 检查你的 SSL 证书，确保其有效且未过期。你可能需要安装或续期证书、使用不同的证书颁发机构，或禁用 SSL 验证。
- 检查你的防火墙规则，确保它们没有阻止或过滤我们的服务。你可能需要修改防火墙设置。
- 如适用，请检查你的容器是否具有发送和接收流量的正确权限。
- 如果问题仍然存在，请参阅我们关于持久错误的后续步骤部分。

APITimeoutError

一个 `APITimeoutError` 该错误表示你的请求耗时过长，我们的服务器已关闭连接。这可能是由于网络问题、我们的服务负载过重，或是需要更多处理时间的复杂请求所致。

如果你遇到 `APITimeoutError` 错误，请尝试以下步骤：

- 等待几秒后重试你的请求。有时，网络拥塞或我们服务的负载可能会降低，第二次尝试时你的请求可能会成功。
- 检查你的网络设置，确保你拥有稳定且快速的互联网连接。你可能需要切换到不同的网络、使用有线连接，或减少使用带宽的设备或应用程序数量。
- 如果问题仍然存在，请查看我们的持久性错误后续步骤部分。

AuthenticationError

一个 `AuthenticationError` 表示你的 API 密钥或令牌无效、已过期或被吊销。这可能是由于拼写错误、格式错误或安全漏洞导致的。

如果你遇到 `AuthenticationError`，请尝试以下步骤：

- 检查你的 API 密钥或令牌，确保其正确且处于活动状态。你可能需要从 API 密钥仪表板生成新密钥，确保没有多余空格或字符，或者如果有多个密钥，使用其他密钥或令牌。
- 确保你遵循了正确的格式。

BadRequestError

一个 `BadRequestError` （原名 `InvalidRequestError`）表示你的请求格式错误或缺少某些必需参数，如令牌或输入。这可能是由于代码中的拼写错误、格式错误或逻辑错误导致的。

如果遇到 `BadRequestError`，请尝试以下步骤：

- 仔细阅读错误信息，找出具体错误。错误信息会提示哪个参数无效或缺失，以及期望的值或格式。
- 查阅 [API 参考](https://developers.openai.com/api/reference/overview) 中你调用的具体 API 方法，确保发送了有效且完整的参数。你可能需要检查参数名称、类型、值和格式，确保与文档一致。
- 检查请求数据的编码、格式或大小，确保与我们的服务兼容。你可能需要将数据编码为 UTF-8，将数据格式化为 JSON，或在数据过大时进行压缩。
- 使用 Postman 或 curl 等工具测试请求，确保其按预期工作。你可能需要调试代码，修复请求逻辑中的任何错误或不一致之处。
- 如果问题仍然存在，请查看我们的持久错误下一步骤部分。

InternalServerError

一个 `InternalServerError` 表示在处理你的请求时，我们这边出现了问题。这可能是由临时错误、故障或系统中断引起的。

对于由此带来的不便，我们深表歉意，并正在努力尽快解决任何问题。你可以 [查看我们的系统状态页面](https://status.openai.com/) 以获取更多信息。

如果你遇到 `InternalServerError`，请尝试以下步骤：

- 等待几秒钟后重试你的请求。有时，问题可能会快速解决，你的请求在第二次尝试时可能就会成功。
- 查看我们的状态页面，了解可能影响我们服务的任何正在发生的事故或维护。如果存在活动事故，请关注更新并等待其解决后再重试你的请求。
- 如果问题仍然存在，请查看我们的“持久错误后续步骤”部分。

我们的支持团队将调查该问题，并尽快回复你。请注意，由于需求量大，我们的支持队列等待时间可能较长。你也可以 [在我们的社区论坛发帖](https://community.openai.com) 但务必省略任何敏感信息。

RateLimitError

一个 `RateLimitError` 表示你已触达分配的速率限制。这意味着你在给定时间内发送了过多的令牌或请求，我们的服务已暂时阻止你继续发送。

我们实施速率限制是为了确保资源的公平高效利用，并防止滥用或服务过载。

如果你遇到 `RateLimitError`，请尝试以下步骤：

- 发送更少的令牌或请求，或放慢速度。你可能需要降低请求的频率或数量，对令牌进行批量处理，或在重试时使用指数退避策略，前提是 `Retry-After` 不存在。你可以阅读我们的 [速率限制指南](https://developers.openai.com/api/docs/guides/rate-limits) 了解更多详情。
- 当 `Retry-After` 存在时，至少等待其指定的时间后再重试。官方的 Python 库在符合条件的重试中已经遵循此响应头。
- 你还可以从账户仪表板查看你的API使用统计信息。

### 持久错误

如果问题仍然存在， [请通过聊天联系我们的支持团队](https://help.openai.com/en/) 并提供以下信息：

- 你当时使用的模型
- 你收到的错误消息和代码
- 你发送的请求数据和请求头
- 你发起请求的时间戳和时区
- 任何其他可能有助于我们诊断问题的相关细节

我们的支持团队将调查该问题，并尽快回复你。请注意，由于需求量大，我们的支持队列等待时间可能较长。你也可以 [在我们的社区论坛发帖](https://community.openai.com) 但务必省略任何敏感信息。

### 处理错误

我们建议你以编程方式处理由 API 返回的错误。为此，你可以使用如下代码片段：

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