# Rate limits

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

速率限制是 API 对用户或客户端在指定时间内访问我们服务次数的限制。
访问我们的服务次数施加的限制。

## 为什么要设置速率限制？

速率限制是 API 的常见做法，设置它们有几个不同的原因：

- **它们有助于防止滥用或误用 API。** 例如，恶意行为者可以向 API 发送大量请求，试图使其过载或导致服务中断。通过设置速率限制，OpenAI 可以防止这类活动。
- **速率限制有助于确保每个人都能公平使用 API。** 如果个人或组织发出过多请求，就可能拖慢所有其他人使用 API 的速度。通过限制单个用户可发出的请求数量，OpenAI 确保尽可能多的人有机会使用 API，而不会遇到速度变慢的情况。
- **速率限制可以帮助 OpenAI 管理其基础设施上的总体负载。** 如果发往 API 的请求量急剧增加，可能会给服务器造成压力并导致性能问题。通过设置速率限制，OpenAI 可以帮助所有用户保持流畅且一致的体验。

请完整阅读本文档，以便更好地了解
  OpenAI 的速率限制系统是如何运作的。我们提供了代码示例和可能的
  解决方案以处理常见问题。我们还会详细介绍在下文的使用层级一节中，
  你的速率限制是如何被自动提升的。

## 这些速率限制是如何工作的？

速率限制使用以下指标： **RPM** （每分钟请求数）， **RPD** （每天请求数）， **TPM** （每分钟令牌数）， **TPD** （每天令牌数）， **IPM** （每分钟图像数），以及某些流式音频模型的每分钟音频分钟数。速率限制取决于哪个先达到，可能会在上述任意选项上触发。例如，你可能向 ChatCompletions 端点发送 20 个仅含 100 个令牌的请求，这就会耗尽你的限额（如果你的 RPM 为 20），即使在这 20 个请求中你并未发送 15 万个令牌（如果你的 TPM 限制为 15 万）。

