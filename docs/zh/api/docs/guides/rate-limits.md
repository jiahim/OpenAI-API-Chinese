# 速率限制

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾添加 `.md` 来获取。

速率限制是 API 对用户或客户端在
指定时间段内访问我们服务的次数所施加的限制。

## 为什么会有速率限制？

速率限制是 API 中常见的做法，设置速率限制有多种原因：

- **它们有助于防止对 API 的滥用或误用。** 例如，恶意行为者可能向 API 发送大量请求，试图使其过载或造成服务中断。通过设置速率限制，OpenAI 可以防止此类活动。
- **速率限制有助于确保每个人都能公平地访问 API。** 如果某个个人或组织发送过多请求，可能会拖慢所有人的 API。通过对单个用户可发出的请求数量进行限流，OpenAI 能够确保尽可能多的用户有机会使用 API，而不会出现速度下降的情况。
- **速率限制可以帮助 OpenAI 管理其基础设施上的总体负载。** 如果对 API 的请求量急剧增加，可能会给服务器带来压力并导致性能问题。通过设置速率限制，OpenAI 可以帮助所有用户保持流畅且一致的体验。

请通读本文档，以便更好地了解
  OpenAI 的速率限制系统是如何运作的。我们提供了代码示例和可能的
  解决方案来处理常见问题。我们还详细说明了你的
  速率限制在下文的使用层级部分中是如何自动提升的。

## 这些速率限制是如何工作的？

速率限制使用的指标包括 **RPM** （每分钟请求数）， **RPD** （每天请求数）， **TPM** （每分钟 token 数）， **TPD** （每天 token 数）， **IPM** （每分钟图像数），以及某些流式音频模型的每分钟音频分钟数。速率限制可能在任意一项指标上触发，取决于哪个先达到。例如，你可以向 ChatCompletions 端点发送 20 个仅含 100 token 的请求，即使这 20 个请求中并未发送 150k token（假设你的 TPM 限制为 150k），也会耗尽你的限额（假设你的 RPM 为 20）。

