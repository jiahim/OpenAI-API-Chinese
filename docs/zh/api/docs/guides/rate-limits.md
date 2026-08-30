# 速率限制

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

速率限制是我们对 API 所施加的限制，用于约束用户或客户端在特定时间段内可以
访问我们服务的次数。

## 为什么会有速率限制？

速率限制是 API 的常见做法，设置速率限制有以下几个原因：

- **它们有助于防止对 API 的滥用或误用。** 例如，恶意行为者可能向 API 发送大量请求，试图使其过载或造成服务中断。通过设置速率限制，OpenAI 可以阻止此类活动。
- **速率限制有助于确保每个人都能公平地访问 API。** 如果某个人或组织发送过多请求，可能会拖慢 API，影响其他所有人。通过限制单个用户可发送的请求数量，OpenAI 能够确保尽可能多的人在不会遇到速度下降的情况下使用 API。
- **速率限制可以帮助 OpenAI 管理其基础设施上的总体负载。** 如果对 API 的请求量大幅增加，可能会给服务器带来压力并引发性能问题。通过设置速率限制，OpenAI 可以帮助所有用户维持流畅且一致的体验。

请通读整篇文档，以便更好地了解
  OpenAI 的速率限制系统是如何运作的。我们提供了代码示例以及处理常见问题的
  解决方案。我们还详细介绍了在使用层级（usage tiers）部分中，你的
  速率限制是如何自动提升的。

## 这些速率限制是如何工作的？

速率限制使用诸如 **RPM** （每分钟请求数）、 **RPD** （每天请求数）、 **TPM** （每分钟 token 数）、 **TPD** （每天 token 数）、 **IPM** （每分钟图像数）以及部分流式音频模型的每分钟音频分钟数等指标。速率限制可能在任意一项上达到上限，取决于哪个先触发。例如，你可能向 ChatCompletions 端点发送 20 个仅包含 100 token 的请求，即使你在这 20 个请求中并未发送 150k token（如果你的 TPM 上限是 150k），也会耗尽你的配额（如果你的 RPM 是 20）。

