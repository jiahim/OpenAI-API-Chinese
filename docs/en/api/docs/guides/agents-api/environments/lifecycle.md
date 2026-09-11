# Sandbox lifecycle

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

An agent session can outlive its environment. Your application manages the compute and files used by a `self_hosted` environment.






## Start an environment

Your application can start compute after creating a session. Use your [provider's SDK or API](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#sandbox-providers), then [connect the executor](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) with the session's environment ID and an environment key.

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/application-managed-sandboxes-mobile.webp"
    width="680"
    height="1296"
  />
  <img src="https://developers.openai.com/images/api/agents-api/application-managed-sandboxes.webp"
    width="1400"
    height="788"
    alt="The application sends input, receives events, and controls provider compute. The sandbox executor connects outbound to the Agents API, then exchanges commands and results over the connection."
    loading="lazy"
  />
</picture>

Use one component to manage each session's environment. Store the mapping between the session and provider compute. Repeated or concurrent requests must not create duplicate environments.




### Start compute from webhooks

You can also wait until input needs an environment connection. The API emits `agent.session.action_required` with `required_action.type: "environment_connection"` before waiting for the executor. Your webhook handler starts or reconnects the environment.

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/webhook-managed-sandboxes-mobile.webp"
    width="680"
    height="1812"
  />
  <img src="https://developers.openai.com/images/api/agents-api/webhook-managed-sandboxes.webp"
    width="1400"
    height="1072"
    alt="The application exchanges input and events with the Agents API. A webhook controller verifies connection requests, checks the current session, and starts or reconnects a provider sandbox. Its executor connects outbound and exchanges commands and results."
    loading="lazy"
  />
</picture>




Follow [webhook setup](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks#set-up-a-webhook) to register your handler for `agent.session.action_required` and `agent.session.failed`. Keep its signing secret and session-read credential separate from the executor's [environment key](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication). If multiple provider handlers share a project, route events to the handler that owns the session.




The handler and worker have separate jobs:

1. **Verify and queue.** Verify the webhook signature. Queue connection requests only when `data.required_action.type` is `environment_connection`. Also queue session failures. Return a successful HTTP response only after queuing succeeds.
2. **Check current state.** The worker retrieves the session. Ignore deleted sessions and resolved actions. For a self-hosted session that still needs a connection, start or reconnect its executor using `session.environment.id` and `session.environment.remote_url`. For a session that is still failed, release its compute.

The session stream reports the same request as `agent.session.requires_action`. A `function_call` required action needs a function result, not environment startup. Turn creation and `agent.session.in_progress` events arrive too late to start an offline executor.




After deploying the handler, [create a self-hosted session](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-a-session) and [send input](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input). Match the working directory and any agent filter configured in your handler. The original submission continues if the executor connects before the deadline.




## Keep the environment available or stop it

Keep compute running between turns for reuse, or allow a grace period after a turn ends before stopping it. Coordinate shutdown with incoming work. Cancel a pending shutdown when a connection is requested or execution starts. Recheck state before stopping compute.

An idle event alone is not a safe shutdown signal. It can arrive when a connection request clears, before waiting input starts its turn. If your application cannot coordinate shutdown with incoming work, keep the environment running.






## Reconnect after a disconnect

Connection events report state. Use `agent.session.environment.connected` and `agent.session.environment.disconnected` to observe connections. Setup can also emit `agent.session.environment.pending` or `agent.session.environment.failed`. These events do not request compute. Use the `environment_connection` required action to trigger startup, and check provider health separately.

A mid-turn disconnect can fail a tool even if the turn completes. Inspect tool results and the agent's final response. The disconnect does not automatically request reconnection through a webhook or restart a killed command. Later input can request reconnection.

The API waits up to five minutes for an input-time connection. Configure client and proxy timeouts for this wait. If it expires, the submission fails. Initial input can fail asynchronously and leave the session in `failed`.

The API does not guarantee recovery of pending input after a process crash. Check the request or session outcome before retrying. Do not resubmit while the original request is waiting. A late connection does not replay input that timed out.

Reusing the environment ID does not restore files in replacement compute. Use provider storage or snapshots to preserve them.

## Clean up

Stop accepting new input. Coordinate cleanup with any startup work already in progress to avoid leaving compute running.

[Delete the session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) and stop provider compute separately. Deleting a session neither stops its environment nor emits a deletion webhook.