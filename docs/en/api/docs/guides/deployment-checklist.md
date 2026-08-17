# API deployment checklist

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

| Contents                                                                        | Expected impact                     |
| ------------------------------------------------------------------------------- | ----------------------------------- |
| [Use the Responses API](#use-the-responses-api)                                 | Quality, cost, latency, reliability |
| [Choose a GPT-5.6 model](#choose-a-gpt-56-model)                                | Quality, cost, latency              |
| [Set up `reasoning.effort`](#set-up-reasoningeffort)                            | Quality, cost, latency              |
| [Set up `text.verbosity`](#set-up-textverbosity)                                | Quality, cost, latency              |
| [Set up the assistant `phase` parameter](#set-up-the-assistant-phase-parameter) | Quality, cost                       |
| [Use `tool_search`](#use-toolsearch)                                            | Cost, latency                       |
| [Use Programmatic Tool Calling](#use-programmatic-tool-calling)                 | Quality, cost, latency              |
| [Use Multi-agent for parallel work](#use-multi-agent-for-parallel-work)         | Quality, cost, latency              |
| [Leverage built-in tools](#leverage-built-in-tools)                             | Quality                             |
| [Leverage compaction](#leverage-compaction)                                     | Cost                                |
| [Use `prompt_cache_key`](#use-promptcachekey)                                   | Latency, cost                       |
| [Use `reasoning.encrypted_content`](#use-reasoningencryptedcontent)             | Quality, latency                    |
| [Set image detail intentionally](#set-image-detail-intentionally)               | Quality, cost, latency              |
| [Send a safety identifier](#send-a-safety-identifier)                           | Safety, reliability                 |
| [Use `background=True`](#use-backgroundtrue)                                    | Resumability                        |
| [Use WebSocket mode](#use-websocket-mode)                                       | Latency                             |

## Use the Responses API

**Always start** with the
[Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses). It is OpenAI's flagship
API and the best place to access the newest model behavior, built-in tools,
stateful workflows, and agent features.

## Choose a GPT-5.6 model

Choose a [GPT-5.6 model](https://developers.openai.com/api/docs/guides/latest-model) for the workload instead
of routing every request to the most capable tier. Use `gpt-5.6` or
`gpt-5.6-sol` for frontier capability, `gpt-5.6-terra` for strong performance
at a lower price, and `gpt-5.6-luna` for efficient, high-volume workloads.

When migrating, preserve the current model's workload role and effective
reasoning effort for the first comparison. Run representative evals before
changing prompts or adding new capabilities. Compare task success, latency,
input, output, reasoning, and cache-write tokens, and cost per successful task.

## Set up `reasoning.effort`

Use `reasoning.effort` to decide how much thinking the model should do before it
answers.

For GPT-5.6 models, the supported values are `none`, `low`, `medium`, `high`,
`xhigh`, and `max`. The default is `medium`. Lower effort is faster and uses
fewer reasoning tokens. Higher effort gives the model more time for planning,
debugging, synthesis, and multi-step tradeoffs.

Use `low` when the job is mostly extraction, routing, classification, or a
simple rewrite. Use `medium` or `high` when the model needs to diagnose a
problem, compare options, write a plan, or reason through code. Use `xhigh` or
`max` only when representative evals show that the quality gain justifies the
extra latency and cost. When migrating from GPT-5.5 or GPT-5.4, start with the
current effort and compare the same setting with one level lower. GPT-5.6 can
often maintain or improve quality with fewer reasoning tokens, so the lower
setting may also reduce latency and cost.

For the hardest quality-first workloads, also compare
[`reasoning.mode: "pro"`](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) with
standard mode at the same effort. Reasoning mode and effort are independent.
Pro mode can improve reliability by applying more model work before returning a
single final answer, but it increases latency and token usage.

Tune reasoning effort for the task

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const prompt = [
  "Our CI job started failing after a dependency bump.",
  "",
  "Error:",
  "TypeError: Timeout.__init__() got an unexpected keyword argument 'connect'",
  "",
  "Identify the likeliest root cause and the smallest safe fix.",
].join("\n");

const response = await openai.responses.create({
  model: "gpt-5.6",
  reasoning: { effort: "xhigh", mode: "pro" },
  input: prompt,
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

prompt = """
Our CI job started failing after a dependency bump.

Error:
TypeError: Timeout.__init__() got an unexpected keyword argument 'connect'

Identify the likeliest root cause and the smallest safe fix.
"""

response = client.responses.create(
    model="gpt-5.6",
    reasoning={"effort": "xhigh", "mode": "pro"},
    input=prompt,
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	prompt := strings.Join([]string{
		"Our CI job started failing after a dependency bump.",
		"",
		"Error:",
		"TypeError: Timeout.__init__() got an unexpected keyword argument 'connect'",
		"",
		"Identify the likeliest root cause and the smallest safe fix.",
	}, "\n")
	reasoning := shared.ReasoningParam{Effort: shared.ReasoningEffortXhigh}
	reasoning.SetExtraFields(map[string]any{"mode": "pro"})
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:     "gpt-5.6",
		Reasoning: reasoning,
		Input:     responses.ResponseNewParamsInputUnion{OfString: openai.String(prompt)},
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
prompt = <<~PROMPT
  Our CI job started failing after a dependency bump.

  Error:
  TypeError: Timeout.__init__() got an unexpected keyword argument 'connect'

  Identify the likeliest root cause and the smallest safe fix.
PROMPT

response = client.responses.create(
  model: "gpt-5.6",
  reasoning: {effort: :xhigh, mode: :pro},
  input: prompt
)

puts(response.output_text)
```


## Set up `text.verbosity`

`text.verbosity` is the main lever for balancing brevity against completeness.
Use lower verbosity when the product needs a quick, compact answer, and higher
verbosity when the response needs richer explanation, clearer structure, or
complete context. Lower verbosity means fewer output tokens, so the model
generates less and returns output faster.

For coding, `medium` and `high` tend to produce longer, more organized output
with clearer structure. `low` keeps the answer tighter and more minimal.

GPT-5.6 tends to be more concise by default than GPT-5.5. When migrating, check
whether broad instructions like "Be concise" still help. In some cases, they may
make responses too brief. Keep them only when they still help, and prefer using
`text.verbosity` to control the default level of detail; then use the prompt to
specify required content, structure, and a more specific length, if applicable.

Set lower verbosity for compact output

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const incident = [
  "Summarize this incident for the next on-call engineer.",
  "- checkout latency spiked from 220 ms to 4.8 s",
  "- only us-east-1 was affected",
  "- rollback is complete",
  "- likely trigger: cache stampede after deploy",
].join("\n");

const response = await openai.responses.create({
  model: "gpt-5.6",
  text: { verbosity: "low" },
  input: incident,
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.6",
    text={"verbosity": "low"},
    input="""
    Summarize this incident for the next on-call engineer.
    - checkout latency spiked from 220 ms to 4.8 s
    - only us-east-1 was affected
    - rollback is complete
    - likely trigger: cache stampede after deploy
    """,
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	incident := strings.Join([]string{
		"Summarize this incident for the next on-call engineer.",
		"- checkout latency spiked from 220 ms to 4.8 s",
		"- only us-east-1 was affected",
		"- rollback is complete",
		"- likely trigger: cache stampede after deploy",
	}, "\n")
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Text:  responses.ResponseTextConfigParam{Verbosity: "low"},
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String(incident)},
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
incident = <<~INCIDENT
  Summarize this incident for the next on-call engineer.
  - checkout latency spiked from 220 ms to 4.8 s
  - only us-east-1 was affected
  - rollback is complete
  - likely trigger: cache stampede after deploy
INCIDENT

response = client.responses.create(
  model: "gpt-5.6",
  text: {verbosity: :low},
  input: incident
)

puts(response.output_text)
```


## Set up the assistant `phase` parameter

`phase` is a label on assistant messages in the conversation history. It
indicates to the model whether a prior assistant message was an intermediate
working commentary or the final answer. Use `phase: "commentary"` for progress
updates, pre-tool-call notes, and other in-between messages. Use
`phase: "final_answer"` for the completed response.

The assistant might say something like:

Assistant commentary message

```json
{
  "role": "assistant",
  "phase": "commentary",
  "content": "I'm checking the logs and comparing them to the last successful deploy."
}
```


That is not the answer. It is a progress note. Later, the assistant might say:

Assistant final answer message

```json
{
  "role": "assistant",
  "phase": "final_answer",
  "content": "The deploy failed because the migration referenced a column that does not exist in production."
}
```


This is useful in long-running or tool-heavy workflows where the assistant may
produce visible progress updates before it finishes. When you send that history
back on follow-up requests for `gpt-5.3-codex` and later models,
**preserve and resend `phase`** on assistant messages so the model can distinguish
progress updates from the final result. This helps reduce early stopping, making
the agent more likely to continue until it reaches the final answer.

## Use `tool_search`

Instead of loading the full tool catalog into every request, use
[tool search](https://developers.openai.com/api/docs/guides/tools-tool-search): add
`{"type": "tool_search"}` and mark expensive tool definitions with
`defer_loading: true`. The model can then load the subset it needs at runtime.
At request start, the model only sees the search tool name and description. If
the model decides it needs a deferred tool, it runs tool search, and only then
are the deferred tool definitions loaded into context. Only then will the model
call them. This saves tokens and preserves cache performance.

There are two modes:

- **Hosted tool search** is the simpler option. Use it when you already know
  which tools could be available for the request.
- **Client-executed tool search** is for cases where your app has to decide what
  tools are available, like based on the user's tenant, project, permissions, or
  internal registry.

**Start with hosted tool search** unless your app really needs to control
discovery itself.

Group your tools by user intent. Use namespaces or MCP servers when you can. It
is easier for the model to choose between a few clear groups than a long flat
list of functions. We recommend keeping each namespace under about 10 functions
for optimal token efficiency and model performance.

Keep namespace descriptions short and discriminative. Put the detailed
instructions inside the deferred tool definitions. Avoid making one giant
namespace for everything.

Use hosted tool search with deferred tools

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

/** @type {OpenAI.Responses.Tool} */
const billingNamespace = {
  type: "namespace",
  name: "billing",
  description: "Billing tools for invoices, payments, taxes, and credits.",
  tools: [
    {
      type: "function",
      name: "lookup_invoice",
      description:
        "Look up invoice state, taxes, credits, and payment attempts.",
      parameters: {
        type: "object",
        properties: {
          invoice_id: { type: "string" },
        },
        required: ["invoice_id"],
        additionalProperties: false,
      },
      strict: true,
      defer_loading: true,
    },
  ],
};

/** @type {OpenAI.Responses.Tool} */
const crmNamespace = {
  type: "namespace",
  name: "crm",
  description:
    "CRM tools for account ownership, plans, health, and payment history.",
  tools: [
    {
      type: "function",
      name: "get_account",
      description: "Fetch account owner, plan, health, and payment history.",
      parameters: {
        type: "object",
        properties: {
          account_id: { type: "string" },
        },
        required: ["account_id"],
        additionalProperties: false,
      },
      strict: true,
      defer_loading: true,
    },
  ],
};

const response = await openai.responses.create({
  model: "gpt-5.6",
  input:
    "Find the right billing tool and explain why invoice INV-1043 still " +
    "shows overdue after a payment yesterday.",
  tools: [billingNamespace, crmNamespace, { type: "tool_search" }],
});

console.log(response.output);
```

```python
from openai import OpenAI

client = OpenAI()

billing_namespace = {
    "type": "namespace",
    "name": "billing",
    "description": "Billing tools for invoices, payments, taxes, and credits.",
    "tools": [
        {
            "type": "function",
            "name": "lookup_invoice",
            "description": "Look up invoice state, taxes, credits, and payment attempts.",
            "parameters": {
                "type": "object",
                "properties": {
                    "invoice_id": {"type": "string"},
                },
                "required": ["invoice_id"],
                "additionalProperties": False,
            },
            "strict": True,
            "defer_loading": True,
        }
    ],
}

crm_namespace = {
    "type": "namespace",
    "name": "crm",
    "description": "CRM tools for account ownership, plans, health, and payment history.",
    "tools": [
        {
            "type": "function",
            "name": "get_account",
            "description": "Fetch account owner, plan, health, and payment history.",
            "parameters": {
                "type": "object",
                "properties": {
                    "account_id": {"type": "string"},
                },
                "required": ["account_id"],
                "additionalProperties": False,
            },
            "strict": True,
            "defer_loading": True,
        }
    ],
}

response = client.responses.create(
    model="gpt-5.6",
    input=(
        "Find the right billing tool and explain why invoice INV-1043 still "
        "shows overdue after a payment yesterday."
    ),
    tools=[billing_namespace, crm_namespace, {"type": "tool_search"}],
)

print(response.output)
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
	billing := namespaceTool(
		"billing",
		"Billing tools for invoices, payments, taxes, and credits.",
		"lookup_invoice",
		"Look up invoice state, taxes, credits, and payment attempts.",
		"invoice_id",
	)
	crm := namespaceTool(
		"crm",
		"CRM tools for account ownership, plans, health, and payment history.",
		"get_account",
		"Fetch account owner, plan, health, and payment history.",
		"account_id",
	)
	toolSearch := responses.ToolUnionParam{OfToolSearch: &responses.ToolSearchToolParam{}}
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String(
			"Find the right billing tool and explain why invoice INV-1043 still shows overdue after a payment yesterday.",
		)},
		Tools: []responses.ToolUnionParam{billing, crm, toolSearch},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response.Output)
}

func namespaceTool(namespace, namespaceDescription, name, description, argument string) responses.ToolUnionParam {
	parameters := map[string]any{
		"type": "object",
		"properties": map[string]any{
			argument: map[string]any{"type": "string"},
		},
		"required":             []string{argument},
		"additionalProperties": false,
	}
	function := responses.NamespaceToolToolFunctionParam{
		Name: name, Description: openai.String(description), Parameters: parameters, Strict: openai.Bool(true), DeferLoading: openai.Bool(true),
	}
	return responses.ToolParamOfNamespace(
		namespaceDescription,
		namespace,
		[]responses.NamespaceToolToolUnionParam{{OfFunction: &function}},
	)
}
```

```ruby
require "openai"

def namespace_tool(name, description, function_name, function_description, argument)
  {
    type: :namespace,
    name: name,
    description: description,
    tools: [
      {
        type: :function,
        name: function_name,
        description: function_description,
        defer_loading: true,
        strict: true,
        parameters: {
          type: "object",
          properties: {argument => {type: "string"}},
          required: [argument],
          additionalProperties: false
        }
      }
    ]
  }
end

client = OpenAI::Client.new
billing = namespace_tool(
  "billing",
  "Billing tools for invoices, payments, taxes, and credits.",
  "lookup_invoice",
  "Look up invoice state, taxes, credits, and payment attempts.",
  "invoice_id"
)
crm = namespace_tool(
  "crm",
  "CRM tools for account ownership, plans, health, and payment history.",
  "get_account",
  "Fetch account owner, plan, health, and payment history.",
  "account_id"
)

response = client.responses.create(
  model: "gpt-5.6",
  input: "Find the right billing tool and explain why invoice INV-1043 still shows overdue after a payment yesterday.",
  tools: [billing, crm, {type: :tool_search}]
)

puts(response.output)
```


## Use Programmatic Tool Calling

[Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling)
lets GPT-5.6 write JavaScript that calls eligible tools and reduces their
intermediate results inside a hosted runtime. Use it for bounded stages where
code can filter, join, rank, remove duplicates, combine, or check large tool
results before returning a smaller structured result to the model.

Add the `programmatic_tool_calling` tool and opt in each eligible tool. Use
`allowed_callers: ["programmatic"]` for program-only tools, or use
`allowed_callers: ["direct", "programmatic"]` when the model may also call the
tool directly. Keep calls direct when each result may change the model's next
decision, an action requires approval, or the final answer must preserve
citations or native artifacts. Document tool return fields and error behavior so
the model can write a correct program without first inspecting a result.

Your tool loop must handle `program` and `program_output` items, as well as
program-issued `function_call` items and their `function_call_output` items.
Preserve each `call_id`, and copy the function call's `caller` into its output so
the service can resume the correct program.

Test both the `program_output` and the final assistant message. A correct program
result can still become an incomplete final answer. Compare task success,
required evidence, total tokens, latency, and cost against the same workflow
using direct tool calls.

## Use Multi-agent for parallel work

[Multi-agent](https://developers.openai.com/api/docs/guides/responses-multi-agent) is a GPT-5.6 feature that
lets a root agent delegate independent workstreams to subagents and synthesize
their results. Use it when you can split research, analysis, or implementation
into concrete, bounded tasks that use separate context and run in parallel.

Set `multi_agent.enabled` to `true` in the request. For HTTP, use the beta
Responses SDK with `client.beta.responses` and pass `responses_multi_agent=v1`
in `betas`. For raw HTTP or WebSocket connections, send
`OpenAI-Beta: responses_multi_agent=v1`. Item schemas can change while
Multi-agent is in beta.

Prefer one agent for short tasks, ordered chains where each step depends on the
last, or work that writes to the same mutable resource. Subagents can increase
token usage, so start with the default `max_concurrent_subagents` value of `3`
and measure end-to-end quality, latency, and cost. For tool-heavy or long-running
Multi-agent workflows, WebSocket mode can reduce continuation overhead.

Before enabling Multi-agent, account for its current limitations:
`/responses/compact`, `reasoning.summary`, and `max_tool_calls` are not
supported. The server automatically compacts the root context and every
subagent context.

## Leverage built-in tools

[Built-in tools](https://developers.openai.com/api/docs/guides/tools) are the API's native capabilities.
Instead of building every tool yourself, you can give the model access to tools
that already work inside the Responses API. The model can then decide when to
use them.

OpenAI keeps adding more native tools, so start with built-in tools when they
fit your workflow. Build custom tools when native options do not cover the task.
Current built-in tools and related tool options include:

- **Web search**: Search the web for up-to-date information
- **File search**: Search uploaded files or vector stores
- **Code interpreter**: Run Python for analysis, math, charts, and file
  processing
- **Shell**: Run shell commands in a hosted container or your own runtime
- **Computer use**: Operate a UI through screenshots, clicks, typing, and
  scrolling
- **Image generation**: Generate or edit images
- **MCP/connectors**: Connect the model to external services and tools
- **Skills**: Attach reusable instruction bundles and workflow files
- **Apply patch**: Make structured code edits

There is also a model-quality reason to prefer them. Built-in tools are
in-distribution for our post-training, meaning that the models are trained and
evaluated around these tool shapes, behaviors, and outputs. With built-in tools,
OpenAI models support better tool selection, cleaner execution, and fewer
failures than with new tools.

## Leverage compaction

[Compaction](https://developers.openai.com/api/docs/guides/compaction) is a context engineering tool: it
decides what information the model carries forward across many turns. In
long-running agents, the problem is not just, "Will I hit the context limit?" It
is that old messages, tool logs, retries, and stale details crowd out the state
the model needs.

Compaction gives you a controlled way to reduce context size while preserving
state needed for subsequent turns. After a meaningful milestone, like finishing
a debugging phase or narrowing a root cause, you can compact the prior window
and continue from the compacted output. This keeps the model sharp because the
next turn is built around the important state, not every intermediate reasoning,
failed command, and obsolete branch of reasoning.

There are two ways to leverage compaction:

- **Let the server handle it**: if you use `previous_response_id`, turn on
  `context_management` with a `compact_threshold`. The server will automatically
  compact the conversation when it gets too large. You keep sending only the
  newest user message.
- **Do it yourself**: if you manage the full input array yourself, call
  `client.responses.compact()`. It gives back a smaller context window. Use that
  returned output directly in the next `responses.create()` call.

**Do not edit the compacted output.** It is not a human summary, but the machine
state that helps the model continue. Pass it forward as-is, then add the next
user message.

Continue from compacted response state

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

// Full window collected from a long debugging session:
// user messages, assistant outputs, tool calls, and tool outputs.
const longWindow = sessionItems;

const compacted = await openai.responses.compact({
  model: "gpt-5.6",
  input: longWindow,
});

const nextResponse = await openai.responses.create({
  model: "gpt-5.6",
  store: false,
  input: [
    ...compacted.output, // Use compact output as-is.
    {
      type: "message",
      role: "user",
      content:
        "We found the bad cache invalidation path. Write the fix plan " +
        "and the verification checklist.",
    },
  ],
});

console.log(nextResponse.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

# Full window collected from a long debugging session:
# user messages, assistant outputs, tool calls, and tool outputs.
long_window = session_items

compacted = client.responses.compact(
    model="gpt-5.6",
    input=long_window,
)

next_response = client.responses.create(
    model="gpt-5.6",
    store=False,
    input=[
        *compacted.output,  # Use compact output as-is.
        {
            "type": "message",
            "role": "user",
            "content": (
                "We found the bad cache invalidation path. Write the fix plan "
                "and the verification checklist."
            ),
        },
    ],
)

print(next_response.output_text)
```

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	longWindow := []responses.ResponseInputItemUnionParam{
		responses.ResponseInputItemParamOfMessage("Find the cache invalidation bug in this debugging session.", responses.EasyInputMessageRoleUser),
	}
	compacted, err := client.Responses.Compact(context.Background(), responses.ResponseCompactParams{
		Model: "gpt-5.6",
		Input: responses.ResponseCompactParamsInputUnion{OfResponseInputItemArray: longWindow},
	})
	if err != nil {
		panic(err)
	}
	input := append(outputAsInput(compacted.Output),
		responses.ResponseInputItemParamOfMessage(
			"We found the bad cache invalidation path. Write the fix plan and the verification checklist.",
			responses.EasyInputMessageRoleUser,
		),
	)
	nextResponse, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.6",
		Store: openai.Bool(false),
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: input},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(nextResponse.OutputText())
}

func outputAsInput(output []responses.ResponseOutputItemUnion) []responses.ResponseInputItemUnionParam {
	input := make([]responses.ResponseInputItemUnionParam, 0, len(output))
	for _, item := range output {
		var converted responses.ResponseInputItemUnion
		if err := json.Unmarshal([]byte(item.RawJSON()), &converted); err != nil {
			panic(err)
		}
		input = append(input, converted.ToParam())
	}
	return input
}
```

```ruby
require "openai"

client = OpenAI::Client.new
long_window = [
  {
    role: :user,
    content: "Find the cache invalidation bug in this debugging session."
  }
]

compacted = client.responses.compact(
  model: "gpt-5.6",
  input: long_window
)
input = compacted.output.map(&:to_h)
input << {
  role: :user,
  content: "We found the bad cache invalidation path. Write the fix plan and the verification checklist."
}

response = client.responses.create(
  model: "gpt-5.6",
  store: false,
  input: input
)

puts(response.output_text)
```


## Use `prompt_cache_key`

[Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) automatically reduces latency
and cost when requests reuse the same long prefix. For high-volume workflows,
set
[`prompt_cache_key`](https://developers.openai.com/api/reference/resources/responses/methods/create#responses-create-prompt_cache_key)
consistently for requests that share the same stable prefix. The service
combines the key with the prompt prefix hash to help route similar requests to
the same cache without changing the model input. Keep the key stable for
genuinely shared prefixes, choose a granularity that avoids sending too much
traffic to one key, and keep total traffic across the prefixes for each key to
about 15 requests per minute. Partition higher-volume traffic across more keys
with a stable mapping.

GPT-5.6 introduced explicit prompt caching. Implicit caching remains the
default, but GPT-5.6 models and later model families also support explicit
cache breakpoints and request-wide cache policy. On those models, set
`prompt_cache_key` to use the more reliable matching for both implicit caching
and explicit breakpoints. If a changing suffix comes after a stable prefix, add
an explicit `prompt_cache_breakpoint` at the reusable boundary. Set
`prompt_cache_options.mode` to `explicit` only when the request should use only
the breakpoints you provide and no implicit breakpoint. Earlier models continue
to use automatic prompt caching only.

On GPT-5.6 models and later model families, cache writes cost 1.25× the
uncached input token rate. Log `cached_tokens` and `cache_write_tokens`, then
compare write volume with later cache reads to measure net cost and tune key
granularity and breakpoint placement.

Route related requests to the same prompt cache

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

const instructions = [
  "You are the support agent for Acme.",
  "Follow the Acme support policy and escalation rubric.",
  "Use the same tone, safety rules, and tool plan for each ticket.",
].join("\n");

const response = await openai.responses.create({
  model: "gpt-5.6",
  prompt_cache_key: "tenant-acme-support-agent",
  instructions,
  input: "Summarize the current escalation for the on-call lead.",
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

instructions = """
You are the support agent for Acme.
Follow the Acme support policy and escalation rubric.
Use the same tone, safety rules, and tool plan for each ticket.
"""

response = client.responses.create(
    model="gpt-5.6",
    prompt_cache_key="tenant-acme-support-agent",
    instructions=instructions,
    input="Summarize the current escalation for the on-call lead.",
)

print(response.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	instructions := strings.Join([]string{
		"You are the support agent for Acme.",
		"Follow the Acme support policy and escalation rubric.",
		"Use the same tone, safety rules, and tool plan for each ticket.",
	}, "\n")
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:          "gpt-5.6",
		PromptCacheKey: openai.String("tenant-acme-support-agent"),
		Instructions:   openai.String(instructions),
		Input:          responses.ResponseNewParamsInputUnion{OfString: openai.String("Summarize the current escalation for the on-call lead.")},
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
instructions = <<~INSTRUCTIONS
  You are the support agent for Acme.
  Follow the Acme support policy and escalation rubric.
  Use the same tone, safety rules, and tool plan for each ticket.
INSTRUCTIONS

response = client.responses.create(
  model: "gpt-5.6",
  prompt_cache_key: "tenant-acme-support-agent",
  instructions: instructions,
  input: "Summarize the current escalation for the on-call lead."
)

puts(response.output_text)
```


## Use `reasoning.encrypted_content`

GPT-5.6 can [preserve reasoning across
calls](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls). Use
`reasoning.context: "all_turns"` when the task's goals, assumptions, and
priorities remain stable. Use `current_turn` when earlier reasoning is no longer
relevant and might anchor the model to an outdated approach. If you omit
`reasoning.context` or set it to `auto`, inspect the response's
`reasoning.context` field to confirm the effective mode.

[Persisted reasoning](https://developers.openai.com/api/docs/guides/reasoning#keeping-reasoning-items-in-context)
works only when earlier reasoning items are available. Use `previous_response_id`
for stored responses. If your [Zero Data Retention
(ZDR)](https://developers.openai.com/api/docs/guides/your-data#zero-data-retention) requirements do not allow
storing response data, encrypted reasoning content enables a stateless
handoff.

Reasoning items in the response output include encrypted reasoning content by
default. You can access the encrypted reasoning content from each reasoning
item's `encrypted_content` property. Your app does not need to understand that
value. It just keeps each reasoning item exactly as returned and sends it back
during the next turn, so the model can use it to continue the workflow.

Pass encrypted reasoning between stateless turns

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

/** @type {OpenAI.Responses.ResponseInput} */
const history = [
  {
    role: "user",
    content: "Investigate why invoice INV-1043 has mismatched tax totals.",
  },
];

const first = await openai.responses.create({
  model: "gpt-5.6",
  store: false,
  reasoning: { effort: "medium", context: "current_turn" },
  input: history,
});

history.push(...first.output);
history.push({
  role: "user",
  content: "Now write the customer-facing explanation in plain English.",
});

const second = await openai.responses.create({
  model: "gpt-5.6",
  store: false,
  reasoning: { effort: "medium", context: "all_turns" },
  input: history,
});

console.log(second.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

history = [
    {
        "role": "user",
        "content": "Investigate why invoice INV-1043 has mismatched tax totals.",
    }
]

first = client.responses.create(
    model="gpt-5.6",
    store=False,
    reasoning={"effort": "medium", "context": "current_turn"},
    input=history,
)

history.extend(item.model_dump(exclude={"status"}) for item in first.output)
history.append(
    {
        "role": "user",
        "content": "Now write the customer-facing explanation in plain English.",
    }
)

second = client.responses.create(
    model="gpt-5.6",
    store=False,
    reasoning={"effort": "medium", "context": "all_turns"},
    input=history,
)

print(second.output_text)
```

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	history := []responses.ResponseInputItemUnionParam{
		responses.ResponseInputItemParamOfMessage("Investigate why invoice INV-1043 has mismatched tax totals.", responses.EasyInputMessageRoleUser),
	}
	first, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:     "gpt-5.6",
		Store:     openai.Bool(false),
		Reasoning: shared.ReasoningParam{Effort: shared.ReasoningEffortMedium, Context: shared.ReasoningContextCurrentTurn},
		Include:   []responses.ResponseIncludable{responses.ResponseIncludableReasoningEncryptedContent},
		Input:     responses.ResponseNewParamsInputUnion{OfInputItemList: history},
	})
	if err != nil {
		panic(err)
	}
	history = append(history, outputAsInput(first.Output)...)
	history = append(history, responses.ResponseInputItemParamOfMessage(
		"Now write the customer-facing explanation in plain English.",
		responses.EasyInputMessageRoleUser,
	))
	second, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:     "gpt-5.6",
		Store:     openai.Bool(false),
		Reasoning: shared.ReasoningParam{Effort: shared.ReasoningEffortMedium, Context: shared.ReasoningContextAllTurns},
		Input:     responses.ResponseNewParamsInputUnion{OfInputItemList: history},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(second.OutputText())
}

func outputAsInput(output []responses.ResponseOutputItemUnion) []responses.ResponseInputItemUnionParam {
	input := make([]responses.ResponseInputItemUnionParam, 0, len(output))
	for _, item := range output {
		var converted responses.ResponseInputItemUnion
		if err := json.Unmarshal([]byte(item.RawJSON()), &converted); err != nil {
			panic(err)
		}
		input = append(input, converted.ToParam())
	}
	return input
}
```

```ruby
require "openai"

client = OpenAI::Client.new
history = [
  {
    role: :user,
    content: "Investigate why invoice INV-1043 has mismatched tax totals."
  }
]

first = client.responses.create(
  model: "gpt-5.6",
  store: false,
  reasoning: {effort: :medium, context: :current_turn},
  include: ["reasoning.encrypted_content"],
  input: history
)
history.concat(first.output.map(&:to_h))
history << {
  role: :user,
  content: "Now write the customer-facing explanation in plain English."
}

second = client.responses.create(
  model: "gpt-5.6",
  store: false,
  reasoning: {effort: :medium, context: :all_turns},
  input: history
)

puts(second.output_text)
```


## Set image detail intentionally

On GPT-5.6 models, omitted image `detail` and `detail: "auto"` use the same
sizing behavior as `original`. The service preserves the input dimensions
instead of resizing the image to a patch budget or pixel-dimension limit. Large
images can use more input tokens and add latency as a result.

Choose [`detail`](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level)
for the task. Resize the image, use `low` when fine visual detail is not
important, or use `high` for standard high-fidelity image understanding. Keep
`original` for large, dense, coordinate-sensitive, OCR, localization, or
visual-inspection tasks where the extra detail improves quality. Measure
worst-case image tokens and latency before deployment.

## Send a safety identifier

If your application serves individual end users, send a stable,
privacy-preserving
[`safety_identifier`](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
with each request. It helps OpenAI detect misuse and gives your team a stable way
to trace policy violations. It also reduces the chance that one user's misuse
disrupts access for your broader organization.

Hash the user's username or email address instead of sending identifying
information. For logged-out experiences, use a stable session ID.

## Use `background=True`

Use [`background=True`](https://developers.openai.com/api/docs/guides/background) for requests that may take
a long time. Instead of keeping the client connection open, the API starts a job
and returns an ID. Your app can poll that job until it finishes, fails, or is
canceled. Use it for large analyses, long tool runs, or work that needs status
and retry behavior.

Run and poll a background response

```javascript
import OpenAI from "openai";

const openai = new OpenAI();

let job = await openai.responses.create({
  model: "gpt-5.6",
  background: true,
  store: false,
  input: "Analyze this large log bundle and cluster the primary failure modes.",
  tools: [
    {
      type: "code_interpreter",
      container: {
        type: "auto",
        file_ids: [logBundleFileId],
      },
    },
  ],
});

while (["queued", "in_progress"].includes(job.status)) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  job = await openai.responses.retrieve(job.id);
}

console.log(job.output_text);
```

```python
from openai import OpenAI
import time

client = OpenAI()

job = client.responses.create(
    model="gpt-5.6",
    background=True,
    store=False,
    input="Analyze this large log bundle and cluster the primary failure modes.",
    tools=[
        {
            "type": "code_interpreter",
            "container": {
                "type": "auto",
                "file_ids": [log_bundle_file_id],
            },
        }
    ],
)

while job.status in {"queued", "in_progress"}:
    time.sleep(2)
    job = client.responses.retrieve(job.id)

print(job.output_text)
```

```go
package main

import (
	"context"
	"fmt"
	"time"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()
	tool := responses.ToolParamOfCodeInterpreter(responses.ToolCodeInterpreterContainerCodeInterpreterContainerAutoParam{
		FileIDs: []string{"file_abc123"},
	})
	job, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:      "gpt-5.6",
		Background: openai.Bool(true),
		Store:      openai.Bool(false),
		Input:      responses.ResponseNewParamsInputUnion{OfString: openai.String("Analyze this large log bundle and cluster the primary failure modes.")},
		Tools:      []responses.ToolUnionParam{tool},
	})
	if err != nil {
		panic(err)
	}
	for job.Status == responses.ResponseStatusQueued || job.Status == responses.ResponseStatusInProgress {
		time.Sleep(2 * time.Second)
		job, err = client.Responses.Get(context.Background(), job.ID, responses.ResponseGetParams{})
		if err != nil {
			panic(err)
		}
	}
	fmt.Println(job.OutputText())
}
```

```ruby
require "openai"

client = OpenAI::Client.new

job = client.responses.create(
  model: "gpt-5.6",
  background: true,
  store: false,
  input: "Analyze this large log bundle and cluster the primary failure modes.",
  tools: [
    {
      type: :code_interpreter,
      container: {type: :auto, file_ids: ["file_abc123"]}
    }
  ]
)

while [:queued, :in_progress].include?(job.status)
  sleep(2)
  job = client.responses.retrieve(job.id)
end

puts(job.output_text)
```


You can combine it with `stream=True` for progress events, but the first event
may take longer than a normal request.

From the UI perspective, background mode indicates, "This is running; here is
the status; the result will appear here when it's ready."

## Use WebSocket mode

[WebSocket mode](https://developers.openai.com/api/docs/guides/websocket-mode) is built for long-running,
tool-call-heavy workflows where you keep a persistent connection open and
continue by sending only new input items plus `previous_response_id`. For
rollouts with 20 or more tool calls, this approach is roughly 40% faster
end-to-end.

**How this works**: The first message will look like a normal Responses request:
model, instructions, tools, and user input. The server streams events back. If
the model asks for a tool, your app runs the tool. Then, instead of sending a new
HTTP request, you send another `response.create` event on the same socket with
the prior `previous_response_id` and the new item. That is where the latency win
comes from. In plain HTTP, every follow-up is a fresh request. In WebSocket mode,
the connection stays open and the most recent response state stays warm in
memory on that connection. When the next turn continues from that response, the
backend has to do less setup work.

If your workflow is one request, one answer, then **keep HTTP**. If your
workflow behaves like a long-running agent, try WebSocket mode.

A single WebSocket connection handles one in-flight response at a time, so
parallel work needs multiple connections. Connections currently top out at 60
minutes. Continuation uses the same `previous_response_id` semantics as HTTP
mode, with a connection-local cache for the most recent response.

Note: WebSocket mode works with ZDR because your data is not stored to disk,
only stored in memory.

The default Python sample uses `websocket-client` (`pip install
websocket-client`). The JavaScript sample uses `ws` (`npm install ws`).

Start a Responses API WebSocket session

```javascript
import OpenAI from "openai";
import WebSocket from "ws";

const openai = new OpenAI();

const ws = new WebSocket("wss://api.openai.com/v1/responses", {
  headers: {
    Authorization: "Bearer " + openai.apiKey,
  },
});

ws.on("open", () => {
  ws.send(
    JSON.stringify({
      type: "response.create",
      model: "gpt-5.6",
      store: false,
      input: [
        {
          type: "message",
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Find the flaky test in this run, call the tools you need, " +
                "and keep going until you can explain the root cause.",
            },
          ],
        },
      ],
      tools: [testLogTool, codeSearchTool],
    })
  );
});

ws.on("message", (data) => {
  const firstEvent = JSON.parse(data.toString());
  console.log(firstEvent.type);
});
```

```python
from openai import OpenAI
from websocket import create_connection
import json

client = OpenAI()

ws = create_connection(
    "wss://api.openai.com/v1/responses",
    header=[f"Authorization: Bearer {client.api_key}"],
)

# Same request body you would send to client.responses.create(...).
ws.send(
    json.dumps(
        {
            "type": "response.create",
            "model": "gpt-5.6",
            "store": False,
            "input": [
                {
                    "type": "message",
                    "role": "user",
                    "content": [
                        {
                            "type": "input_text",
                            "text": (
                                "Find the flaky test in this run, call the tools "
                                "you need, and keep going until you can explain "
                                "the root cause."
                            ),
                        }
                    ],
                }
            ],
            "tools": [test_log_tool, code_search_tool],
        }
    )
)

first_event = json.loads(ws.recv())
print(first_event["type"])
```


## Final takeaway

Responses API is the foundation for building smarter, more capable OpenAI
applications. The real advantage is that it lets developers move from one-off
prompts to durable, tool-using, context-aware workflows that can adapt to the
complexity of the task. Follow this guide to see higher performance in real
deployments.