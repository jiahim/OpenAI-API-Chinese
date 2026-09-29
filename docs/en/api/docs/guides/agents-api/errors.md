# Errors and recovery

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

For general HTTP errors and SDK exceptions, see the shared [Error codes guide](https://developers.openai.com/api/docs/guides/error-codes).

## Inspect an error

Check the HTTP response for request errors. For failures during a turn or
environment setup, check events and saved state.

| Failure     | Where to look                                                                                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API request | Read the HTTP status and the response's `error` object.                                                                                                                                            |
| Turn        | On `agent.session.turn.failed`, [retrieve the turn](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/turns/methods/retrieve) and inspect `status` and `error`. |
| Session     | On `agent.session.failed`, [retrieve the session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#inspect-a-session) and inspect `status` and `error`.                                                 |
| Environment | Read `environment.error` in `agent.session.environment.failed`. See [sandbox troubleshooting](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted#troubleshooting).                             |

For structured errors, use `error.code` in application logic and `error.message`
to explain the failure.
For request validation errors, `error.param` can identify the field to correct.
Handle unknown codes and a missing `param` without breaking your error handler.

In the beta API (`OpenAI-Beta: agents=v1`), a session's `error` is a message string
or `null`. Read the accompanying SSE `error` event for the session failure code.

## API request errors

These errors describe the request to the Agents API. They are separate from the
[turn errors](#turn-errors) returned after work starts.

| Code                                                     | Overview                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400: `invalid_request_error`                             | **Cause:** An input or configuration value is invalid. <br /> **Solution:** Correct the field identified by `error.param` or `error.message`. See [Correct invalid input](#correct-invalid-input).                                                                                              |
| 400: `invalid_beta`                                      | **Cause:** The `OpenAI-Beta` header contains an invalid value. <br /> **Solution:** Check the header required by the API version you use.                                                                                                                                                       |
| 400: `agent_not_persisted`                               | **Cause:** The supplied `agent_id` belongs to a session-local agent. <br /> **Solution:** [Create a saved agent](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) and use its ID.                                                                                      |
| 400: `invalid_otlp_endpoint`, `invalid_otlp_header`      | **Cause:** The tracing endpoint or headers are invalid. <br /> **Solution:** Correct your [tracing configuration](https://developers.openai.com/api/docs/guides/agents-api/tracing).                                                                                                                                         |
| 401: `unauthorized`; 403: `forbidden`                    | **Cause:** Authentication failed or the caller lacks access. <br /> **Solution:** Check the API key and its organization, project, and resource permissions.                                                                                                                                    |
| 404: `not_found_error`, `model_not_found`                | **Cause:** The resource or model isn't available to this request. <br /> **Solution:** Check the ID, model, project, and whether the resource was deleted.                                                                                                                                      |
| 409: `conflict_error`                                    | **Cause:** The operation conflicts with the current resource state. <br /> **Solution:** Read the message and retrieve the current state before retrying.                                                                                                                                       |
| 409: `executor_version_incompatible`                     | **Cause:** The executor version isn't supported. <br /> **Solution:** Upgrade the executor, then retry.                                                                                                                                                                                         |
| 424: `mcp_server_startup_failed`                         | **Cause:** An MCP server failed to start. <br /> **Solution:** Check the server's configuration and credentials. See [Troubleshoot connections](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#troubleshoot-connections).                                                                                |
| 500: `internal_error`                                    | **Cause:** The service encountered an unexpected error. <br /> **Solution:** [Retry your request](#retry-transient-failures) after a brief wait and contact us if the issue persists. Check the [status page](https://status.openai.com/). |
| 503: `service_unavailable_error`, `server_is_overloaded` | **Cause:** The service or a dependency is temporarily unavailable or overloaded. <br /> **Solution:** Honor `Retry-After` when present, then retry with increasing delays.                                                                                                                      |

## Turn errors

A failed turn has `status: "failed"` and an `error` with a `code` and `message`.
For example, model overload can produce:

```json
{
  "code": "server_overloaded",
  "message": "The model is temporarily overloaded. Please retry your request after a brief delay."
}
```

Turn codes don't have an HTTP status of their own. For example, a failed turn uses
`server_overloaded`; an HTTP response can use `server_is_overloaded`.

| Code                                                                     | Overview                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `invalid_request`                                                        | **Cause:** Input or configuration is invalid. <br /> **Solution:** Correct the input described in the message before trying again.                                                                                                                                                              |
| `context_length_exceeded`                                                | **Cause:** Input exceeds the model's context window. <br /> **Solution:** Reduce the input. If the conversation is too long, start a new session with a shorter summary.                                                                                                                        |
| `session_budget_exceeded`                                                | **Cause:** The session reached its usage budget. <br /> **Solution:** Start a new session to continue.                                                                                                                                                                                          |
| `credit_balance_exhausted`                                               | **Cause:** The organization has no API credits remaining. <br /> **Solution:** Add credits before retrying.                                                                                                                                                                                     |
| `project_spend_limit_exceeded`                                           | **Cause:** The project reached its enforced spend limit. <br /> **Solution:** Increase or remove the project's [spend limit](https://developers.openai.com/api/docs/guides/spend-limits).                                                                                                                                    |
| `organization_spend_limit_exceeded`                                      | **Cause:** The organization reached its enforced spend limit. <br /> **Solution:** Increase or remove the organization's [spend limit](https://developers.openai.com/api/docs/guides/spend-limits).                                                                                                                          |
| `organization_usage_limit_exceeded`                                      | **Cause:** The organization reached its OpenAI-assigned usage limit. <br /> **Solution:** Request a higher [usage limit](https://developers.openai.com/api/docs/guides/rate-limits#usage-tiers).                                                                                                                             |
| `usage_limit_exceeded`                                                   | **Cause:** A billing or usage limit was reached without a more specific code. <br /> **Solution:** Check credits, spend limits, and usage limits before retrying.                                                                                                                               |
| `rate_limit_exceeded`                                                    | **Cause:** Requests exceeded an available rate limit. <br /> **Solution:** Reduce the request rate and [retry with increasing delays](#retry-transient-failures).                                                                                                                               |
| `server_overloaded`                                                      | **Cause:** The model service is temporarily overloaded. <br /> **Solution:** [Retry the unfinished work after a delay](#retry-transient-failures). If overload persists, [change the model for later turns](https://developers.openai.com/api/docs/guides/agents-api/configuration#update-settings-for-an-existing-session). |
| `flex_unavailable`                                                       | **Cause:** Flex processing is temporarily unavailable. <br /> **Solution:** Retry later or [change the session's service tier](https://developers.openai.com/api/docs/guides/agents-api/configuration#update-settings-for-an-existing-session) to standard processing (`default`) for later turns.                           |
| `connection_failed`, `request_timeout`, `server_error`, `internal_error` | **Cause:** A connection, timeout, or service failure prevented completion. <br /> **Solution:** Check saved work, then [retry with a limit on attempts](#retry-transient-failures).                                                                                                             |
| `authentication_error`                                                   | **Cause:** Model access failed because of credentials or permissions. <br /> **Solution:** Check the API key and its organization, project, and model access.                                                                                                                                   |
| `resource_not_found`                                                     | **Cause:** The requested model or resource is unavailable. <br /> **Solution:** Check the model and session configuration before retrying.                                                                                                                                                      |
| `sandbox_error`                                                          | **Cause:** The environment couldn't complete an operation. <br /> **Solution:** Inspect the environment error and fix its configuration or connectivity.                                                                                                                                        |
| `executor_version_incompatible`                                          | **Cause:** The executor can't run this turn. <br /> **Solution:** Upgrade the executor, then retry on the same session if it hasn't failed.                                                                                                                                                     |
| `active_turn_not_steerable`                                              | **Cause:** The active turn can't accept more input. <br /> **Solution:** Wait for it to finish before sending another message.                                                                                                                                                                  |
| `cyber_policy`, `misalignment_policy_violation`                          | **Cause:** Safety systems blocked the request. <br /> **Solution:** Review the request against the applicable safety requirements before submitting revised input.                                                                                                                              |

Billing errors need a billing action, not a faster retry loop. A generic
`usage_limit_exceeded` can still occur when a more specific cause isn't available.

## Session and environment errors

A failed turn doesn't always mean the session has failed. Retrieve the session to
decide whether you can continue it. If `status` is `requires_action`, handle its
[required actions](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#handle-required-actions).
If the session has failed, fix the cause and create a new session with the inputs
you still need.

| Code                                                              | Overview                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `environment_connection_failed`, `environment_connection_timeout` | **Cause:** The sandbox couldn't connect or took too long to connect. <br /> **Solution:** Check executor startup and network access. For self-hosted environments, check the [connection setup](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted). |
| `sandbox_error`                                                   | **Cause:** Sandbox setup or execution failed. <br /> **Solution:** Inspect setup commands, packages, input files, and the environment error.                                                                                                           |
| `executor_version_incompatible`                                   | **Cause:** The session's executor version isn't supported. <br /> **Solution:** Upgrade the executor before creating a new session.                                                                                                                    |
| `idle_timeout`                                                    | **Cause:** The hosted environment expired due to inactivity. <br /> **Solution:** Create a new session and supply the inputs again.                                                                                                                    |
| `internal_error`                                                  | **Cause:** An internal failure prevented the session or environment from becoming ready. <br /> **Solution:** Retry setup after a delay. Contact support if it keeps failing.                                                                          |

## Recovery

### Retry transient failures

Use this procedure for rate limits, overload, timeouts, and temporary service
failures. Fix invalid input, credentials, and billing limits before retrying them.

1. **Check the outcome.** If a session was created, retrieve it, the turn, and [saved items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#fetch-items-and-turns). If the turn is still active, keep following it. If it completed, use its result.
2. **Check completed actions.** A failed turn may already have changed files or called external tools. Confirm those effects before asking the agent to repeat work.
3. **Wait and limit retries.** Honor `Retry-After` when an HTTP response includes it. Otherwise, use [exponential backoff with jitter](https://developers.openai.com/api/docs/guides/rate-limits#retrying-with-exponential-backoff): increase the delay between attempts and add a small random delay. Set an attempt limit or deadline.
4. **Retry the request or start a new turn.** For an HTTP error, retry the original operation after checking its outcome. For a failed turn, wait until the session is `idle`, then [send a follow-up message](https://developers.openai.com/api/docs/guides/agents-api/sessions#continue-or-steer-the-work) asking it to continue only unfinished work. This starts a new turn with the existing conversation.

Inspect tool results even when a turn completes. Stop automatic retries if the error changes or the
retry limit is reached.

### Correct invalid input

Correct the field identified by `error.param` or `error.message` before resubmitting.
For upload requirements and examples, see [Resolve upload errors](https://developers.openai.com/api/docs/guides/agents-api/environments/files#resolve-upload-errors).
If the message identifies an image problem, check the image data or URL.

### Disconnected streams

An `error` event or a disconnected stream doesn't confirm the turn's final state.
Follow [Recover a disconnected stream](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#how-to-recover-a-disconnected-stream)
to reconnect and check saved work before resubmitting input.

If failures persist, keep the request ID, session ID, turn ID, error code, and
time of the failure for support.