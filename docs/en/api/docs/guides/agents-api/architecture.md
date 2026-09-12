# Architecture

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

OpenAI runs the agent harness. Your application sends it work and receives results. Add an environment when the agent needs compute or files.

## The pieces

- **Harness:** The OpenAI-hosted Codex instance that runs the model and tool loop and maintains the agent's session.
- **Environment:** Where the agent runs commands, executes code, and works with files. An environment can be a remote sandbox, your laptop, a Docker container, or an AWS Lambda function.
- **Application server:** Your code that connects the agent to your product. It submits tasks, receives events, and handles function tools. When you provide the environment, your code also manages its lifecycle.

Start with the pieces your task needs. The harness can work without an environment, and your application can receive progress through streaming or webhooks.

## Start without an environment

An agent that answers questions or uses tools to access external services may not need its own compute or files. Set `environment.type` to `none`. This fragment shows the environment setting. Session creation also needs an agent and initial input:

```json
{
  "environment": {
    "type": "none"
  }
}
```

Your application sends input to a session. The harness calls the model, uses the configured tools, and returns results. OpenAI maintains the session for later work.

The harness can call remote MCP tools directly. For [function tools](https://developers.openai.com/api/docs/guides/agents-api/tools/functions), your code receives each call, runs the function, and returns its result.

Without an environment, the built-in Bash and apply-patch tools, workspace files, and executor MCPs are unavailable.

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/architectures-4-mobile.webp"
    width="680"
    height="1260"
  />
  <img src="https://developers.openai.com/images/api/agents-api/architectures-4.webp"
    width="1400"
    height="844"
    alt="With no sandbox, the application supplies function tools or a virtual shell, and the Agents API can call remote MCP servers. There is no executor or built-in shell."
    loading="lazy"
  />
</picture>

The optional virtual runtime shown here provides files and shell commands through your application's function tools.

## Add an OpenAI-hosted environment

When the agent needs to run scripts, edit files, or create artifacts, set `environment.type` to `openai_hosted`. OpenAI creates and manages a sandbox for the session.

You configure the packages, files, and network access the agent needs. The harness runs commands in the sandbox directly. Your application continues to send tasks, receive events, and handle any function tools.

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/architectures-1-mobile.webp"
    width="680"
    height="1348"
  />
  <img src="https://developers.openai.com/images/api/agents-api/architectures-1.webp"
    width="1400"
    height="700"
    alt="An application starts sessions and receives events from the Agents API, which runs the managed Codex harness and exchanges tool calls and results with a sandbox. The application controls compute only for self-hosted sandboxes."
    loading="lazy"
  />
</picture>

The dashed arrow applies only when you manage the environment yourself, as described below.

See [OpenAI-hosted environments](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted) for configuration options.

## Connect your own environment

Use `environment.type: "self_hosted"` when the agent needs your infrastructure, private network, or custom software.

Your code starts the environment and connects an executor to the session. The executor runs the commands and tools that the harness requests. Your application manages the connection and lifecycle without forwarding each command.

You own provisioning, reconnection, shutdown, and any files you need to preserve. Your application server or a webhook handler can manage this work.

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/architectures-2-mobile.webp"
    width="680"
    height="1560"
  />
  <img src="https://developers.openai.com/images/api/agents-api/architectures-2.webp"
    width="1400"
    height="1320"
    alt="The application creates a self-hosted session, starts compute, and connects an executor. It receives events and checks the turn outcome before stopping compute."
    loading="lazy"
  />
</picture>

Before stopping compute, coordinate incoming work and confirm that no execution is pending.

See [Connect a sandbox](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) and [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) for setup and shutdown requirements.

## Receive progress and results

With any environment choice, you can use either or both of these:

- **Streaming:** Receive detailed events as the agent works, such as output to display in your product.
- **Webhooks:** Receive session state changes without keeping a stream open. Your handler can retrieve results, run function tools, or manage a self-hosted environment.

Function tools need a handler that receives calls and returns results. If that handler is unavailable, the agent can remain waiting for a result. Failures in your event or lifecycle handlers can also interrupt progress updates or environment management.

See [Session events](https://developers.openai.com/api/docs/guides/agents-api/sessions) and [Webhooks](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks) for integration details.