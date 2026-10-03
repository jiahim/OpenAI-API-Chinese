# 速率限制

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取该页的 Markdown 版本。

速率限制是我们的 API 对用户或客户端在指定时间段内可以
访问我们服务次数的限制。

## 为什么要设置速率限制？

速率限制是 API 的常见做法，设置它们的原因有多种：

- **它们有助于防止对 API 的滥用或误用。** 例如，恶意行为者可能通过大量请求来淹没 API，试图使其过载或导致服务中断。通过设置速率限制，OpenAI 可以阻止这类行为。
- **速率限制有助于确保每个人都能公平地访问 API。** 如果某个人或组织发出过多请求，可能会拖慢所有人的 API。通过对单个用户可发起的请求数量进行限流，OpenAI 能够确保尽可能多的人在不受速度变慢影响的情况下使用 API。
- **速率限制可以帮助 OpenAI 管理其基础设施上的总体负载。** 如果对 API 的请求量大幅增加，可能会给服务器造成压力并引发性能问题。通过设置速率限制，OpenAI 可以帮助所有用户保持流畅且一致的体验。

请通读整个文档，以便更好地理解
  了解 OpenAI 的速率限制系统的工作原理。我们会提供代码示例和可能的
  处理常见问题的解决方案。我们还在下方的使用层级部分详细介绍了你的
  速率限制是如何自动提升的。

## 这些速率限制是如何运作的？

速率限制使用以下指标，例如 **RPM** （每分钟请求数）， **RPD** （每天请求数）， **TPM** （每分钟令牌数）， **TPD** （每天令牌数）， **IPM** （每分钟图像数），以及部分流式音频模型的每分钟音频分钟数。速率限制可能因先达到其中任意一项而被触发。例如，你可以向 ChatCompletions 端点发送仅包含 100 个令牌的 20 个请求，即使这 20 个请求中并未发送 15 万个令牌（如果你的 TPM 限制为 15 万），也会达到你的限制（如果你的 RPM 为 20）。

