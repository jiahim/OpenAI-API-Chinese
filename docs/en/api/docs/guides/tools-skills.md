# Skills

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Agent Skills let you upload and reuse versioned bundles of files in hosted and local shell environments.

We support Skills in two form factors: local execution and hosted,
  container-based execution. To run code on your own machine, use the local
  execution mode of the [shell tool](https://developers.openai.com/api/docs/guides/tools-shell).

## What's a skill

A skill is a versioned bundle of files plus a `SKILL.md` manifest (front matter + instructions). Skills are modular instructions you can use to codify processes and conventions, from company style guides to multi-step workflows.

Skills are compatible with the open [Agent Skills standard](https://agentskills.io/home).

Example SKILL.md

```markdown
---
name: basic-math
description: Add or multiply numbers.
---

Use this skill when you need a quick sum or product of numbers.
```


## Create a skill

You can upload a directory as multipart form data or upload a `.zip` that contains a single top-level folder.

### Option 1: Directory upload (multipart)

Upload multiple `files[]` parts. Each part includes the path inside a single top-level folder.

Create a skill (multipart)

```bash
curl -X POST 'https://api.openai.com/v1/skills' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F 'files[]=@./basic_math/SKILL.md;filename=basic_math/SKILL.md;type=text/markdown' \
  -F 'files[]=@./basic_math/calculate.py;filename=basic_math/calculate.py;type=text/plain'
```


### Option 2: Zip upload

Zip the top-level folder and upload the zip file.

Create a skill (zip)

```bash
curl -X POST 'https://api.openai.com/v1/skills' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F 'files=@./basic_math.zip;type=application/zip'
```


## Use skills with hosted shell

To mount skills in a hosted shell environment, attach them via `tools[].environment.skills` when calling the shell tool.

Use skills in hosted shell

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
          "type": "container_auto",
          "skills": [
            { "type": "skill_reference", "skill_id": "<skill_id>" },
            { "type": "skill_reference", "skill_id": "<skill_id>", "version": 2 }
          ]
        }
      }
    ],
    "input": "Use the skills to add 144 and 377, then compute triangle area with base 9 height 13."
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
        type: "container_auto",
        skills: [
          { type: "skill_reference", skill_id: "<skill_id>" },
          { type: "skill_reference", skill_id: "<skill_id>", version: "2" },
        ],
      },
    },
  ],
  input:
    "Use the skills to add 144 and 377, then compute triangle area with base 9 height 13.",
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
                "type": "container_auto",
                "skills": [
                    {"type": "skill_reference", "skill_id": "<skill_id>"},
                    {
                        "type": "skill_reference",
                        "skill_id": "<skill_id>",
                        "version": 2,
                    },
                ],
            },
        }
    ],
    input="Use the skills to add 144 and 377, then compute triangle area with base 9 height 13.",
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
			Skills: []responses.ContainerAutoSkillUnionParam{
				{OfSkillReference: &responses.SkillReferenceParam{SkillID: "<skill_id>"}},
				{OfSkillReference: &responses.SkillReferenceParam{SkillID: "<skill_id>", Version: openai.String("2")}},
			},
		}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Use the skills to add 144 and 377, then compute triangle area with base 9 height 13.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: "Use the skills to add 144 and 377, then compute a triangle area with base 9 and height 13.",
  tools: [{
    type: :shell,
    environment: {
      type: :container_auto,
      skills: [
        {type: :skill_reference, skill_id: "<skill_id>"},
        {type: :skill_reference, skill_id: "<skill_id>", version: "2"}
      ]
    }
  }]
)

puts(response.output_text)
```


### Prompting behavior

Once a skill is mounted, the model can decide when to use it. If you want more deterministic behavior, explicitly instruct the model to "use the `<skill name>` skill" when appropriate.

## Use skills with local shell mode

Skills also work with local shell mode, but local shell and hosted shell do not accept the same skill attachment formats.

- Hosted shell supports uploaded `skill_reference` attachments, including curated skills and explicit versions.
- Local shell does not support `skill_reference` attachments. Instead, provide skill files from local file paths in the runtime you control.

Use the [Shell guide](https://developers.openai.com/api/docs/guides/tools-shell) for local shell execution details.

Use skills in local shell mode

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
          "type": "local",
          "skills": [
            {
              "name": "csv-insights",
              "description": "Summarize CSV files and produce a markdown report.",
              "path": "<path-to-skill-folder>"
            }
          ]
        }
      }
    ],
    "input": "Use the csv-insights skill and run locally to summarize today\'s CSV reports in this repo."
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
        type: "local",
        skills: [
          {
            name: "csv-insights",
            description: "Summarize CSV files and produce a markdown report.",
            path: "<path-to-skill-folder>",
          },
        ],
      },
    },
  ],
  input:
    "Use the csv-insights skill and run locally to summarize today's CSV reports in this repo.",
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
                "type": "local",
                "skills": [
                    {
                        "name": "csv-insights",
                        "description": "Summarize CSV files and produce a markdown report.",
                        "path": "<path-to-skill-folder>",
                    }
                ],
            },
        }
    ],
    input="Use the csv-insights skill and run locally to summarize today's CSV reports in this repo.",
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
		Environment: responses.FunctionShellToolEnvironmentUnionParam{OfLocal: &responses.LocalEnvironmentParam{
			Skills: []responses.LocalSkillParam{{
				Name:        "csv-insights",
				Description: "Summarize CSV files and produce a markdown report.",
				Path:        "<path-to-skill-folder>",
			}},
		}},
	}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Tools: []responses.ToolUnionParam{tool},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("Use the csv-insights skill and run locally to summarize today's CSV reports in this repo.")},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.OutputText())
}
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.6",
  input: "Use the csv-insights skill to summarize today's CSV reports.",
  tools: [{
    type: :shell,
    environment: {
      type: :local,
      skills: [{
        name: "csv-insights",
        description: "Summarize CSV files and produce a Markdown report.",
        path: "<path-to-skill-folder>"
      }]
    }
  }]
)

puts(response.output_text)
```


