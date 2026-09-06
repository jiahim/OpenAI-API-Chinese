# 速率限制

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾附加 `.md` 即可获取该页面的 Markdown 版本。

速率限制是我们的 API 对用户或客户端在
在指定时间段内访问我们的服务。

## 为什么要有速率限制？

速率限制是 API 的常见做法，设置它们有以下几个不同的原因：

- **它们有助于防止对 API 的滥用或误用。** 例如，恶意行为者可能向 API 发送大量请求，试图让其过载或造成服务中断。通过设置速率限制，OpenAI 可以阻止此类活动。
- **速率限制有助于确保每个人都能公平地访问 API。** 如果某个人或组织发送过多请求，可能会拖慢其他所有人的 API。通过对单个用户可发起的请求数量进行限流，OpenAI 确保尽可能多的用户有机会使用 API，而不会遇到速度变慢的情况。
- **速率限制可以帮助 OpenAI 管理其基础设施上的总体负载。** 如果对 API 的请求量大幅增加，可能会给服务器带来压力并引发性能问题。通过设置速率限制，OpenAI 可以帮助为所有用户维持流畅且一致的体验。

请通读整篇文档，以便更好地了解
  OpenAI 的速率限制系统的工作方式。文档中包含了代码示例和可能的
  用于处理常见问题的解决方案。我们还将在下文的 usage tiers（使用层级）部分详细介绍你的
  速率限制是如何自动提升的。

## 这些速率限制是如何工作的？

速率限制使用的指标包括 **RPM** （每分钟请求数）， **RPD** （每天请求数）， **TPM** （每分钟 token 数）， **TPD** （每天 token 数）， **IPM** （每分钟图片数），以及某些流式音频模型的每分钟音频分钟数。速率限制可能因任一选项先达到上限而被触发。例如，你可能向 ChatCompletions 端点发送了 20 个仅含 100 个 token 的请求，这就会用尽你的限额（如果你的 RPM 为 20），即使这 20 个请求中的总 token 数并未达到 150k（如果你的 TPM 限制为 150k）。

