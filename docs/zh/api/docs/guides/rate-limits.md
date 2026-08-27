# 速率限制

> 完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

速率限制是API对用户或客户端在指定时间段内可以
访问我们服务的次数所施加的限制。

## 为什么我们设有速率限制？

速率限制是API的一种常见做法，其出台基于几个不同的原因：

- **它们有助于防范对 API 的滥用或误用。** 例如，恶意行为者可能向 API 发送大量请求，试图使其过载或造成服务中断。通过设置速率限制，OpenAI 可以防止此类行为。
- **速率限制有助于确保每个人都能公平访问 API。** 如果一个人或组织发送过多请求，可能会拖慢 API 对其他所有用户的速度。通过限制单个用户可发出的请求数量，OpenAI 确保尽可能多的人有机会使用 API 而不会遇到速度下降。
- **速率限制可以帮助OpenAI管理其基础设施上的总负载。** 如果对API的请求急剧增加，可能会给服务器带来负担并导致性能问题。通过设置速率限制，OpenAI 可以帮助所有用户维持顺畅一致的体验。

请完整阅读本文档，以更好地理解
  OpenAI的速率限制系统是如何运作的。我们提供了代码示例和可能的
  解决方案，以处理常见问题。我们还在下面的使用层级部分详细说明了你的
  速率限制是如何自动提升的。

## 这些速率限制是如何运作的？

速率限制使用指标，例如 **RPM** （每分钟请求数）， **RPD** （每天请求数）， **TPM** （每分钟令牌数）， **TPD** （每天令牌数）， **IPM** （每分钟图像数），以及某些流式音频模型的每分钟音频分钟数。速率限制可能因首先达到的选项而被触发。例如，你可能会向 ChatCompletions 端点发送 20 个仅包含 100 个令牌的请求，即使这 20 个请求未发送 150k 个令牌（如果你的 TPM 限制为 150k），也会达到你的限制（如果你的 RPM 为 20）。

