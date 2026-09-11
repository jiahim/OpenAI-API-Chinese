# Runloop

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Run code and work with files in a Runloop Devbox while OpenAI runs the agent and maintains session state.

This guide uses **application-managed** provisioning: your application starts the Devbox, connects its executor, and shuts it down when finished. See [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) for the lifecycle behavior.

## Before you begin

Use the Runloop SDK or API to manage a Devbox, and HTTP requests to manage Agents API sessions.

Set `RUNLOOP_API_KEY`, `OPENAI_API_KEY`, and a separate restricted `OPENAI_EXECUTOR_API_KEY`. The OpenAI keys must have the same owner, organization, and project. Only the executor key enters the Devbox. See [executor authentication](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication).

## Application-managed

1. [Create a self-hosted session](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) and save its environment ID.
2. Create a Runloop Devbox with the session's working directory and install the Codex CLI inside it.
3. [Start the executor](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor) in the background with the environment ID and restricted executor key.
4. [Send input and inspect the result](https://developers.openai.com/api/docs/guides/agents-api/sessions). For a file task, create `brief.txt` in the workspace and ask the agent to write a migration plan to `plan.md`.
5. Check that the turn completed, retrieve any files you need, then shut down the Devbox and [delete the session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session).

Use bounded setup and execution timeouts, plus a Devbox lifetime limit as a fallback if your application exits unexpectedly. Keep the session and Devbox alive if you need follow-up turns. Use one provisioning owner per session; do not attach a provisioning webhook handler to sessions your application manages directly.

## References

- Read [Runloop documentation](https://docs.runloop.ai/)
- Read [Runloop Python SDK](https://runloopai.github.io/api-client-python/)
- Read [Runloop TypeScript SDK](https://runloopai.github.io/api-client-ts/stable/)