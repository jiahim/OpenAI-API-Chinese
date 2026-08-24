# Rate limits

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Rate limits are restrictions that our API imposes on the number of times a user or client can
access our services within a specified period of time.

## Why do we have rate limits?

Rate limits are a common practice for APIs, and they're put in place for a few different reasons:

- **They help protect against abuse or misuse of the API.** For example, a malicious actor could flood the API with requests in an attempt to overload it or cause disruptions in service. By setting rate limits, OpenAI can prevent this kind of activity.
- **Rate limits help ensure that everyone has fair access to the API.** If one person or organization makes an excessive number of requests, it could bog down the API for everyone else. By throttling the number of requests that a single user can make, OpenAI ensures that the most number of people have an opportunity to use the API without experiencing slowdowns.
- **Rate limits can help OpenAI manage the aggregate load on its infrastructure.** If requests to the API increase dramatically, it could tax the servers and cause performance issues. By setting rate limits, OpenAI can help maintain a smooth and consistent experience for all users.

Please work through this document in its entirety to better understand how
  OpenAI’s rate limit system works. We include code examples and possible
  solutions to handle common issues. We also include details around how your
  rate limits are automatically increased in the usage tiers section below.

## How do these rate limits work?

Rate limits use metrics such as **RPM** (requests per minute), **RPD** (requests per day), **TPM** (tokens per minute), **TPD** (tokens per day), **IPM** (images per minute), and audio minutes per minute for some streaming audio models. Rate limits can be hit across any of the options depending on what occurs first. For example, you might send 20 requests with only 100 tokens to the ChatCompletions endpoint and that would fill your limit (if your RPM was 20), even if you didn't send 150k tokens (if your TPM limit was 150k) within those 20 requests.

