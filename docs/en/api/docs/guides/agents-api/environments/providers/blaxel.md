# Blaxel

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Run an Agents API session with a Blaxel sandbox.

See [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) for executor setup and connection requirements.

Choose a provisioning mode:

- **[Application-managed](#before-you-begin):** Follow this guide to start and stop sandboxes from your application.
- **[Webhook-managed](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes):** Deploy a handler that starts or reconnects sandboxes from OpenAI webhooks.

See [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) to compare the two modes.

## Before you begin

You need an OpenAI project API key, a Blaxel API key and workspace, and the Codex CLI package.

Set `OPENAI_API_KEY`, a separate restricted `OPENAI_EXECUTOR_API_KEY`, `BL_API_KEY`, and `BL_WORKSPACE` in your environment. Grant the application key `api.agents.read` and `api.agents.write` for session operations, plus `api.responses.write` for model inference. Add `api.vaults.read` and `api.vaults.write` if your application manages vaults. Create the executor's [environment key](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) and use the same organization, project, and user or service account for both keys. Only the restricted executor key enters the sandbox. Choose the sandbox region in your provisioning code. Use `us-was-1` if you need the Agent Drive persistence option below.

## 1. Set up the Blaxel environment

Create a [self-hosted session](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) and save its environment ID. Use the Blaxel SDK or API to create an isolated sandbox with the configured working directory. Install the Codex CLI in the sandbox, then [start its executor](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) with that environment ID and the restricted executor key.

The Blaxel Node image uses Alpine Linux, so install `ripgrep` with `apk`. Pass the restricted executor key as `CODEX_API_KEY` only to the executor process. Set `keep_alive=True` to prevent the sandbox from scaling to zero while the executor runs. Bounded setup, executor, and sandbox timeouts prevent abandoned resources from running indefinitely.

For regular use, build a Blaxel image with Codex and `ripgrep` already installed so the sandbox can connect sooner.

## 2. Run the session

Use the HTTP examples in [Run and continue sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions) to send input and stream the result after the Blaxel executor connects. When finished, [delete the session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) and stop the provider sandbox separately.

Start the sandbox before submitting input. The turn waits for the environment to connect, and the session reports the connection through `agent.session.environment.connected` on the event stream.

Use `agent.session.turn.completed` to identify a successful turn. A failed or cancelled turn can also be followed by `agent.session.idle`, so do not treat an idle session as proof that the turn succeeded.

## Optional: Persist files between sessions

Use [Blaxel Agent Drive](https://docs.blaxel.ai/Agent-drive/Overview) to preserve files across sandboxes and sessions. Mount the same drive in each sandbox to share files; Agent Drive requires the `us-was-1` region and does not transfer conversation history or session state.

## References

- Read [Blaxel Sandbox documentation](https://docs.blaxel.ai/Sandboxes/Overview)
- Read [Blaxel Python SDK](https://docs.blaxel.ai/sdk-reference/sdk-python)
- Read [Blaxel TypeScript SDK](https://docs.blaxel.ai/sdk-reference/sdk-ts)