## Skills in the user prompt

When skills are available to the tool, the platform adds each skill's `name`, `description`, and `path` to user prompt context so the model knows the skill exists.

The model decides whether to invoke a skill based on this metadata. If the model invokes a skill, it uses the `path` to read the full Markdown instructions from `SKILL.md`.

Skill instructions are user prompt input (not system prompt input), so they're handled with the same priority as other user-provided instructions. For explicit control, you can still instruct the model to "use the `<skill name>` skill."

## Limits and validation

- `SKILL.md` file matching is case-insensitive.
- Exactly one `skill.md`/`SKILL.md` file is allowed in a skill bundle.
- Skill front matter validation follows the [agent skills specification](https://agentskills.io/specification#name-field).
- Maximum zip upload size is `50 MB`.
- Maximum file count per skill version is `500`.
- Maximum uncompressed file size is `25 MB`.

## Safety with network access

It is very important to inspect any Skill used with the Responses API. Skills
  introduce security risks such as prompt injection-driven data exfiltration.
  Carefully review the [Risks and safety](#risks-and-safety) section below
  before using this tool.

## Versioning and management

### Version pointers

- `default_version` is used when a version isn't provided.
- `latest_version` tracks the newest upload.
- `skill_reference.version` accepts an integer or `"latest"`.

### Create a new version

Create a new skill version

```bash
curl -X POST 'https://api.openai.com/v1/skills/<skill_id>/versions' \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F 'files=@./geometry.zip;type=application/zip'
```


### Set default version

Set a skill's default version

```bash
curl -X POST 'https://api.openai.com/v1/skills/<skill_id>' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{"default_version": 2}'
```


### Delete rules

- You can't delete the default version; set another default first.
- Deleting the last remaining version deletes the skill.
- Deleting a skill cascades to remove all versions.

## Curated skills

OpenAI maintains a set of first-party skills that can be referenced by id (for example, `openai-spreadsheets`).

Reference a curated skill

```json
{ "type": "skill_reference", "skill_id": "openai-spreadsheets", "version": "latest" }
```


## Inline skills

If you don't want to create a hosted skill, you can inline a zip bundle (base64) in the environment's `skills` array.

Inline a skill bundle

```bash
INLINE_ZIP=$(base64 -i ./basic_math.zip)

curl -L 'https://api.openai.com/v1/containers' \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "name": "inline-skill-container",
    "skills": [
      {
        "type": "inline",
        "name": "basic_math",
        "description": "Add or multiply numbers.",
        "source": {
          "type": "base64",
          "media_type": "application/zip",
          "data": "'"$INLINE_ZIP"'"
        }
      }
    ]
  }'
```


## Risks and safety

It's important to inspect any Skill used with the Responses API. Skills introduce security risks such as prompt injection-driven data exfiltration.

For Skills used in conjunction with network access, carefully review the [Risks and safety section for networking](https://developers.openai.com/api/docs/guides/tools-shell#risks-and-safety).

#### Treat Skills as privileged code and instructions

Skill content can influence planning, tool usage, and command execution. Any Skill should be reviewed as potentially untrusted input until validated by the developer.

### Don't expose an open Skills repository to end-users

Avoid product designs where consumer end-users can freely browse, select, or attach arbitrary Skills from an open catalog. This materially increases risk from:

- Prompt-injection and policy bypass via malicious SKILL.md instructions.
- Data exfiltration or destructive actions triggered by unvetted automation.

#### Integrate Skills at the developer level

Skills should be inspected and integrated by the developer, then exposed to end-users only through bounded product experiences. In practice:

- Map Skills to specific product workflows/use cases.
- Prevent end-user control over arbitrary Skill selection.
- Gate write or high-impact actions behind explicit approval and policy checks.

#### Require approval for sensitive actions

For workflows that can perform write or high-impact actions, require explicit approval before execution.

#### Validate data residency and retention requirements

We support Skills in two form factors: local execution and hosted container-based execution. Hosted skills follow the same container lifecycle as hosted shell: mounted skills and container files remain available while the container is active and are discarded when the container expires or is deleted. If you want execution to stay entirely on infrastructure you manage, use local shell mode. Read more about our [data controls](https://developers.openai.com/api/docs/guides/your-data).