[Batch API](https://developers.openai.com/api/reference/resources/batches/methods/create) 队列限制根据给定模型排队中的输入 token 总数计算。待处理批量作业的 token 会计入你的队列限制。一旦批量作业完成，其 token 将不再计入该模型的限制。

其他值得注意的重要事项：

- 速率限制在 [组织级别](https://developers.openai.com/api/docs/guides/production-best-practices) 和项目级别定义，而不是用户级别。
- 速率限制因所使用的 [模型](https://developers.openai.com/api/docs/models) 而异。
- 对于 GPT-5.5 等长上下文模型，长上下文请求有单独的速率限制。你可以在 [开发者控制台](https://platform.openai.com/settings/organization/limits).
- OpenAI 为每个组织设定了已批准的每月使用上限。这与你可以为组织或项目配置的 [支出上限](https://developers.openai.com/api/docs/guides/spend-limits) 是分开的。
- 某些模型系列共享速率限制。你的 [组织限制页面](https://platform.openai.com/settings/organization/limits) 中列在“共享限制”下的任何模型彼此共享一个速率限制。例如，如果列出的共享 TPM 为 3.5M，则对该“共享限制”列表中任何模型的所有调用都将计入该 3.5M。
- 向量存储的数据接入也按每个向量存储 ID 进行速率限制。 `/vector_stores/{vector_store_id}/files` ， `/vector_stores/{vector_store_id}/file_batches` 共享每个向量存储每分钟 300 次请求的限制。对于较大的数据接入，建议使用 `/vector_stores/{vector_store_id}/file_batches`.

## 使用层级

你可以在以下位置查看所在组织的速率和使用限额： [限额](https://platform.openai.com/settings/organization/limits) 账户设置部分。随着你在我们的 API 上的支出增加，我们会自动将你升级到下一使用层级。这通常会导致大多数模型的速率限制提高。

| 层级        | 资格条件                                                         | 使用限额     |
| ----------- | --------------------------------------------------------------------- | ---------------- |
| 免费        | 用户必须位于 [允许的地区](https://developers.openai.com/api/docs/supported-countries) | $100 / 月     |
| 层级&nbsp;1 | 已支付 $5                                                               | $100 / 月     |
| 层级&nbsp;2 | 已支付 $50                                                              | $500 / 月     |
| 层级&nbsp;3 | 已支付 $100                                                             | $1,000 / 月   |
| 层级&nbsp;4 | 已支付 $250                                                             | $5,000 / 月   |
| 层级&nbsp;5 | $1,000 paid                                                           | $200,000 / month |

要查看每个模型速率限制的高层摘要，请访问 [models 页面](https://developers.openai.com/api/docs/models).

### 请求头中的速率限制

除了在你的 [账户页面](https://platform.openai.com/settings/organization/limits)，中查看你的速率限制外，你还可以在 HTTP 响应的标头中查看有关速率限制的重要信息，例如剩余的请求数、令牌数以及其他元数据。

响应可以包含以下标头字段：

| 字段                                | 示例值 | 说明                                                                                       |
| ------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------- |
| Retry-After                          | 56           | 出现临时限流错误时，在重试之前需要等待的最短秒数（如有）。 |
| x-ratelimit-limit-requests           | 60           | 在达到限流上限之前允许发起的最大请求数。               |
| x-ratelimit-limit-tokens             | 150000       | 在达到限流上限之前允许使用的最大 token 数。                 |
| x-ratelimit-remaining-requests       | 59           | 在达到限流上限之前仍可发起的剩余请求数。             |
| x-ratelimit-remaining-tokens         | 149984       | 在达到限流上限之前仍可使用的剩余 token 数。               |
| x-ratelimit-reset-requests           | 1s           | 基于请求数的速率限制重置到初始状态前剩余的时间。                    |
| x-ratelimit-reset-tokens             | 6m0s         | 基于 token 数的速率限制重置到初始状态前剩余的时间。                      |
| x-ratelimit-limit-project-tokens     | 60000        | 项目的 token 限制。                                                                  |
| x-ratelimit-remaining-project-tokens | 57000        | 在耗尽项目级 token 速率限制之前仍可使用的 token 数量。   |
| x-ratelimit-reset-project-tokens     | 3s           | 项目级 token 速率限制重置到初始状态前剩余的时间。                   |

在存在项目级 token 限制时，响应中可能会出现项目 token 标头。 `Retry-After` 可能出现在 `429` 由临时速率限制引发的响应上，以及 `503` 由临时模型过载引发的响应上。这并不意味着配额、计费或其他需要用户操作的错误可以通过重试来解决。

### 微调速率限制

你所在组织的微调速率限制可在 [控制台中查看](https://platform.openai.com/settings/organization/limits),也可以通过 API 获取：

```bash
curl https://api.openai.com/v1/fine_tuning/model_limits \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


## 错误缓解

### 应对流量激增与模型过载

API 可能返回 `slow_down` 当你发送请求的速率过快时，或者 `server_is_overloaded` 当你请求的模型暂时过载时。请检查 HTTP 状态码以及 `error.code` 来区分这些情况：

| HTTP 状态 | 错误类型                  | 错误代码             | 含义                                  | 处理建议                                                                                                             |
| ----------- | --------------------------- | ---------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `429`       | `rate_limit_error`          | `slow_down`            | 你的请求速率增长过快。       | 遵循 `Retry-After` 若该字段存在，请降低请求速率后再逐步提升。                      |
| `503`       | `service_unavailable_error` | `server_is_overloaded` | 所请求的模型暂时过载。 | 遵循 `Retry-After` 若该字段存在，请稍后重试。如果错误持续出现，请逐步增大重试之间的间隔。 |

如果 `Retry-After` 字段缺失，请增加重试之间的间隔，并加入一个小的随机延迟。

一个 `slow_down` 错误，即使你的流量处于每分钟请求数和每分钟 token 数限制之内，也仍可能发生。它反映的是流量增长的速度，而不是你是否已经耗尽这些限制。

作为经验法则，当你的流量达到每分钟 100 万输入 token（TPM）后，每 15 分钟的增长幅度不要超过 50%。斜率限制适用的具体阈值会因模型和流量情况而异。

按量付费流量经常触及斜率限制的企业客户可以考虑 [Scale Tier](https://openai.com/api-scale-tier/) ，以在合格模型上获得更可预期的容量。对于 GPT-5.6 及更高版本的模型，请参阅 [Reserved Tier](https://openai.com/api-reserved-tier/)。容量层级不会改变你处理 `slow_down` 响应的方式：当它出现时，请遵循 `Retry-After` ，降低流量，并逐步爬坡。

#### 更新现有错误处理程序

如果你的应用此前处理过限流和过载响应，请同时检查 HTTP 状态以及 `error.code`:

- 在之前返回 `503` 的接口上 `slow_down` 状态码来表示这两种情况，现在流量快速上涨时返回 `429` 并附带 `slow_down`。模型过载仍然返回 `503` ，但使用 `server_is_overloaded`.
- 在创建任务之前被拒绝的视频请求之前返回 `429` 的接口上 `invalid_request_error` 类型和 `rate_limit_exceeded` 状态码来表示这些情况。现在流量快速上涨时返回 `429` 并附带 `rate_limit_error` ， `slow_down`；模型过载返回 `503` 并附带 `service_unavailable_error` ， `server_is_overloaded`。视频任务状态中上报的错误属于另一种情况。

同时处理 `429` 和 `503` 在你的 SDK 错误处理程序中。例如，Python、TypeScript 和 Ruby 使用 `RateLimitError` 来处理 `429` 和 `InternalServerError` 来处理 `503`；Java 使用 `RateLimitException` 和 `InternalServerException`。在你的应用仍可能收到较早的响应码期间，保留对这些响应码的支持。其他错误可能使用相同的 HTTP 状态码，因此请在选择恢复操作之前检查错误体内容。

对于流式请求，这些 HTTP 错误响应会在流开始之前返回。流开始之后发生的错误可能会以流事件的形式到达；在已经消费输出内容后，请勿自动重放请求。

### 我可以采取哪些步骤来缓解这个问题？

OpenAI Cookbook 包含一个 [Python notebook](https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits) ，其中说明了如何避免速率限制错误，以及一个示例 [Python 脚本](https://github.com/openai/openai-cookbook/blob/main/examples/api_request_parallel_processor.py) ，用于在批量处理 API 请求时保持在速率限制之内。

在提供编程访问、批量处理功能和自动社交媒体发布功能时，你也应当谨慎——建议仅为受信任的客户启用这些功能。

为防范自动化的高批量滥用，请在指定的时间范围（每日、每周或每月）内为单个用户设置用量限制。对于超出限制的用户，可考虑实施硬性上限或人工审核流程。

#### 使用指数退避进行重试

当请求超出临时速率限制时，API 会返回 `429` 错误。响应可以包含一个 `Retry-After` 响应头，告诉你需要等待多少秒后才能重试。请将此值视为最小等待时间：至少等待这么久，并增加一个小的随机延迟，以免多个客户端同时重试。

每个 [官方 OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) 会根据其重试设置自动重试符合条件的 `429` 和 `503` 响应。是否处理 `Retry-After`，尤其是较长的延迟，因 SDK 版本和配置而异。请检查你所安装版本的重试行为，而不是假设服务端的所有延迟都受支持。

如果有效的服务端延迟超出了受支持或已配置的最大重试延迟，请停止重试并推迟该请求，而不是更早地重试。当 SDK 拒绝超出其限制的延迟时，可能会返回原始的 HTTP 错误。请继续单独处理取消和超时错误：已取消的请求或已过期的截止时间可以在不返回该 HTTP 错误的情况下停止重试。每次尝试的超时并不一定是整个操作的截止时间。

如果你使用自己的 HTTP 客户端，请在 `Retry-After` 响应头存在且包含有效值时遵循其指示。如果缺失或无效，则回退到带抖动的指数退避策略。同时限制尝试次数和重试所花费的总时间。如果你在应用中自行管理重试，请禁用 SDK 的重试，或在上述限制中将其考虑在内，以免嵌套的重试循环使请求数倍增。对于需要你采取操作的配额、计费或其他错误，请勿重试。

指数退避是指在一次不成功的请求后短暂等待，然后在每次不成功的重试后增加延迟。这一过程会持续进行，直到请求成功或达到配置的重试上限。

这种方法有许多优点：

- 自动重试意味着你可以在不发生崩溃或丢失数据的情况下，从速率限制错误中恢复
- 指数退避意味着你的前几次重试可以快速发起，同时在前几次重试失败时仍能从更长的延迟中获益
- 在延迟中加入随机抖动有助于避免所有重试同时发生。

请注意，未成功的请求也会计入你的每分钟请求限额，因此持续重复发送同一个请求是行不通的。

以下 Python 示例演示了回退退避策略。它们不会检查 `Retry-After`: 在使用它们之前，请添加对有效服务端提示的处理，以避免封装程序比请求更早地重试。请禁用 SDK 的重试，或在你的应用程序重试限制中将它们考虑在内。



##### 示例 1：使用 Tenacity 库



Tenacity 是一个基于 Apache 2.0 许可的通用重试库，使用 Python 编写，旨在简化为几乎任何对象添加重试行为的工作。
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


请注意，Tenacity 库是一个第三方工具，OpenAI 对其不作任何保证
其可靠性或安全性。







##### 示例 2：使用 backoff 库



另一个提供用于回退和重试的函数装饰器的 Python 库是 [backoff](https://pypi.org/project/backoff/):

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







##### 示例 3：手动退避实现


如果不想使用第三方库，可以参考以下示例实现自己的退避逻辑：
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

同样，OpenAI 不对该方案的安全性和效率作任何保证，但它可以作为你自己的方案的良好起点。





#### Reduce the `max_tokens` 以匹配你的补全大小

你的速率上限按以下两者中的较大值计算： `max_tokens` 以及根据你请求的字符数估算得到的 token 数。请尽量将 `max_tokens` 值设置得尽量接近你预期的响应大小。

#### 批量请求

如果你的用例不需要立即获得响应，你可以使用 [Batch API](https://developers.openai.com/api/docs/guides/batch) 来更轻松地提交和执行大量请求，而不会影响你的同步请求速率限制。

对于需要 _同步_ 响应的用例，OpenAI API 对以下方面有单独的限制： **每分钟请求数** 和 **每分钟 token 数**.

如果你达到了每分钟请求数的上限，但每分钟 token 数仍有可用容量，可以通过将多个任务批量合并到每个请求中来提高吞吐量。这样可以让你每分钟处理更多 token，尤其是在使用我们较小的模型时。

发送一批提示与普通的 API 调用完全相同，只是你向 prompt 参数传入的是一个字符串列表，而不是单个字符串。 [在 Batch API 指南中了解更多信息](https://developers.openai.com/api/docs/guides/batch).