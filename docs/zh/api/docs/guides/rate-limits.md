# 速率限制

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

速率限制是我们的 API 对用户或客户端在指定时间段内可以
访问我们服务的次数所施加的限制。

## 为什么我们要有速率限制？

速率限制是 API 的常见做法，设置它们出于以下几个不同原因：

- **它们有助于防止对 API 的滥用或误用。** 例如，恶意行为者可能会向 API 发送大量请求，试图使其过载或造成服务中断。通过设置速率限制，OpenAI 可以阻止此类行为。
- **速率限制有助于确保每个人都能公平地访问 API。** 如果某个人或组织发出过多请求，可能会拖慢其他人对 API 的访问。通过限制单个用户可发出的请求数量，OpenAI 确保尽可能多的人有机会使用 API 而不会出现卡顿。
- **速率限制可以帮助 OpenAI 管理其基础设施上的总体负载。** 如果对 API 的请求量急剧增加，可能会给服务器带来压力并引发性能问题。通过设置速率限制，OpenAI 可以帮助所有用户维持流畅且一致的体验。

请通读整个文档，以便更好地理解
  OpenAI 的速率限制系统是如何运作的。我们提供了代码示例和可能的
  处理常见问题的解决方案。同时还包含关于你的
  使用层级中速率上限自动提升的详细信息。

## 这些速率限制是如何工作的？

速率限制使用的指标包括 **RPM** （每分钟请求数）， **RPD** （每天请求数）， **TPM** （每分钟 token 数）， **TPD** （每天 token 数）， **IPM** （每分钟图片数），以及部分流式音频模型的每分钟音频分钟数。速率限制可能因任一指标先达到而触发。例如，你可能向 ChatCompletions 端点发送 20 个仅包含 100 个 token 的请求，这就会达到你的限额（如果你的 RPM 为 20），即使在这 20 个请求中你并未发送 150k token（如果你的 TPM 限制为 150k）。

