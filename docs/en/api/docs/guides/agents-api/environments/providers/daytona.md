# Daytona

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

See the [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/daytona) and [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/daytona) examples in the OpenAI Cookbook.

See [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) for executor setup and connection requirements.

Choose a provisioning mode:

- **[Application-managed](#application-managed):** Follow this guide to start and stop sandboxes from your application.
- **[Webhook-managed](#webhook-managed):** Deploy a handler that starts or reconnects sandboxes from OpenAI webhooks.

See [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) to compare the two modes.

## Webhook-managed

Use a controller to verify OpenAI webhook deliveries and queue provisioning work. Keep that controller separate from the worker sandbox that runs each session's executor. Follow [Deploy and connect a handler](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#deploy-and-connect-a-handler) to register the endpoint and signing secret.

Handle `environment_connection` requests by starting or reconnecting the worker, and release it when the session fails. Configure worker and controller timeouts explicitly. Stopping compute on idle requires a policy that coordinates with incoming work; see [Lifecycle behavior](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#lifecycle-behavior).

## Application-managed

### Before you begin

You need an OpenAI project API key, a Daytona API key, and the Codex CLI package.

Set `OPENAI_API_KEY`, a separate restricted `OPENAI_EXECUTOR_API_KEY`, and `DAYTONA_API_KEY` in your environment. Grant the application key `api.agents.read` and `api.agents.write` for session operations, plus `api.responses.write` for model inference. Add `api.vaults.read` and `api.vaults.write` if your application manages vaults. Create the executor's [environment key](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) and use the same organization, project, and user or service account for both keys. Only the restricted executor key enters the sandbox.

### 1. Set up the Daytona environment

Create a [self-hosted session](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) and save its environment ID. Use the Daytona SDK or API to create an isolated sandbox with the configured working directory. Install the Codex CLI in the sandbox, then [start its executor](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) with that environment ID and the restricted executor key.

The executor's connection to OpenAI is outbound and long-lived, and Daytona's inactivity tracking does not observe it. Set `auto_stop_interval=0` so the Sandbox is not stopped while the agent is working, and configure a lifetime limit so interrupted runs do not leave compute running indefinitely.

For regular use, put Codex and `ripgrep` in a Daytona snapshot so the Sandbox can connect sooner.

### 2. Run the session

Use the HTTP examples in [Run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) to send input and stream the result after the Daytona executor connects. When finished, [delete the session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) and stop the provider sandbox separately.

Start the Sandbox before submitting input. The turn waits for the environment to connect, and the session reports the connection through `agent.session.environment.connected` on the event stream.

Use `agent.session.turn.completed` to identify a successful turn. A failed or cancelled turn can also be followed by `agent.session.idle`, so do not treat an idle session as proof that the turn succeeded. A session retrieval immediately after an event can briefly return the prior status.

## References

- Read [Daytona documentation](https://www.daytona.io/docs/en/)
- Read [Daytona Python SDK reference](https://www.daytona.io/docs/en/python-sdk/)
- Read [Daytona TypeScript SDK reference](https://www.daytona.io/docs/en/typescript-sdk/)