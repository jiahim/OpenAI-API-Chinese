# E2B

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

See the [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/e2b) and [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/e2b) examples in the OpenAI Cookbook.

Choose a provisioning mode:

- **[Application-managed](#application-managed):** Your application creates and connects the E2B sandbox directly.
- **[Webhook-managed](#webhook-managed):** Deploy a handler that starts or reconnects sandboxes from OpenAI webhooks.

See [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) to compare the two modes.

## Before you begin

Set `E2B_API_KEY`, `OPENAI_API_KEY`, and a separate restricted `OPENAI_EXECUTOR_API_KEY`. Keep the application key outside the worker sandbox. The executor key must match the session owner's organization, project, and user or service account. See [executor authentication](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication).

## Webhook-managed

Implement a controller that verifies OpenAI webhooks and provisions a separate E2B worker for each session. Follow [Deploy and connect a handler](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#deploy-and-connect-a-handler) for credentials, endpoint registration, and signature verification.

Persist the session-to-sandbox mapping. On a connection request, resume a paused worker or replace a deleted one. Pausing preserves its files; replacement does not. Set running timeouts for the controller and workers, and remove the OpenAI webhook when you stop using the controller.

## Application-managed

Use the E2B SDK or API from your application to manage the sandbox:

1. [Create a self-hosted session](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) and save its environment ID.
2. Create an isolated E2B sandbox with the session's working directory and install the Codex CLI inside it.
3. [Start the executor](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) in the sandbox using the environment ID and restricted executor key.
4. Use [Run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) to send input and check the turn's outcome.
5. [Delete the session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) and stop the E2B sandbox when finished.

Configure the sandbox lifetime separately from the timeout for the executor command. A command with no timeout does not keep an expired sandbox running.

## References

- Read [E2B documentation](https://docs.e2b.dev/)
- Read [E2B Python SDK](https://github.com/e2b-dev/E2B/tree/main/packages/python-sdk)
- Read [E2B TypeScript SDK](https://github.com/e2b-dev/E2B/tree/main/packages/js-sdk)