[Batch API](https://developers.openai.com/api/reference/resources/batches/methods/create) 队列限制根据给定模型排队的输入令牌总数计算。待处理批次作业中的令牌计入你的队列限制。一旦批次作业完成，其令牌不再计入该模型的限制。

其他值得注意的重要事项：

- 速率限制定义在 [组织级别](https://developers.openai.com/api/docs/guides/production-best-practices) 和项目级别，而非用户级别。
- 速率限制根据所使用的 [模型](https://developers.openai.com/api/docs/models) 而变化。
- 对于像 GPT-5.5 这样的长上下文模型，长上下文请求有单独的速率限制。你可以在 [开发者控制台](https://platform.openai.com/settings/organization/limits).
- OpenAI 为每个组织设定了经批准的月度用量限制。这与 [支出限制](https://developers.openai.com/api/docs/guides/spend-limits) 是分开的，后者你可以为组织或项目配置。
- 某些模型系列具有共享速率限制。在你的 [组织限制页面](https://platform.openai.com/settings/organization/limits) 上列在“共享限制”下的任何模型之间共享速率限制。例如，如果列出的共享 TPM 为 3.5M，则对给定“共享限制”列表中任何模型的所有调用都将计入该 3.5M。
- 向量存储摄取也按向量存储 ID 进行速率限制。 `/vector_stores/{vector_store_id}/files` 和 `/vector_stores/{vector_store_id}/file_batches` 每个向量存储共享每分钟 300 次请求的限制。对于较大的摄取，建议使用 `/vector_stores/{vector_store_id}/file_batches`.

## 使用层级

你可以在你的账户设置的 [limits](https://platform.openai.com/settings/organization/limits) 部分查看你所在组织的速率与用量限制。随着你在我们 API 上的支出增加，我们会自动将你升级到下一个用量层级。这通常会提高大多数模型的速率限制。

| 层级        | 资格                                                         | 使用限制     |
| ----------- | --------------------------------------------------------------------- | ---------------- |
| 免费        | 用户必须位于 [允许的地理区域](https://developers.openai.com/api/docs/supported-countries) | $100 / 月     |
| 层级&nbsp;1 | 已付费 $5                                                               | $100 / 月     |
| 层级&nbsp;2 | 已付费 $50                                                              | $500 / 月     |
| 层级&nbsp;3 | 已付费 $100                                                             | $1,000 / 月   |
| 层级&nbsp;4 | 已付费 $250                                                             | $5,000 / 月   |
| 层级&nbsp;5 | 已支付 1,000 美元                                                           | 每月 200,000 美元 |

如需查看每个模型速率限制的高级摘要，请访问 [模型页面](https://developers.openai.com/api/docs/models).

### 标头中的速率限制

除了在 [账户页面](https://platform.openai.com/settings/organization/limits)，查看速率限制之外，你还可以在 HTTP 响应头中查看关于速率限制的重要信息，例如剩余请求数、令牌数及其他元数据。

响应可以包含以下响应头字段：

| 字段                                | 示例值 | 描述                                                                                       |
| ------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------- |
| Retry-After                          | 56           | 出现临时速率限制错误时，重试前需等待的最少秒数（若存在）。 |
| x-ratelimit-limit-requests           | 60           | 在耗尽速率限制前允许的最大请求数。               |
| x-ratelimit-limit-tokens             | 150000       | 在耗尽速率限制前允许的最大令牌数。                 |
| x-ratelimit-remaining-requests       | 59           | 在耗尽速率限制前剩余允许的请求数。             |
| x-ratelimit-remaining-tokens         | 149984       | 在耗尽速率限制前剩余允许的令牌数。               |
| x-ratelimit-reset-requests           | 1s           | 基于请求的速率限制重置到初始状态所需的时间。                    |
| x-ratelimit-reset-tokens             | 6m0s         | 基于令牌的速率限制重置到初始状态所需的时间。                      |
| x-ratelimit-limit-project-tokens     | 60000        | 项目的令牌限制。                                                                  |
| x-ratelimit-remaining-project-tokens | 57000        | 在耗尽项目范围的令牌速率限制之前，允许的剩余令牌数。   |
| x-ratelimit-reset-project-tokens     | 3s           | 项目范围的令牌速率限制重置到初始状态所需的时间。                   |

当适用项目级令牌限制时，可能会存在项目令牌请求头。 `Retry-After` 可能出现在 `429` 因临时速率限制导致的响应上。这并不意味着可以通过重试解决配额、计费或其他需要用户操作的问题。

### 微调速率限制

你所在组织的微调速率限制可以在 [仪表盘中查看](https://platform.openai.com/settings/organization/limits)，也可以通过 API 获取：

```bash
curl https://api.openai.com/v1/fine_tuning/model_limits \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


## 错误缓解

### 我可以采取哪些步骤来缓解此问题？

OpenAI Cookbook 提供了一个 [Python 笔记本](https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits) ，其中解释了如何避免速率限制错误，以及一个示例 [Python 脚本](https://github.com/openai/openai-cookbook/blob/main/examples/api_request_parallel_processor.py) ，用于在批量处理 API 请求时保持在速率限制之内。

在提供程序化访问、批量处理功能和自动化社交媒体发布时，你也应保持谨慎——考虑仅对受信任的客户启用这些功能。

为防止自动化和高频率的滥用，请在指定时间范围（每日、每周或每月）内为个人用户设置用量限制。考虑对超出限制的用户实施硬上限或人工审核流程。

#### 使用指数退避重试

当请求超过临时速率限制时，API 会返回 `429` 错误。响应中可以包含一个 `Retry-After` 标头，告诉你需要等待多少秒后再重试。请将此值视为最小值：至少等待那么长时间，并添加一个小的随机延迟，以避免多个客户端同时重试。

每个 [官方 OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) 都会自动重试符合条件的速率限制错误，并在标头存在时予以遵循 `Retry-After` 。对于标准的 API 调用，你无需解析该标头，也无需再添加重试循环。

如果你使用自己的 HTTP 客户端，请在以下情况下遵循 `Retry-After` 该标头：当标头存在且包含有效值时。如果标头缺失或无效，则回退到带抖动的指数退避策略。限制重试次数和重试的总耗时。如果添加应用层重试，需考虑 SDK 已执行的重试。不要重试配额、计费或其他需要你采取行动的错误。

指数退避意味着在请求失败后短暂等待，然后每次重试失败后增加延迟时间。此过程持续到请求成功或达到配置的重试限制为止。

这种方法有很多好处：

- 自动重试意味着你可以在不崩溃或丢失数据的情况下从速率限制错误中恢复
- 指数退避意味着你的前几次重试可以快速尝试，同时如果前几次重试失败，仍能受益于更长的延迟
- 在延迟中添加随机抖动有助于避免所有重试同时发生。

请注意，不成功的请求会计入你的每分钟限额，因此持续重新发送请求将不会奏效。

以下是一些示例解决方案 **针对 Python** 使用指数退避。



##### 示例 1：使用 Tenacity 库



Tenacity 是一个基于 Apache 2.0 许可的通用重试库，使用 Python 编写，旨在简化向几乎任何内容添加重试行为的任务。
要为你的请求添加指数退避，可以使用 `tenacity.retry` 装饰器。以下示例使用 `tenacity.wait_random_exponential` 函数为请求添加随机指数退避。

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
可靠性或安全性做任何保证。







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


与 Tenacity 类似，backoff 库是一个第三方工具，OpenAI 对其可靠性或安全性不作任何保证。







##### 示例 3：手动退避实现


如果你不想使用第三方库，可以参考以下示例实现自己的退避逻辑：
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

再次强调，OpenAI 对此解决方案的安全性或效率不作任何保证，但它可以为你自己的解决方案提供一个良好的起点。





#### 缩减 `max_tokens` 以匹配你的补全输出的大小

你的速率限制按以下两者的最大值计算： `max_tokens` 以及根据请求字符数估算的令牌数。请尽量将 `max_tokens` 值设定为接近你预期的响应大小。

#### 批量请求

如果你的使用场景不需要即时响应，你可以使用 [Batch API](https://developers.openai.com/api/docs/guides/batch) 来更轻松地提交和执行大量请求，而不会影响你的同步请求速率限制。

对于需要 _同步_ 响应的使用场景，OpenAI API 分别设有 **每分钟请求数** 和 **每分钟令牌数**.

的独立限制。如果你在每分钟请求数上达到上限，但在每分钟令牌数上仍有可用容量，你可以通过将多个任务合并到每个请求中来提高吞吐量。这将允许你每分钟处理更多令牌，尤其是使用我们较小的模型时。

发送一批提示词与正常的 API 调用完全相同，只是你在 prompt 参数中传入一个字符串列表，而不是单个字符串。 [在 Batch API 指南中了解更多](https://developers.openai.com/api/docs/guides/batch).