[Batch API](https://developers.openai.com/api/reference/resources/batches/methods/create) 队列限制是根据给定模型排队的输入 token 总数计算的。挂起批量任务中的 token 将计入你的队列限制。一旦批量任务完成，其 token 将不再计入该模型的限制。

其他值得注意的重要事项：

- 速率限制在 [组织级别](https://developers.openai.com/api/docs/guides/production-best-practices) 和项目级别上定义，而不是用户级别。
- 速率限制因所使用的 [模型](https://developers.openai.com/api/docs/models) 而异。
- 对于像 GPT-5.5 这类长上下文模型，长上下文请求有单独的速率限制。你可以在 [开发者控制台](https://platform.openai.com/settings/organization/limits).
- OpenAI 为每个组织设置一个已批准的每月使用上限。这与 [支出限额](https://developers.openai.com/api/docs/guides/spend-limits) 是分开的，你可以为组织或项目配置支出限额。
- 一些模型系列共享速率限制。在你的 [组织限额页面](https://platform.openai.com/settings/organization/limits) 中列在“共享限额”下的任何模型会共享同一速率限制。例如，如果列出的共享 TPM 为 3.5M，则对该“共享限额”列表中任何模型的所有调用都将计入该 3.5M。
- 向量存储的写入也按每个向量存储 ID 进行速率限制。 `/vector_stores/{vector_store_id}/files` 并且 `/vector_stores/{vector_store_id}/file_batches` 每个向量存储共享每分钟 300 次请求的限制。对于较大的写入任务，推荐使用 `/vector_stores/{vector_store_id}/file_batches`.

## 使用层级

三个付费使用层级分别为 **Build**, **Launch**，和 **Grow**。你的组织在使用层级的总信用额度购买达到相应阈值时会自动升级。较高的层级通常会提供更高的跨模型速率限制。

| 层级   | 资格条件                                                         | 使用限制     |
| ------ | --------------------------------------------------------------------- | ---------------- |
| 免费   | 用户必须位于 [允许的地区](https://developers.openai.com/api/docs/supported-countries) | 100 美元 / 月     |
| Build  | 累计信用额度购买达 5 美元                                          | 500 美元 / 月     |
| Launch | 累计信用额度购买达 100 美元                                        | 5,000 美元 / 月   |
| Grow   | 累计信用额度购买达 500 美元                                        | 200,000 美元 / 月 |

### 按使用层级的速率限制

要查看你所在使用层级的每个模型的限额，请前往 [Settings > Organization > Limits](https://platform.openai.com/settings/organization/limits) 并查看 **Rate limits**. 若要升级你的使用层级，请在 **Upgrade tier** 部分中的 **Usage Tiers** 区域进行操作。

| 层级   | Model             |    RPM |         TPM |
| ------ | ----------------- | -----: | ----------: |
| Build  | Astra, Sol, Terra |  5,000 |   1,000,000 |
| Build  | Luna              |  5,000 |   2,000,000 |
| Launch | Astra, Sol, Terra | 10,000 |   4,000,000 |
| Launch | Luna              | 10,000 |  10,000,000 |
| Grow   | Astra, Sol, Terra | 15,000 |  40,000,000 |
| Grow   | Luna              | 30,000 | 180,000,000 |

要查看每个模型的速率限制的高层摘要，请访问 [models 页面](https://developers.openai.com/api/docs/models).

### 消费限额

考虑设置 [**支出限额**](https://developers.openai.com/api/docs/guides/spend-limits) 为你的组织或项目设置，以控制每月 API 支出。这些控制项与上述每月用量限额是相互独立的。

| 控制                                                                          | 达到所配置额度时发生的情况       | 适用场景                       |
| -------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------- |
| [消费提醒](https://developers.openai.com/api/docs/guides/spend-limits#spend-alerts)                        | 发送通知；API 流量继续运行 | 跟踪消费而不中断流量      |
| [硬性消费上限](https://developers.openai.com/api/docs/guides/spend-limits#understand-hard-limit-behavior) | 受影响的 API 请求返回 `429` 错误  | 强制设置每月组织或项目上限 |

### 响应头中的速率限制

除了在你的 [账户页面](https://platform.openai.com/settings/organization/limits)，查看你的速率限制之外，你还可以通过 HTTP 响应的头信息查看有关速率限制的重要信息，例如剩余请求数、tokens 以及其他元数据。

响应中可以包含以下头字段：

| 字段                                | 示例值 | 说明                                                                                       |
| ------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------- |
| Retry-After                          | 56           | 如果存在，则表示在重试临时速率限制错误之前需要等待的最少秒数。 |
| x-ratelimit-limit-requests           | 60           | 在耗尽速率限制之前允许的最大请求数。               |
| x-ratelimit-limit-tokens             | 150000       | 在耗尽速率限制之前允许的最大 token 数。                 |
| x-ratelimit-remaining-requests       | 59           | 在耗尽速率限制之前允许的剩余请求数。             |
| x-ratelimit-remaining-tokens         | 149984       | 在耗尽速率限制之前允许的剩余 token 数。               |
| x-ratelimit-reset-requests           | 1s           | 基于请求数的速率限制重置到初始状态前的剩余时间。                    |
| x-ratelimit-reset-tokens             | 6m0s         | 基于 token 数的速率限制重置到初始状态前的剩余时间。                      |
| x-ratelimit-limit-project-tokens     | 60000        | 项目的 token 上限。                                                                  |
| x-ratelimit-remaining-project-tokens | 57000        | 在耗尽项目级 token 速率限制之前允许使用的剩余 token 数。   |
| x-ratelimit-reset-project-tokens     | 3s           | 项目级 token 速率限制重置到初始状态前的剩余时间。                   |

当项目级令牌限制生效时，响应中可能包含 Project-token 头。 `Retry-After` 可能出现在 `429` 由临时速率限制引起的响应中，以及 `503` 由临时模型过载引起的响应中。这并不意味着可以通过重试来解决配额、计费或其他需要用户操作的错误。

### 微调速率限制

你所在组织的微调速率限制可在 [控制台中查看](https://platform.openai.com/settings/organization/limits)，也可以通过 API 获取：

```bash
curl https://api.openai.com/v1/fine_tuning/model_limits \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


## 错误缓解

### 应对流量激增和模型过载

API 可能会返回 `slow_down` 当你的请求速率增长过快时，或者 `server_is_overloaded` 当所请求的模型暂时过载时。检查 HTTP 状态码以及 `error.code` 以区分这两种情况：

| HTTP 状态 | 错误类型                  | 错误代码             | 含义说明                                  | 处理建议                                                                                                             |
| ----------- | --------------------------- | ---------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `429`       | `rate_limit_error`          | `slow_down`            | 你的请求频率增长过快。       | 按照 `Retry-After` 中的指示（如有），降低请求频率后再逐步提升。                      |
| `503`       | `service_unavailable_error` | `server_is_overloaded` | 所请求的模型暂时过载。 | 按照 `Retry-After` 中的指示（如有）进行重试。若错误持续出现，请逐步增大重试间隔。 |

如果 `Retry-After` 缺失，请增加重试之间的间隔，并加入一个较小的随机延迟。

一个 `slow_down` 错误，即便你的流量在每分钟请求数和每分钟 token 数限制之内，也仍可能出现。它反映的是流量增长的速度，而不是你是否已用尽这些限额。

作为经验法则，一旦你的流量达到每分钟 100 万输入 token (TPM)，每 15 分钟的增长幅度请不要超过 50%。ramp-rate 限制开始生效的具体阈值会因模型和流量状况而异。

按量计费流量经常触及 ramp-rate 限制的企业客户可以考虑 [Scale Tier](https://openai.com/api-scale-tier/) ，以便在符合条件的模型上获得更可预期的容量。对于 GPT-5.6 及更高版本的模型，请参阅 [Reserved Tier](https://openai.com/api-reserved-tier/)。容量层级不会改变你应如何处理 `slow_down` 响应：请遵循 `Retry-After` 提示（若存在），降低流量，并逐步加量。

#### 更新现有的错误处理器

如果你的应用之前处理过限流和过载响应，请同时检查 HTTP 状态码和 `error.code`:

- 在之前返回的端点上 `503` 与 `slow_down` 针对这两种情况的状态码，流量快速增长现在返回 `429` 与 `slow_down`。模型过载仍然为 `503` 但使用 `server_is_overloaded`.
- 在创建任务之前被拒绝的视频请求之前返回 `429` 与 `invalid_request_error` 类型与 `rate_limit_exceeded` 针对这些情况的状态码。流量快速增长现在返回 `429` 与 `rate_limit_error` 并且 `slow_down`；模型过载返回 `503` 与 `service_unavailable_error` 并且 `server_is_overloaded`。视频任务状态中报告的错误属于另一种情况。

同时处理 `429` 和 `503` SDK错误处理函数中的这两种错误。例如，Python、TypeScript 和 Ruby 使用 `RateLimitError` 用于 `429` 和 `InternalServerError` 用于 `503`；Java 使用 `RateLimitException` 和 `InternalServerException`。在你的应用仍可能收到较早的响应码期间，继续为它们提供支持。其他错误可能使用相同的 HTTP 状态码，因此请在选择恢复操作之前检查错误正文。

对于流式请求，这些 HTTP 错误响应在流开始之前生效。流开始后出现的错误可能以流事件的形式到达；在已消费输出后不要自动重放请求。

### 我可以采取哪些步骤来缓解此问题？

OpenAI Cookbook 中有一个 [Python notebook](https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits) 解释了如何避免速率限制错误，还有一个示例 [Python 脚本](https://github.com/openai/openai-cookbook/blob/main/examples/api_request_parallel_processor.py) ，用于在批量处理 API 请求时保持在速率限制内。

在提供编程访问、批量处理功能以及自动化社交媒体发布时也应谨慎——考虑仅对受信任的客户启用这些功能。

为防止自动化和大批量滥用，请在指定时间范围内（每日、每周或每月）为单个用户设置使用上限。对超出限制的用户，考虑实施硬性上限或人工审核流程。

#### 使用指数退避进行重试

当请求超过临时速率限制时，API 会返回 `429` 错误。响应中可能包含一个 `Retry-After` 响应头，告诉你需要等待多少秒后再重试。将该值视为最小等待时间：至少等待那么久，并加入一个较小的随机延迟，以免多个客户端同时重试。

每个 [官方 OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) 会根据其重试设置自动重试符合条件的 `429` 和 `503` 响应。对 `Retry-After`（尤其是长时间延迟）的处理方式因 SDK 版本和配置而异。请查看你所安装版本的重试行为，而不是假设所有服务端延迟都受支持。

如果有效的服务端延迟超过所支持或已配置的最大重试延迟，请停止重试并推迟该请求，而不是更早地重试。当 SDK 拒绝超过其限制的延迟时，会返回原始的 HTTP 错误。请继续单独处理取消和超时错误：被取消的请求或已过期的截止时间可以停止重试而不会返回该 HTTP 错误。每次尝试的超时并不一定是整个操作的总截止时间。

如果你使用自己的 HTTP 客户端，请遵循 `Retry-After` 响应头存在且包含有效值时的处理方式。如果响应头缺失或无效，则回退到带抖动的指数退避策略。同时限制重试次数和重试所花费的总时间。如果你在应用中自行管理重试，请禁用 SDK 的重试，或将这些限制纳入考量，以避免嵌套的重试循环导致请求数量倍增。不要对配额、计费或其他需要你主动处理的错误进行重试。

指数退避是指在一次不成功的请求后短暂等待，然后在每次不成功的重试后逐步延长延迟。这个过程会持续进行，直到请求成功或达到配置的重试上限。

这种方法有许多优点：

- 自动重试意味着你可以在不发生崩溃或数据丢失的情况下从速率限制错误中恢复
- 指数退避意味着前几次重试可以快速进行，同时在前几次重试失败时仍能受益于更长的延迟
- 在延迟中加入随机抖动可以避免所有重试同时发生。

请注意，未成功的请求会计入你的每分钟限额，因此持续重新发送同一请求是行不通的。

以下旧版 Completions 示例使用了 `gpt-3.5-turbo-instruct`，它将于 [2026 年 9 月 28 日](https://developers.openai.com/api/docs/deprecations#2025-09-26-legacy-gpt-model-snapshots)。该日期之后，请保留重试模式，但将请求迁移至 [Responses 或 Chat Completions](https://developers.openai.com/api/docs/guides/migrate-to-responses) ，仅更改 Completions 请求中的模型 ID 是不够的。 `gpt-5.6-terra`；仅更改 Completions 请求中的模型 ID 是不够的。

下面的 Python 示例演示了回退退避策略。它们不会检查 `Retry-After`：在使用之前，请添加对有效服务端提示的处理，以免包装器的重试早于请求所需的时间。禁用 SDK 的重试，或在你的应用程序的重试限制中将其考虑在内。



##### 示例 1：使用 Tenacity 库



Tenacity 是一个采用 Apache 2.0 许可的通用重试库，使用 Python 编写，旨在简化向几乎任何对象添加重试行为的任务。
要为你的请求添加指数退避，可以使用 retry `tenacity.retry` 装饰器。下面的示例使用 `tenacity.wait_random_exponential` 函数为请求添加随机指数退避。

使用 Tenacity 库

```python
from openai import OpenAI
from tenacity import (
    retry,
    stop_after_attempt,
    wait_random_exponential,
)  # for exponential backoff

client = OpenAI()


@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(6))
def completion_with_backoff(**kwargs):
    return client.completions.create(**kwargs)


completion_with_backoff(
    model="gpt-3.5-turbo-instruct",
    prompt="Once upon a time,",
)
```


请注意，Tenacity 库是第三方工具，OpenAI 不对其可靠性或安全性做任何保证。
其可靠性或安全性不做任何保证。







##### 示例 2：使用 backoff 库



另一个提供用于退避和重试的函数装饰器的 Python 库是 [backoff](https://pypi.org/project/backoff/):

使用 Tenacity 库

```python
import backoff
import openai
from openai import OpenAI

client = OpenAI()


@backoff.on_exception(backoff.expo, openai.RateLimitError)
def completions_with_backoff(**kwargs):
    return client.completions.create(**kwargs)


completions_with_backoff(
    model="gpt-3.5-turbo-instruct",
    prompt="Once upon a time,",
)
```


与 Tenacity 类似，backoff 库是一个第三方工具，OpenAI 不对其可靠性或安全性作任何保证。







##### 示例 3：手动实现退避


如果不想使用第三方库，你可以参考下面的示例自行实现退避逻辑：
使用手动退避实现

```python
# imports
import random
import time

import openai
from openai import OpenAI

client = OpenAI()

# define a retry decorator


def retry_with_exponential_backoff(
    func,
    initial_delay: float = 1,
    exponential_base: float = 2,
    jitter: bool = True,
    max_retries: int = 10,
    errors: tuple = (openai.RateLimitError,),
):
    """Retry a function with exponential backoff."""

    def wrapper(*args, **kwargs):
        # Initialize variables
        num_retries = 0
        delay = initial_delay

        # Loop until a successful response or max_retries is hit or an exception is raised
        while True:
            try:
                return func(*args, **kwargs)

            # Retry on specific errors
            except errors:
                # Increment retries
                num_retries += 1

                # Check if max retries has been reached
                if num_retries > max_retries:
                    raise Exception(
                        f"Maximum number of retries ({max_retries}) exceeded."
                    )

                # Increment the delay
                delay *= exponential_base * (1 + jitter * random.random())

                # Sleep for the delay
                time.sleep(delay)

            # Raise exceptions for any errors not specified
            except Exception:
                raise

    return wrapper


@retry_with_exponential_backoff
def completions_with_backoff(**kwargs):
    return client.completions.create(**kwargs)
```

同样，OpenAI 不对该方案的安全性和效率作任何保证，但它可以作为你自己方案的良好起点。





#### Reduce the `max_tokens` to match the size of your completions

你的速率上限按以下两者中的较大值计算： `max_tokens` ，以及根据你请求的字符数估算的 token 数量。尝试将 `max_tokens` 值设置得尽可能接近你预期的响应大小。

#### 批量处理请求

如果你的用例不需要立即获得响应，可以使用 [Batch API](https://developers.openai.com/api/docs/guides/batch) 来提交和执行大量请求，而不会影响你的同步请求速率限制。

对于需要 _同步响应的用例，_ OpenAI API 对 **每分钟请求数** 和 **每分钟 tokens 数**.

如果你达到了每分钟请求数的限制，但每分钟 tokens 数仍有可用容量，你可以通过将多个任务批量合并到每个请求中来提高吞吐量。这将允许你每分钟处理更多 tokens，尤其是在使用我们较小的模型时。

批量发送提示与普通的 API 调用完全相同，只是你需要向 prompt 参数传入一个字符串列表，而不是单个字符串。 [在 Batch API 指南中了解更多信息](https://developers.openai.com/api/docs/guides/batch).