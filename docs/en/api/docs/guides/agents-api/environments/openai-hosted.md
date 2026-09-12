# OpenAI-hosted sandboxes

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

An OpenAI-hosted sandbox gives your agent a Linux workspace with Python, Node.js,
and command-line tools. OpenAI provisions and connects it; your application supplies
the task and retrieves the results. Choose a [self-hosted sandbox](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)
when you need your own image, compute, or private network.

## Configure the sandbox

Set `environment.type` to `openai_hosted` and add only the settings your workload
needs. The working directory is `/workspace`.

- `packages`: Install Python, system, or global `npm` packages with `python`, `system`, or `npm` lists. Pin versions when needed, such as `pandas==2.2.3`.
- `setup_commands`: Run ordered shell commands before the agent starts, such as `[{ "command": "mkdir -p reports" }]`. Each command has its own optional `cwd`, defaulting to `/workspace`.
- `files`: [Supply input files](https://developers.openai.com/api/docs/guides/agents-api/environments/files#upload-files) by Files API ID or inline base64 content.
- `env`: Set string-valued environment variables. Runtime-reserved names, including `PATH`, `CODEX_*`, and `OPENAI_API_KEY`, are rejected.
- `skills`, `plugins`, `capability_directories`: Add [skills](https://developers.openai.com/api/docs/guides/tools-skills#agents-api) and [plugins](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins).
- `environment_template_id`: [Reuse saved configuration](https://developers.openai.com/api/docs/guides/agents-api/tools/plugins#reuse-a-hosted-plugin-setup) across sessions. Omitted settings inherit the template; network overrides cannot broaden its policy.

Packages and input files are prepared before setup commands run. A nonzero setup
exit status prevents the agent from starting. Use a setup command to check required
dependencies or files. Templates save configuration, not a running workspace.

### Control network access

| `network.access` | Behavior                                                                         |
| ---------------- | -------------------------------------------------------------------------------- |
| `enabled`        | Allow outbound access. This is the default unless you inherit a template policy. |
| `disabled`       | Block outbound access.                                                           |
| `restricted`     | Allow only the hosts listed in `allowed_domains`.                                |

Restricted mode accepts 1–100 exact host names, such as `api.example.com`.
Do not include wildcards, protocols, paths, or ports. Subdomains and redirect
destinations need their own entries. Hosted stdio MCP servers currently require
`enabled` access; see [stdio MCP requirements](https://developers.openai.com/api/docs/guides/agents-api/tools/mcp#start-a-server-over-stdio).

### Check that setup succeeded

The create-session response means setup has started. Retrieve
`GET /v1/agents/environments/{environment_id}` using the session's `environment.id`:
`provisioning` means setup is running; `connected` means setup succeeded.
For `failed`, read `environment.error` in the `agent.session.environment.failed`
event. Wait for `connected` before adding or listing live files.

## Files and lifetime

Each session has a separate workspace. Files persist across turns while its
sandbox exists. Files under `/workspace/outputs` are published as immutable
artifacts when a turn completes; those copies remain downloadable after the
sandbox expires.

Use [Files and artifacts](https://developers.openai.com/api/docs/guides/agents-api/environments/files) for uploads,
path rules, live file operations, downloads, and limits. Save outputs you need
before deleting the session.

### Sandbox expiry

Connected sandboxes receive keep-alives, including between turns. If activity and
keep-alives stop for an hour, the sandbox can be deleted. This timeout isn’t
configurable.

Delete the session when you're done to request sandbox cleanup. If deletion
returns `409` while setup or execution finishes, wait and retry with a limit on
the number of attempts. Closing an event stream does not cancel the task.

## Pricing

OpenAI-hosted sandboxes use standard [container rates](https://developers.openai.com/api/docs/pricing#built-in-tools).
Model usage is billed separately at the selected model's [API rates](https://developers.openai.com/api/docs/pricing).

## Example: Create a report

Give the agent a CSV containing `10`, `20`, and `30`. It runs Python to calculate
the sum and writes `/workspace/outputs/summary.json`.

Set `OPENAI_API_KEY` in your application terminal using the
[quickstart prerequisites](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites).
Keep this key outside the sandbox. Use a version of your
[OpenAI SDK](https://developers.openai.com/api/docs/libraries) that includes the beta Agents API.

Create summary.json

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const stream = await client.beta.agents.sessions.create({
  agent: { model: "gpt-6-astra" },
  environment: {
    type: "openai_hosted",
    network: { access: "disabled" },
    files: [
      {
        type: "inline",
        path: "/workspace/amounts.csv",
        data: "YW1vdW50CjEwCjIwCjMwCg==",
      },
    ],
  },
  input:
    "Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.",
  stream: true,
});

for await (const event of stream) {
  console.log(event);
}
```

```python
from openai import OpenAI

client = OpenAI()
stream = client.beta.agents.sessions.create(
    agent={"model": "gpt-6-astra"},
    environment={
        "type": "openai_hosted",
        "network": {"access": "disabled"},
        "files": [
            {
                "type": "inline",
                "path": "/workspace/amounts.csv",
                "data": "YW1vdW50CjEwCjIwCjMwCg==",
            }
        ],
    },
    input="Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.",
    stream=True,
)

with stream:
    for event in stream:
        print(event.model_dump_json())
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	ctx := context.Background()
	client := openai.NewClient()
	stream := client.Beta.Agents.Sessions.NewStreaming(ctx, openai.BetaAgentSessionNewParams{
		Agent: openai.BetaAgentSessionNewParamsAgent{Model: openai.String("gpt-6-astra")},
		Environment: openai.EnvironmentParamUnion{OfParamOpenAIHosted: &openai.EnvironmentParamOpenAIHosted{
			Network: openai.EnvironmentParamOpenAIHostedNetwork{Access: "disabled"},
			Files: []openai.HostedEnvironmentFileParamUnion{{OfParamInline: &openai.HostedEnvironmentFileParamInline{
				Path: "/workspace/amounts.csv",
				Data: "YW1vdW50CjEwCjIwCjMwCg==",
			}}},
		}},
		Input: openai.BetaAgentSessionNewParamsInputUnion{OfString: openai.String("Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.")},
	})
	defer stream.Close()

	for stream.Next() {
		fmt.Println(stream.Current().RawJSON())
	}
	if err := stream.Err(); err != nil {
		panic(err)
	}
}
```

```java
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.HostedEnvironmentFileParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;

public class HostedReport {
  public static void main(String[] args) throws Exception {
    var client = OpenAIOkHttpClient.fromEnv();
    var params =
        SessionCreateParams.builder()
            .agent(SessionCreateParams.Agent.builder().model("gpt-6-astra").build())
            .environment(
                EnvironmentParam.OpenAIHosted.builder()
                    .network(
                        EnvironmentParam.OpenAIHosted.Network.builder()
                            .access(EnvironmentParam.OpenAIHosted.Network.Access.DISABLED)
                            .build())
                    .addFile(
                        HostedEnvironmentFileParam.Inline.builder()
                            .path("/workspace/amounts.csv")
                            .data("YW1vdW50CjEwCjIwCjMwCg==")
                            .build())
                    .build())
            .input(
                "Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object"
                    + " with the total to /workspace/outputs/summary.json, then read it back to"
                    + " verify it.")
            .build();

    try (var stream = client.beta().agents().sessions().createStreaming(params)) {
      stream.stream().forEach(System.out::println);
    }
  }
}
```

```ruby
require "openai"
require "json"

client = OpenAI::Client.new
stream = client.beta.agents.sessions.create_streaming(
  agent: { model: "gpt-6-astra" },
  environment: {
    type: :openai_hosted,
    network: { access: :disabled },
    files: [
      {
        type: :inline,
        path: "/workspace/amounts.csv",
        data: "YW1vdW50CjEwCjIwCjMwCg=="
      }
    ]
  },
  input: "Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it."
)

begin
  stream.each { |event| puts event.to_json }
ensure
  stream.close
end
```

```bash
curl --no-buffer --fail-with-body https://api.openai.com/v1/agents/sessions \\\n  -H "OpenAI-Beta: agents=v1" \\\n  -H "Authorization: Bearer $OPENAI_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{\n  "agent": {\n    "model": "gpt-6-astra"\n  },\n  "environment": {\n    "type": "openai_hosted",\n    "network": {\n      "access": "disabled"\n    },\n    "files": [\n      {\n        "type": "inline",\n        "path": "/workspace/amounts.csv",\n        "data": "YW1vdW50CjEwCjIwCjMwCg=="\n      }\n    ]\n  },\n  "input": "Use Python to sum the amount column in /workspace/amounts.csv. Write a JSON object with the total to /workspace/outputs/summary.json, then read it back to verify it.",\n  "stream": true\n}\'
```


The base64 value in `files` contains the CSV input. The code prints session events.
Save `session.id` from `agent.session.created`. After `agent.session.turn.completed`,
[list the artifacts](https://developers.openai.com/api/docs/guides/agents-api/environments/files#list-artifacts), find `summary.json`,
and [download it](https://developers.openai.com/api/docs/guides/agents-api/environments/files#download-an-artifact). Its contents should be:

```json
{ "total": 60 }
```

A completed turn does not guarantee every tool succeeded. If the task fails or the
stream ends before completion, [inspect the saved session items](https://developers.openai.com/api/docs/guides/agents-api/sessions#retrieve-session-items).
[Delete the session](https://developers.openai.com/api/docs/guides/agents-api/quickstart#4-clean-up) when you're done.

## Troubleshooting

| Problem                                     | What to check                                                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Setup fails                                 | Inspect the environment-failure event and fix the package, input-file, or setup-command error before creating another session. |
| A sandbox request is blocked                | Check `network` and any hosts reached through redirects.                                                                       |
| A live file operation fails                 | Confirm the sandbox is `connected`. If it expired, create a new session and supply the inputs again.                           |
| A status or file-list request returns `5xx` | Retry with increasing delays and a deadline. Keep the request ID if the error persists.                                        |