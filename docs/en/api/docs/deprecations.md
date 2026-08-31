# Deprecations

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Overview

As we launch safer and more capable models, we regularly retire older models. Software relying on OpenAI models may need occasional updates to keep working. Impacted customers will always be notified by email and in our documentation along with [blog posts](https://openai.com/blog) for larger changes.

This page lists all API deprecations, along with recommended replacements.

## Model deprecation notice periods

We provide advance notice before retiring models so customers have time to plan and migrate. When we announce a model deprecation, we notify customers who are actively using the model by email and document the deprecation on this page.

Unless safety or compliance concerns require a faster timeline, we provide the following minimum notice periods before model retirement:

- **Generally available models:** At least 6 months.
- **Specialized variants of generally available models:** At least 3 months. Examples include chat variants such as `gpt-5.1-chat-latest`, Codex variants such as `gpt-5.3-codex`, and deep research variants such as `o3-deep-research`.
- **Preview models:** Preview models, identified by `preview` in the model name, may be retired with much shorter notice, such as 2 weeks. Examples include `computer-use-preview` and `gpt-4o-audio-preview`. We don't recommend using preview models for business-critical production workloads unless you can migrate on short notice.

If safety or compliance concerns require us to retire a model sooner, we will provide as much notice as reasonably possible.

These notice periods give customers time to evaluate recommended replacement models, test application behavior, and complete migrations before a model is no longer available. In some cases, developers may be able to provision dedicated capacity for continued access after a model's shutdown date. To explore this option, [contact our sales team](https://openai.com/contact-sales/).

## Deprecation vs. legacy

We use the term "deprecation" to refer to the process of retiring a model or endpoint. When we announce that a model or endpoint is being deprecated, it immediately becomes deprecated. All deprecated models and endpoints will also have a shut down date. At the time of the shut down, the model or endpoint will no longer be accessible.

We use the terms "sunset" and "shut down" interchangeably to mean a model or endpoint is no longer accessible.

We use the term "legacy" to refer to models and endpoints that no longer receive updates. We tag endpoints and models as legacy to signal to developers where we're moving as a platform and that they should likely migrate to newer models or endpoints. You can expect that a legacy model or endpoint will be deprecated at some point in the future.

## Upcoming deprecations

Upcoming deprecations are listed below, with the most recent announcements at the top.

### 2026-07-20: Legacy audio, realtime, and transcription models

On July 20, 2026, we notified developers using legacy audio, realtime, and transcription model families and snapshots of their deprecation and removal from the API on January 20, 2027.

| Shutdown date | Model family / snapshot             | Recommended replacement             |
| ------------- | ----------------------------------- | ----------------------------------- |
| Jan 20, 2027  | `gpt-realtime`                      | `gpt-realtime-2.1`                  |
| Jan 20, 2027  | `gpt-audio`                         | `gpt-audio-1.5`                     |
| Jan 20, 2027  | `gpt-4o-audio`                      | `gpt-audio-1.5`                     |
| Jan 20, 2027  | `gpt-4o-realtime`                   | `gpt-realtime-2.1`                  |
| Jan 20, 2027  | `gpt-realtime-mini`                 | `gpt-realtime-2.1-mini`             |
| Jan 20, 2027  | `gpt-audio-mini`                    | `gpt-audio-1.5`                     |
| Jan 20, 2027  | `gpt-4o-mini-realtime`              | `gpt-realtime-2.1-mini`             |
| Jan 20, 2027  | `gpt-4o-mini-audio`                 | `gpt-audio-1.5`                     |
| Jan 20, 2027  | `gpt-4o-mini-transcribe-2025-03-20` | `gpt-4o-mini-transcribe-2025-12-15` |

### 2026-06-11: GPT-5 and o3 model deprecations

On June 11, 2026, we notified developers using older GPT-5 and o3 model snapshots of their deprecation and removal from the API on December 11, 2026.

| Shutdown date | Model / system          | Recommended replacement               |
| ------------- | ----------------------- | ------------------------------------- |
| Dec 11, 2026  | `gpt-5-2025-08-07`      | `gpt-5.6-sol`                         |
| Dec 11, 2026  | `gpt-5-mini-2025-08-07` | `gpt-5.6-terra`                       |
| Dec 11, 2026  | `gpt-5-nano-2025-08-07` | `gpt-5.6-luna`                        |
| Dec 11, 2026  | `gpt-5-pro-2025-10-06`  | `gpt-5.6-sol` (`reasoning.mode: pro`) |
| Dec 11, 2026  | `o3-2025-04-16`         | `gpt-5.6-sol`                         |
| Dec 11, 2026  | `o3-pro-2025-06-10`     | `gpt-5.6-sol` (`reasoning.mode: pro`) |

### 2026-06-03: Reusable prompts

On June 3, 2026, we notified developers using reusable prompts in the dashboard and API that reusable prompt objects are being deprecated.

| Date         | Update                                                                       |
| ------------ | ---------------------------------------------------------------------------- |
| June 3, 2026 | Deprecation announced and prompt creation de-emphasized in the platform.     |
| Nov 30, 2026 | The `v1/prompts` API and reusable prompt objects are scheduled to shut down. |

To migrate, move reusable prompt content into your application code. See [Migrate from prompt objects](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object).

### 2026-06-03: Evals platform

On June 3, 2026, we notified developers using the Evals platform that the product is being deprecated.

| Date         | Update                                                  |
| ------------ | ------------------------------------------------------- |
| June 3, 2026 | Deprecation announced for the Evals platform.           |
| Oct 31, 2026 | Existing evals become read-only.                        |
| Nov 30, 2026 | The Evals dashboard and API are scheduled to shut down. |

Graders documented for eval workflows are part of this transition. Fine-tuning-related timelines remain covered in the self-serve fine-tuning section below.

See [Moving from OpenAI Evals to Promptfoo](https://developers.openai.com/cookbook/examples/evaluation/moving-from-openai-evals-to-promptfoo) for a migration path.

### 2026-06-03: Agent Builder

On June 3, 2026, we notified developers using Agent Builder that the product is being deprecated. ChatKit remains available.

| Date         | Update                                   |
| ------------ | ---------------------------------------- |
| June 3, 2026 | Deprecation announced for Agent Builder. |
| Nov 30, 2026 | Agent Builder is scheduled to shut down. |

See [Migrate from Agent Builder](https://developers.openai.com/api/docs/guides/agent-builder/migrate-from-agent-builder) to continue with the Agents SDK or ChatGPT Workspace Agents.

### 2026-06-02: GPT Image model deprecations

On June 2, 2026, we notified developers using older GPT Image models of their deprecation and removal from the API on December 1, 2026.

| Shutdown date | Model / system         | Recommended replacement |
| ------------- | ---------------------- | ----------------------- |
| Dec 1, 2026   | `gpt-image-1-mini`     | `gpt-image-2`           |
| Dec 1, 2026   | `gpt-image-1.5`        | `gpt-image-2`           |
| Dec 1, 2026   | `chatgpt-image-latest` | `gpt-image-2`           |

### Update to OpenAI’s self-serve fine-tuning

On May 7th, 2026, we notified developers using OpenAI’s self-serve fine-tuning platform of updates to availability.

Inference on fine-tuned models will continue to be available until the base models are deprecated.

| Date         | Update                                                                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| May 7, 2026  | Creating fine-tuning jobs or training is not available to organizations that have not previously run fine-tuning.                                                                                |
| July 2, 2026 | Creating fine-tuning jobs is no longer available to organizations that have not run inference on a fine-tuned model in the past 60 days.                                                         |
| Jan 6, 2027  | Active existing customers will no longer be able to create new fine-tuning jobs on this date. Inference on fine-tuned models will be disabled only when the underlying base model is deprecated. |

### 2026-04-22: Legacy GPT model snapshots

To improve reliability and make it easier for developers to choose the right models, we are deprecating a set of older OpenAI models. Access to these models will be shut down on the dates below.

| Shutdown date    | Model snapshot                                                         | Substitute model                      |
| ---------------- | ---------------------------------------------------------------------- | ------------------------------------- |
| October 23, 2026 | `gpt-3.5-turbo-0125` \| `gpt-3.5-turbo`, `gpt-3.5-turbo-completions`   | `gpt-5.6-terra`                       |
| October 23, 2026 | `gpt-4-0613` \| `gpt-4`, `gpt-4-0613-completions`, `gpt-4-completions` | `gpt-5.6-sol`                         |
| October 23, 2026 | `gpt-4-1106-preview`                                                   | `gpt-5.6-sol`                         |
| October 23, 2026 | `gpt-4-turbo` \| `gpt-4-turbo-2024-04-09`, `gpt-4-turbo-completions`   | `gpt-5.6-sol`                         |
| October 23, 2026 | `gpt-4.1-nano` \| `gpt-4.1-nano-2025-04-14`                            | `gpt-5.6-luna`                        |
| October 23, 2026 | `gpt-4o-2024-05-13`                                                    | `gpt-5.6-sol`                         |
| October 23, 2026 | `gpt-image-1`                                                          | `gpt-image-2`                         |
| October 23, 2026 | `o1-2024-12-17` \| `o1`                                                | `gpt-5.6-sol`                         |
| October 23, 2026 | `o1-pro-2025-03-19` \| `o1-pro`                                        | `gpt-5.6-sol` (`reasoning.mode: pro`) |
| October 23, 2026 | `o3-mini-2025-01-31` \| `o3-mini`                                      | `gpt-5.6-sol`                         |
| October 23, 2026 | `ft-o4-mini-2025-04-16`                                                | `gpt-5.6-terra`                       |
| October 23, 2026 | `o4-mini-2025-04-16` \| `o4-mini`                                      | `gpt-5.6-terra`                       |

We are also removing fine-tuned versions as below:

| Shutdown date    | Model snapshot               | Recommended replacement base model |
| ---------------- | ---------------------------- | ---------------------------------- |
| October 23, 2026 | `ft-gpt-3.5-turbo`           | `gpt-5.6-terra`                    |
| October 23, 2026 | `ft-gpt-4`                   | `gpt-5.6-sol`                      |
| October 23, 2026 | `ft-gpt-4.1-nano-2025-04-14` | `gpt-5.6-luna`                     |
| October 23, 2026 | `ft-babbage-002`             | `gpt-5.6-terra`                    |
| October 23, 2026 | `ft-davinci-002`             | `gpt-5.6-terra`                    |

### 2026-03-24: Sora 2 video generation models and Videos API

On March 24th, 2026, we notified developers using the Videos API and Sora 2 video generation model aliases and snapshots of their deprecation and removal from the API on September 24, 2026.

| Shutdown date | Model / system          | Recommended replacement |
| ------------- | ----------------------- | ----------------------- |
| 2026-09-24    | Videos API              | ---                     |
| 2026-09-24    | `sora-2`                | ---                     |
| 2026-09-24    | `sora-2-pro`            | ---                     |
| 2026-09-24    | `sora-2-2025-10-06`     | ---                     |
| 2026-09-24    | `sora-2-2025-12-08`     | ---                     |
| 2026-09-24    | `sora-2-pro-2025-10-06` | ---                     |

### 2025-09-26: Legacy GPT model snapshots

To improve reliability and make it easier for developers to choose the right models, we are deprecating a set of older OpenAI models with declining usage over the next six to twelve months. Access to these models will be shut down on the dates below.

| Shutdown date | Model / system           | Recommended replacement |
| ------------- | ------------------------ | ----------------------- |
| 2026-09-28    | `gpt-3.5-turbo-instruct` | `gpt-5.6-terra`         |
| 2026-09-28    | `babbage-002`            | `gpt-5.6-terra`         |
| 2026-09-28    | `davinci-002`            | `gpt-5.6-terra`         |
| 2026-09-28    | `gpt-3.5-turbo-1106`     | `gpt-5.6-terra`         |

## Past deprecations

Past deprecations are listed below, with the most recent announcements at the top.

### 2026-05-08: gpt-5.2-chat-latest and gpt-5.3-chat-latest model snapshots

On May 8th, 2026, we notified developers using `gpt-5.2-chat-latest` and `gpt-5.3-chat-latest` model snapshots of their deprecation and removal from the API.

| Shutdown date | Model / system        | Recommended replacement |
| ------------- | --------------------- | ----------------------- |
| Aug 10, 2026  | `gpt-5.2-chat-latest` | `gpt-5.6-sol`           |
| Aug 10, 2026  | `gpt-5.3-chat-latest` | `gpt-5.6-sol`           |

### 2026-04-22: Legacy GPT model snapshots (July 2026 shutdown)

On April 22, 2026, we announced the deprecation of the following older OpenAI models. Access to these models was shut down on July 23, 2026.

| Shutdown date | Model snapshot                                                | Substitute model        |
| ------------- | ------------------------------------------------------------- | ----------------------- |
| July 23, 2026 | `computer-use-preview-2025-03-11` \| `computer-use-preview`   | `gpt-5.6-terra`         |
| July 23, 2026 | `gpt-4o-mini-search-preview-2025-03-11`                       | `gpt-5.6-terra`         |
| July 23, 2026 | `gpt-4o-search-preview-2025-03-11`                            | `gpt-5.6-terra`         |
| July 23, 2026 | `gpt-5-chat-latest`                                           | `gpt-5.6-sol`           |
| July 23, 2026 | `gpt-5-codex`                                                 | `gpt-5.6-sol`           |
| July 23, 2026 | `gpt-5.1-chat-latest`                                         | `gpt-5.6-sol`           |
| July 23, 2026 | `gpt-5.1-codex`                                               | `gpt-5.6-sol`           |
| July 23, 2026 | `gpt-5.1-codex-max`                                           | `gpt-5.6-sol`           |
| July 23, 2026 | `gpt-5.1-codex-mini`                                          | `gpt-5.6-terra`         |
| July 23, 2026 | `gpt-audio-mini-2025-10-06`                                   | `gpt-audio-1.5`         |
| July 23, 2026 | `gpt-realtime-mini-2025-10-06`                                | `gpt-realtime-2.1-mini` |
| July 23, 2026 | `o3-deep-research-2025-06-26` \| `o3-deep-research`           | `gpt-5.6-sol`           |
| July 23, 2026 | `o4-mini-deep-research-2025-06-26` \| `o4-mini-deep-research` | `gpt-5.6-sol`           |
| July 23, 2026 | `gpt-5.2-codex`                                               | `gpt-5.6-sol`           |

### 2025-11-18: chatgpt-4o-latest snapshot

On November 18th, 2025, we notified developers using `chatgpt-4o-latest` model snapshot of its deprecation and removal from the API on February 17, 2026.

| Shutdown date | Model / system      | Recommended replacement |
| ------------- | ------------------- | ----------------------- |
| 2026-02-17    | `chatgpt-4o-latest` | `gpt-5.1-chat-latest`   |

### 2025-11-17: codex-mini-latest model snapshot

On November 17th, 2025, we notified developers using `codex-mini-latest` model of its deprecation and removal from the API on February 12, 2026. As part of this deprecation, we will no longer support our legacy local shell tool, which is only available for use with `codex-mini-latest`. For new use cases, please use our latest shell tool.

| Shutdown date | Model / system      | Recommended replacement |
| ------------- | ------------------- | ----------------------- |
| 2026-02-12    | `codex-mini-latest` | `gpt-5-codex-mini`      |

### 2025-11-14: DALL·E model snapshots

On November 14th, 2025, we notified developers using DALL·E model snapshots of their deprecation and removal from the API on May 12, 2026.

| Shutdown date | Model / system | Recommended replacement                             |
| ------------- | -------------- | --------------------------------------------------- |
| 2026-05-12    | `dall-e-2`     | `gpt-image-2`, `gpt-image-1`, or `gpt-image-1-mini` |
| 2026-05-12    | `dall-e-3`     | `gpt-image-2`, `gpt-image-1`, or `gpt-image-1-mini` |

### 2025-09-26: Legacy GPT model snapshots (March 2026 shutdown)

To improve reliability and make it easier for developers to choose the right models, we deprecated a set of older OpenAI models with declining usage. Access to these models was shut down on March 26, 2026.

| Shutdown date | Model / system                                                                                                             | Recommended replacement |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| 2026‑03‑26    | `gpt-4-0314`                                                                                                               | `gpt-5` or `gpt-4.1*`   |
| 2026‑03‑26    | `gpt-4-1106-preview`                                                                                                       | `gpt-5` or `gpt-4.1*`   |
| 2026‑03‑26    | `gpt-4-0125-preview` (including `gpt-4-turbo-preview` and `gpt-4-turbo-preview-completions`, which point to this snapshot) | `gpt-5` or `gpt-4.1*`   |

\*For tasks that are especially latency sensitive and don't require reasoning

### 2025-09-15: Realtime API Beta

The Realtime API Beta was deprecated and removed from the API on May 12, 2026.

There are a few key differences between the interfaces in the Realtime beta API and the released GA API. See [the migration guide](https://developers.openai.com/api/docs/guides/realtime#beta-to-ga-migration) for the current GA interface and related Realtime docs.

| Shutdown date | Model / system           | Recommended replacement |
| ------------- | ------------------------ | ----------------------- |
| 2026‑05‑12    | OpenAI-Beta: realtime=v1 | Realtime API            |

### 2025-09-15: gpt-4o-realtime-preview models

In September, 2025, we notified developers using gpt-4o-realtime-preview models of their deprecation and removal from the API in six months.

| Shutdown date | Model / system                     | Recommended replacement |
| ------------- | ---------------------------------- | ----------------------- |
| 2026-05-07    | gpt-4o-realtime-preview            | gpt-realtime-1.5        |
| 2026-05-07    | gpt-4o-realtime-preview-2025-06-03 | gpt-realtime-1.5        |
| 2026-05-07    | gpt-4o-realtime-preview-2024-12-17 | gpt-realtime-1.5        |
| 2026-05-07    | gpt-4o-mini-realtime-preview       | gpt-realtime-mini       |
| 2026-05-07    | gpt-4o-audio-preview               | gpt-audio-1.5           |
| 2026-05-07    | gpt-4o-mini-audio-preview          | gpt-audio-mini          |

### 2025-08-20: Assistants API

The Assistants API was officially sunset on August 26, 2026, following its deprecation announcement on August 26, 2025.

When we released the [Responses API](https://developers.openai.com/api/reference/resources/responses/methods/create) in [March 2025](https://developers.openai.com/api/docs/changelog), we announced plans to bring all Assistants API features to the easier to use Responses API, with a sunset date in 2026.

See the Assistants to Conversations [migration guide](https://developers.openai.com/api/docs/assistants/migration) to learn more about how to migrate your current integration to the Responses API and Conversations API.

| Shutdown date | Model / system | Recommended replacement             |
| ------------- | -------------- | ----------------------------------- |
| 2026‑08‑26    | Assistants API | Responses API and Conversations API |

### 2025-06-10: gpt-4o-realtime-preview-2024-10-01

On June 10th, 2025, we notified developers using gpt-4o-realtime-preview-2024-10-01 of its deprecation and removal from the API in three months.

| Shutdown date | Model / system                     | Recommended replacement |
| ------------- | ---------------------------------- | ----------------------- |
| 2025-10-10    | gpt-4o-realtime-preview-2024-10-01 | gpt-realtime-1.5        |

### 2025-06-10: gpt-4o-audio-preview-2024-10-01

On June 10th, 2025, we notified developers using `gpt-4o-audio-preview-2024-10-01` of its deprecation and removal from the API in three months.

| Shutdown date | Model / system                    | Recommended replacement |
| ------------- | --------------------------------- | ----------------------- |
| 2025-10-10    | `gpt-4o-audio-preview-2024-10-01` | `gpt-audio-1.5`         |

### 2025-04-28: text-moderation

On April 28th, 2025, we notified developers using `text-moderation` of its deprecation and removal from the API in six months.

| Shutdown date | Model / system           | Recommended replacement |
| ------------- | ------------------------ | ----------------------- |
| 2025-10-27    | `text-moderation-007`    | `omni-moderation`       |
| 2025-10-27    | `text-moderation-stable` | `omni-moderation`       |
| 2025-10-27    | `text-moderation-latest` | `omni-moderation`       |

### 2025-04-28: o1-preview and o1-mini

On April 28th, 2025, we notified developers using `o1-preview` and `o1-mini` of their deprecations and removal from the API in three months and six months respectively.

| Shutdown date | Model / system | Recommended replacement |
| ------------- | -------------- | ----------------------- |
| 2025-07-28    | `o1-preview`   | `o3`                    |
| 2025-10-27    | `o1-mini`      | `o4-mini`               |

### 2025-04-14: GPT-4.5-preview

On April 14th, 2025, we notified developers that the `gpt-4.5-preview` model is deprecated and will be removed from the API in the coming months.

| Shutdown date | Model / system    | Recommended replacement |
| ------------- | ----------------- | ----------------------- |
| 2025-07-14    | `gpt-4.5-preview` | `gpt-4.1`               |

### 2024-10-02: Assistants API beta v1

In [April 2024](https://developers.openai.com/api/docs/assistants/migration) when we released the v2 beta version of the Assistants API, we announced that access to the v1 beta would be shut off by the end of 2024. Access to the v1 beta will be discontinued on December 18, 2024.

See the Assistants API v2 beta [migration guide](https://developers.openai.com/api/docs/assistants/migration) to learn more about how to migrate your tool usage to the latest version of the Assistants API.

| Shutdown date | Model / system             | Recommended replacement    |
| ------------- | -------------------------- | -------------------------- |
| 2024-12-18    | OpenAI-Beta: assistants=v1 | OpenAI-Beta: assistants=v2 |

### 2024-08-29: Fine-tuning training on babbage-002 and davinci-002 models

On August 29th, 2024, we notified developers fine-tuning `babbage-002` and `davinci-002` that new fine-tuning training runs on these models will no longer be supported starting October 28, 2024.

Fine-tuned models created from these base models are not affected by this deprecation, but you will no longer be able to create new fine-tuned versions with these models.

| Shutdown date | Model / system                            | Recommended replacement |
| ------------- | ----------------------------------------- | ----------------------- |
| 2024-10-28    | New fine-tuning training on `babbage-002` | `gpt-4o-mini`           |
| 2024-10-28    | New fine-tuning training on `davinci-002` | `gpt-4o-mini`           |

### 2024-06-06: GPT-4-32K and Vision Preview models

On June 6th, 2024, we notified developers using `gpt-4-32k` and `gpt-4-vision-preview` of their upcoming deprecations in one year and six months respectively. As of June 17, 2024, only existing users of these models will be able to continue using them.

| Shutdown date | Deprecated model            | Deprecated model price                             | Recommended replacement |
| ------------- | --------------------------- | -------------------------------------------------- | ----------------------- |
| 2025-06-06    | `gpt-4-32k`                 | $60.00 / 1M input tokens + $120 / 1M output tokens | `gpt-4o`                |
| 2025-06-06    | `gpt-4-32k-0613`            | $60.00 / 1M input tokens + $120 / 1M output tokens | `gpt-4o`                |
| 2025-06-06    | `gpt-4-32k-0314`            | $60.00 / 1M input tokens + $120 / 1M output tokens | `gpt-4o`                |
| 2024-12-06    | `gpt-4-vision-preview`      | $10.00 / 1M input tokens + $30 / 1M output tokens  | `gpt-4o`                |
| 2024-12-06    | `gpt-4-1106-vision-preview` | $10.00 / 1M input tokens + $30 / 1M output tokens  | `gpt-4o`                |

### 2023-11-06: Chat model updates

On November 6th, 2023, we [announced](https://openai.com/blog/new-models-and-developer-products-announced-at-devday) the release of an updated GPT-3.5-Turbo model (which now comes by default with 16k context) along with deprecation of `gpt-3.5-turbo-0613` and ` gpt-3.5-turbo-16k-0613`. As of June 17, 2024, only existing users of these models will be able to continue using them.

| Shutdown date | Deprecated model         | Deprecated model price                             | Recommended replacement |
| ------------- | ------------------------ | -------------------------------------------------- | ----------------------- |
| 2024-09-13    | `gpt-3.5-turbo-0613`     | $1.50 / 1M input tokens + $2.00 / 1M output tokens | `gpt-3.5-turbo`         |
| 2024-09-13    | `gpt-3.5-turbo-16k-0613` | $3.00 / 1M input tokens + $4.00 / 1M output tokens | `gpt-3.5-turbo`         |

Fine-tuned models created from these base models are not affected by this deprecation, but you will no longer be able to create new fine-tuned versions with these models.

### 2023-08-22: Fine-tunes endpoint

On August 22nd, 2023, we [announced](https://openai.com/blog/gpt-3-5-turbo-fine-tuning-and-api-updates) the new fine-tuning API (`/v1/fine_tuning/jobs`) and that the original `/v1/fine-tunes` API along with legacy models (including those fine-tuned with the `/v1/fine-tunes` API) will be shut down on January 04, 2024. This means that models fine-tuned using the `/v1/fine-tunes` API will no longer be accessible and you would have to fine-tune new models with the updated endpoint and associated base models.

#### Fine-tunes endpoint

| Shutdown date | System           | Recommended replacement |
| ------------- | ---------------- | ----------------------- |
| 2024-01-04    | `/v1/fine-tunes` | `/v1/fine_tuning/jobs`  |

### 2023-07-06: GPT and embeddings

On July 06, 2023, we [announced](https://openai.com/blog/gpt-4-api-general-availability) the upcoming retirements of older GPT-3 and GPT-3.5 models served via the completions endpoint. We also announced the upcoming retirement of our first-generation text embedding models. They will be shut down on January 04, 2024.

#### InstructGPT models

| Shutdown date | Deprecated model   | Deprecated model price | Recommended replacement  |
| ------------- | ------------------ | ---------------------- | ------------------------ |
| 2024-01-04    | `text-ada-001`     | $0.40 / 1M tokens      | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-babbage-001` | $0.50 / 1M tokens      | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-curie-001`   | $2.00 / 1M tokens      | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-davinci-001` | $20.00 / 1M tokens     | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-davinci-002` | $20.00 / 1M tokens     | `gpt-3.5-turbo-instruct` |
| 2024-01-04    | `text-davinci-003` | $20.00 / 1M tokens     | `gpt-3.5-turbo-instruct` |

Pricing for the replacement `gpt-3.5-turbo-instruct` model can be found on the [pricing page](https://openai.com/api/pricing).

#### Base GPT models

| Shutdown date | Deprecated model   | Deprecated model price | Recommended replacement  |
| ------------- | ------------------ | ---------------------- | ------------------------ |
| 2024-01-04    | `ada`              | $0.40 / 1M tokens      | `babbage-002`            |
| 2024-01-04    | `babbage`          | $0.50 / 1M tokens      | `babbage-002`            |
| 2024-01-04    | `curie`            | $2.00 / 1M tokens      | `davinci-002`            |
| 2024-01-04    | `davinci`          | $20.00 / 1M tokens     | `davinci-002`            |
| 2024-01-04    | `code-davinci-002` | ---                    | `gpt-3.5-turbo-instruct` |

Pricing for the replacement `babbage-002` and `davinci-002` models can be found on the [pricing page](https://openai.com/api/pricing).

#### Edit models & endpoint

| Shutdown date | Model / system          | Recommended replacement |
| ------------- | ----------------------- | ----------------------- |
| 2024-01-04    | `text-davinci-edit-001` | `gpt-4o`                |
| 2024-01-04    | `code-davinci-edit-001` | `gpt-4o`                |
| 2024-01-04    | `/v1/edits`             | `/v1/chat/completions`  |

#### Fine-tuning GPT models

| Shutdown date | Deprecated model | Training price     | Usage price         | Recommended replacement                  |
| ------------- | ---------------- | ------------------ | ------------------- | ---------------------------------------- |
| 2024-01-04    | `ada`            | $0.40 / 1M tokens  | $1.60 / 1M tokens   | `babbage-002`                            |
| 2024-01-04    | `babbage`        | $0.60 / 1M tokens  | $2.40 / 1M tokens   | `babbage-002`                            |
| 2024-01-04    | `curie`          | $3.00 / 1M tokens  | $12.00 / 1M tokens  | `davinci-002`                            |
| 2024-01-04    | `davinci`        | $30.00 / 1M tokens | $120.00 / 1K tokens | `davinci-002`, `gpt-3.5-turbo`, `gpt-4o` |

#### First-generation text embedding models

| Shutdown date | Deprecated model                | Deprecated model price | Recommended replacement  |
| ------------- | ------------------------------- | ---------------------- | ------------------------ |
| 2024-01-04    | `text-similarity-ada-001`       | $4.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `text-search-ada-doc-001`       | $4.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `text-search-ada-query-001`     | $4.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `code-search-ada-code-001`      | $4.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `code-search-ada-text-001`      | $4.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `text-similarity-babbage-001`   | $5.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `text-search-babbage-doc-001`   | $5.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `text-search-babbage-query-001` | $5.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `code-search-babbage-code-001`  | $5.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `code-search-babbage-text-001`  | $5.00 / 1M tokens      | `text-embedding-3-small` |
| 2024-01-04    | `text-similarity-curie-001`     | $20.00 / 1M tokens     | `text-embedding-3-small` |
| 2024-01-04    | `text-search-curie-doc-001`     | $20.00 / 1M tokens     | `text-embedding-3-small` |
| 2024-01-04    | `text-search-curie-query-001`   | $20.00 / 1M tokens     | `text-embedding-3-small` |
| 2024-01-04    | `text-similarity-davinci-001`   | $200.00 / 1M tokens    | `text-embedding-3-small` |
| 2024-01-04    | `text-search-davinci-doc-001`   | $200.00 / 1M tokens    | `text-embedding-3-small` |
| 2024-01-04    | `text-search-davinci-query-001` | $200.00 / 1M tokens    | `text-embedding-3-small` |

### 2023-06-13: Updated chat models

On June 13, 2023, we announced new chat model versions in the [Function calling and other API updates](https://openai.com/blog/function-calling-and-other-api-updates) blog post. The three original versions will be retired in June 2024 at the earliest. As of January 10, 2024, only existing users of these models will be able to continue using them.

| Shutdown date          | Legacy model | Legacy model price                                   | Recommended replacement |
| ---------------------- | ------------ | ---------------------------------------------------- | ----------------------- |
| at earliest 2024-06-13 | `gpt-4-0314` | $30.00 / 1M input tokens + $60.00 / 1M output tokens | `gpt-4o`                |

| Shutdown date | Deprecated model     | Deprecated model price                                | Recommended replacement |
| ------------- | -------------------- | ----------------------------------------------------- | ----------------------- |
| 2024-09-13    | `gpt-3.5-turbo-0301` | $15.00 / 1M input tokens + $20.00 / 1M output tokens  | `gpt-3.5-turbo`         |
| 2025-06-06    | `gpt-4-32k-0314`     | $60.00 / 1M input tokens + $120.00 / 1M output tokens | `gpt-4o`                |

### 2023-03-20: Codex models

| Shutdown date | Deprecated model   | Recommended replacement |
| ------------- | ------------------ | ----------------------- |
| 2023-03-23    | `code-davinci-002` | `gpt-4o`                |
| 2023-03-23    | `code-davinci-001` | `gpt-4o`                |
| 2023-03-23    | `code-cushman-002` | `gpt-4o`                |
| 2023-03-23    | `code-cushman-001` | `gpt-4o`                |

### 2022-06-03: Legacy endpoints

| Shutdown date | System                | Recommended replacement                                                                               |
| ------------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| 2022-12-03    | `/v1/engines`         | [/v1/models](https://platform.openai.com/docs/api-reference/models/list)                              |
| 2022-12-03    | `/v1/search`          | [View transition guide](https://help.openai.com/en/articles/6272952-search-transition-guide)          |
| 2022-12-03    | `/v1/classifications` | [View transition guide](https://help.openai.com/en/articles/6272941-classifications-transition-guide) |
| 2022-12-03    | `/v1/answers`         | [View transition guide](https://help.openai.com/en/articles/6233728-answers-transition-guide)         |

### Plain-text aliases

- gpt-3.5-turbo-0125 | gpt-3.5-turbo, gpt-3.5-turbo-completions
- gpt-4-0613 | gpt-4, gpt-4-0613-completions, gpt-4-completions
- gpt-4-turbo | gpt-4-turbo-2024-04-09, gpt-4-turbo-completions
- gpt-4.1-nano | gpt-4.1-nano-2025-04-14
- o1-2024-12-17 | o1
- o1-pro-2025-03-19 | o1-pro
- o3-mini-2025-01-31 | o3-mini
- o4-mini-2025-04-16 | o4-mini
- computer-use-preview-2025-03-11 | computer-use-preview
- o3-deep-research-2025-06-26 | o3-deep-research
- o4-mini-deep-research-2025-06-26 | o4-mini-deep-research