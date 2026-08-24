# Using GPT-5.4

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Introduction

[GPT-5.4](https://developers.openai.com/api/docs/models/gpt-5.4) was released as a frontier model for professional work across the API and Codex. It helps developers analyze complex information, build production software, and automate multi-step workflows.

Within the GPT-5.4 generation, `gpt-5.4` is the general-purpose model for workflows that move between software engineering, reasoning, writing, and tool use.

This guide covers key features of the GPT-5 model family and how to get the most out of GPT-5.4.

## What's new

Compared with the previous GPT-5.2 model, GPT-5.4 shows improvements in:

- Coding, document understanding, tool use, and instruction following
- Image perception and multimodal tasks
- Long-running task execution and multi-step agent workflows
- Token efficiency and end-to-end performance on tool-heavy workloads
- Web search and multi-source synthesis for hard-to-locate information
- Document-heavy and spreadsheet-heavy business workflows in customer service, analytics, and finance

GPT-5.4 brings the coding capabilities of GPT-5.3-Codex to our flagship frontier model. Developers can generate production-quality code, build polished front-end UI, follow repo-specific patterns, and handle multi-file changes with fewer retries. It also has a strong out-of-the-box coding personality, so teams spend less time on prompt tuning.

For agentic workloads, GPT-5.4 reduces end-to-end time across multi-step trajectories and often completes tasks with fewer tokens and tool calls. This makes agents more responsive and lowers the cost of operating complex workflows at scale in the API and Codex.

### New features in GPT-5.4

Like earlier GPT-5 models, GPT-5.4 supports custom tools, parameters to control verbosity and reasoning, and an allowed tools list. GPT-5.4 also introduces several capabilities that make it easier to build powerful agent systems, operate over larger bodies of information, and run more reliable automated workflows:

- **`tool_search` in the API:** GPT-5.4 improves tool search for larger tool ecosystems by using deferred tool loading. This makes tools searchable, loads only the relevant definitions, reduces token usage, and improves tool selection accuracy in real deployments. Learn more in the [tool search guide](https://developers.openai.com/api/docs/guides/tools-tool-search).
- **1M token context window:** GPT-5.4 supports up to a 1M token context window, making it easier to analyze entire codebases, long document collections, or extended agent trajectories in a single request. Read more in the [1M context window](#1m-context-window) section.
- **Built-in computer use:** GPT-5.4 is the first mainline model with built-in computer-use capabilities, enabling agents to interact directly with software to complete, verify, and fix tasks in a build-run-verify-fix loop. Learn more in the [computer use guide](https://developers.openai.com/api/docs/guides/tools-computer-use).
- **Native compaction support:** GPT-5.4 is the first mainline model trained to support compaction, enabling longer agent trajectories while preserving key context.

## Model, API, and feature updates

Within this model generation, `gpt-5.4` is the general-purpose model for both broad tasks and coding. For more difficult problems, `gpt-5.4-pro` uses more compute to think longer and provide more consistent answers.

For smaller, faster variants, start with `gpt-5.4-mini` or `gpt-5.4-nano`.

To help you pick the model that best fits your use case, consider these tradeoffs:

| Variant                                         | Best for                                                                                                             |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| [`gpt-5.4`](https://developers.openai.com/api/docs/models/gpt-5.4)           | General-purpose work, including complex reasoning, broad world knowledge, and code-heavy or multi-step agentic tasks |
| [`gpt-5.4-pro`](https://developers.openai.com/api/docs/models/gpt-5.4-pro)   | Tough problems that may take longer to solve and need deeper reasoning                                               |
| [`gpt-5.4-mini`](https://developers.openai.com/api/docs/models/gpt-5.4-mini) | High-volume coding, computer use, and agent workflows that still need strong reasoning                               |
| [`gpt-5.4-nano`](https://developers.openai.com/api/docs/models/gpt-5.4-nano) | High-throughput tasks where speed and cost matter most                                                               |

### Lower reasoning effort

The `reasoning.effort` parameter controls how many reasoning tokens the model generates before producing a response. Earlier reasoning models like o3 supported only `low`, `medium`, and `high`: `low` favored speed and fewer tokens, while `high` favored more thorough reasoning.

GPT-5.2 and GPT-5.4 support `none` as their lowest reasoning effort for lower-latency interactions. It is the default setting for both models. If you need more thinking, slowly increase to `medium` and experiment with results.

With reasoning effort set to `none`, prompting is important. To improve the model's reasoning quality, even with the default settings, encourage it to “think” or outline its steps before answering.

Reasoning effort set to none

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.4",
  input:
    "Think carefully and outline your steps before answering. How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
  reasoning: {
    effort: "none",
  },
});

console.log(response);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.4",
    input="Think carefully and outline your steps before answering. How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
    reasoning={"effort": "none"},
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
	"github.com/openai/openai-go/v3/shared"
)

func main() {
	client := openai.NewClient()
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:     "gpt-5.4",
		Input:     responses.ResponseNewParamsInputUnion{OfString: openai.String("Think carefully and outline your steps before answering. How much gold would it take to coat the Statue of Liberty in a 1mm layer?")},
		Reasoning: shared.ReasoningParam{Effort: shared.ReasoningEffortNone},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response)
}
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.4",
  reasoning: {effort: :minimal},
  input: "Explain the bug and propose a fix."
)
puts(response.output_text)
```

```bash
curl --request POST \
  --url https://api.openai.com/v1/responses \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-type: application/json' \
  --data '{
        "model": "gpt-5.4",
        "input": "Think carefully and outline your steps before answering. How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
        "reasoning": {
                "effort": "none"
        }
}'
```


### Verbosity

Verbosity determines how many output tokens are generated. Lowering the number of tokens reduces overall latency. While the model's reasoning approach stays mostly the same, the model finds ways to answer more concisely—which can either improve or diminish answer quality, depending on your use case. Here are some scenarios for both ends of the verbosity spectrum:

- **High verbosity:** Use when you need the model to provide thorough explanations of documents or perform extensive code refactoring.
- **Low verbosity:** Best for situations where you want concise answers or focused code generation, such as SQL queries.

GPT-5 made this option configurable as one of `high`, `medium`, or `low`. With GPT-5.4, verbosity remains configurable and defaults to `medium`.

When generating code with GPT-5.4, `medium` and `high` verbosity levels yield longer, more structured code with inline explanations, while `low` verbosity produces shorter, more concise code with minimal commentary.

Control verbosity

```javascript
import OpenAI from "openai";
const openai = new OpenAI();

const response = await openai.responses.create({
  model: "gpt-5.4",
  input:
    "What is the answer to the ultimate question of life, the universe, and everything?",
  text: {
    verbosity: "low",
  },
});

console.log(response);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.4",
    input="What is the answer to the ultimate question of life, the universe, and everything?",
    text={"verbosity": "low"},
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
	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.4",
		Input: responses.ResponseNewParamsInputUnion{OfString: openai.String("What is the answer to the ultimate question of life, the universe, and everything?")},
		Text:  responses.ResponseTextConfigParam{Verbosity: responses.ResponseTextConfigVerbosityLow},
	})
	if err != nil {
		panic(err)
	}
	fmt.Println(response)
}
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-5.4",
  text: {verbosity: :low},
  input: "Explain the bug and propose a fix."
)
puts(response.output_text)
```

```bash
curl --request POST \
  --url https://api.openai.com/v1/responses \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-type: application/json' \
  --data '{
  "model": "gpt-5.4",
  "input": "What is the answer to the ultimate question of life, the universe, and everything?",
  "text": {
    "verbosity": "low"
  }
}'
```


You can still steer verbosity through prompting after setting it to `low` in the API. The verbosity parameter defines a general token range at the system prompt level, but the actual output is flexible to both developer and user prompts within that range.

#### 1M context window

1M token context window was introduced with GPT-5.4, making it easier to analyze entire codebases, long document collections, or extended agent trajectories in a single request.

We have separate standard pricing for requests under 272K and over 272K tokens, available in the [pricing docs](https://developers.openai.com/api/docs/pricing). If you use [Fast mode](https://developers.openai.com/api/docs/guides/fast-mode), any prompt above 272K tokens is automatically processed at standard rates.

Long context pricing stacks with other pricing modifiers such as data residency and batch.

We have different rate limits for requests under 272K tokens and over 272K tokens; this is available on the [GPT-5.4 model page](https://developers.openai.com/api/docs/models/gpt-5.4).

## Using tools with GPT-5.4

GPT-5.4 has been post-trained on specific tools. See the [tools docs](https://developers.openai.com/api/docs/guides/tools) for more specific guidance.

### Computer use tool

Computer use lets GPT-5.4 operate software through the user interface by inspecting screenshots and returning structured actions for your harness to execute. It is a good fit for browser or desktop workflows where a person could complete the task through the UI, such as navigating a site, filling out forms, or validating that a change actually worked.

Use it in an isolated browser or VM, and keep a human in the loop for high-impact actions. The full guide covers the built-in Responses API loop, custom harness patterns, and code-execution-based setups.

[Computer use guide



      Learn how to run the built-in computer tool safely and integrate it with
    your own harness.](https://developers.openai.com/api/docs/guides/tools-computer-use)

### Tool search tool

Tool search lets GPT-5.4 defer large tool surfaces until runtime so the model loads only the definitions it needs. This is most useful when you have many functions, `namespaces`, or MCP tools and want to reduce token usage, preserve cache performance, and improve latency without exposing every schema up front.

Use hosted tool search when the candidate tools are already known at request time, or client-executed tool search when your application needs to decide what to load dynamically. The full guide also covers best practices for `namespaces`, MCP servers, and deferred loading.

[Tool search guide



      Learn how to defer tool definitions and load the right subset at runtime.](https://developers.openai.com/api/docs/guides/tools-tool-search)

### Custom tools

When the GPT-5 model family launched, we introduced a new capability called custom tools, which lets models send any raw text as tool call input but still constrain outputs if desired. This tool behavior remains true in GPT-5.4.

[Function calling guide



      Learn about custom tools in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

#### Freeform inputs

Define your tool with `type: custom` to enable models to send plaintext inputs directly to your tools, rather than being limited to structured JSON. The model can send any raw text—code, SQL queries, shell commands, configuration files, or long-form prose—directly to your tool.

```json
{
  "type": "custom",
  "name": "code_exec",
  "description": "Executes arbitrary python code"
}
```

#### Constraining outputs

GPT-5.4 supports context-free grammars (`CFGs`) for custom tools, letting you provide a Lark grammar to constrain outputs to a specific syntax or DSL. Attaching a CFG, for example a SQL or DSL grammar, ensures the assistant's text matches your grammar.

This enables precise, constrained tool calls or structured responses and lets you enforce strict syntactic or domain-specific formats directly in GPT-5.4's function calling, improving control and reliability for complex or constrained domains.

#### Best practices for custom tools

- **Write concise, explicit tool descriptions.** The model chooses what to send based on your description; state explicitly if you want it to always call the tool.
- **Validate outputs on the server side**. Freeform strings are powerful but require safeguards against injection or unsafe commands.

### Allowed tools

The `allowed_tools` parameter under `tool_choice` lets you pass N tool definitions but restrict the model to only M (&lt; N) of them. List your full toolkit in `tools`, and then use an `allowed_tools` block to name the subset and specify a mode—either `auto` (the model may pick any of those) or `required` (the model must invoke one).

[Function calling guide



      Learn about the allowed tools option in the function calling guide.](https://developers.openai.com/api/docs/guides/function-calling)

By separating all possible tools from the subset that can be used _now_, you gain greater safety, predictability, and improved prompt caching. You also avoid brittle prompt engineering, such as hard-coded call order. GPT-5.4 dynamically invokes or requires specific functions mid-conversation while reducing the risk of unintended tool usage over long contexts.

|                  | **Standard Tools**                        | **Allowed Tools**                                             |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------- |
| Model's universe | All tools listed under **`"tools": […]`** | Only the subset under **`"tools": […]`** in **`tool_choice`** |
| Tool invocation  | Model may or may not call any tool        | Model restricted to (or required to call) chosen tools        |
| Purpose          | Declare available capabilities            | Constrain which capabilities are actually used                |

```json
{
  "tool_choice": {
    "type": "allowed_tools",
    "mode": "auto",
    "tools": [
      { "type": "function", "name": "get_weather" },
      { "type": "function", "name": "search_docs" }
    ]
  }
}
```

For a more detailed overview of all of these new features, see the [prompt guidance for GPT-5.4](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#prompting-best-practices).

### Preambles

Preambles are brief, user-visible explanations that GPT-5.4 generates before invoking any tool or function, outlining its intent or plan—for example, “why I'm calling this tool.” They appear after the chain of thought and before the actual tool call, making the model's reasoning easier to understand and debug while supporting precise steering.

By letting GPT-5.4 “think out loud” before each tool call, preambles boost tool-calling accuracy (and overall task success) without bloating reasoning overhead. To enable preambles, add a system or developer instruction—for example: “Before you call a tool, explain why you are calling it.” GPT-5.4 adds a concise rationale to each specified tool call. The model may also output multiple messages between tool calls, which can enhance the interaction experience—particularly for minimal reasoning or latency-sensitive use cases.

For more on using preambles, see the [GPT-5 prompting cookbook](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide#tool-preambles).

## Migration quickstart

GPT-5.4 works best with the Responses API, which supports preserving reasoning context between turns to improve performance. Read below to migrate from your current model or API.

### Migrating from other models to GPT-5.4

Use the [OpenAI Docs
  skill](https://github.com/openai/skills/tree/main/skills/.system/openai-docs)
  when migrating existing prompts or workflows to GPT-5.4. It's available in our
  public skills repository and the Codex desktop app.

While the model should be close to a drop-in replacement for GPT-5.2, there are a few key changes to call out. See [Prompt guidance for GPT-5.4](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#prompting-best-practices) for specific updates to make in your prompts.

Using GPT-5 models with the Responses API provides improved intelligence because of the API design. The Responses API can pass the previous turn's CoT to the model. This leads to fewer generated reasoning tokens, higher cache hit rates, and less latency. To learn more, see an [in-depth guide](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items) on the benefits of the Responses API.

When migrating to GPT-5.4 from an older OpenAI model, start by experimenting with reasoning levels and prompting strategies. Use the [prompt optimizer](https://platform.openai.com/chat/edit?models=gpt-5.4&optimize=true) to update your prompts for GPT-5.4 based on current best practices, then follow this model-specific guidance:

- **`gpt-5.2`**: `gpt-5.4` with default settings is meant to be a drop-in replacement.
- **o3**: `gpt-5.4` with `medium` or `high` reasoning. Start with `medium` reasoning with prompt tuning, then increase to `high` if you aren't getting the results you want.
- **`gpt-4.1`**: `gpt-5.4` with `none` reasoning. Start with `none` and tune your prompts; increase if you need better performance.
- **`o4-mini` or `gpt-4.1-mini`**: `gpt-5.4-mini` with prompt tuning is a great replacement.
- **`gpt-4.1-nano`**: `gpt-5.4-nano` with prompt tuning is a great replacement.

### New `phase` parameter

For long-running or tool-heavy GPT-5.4 flows in the Responses API, use the assistant message `phase` field to avoid early stopping and other misbehavior.

`phase` is optional at the API level, but we highly recommend using it. Use `phase: "commentary"` for intermediate assistant updates (such as preambles before tool calls) and `phase: "final_answer"` for the completed answer. Do not add `phase` to user messages.

If you use `previous_response_id`, that is usually the simplest path because
  prior assistant state is preserved. If you replay assistant history manually,
  preserve each original `phase` value.

Missing or dropped `phase` can cause preambles to be treated as final answers
in those workflows. For additional guidance and examples, see the [GPT-5.4
prompting guide](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.4#phase-parameter).

Round-trip assistant phase values

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const response = await client.responses.create({
  model: "gpt-5.4",
  input: [
    {
      role: "assistant",
      phase: "commentary",
      content:
        "I’ll inspect the logs and then summarize root cause and remediation.",
    },
    {
      role: "assistant",
      phase: "final_answer",
      content: "Root cause: cache invalidation race.",
    },
    {
      role: "user",
      content: "Great—now give me a rollout-safe fix plan.",
    },
  ],
});

console.log(response.output_text);
```