[批量 API](https://developers.openai.com/api/reference/resources/batches/methods/create) 队列限制是根据给定模型队列中输入 token 的总数计算的。待处理批量作业的 token 会计入你的队列限制。批量作业完成后，其 token 将不再计入该模型的限制。

其他值得注意的重要事项：

- 速率限制在 [组织层级](https://developers.openai.com/api/docs/guides/production-best-practices) 以及项目层级定义，而不是用户层级。
- 速率限制因 [模型](https://developers.openai.com/api/docs/models) 而异。
- 对于像 GPT-5.5 这样的长上下文模型，长上下文请求有单独的速率限制。你可以在 [开发者控制台](https://platform.openai.com/settings/organization/limits).
- OpenAI 为每个组织设置一个已批准的每月使用上限。这与 [支出上限](https://developers.openai.com/api/docs/guides/spend-limits) 是分开的，你可以为组织或项目配置支出上限。
- 一些模型系列共享速率限制。在你的 [组织限制页面](https://platform.openai.com/settings/organization/limits) 中列于同一“共享限制”下的任何模型共享该速率限制。例如，如果列出的共享 TPM 为 3.5M，则对该“共享限制”列表中任何模型的所有调用都将计入该 3.5M。
- 向量存储的数据写入也按向量存储 ID 进行速率限制。 `/vector_stores/{vector_store_id}/files` 以及 `/vector_stores/{vector_store_id}/file_batches` 每个向量存储共享每分钟 300 次请求的限制。对于较大的数据写入，建议使用 `/vector_stores/{vector_store_id}/file_batches`.

## 使用层级

你可以在账户设置中的 [限额](https://platform.openai.com/settings/organization/limits) 部分查看你所在组织的速率和使用上限。随着你在 API 上的支出增加，我们会自动将你升级到下一个使用层级。这通常会提高大多数模型的速率上限。

| 层级        | 资格条件                                                         | 使用限额     |
| ----------- | --------------------------------------------------------------------- | ---------------- |
| 免费        | 用户必须位于 [允许的地区](https://developers.openai.com/api/docs/supported-countries) | $100 / 月     |
| 层级&nbsp;1 | 已支付 $5                                                               | $100 / 月     |
| 层级&nbsp;2 | 已支付 $50                                                              | $500 / 月     |
| 层级&nbsp;3 | 已支付 $100                                                             | $1,000 / 月   |
| 层级&nbsp;4 | 已支付 $250                                                             | $5,000 / 月   |
| 层级&nbsp;5 | $1,000 paid                                                           | $200,000 / 月 |

若需查看每个模型的速率限制概览，请访问 [models 页面](https://developers.openai.com/api/docs/models).

### 响应头中的速率限制

除了可以在你的 [账户页面](https://platform.openai.com/settings/organization/limits)，中查看速率限制外，你还可以在 HTTP 响应的标头中查看有关速率限制的重要信息，例如剩余的请求数、令牌数以及其他元数据。

响应中可以包含以下标头字段：

| 字段                                | 示例值 | 说明                                                                                       |
| ------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------- |
| Retry-After                          | 56           | 临时速率限制错误重试前需等待的最短秒数（如有）。 |
| x-ratelimit-limit-requests           | 60           | 在耗尽速率限制之前允许的最大请求数。               |
| x-ratelimit-limit-tokens             | 150000       | 在耗尽速率限制之前允许的最大 token 数。                 |
| x-ratelimit-remaining-requests       | 59           | 在耗尽速率限制之前允许的剩余请求数。             |
| x-ratelimit-remaining-tokens         | 149984       | 在耗尽速率限制之前允许的剩余 token 数。               |
| x-ratelimit-reset-requests           | 1s           | 基于请求数的速率限制重置到初始状态所剩余的时间。                    |
| x-ratelimit-reset-tokens             | 6m0s         | 基于 token 数的速率限制重置到初始状态所剩余的时间。                      |
| x-ratelimit-limit-project-tokens     | 60000        | 项目的 token 限制。                                                                  |
| x-ratelimit-remaining-project-tokens | 57000        | 在耗尽项目范围的 token 速率限制之前，允许剩余的 token 数量。   |
| x-ratelimit-reset-project-tokens     | 3s           | 项目范围的 token 速率限制重置到初始状态所剩余的时间。                   |

当存在项目级令牌限制时，响应中可能会出现 Project-token 头。 `Retry-After` 可能会出现在 `429` 因临时速率限制而引起的响应上。这并不表示配额、计费或其他需要用户操作的错误可以通过重试来解决。

### 微调速率限制

你的组织的微调速率限制可在 [控制台中找到](https://platform.openai.com/settings/organization/limits)，也可以通过 API 获取：

```bash
curl https://api.openai.com/v1/fine_tuning/model_limits \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


## 错误缓解

### 我可以采取哪些步骤来缓解此问题？

OpenAI Cookbook 中有一个 [Python notebook](https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits) 详细解释了如何避免速率限制错误，同时还提供了一个示例 [Python script](https://github.com/openai/openai-cookbook/blob/main/examples/api_request_parallel_processor.py) ，演示在批量处理 API 请求时如何保持在速率限制之内。

在提供编程访问、批量处理功能以及自动化社交媒体发布功能时，你也应保持谨慎——建议仅向可信用户开放这些功能。

为防止自动化的高频滥用，你应在指定的时间范围（每日、每周或每月）内为单个用户设置使用上限。对于超出限制的用户，可以考虑实施硬性上限或人工审核流程。

#### 使用指数退避重试

当请求超过临时速率限制时，API 会返回 `429` 错误。响应可以包含一个 `Retry-After` 响应头，告诉你需要等待多少秒后再重试。请将此值视为最小值：至少等待这么久，并增加一个较小的随机延迟，以免多个客户端同时重试。

每个 [官方 OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) 会自动重试符合条件的速率限制错误，并在 `Retry-After` 存在时遵守其值。无需为标准的 API 调用解析该响应头或再添加重试循环。

如果你使用自己的 HTTP 客户端，请在 `Retry-After` 响应头存在且包含有效值时遵循它。如果响应头缺失或无效，则回退到带有抖动的指数退避。同时限制重试次数和重试总耗时。如果添加了应用层重试，请将 SDK 已执行的重试计算在内。不要重试配额、计费或其他需要你采取操作的错误。

指数退避是指在一次失败的请求后短暂等待，然后在每次失败重试后增加延迟。该过程会一直持续，直到请求成功或达到配置的重试上限。

此方法有许多优点：

- 自动重试意味着你可以在不发生崩溃或丢失数据的情况下，从限流错误中恢复
- 指数退避意味着你可以较快地尝试最初几次重试，同时在前几次失败时仍能从较长的延迟中受益
- 在延迟中加入随机抖动可以避免所有重试在同一时刻发生。

请注意，未成功的请求会计入你的每分钟限额，因此持续重新发送请求是无效的。

下面是几个示例方案 **针对 Python** 它们使用了指数退避。



##### 示例 1：使用 Tenacity 库



Tenacity 是一个采用 Apache 2.0 许可的通用重试库，使用 Python 编写，旨在简化向几乎任意对象添加重试行为的任务。
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


请注意，Tenacity 库是第三方工具，OpenAI 不对其
可靠性或安全性作任何保证。







##### 示例 2：使用 backoff 库



另一个提供函数装饰器用于回退和重试的 Python 库是 [backoff](https://pypi.org/project/backoff/):

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


与 Tenacity 一样，backoff 库是第三方工具，OpenAI 不对其可靠性或安全性作出任何保证。







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

同样地，OpenAI 不对该方案的安全性或效率作任何保证，但它可以作为你自己方案的良好起点。





#### Reduce the `max_tokens` to match the size of your completions

你的速率上限按以下两项中的较大值计算： `max_tokens` 以及根据请求字符数估算的 token 数。请尽量将 `max_tokens` 值设置得接近你预期的响应大小。

#### Batching requests

如果你的用例不需要立即获得响应，你可以使用 [批量 API](https://developers.openai.com/api/docs/guides/batch) 来更轻松地提交和执行大量请求，且不会影响你的同步请求速率限制。

对于需要 _同步_ 响应的用例，OpenAI API 对以下指标有单独的速率限制： **每分钟请求数** 和 **每分钟 token 数**.

如果你遇到了每分钟请求数的限制，但每分钟 token 数仍有可用容量，你可以通过将多个任务打包到每个请求中来提高吞吐量。这样你就可以处理更多的每分钟 token，尤其是在使用我们较小的模型时。

发送一批提示与普通的 API 调用完全相同，只是你需要向 prompt 参数传入一个字符串列表，而不是单个字符串。 [在 Batch API 指南中了解更多信息](https://developers.openai.com/api/docs/guides/batch).