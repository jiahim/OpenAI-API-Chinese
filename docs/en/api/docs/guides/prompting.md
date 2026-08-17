# Prompting

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

**Prompting** is the process of providing input to a model. The quality of your output often depends on how well you're able to prompt the model.

## Overview

Prompting is both an art and a science. OpenAI has some strategies and API design decisions to help you construct strong prompts and get consistently good results from a model. We encourage you to experiment.

## Prompting tools and techniques

- **[Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching)**: Reuse stable prompt prefixes to reduce latency and input token costs on cache hits
- **[Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering)**: Learn strategies, techniques, and tools to construct prompts

## Refine your prompt

- Put overall tone or role guidance in the system message; keep task-specific details and examples in user messages.
- Combine few-shot examples into a concise YAML-style or bulleted block so your team can scan and update them.
- Mirror your project structure with clear folder names so teammates can locate prompts quickly.
- Run your prompt tests and evaluation cases every time you publish; catching issues early is cheaper than fixing them in production.

## Prompts in your application

Treat prompts as application code. Store prompt content in named modules, build dynamic sections with typed function arguments, and review prompt changes in the same pull requests as the product behavior they support.

OpenAI is deprecating reusable prompt objects in the API. Prompt creation will
  be de-emphasized beginning June 3, 2026, and `v1/prompts` is scheduled to shut
  down on November 30, 2026. See the [deprecations
  page](https://developers.openai.com/api/docs/deprecations#2026-06-03-reusable-prompts) for the current
  timeline.

For new work, don't create reusable prompt objects. Instead:

- Keep each production prompt in a code-managed, versioned helper such as `prompts/supportReply.ts`.
- Replace prompt variables with typed function parameters or validated input objects.
- Pass generated messages directly to the [Responses API](https://developers.openai.com/api/docs/guides/text?api-mode=responses) through `input` and `instructions`.
- Cover prompt changes with tests, representative fixtures, and evaluation checks that run with your deployment process.
- Use git history, PR review, release tags, and feature flags to review, ship, compare, and roll back prompt changes.

If you already use prompt IDs or prompt versions in API requests, follow the [migration guide](https://developers.openai.com/api/docs/guides/prompting/migrate-from-prompt-object) to move those prompts into code.

## Next steps

When you feel confident in your prompts, you might want to check out the following guides and resources.

[Text generation



      Learn how to prompt a model to generate text.](https://developers.openai.com/api/docs/guides/text)

[Engineer better prompts



      Learn about OpenAI's prompt engineering tools and techniques.](https://developers.openai.com/api/docs/guides/prompt-engineering)