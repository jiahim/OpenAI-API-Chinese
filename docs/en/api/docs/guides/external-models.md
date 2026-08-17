# Evaluate external models

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Model selection is an important lever that enables builders to improve their AI applications. When using Evaluations on the OpenAI Platform, in addition to evaluating OpenAI’s native models, you can also evaluate a variety of external models.

We support accessing **third-party models** (no API key required) and accessing **custom endpoints** (API key required).

OpenAI is deprecating the Evals platform. Existing evals content remains
  available during the transition window. Evals will become read-only for
  existing users on October 31, 2026, and the platform is scheduled to shut down
  on November 30, 2026. See the [deprecations
  page](https://developers.openai.com/api/docs/deprecations#2026-06-03-evals-platform) for the current
  timeline.

## Third-party models

In order to use third-party models, the following must be true:

- Your OpenAI organization must be in [usage tier 1](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers) or higher.
- An admin for your OpenAI organization must enable this feature via [Settings > Organization > General](https://platform.openai.com/settings/organization/general). To enable this feature, the admin must accept the usage disclaimer shown.

Calls made to external models pass data to third parties and are subject to
  different terms and weaker safety guarantees than calls to OpenAI models.

### Billing and usage limits

OpenAI currently covers inference costs on third-party models, subject to the following monthly limit based on your organization’s usage tier.

| Usage tier | Monthly spend limit (USD) |
| ---------- | ------------------------- |
| Tier 1     | $5                        |
| Tier 2     | $25                       |
| Tier 3     | $50                       |
| Tier 4     | $100                      |
| Tier 5     | $200                      |

We serve these models via our partner, OpenRouter. In the future, third-party models will be charged as part of your regular OpenAI billing cycle, at [OpenRouter list prices](https://openrouter.ai/models).

### Available third-party models

We provide access to the following external model providers:

- Google
- Anthropic (hosted on AWS Bedrock)
- Together
- Fireworks

## Custom endpoints

You can configure a fully custom model endpoint and run evals against it on the OpenAI Platform. This is typically a provider whom we do not natively support, a model you host yourself, or a custom proxy that you use for making inference calls.

In order to use this feature, an admin for your OpenAI organization must enable the “Enable custom providers for evaluations” setting via [Settings > Organization > General](https://platform.openai.com/settings/organization/general). To enable this feature, the admin must accept the usage disclaimer shown. Note that calls made to external models pass data to third parties, and are subject to different terms and weaker safety guarantees than calls to OpenAI models.

Once you are eligible to use custom providers, you can set up a provider under the **Evaluations** tab under [Settings](https://platform.openai.com/settings/). Note that custom providers are configured on a per-project basis. To connect your custom endpoint, you will need:

- An endpoint compatible with [OpenAI’s chat completions endpoint](https://developers.openai.com/api/reference/resources/chat)
- An API key

Name your endpoint, provide an endpoint URL, and specify your API key. We require that you use an `https://` endpoint, and we encrypt your keys for security. Specify any model names (slugs) you wish to evaluate. You can click the **Verify** button to ensure that your models are set up correctly. This will make a test call containing minimal input to each of your model slugs, and will indicate any failures.

## Run evals with external models

Once you have configured an external model, you can use it for evals on the by selecting it from the model picker in your [dataset](https://platform.openai.com/evaluation) or your [evaluation](https://platform.openai.com/evaluation?tab=evals). Note that tool calls are currently not supported.

| Model type  |           Datasets            |             Evals             |
| ----------- | :---------------------------: | :---------------------------: |
| Third-party | | |
| Custom      |                               | |

## Next steps

For more inspiration, visit the [OpenAI Cookbook](https://developers.openai.com/cookbook), which contains example code and links to third-party resources, or learn more about our tools for evals:

[Getting started with evals



      Uses Datasets to quickly build evals and iterate on prompts.](https://developers.openai.com/api/docs/guides/evaluation-getting-started)

[Working with evals



      Evaluate against external models, interact with evals via API, and more.](https://developers.openai.com/api/docs/guides/evals)