[Batch API](https://developers.openai.com/api/reference/resources/batches/methods/create) queue limits are calculated based on the total number of input tokens queued for a given model. Tokens from pending batch jobs are counted against your queue limit. Once a batch job is completed, its tokens are no longer counted against that model's limit.

Other important things worth noting:

- Rate limits are defined at the [organization level](https://developers.openai.com/api/docs/guides/production-best-practices) and at the project level, not user level.
- Rate limits vary by the [model](https://developers.openai.com/api/docs/models) being used.
- For long context models like GPT-5.5, there is a separate rate limit for long context requests. You can view these rate limits in [developer console](https://platform.openai.com/settings/organization/limits).
- OpenAI sets an approved monthly usage limit for each organization. This is separate from the [spend limits](https://developers.openai.com/api/docs/guides/spend-limits) that you can configure for an organization or project.
- Some model families have shared rate limits. Any models listed under a "shared limit" in your [organizations limit page](https://platform.openai.com/settings/organization/limits) share a rate limit between them. For example, if the listed shared TPM is 3.5M, all calls to any model in the given "shared limit" list will count towards that 3.5M.
- Vector store ingestion is also rate limited per vector store ID. `/vector_stores/{vector_store_id}/files` and `/vector_stores/{vector_store_id}/file_batches` share a limit of 300 requests per minute for each vector store. For larger ingests, prefer `/vector_stores/{vector_store_id}/file_batches`.

## Usage tiers

You can view the rate and usage limits for your organization under the [limits](https://platform.openai.com/settings/organization/limits) section of your account settings. As your spend on our API goes up, we automatically graduate you to the next usage tier. This usually results in an increase in rate limits across most models.

| Tier        | Qualification                                                         | Usage limits     |
| ----------- | --------------------------------------------------------------------- | ---------------- |
| Free        | User must be in an [allowed geography](https://developers.openai.com/api/docs/supported-countries) | $100 / month     |
| Tier&nbsp;1 | $5 paid                                                               | $100 / month     |
| Tier&nbsp;2 | $50 paid                                                              | $500 / month     |
| Tier&nbsp;3 | $100 paid                                                             | $1,000 / month   |
| Tier&nbsp;4 | $250 paid                                                             | $5,000 / month   |
| Tier&nbsp;5 | $1,000 paid                                                           | $200,000 / month |

To view a high-level summary of rate limits per model, visit the [models page](https://developers.openai.com/api/docs/models).

### Rate limits in headers

In addition to seeing your rate limit on your [account page](https://platform.openai.com/settings/organization/limits), you can also view important information about your rate limits such as the remaining requests, tokens, and other metadata in the headers of the HTTP response.

Responses can include the following header fields:

| Field                                | Sample Value | Description                                                                                       |
| ------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------- |
| Retry-After                          | 56           | The minimum number of seconds to wait before retrying a temporary rate-limit error, when present. |
| x-ratelimit-limit-requests           | 60           | The maximum number of requests that are permitted before exhausting the rate limit.               |
| x-ratelimit-limit-tokens             | 150000       | The maximum number of tokens that are permitted before exhausting the rate limit.                 |
| x-ratelimit-remaining-requests       | 59           | The remaining number of requests that are permitted before exhausting the rate limit.             |
| x-ratelimit-remaining-tokens         | 149984       | The remaining number of tokens that are permitted before exhausting the rate limit.               |
| x-ratelimit-reset-requests           | 1s           | The time until the rate limit (based on requests) resets to its initial state.                    |
| x-ratelimit-reset-tokens             | 6m0s         | The time until the rate limit (based on tokens) resets to its initial state.                      |
| x-ratelimit-limit-project-tokens     | 60000        | The token limit for the project.                                                                  |
| x-ratelimit-remaining-project-tokens | 57000        | The remaining number of tokens permitted before exhausting the project-scoped token rate limit.   |
| x-ratelimit-reset-project-tokens     | 3s           | The time until the project-scoped token rate limit resets to its initial state.                   |

Project-token headers may be present when a project-scoped token limit applies. `Retry-After` may be present on `429` responses caused by a temporary rate limit. It does not mean that quota, billing, or other errors that require user action can be resolved by retrying.

### Fine-tuning rate limits

The fine-tuning rate limits for your organization can be [found in the dashboard as well](https://platform.openai.com/settings/organization/limits), and can also be retrieved via API:

```bash
curl https://api.openai.com/v1/fine_tuning/model_limits \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


## Error mitigation

### What are some steps I can take to mitigate this?

The OpenAI Cookbook has a [Python notebook](https://developers.openai.com/cookbook/examples/how_to_handle_rate_limits) that explains how to avoid rate limit errors, as well an example [Python script](https://github.com/openai/openai-cookbook/blob/main/examples/api_request_parallel_processor.py) for staying under rate limits while batch processing API requests.

You should also exercise caution when providing programmatic access, bulk processing features, and automated social media posting - consider only enabling these for trusted customers.

To protect against automated and high-volume misuse, set a usage limit for individual users within a specified time frame (daily, weekly, or monthly). Consider implementing a hard cap or a manual review process for users who exceed the limit.

#### Retrying with exponential backoff

When a request exceeds a temporary rate limit, the API returns a `429` error. The response can include a `Retry-After` header that tells you how many seconds to wait before trying again. Treat this value as a minimum: wait at least that long and add a small random delay so multiple clients don't retry at the same time.

Each [official OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) automatically retries eligible rate-limit errors and honors `Retry-After` when it's present. You don't need to parse the header or add another retry loop for standard API calls.

If you're using your own HTTP client, follow `Retry-After` when the header is present and contains a valid value. If it's missing or invalid, fall back to exponential backoff with jitter. Limit both the number of attempts and the total time spent retrying. If you add application-level retries, account for the retries your SDK already performs. Don't retry quota, billing, or other errors that require you to take action.

Exponential backoff means waiting briefly after an unsuccessful request, then increasing the delay after each unsuccessful retry. This continues until the request succeeds or reaches a configured retry limit.

This approach has many benefits:

- Automatic retries means you can recover from rate limit errors without crashes or missing data
- Exponential backoff means that your first retries can be tried quickly, while still benefiting from longer delays if your first few retries fail
- Adding random jitter to the delay helps retries from all hitting at the same time.

Note that unsuccessful requests contribute to your per-minute limit, so continuously resending a request won’t work.

Below are a few example solutions **for Python** that use exponential backoff.

Example 1: Using the Tenacity library

Tenacity is an Apache 2.0 licensed general-purpose retrying library, written in Python, to simplify the task of adding retry behavior to just about anything.
To add exponential backoff to your requests, you can use the `tenacity.retry` decorator. The below example uses the `tenacity.wait_random_exponential` function to add random exponential backoff to a request.

Using the Tenacity library

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


Note that the Tenacity library is a third-party tool, and OpenAI makes no guarantees about
its reliability or security.

Example 2: Using the backoff library

Another python library that provides function decorators for backoff and retry is [backoff](https://pypi.org/project/backoff/):

Using the Tenacity library

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


Like Tenacity, the backoff library is a third-party tool, and OpenAI makes no guarantees about its reliability or security.

Example 3: Manual backoff implementation

If you don't want to use third-party libraries, you can implement your own backoff logic following this example:
Using manual backoff implementation

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

Again, OpenAI makes no guarantees on the security or efficiency of this solution but it can be a good starting place for your own solution.

#### Reduce the `max_tokens` to match the size of your completions

Your rate limit is calculated as the maximum of `max_tokens` and the estimated number of tokens based on the character count of your request. Try to set the `max_tokens` value as close to your expected response size as possible.

#### Batching requests

If your use case does not require immediate responses, you can use the [Batch API](https://developers.openai.com/api/docs/guides/batch) to more easily submit and execute large collections of requests without impacting your synchronous request rate limits.

For use cases that _do_ requires synchronous responses, the OpenAI API has separate limits for **requests per minute** and **tokens per minute**.

If you're hitting the limit on requests per minute but have available capacity on tokens per minute, you can increase your throughput by batching multiple tasks into each request. This will allow you to process more tokens per minute, especially with our smaller models.

Sending in a batch of prompts works exactly the same as a normal API call, except you pass in a list of strings to the prompt parameter instead of a single string. [Learn more in the Batch API guide](https://developers.openai.com/api/docs/guides/batch).