```python
from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-5.4",
    input=[
        {
            "role": "assistant",
            "phase": "commentary",
            "content": "I’ll inspect the logs and then summarize root cause and remediation.",
        },
        {
            "role": "assistant",
            "phase": "final_answer",
            "content": "Root cause: cache invalidation race.",
        },
        {
            "role": "user",
            "content": "Great—now give me a rollout-safe fix plan.",
        },
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
	commentary := responses.ResponseInputItemParamOfMessage(
		"I’ll inspect the logs and then summarize root cause and remediation.",
		responses.EasyInputMessageRoleAssistant,
	)
	commentary.OfMessage.Phase = responses.EasyInputMessagePhaseCommentary
	finalAnswer := responses.ResponseInputItemParamOfMessage(
		"Root cause: cache invalidation race.",
		responses.EasyInputMessageRoleAssistant,
	)
	finalAnswer.OfMessage.Phase = responses.EasyInputMessagePhaseFinalAnswer

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model: "gpt-5.4",
		Input: responses.ResponseNewParamsInputUnion{OfInputItemList: responses.ResponseInputParam{
			commentary,
			finalAnswer,
			responses.ResponseInputItemParamOfMessage("Great—now give me a rollout-safe fix plan.", responses.EasyInputMessageRoleUser),
		}},
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
  model: "gpt-5.4",
  reasoning: {effort: :medium},
  input: "Explain the bug and propose a fix."
)
puts(response.output_text)
```


