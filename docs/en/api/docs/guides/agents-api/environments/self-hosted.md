# Self-hosted sandboxes

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Connect your own environment when you want more control over the agent's environment or want to use compute you trust. The environment can be a laptop, a container, or a remote sandbox. To have OpenAI provision the environment, use an [OpenAI-hosted sandbox](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted).




## How the connection works

OpenAI runs the [agent harness](https://developers.openai.com/api/docs/guides/agents-api/architecture#the-pieces). You run `codex exec-server`, the executor, inside your environment. It runs shell commands, reads and writes files, and uses local MCP servers at the harness's request.

The executor registers with the API using an environment ID and a restricted API key. It then connects over WebSocket to receive commands and return results. All connections are outbound. The executor reconnects if the connection drops.

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/self-hosted-sandboxes-1-mobile.webp"
    width="680"
    height="876"
  />
  <img src="https://developers.openai.com/images/api/agents-api/self-hosted-sandboxes-1.webp"
    width="1400"
    height="444"
    alt="The sandbox executor initiates an outbound connection to the Agents API and exchanges commands and results. The sandbox holds the restricted executor key and environment ID."
    loading="lazy"
  />
</picture>




## Prepare your environment

Prepare the files and dependencies your agent needs. Isolate environments by user or workload. Agents that share an environment can access the same files, credentials, and other resources.

Create the working directory and install the Codex CLI inside the environment. This example uses `/workspace`:

```bash
mkdir -p /workspace
npm install -g @openai/codex@alpha
```




### Network access

Allow outbound connections to these hosts:

- `https://api.openai.com` for environment registration.
- `wss://codex-cloud-environments.chatgpt.com` for commands and results.

### Authentication

Create a separate restricted executor key. It must belong to the same organization, project, and user or service account that owns the session.

Create an environment key on the [Agents tab](https://platform.openai.com/agents?tab=environments&environment_view=keys) in the platform dashboard. Set every other permission to **None**. Supply this key to the environment as `CODEX_API_KEY`. Keep your broader application API key outside the environment.

Agent-generated code can read the executor key, but the key only permits connecting environments. It cannot authorize any other API action. Keep it out of source code, container images, and logs. Rotate or revoke it when needed.




## Create a session

Run this example in your application, outside the environment. If you already have a self-hosted session, reuse it.

Create a session with your own environment

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


Store `session.id` with your application's conversation state. Pass `session.environment.id` and `session.environment.remote_url` to the executor. Use the remote URL unchanged, including when reconnecting. See [Configuring Agents](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) to use a stored agent.




You can reuse your environment image, `workspace_directory`, and `capability_directories` across sessions. Each session has its own environment ID and needs its own executor. API [environment templates](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins#reuse-a-hosted-plugin-setup) apply only to OpenAI-hosted environments.

## Start the executor

Open the [session event stream](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#consume-a-stream) from your application to receive connection events. Then run this command inside the environment with the restricted `CODEX_API_KEY` configured above. Replace the placeholders with the environment values returned by the API:

```bash
codex exec-server \
  --remote "<session.environment.remote_url>" \
  --environment-id "<session.environment.id>"
```

Leave the executor running while the agent works.




## Send work and monitor the connection

[Send input](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input) from your application while the event stream stays open. The agent needs both a connected environment and user input to start work.

The stream reports these connection states:

- `agent.session.environment.pending`: The session is waiting for the executor to connect.
- `agent.session.environment.connected`: The environment is ready.
- `agent.session.environment.failed`: The connection failed. Check the environment error and executor logs.

Continue following the stream for the turn's outcome and output. See [Environment lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) to manage startup, reconnection, and shutdown from your application or through webhooks.

## Sandbox providers

Choose a sandbox provider to run code and work with files. See [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) to compare application-managed and webhook-managed provisioning.

| Provider                          | Guide                                                                                 |
| --------------------------------- | ------------------------------------------------------------------------------------- |
| Modal                             | [Modal setup](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/modal)               |
| Cloudflare                        | [Cloudflare setup](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/cloudflare)     |
| Vercel                            | [Vercel setup](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/vercel)             |
| Daytona                           | [Daytona setup](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/daytona)           |
| Blaxel                            | [Blaxel setup](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/blaxel)             |
| E2B                               | [E2B setup](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/e2b)                   |
| Runloop                           | [Runloop setup](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/runloop)           |
| DigitalOcean                      | [DigitalOcean setup](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/digitalocean) |
| Oracle Cloud Infrastructure (OCI) | [OCI setup](https://developers.openai.com/api/docs/guides/agents-api/environments/providers/oci)                   |

For webhook-managed provisioning, implement a handler using [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#start-compute-from-webhooks) and your provider's SDK or API. Keep provisioning ownership and cleanup policies explicit.