[Batch API](https://developers.openai.com/api/reference/resources/batches/methods/create) 队列限制是根据给定模型排队的输入 token 总数计算的。待处理批量任务中的 token 将计入你的队列限制。一旦批量任务完成，其 token 将不再计入该模型的限制。

其他值得注意的重要事项：

- 速率限制在 [组织层级](https://developers.openai.com/api/docs/guides/production-best-practices) 和项目层级定义，而不是用户层级。
- 速率限制因所使用的 [模型](https://developers.openai.com/api/docs/models) 而异。
- 对于 GPT-5.5 等长上下文模型，长上下文请求有单独的速率限制。你可以在 [开发者控制台](https://platform.openai.com/settings/organization/limits).
- OpenAI 为每个组织设定一个批准的月度使用上限。这与上述速率限制是分开计算的。 [spend limits](https://developers.openai.com/api/docs/guides/spend-limits) 你可以为某个组织或项目进行配置。
- 某些模型系列共享速率限制。在你的 [组织限额页面](https://platform.openai.com/settings/organization/limits) 中，任何列在某个 "shared limit" 下的模型都共享同一速率限制。例如，如果所列共享 TPM 为 3.5M，那么对该 "shared limit" 列表中任一模型的所有调用都将计入这 3.5M。
- 向量存储的写入也按每个向量存储 ID 进行速率限制。 `/vector_stores/{vector_store_id}/files` 和 `/vector_stores/{vector_store_id}/file_batches` 共享每个向量存储每分钟 300 次请求的限制。对于更大的写入任务，推荐使用 `/vector_stores/{vector_store_id}/file_batches`.

## 使用层级

三个付费使用层级为 **Build**, **Launch**，和 **Grow**。当你的组织的累计信用额购买达到相应阈值时，使用层级会自动升级。更高的层级通常会提供跨模型更高的速率限制。

| 等级   | 资格条件                                                         | 用量限制     |
| ------ | --------------------------------------------------------------------- | ---------------- |
| 免费   | 用户必须位于 [允许的地区](https://developers.openai.com/api/docs/supported-countries) | 100 美元 / 月     |
| Build  | 累计充值 5 美元                                          | 500 美元 / 月     |
| Launch | 累计充值 100 美元                                        | 5,000 美元 / 月   |
| Grow   | 累计充值 500 美元                                        | 200,000 美元 / 月 |

### Standard rate limits

要查看你所在使用层级的每个模型的限制，请前往 [Settings > Organization > Limits](https://platform.openai.com/settings/organization/limits) 并查看 **速率限制**。要升级你的使用层级，请选择 **升级层级** 在 **Usage Tiers** 部分中。

这些 Standard 速率限制不同于 [Ultrafast rate limits](https://developers.openai.com/api/docs/guides/ultrafast-mode#availability).

<table className="[&_th]:border-b [&_th]:border-[var(--tw-prose-th-borders)] [&_th]:py-3 [&_th]:pl-0 [&_th]:pr-4 [&_th]:text-left [&_td]:border-b [&_td]:border-[var(--tw-prose-td-borders)] [&_td]:py-2 [&_td]:pl-0 [&_td]:pr-4 [&_td]:text-left [&_td]:align-top">
  <thead>
    <tr>
      <th scope="col">Tier</th>
      <th scope="col">Model</th>
      <th scope="col">RPM</th>
      <th scope="col">TPM</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowSpan="2">Build</td>
      <td>Astra, Sol, Terra</td>
      <td>5,000</td>
      <td>1,000,000</td>
    </tr>
    <tr>
      <td>Luna</td>
      <td>5,000</td>
      <td>2,000,000</td>
    </tr>
    <tr>
      <td rowSpan="2">Launch</td>
      <td>Astra, Sol, Terra</td>
      <td>10,000</td>
      <td>4,000,000</td>
    </tr>
    <tr>
      <td>Luna</td>
      <td>10,000</td>
      <td>10,000,000</td>
    </tr>
    <tr>
      <td rowSpan="2">Grow</td>
      <td>Astra, Sol, Terra</td>
      <td>15,000</td>
      <td>40,000,000</td>
    </tr>
    <tr>
      <td>Luna</td>
      <td>30,000</td>
      <td>180,000,000</td>
    </tr>
  </tbody>
</table>

### 支出限额

考虑设置 [**支出限额**](https://developers.openai.com/api/docs/guides/spend-limits) 来为你的组织或项目控制每月 API 支出。这些控制与上文每月的使用限额是分开的。

| 控制                                                                          | 达到配置金额时的处理方式       | 适用场景                       |
| -------------------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------- |
| [支出提醒](https://developers.openai.com/api/docs/guides/spend-limits#spend-alerts)                        | 发送通知；API 流量继续运行 | 在不影响流量的前提下跟踪支出      |
| [硬性支出上限](https://developers.openai.com/api/docs/guides/spend-limits#understand-hard-limit-behavior) | 受影响的 API 请求会返回 `429` 错误  | 对组织或项目设置月度上限 |

### 请求头中的速率限制

除了在你的 [账户页面](https://platform.openai.com/settings/organization/limits)，中查看你的速率限制外，你还可以在 HTTP 响应的头部中查看有关速率限制的重要信息，例如剩余的请求数、令牌数以及其他元数据。

响应可以包含以下头部字段：

| 字段                                | 示例值 | 说明                                                                                       |
| ------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------- |
| Retry-After                          | 56           | 出现临时速率限制错误时，重试前需要等待的最短秒数。 |
| x-ratelimit-limit-requests           | 60           | 在达到速率上限之前允许的最大请求数。               |
| x-ratelimit-limit-tokens             | 150000       | 在达到速率上限之前允许的最大 token 数。                 |
| x-ratelimit-remaining-requests       | 59           | 在达到速率上限之前允许的剩余请求数。             |
| x-ratelimit-remaining-tokens         | 149984       | 在达到速率上限之前允许的剩余 token 数。               |
| x-ratelimit-reset-requests           | 1s           | 基于请求数的速率限制重置为初始状态前的剩余时间。                    |
| x-ratelimit-reset-tokens             | 6m0s         | 基于 token 数的速率限制重置为初始状态前的剩余时间。                      |
| x-ratelimit-limit-project-tokens     | 60000        | 项目的 token 限制。                                                                  |
| x-ratelimit-remaining-project-tokens | 57000        | 在项目级 token 速率限制耗尽之前允许使用的剩余 token 数。   |
| x-ratelimit-reset-project-tokens     | 3s           | 项目级 token 速率限制重置为初始状态前的剩余时间。                   |

当存在项目级令牌额度限制时，可能会出现项目级令牌头。 `Retry-After` 可能出现在 `429` 因临时速率限制而产生的响应以及 `503` 因临时模型过载而产生的响应上。它并不意味着配额、计费或其他需要用户操作的错误可以通过重试来解决。

### 微调速率限制

你所在组织的微调速率限制可在 [仪表板中找到](https://platform.openai.com/settings/organization/limits)，也可以通过 API 获取：

```bash
curl https://api.openai.com/v1/fine_tuning/model_limits \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


## Error mitigation

### 处理流量激增和模型过载

API 可能会返回 `slow_down` 当你的请求速率增加过快时，或者 `server_is_overloaded` 当所请求的模型暂时过载时。请检查 HTTP 状态码以及 `error.code` 以区分这两种情况：

| HTTP 状态 | 错误类型                  | 错误代码             | 含义说明                                  | 处理建议                                                                                                             |
| ----------- | --------------------------- | ---------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `429`       | `rate_limit_error`          | `slow_down`            | 你的请求速率增长过快。       | 参考 `Retry-After` 字段（如有）降低请求速率，然后逐步提升。                      |
| `503`       | `service_unavailable_error` | `server_is_overloaded` | 所请求的模型暂时过载。 | 参考 `Retry-After` 字段（如有），然后重试。如果错误持续出现，请逐步增大重试间隔。 |

如果 `Retry-After` 缺失，请增加重试之间的延迟，并加入一个较小的随机延迟。

一个 `slow_down` 错误即使在你的流量处于每分钟请求数和每分钟 token 数限制范围内时也可能出现。它反映的是流量增长的速度，而不是你是否已用尽这些限制。

作为经验法则，一旦你的流量达到每分钟 100 万输入 token（TPM），每 15 分钟的增幅不要超过 50%。具体的 ramp-rate 限制触发点会因模型和流量情况而异。

按量付费流量经常触及 ramp-rate 限制的企业客户可以考虑 [Scale Tier](https://openai.com/api-scale-tier/) ，以便在符合条件的模型上获得更可预期的容量。对于 GPT-5.6 及更高版本的模型，请参阅 [Reserved Tier](https://openai.com/api-reserved-tier/)。容量层级不会改变你应该如何处理 `slow_down` 响应：在其出现时遵循 `Retry-After` ，降低流量并逐步增加。

#### Update existing error handlers

如果你的应用之前处理过限流和过载响应，请同时检查 HTTP 状态码与 `error.code`:

- 在原先会返回 `503` 的接口上， `slow_down` 针对这两种情况返回相同的状态码，流量激增时现在会返回 `429` ，并附带 `slow_down`。模型过载仍然返回 `503` ，但会使用 `server_is_overloaded`.
- 在创建任务之前被拒绝的视频请求原先会返回 `429` 的接口上， `invalid_request_error` 类型以及 `rate_limit_exceeded` 针对这些情况返回相同的状态码。流量激增时现在会返回 `429` ，并附带 `rate_limit_error` 和 `slow_down`；模型过载时返回 `503` ，并附带 `service_unavailable_error` 和 `server_is_overloaded`。视频任务状态中上报的错误是另一种情况。

同时处理 `429` 和 `503` 于你的 SDK 错误处理程序中。例如，Python、TypeScript 和 Ruby 使用 `RateLimitError` 来 `429` 和 `InternalServerError` 来 `503`；Java 使用 `RateLimitException` 和 `InternalServerException`。在你的应用仍可能收到旧版响应码时，保留对这些旧版响应码的支持。其他错误可能使用相同的 HTTP 状态码，因此在选择恢复操作前请检查错误体内容。

对于流式请求，这些 HTTP 错误响应会在流开始之前生效。流开始后产生的错误可能会作为流事件到达；在已消费输出后请勿自动重放请求。

### 我可以采取哪些措施来缓解此问题？

OpenAI Cookbook 提供了一个 [Python notebook](https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits) 其中介绍了如何避免速率限制错误，并附带一个示例 [Python script](https://github.com/openai/openai-cookbook/blob/main/examples/api_request_parallel_processor.py) 演示如何在批量处理 API 请求时保持在速率限制之内。

在提供编程访问、批量处理功能以及自动化社交媒体发布时，你也应格外谨慎——建议仅对受信任的客户启用这些功能。

为防止自动化的高频滥用，你可以在指定的时间范围内（每日、每周或每月）为单个用户设置使用上限。对于超出限制的用户，可考虑实施硬性上限或人工审核流程。

#### 使用指数退避进行重试

当请求超出临时速率限制时，API 会返回 `429` 错误。响应中可以包含一个 `Retry-After` 响应头，告诉你需要等待多少秒后才能重试。将该值视为最小值：至少等待这么久，并额外增加一个小的随机延迟，以免多个客户端同时重试。

每个 [官方 OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) 根据其重试设置自动重试符合条件的 `429` 和 `503` 响应。对 `Retry-After`，的处理（尤其是较长的延迟）会因 SDK 版本和配置而异。请检查你所安装版本的重试行为，而不是假设所有服务端延迟都受支持。

如果有效的服务端延迟超过所支持或配置的最大重试延迟，请停止重试并推迟请求，不要更早重试。当 SDK 拒绝超出其上限的延迟时，会返回原始 HTTP 错误。继续单独处理取消和超时错误：已取消的请求或已过期的截止时间可以在不返回该 HTTP 错误的情况下停止重试。每次尝试的超时并不一定是整个操作的截止时间。

如果你使用自己的 HTTP 客户端，请在 `Retry-After` 响应头存在且值有效时遵循它。如果缺失或无效，则退回到带抖动的指数退避。同时限制重试次数和重试总耗时。如果你在应用中管理重试，请禁用 SDK 重试或在相应限制中将其考虑在内，避免嵌套重试循环使请求翻倍。不要重试配额、计费或其他需要你采取操作的错误。

指数退避是指在一次失败的请求后短暂等待，然后在每次失败的重试后逐步延长延迟，直到请求成功或达到配置的重试上限。

这种方式有许多优点：

- 自动重试意味着你可以在不崩溃或不丢失数据的情况下从速率限制错误中恢复
- 指数退避意味着你可以快速尝试前几次重试，同时在前几次重试失败时仍能受益于更长的延迟
- 在延迟中加入随机抖动有助于避免所有重试同时发生。

请注意，未成功的请求会计入你的每分钟速率限制，因此持续重新发送同一请求是无效的。

下面的旧版 Completions 示例使用了 `gpt-3.5-turbo-instruct`，它有一个 [计划于 2026-09-28 下线](https://developers.openai.com/api/docs/deprecations#2025-09-26-legacy-gpt-model-snapshots)。该日期之后，请保留重试模式，但将请求迁移到 [Responses 或 Chat Completions](https://developers.openai.com/api/docs/guides/migrate-to-responses) 使用 `gpt-5.6-terra`；仅修改 Completions 请求中的模型 ID 并不足够。

下面的 Python 示例演示了回退退避。它们不会检查 `Retry-After`：在使用前，请添加对有效服务端提示的处理，以避免包装器比请求的间隔更早重试。禁用 SDK 重试，或在应用程序的重试限制中将它们考虑在内。



##### 示例 1：使用 Tenacity 库



Tenacity 是一个基于 Apache 2.0 许可的通用重试库，使用 Python 编写，旨在简化为几乎任何任务添加重试行为的工作。
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


请注意，Tenacity 库是一个第三方工具，OpenAI 不对其可靠性或安全性作任何保证
。







##### 示例 2：使用 backoff 库



另一个提供用于退避和重试的函数装饰器的 python 库是 [backoff](https://pypi.org/project/backoff/):

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


如果你不想使用第三方库，可以参考以下示例自行实现退避逻辑：
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

同样地，OpenAI 不对该方案的安全性或效率作任何保证，但它可以作为你构建自有方案的良好起点。





#### Reduce the `max_tokens` to match the size of your completions

你的速率限制按以下两者中的较大值计算： `max_tokens` 以及根据你请求的字符数估算的令牌数。请尽量将 `max_tokens` 值设置得尽可能接近你预期的响应大小。

#### 批量请求

如果你的用例不需要立即获得响应，可以使用 [Batch API](https://developers.openai.com/api/docs/guides/batch) 来提交和执行大批量请求，而不会影响你的同步请求速率限制。

对于 _需要_ 同步响应的用例，OpenAI API 对 **每分钟请求数** 和 **每分钟 token 数**.

如果每分钟请求数已达上限，但每分钟 token 数仍有可用容量，你可以通过在每个请求中批处理多个任务来提高吞吐量。这将允许你每分钟处理更多 token，尤其是在使用我们较小模型时效果更明显。

批量发送提示的调用方式与普通的 API 调用完全相同，只是你需要向 prompt 参数传入一个字符串列表，而不是单个字符串。 [在 Batch API 指南中了解更多信息](https://developers.openai.com/api/docs/guides/batch).