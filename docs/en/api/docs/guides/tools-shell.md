# Shell

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

The shell tool gives models the ability to work inside a complete terminal environment. We support shell for local execution and for hosted execution through the Responses API.

The shell tool lets models run commands through either:

- Hosted shell containers managed by OpenAI.
- [A local shell runtime](#local-shell-mode) that you host and execute yourself.

Shell is available through the [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses). It's not available via the Chat Completions API.

Running arbitrary shell commands can be dangerous. Always sandbox execution,
  apply allowlists or denylists where possible, and log tool activity for
  auditing.

## Hosted shell quickstart

Hosted shell is a native and streamlined option for tasks that need richer, deterministic processing, from running calculations to working with multimedia.

Use `container_auto` when you want OpenAI to provision and manage a container for the request.

Shell tool with container_auto

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "tools": [
      { "type": "shell", "environment": { "type": "container_auto" } }
    ],
    "input": [
      {
        "type": "message",
        "role": "user",
        "content": [
          { "type": "input_text", "text": "Execute: ls -lah /mnt/data && python --version && node --version" }
        ]
      }
    ],
    "tool_choice": "auto"
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  tools: [{ type: "shell", environment: { type: "container_auto" } }],
  input: [
    {
      type: "message",
      role: "user",
      content: [
        {
          type: "input_text",
          text: "Execute: ls -lah /mnt/data && python --version && node --version",
        },
      ],
    },
  ],
  tool_choice: "auto",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    tools=[{"type": "shell", "environment": {"type": "container_auto"}}],
    input=[
        {
            "type": "message",
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Execute: ls -lah /mnt/data && python --version && node --version",
                }
            ],
        }
    ],
    tool_choice="auto",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolUnionParam{OfShell: &responses.FunctionShellToolParam{
		Environment: responses.FunctionShellToolEnvironmentUnionParam{OfContainerAuto: &responses.ContainerAutoParam{}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Execute: ls -lah /mnt/data && python --version && node --version")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ContainerAuto;
import com.openai.models.responses.FunctionShellTool;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("Run ls -lah /mnt/data, then show the Python and Node.js versions.")
        .addTool(
            FunctionShellTool.builder().environment(ContainerAuto.builder().build()).build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: "Run ls -lah /mnt/data, then show the Python and Node.js versions.",
  tools: [{type: :shell, environment: {type: :container_auto}}]
)

puts(response.output_text)
```


## Hosted runtime details

- Runtime is currently based on `Debian 12` and may change over time.
- Default working directory is `/mnt/data`.
- `/mnt/data` is always present and is the supported path for user-downloadable artifacts.
- Hosted shell doesn't support interactive TTY sessions.
- Hosted shell commands don't run with `sudo`.
- You can run services inside the container when your workflow needs them.

Current preinstalled languages include:

- Python `3.11`
- Node.js `22.16`
- Java `17.0`
- PHP `8.2`
- Ruby `3.1`
- Go `1.23`

## Reuse a container across requests

If you need a long-running environment for iterative workflows, create a container and then reference it in subsequent Responses API calls.

### 1. Create a container

Create a reusable container

```bash
curl -L 'https://api.openai.com/v1/containers' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "name": "analysis-container",
    "memory_limit": "1g",
    "expires_after": { "anchor": "last_active_at", "minutes": 20 }
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const container = await client.containers.create({
  name: "analysis-container",
  memory_limit: "1g",
  expires_after: { anchor: "last_active_at", minutes: 20 },
});

console.log(container.id);
```

```python
from openai import OpenAI

client = OpenAI()

container = client.containers.create(
    name="analysis-container",
    memory_limit="1g",
    expires_after={"anchor": "last_active_at", "minutes": 20},
)

print(container.id)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	container, err := client.Containers.New(context.Background(), openai.ContainerNewParams{
		Name:        "analysis-container",
		MemoryLimit: openai.ContainerNewParamsMemoryLimit1g,
		ExpiresAfter: openai.ContainerNewParamsExpiresAfter{
			Anchor:  "last_active_at",
			Minutes: 20,
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(container.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.containers.ContainerCreateParams;

var container =
    client
        .containers()
        .create(
            ContainerCreateParams.builder()
                .name("analysis")
                .expiresAfter(
                    ContainerCreateParams.ExpiresAfter.builder()
                        .anchor(ContainerCreateParams.ExpiresAfter.Anchor.LAST_ACTIVE_AT)
                        .minutes(20)
                        .build())
                .build());

System.out.println(container.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
container = client.containers.create(name: "analysis", expires_after: {anchor: :last_active_at, minutes: 20})
puts(container.id)
```


### 2. Reference the container in Responses

Use shell with container_reference

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "tools": [
      {
        "type": "shell",
        "environment": {
          "type": "container_reference",
          "container_id": "cntr_08f3d96c87a585390069118b594f7481a088b16cda7d9415fe"
        }
      }
    ],
    "input": "List files in the container and show disk usage."
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  tools: [
    {
      type: "shell",
      environment: {
        type: "container_reference",
        container_id: "cntr_08f3d96c87a585390069118b594f7481a088b16cda7d9415fe",
      },
    },
  ],
  input: "List files in the container and show disk usage.",
});

console.log(response.output_text);
```

```python
response = client.responses.create(
    model="gpt-5.6",
    tools=[
        {
            "type": "shell",
            "environment": {
                "type": "container_reference",
                "container_id": container.id,
            },
        }
    ],
    input="List files in the container and show disk usage.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolUnionParam{OfShell: &responses.FunctionShellToolParam{
		Environment: responses.FunctionShellToolEnvironmentUnionParam{OfContainerReference: &responses.ContainerReferenceParam{ContainerID: "cntr_08f3d96c87a585390069118b594f7481a088b16cda7d9415fe"}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("List files in the container and show disk usage.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.FunctionShellTool;
import com.openai.models.responses.ResponseCreateParams;

String containerId = "cntr_08f3d96c87a585390069118b594f7481a088b16cda7d9415fe";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("List files in the container and show disk usage.")
        .addTool(FunctionShellTool.builder().containerReferenceEnvironment(containerId).build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: "List files in the container and show disk usage.",
  tools: [{
    type: :shell,
    environment: {type: :container_reference, container_id: "cntr_08f3d96c87a585390069118b594f7481a088b16cda7d9415fe"}
  }]
)

puts(response.output_text)
```


## Attach skills

Skills are reusable, versioned bundles that you can mount in hosted shell environments. This defines the available skills, and at shell execution time the model decides whether to invoke them.

Use the [Skills guide](https://developers.openai.com/api/docs/guides/tools-skills) for upload and versioning details.

Create a container with attached skills

```bash
curl -L 'https://api.openai.com/v1/containers' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "name": "skill-container",
    "skills": [
      { "type": "skill_reference", "skill_id": "skill_4db6f1a2c9e73508b41f9da06e2c7b5f" },
      { "type": "skill_reference", "skill_id": "openai-spreadsheets", "version": "latest" }
    ]
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const container = await client.containers.create({
  name: "skill-container",
  skills: [
    {
      type: "skill_reference",
      skill_id: "skill_4db6f1a2c9e73508b41f9da06e2c7b5f",
    },
    {
      type: "skill_reference",
      skill_id: "openai-spreadsheets",
      version: "latest",
    },
  ],
});

console.log(container.id);
```

```python
import os
from openai import OpenAI

client = OpenAI()
skill_id = os.environ["OPENAI_SKILL_ID"]

container = client.containers.create(
    name="skill-container",
    skills=[
        {
            "type": "skill_reference",
            "skill_id": skill_id,
        },
        {
            "type": "skill_reference",
            "skill_id": "openai-spreadsheets",
            "version": "latest",
        },
    ],
)

print(container.id)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	container, err := client.Containers.New(context.Background(), openai.ContainerNewParams{
		Name: "skill-container",
		Skills: []openai.ContainerNewParamsSkillUnion{
			{OfSkillReference: &responses.SkillReferenceParam{SkillID: "skill_4db6f1a2c9e73508b41f9da06e2c7b5f"}},
			{OfSkillReference: &responses.SkillReferenceParam{SkillID: "openai-spreadsheets", Version: openai.String("latest")}},
		},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(container.ID)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.containers.ContainerCreateParams;
import com.openai.models.responses.SkillReference;

String skillId = "skill_4db6f1a2c9e73508b41f9da06e2c7b5f";

var container =
    client
        .containers()
        .create(
            ContainerCreateParams.builder()
                .name("skill-container")
                .addSkill(SkillReference.builder().skillId(skillId).build())
                .addSkill(
                    SkillReference.builder()
                        .skillId("openai-spreadsheets")
                        .version("latest")
                        .build())
                .build());

System.out.println(container.id());
```

```ruby
require "openai"

client = OpenAI::Client.new
container = client.containers.create(
  name: "skill-container",
  skills: [
    {type: :skill_reference, skill_id: "skill_4db6f1a2c9e73508b41f9da06e2c7b5f"},
    {
      type: :skill_reference,
      skill_id: "openai-spreadsheets",
      version: "latest"
    }
  ]
)

puts(container.id)
```


## Network access

Hosted containers don't have outbound network access by default.

To enable it:

1. An admin must configure your org allow list in the dashboard.
2. You must explicitly set `network_policy` on the container environment in your request.

Shell tool with network allowlist

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "tool_choice": "required",
    "tools": [
      {
        "type": "shell",
        "environment": {
          "type": "container_auto",
          "network_policy": {
            "type": "allowlist",
            "allowed_domains": ["pypi.org", "files.pythonhosted.org", "github.com"]
          }
        }
      }
    ],
    "input": [
      {
        "role": "user",
        "content": "In the container, pip install httpx beautifulsoup4, fetch release pages, and write /mnt/data/release_digest.md."
      }
    ]
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  tool_choice: "required",
  tools: [
    {
      type: "shell",
      environment: {
        type: "container_auto",
        network_policy: {
          type: "allowlist",
          allowed_domains: ["pypi.org", "files.pythonhosted.org", "github.com"],
        },
      },
    },
  ],
  input: [
    {
      role: "user",
      content:
        "In the container, pip install httpx beautifulsoup4, fetch release pages, and write /mnt/data/release_digest.md.",
    },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    tool_choice="required",
    tools=[
        {
            "type": "shell",
            "environment": {
                "type": "container_auto",
                "network_policy": {
                    "type": "allowlist",
                    "allowed_domains": [
                        "pypi.org",
                        "files.pythonhosted.org",
                        "github.com",
                    ],
                },
            },
        }
    ],
    input=[
        {
            "role": "user",
            "content": "In the container, pip install httpx beautifulsoup4, fetch release pages, and write /mnt/data/release_digest.md.",
        }
    ],
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolUnionParam{OfShell: &responses.FunctionShellToolParam{
		Environment: responses.FunctionShellToolEnvironmentUnionParam{OfContainerAuto: &responses.ContainerAutoParam{
			NetworkPolicy: responses.ContainerAutoNetworkPolicyUnionParam{OfAllowlist: &responses.ContainerNetworkPolicyAllowlistParam{
				AllowedDomains: []string{"pypi.org", "files.pythonhosted.org", "github.com"},
			}},
		}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:      "gpt-5.6",
		ToolChoice: responses.ResponseNewParamsToolChoiceUnion{OfToolChoiceMode: openai.Opt(responses.ToolChoiceOptionsRequired)},
		Tools:      []responses.ToolUnionParam{tool},
		Input:      responses.ResponseNewParamsInputUnion{OfString: openai.String("In the container, pip install httpx beautifulsoup4, fetch release pages, and write /mnt/data/release_digest.md.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ContainerAuto;
import com.openai.models.responses.ContainerNetworkPolicyAllowlist;
import com.openai.models.responses.FunctionShellTool;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ToolChoiceOptions;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("Fetch release pages and write /mnt/data/release_digest.md.")
        .toolChoice(ToolChoiceOptions.REQUIRED)
        .addTool(
            FunctionShellTool.builder()
                .environment(
                    ContainerAuto.builder()
                        .networkPolicy(
                            ContainerNetworkPolicyAllowlist.builder()
                                .addAllowedDomain("pypi.org")
                                .addAllowedDomain("files.pythonhosted.org")
                                .addAllowedDomain("github.com")
                                .build())
                        .build())
                .build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: "Fetch release pages and write /mnt/data/release_digest.md.",
  tool_choice: :required,
  tools: [{
    type: :shell,
    environment: {
      type: :container_auto,
      network_policy: {
        type: :allowlist,
        allowed_domains: ["pypi.org", "files.pythonhosted.org", "github.com"]
      }
    }
  }]
)

puts(response.output_text)
```


Allowlisting domains introduces security risks such as prompt
  injection-driven data exfiltration. Only allowlist domains you trust and that
  attackers cannot use to receive exfiltrated data. Carefully review the [Risks
  and safety](#risks-and-safety) section below before using this tool.

## Network policy precedence

When multiple controls are present:

- Your org allow list defines the full set of `allowed_domains`.
- Request-level `network_policy` further restricts access.
- Requests fail if `allowed_domains` includes domains outside your org allow list.

## Data retention and container lifecycle

Hosted containers used by Hosted Shell and Code Interpreter may write temporary application state to the container filesystem (backed by ephemeral block storage) while the container is active. Container data is deleted when the container expires or is explicitly deleted.

For more details on data controls, see [ZDR and data residency](https://developers.openai.com/api/docs/guides/your-data).

### Download artifacts

Hosted shell can produce downloadable files. Use the same container/files APIs as code interpreter to retrieve artifacts written under `/mnt/data`.

### Additional data controls

If you want to keep content and files ephemeral within the hosted lifecycle, you can inline files in the request and mount inline skills in the container.

Use inline files and inline skills

```bash
INLINE_ZIP=$(base64 -i ./csv_insights.zip)
REPORT_CSV=$(base64 -i ./report.csv)

CONTAINER_ID=$(
  curl -sL 'https://api.openai.com/v1/containers' \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
      "name": "inline-skill-container",
      "skills": [
        {
          "type": "inline",
          "name": "csv-insights",
          "description": "Summarize CSV files and produce a markdown report.",
          "source": {
            "type": "base64",
            "media_type": "application/zip",
            "data": "'"$INLINE_ZIP"'"
          }
        }
      ]
    }' | jq -r '.id'
)

curl -L 'https://api.openai.com/v1/responses' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "tools": [
      {
        "type": "shell",
        "environment": {
          "type": "container_reference",
          "container_id": "'"$CONTAINER_ID"'"
        }
      }
    ],
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_file",
            "filename": "report.csv",
            "file_data": "data:text/csv;base64,'"${REPORT_CSV}"'"
          },
          {
            "type": "input_text",
            "text": "Use the csv-insights skill to summarize report.csv."
          }
        ]
      }
    ]
  }'
```

```javascript
import fs from "fs";
import OpenAI from "openai";

const client = new OpenAI();

const inlineZip = fs
  .readFileSync("fixtures/csv_insights.zip")
  .toString("base64");
const reportCsv = fs.readFileSync("fixtures/report.csv").toString("base64");

const container = await client.containers.create({
  name: "inline-skill-container",
  skills: [
    {
      type: "inline",
      name: "csv-insights",
      description: "Summarize CSV files and produce a markdown report.",
      source: {
        type: "base64",
        media_type: "application/zip",
        data: inlineZip,
      },
    },
  ],
});

const response = await client.responses.create({
  model: "gpt-5.6",
  tools: [
    {
      type: "shell",
      environment: {
        type: "container_reference",
        container_id: container.id,
      },
    },
  ],
  input: [
    {
      role: "user",
      content: [
        {
          type: "input_file",
          filename: "report.csv",
          file_data: `data:text/csv;base64,${reportCsv}`,
        },
        {
          type: "input_text",
          text: "Use the csv-insights skill to summarize report.csv.",
        },
      ],
    },
  ],
});

console.log(response.output_text);
```

```python
import base64
from openai import OpenAI

client = OpenAI()

with open("csv_insights.zip", "rb") as f:
    inline_zip = base64.b64encode(f.read()).decode("utf-8")

with open("report.csv", "rb") as f:
    base64_string = base64.b64encode(f.read()).decode("utf-8")

container = client.containers.create(
    name="inline-skill-container",
    skills=[
        {
            "type": "inline",
            "name": "csv-insights",
            "description": "Summarize CSV files and produce a markdown report.",
            "source": {
                "type": "base64",
                "media_type": "application/zip",
                "data": inline_zip,
            },
        }
    ],
)

response = client.responses.create(
    model="gpt-5.6",
    tools=[
        {
            "type": "shell",
            "environment": {
                "type": "container_reference",
                "container_id": container.id,
            },
        }
    ],
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_file",
                    "filename": "report.csv",
                    "file_data": f"data:text/csv;base64,{base64_string}",
                },
                {
                    "type": "input_text",
                    "text": "Use the csv-insights skill to summarize report.csv.",
                },
            ],
        }
    ],
)

print(response.output_text)
```


For follow-up requests, pass the same `container_id` with `container_reference`. The mounted skills and existing container files remain available while the container is active.

### Proactively delete a container

You can explicitly delete the container when the work is done instead of waiting for inactivity expiration.

Delete a container

```bash
curl -L -X DELETE 'https://api.openai.com/v1/containers/container_id' \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const deleted = await client.containers.delete("container_id");

console.log(deleted);
```

```python
import os
from openai import OpenAI

client = OpenAI()
container_id = os.environ["OPENAI_CONTAINER_ID"]

deleted = client.containers.delete(container_id)

print(deleted)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	if err := client.Containers.Delete(context.Background(), "container_id"); err != nil {
		panic(err)
	}
	fmt.Println("Container deleted")
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

String containerId = "container_id";

client.containers().delete(containerId);

System.out.println("Container deleted.");
```

```ruby
require "openai"

client = OpenAI::Client.new
client.containers.delete("container_id")
puts("Deleted container_id")
```


## Domain secrets

Use `domain_secrets` when a domain in your `allowed_domains` list requires private authorization headers, such as `Authorization: Bearer <token>`.

Each secret entry includes:

- Target domain
- Friendly secret name
- Secret value

At runtime:

- The model and runtime see placeholder names (for example, `$API_KEY`) instead of raw credentials.
- The auth-translation sidecar applies raw secret values only for approved destinations.
- Raw secret values don't persist on API servers and don't appear in model-visible context.

This lets the assistant call protected services while reducing leakage risk.

Shell tool with domain_secrets

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-5.6",
    "input": [
      {
        "role": "user",
        "content": "Use curl to call https://httpbin.org/headers with header Authorization: Bearer $API_KEY. Tell me what you see in the final text response."
      }
    ],
    "tool_choice": "required",
    "tools": [
      {
        "type": "shell",
        "environment": {
          "type": "container_auto",
          "network_policy": {
            "type": "allowlist",
            "allowed_domains": ["httpbin.org"],
            "domain_secrets": [
              {
                "domain": "httpbin.org",
                "name": "API_KEY",
                "value": "debug-secret-123"
              }
            ]
          }
        }
      }
    ]
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  input: [
    {
      role: "user",
      content:
        "Use curl to call https://httpbin.org/headers with header Authorization: Bearer $API_KEY. Tell me what you see in the final text response.",
    },
  ],
  tool_choice: "required",
  tools: [
    {
      type: "shell",
      environment: {
        type: "container_auto",
        network_policy: {
          type: "allowlist",
          allowed_domains: ["httpbin.org"],
          domain_secrets: [
            {
              domain: "httpbin.org",
              name: "API_KEY",
              value: "debug-secret-123",
            },
          ],
        },
      },
    },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    input=[
        {
            "role": "user",
            "content": "Use curl to call https://httpbin.org/headers with header Authorization: Bearer $API_KEY. Tell me what you see in the final text response.",
        }
    ],
    tool_choice="required",
    tools=[
        {
            "type": "shell",
            "environment": {
                "type": "container_auto",
                "network_policy": {
                    "type": "allowlist",
                    "allowed_domains": ["httpbin.org"],
                    "domain_secrets": [
                        {
                            "domain": "httpbin.org",
                            "name": "API_KEY",
                            "value": "debug-secret-123",
                        }
                    ],
                },
            },
        }
    ],
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolUnionParam{OfShell: &responses.FunctionShellToolParam{
		Environment: responses.FunctionShellToolEnvironmentUnionParam{OfContainerAuto: &responses.ContainerAutoParam{
			NetworkPolicy: responses.ContainerAutoNetworkPolicyUnionParam{OfAllowlist: &responses.ContainerNetworkPolicyAllowlistParam{
				AllowedDomains: []string{"httpbin.org"},
				DomainSecrets: []responses.ContainerNetworkPolicyDomainSecretParam{{
					Domain: "httpbin.org",
					Name:   "API_KEY",
					Value:  "debug-secret-123",
				}},
			}},
		}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:      "gpt-5.6",
		ToolChoice: responses.ResponseNewParamsToolChoiceUnion{OfToolChoiceMode: openai.Opt(responses.ToolChoiceOptionsRequired)},
		Tools:      []responses.ToolUnionParam{tool},
		Input:      responses.ResponseNewParamsInputUnion{OfString: openai.String("Use curl to call https://httpbin.org/headers with header Authorization: Bearer $API_KEY. Tell me what you see in the final text response.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ContainerAuto;
import com.openai.models.responses.ContainerNetworkPolicyAllowlist;
import com.openai.models.responses.ContainerNetworkPolicyDomainSecret;
import com.openai.models.responses.FunctionShellTool;
import com.openai.models.responses.ResponseCreateParams;
import com.openai.models.responses.ToolChoiceOptions;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input(
            "Use curl to call https://httpbin.org/status/204 with an "
                + "Authorization: Bearer $API_KEY header. Print only the HTTP status code; "
                + "never print request headers or secret values.")
        .toolChoice(ToolChoiceOptions.REQUIRED)
        .addTool(
            FunctionShellTool.builder()
                .environment(
                    ContainerAuto.builder()
                        .networkPolicy(
                            ContainerNetworkPolicyAllowlist.builder()
                                .addAllowedDomain("httpbin.org")
                                .addDomainSecret(
                                    ContainerNetworkPolicyDomainSecret.builder()
                                        .domain("httpbin.org")
                                        .name("API_KEY")
                                        .value(System.getenv("OPENAI_EXAMPLE_DOMAIN_SECRET"))
                                        .build())
                                .build())
                        .build())
                .build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: "Use curl to call https://httpbin.org/headers with an " \
    '"Authorization: Bearer $API_KEY" header.',
  tool_choice: :required,
  tools: [{
    type: :shell,
    environment: {
      type: :container_auto,
      network_policy: {
        type: :allowlist,
        allowed_domains: ["httpbin.org"],
        domain_secrets: [{
          domain: "httpbin.org",
          name: "API_KEY",
          value: "debug-secret-123"
        }]
      }
    }
  }]
)

puts(response.output_text)
```


## Multi-turn workflows

To continue work in the same hosted environment, reuse the container and pass `previous_response_id`.

Continue a shell workflow

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "previous_response_id": "resp_2a8e5c9174d63b0f18a4c572de9f64a1b3c76d508e12f9ab47",
    "tools": [
      {
        "type": "shell",
        "environment": {
          "type": "container_reference",
          "container_id": "cntr_f19c2b51e4a06793d82d54a7be0fc9154d3361ab28ce7f6041"
        }
      }
    ],
    "input": "Read /mnt/data/top5.csv and report the top candidate."
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  previous_response_id:
    "resp_2a8e5c9174d63b0f18a4c572de9f64a1b3c76d508e12f9ab47",
  tools: [
    {
      type: "shell",
      environment: {
        type: "container_reference",
        container_id: "cntr_f19c2b51e4a06793d82d54a7be0fc9154d3361ab28ce7f6041",
      },
    },
  ],
  input: "Read /mnt/data/top5.csv and report the top candidate.",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    previous_response_id="resp_2a8e5c9174d63b0f18a4c572de9f64a1b3c76d508e12f9ab47",
    tools=[
        {
            "type": "shell",
            "environment": {
                "type": "container_reference",
                "container_id": "cntr_f19c2b51e4a06793d82d54a7be0fc9154d3361ab28ce7f6041",
            },
        }
    ],
    input="Read /mnt/data/top5.csv and report the top candidate.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolUnionParam{OfShell: &responses.FunctionShellToolParam{
		Environment: responses.FunctionShellToolEnvironmentUnionParam{OfContainerReference: &responses.ContainerReferenceParam{ContainerID: "cntr_f19c2b51e4a06793d82d54a7be0fc9154d3361ab28ce7f6041"}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:              "gpt-5.6",
		PreviousResponseID: openai.String("resp_2a8e5c9174d63b0f18a4c572de9f64a1b3c76d508e12f9ab47"),
		Tools:              []responses.ToolUnionParam{tool},
		Input:              responses.ResponseNewParamsInputUnion{OfString: openai.String("Read /mnt/data/top5.csv and report the top candidate.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.FunctionShellTool;
import com.openai.models.responses.ResponseCreateParams;

String responseId = "resp_2a8e5c9174d63b0f18a4c572de9f64a1b3c76d508e12f9ab47";

String containerId = "cntr_f19c2b51e4a06793d82d54a7be0fc9154d3361ab28ce7f6041";

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("Read /mnt/data/top5.csv and report the top candidate.")
        .previousResponseId(responseId)
        .addTool(FunctionShellTool.builder().containerReferenceEnvironment(containerId).build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: "Read /mnt/data/top5.csv and report the top candidate.",
  previous_response_id: "resp_2a8e5c9174d63b0f18a4c572de9f64a1b3c76d508e12f9ab47",
  tools: [{
    type: :shell,
    environment: {type: :container_reference, container_id: "cntr_f19c2b51e4a06793d82d54a7be0fc9154d3361ab28ce7f6041"}
  }]
)

puts(response.output_text)
```


## Shell output in Responses

Hosted shell and local shell use the same output item types. Shell runs are represented by paired output items:

- `shell_call`: commands requested by the model.
- `shell_call_output`: command output and exit outcomes.

Example shell_call item

```json
{
  "type": "shell_call",
  "call_id": "call_9d14ac6f2b73485e91c0f4da6e1b27c8",
  "action": {
    "commands": ["ls -l"],
    "timeout_ms": 120000,
    "max_output_length": 4096
  },
  "status": "in_progress"
}
```


## Local shell mode

You can also run shell commands in your own local runtime by executing `shell_call` actions and sending `shell_call_output` back to the model.

Use this mode when you need full control over execution environment, filesystem access, or existing internal tooling.

Local shell request

```bash
curl -L 'https://api.openai.com/v1/responses' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-5.6",
    "instructions": "The local bash shell environment is on Mac.",
    "input": "find me the largest pdf file in ~/Documents",
    "tools": [{ "type": "shell", "environment": { "type": "local" } }]
  }'
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.6",
  instructions: "The local bash shell environment is on Mac.",
  input: "find me the largest pdf file in ~/Documents",
  tools: [{ type: "shell", environment: { type: "local" } }],
});

console.log(response);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    instructions="The local bash shell environment is on Mac.",
    input="find me the largest pdf file in ~/Documents",
    tools=[{"type": "shell", "environment": {"type": "local"}}],
)

print(response)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolUnionParam{OfShell: &responses.FunctionShellToolParam{
		Environment: responses.FunctionShellToolEnvironmentUnionParam{OfLocal: &responses.LocalEnvironmentParam{}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:        "gpt-5.6",
		Instructions: openai.String("The local bash shell environment is on Mac."),
		Input:        responses.ResponseNewParamsInputUnion{OfString: openai.String("find me the largest pdf file in ~/Documents")},
		Tools:        []responses.ToolUnionParam{tool},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Output)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.JsonValue;
import com.openai.models.responses.ResponseCreateParams;
import java.util.List;
import java.util.Map;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.6")
        .input("Find the largest PDF in ~/Documents.")
        .instructions("The local shell environment is macOS.")
        .putAdditionalBodyProperty(
            "tools",
            JsonValue.from(
                List.of(Map.of("type", "shell", "environment", Map.of("type", "local")))))
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.shellCall().stream())
    .flatMap(call -> call.action().commands().stream())
    .forEach(System.out::println);
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  instructions: "The local shell environment is macOS.",
  input: "Find the largest PDF in ~/Documents.",
  tools: [{type: :shell, environment: {type: :local}}]
)

puts(response.output)
```


When you receive `shell_call` output items:

- Execute requested commands in your runtime.
- Capture `stdout`, `stderr`, and outcome.
- Return results as `shell_call_output` in the next request.

Local shell executor example

```javascript
import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execCallback);

class ShellExecutor {
  constructor(defaultTimeoutMs = 60_000) {
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  async run(cmd, timeoutMs) {
    const timeout = timeoutMs ?? this.defaultTimeoutMs;

    try {
      const { stdout, stderr } = await exec(cmd, { timeout });
      return { stdout, stderr, exitCode: 0, timedOut: false };
    } catch (error) {
      const timedOut = Boolean(error?.killed) && error?.signal === "SIGTERM";
      const exitCode = timedOut ? null : (error?.code ?? null);
      return {
        stdout: error?.stdout ?? "",
        stderr: error?.stderr ?? String(error),
        exitCode,
        timedOut,
      };
    }
  }
}
```

```python
@dataclass
class CmdResult:
    stdout: str
    stderr: str
    exit_code: int | None
    timed_out: bool


class ShellExecutor:
    def __init__(self, default_timeout: float = 60):
        self.default_timeout = default_timeout

    def run(self, cmd: str, timeout: float | None = None) -> CmdResult:
        t = timeout or self.default_timeout
        p = subprocess.Popen(
            cmd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        try:
            out, err = p.communicate(timeout=t)
            return CmdResult(out, err, p.returncode, False)
        except subprocess.TimeoutExpired:
            p.kill()
            out, err = p.communicate()
            return CmdResult(out, err, p.returncode, True)
```

```go
package main

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"time"
)

type shellResult struct {
	Stdout   string
	Stderr   string
	ExitCode int
	TimedOut bool
}

type shellExecutor struct {
	DefaultTimeout time.Duration
}

func (e shellExecutor) run(command string, timeout time.Duration) shellResult {
	if timeout == 0 {
		timeout = e.DefaultTimeout
	}
	ctx, cancel := context.WithTimeout(context.Background(), timeout)
	defer cancel()
	cmd := exec.CommandContext(ctx, "sh", "-c", command)
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	err := cmd.Run()
	result := shellResult{Stdout: stdout.String(), Stderr: stderr.String()}
	if ctx.Err() == context.DeadlineExceeded {
		result.TimedOut = true
		result.ExitCode = -1
		return result
	}
	if err != nil {
		if exitError, ok := err.(*exec.ExitError); ok {
			result.ExitCode = exitError.ExitCode()
			return result
		}
		if result.Stderr == "" {
			result.Stderr = err.Error()
		}
		result.ExitCode = -1
	}
	return result
}

func main() {
	executor := shellExecutor{DefaultTimeout: time.Minute}
	fmt.Println(executor.run("printf shell-executor-ready", 0))
}
```

```ruby
require "open3"

class ShellExecutor
  Result = Data.define(:stdout, :stderr, :exit_code, :timed_out)

  def initialize(default_timeout: 60)
    @default_timeout = default_timeout
  end

  def run(command, timeout: @default_timeout)
    Open3.popen3("sh", "-c", command, pgroup: true) do |stdin, stdout, stderr, wait_thread|
      stdin.close
      stdout_reader = Thread.new { stdout.read }
      stderr_reader = Thread.new { stderr.read }
      finished = wait_thread.join(timeout)
      terminate_process_group(wait_thread) unless finished

      Result.new(
        stdout: stdout_reader.value,
        stderr: stderr_reader.value,
        exit_code: wait_thread.value.exitstatus || -1,
        timed_out: finished.nil?
      )
    end
  end

  private

  def terminate_process_group(wait_thread)
    Process.kill("TERM", -wait_thread.pid)
    wait_thread.join(1)
    Process.kill("KILL", -wait_thread.pid)
  rescue Errno::ESRCH
    nil
  ensure
    wait_thread.join
  end
end

puts(ShellExecutor.new.run("printf shell-executor-ready"))
```


Example shell_call_output payload

```json
{
  "type": "shell_call_output",
  "call_id": "call_3ef1b8c79a4d6520f9e3ab7d41c68f25",
  "max_output_length": 4096,
  "output": [
    {
      "stdout": "...",
      "stderr": "...",
      "outcome": {
        "type": "exit",
        "exit_code": 0
      }
    },
    {
      "stdout": "...",
      "stderr": "...",
      "outcome": {
        "type": "timeout"
      }
    }
  ]
}
```


For legacy migration details, see the older [Local shell guide](https://developers.openai.com/api/docs/guides/tools-local-shell).

## Use local shell with Agents SDK

If you are using the [Agents SDK](https://developers.openai.com/api/docs/guides/tools#usage-in-the-agents-sdk), you can pass your own shell executor implementation to the shell tool helper.

Use local shell with Agents SDK

```javascript
import { Agent, run, withTrace, shellTool } from "@openai/agents";

class LocalShell {
  /** @returns {Promise<import("@openai/agents").ShellResult>} */
  async run(action) {
    return {
      output: [
        {
          stdout: "Shell is not available. Needs to be implemented first.",
          stderr: "",
          outcome: {
            type: "exit",
            exitCode: 1,
          },
        },
      ],
      maxOutputLength: action.maxOutputLength,
    };
  }
}

const shell = new LocalShell();

const agent = new Agent({
  name: "Shell Assistant",
  model: "gpt-5.6",
  instructions:
    "You can execute shell commands to inspect the repository. Keep responses concise and include command output when helpful.",
  tools: [
    shellTool({
      shell,
      needsApproval: true,
      onApproval: async (_ctx, _approvalItem) => {
        return { approve: true };
      },
    }),
  ],
});

await withTrace("shell-tool-example", async () => {
  const result = await run(agent, "Show the Node.js version.");
  console.log(`\nFinal response:\n${result.finalOutput}`);
});
```

```python
from agents import (
    Agent,
    Runner,
    ShellCallOutcome,
    ShellCommandOutput,
    ShellCommandRequest,
    ShellResult,
    ShellTool,
)


class LocalShell:
    async def __call__(self, request: ShellCommandRequest) -> ShellResult:
        action = request.data.action
        return ShellResult(
            output=[
                ShellCommandOutput(
                    command="(not executed)",
                    stdout="Shell is not available. Needs to be implemented first.",
                    stderr="",
                    outcome=ShellCallOutcome(type="exit", exit_code=1),
                )
            ],
            max_output_length=action.max_output_length,
        )


shell_tool = ShellTool(
    executor=LocalShell(),
    needs_approval=True,
    on_approval=lambda _ctx, _approval_item: {"approve": True},
)

agent = Agent(
    name="Shell Assistant",
    model="gpt-5.6",
    instructions="You can execute shell commands to inspect the repository. Keep responses concise and include command output when helpful.",
    tools=[shell_tool],
)


async def main():
    result = await Runner.run(agent, input="Show the Node.js version.")
    print(f"\nFinal response:\n{result.final_output}")


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
```


You can find working examples in the SDK repositories.

[Shell tool example - TypeScript



      TypeScript example for the shell tool in the Agents SDK.](https://github.com/openai/openai-agents-js/blob/main/examples/tools/shell.ts)

[Shell tool example - Python



      Python example for the shell tool in the Agents SDK.](https://github.com/openai/openai-agents-python/blob/main/examples/tools/shell.py)

## Handling common errors

- If a command exceeds your execution timeout, return a timeout outcome and include partial captured output.
- If `max_output_length` is present on `shell_call`, include it in `shell_call_output`.
- Don't rely on interactive commands; shell tool execution should be non-interactive.
- Preserve non-zero exit outputs so the model can reason about recovery steps.

## Risks and safety

Enabling network access in the Containers API is a powerful capability, and it introduces meaningful security and data-governance risk. By default, network access isn't enabled. When enabled, outbound access should remain tightly scoped to trusted domains needed for the task.

Network-enabled containers can interact with third-party services and package registries. That creates risks including data leakage, prompt-injection-driven tool misuse, and accidental access beyond intended boundaries. These risks increase when policies are broad, static, or inconsistently enforced.

#### Understand prompt injection risks from network-retrieved content

Any external content fetched over the network may contain hidden instructions intended to manipulate model behavior. Treat untrusted network content as potentially adversarial, and require additional caution for actions that can modify data or systems.

#### Connect only to trusted destinations

Allow only domains you trust and actively maintain. Be cautious with intermediaries and aggregators that proxy to other services, and review their data handling and retention practices before you add them to your allowed domains list.

#### Build in reviews before and after requests are executed

Review the shell tool command and execution output, which are provided in the Responses API response. Capture requested hosts and actual outbound destinations for each session. Periodically review logs to verify access patterns match expectations, detect drift, and identify suspicious behavior.

#### Validate data residency and retention requirements

[OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data) apply within OpenAI boundaries. However, data transmitted to third-party services over network connections is subject to their data retention policies. Ensure external endpoints meet your residency, retention, and compliance requirements.