### GPT-5.4 parameter compatibility

The following parameters are **only supported** when using GPT-5.4 with reasoning effort set to `none`:

- `temperature`
- `top_p`
- `logprobs`

Requests that include these fields will raise an error for GPT-5.4 or GPT-5.2 with any other reasoning effort setting, or for older GPT-5 models such as `gpt-5`, `gpt-5-mini`, or `gpt-5-nano`.

To achieve similar results with reasoning effort set higher, or with another GPT-5 family model, try these alternative parameters:

- **Reasoning depth:** `reasoning: { effort: "none" | "low" | "medium" | "high" | "xhigh" }`
- **Output verbosity:** `text: { verbosity: "low" | "medium" | "high" }`
- **Output length:** `max_output_tokens`

### Migrating from Chat Completions to Responses API

The biggest difference, and main reason to migrate from Chat Completions to the Responses API for GPT-5.4, is support for passing chain of thought (CoT) between turns. See a full [comparison of the APIs](https://developers.openai.com/api/docs/guides/migrate-to-responses).

Passing CoT exists only in the Responses API, and we've seen improved intelligence, fewer generated reasoning tokens, higher cache hit rates, and lower latency as a result of doing so. Most other parameters remain at parity, though the formatting is different. Here's how new parameters are handled differently between Chat Completions and the Responses API:

**Reasoning effort**



Responses API

    Generate response with reasoning effort set to none

```bash
curl --request POST \
  --url https://api.openai.com/v1/responses \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header "Content-type: application/json" \
  --data '{
  "model": "gpt-5.4",
  "input": "How much gold would it take to coat the Statue of Liberty in a 1mm layer?",
  "reasoning": {
    "effort": "none"
  }
}'
```

  

  

    
Chat Completions

    Generate response with reasoning effort set to none

```bash
curl --request POST \
  --url https://api.openai.com/v1/chat/completions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header "Content-type: application/json" \
  --data '{
  "model": "gpt-5.4",
  "messages": [
    {
      "role": "user",
      "content": "How much gold would it take to coat the Statue of Liberty in a 1mm layer?"
    }
  ],
  "reasoning_effort": "none"
}'
```



**Verbosity**



Responses API

    Control verbosity

```bash
curl --request POST \
  --url https://api.openai.com/v1/responses \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header "Content-type: application/json" \
  --data '{
  "model": "gpt-5.4",
  "input": "What is the answer to the ultimate question of life, the universe, and everything?",
  "text": {
    "verbosity": "low"
  }
}'
```

  

  

    
Chat Completions

    Control verbosity

```bash
curl --request POST \
  --url https://api.openai.com/v1/chat/completions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header "Content-type: application/json" \
  --data '{
  "model": "gpt-5.4",
  "messages": [
    {
      "role": "user",
      "content": "What is the answer to the ultimate question of life, the universe, and everything?"
    }
  ],
  "verbosity": "low"
}'
```



**Custom tools**



Responses API

    Custom tool call

```bash
curl --request POST \
  --url https://api.openai.com/v1/responses \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header "Content-type: application/json" \
  --data '{
  "model": "gpt-5.4",
  "input": "Use the code_exec tool to calculate the area of a circle with radius equal to the number of r letters in blueberry",
  "tools": [
    {
      "type": "custom",
      "name": "code_exec",
      "description": "Executes arbitrary Python code"
    }
  ]
}'
```

  

  

    
Chat Completions

    Custom tool call

```bash
curl --request POST \
  --url https://api.openai.com/v1/chat/completions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header "Content-type: application/json" \
  --data '{
  "model": "gpt-5.4",
  "messages": [
    {
      "role": "user",
      "content": "Use the code_exec tool to calculate the area of a circle with radius equal to the number of r letters in blueberry"
    }
  ],
  "tools": [
    {
      "type": "custom",
      "custom": {
        "name": "code_exec",
        "description": "Executes arbitrary Python code"
      }
    }
  ]
}'
```




## Prompting best practices

When troubleshooting cases where GPT-5.4 treats an intermediate update as the
  final answer, verify your integration preserves the assistant message `phase`
  field correctly. See [Phase parameter](#phase-parameter) for details.

### Understand GPT-5.4 behavior

#### Where GPT-5.4 is strongest

GPT-5.4 tends to work especially well in these areas:

- Strong personality and tone adherence, with less drift over long answers
- Agentic workflow robustness, with a stronger tendency to stick with multi-step work, retry, and complete agent loops end to end
- Evidence-rich synthesis, especially in long-context or multi-tool workflows
- Instruction adherence in modular, skill-based, and block-structured prompts when the contract is explicit
- Long-context analysis across large, messy, or multi-document inputs
- Batched or parallel tool calling while maintaining tool-call accuracy
- Spreadsheet, finance, and Excel workflows that need instruction following, formatting fidelity, and stronger self-verification

#### Where explicit prompting still helps

Even with those strengths, GPT-5.4 benefits from more explicit guidance in a few recurring patterns:

- Low-context tool routing early in a session, when tool selection can be less reliable
- Dependency-aware workflows that need explicit prerequisite and downstream-step checks
- Reasoning effort selection, where higher effort is not always better and the right choice depends on task shape, not intuition
- Research tasks that require disciplined source collection and consistent citations
- Irreversible or high-impact actions that require verification before execution
- Terminal or coding-agent environments where tool boundaries must stay clear

These patterns are observed defaults, not guarantees. Start with the smallest prompt that passes your evals, and add blocks only when they fix a measured failure mode.

### Use core prompt patterns

#### Keep outputs compact and structured

To improve token efficiency with GPT-5.4, constrain verbosity and enforce structured output through clear output contracts. In practice, this acts as an additional control layer alongside the `verbosity` parameter in the Responses API, allowing you to guide both how much the model writes and how it structures the output.

```xml
<output_contract>
- Return exactly the sections requested, in the requested order.
- If the prompt defines a preamble, analysis block, or working section, do not treat it as extra output.
- Apply length limits only to the section they are intended for.
- If a format is required (JSON, Markdown, SQL, XML), output only that format.
</output_contract>

<verbosity_controls>
- Prefer concise, information-dense writing.
- Avoid repeating the user's request.
- Keep progress updates brief.
- Do not shorten the answer so aggressively that required evidence, reasoning, or completion checks are omitted.
</verbosity_controls>
```

#### Set clear defaults for follow-through

Users often change the task, format, or tone mid-conversation. To keep the assistant aligned, define clear rules for when to proceed, when to ask, and how newer instructions override earlier defaults.

Use a default follow-through policy like this:

```xml
<default_follow_through_policy>
- If the user’s intent is clear and the next step is reversible and low-risk, proceed without asking.
- Ask permission only if the next step is:
  (a) irreversible,
  (b) has external side effects (for example sending, purchasing, deleting, or writing to production), or
  (c) requires missing sensitive information or a choice that would materially change the outcome.
- If proceeding, briefly state what you did and what remains optional.
</default_follow_through_policy>
```

Make instruction priority explicit:

```xml
<instruction_priority>
- User instructions override default style, tone, formatting, and initiative preferences.
- Safety, honesty, privacy, and permission constraints do not yield.
- If a newer user instruction conflicts with an earlier one, follow the newer instruction.
- Preserve earlier instructions that do not conflict.
</instruction_priority>
```

Higher-priority developer or system instructions remain binding.

**Guidance:** When instructions change mid-conversation, make the update explicit, scoped, and local. State what changed, what still applies, and whether the change affects the next turn or the rest of the conversation.

#### Handle mid-conversation instruction updates

For mid-conversation updates, use explicit, scoped steering messages that state:

1. Scope
2. Override
3. Carry forward

```text
<task_update>
For the next response only:
- Do not complete the task.
- Only produce a plan.
- Keep it to 5 bullets.

All earlier instructions still apply unless they conflict with this update.
</task_update>
```

If the task itself changes, say so directly:

```text
<task_update>
The task has changed.
Previous task: complete the workflow.
Current task: review the workflow and identify risks only.

Rules for this turn:
- Do not execute actions.
- Do not call destructive tools.
- Return exactly:
  1. Main risks
  2. Missing information
  3. Recommended next step
</task_update>
```

#### Make tool use persistent when correctness depends on it

Use explicit rules to keep tool use thorough, dependency-aware, and appropriately paced, especially in workflows where later actions rely on earlier retrieval or verification. A common failure mode is skipping prerequisites because the right end state seems obvious.

GPT-5.4 can be less reliable at tool routing early in a session, when context is still thin. Prompt for prerequisites, dependency checks, and exact tool intent.

```xml
<tool_persistence_rules>
- Use tools whenever they materially improve correctness, completeness, or grounding.
- Do not stop early when another tool call is likely to materially improve correctness or completeness.
- Keep calling tools until:
  (1) the task is complete, and
  (2) verification passes (see <verification_loop>).
- If a tool returns empty or partial results, retry with a different strategy.
</tool_persistence_rules>
```

This is especially important for workflows where the final action depends on earlier lookup or retrieval steps. One of the most common failure modes is skipping prerequisites because the intended end state seems obvious.

```xml
<dependency_checks>
- Before taking an action, check whether prerequisite discovery, lookup, or memory retrieval steps are required.
- Do not skip prerequisite steps just because the intended final action seems obvious.
- If the task depends on the output of a prior step, resolve that dependency first.
</dependency_checks>
```

Prompt for parallelism when the work is independent and wall-clock matters. Prompt for sequencing when dependencies, ambiguity, or irreversible actions matter more than speed.

```xml
<parallel_tool_calling>
- When multiple retrieval or lookup steps are independent, prefer parallel tool calls to reduce wall-clock time.
- Do not parallelize steps that have prerequisite dependencies or where one result determines the next action.
- After parallel retrieval, pause to synthesize the results before making more calls.
- Prefer selective parallelism: parallelize independent evidence gathering, not speculative or redundant tool use.
</parallel_tool_calling>
```

#### Force completeness on long-horizon tasks

For multi-step workflows, a common failure mode is incomplete execution: the model finishes after partial coverage, misses items in a batch, or treats empty or narrow retrieval as final. GPT-5.4 becomes more reliable when the prompt defines explicit completion rules and recovery behavior.

Coverage can be achieved through sequential or parallel retrieval, but completion rules should remain explicit either way.

```xml
<completeness_contract>
- Treat the task as incomplete until all requested items are covered or explicitly marked [blocked].
- Keep an internal checklist of required deliverables.
- For lists, batches, or paginated results:
  - determine expected scope when possible,
  - track processed items or pages,
  - confirm coverage before finalizing.
- If any item is blocked by missing data, mark it [blocked] and state exactly what is missing.
</completeness_contract>
```

For workflows where empty, partial, or noisy retrieval is common:

```xml
<empty_result_recovery>
If a lookup returns empty, partial, or suspiciously narrow results:
- do not immediately conclude that no results exist,
- try at least one or two fallback strategies,
  such as:
  - alternate query wording,
  - broader filters,
  - a prerequisite lookup,
  - or an alternate source or tool,
- Only then report that no results were found, along with what you tried.
</empty_result_recovery>
```

#### Add a verification loop before high-impact actions

Once the workflow appears complete, add a lightweight verification step before returning the answer or taking an irreversible action. This helps catch requirement misses, grounding issues, and format drift before commit.

```xml
<verification_loop>
Before finalizing:
- Check correctness: does the output satisfy every requirement?
- Check grounding: are factual claims backed by the provided context or tool outputs?
- Check formatting: does the output match the requested schema or style?
- Check safety and irreversibility: if the next step has external side effects, ask permission first.
</verification_loop>
```

```xml
<missing_context_gating>
- If required context is missing, do NOT guess.
- Prefer the appropriate lookup tool when the missing context is retrievable; ask a minimal clarifying question only when it is not.
- If you must proceed, label assumptions explicitly and choose a reversible action.
</missing_context_gating>
```

For agents that actively take actions, add a short execution frame:

```xml
<action_safety>
- Pre-flight: summarize the intended action and parameters in 1-2 lines.
- Execute via tool.
- Post-flight: confirm the outcome and any validation that was performed.
</action_safety>
```

### Handle specialized workflows

#### Choose image detail explicitly for vision and computer use

If your workflow depends on visual precision, specify the image `detail` level in the prompt or integration instead of relying on `auto`. Use `high` for standard high-fidelity image understanding. Use `original` for large, dense, or spatially sensitive images, especially [computer use, localization, OCR, and click-accuracy tasks](https://developers.openai.com/api/docs/guides/tools-computer-use) on `gpt-5.4` and future models. Use `low` only when speed and cost matter more than fine detail. For more details on image detail levels, see the [Images and Vision guide](https://developers.openai.com/api/docs/guides/images-vision).

#### Lock research and citations to retrieved evidence

When citation quality matters, make both the source boundary and the format requirement explicit. This helps reduce fabricated references, unsupported claims, and citation-format drift.

```xml
<citation_rules>
- Only cite sources retrieved in the current workflow.
- Never fabricate citations, URLs, IDs, or quote spans.
- Use exactly the citation format required by the host application.
- Attach citations to the specific claims they support, not only at the end.
</citation_rules>
```

```xml
<grounding_rules>
- Base claims only on provided context or tool outputs.
- If sources conflict, state the conflict explicitly and attribute each side.
- If the context is insufficient or irrelevant, narrow the answer or say you cannot support the claim.
- If a statement is an inference rather than a directly supported fact, label it as an inference.
</grounding_rules>
```

If your application requires inline citations, require inline citations. If it requires footnotes, require footnotes. The key is to lock the format and prevent the model from improvising unsupported references.

#### Research mode

Push GPT-5.4 into a disciplined research mode. Use this pattern for research, review, and synthesis tasks. Do not force it onto short execution tasks or simple deterministic transforms.

```xml
<research_mode>
- Do research in 3 passes:
  1) Plan: list 3-6 sub-questions to answer.
  2) Retrieve: search each sub-question and follow 1-2 second-order leads.
  3) Synthesize: resolve contradictions and write the final answer with citations.
- Stop only when more searching is unlikely to change the conclusion.
</research_mode>
```

If your host environment uses a specific research tool or requires a submit step, combine this with the host's finalization contract.

#### Clamp strict output formats

For SQL, JSON, or other parse-sensitive outputs, tell GPT-5.4 to emit only the target format and check it before finishing.

```text
<structured_output_contract>
- Output only the requested format.
- Do not add prose or markdown fences unless they were requested.
- Validate that parentheses and brackets are balanced.
- Do not invent tables or fields.
- If required schema information is missing, ask for it or return an explicit error object.
</structured_output_contract>
```

If you are extracting document regions or OCR boxes, define the coordinate system and add a drift check:

```text
<bbox_extraction_spec>
- Use the specified coordinate format exactly, such as [x1,y1,x2,y2] normalized to 0..1.
- For each box, include page, label, text snippet, and confidence.
- Add a vertical-drift sanity check so boxes stay aligned with the correct line of text.
- If the layout is dense, process page by page and do a second pass for missed items.
</bbox_extraction_spec>
```

#### Keep tool boundaries explicit in coding and terminal agents

In coding agents, GPT-5.4 works better when the rules for shell access and file editing are unambiguous. This is especially important when you expose tools like [Shell](https://developers.openai.com/api/docs/guides/tools-shell) or [Apply patch](https://developers.openai.com/api/docs/guides/tools-apply-patch).

#### User updates

GPT-5.4 does well with brief, outcome-based updates. Reuse the user-updates pattern from the 5.2 guide, but pair it with explicit completion and verification requirements.

Recommended update spec:

```xml
<user_updates_spec>
- Only update the user when starting a new major phase or when something changes the plan.
- Each update: 1 sentence on outcome + 1 sentence on next step.
- Do not narrate routine tool calls.
- Keep the user-facing status short; keep the work exhaustive.
</user_updates_spec>
```

For coding agents, see the Prompting patterns for coding tasks section below for more specific guidance.

#### Prompting patterns for coding tasks

**Autonomy and persistence**

GPT-5.4 is generally more thorough end to end than earlier mainline models on coding and tool-use tasks, so you often need less explicit "verify everything" prompting. Still, for high-stakes changes such as production, migrations, or security work, keep a lightweight verification clause.

```xml
<autonomy_and_persistence>
Persist until the task is fully handled end-to-end within the current turn whenever feasible: do not stop at analysis or partial fixes; carry changes through implementation, verification, and a clear explanation of outcomes unless the user explicitly pauses or redirects you.

Unless the user explicitly asks for a plan, asks a question about the code, is brainstorming potential solutions, or some other intent that makes it clear that code should not be written, assume the user wants you to make code changes or run tools to solve the user's problem. In these cases, it's bad to output your proposed solution in a message, you should go ahead and actually implement the change. If you encounter challenges or blockers, you should attempt to resolve them yourself.
</autonomy_and_persistence>
```

**Intermediary updates**

Keep updates sparse and high-signal. In coding tasks, prefer updates at key points.

```xml
<user_updates_spec>
- Intermediary updates go to the `commentary` channel.
- User updates are short updates while you are working. They are not final answers.
- Use 1-2 sentence updates to communicate progress and new information while you work.
- Do not begin responses with conversational interjections or meta commentary. Avoid openers such as acknowledgements ("Done -", "Got it", or "Great question") or similar framing.
- Before exploring or doing substantial work, send a user update explaining your understanding of the request and your first step. Avoid commenting on the request or starting with phrases such as "Got it" or "Understood."
- Provide updates roughly every 30 seconds while working.
- When exploring, explain what context you are gathering and what you learned. Vary sentence structure so the updates do not become repetitive.
- When working for a while, keep updates informative and varied, but stay concise.
- When work is substantial, provide a longer plan after you have enough context. This is the only update that may be longer than 2 sentences and may contain formatting.
- Before file edits, explain what you are about to change.
- While thinking, keep the user informed of progress without narrating every tool call. Even if you are not taking actions, send frequent progress updates rather than going silent, especially if you are thinking for more than a short stretch.
- Keep the tone of progress updates consistent with the assistant's overall personality.
</user_updates_spec>
```

**Formatting**

GPT-5.4 often defaults to more structured formatting and may overuse bullet lists. If you want a clean final response, explicitly clamp list shape.

```xml
Never use nested bullets. Keep lists flat (single level). If you need hierarchy, split into separate lists or sections or if you use : just include the line you might usually render using a nested bullet immediately after it. For numbered lists, only use the `1. 2. 3.` style markers (with a period), never `1)`.
```

**Frontend tasks**

Use this only when additional frontend guidance is useful.

```xml
<frontend_tasks>
When doing frontend design tasks, avoid generic, overbuilt layouts.

Use these hard rules:
- One composition: The first viewport must read as one composition, not a dashboard, unless it is a dashboard.
- Brand first: On branded pages, the brand or product name must be a hero-level signal, not just nav text or an eyebrow. No headline should overpower the brand.
- Brand test: If the first viewport could belong to another brand after removing the nav, the branding is too weak.
- Full-bleed hero only: On landing pages and promotional surfaces, the hero image should usually be a dominant edge-to-edge visual plane or background. Do not default to inset hero images, side-panel hero images, rounded media cards, tiled collages, or floating image blocks unless the existing design system clearly requires them.
- Hero budget: The first viewport should usually contain only the brand, one headline, one short supporting sentence, one CTA group, and one dominant image. Do not place stats, schedules, event listings, address blocks, promos, "this week" callouts, metadata rows, or secondary marketing content there.
- No hero overlays: Do not place detached labels, floating badges, promo stickers, info chips, or callout boxes on top of hero media.
- Cards: Default to no cards. Never use cards in the hero unless they are the container for a user interaction. If removing a border, shadow, background, or radius does not hurt interaction or understanding, it should not be a card.
- One job per section: Each section should have one purpose, one headline, and usually one short supporting sentence.
- Real visual anchor: Imagery should show the product, place, atmosphere, or context.
- Reduce clutter: Avoid pill clusters, stat strips, icon rows, boxed promos, schedule snippets, and competing text blocks.
- Use motion to create presence and hierarchy, not noise. Ship 2-3 intentional motions for visually led work, and prefer Framer Motion when it is available.

Exception: If working within an existing website or design system, preserve the established patterns, structure, and visual language.
</frontend_tasks>
```

```xml
<terminal_tool_hygiene>
- Only run shell commands via the terminal tool.
- Never "run" tool names as shell commands.
- If a patch or edit tool exists, use it directly; do not attempt it in bash.
- After changes, run a lightweight verification step such as ls, tests, or a build before declaring the task done.
</terminal_tool_hygiene>
```

#### Document localization and OCR boxes

For bbox tasks, be explicit about coordinate conventions and add drift tests.

```xml
<bbox_extraction_spec>
- Use the specified coordinate format exactly (for example [x1,y1,x2,y2] normalized 0..1).
- For each bbox, include: page, label, text snippet, confidence.
- Add a vertical-drift sanity check:
  - ensure bboxes align with the line of text (not shifted up or down).
- If dense layout, process page by page and do a second pass for missed items.
</bbox_extraction_spec>
```

#### Use runtime and API integration notes

For long-running or tool-heavy agents, the runtime contract matters as much as the prompt contract.

##### Phase parameter

For GPT-5.4, `gpt-5.3-codex`, and later Responses models, the `phase` field can
help in the small number of long-running or tool-heavy flows where preambles or
other intermediate assistant updates are mistaken for the final answer.

- `phase` is optional at the API level, but it is highly recommended. Best-effort inference may exist server-side, but explicit round-tripping of `phase` is strictly better.
- Use `phase` for long-running or tool-heavy agents that may emit commentary before tool calls or before a final answer.
- Preserve `phase` when replaying prior assistant items so the model can distinguish working commentary from the completed answer. This matters most in multi-step flows with preambles, tool-related updates, or multiple assistant messages in the same turn.
- Do not add `phase` to user messages.
- If you use `previous_response_id`, that is usually the simplest path, since OpenAI can often recover prior state without manually replaying assistant items.
- If you replay assistant history yourself, preserve the original `phase` values.
- Missing or dropped `phase` can cause preambles to be interpreted as final answers and degrade behavior on those multi-step tasks.

#### Preserve behavior in long sessions

Compaction unlocks significantly longer effective context windows, where user conversations can persist for many turns without hitting context limits or long-context performance degradation, and agents can perform very long trajectories that exceed a typical context window for long-running, complex tasks.

If you are using [Compaction](https://developers.openai.com/api/docs/guides/compaction) in the Responses API, compact after major milestones, treat compacted items as opaque state, and keep prompts functionally identical after compaction. The endpoint is ZDR compatible and returns an `encrypted_content` item that you can pass into future requests. GPT-5.4 tends to remain more coherent and reliable over longer, multi-turn conversations with fewer breakdowns as sessions grow.

For more guidance, see the [`/responses/compact` API reference](https://developers.openai.com/api/reference/resources/responses/methods/compact).

#### Control personality for customer-facing workflows

GPT-5.4 can be steered more effectively when you separate persistent personality from per-response writing controls. This is especially useful for customer-facing workflows such as emails, support replies, announcements, and blog-style content.

- **Personality (persistent):** sets the default tone, verbosity, and decision style across the session.
- **Writing controls (per response):** define the channel, register, formatting, and length for a specific artifact.
- **Reminder:** personality should not override task-specific output requirements. If the user asks for JSON, return JSON.

For natural, high-quality prose, the highest-leverage controls are:

- Give the model a clear persona.
- Specify the channel and emotional register.
- Explicitly ban formatting when you want prose.
- Use hard length limits.

```xml
<personality_and_writing_controls>
- Persona: <one sentence>
- Channel: <Slack | email | memo | PRD | blog>
- Emotional register: <direct/calm/energized/etc.> + "not <overdo this>"
- Formatting: <ban bullets/headers/markdown if you want prose>
- Length: <hard limit, e.g. <=150 words or 3-5 sentences>
- Default follow-through: if the request is clear and low-risk, proceed without asking permission.
</personality_and_writing_controls>
```

For more personality patterns you can lift directly, see the [Prompt Personalities cookbook](https://developers.openai.com/cookbook/examples/gpt-5/prompt_personalities).

**Professional memo mode**

For memos, reviews, and other professional writing tasks, general writing instructions are often not enough. These workflows benefit from explicit guidance on specificity, domain conventions, synthesis, and calibrated certainty.

```xml
<memo_mode>
- Write in a polished, professional memo style.
- Use exact names, dates, entities, and authorities when supported by the record.
- Follow domain-specific structure if one is requested.
- Prefer precise conclusions over generic hedging.
- When uncertainty is real, tie it to the exact missing fact or conflicting source.
- Synthesize across documents rather than summarizing each one independently.
</memo_mode>
```

This mode is especially useful for legal, policy, research, and executive-facing writing, where the goal is not just fluency, but disciplined synthesis and clear conclusions.

### Tune reasoning and migration

#### Treat reasoning effort as a last-mile knob

Reasoning effort is not one-size-fits-all. Treat it as a last-mile tuning knob, not the primary way to improve quality. In many cases, stronger prompts, clear output contracts, and lightweight verification loops recover much of the performance teams might otherwise seek through higher reasoning settings.

Recommended defaults:

- `none`: Best for fast, cost-sensitive, latency-sensitive tasks where the model does not need to think.
- `low`: Works well for latency-sensitive tasks where a small amount of thinking can produce a meaningful accuracy gain, especially with complex instructions.
- `medium` or `high`: Reserve for tasks that truly require stronger reasoning and can absorb the latency and cost tradeoff. Choose between them based on how much performance gain your task gets from additional reasoning.
- `xhigh`: Avoid as a default unless your evals show clear benefits. It is best suited for long, agentic, reasoning-heavy tasks where maximum intelligence matters more than speed or cost.

In practice, most teams should default to the `none`, `low`, or `medium` range.

Start with `none` for execution-heavy workloads such as workflow steps, field extraction, support triage, and short structured transforms.

Start with `medium` or higher for research-heavy workloads such as long-context synthesis, multi-document review, conflict resolution, and strategy writing. With `medium` and a well-engineered prompt, you can squeeze out a lot of performance.

For GPT-5.4 workloads, `none` can already perform well on action-selection and tool-discipline tasks. If your workload depends on nuanced interpretation, such as implicit requirements, ambiguity, or cancelled-tool-call recovery, start with `low` or `medium` instead.

Before increasing reasoning effort, first add:

- `<completeness_contract>`
- `<verification_loop>`
- `<tool_persistence_rules>`

If the model still feels too literal or stops at the first plausible answer, add an initiative nudge before raising reasoning effort:

```xml
<dig_deeper_nudge>
- Don’t stop at the first plausible answer.
- Look for second-order issues, edge cases, and missing constraints.
- If the task is safety or accuracy critical, perform at least one verification step.
</dig_deeper_nudge>
```

#### Migrate prompts to GPT-5.4 one change at a time

Use the same one-change-at-a-time discipline as the 5.2 guide: switch model first, pin `reasoning_effort`, run evals, then iterate.

These starting points work well for many migrations:

| Current setup             | Suggested GPT-5.4 start            | Notes                                                               |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------------- |
| `gpt-5.2`                 | Match the current reasoning effort | Preserve the existing latency and quality profile first, then tune. |
| `gpt-5.3-codex`           | Match the current reasoning effort | For coding workflows, keep the reasoning effort the same.           |
| `gpt-4.1` or `gpt-4o`     | `none`                             | Keep snappy behavior, and increase only if evals regress.           |
| Research-heavy assistants | `medium` or `high`                 | Use explicit research multi-pass and citation gating.               |
| Long-horizon agents       | `medium` or `high`                 | Add tool persistence and completeness accounting.                   |

#### Small-model guidance for `gpt-5.4-mini` and `gpt-5.4-nano`

`gpt-5.4-mini` and `gpt-5.4-nano` are highly steerable, but they are less likely than larger models to infer missing steps, resolve ambiguity implicitly, or package outputs the way you intended unless you specify that behavior directly. In practice, prompts for smaller models are often a bit longer and more explicit.

**How `gpt-5.4-mini` differs**

- `gpt-5.4-mini` is more literal and makes fewer assumptions.
- It is strong when the task is clearly structured, but weaker on implicit workflows and ambiguity handling.
- By default, it may try to keep the conversation going with a follow-up question unless you suppress that behavior explicitly.

**Prompting `gpt-5.4-mini`**

- Put critical rules first.
- Specify the full execution order when tool use or side effects matter.
- Do not rely on "you MUST" alone. Use structural scaffolding such as numbered steps, decision rules, and explicit action definitions.
- Separate "do the action" from "report the action."
- Show the correct flow, not just the final format.
- Define ambiguity behavior explicitly: when to ask, abstain, or proceed.
- Specify packaging directly: answer length, whether to ask a follow-up question, citation style, and section order.
- Be careful with `output nothing else`. Prefer scoped instructions such as `after the final JSON, output nothing further`.

**Prompting `gpt-5.4-nano`**

- Use `gpt-5.4-nano` only for narrow, well-bounded tasks.
- Prefer closed outputs: labels, enums, short JSON, or fixed templates.
- Avoid multi-step orchestration unless the flow is extremely constrained.
- Route ambiguous or planning-heavy tasks to a stronger model instead of over-prompting `gpt-5.4-nano`.

**Good default pattern**

1. Task
2. Critical rule
3. Exact step order
4. Edge cases or clarification behavior
5. Output format
6. One correct example

**Avoid**

- Implied next steps
- Unspecified edge cases
- Schema-only prompts for tool workflows
- Generic instructions without structure

#### Web search and deep research

If you are migrating a research agent in particular, make these prompt updates before increasing reasoning effort:

- Add `<research_mode>`
- Add `<citation_rules>`
- Add `<empty_result_recovery>`
- Increase `reasoning_effort` one notch only after prompt fixes.

You can start from the 5.2 research block and then layer in citation gating and finalization contracts as needed.

GPT-5.4 performs especially well when the task requires multi-step evidence gathering, long-context synthesis, and explicit prompt contracts. In practice, the highest-leverage prompt changes are choosing reasoning effort by task shape, defining exact output and citation formats, adding dependency-aware tool rules, and making completion criteria explicit. The model is often strong out of the box, but it is most reliable when prompts clearly specify how to search, how to verify, and what counts as done.

### Next steps

- Review [Model, API, and feature updates](#model-api-and-feature-updates) for model capabilities, parameters, and API compatibility details.
- Read [Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering) for broader prompting strategies that apply across model families.
- Read [Compaction](https://developers.openai.com/api/docs/guides/compaction) if you are building long-running GPT-5.4 sessions in the Responses API.


## Further reading

[GPT-5.3-Codex prompting guide](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide)

[GPT-5.4 blog post](https://openai.com/index/introducing-gpt-5-4/)

[GPT-5 frontend guide](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_frontend)

[GPT-5 model family: new features guide](https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_new_params_and_tools)

[Cookbook on reasoning models](https://developers.openai.com/cookbook/examples/responses_api/reasoning_items)

[Comparison of Responses API vs. Chat Completions](https://developers.openai.com/api/docs/guides/migrate-to-responses)