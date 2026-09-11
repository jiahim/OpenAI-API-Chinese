# Modal

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

See the [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/modal) and [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/modal) examples in the OpenAI Cookbook.

See [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) for executor setup and connection requirements.

Choose a provisioning mode:

- **[Application-managed](#before-you-begin):** Follow this guide to start and stop sandboxes from your application.
- **[Webhook-managed](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** Deploy a handler that starts or reconnects sandboxes from OpenAI webhooks.

See [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) to compare the two modes.

## Before you begin

You need an OpenAI project API key, a Modal token ID and secret, and the Codex CLI package.

Set `OPENAI_API_KEY` for application requests and a separate restricted `OPENAI_EXECUTOR_API_KEY` for sandbox registration. Grant the application key `api.agents.read` and `api.agents.write` for session operations, plus `api.responses.write` for model inference. Add `api.vaults.read` and `api.vaults.write` if your application manages vaults. Create the executor's [environment key](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) and use the same organization, project, and user or service account for both keys. Only the restricted executor key enters the sandbox.

## 1. Set up the Modal environment

Create a [self-hosted session](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) and save its environment ID. Use the Modal SDK or API to create an isolated sandbox with the configured working directory. Install the Codex CLI in the sandbox, then [start its executor](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) with that environment ID and the restricted executor key.

## 2. Run the session

Use the HTTP examples in [Run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) to send input and stream the result after the Modal executor connects. When finished, [delete the session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) and stop the provider sandbox separately.

## References

- Read [Modal Sandbox documentation](https://modal.com/docs/guide/sandboxes)
- Read [Modal Python SDK reference](https://modal.com/docs/sdk/py/latest/Sandbox)
- Read [Modal JavaScript/TypeScript SDK reference](https://modal.com/docs/sdk/js/latest/Sandbox)