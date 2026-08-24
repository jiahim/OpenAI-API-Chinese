# Production best practices

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

This guide provides a comprehensive set of best practices to help you transition from prototype to production. Whether you are a seasoned machine learning engineer or a recent enthusiast, this guide should provide you with the tools you need to successfully put the platform to work in a production setting: from securing access to our API to designing a robust architecture that can handle high traffic volumes. Use this guide to help develop a plan for deploying your application as smoothly and effectively as possible.

If you want to explore best practices for going into production further, please check out our Developer Day talk:

<iframe
  width="100%"
  height="315"
  src="https://www.youtube-nocookie.com/embed/XGJNo8TpuVA?si=mvYm3Un23iHnlXcg"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>

## Setting up your organization

Once you [log in](https://platform.openai.com/login) to your OpenAI account, you can find your organization name and ID in your [organization settings](https://platform.openai.com/settings/organization/general). The organization name is the label for your organization, shown in user interfaces. The organization ID is the unique identifier for your organization which can be used in API requests.

Users who belong to multiple organizations can [pass a header](https://developers.openai.com/api/reference/overview#authentication) to specify which organization is used for an API request. Usage from these API requests will count against the specified organization's quota. If no header is provided, the [default organization](https://platform.openai.com/settings/organization/api-keys) will be billed. You can change your default organization in your [user settings](https://platform.openai.com/settings/organization/api-keys).

You can invite new members to your organization from the [Team page](https://platform.openai.com/settings/organization/team). Members can be **readers** or **owners**.

Readers:

- Can make API requests.
- Can view basic organization information.
- Can create, update, and delete resources (like Assistants) in the organization, unless otherwise noted.

Owners:

- Have all the permissions of readers.
- Can modify billing information.
- Can manage members within the organization.

### Managing billing limits

Once you’ve entered your billing information, OpenAI sets an approved usage limit for your organization. Your quota limit will automatically increase as your usage on your platform increases and you move from one [usage tier](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) to another. You can review your current usage limit in the [limits](https://platform.openai.com/settings/organization/limits) page in your account settings.

Set spend alerts on the [limits](https://platform.openai.com/settings/organization/limits) page to send notifications when usage exceeds a certain dollar amount. To enforce a monthly cap, set a hard spend limit. Hard spend limits stop affected API traffic when tracked spend reaches the limit, so review the [spend limits guide](https://developers.openai.com/api/docs/guides/spend-limits) before enabling one in production.

### API keys

The OpenAI API uses API keys for authentication. Visit your [API keys](https://platform.openai.com/settings/organization/api-keys) page to retrieve the API key you'll use in your requests.

This is a relatively straightforward way to control access, but you must be vigilant about securing these keys. Avoid exposing the API keys in your code or in public repositories; instead, store them in a secure location. You should expose your keys to your application using environment variables or secret management service, so that you don't need to hard-code them in your codebase. Read more in our [Best practices for API key safety](https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety).

API key usage can be monitored on the [Usage page](https://platform.openai.com/usage) once tracking is enabled. If you are using an API key generated prior to Dec 20, 2023 tracking will not be enabled by default. You can enable tracking going forward on the [API key management dashboard](https://platform.openai.com/api-keys). All API keys generated past Dec 20, 2023 have tracking enabled. Any previous untracked usage will be displayed as `Untracked` in the dashboard.

### Staging projects

As you scale, you may want to create separate projects for your staging and production environments. You can create these projects in the dashboard, allowing you to isolate your development and testing work, so you don't accidentally disrupt your live application. You can also limit user access to your production project, and set custom rate and spend limits per project.

## Scaling your solution architecture

When designing your application or service for production that uses our API, it's important to consider how you will scale to meet traffic demands. There are a few key areas you will need to consider regardless of the cloud service provider of your choice:

- **Horizontal scaling**: You may want to scale your application out horizontally to accommodate requests to your application that come from multiple sources. This could involve deploying additional servers or containers to distribute the load. If you opt for this type of scaling, make sure that your architecture is designed to handle multiple nodes and that you have mechanisms in place to balance the load between them.
- **Vertical scaling**: Another option is to scale your application up vertically, meaning you can beef up the resources available to a single node. This would involve upgrading your server's capabilities to handle the additional load. If you opt for this type of scaling, make sure your application is designed to take advantage of these additional resources.
- **Caching**: By storing frequently accessed data, you can improve response times without needing to make repeated calls to our API. Your application will need to be designed to use cached data whenever possible and invalidate the cache when new information is added. There are a few different ways you could do this. For example, you could store data in a database, filesystem, or in-memory cache, depending on what makes the most sense for your application.
- **Load balancing**: Finally, consider load-balancing techniques to ensure requests are distributed evenly across your available servers. This could involve using a load balancer in front of your servers or using DNS round-robin. Balancing the load will help improve performance and reduce bottlenecks.

### Managing rate limits

When using our API, it's important to understand and plan for [rate limits](https://developers.openai.com/api/docs/guides/rate-limits).

## Improving latencies

Check out our most up-to-date guide on [latency
  optimization](https://developers.openai.com/api/docs/guides/latency-optimization).

Latency is the time it takes for a request to be processed and a response to be returned. In this section, we will discuss some factors that influence the latency of our text generation models and provide suggestions on how to reduce it.

The latency of a completion request is mostly influenced by two factors: the model and the number of tokens generated. The life cycle of a completion request looks like this:

- End user to API latency
- Time to process prompt tokens
- Time to sample/generate tokens
- API to end user latency



The bulk of the latency typically arises from the token generation step.

> **Intuition**: Prompt tokens add very little latency to completion calls. Time to generate completion tokens is much longer, as tokens are generated one at a time. Longer generation lengths will accumulate latency due to generation required for each token.

### Common factors affecting latency and possible mitigation techniques

Now that we have looked at the basics of latency, let’s take a look at various factors that can affect latency, broadly ordered from most impactful to least impactful.

#### Model

Our API offers different models with varying levels of complexity and generality. The most capable models, such as `gpt-5.6`, can generate more complex and diverse completions, but they also take longer to process your query.
Models such as `gpt-5.6-terra` and `gpt-5.6-luna` can generate faster and cheaper Responses, while `gpt-5.6` is a stronger default when you want more headroom on complex tasks. You can choose the model that best suits your use case and the trade-off between speed, cost, and quality.

#### Number of completion tokens

Requesting a large amount of generated tokens completions can lead to increased latencies:

- **Lower max tokens**: for requests with a similar token generation count, those that have a lower `max_tokens` parameter incur less latency.
- **Include stop sequences**: to prevent generating unneeded tokens, add a stop sequence. For example, you can use stop sequences to generate a list with a specific number of items. In this case, by using `11.` as a stop sequence, you can generate a list with only 10 items, since the completion will stop when `11.` is reached. [Read our help article on stop sequences](https://help.openai.com/en/articles/5072263-how-do-i-use-stop-sequences) for more context on how you can do this.
- **Generate fewer completions**: lower the values of `n` and `best_of` when possible where `n` refers to how many completions to generate for each prompt and `best_of` is used to represent the result with the highest log probability per token.

If `n` and `best_of` both equal 1 (which is the default), the number of generated tokens will be at most, equal to `max_tokens`.

If `n` (the number of completions returned) or `best_of` (the number of completions generated for consideration) are set to `> 1`, each request will create multiple outputs. Here, you can consider the number of generated tokens as `[ max_tokens * max (n, best_of) ]`

#### Streaming

Setting `stream: true` in a request makes the model start returning tokens as soon as they are available, instead of waiting for the full sequence of tokens to be generated. It does not change the time to get all the tokens, but it reduces the time for first token for an application where we want to show partial progress or are going to stop generations. This can be a better user experience and a UX improvement so it’s worth experimenting with streaming.

#### Batching

Depending on your use case, batching _may help_. If you are sending multiple requests to the same endpoint, you can [batch the prompts](https://developers.openai.com/api/docs/guides/rate-limits#batching-requests) to be sent in the same request. This will reduce the number of requests you need to make. The prompt parameter can hold up to 20 unique prompts. We advise you to test out this method and see if it helps. In some cases, you may end up increasing the number of generated tokens which will slow the response time.

## Managing costs

To monitor your costs, you can set a [notification threshold](https://platform.openai.com/settings/organization/limits) in your account to receive an email alert once you pass a certain usage threshold. Use the [usage tracking dashboard](https://platform.openai.com/settings/organization/usage) to monitor your token usage during the current and past billing cycles.

### Text generation

One of the challenges of moving your prototype into production is budgeting for the costs associated with running your application. OpenAI offers a [pay-as-you-go pricing model](https://openai.com/api/pricing/), with prices per 1,000 tokens (roughly equal to 750 words). To estimate your costs, you will need to project the token utilization. Consider factors such as traffic levels, the frequency with which users will interact with your application, and the amount of data you will be processing.

**One useful framework for thinking about reducing costs is to consider costs as a function of the number of tokens and the cost per token.** There are two potential avenues for reducing costs using this framework. First, you could work to reduce the cost per token by switching to smaller models for some tasks in order to reduce costs. Alternatively, you could try to reduce the number of tokens required. There are a few ways you could do this, such as by using shorter prompts, [fine-tuning](https://developers.openai.com/api/docs/guides/model-optimization) models, or caching common user queries so that they don't need to be processed repeatedly.

You can experiment with our interactive [tokenizer tool](https://platform.openai.com/tokenizer) to help you estimate costs. The API and playground also returns token counts as part of the response. Once you’ve got things working with our most capable model, you can see if the other models can produce the same results with lower latency and costs. Learn more in our [token usage help article](https://help.openai.com/en/articles/6614209-how-do-i-check-my-token-usage).

## MLOps strategy

As you move your prototype into production, you may want to consider developing an MLOps strategy. MLOps (machine learning operations) refers to the process of managing the end-to-end life cycle of your machine learning models, including any models you may be fine-tuning using our API. There are a number of areas to consider when designing your MLOps strategy. These include

- Data and model management: managing the data used to train or fine-tune your model and tracking versions and changes.
- Model monitoring: tracking your model's performance over time and detecting any potential issues or degradation.
- Model retraining: ensuring your model stays up to date with changes in data or evolving requirements and retraining or fine-tuning it as needed.
- Model deployment: automating the process of deploying your model and related artifacts into production.

Thinking through these aspects of your application will help ensure your model stays relevant and performs well over time.

## Security and compliance

As you move your prototype into production, you will need to assess and address any security and compliance requirements that may apply to your application. This will involve examining the data you are handling, understanding how our API processes data, and determining what regulations you must adhere to. Our [security practices](https://www.openai.com/security) and [trust and compliance portal](https://trust.openai.com/) provide our most comprehensive and up-to-date documentation. For reference, here is our [Privacy Policy](https://openai.com/privacy/) and [Terms of Use](https://openai.com/api/policies/terms/).

Some common areas you'll need to consider include data storage, data transmission, and data retention. You might also need to implement data privacy protections, such as encryption or anonymization where possible. In addition, you should follow best practices for secure coding, such as input sanitization and proper error handling.

### Safety best practices

When creating your application with our API, consider our [safety best practices](https://developers.openai.com/api/docs/guides/safety-best-practices) to ensure your application is safe and successful. These recommendations highlight the importance of testing the product extensively, being proactive about addressing potential issues, and limiting opportunities for misuse.

## Business considerations

As projects using AI move from prototype to production, it is important to consider how to build a great product with AI and how that ties back to your core business. We certainly don't have all the answers but a great starting place is a talk from our Developer Day where we dive into this with some of our customers:

<iframe
  width="100%"
  height="315"
  src="https://www.youtube-nocookie.com/embed/knHW-p31R0c?si=g0ddoMoUykjclH4k"
  title="YouTube video player"
  frameBorder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowFullScreen
></iframe>