[Batch API](https://developers.openai.com/api/reference/resources/batches/methods/create) 队列限制是根据给定模型排队的输入令牌总数计算的。挂起中的批量作业中的令牌会计入你的队列限制。一旦批量作业完成，其令牌将不再计入该模型的限制。

其他值得注意的重要事项：

- 速率限制在 [组织层级](https://developers.openai.com/api/docs/guides/production-best-practices) 以及项目层级定义，而不是用户层级。
- 速率限制因所使用的 [模型](https://developers.openai.com/api/docs/models) 而异。
- 对于 GPT-5.5 等长上下文模型，长上下文请求有单独的速率限制。你可以在 [开发者控制台](https://platform.openai.com/settings/organization/limits).
- OpenAI 为每个组织设定一个已批准的月度用量上限。这与 [支出上限](https://developers.openai.com/api/docs/guides/spend-limits) 是分开的，你可以为组织或项目配置该支出上限。
- 某些模型系列共享速率限制。在你的 [组织限制页面](https://platform.openai.com/settings/organization/limits) 中列于同一“共享限制”下的所有模型共享一个速率限制。例如，如果列出的共享 TPM 为 3.5M，则对该“共享限制”列表中任何模型的所有调用都将计入该 3.5M。
- 向量存储的写入也按每个向量存储 ID 进行速率限制。 `/vector_stores/{vector_store_id}/files` 并且 `/vector_stores/{vector_store_id}/file_batches` 每个向量存储共享每分钟 300 次请求的限制。对于较大的写入任务，建议使用 `/vector_stores/{vector_store_id}/file_batches`.

## 使用层级

你可以在账户设置的 [限制](https://platform.openai.com/settings/organization/limits) 部分查看你所在组织的速率和使用上限。随着你在我们 API 上的消费提升，我们会自动将你升级到下一使用层级，这通常会带来大多数模型速率限制的提高。

| 层级        | 资格要求                                                         | 使用限额     |
| ----------- | --------------------------------------------------------------------- | ---------------- |
| 免费        | 用户必须位于 [允许的地区](https://developers.openai.com/api/docs/supported-countries) | $100 / 月     |
| 层级&nbsp;1 | $5 充值                                                               | $100 / 月     |
| 层级&nbsp;2 | $50 充值                                                              | $500 / 月     |
| 层级&nbsp;3 | $100 充值                                                             | $1,000 / 月   |
| 层级&nbsp;4 | $250 充值                                                             | $5,000 / 月   |
| 层级&nbsp;5 | 1,000 美元（已支付）                                                           | 200,000 美元 / 月 |

若要查看每个模型的速率限制概览，请访问 [模型页面](https://developers.openai.com/api/docs/models).

### 响应头中的速率限制

除了在你的 [账户页面](https://platform.openai.com/settings/organization/limits)，中查看速率限制外，你还可以在 HTTP 响应的请求头中查看有关速率限制的重要信息，例如剩余请求数、令牌数以及其他元数据。

响应可以包含以下请求头字段：

| 字段                                | 示例值 | 说明                                                                                       |
| ------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------- |
| Retry-After                          | 56           | 在出现临时限流错误时，重试前需等待的最短秒数（如果存在）。 |
| x-ratelimit-limit-requests           | 60           | 在耗尽限流额度之前所允许的最大请求数。               |
| x-ratelimit-limit-tokens             | 150000       | 在耗尽限流额度之前所允许的最大 token 数。                 |
| x-ratelimit-remaining-requests       | 59           | 在耗尽限流额度之前所允许的剩余请求数。             |
| x-ratelimit-remaining-tokens         | 149984       | 在耗尽限流额度之前所允许的剩余 token 数。               |
| x-ratelimit-reset-requests           | 1s           | 基于请求数的速率限制重置回初始状态前剩余的时间。                    |
| x-ratelimit-reset-tokens             | 6m0s         | 基于 token 数的速率限制重置回初始状态前剩余的时间。                      |
| x-ratelimit-limit-project-tokens     | 60000        | 项目的 token 上限。                                                                  |
| x-ratelimit-remaining-project-tokens | 57000        | 在项目级 token 速率限制耗尽之前允许使用的剩余 token 数。   |
| x-ratelimit-reset-project-tokens     | 3s           | 项目级 token 速率限制重置回初始状态前剩余的时间。                   |

在项目级 token 限制适用时，可能出现项目 token 相关的响应头。 `Retry-After` 可能出现在 `429` 由临时速率限制引起的响应中。它并不意味着配额、计费或其他需要用户操作的错误可以通过重试解决。

### 微调速率限制

你所在组织的微调速率限制可在 [控制台中查看](https://platform.openai.com/settings/organization/limits)，也可以通过 API 获取：

```bash
curl https://api.openai.com/v1/fine_tuning/model_limits \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


## Error mitigation

### 处理流量激增和模型过载

API 可能会返回 `slow_down` 当你的请求速率增长过快时，或 `server_is_overloaded` 当所请求的模型暂时过载时。请检查 HTTP 状态码，并 `error.code` 以区分这两种情况：

| HTTP 状态 | 错误类型                  | 错误代码             | 含义说明                                  | 处理建议                                                                                                             |
| ----------- | --------------------------- | ---------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `429`       | `rate_limit_error`          | `slow_down`            | 请求速率增长过快。       | 遵循 `Retry-After` （如果存在）降低请求速率，然后再逐步提升。                      |
| `503`       | `service_unavailable_error` | `server_is_overloaded` | 所请求的模型暂时过载。 | 遵循 `Retry-After` （如果存在）然后重试。如果错误仍然存在，请加大重试间隔。 |

如果 `Retry-After` 错误缺失，请增加重试之间的间隔，并加入一个较小的随机延迟。

一个 `slow_down` 错误即使在你的流量未超出每分钟请求数和每分钟 token 数限制时也可能发生。它反映的是流量增长的速度，而不是你是否已耗尽这些限制。

作为经验法则，一旦你的流量达到每分钟 100 万输入 token（TPM），每 15 分钟的增长幅度不要超过 50%。斜率限制具体在何时生效，会因模型和流量状况而有所不同。

按量付费流量经常触及斜率限制的企业客户可以考虑 [Scale Tier](https://openai.com/api-scale-tier/) ，以在符合条件的模型上获得更可预期的容量。对于 GPT-5.6 及更高版本的模型，请参阅 [Reserved Tier](https://openai.com/api-reserved-tier/)。容量层级不会改变你应该如何处理 `slow_down` 响应：遵循 `Retry-After` 中的说明（如果存在），降低流量，并逐步提升。

### 我可以采取哪些步骤来缓解此问题？

OpenAI Cookbook 提供了一个 [Python notebook](https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits) ，介绍如何避免速率限制错误，并附带一个示例 [Python 脚本](https://github.com/openai/openai-cookbook/blob/main/examples/api_request_parallel_processor.py) ，演示在批量处理 API 请求时如何保持在速率限制之内。

在提供编程访问、批量处理功能以及自动社交媒体发布功能时，你也应保持谨慎——建议仅向可信的客户开放这些功能。

为防范自动化的、高流量的滥用行为，应在指定时间范围（每日、每周或每月）内为单个用户设置用量限制。可考虑为超出限制的用户设置硬性上限或人工审核流程。

#### 使用指数退避进行重试

当请求超出临时速率限制时，API 会返回 `429` 错误。响应中可以包含一个 `Retry-After` 响应头，用于告诉你重试前需要等待多少秒。请将该值视为最小值：至少等待这么长时间，并额外加上一个小的随机延时，防止多个客户端在同一时刻重试。

每个 [官方 OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) 都会自动重试符合条件的速率限制错误，并遵循 `Retry-After` 的指示（当该头部存在时）。你无需解析该头部，也无需为标准的 API 调用额外添加重试循环。

如果使用自己的 HTTP 客户端，请在 `Retry-After` 存在且包含有效值时遵循该头部。如果缺失或无效，则回退到带抖动的指数退避策略。同时限制重试次数和重试总时长。如果你在应用层添加了重试逻辑，请将 SDK 已执行的重试计入其中。不要对配额、计费或其他需要你主动处理的错误进行重试。

指数退避指在请求失败后短暂等待，并在每次重试失败后逐步延长等待时间。这一过程会持续进行，直到请求成功或达到配置的重试上限。

这种做法有许多优点：

- 自动重试意味着你可以在不发生崩溃或丢失数据的情况下从速率限制错误中恢复
- 指数退避意味着你可以快速尝试最初几次重试，同时在前几次重试失败时仍能受益于更长的延迟
- 在延迟中加入随机抖动有助于避免所有重试同时发生。

请注意，未成功的请求会计入你的每分钟限速，因此持续重发同一个请求是无效的。

以下是几个示例解决方案 **（适用于 Python）** 使用了指数退避策略。



##### 示例 1：使用 Tenacity 库



Tenacity 是一个基于 Apache 2.0 许可的通用重试库，使用 Python 编写，旨在简化为几乎任何场景添加重试行为的工作。
如果要为请求添加指数退避，可以使用 `tenacity.retry` 装饰器。下面的示例使用 `tenacity.wait_random_exponential` 函数为请求添加随机指数退避。

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


请注意，Tenacity 库是第三方工具，OpenAI 对其不做任何
可靠性或安全性方面的保证。







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


与 Tenacity 类似，backoff 库是一个第三方工具，OpenAI 不会对其可靠性或安全性做出任何保证。







##### 示例 3：手动实现指数退避


如果你不想使用第三方库，可以按照下面的示例自行实现退避逻辑：
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

同样，OpenAI 不对该方案的安全性或效率作出任何保证，但它可以作为你自己方案的良好起点。





#### 减少 `max_tokens` 以匹配你的补全大小

你的速率限制按以下两者中的较大值计算： `max_tokens` 以及根据你的请求字符数估算的 token 数。请尽量将 `max_tokens` 值设定为接近你预期的响应大小。

#### 批量请求

如果你的用例不需要立即获得响应，可以使用 [Batch API](https://developers.openai.com/api/docs/guides/batch) 更轻松地提交和执行大量请求，而不会影响你的同步请求速率限制。

对于那些 _需要_ 同步响应的用例，OpenAI API 对 **每分钟请求数** 和 **每分钟 token 数**.

如果你达到了每分钟请求数的上限，但每分钟 token 数仍有可用容量，你可以通过将多个任务合并到每个请求中来提高吞吐量。这样可以让你每分钟处理更多的 token，尤其是在使用我们较小的模型时效果更明显。

批量发送提示与普通的 API 调用完全相同，只是你需要向 prompt 参数传入一个字符串列表，而不是单个字符串。 [详细了解 Batch API 指南](https://developers.openai.com/api/docs/guides/batch).