[批量 API](https://developers.openai.com/api/reference/resources/batches/methods/create) 队列限制是根据给定模型排队的输入令牌总数计算的。待处理批量作业中的令牌会计入你的队列限制。批量作业完成后，其中的令牌将不再计入该模型的限制。

其他值得注意的重要事项：

- 速率限制在 [组织层级](https://developers.openai.com/api/docs/guides/production-best-practices) 以及项目层级定义，而不是用户层级。
- 速率限制因所使用 [的模型](https://developers.openai.com/api/docs/models) 而异。
- 对于 GPT-5.5 等长上下文模型，长上下文请求有单独的速率限制。你可以在 [开发者控制台](https://platform.openai.com/settings/organization/limits).
- OpenAI 为每个组织设定一个已批准的月度使用上限。这与你可以为组织或项目配置的 [支出上限](https://developers.openai.com/api/docs/guides/spend-limits) 是分开的。
- 某些模型系列共享速率限制。在你的 [组织限制页面](https://platform.openai.com/settings/organization/limits) 中列于同一“共享限制”下的所有模型共享一个速率限制。例如，如果列出的共享 TPM 为 3.5M，则对给定“共享限制”列表中任何模型的调用都将计入该 3.5M。
- 向量存储的写入也会按向量存储 ID 进行速率限制。 `/vector_stores/{vector_store_id}/files` 并且 `/vector_stores/{vector_store_id}/file_batches` 每个向量存储共享每分钟 300 次请求的限制。对于较大的写入，建议使用 `/vector_stores/{vector_store_id}/file_batches`.

## 用量等级

你可以在以下位置查看你组织的速率和使用限额： [limits](https://platform.openai.com/settings/organization/limits) 账户设置页面。随着你在我们的 API 上的消费增加，我们会自动将你提升到下一使用层级，这通常会使大多数模型的速率限制相应提高。

| 层级        | 资格条件                                                         | 使用限额     |
| ----------- | --------------------------------------------------------------------- | ---------------- |
| 免费        | 用户必须位于 [允许的地区](https://developers.openai.com/api/docs/supported-countries) | 100 美元 / 月     |
| 层级&nbsp;1 | 5 美元充值                                                               | 100 美元 / 月     |
| 层级&nbsp;2 | 50 美元充值                                                              | 500 美元 / 月     |
| 层级&nbsp;3 | 100 美元充值                                                             | 1,000 美元 / 月   |
| 层级&nbsp;4 | 250 美元充值                                                             | 5,000 美元 / 月   |
| 层级&nbsp;5 | $1,000 paid                                                           | $200,000 / 月 |

若要查看每个模型的速率限制高层摘要，请访问 [models 页面](https://developers.openai.com/api/docs/models).

### Spend limits

考虑设置 [**支出限额**](https://developers.openai.com/api/docs/guides/spend-limits) 为你的组织或项目设置支出限额，以控制每月的 API 支出。这些控制与上面的每月使用限额是分开设置的。

| 控制                                                                          | 达到配置金额时发生的情况       | 使用场景                       |
| -------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------- |
| [支出提醒](https://developers.openai.com/api/docs/guides/spend-limits#spend-alerts)                        | 发送通知；API 流量不受影响 | 跟踪支出，同时不影响流量      |
| [硬性支出上限](https://developers.openai.com/api/docs/guides/spend-limits#understand-hard-limit-behavior) | 受影响的 API 请求返回 `429` 错误  | 强制设置组织或项目的月度上限 |

### 响应头中的速率限制

除了在你的 [账户页面](https://platform.openai.com/settings/organization/limits)，中查看你的速率限制外，你还可以在 HTTP 响应的标头中查看有关速率限制的重要信息，例如剩余请求数、令牌数以及其他元数据。

响应可以包含以下标头字段：

| 字段                                | 示例值 | 说明                                                                                       |
| ------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------- |
| Retry-After                          | 56           | 在出现临时限速错误时，重试前需要等待的最少秒数（如果存在该字段）。 |
| x-ratelimit-limit-requests           | 60           | 在耗尽速率限制之前允许发起的最大请求数。               |
| x-ratelimit-limit-tokens             | 150000       | 在耗尽速率限制之前允许使用的最大 token 数。                 |
| x-ratelimit-remaining-requests       | 59           | 在耗尽速率限制之前允许发起的剩余请求数。             |
| x-ratelimit-remaining-tokens         | 149984       | 在耗尽速率限制之前允许使用的剩余 token 数。               |
| x-ratelimit-reset-requests           | 1s           | 基于请求数的速率限制重置回初始状态前的剩余时间。                    |
| x-ratelimit-reset-tokens             | 6m0s         | 基于 token 数的速率限制重置回初始状态前的剩余时间。                      |
| x-ratelimit-limit-project-tokens     | 60000        | 项目的 token 限额。                                                                  |
| x-ratelimit-remaining-project-tokens | 57000        | 在耗尽项目级 token 速率限制之前允许使用的剩余 token 数量。   |
| x-ratelimit-reset-project-tokens     | 3s           | 项目级 token 速率限制重置回初始状态前的剩余时间。                   |

在存在项目作用域的令牌限制时，可能会出现 Project-token 头。 `Retry-After` 可能会出现在 `429` 由临时速率限制引起的响应，以及 `503` 由临时模型过载引起的响应。它并不意味着需要用户操作的配额、计费或其他错误可以通过重试来解决。

### 微调速率限制

你所在组织的微调速率限制可以在 [控制台中找到](https://platform.openai.com/settings/organization/limits), 也可以通过 API 获取:

```bash
curl https://api.openai.com/v1/fine_tuning/model_limits \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


## 错误缓解

### 应对流量激增和模型过载

API 可能返回 `slow_down` 当你的请求速率增长过快时，或者 `server_is_overloaded` 当所请求的模型暂时过载时。请检查 HTTP 状态码并 `error.code` 以区分这些情况：

| HTTP 状态码 | 错误类型                  | 错误代码             | 含义                                  | 建议处理方式                                                                                                             |
| ----------- | --------------------------- | ---------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `429`       | `rate_limit_error`          | `slow_down`            | 你的请求速率增长过快。       | 请遵循 `Retry-After` 中的提示（如果存在），降低请求速率，然后再逐步提高。                      |
| `503`       | `service_unavailable_error` | `server_is_overloaded` | 所请求的模型暂时过载。 | 请遵循 `Retry-After` 如果存在相应提示，请遵循该提示进行重试。如果错误持续出现，请逐步增加重试之间的间隔时间。 |

如果 `Retry-After` 错误缺少，则增加重试之间的延迟并加入较小的随机延迟。

一个 `slow_down` 错误即使在你的流量处于每分钟请求数和每分钟 token 数限制之内时也可能发生。它反映的是流量增长的速度，而非是否已经耗尽了这些限制。

作为经验法则，一旦你的流量达到每分钟 100 万输入 token（TPM），每 15 分钟的增幅不要超过 50%。斜率限制适用的确切阈值会因模型和流量状况而异。

按量计费流量经常触及斜率限制的企业客户可以考虑 [Scale Tier](https://openai.com/api-scale-tier/) ，以便在符合条件的模型上获得更可预测的容量。对于 GPT-5.6 及更高版本的模型，请参阅 [Reserved Tier](https://openai.com/api-reserved-tier/)。容量层级不会改变你处理 `slow_down` 响应的方式：遵循 `Retry-After` （如果存在），降低流量，并逐步增加。

#### 更新现有错误处理函数

如果你的应用程序此前处理过限流（throttling）和过载（overload）响应，请同时检查 HTTP 状态以及 `error.code`:

- 在之前返回 `503` 以及 `slow_down` 两种状态的接口上，流量快速增长现在会返回 `429` 并附 `slow_down`。模型过载仍为 `503` ，但使用 `server_is_overloaded`.
- 在创建任务之前被拒绝的视频请求此前返回 `429` 以及 `invalid_request_error` 类型和 `rate_limit_exceeded` 状态码处理这些情况。流量快速增长现在返回 `429` 并附 `rate_limit_error` 并且 `slow_down`；模型过载返回 `503` 并附 `service_unavailable_error` 并且 `server_is_overloaded`。视频任务状态中报告的错误属于另一种情况。

同时处理 `429` 和 `503` 在你的 SDK 错误处理器中。例如，Python、TypeScript 和 Ruby 使用 `RateLimitError` 用于 `429` 和 `InternalServerError` 用于 `503`；Java 使用 `RateLimitException` 和 `InternalServerException`。在你的应用仍然可能收到较早响应码的期间，请保留对这些状态码的支持。其他错误也可能使用相同的 HTTP 状态码，因此在选择恢复操作前请检查错误体内容。

对于流式请求，这些 HTTP 错误响应会在流开始之前返回。流开始之后发生的错误可能以流事件的形式到达；不要在已消费输出后自动重放请求。

### 我可以采取哪些步骤来缓解这个问题？

The OpenAI Cookbook 中有一个 [Python notebook](https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits) ，其中说明了如何避免速率限制错误，以及一个示例 [Python 脚本](https://github.com/openai/openai-cookbook/blob/main/examples/api_request_parallel_processor.py) ，用于在批量处理 API 请求时保持在速率限制之内。

在提供编程访问、批处理功能和自动社交媒体发布功能时，你也应保持谨慎——考虑仅为受信任的客户启用这些功能。

为防范自动化和大规模滥用，应在指定的时间范围内（每日、每周或每月）为单个用户设置使用上限。考虑对超出上限的用户实施硬性上限或人工审核流程。

#### 使用指数退避进行重试

当请求超出临时速率限制时，API 会返回 `429` 错误。响应中可以包含一个 `Retry-After` 响应头，告诉你需要等待多少秒后才能重试。请将该值视为最小值：至少等待那么长时间，并增加一个小的随机延迟，以避免多个客户端同时重试。

每个 [官方 OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) 会根据其重试设置自动重试符合条件的 `429` 和 `503` 响应。 `Retry-After`，的处理方式（尤其是较长的延迟）因 SDK 版本和配置而异。请检查你所安装版本的重试行为，而不是假设所有服务器延迟都受支持。

如果有效的服务器延迟超过了所支持或配置的最大重试延迟，请停止重试并推迟该请求，而不是更快地重试。当 SDK 拒绝超过其限制的延迟时，它可以返回原始的 HTTP 错误。请继续单独处理取消和超时错误：已取消的请求或已过期的截止时间可以停止重试，而不会返回该 HTTP 错误。每次尝试的超时并不一定是整个操作的截止时间。

如果你使用的是自己的 HTTP 客户端，请在 `Retry-After` 出现该响应头且其值有效时遵循其指示。如果该响应头缺失或无效，请回退到带抖动的指数退避策略。限制重试次数和重试总耗时。如果你在应用中自行管理重试，请禁用 SDK 重试，或在上述限制中将它们考虑在内，以避免嵌套的重试循环使请求数量成倍增加。不要对配额、计费或其他需要你采取措施的错误进行重试。

指数退避是指在请求失败后短暂等待，然后在每次失败的重试之后逐步延长延迟时间。这一过程会持续到请求成功或达到配置的重试上限为止。

这种方法有许多好处：

- 自动重试意味着你可以在不发生崩溃或丢失数据的情况下，从速率限制错误中恢复
- 指数退避意味着你的前几次重试可以快速进行，同时在前几次重试失败时仍能受益于更长的延迟
- 在延迟中加入随机抖动可以避免所有重试同时发生。

请注意，未成功的请求也会占用你的每分钟请求限额，因此持续重发同一请求是无效的。

下方旧版 Completions 示例使用的是 `gpt-3.5-turbo-instruct`，其计划停用日期为 [2026-09-28](https://developers.openai.com/api/docs/deprecations#2025-09-26-legacy-gpt-model-snapshots)。在该日期之后，请保留重试模式，但将请求迁移到 [Responses 或 Chat Completions](https://developers.openai.com/api/docs/guides/migrate-to-responses) 并 `gpt-5.6-terra`；仅更改 Completions 请求中的模型 ID 是不够的。

下面的 Python 示例演示了回退退避策略。它们不会检查 `Retry-After`：在使用之前，请添加对有效服务端提示的处理，以免包装器比请求更早地重试。请禁用 SDK 的重试或在应用程序的重试限制中加以考虑。



##### 示例 1：使用 Tenacity 库



Tenacity 是一个采用 Apache 2.0 许可的通用重试库，使用 Python 编写，旨在简化向几乎任何对象添加重试行为的工作。
要为你的请求添加指数退避，可以使用 `tenacity.retry` 装饰器。下面的示例使用 `tenacity.wait_random_exponential` 函数为请求添加随机指数退避。

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


请注意，Tenacity 库是一个第三方工具，OpenAI 不对其可靠性或安全性做任何保证。
可靠性或安全性。







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


与 Tenacity 一样，backoff 库是一个第三方工具，OpenAI 不对其可靠性或安全性作任何保证。







##### 示例 3：手动实现退避


如果你不想使用第三方库，可以参考下面的示例自行实现退避逻辑：
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

同样地，OpenAI 不对该方案的安全性或效率作任何保证，但它可以作为你自己方案的不错起点。





#### 减小 `max_tokens` 以匹配你的补全大小

你的速率上限按以下两者中的较大值计算 `max_tokens` 以及根据你请求的字符数估算得到的 token 数。请尽量将 `max_tokens` 的值设置得尽可能接近你预期的响应大小。

#### Batching requests

如果你的用例不需要即时响应，你可以使用 [批量 API](https://developers.openai.com/api/docs/guides/batch) 提交并执行大量请求，而不会影响你的同步请求速率限制。

对于 _需要_ 同步响应的用例，OpenAI API 对 **每分钟请求数** 和 **每分钟 token 数**.

如果你达到了每分钟请求数的上限，但每分钟 token 数还有可用容量，你可以通过将多个任务批处理到每个请求中来提高吞吐量。这样可以让你每秒处理更多 token，尤其是使用我们较小的模型时。

批量发送提示词与普通的 API 调用完全相同，只是你需要向 prompt 参数传入一个字符串列表，而不是单个字符串。 [在 Batch API 指南中了解更多信息](https://developers.openai.com/api/docs/guides/batch).