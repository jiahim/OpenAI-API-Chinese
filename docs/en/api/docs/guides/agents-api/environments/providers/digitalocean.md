# DigitalOcean

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

See the [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/digitalocean) and [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/digitalocean) examples in the OpenAI Cookbook.

## How it works

DigitalOcean's Managed Agents Runtime Services (M.A.R.S.) starts a Firecracker microVM using the `codex-agentapi` image. The image includes Codex and starts the executor, which connects outbound to the Agents API.

Choose **[webhook-managed](#webhook-managed)** provisioning to start or resume sandboxes from OpenAI events, or **[application-managed](#application-managed)** provisioning to control them from your application. For an interactive quickstart, use the optional [DigitalOcean CLI flow](#try-it-with-the-digitalocean-cli). See [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) for connection and recovery behavior.

M.A.R.S. is in invite-only private preview. Request access through [DigitalOcean's private-preview announcement](https://www.digitalocean.com/blog/managed-agents-runtime-services-private-preview).

## Before you begin

You need a sandbox-enabled DigitalOcean account with access to `codex-agentapi` and an OpenAI project with Agents API access.

Set `OPENAI_API_KEY` for your application or CLI and a separate restricted `OPENAI_EXECUTOR_API_KEY` for the sandbox. The keys must have the same owner, organization, and project. Store only the executor key in the sandbox's `CODEX_API_KEY` secret. See [executor authentication](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication).

For webhook controllers or Python applications, set `DIGITALOCEAN_TOKEN` and install the [PyDo beta SDK](https://github.com/digitalocean/pydo/releases/tag/v0.40.0-beta.7) with async support (`pydo[aio]`). Use the [OpenAI SDK](https://developers.openai.com/api/docs/libraries#install-an-official-sdk) for Agents API requests. CLI installation is needed only for the CLI flow.

## Webhook-managed

1. [Create a stored agent](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) and save its ID as `OPENAI_AGENT_ID`. Deploy an HTTPS webhook controller in DigitalOcean App Platform with this ID, `OPENAI_API_KEY` for session reads, `DIGITALOCEAN_TOKEN`, and `OPENAI_EXECUTOR_API_KEY`.
2. [Register its `/webhook` endpoint](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks) with your OpenAI project. Enable `agent.session.action_required` and `agent.session.failed`, then store the signing secret as `OPENAI_WEBHOOK_SECRET` and redeploy the controller.
3. Follow the [session steps](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#run-a-session) with the same `OPENAI_AGENT_ID` and `/workspace` as the working directory. Open the event stream and send input. When OpenAI requests an `environment_connection`, the controller verifies the signature, retrieves the current session, and checks its agent ID and required actions. It looks up `mars-{session_id}` in DigitalOcean and resumes a paused sandbox or creates one if none is active.
4. On `agent.session.failed`, retrieve the session again and delete its sandbox only if the current session status is still `failed`.

The image connects the executor to the session's environment. Your application sends input and streams results through the Agents API; the controller handles provisioning and reconnection. Serialize provisioning per session to handle duplicate and concurrent deliveries. See [webhook-managed lifecycle guidance](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes) for controller requirements.

## Try it with the DigitalOcean CLI

The CLI creates both resources and lets you interact with the agent from your terminal. It provisions the sandbox directly, without a webhook controller.

Install the [`doctl` beta release](https://github.com/digitalocean/doctl/releases/tag/v1.168.0-beta.8) that includes `harness-runtime`, then authenticate:

```bash
doctl auth init
```

Save this manifest as `agents.yaml`:

```yaml
name: openai-codex-session
agent: codex-agentapi
config:
  agent:
    model: gpt-5.6-sol
    instructions: Work from the files in /workspace.
  environment:
    type: self_hosted
    workspace_directory: /workspace
egress:
  - api.openai.com
  - codex-cloud-environments.chatgpt.com
env:
  CODEX_ENVIRONMENT_ID: ${ENV_ID}
secrets:
  CODEX_API_KEY: ${OPENAI_EXECUTOR_API_KEY}
```

The `config` block is the OpenAI create-session request. The CLI authenticates that request with `OPENAI_API_KEY`, fills `${ENV_ID}` from the response, and passes only the restricted executor key to the sandbox. Keep resolved manifests out of logs and source control. Add any destinations your tools need to `egress`.

Create the session and sandbox:

```bash
doctl harness-runtime create --spec agents.yaml
```

The command waits up to 300 seconds for readiness by default. Save the OpenAI session ID and DigitalOcean session ID from the session details, then attach:

```bash
doctl harness-runtime launch openai-codex-session
```

Ask the agent to write `hello` to `/workspace/hello.txt` and read it back. Press **Ctrl+D** to detach without deleting the session, and run the same `launch` command to reattach. Follow [Cleanup](#cleanup) when finished.

## Application-managed

Use this path when your application owns session creation and sandbox provisioning. Create the OpenAI session first:

Create a self-hosted session

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const session = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions:
      "You are a helpful coding assistant. Write clean code and verify that it works.",
  },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace",
  },
});

console.log(session);
```

```python
from openai import OpenAI

client = OpenAI()

session = client.beta.agents.sessions.create(
    agent={
        "model": "gpt-6-astra",
        "instructions": "You are a helpful coding assistant. Write clean code and verify that it works.",
    },
    environment={"type": "self_hosted", "workspace_directory": "/workspace"},
)
print(session.to_json())
```

```go
import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

ctx := context.Background()
client := openai.NewClient()
result, err := client.Beta.Agents.Sessions.New(ctx,
	openai.BetaAgentSessionNewParams{
		Agent: openai.BetaAgentSessionNewParamsAgent{
			Model:        openai.String("gpt-6-astra"),
			Instructions: openai.String("You are a helpful coding assistant. Write clean code and verify that it works."),
		},
		Environment: openai.EnvironmentParamUnion{
			OfParamSelfHosted: &openai.EnvironmentParamSelfHosted{WorkspaceDirectory: "/workspace"},
		},
	})
if err != nil {
	panic(err)
}
fmt.Println(result)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var result =
    client
        .beta()
        .agents()
        .sessions()
        .create(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .instructions(
                            "You are a helpful coding assistant. Write clean code and verify"
                                + " that it works.")
                        .build())
                .environment(
                    EnvironmentParam.SelfHosted.builder()
                        .workspaceDirectory("/workspace")
                        .build())
                .build());
System.out.println(result);
```

```ruby
require "openai"

client = OpenAI::Client.new
result = client.beta.agents.sessions.create(
  agent: {
    model: "gpt-6-astra",
    instructions: "You are a helpful coding assistant. Write clean code and verify that it works."
  },
  environment: {
    type: "self_hosted",
    workspace_directory: "/workspace"
  }
)
puts result
```


Save `session.id` and the environment ID as described in [Connect a sandbox](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session). Save this sandbox-only manifest as `sandbox.yaml`; the agent configuration was already sent to OpenAI:

```yaml
agent: codex-agentapi
egress:
  - api.openai.com
  - codex-cloud-environments.chatgpt.com
env:
  CODEX_ENVIRONMENT_ID: ${ENV_ID}
secrets:
  CODEX_API_KEY: ${OPENAI_EXECUTOR_API_KEY}
```

1. Create a `pydo.aio.Client` using `DIGITALOCEAN_TOKEN` and call `client.agents.create_session`. Set `params.openai_session_id` to the OpenAI session ID, `body.manifest` to the contents of `sandbox.yaml`, and `body.variables` to a mapping of `ENV_ID` and `OPENAI_EXECUTOR_API_KEY` to their values. Save the returned DigitalOcean `session_id`.
2. [Open the event stream and send input](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input), asking the agent to write and read `/workspace/hello.txt`. Input waits for the executor to connect. Confirm the connection event and a completed turn, and inspect the agent's output for tool failures.
3. Retrieve the file with `workspace_download`, using the relative path `hello.txt`. Keep both resources for follow-up turns, or [clean up](#cleanup).

Use bounded setup and execution timeouts and handle connection failures in your application. Do not attach a provisioning webhook handler to sessions your application or CLI manages directly.

## Cleanup

Save any files you need, then [delete the OpenAI session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) and destroy the DigitalOcean sandbox. Session deletion does not emit a webhook, so perform both operations and report cleanup failures.

With PyDo, call `client.agents.destroy_session` with the DigitalOcean session ID. With the CLI, pass that ID or the sandbox's name:

```bash
doctl harness-runtime remove openai-codex-session
```

Remove the OpenAI webhook registration before deleting a webhook controller.

## References

- Read [DigitalOcean sandbox setup](https://github.com/digitalocean/pydo/tree/v0.40.0-beta.7/examples/agents/doc_python_sdk)
- Read [DigitalOcean Python SDK](https://github.com/digitalocean/pydo)
- Read [DigitalOcean CLI beta release](https://github.com/digitalocean/doctl/releases/tag/v1.168.0-beta.8)