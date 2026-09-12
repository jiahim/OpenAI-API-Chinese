# Vercel

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

See the [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/vercel) and [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/vercel) examples in the OpenAI Cookbook.

See [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) for executor setup and connection requirements.

Choose a provisioning mode:

- **[Application-managed](#before-you-begin):** Follow this guide to start and stop sandboxes from your application.
- **[Webhook-managed](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** Deploy a handler that starts or reconnects sandboxes from OpenAI webhooks.

See [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) to compare the two modes.

## Before you begin

Use a Vercel project with Sandbox access. How the Vercel Sandbox SDK authenticates depends on where this application is running:

- **Running locally:** set `VERCEL_TOKEN`, `VERCEL_TEAM_ID`, and `VERCEL_PROJECT_ID` in your environment.
- **Deployed on Vercel:** use Vercel OIDC.

Set `OPENAI_API_KEY` for application requests and a separate restricted `OPENAI_EXECUTOR_API_KEY` for sandbox registration. Grant the application key `api.agents.read` and `api.agents.write` for session operations, plus `api.responses.write` for model inference. Add `api.vaults.read` and `api.vaults.write` if your application manages vaults. Create the executor's [environment key](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) and use the same organization, project, and user or service account for both keys. Only the restricted executor key enters the sandbox.

## 1. Set up the Vercel environment

Create a [self-hosted session](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) and save its environment ID. Use the Vercel SDK or API to create an isolated sandbox with the configured working directory. Install the Codex CLI in the sandbox, then [start its executor](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) with that environment ID and the restricted executor key.

For regular use, put Codex in a Vercel snapshot so the sandbox can connect sooner.

## 2. Run the session

Use the HTTP examples in [Run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) to send input and stream the result after the Vercel executor connects. When finished, [delete the session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) and stop the provider sandbox separately.

## References

- Read [Vercel Sandbox documentation](https://vercel.com/docs/sandbox)
- Read [Vercel Sandbox Python SDK reference](https://vercel.com/docs/sandbox/python-sdk-reference)
- Read [Vercel Sandbox JavaScript/TypeScript SDK reference](https://vercel.com/docs/sandbox/sdk-reference)