# Using GPT-5.5

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Introduction

GPT-5.5 raises the baseline for complex production workflows. It’s a strong fit for coding use cases, tool-heavy agents, grounded assistants, long-context retrieval, product-spec-to-plan workflows, and customer-facing workflows where execution quality and response polish are critical.

To get the most out of GPT-5.5, treat it as a new model family to tune for, not a drop-in replacement for `gpt-5.2` or `gpt-5.4`. Begin migration with a fresh baseline instead of carrying over every instruction from an older prompt stack. Start with the smallest prompt that preserves the product contract, then tune reasoning effort, verbosity, tool descriptions, and output format against representative examples.

GPT-5.5 supports all API features that were already available with GPT-5.4, including [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching), [hosted tools](https://developers.openai.com/api/docs/guides/tools#available-tools), [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search), [compaction](https://developers.openai.com/api/docs/guides/compaction), and `phase` handling for manually replayed assistant items.

See [Prompting best practices](#prompting-best-practices) for examples of successful prompting patterns.

## What's new

- **More efficient reasoning:** GPT-5.5 reaches strong results with fewer reasoning tokens than prior models, even at the same reasoning effort. This is especially useful in complex, tool-heavy, or multi-step workflows where token savings compound.
- **Stronger task execution with outcome-first prompts:** GPT-5.5 is better at working from a clear goal, preserving constraints, and turning product intent into concrete next steps. Describe the expected outcome, success criteria, allowed side effects, evidence rules, and output shape. Avoid step-by-step process guidance unless the exact path matters.
- **Stronger and more precise tool use:** GPT-5.5 is especially useful on large tool surfaces, multi-step service workflows, and long-running agent tasks. It tends to be more precise in tool selection and argument use.
- **Tone is often more polished, but can be more direct:** GPT-5.5 often produces warmer, more readable answers with less prompt scaffolding.

## Behavioral changes

1. **Reasoning effort now defaults to `medium`:** GPT-5.5 defaults to `medium` reasoning effort. Treat `medium` as the recommended balanced starting point for quality, reliability, latency, and cost. For latency-sensitive workflows, evaluate `low` before `none` when tool use, planning, search, or multi-step decision making still matters. Reserve `none` for latency-critical tasks that don't need reasoning or multi-chained tool calls, such as lightweight voice turns, fast information retrieval, and classification. Increase to `high` or `xhigh` only when evals show a measurable quality gain that justifies the extra latency and cost. See the [Reasoning models documentation](https://developers.openai.com/api/docs/guides/reasoning) for more details on recommended settings.

   Higher reasoning effort isn't automatically better. If the task has conflicting instructions, weak stopping criteria, or open-ended tool access, higher effort can lead to overthinking, unnecessary searching, or output quality regressions. Increase effort only when evals show a measurable quality gain.

2. **Image inputs preserve more visual detail by default:** GPT-5.5 updates the default handling for image inputs to preserve more visual detail and improve computer use performance. When `image_detail` is unset or set to `auto`, the model now uses `original` behavior, preserving images without resizing up to 10,240,000 pixels or a 6,000-pixel dimension limit. For `high`, specify the value directly; it preserves images without resizing up to 2,500,000 pixels or a 2,048-pixel dimension limit. `low` now focuses on context efficiency and resizes images above a 512-pixel dimension limit more aggressively than previous models. See the [Images and vision documentation](https://developers.openai.com/api/docs/guides/images-vision).

3. **Improved instruction following:** GPT-5.5 interprets prompts in a literal and thorough manner, enabling specific, descriptive instructions when the product requires them. Define success criteria and stopping rules, especially for long-running, tool-heavy, or evidence-gathering workflows. See [Write outcome-first prompts](#outcome-first-prompts-and-stopping-conditions) and [Keep the right specificity](#formatting).

4. **Default style is more concise and direct:** GPT-5.5 tends to be efficient, direct, and task-oriented by default. This is useful for many production workflows, but customer-facing or conversational experiences may need explicit personality, warmth, rationale, and formatting guidance. Use `text.verbosity` intentionally: `medium` is the default, and `low` is often a better starting point for concise responses. See [Prompting best practices](#prompting-best-practices).

5. **Coding workflows need stronger orchestration:** GPT-5.5 is better suited to complex coding tasks that require planning, tool use, codebase navigation, verification, and multi-step execution. For coding agents, be explicit about reuse, subagent delegation, test expectations, acceptance criteria, and when to continue versus ask for help.

## Migration quickstart

### Automated migration with Codex

Codex can apply the recommended changes in this guide with the [OpenAI Docs skill](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

```text
$openai-docs migrate this project to gpt-5.5
```

To use this skill in other coding agents, download it from the [OpenAI skills repository](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

### API and model parameters

- Update the model slug to `gpt-5.5`.
- Use the Responses API for any reasoning, tool-calling, or multi-turn use case.
- Tune `reasoning.effort`. Use `low` for efficient reasoning, `medium` for a balanced point on the latency/performance curve, `high` for complex agentic tasks that require hard reasoning and where latency matters less, and `xhigh` for the hardest asynchronous agentic tasks or evals that test the bounds of model intelligence. See the [Reasoning models documentation](https://developers.openai.com/api/docs/guides/reasoning).
- To configure for more concise responses, set `text.verbosity` to `low`. On GPT-5.5, this will result in proportionally more concise responses than `low` verbosity with GPT-5.4.
- For tool-heavy or long-running workflows, verify that your application handles `phase`, preambles, and assistant-item replay correctly.
- Benchmark against other models on accuracy, token consumption, and end-to-end latency.

### Prompting

- State the expected outcome and success criteria.
- Reduce or remove detailed step-by-step process guidance. Let GPT-5.5 choose the path unless the product requires that path.
- Remove output schema definitions from the prompt where possible. Use [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) instead.
- Optimize your prompt for caching: [static parts first, dynamic parts last](https://developers.openai.com/api/docs/guides/prompt-caching).
- Drop the current date. The model is already aware of the current UTC date.
- Review and optimize your prompts with [Prompting best practices](#prompting-best-practices).

## Using reasoning models

This guidance applies to GPT-5 series models and is worth revisiting whenever teams move workloads onto reasoning models. GPT-5.5 carries forward many capabilities that first appeared in earlier models, but they're still worth reviewing if you are moving from an earlier GPT-5 model, GPT-4.1, or a reasoning model such as o3.

Teams can overlook these features because they sit partly in API configuration and orchestration rather than in the prompt itself. Used together, the Responses API, reasoning controls, verbosity, structured outputs, prompt caching, tool design, hosted tools, and state management help reasoning models deliver their best intelligence, reliability, latency, and cost profile.

- **Responses API:** GPT-5.5 works best in the [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses). Use `previous_response_id` for multi-turn state handling. For stateless or Zero Data Retention flows, pass back the relevant returned output items each turn. See [Passing context from the previous response](https://developers.openai.com/api/docs/guides/conversation-state#passing-context-from-the-previous-response) for details.
- **Reasoning effort:** Use `reasoning.effort` to choose between `low`, `medium`, `high`, or `xhigh`. The default is `medium`, but many workloads will perform well with `low`. Reserve `none` for use cases where low latency is more important than intelligence. See [Reasoning Models](https://developers.openai.com/api/docs/guides/reasoning) for detailed recommendations.
- **Verbosity:** Use `text.verbosity` to control output length. Treat final answer length as separate from reasoning quality; specify word budgets, section counts, table widths, or JSON-only output where needed.
- **Structured Outputs:** Avoid describing the expected output schema in the prompt. Use [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) for automatic validation and increased accuracy.
- **Prompt caching:** [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) works automatically for eligible long prompts and can reduce latency and input-token cost. To maximize cache hits, keep stable content at the beginning of the request. Put dynamic user-specific context near the end. For repeated traffic with common prefixes, use `prompt_cache_key` consistently and track `usage.prompt_tokens_details.cached_tokens`.
- **Tool calling:** GPT-5.5 supports the same tool-calling patterns as GPT-5.4, including function tools and tool-heavy agent workflows. Put most tool-specific guidance in the tool descriptions themselves: what the tool does, when to use it, required inputs, side effects, retry safety, and common error modes. Add tool-specific context to system instructions only when it applies across tools or materially changes the agent's operating policy.
- **Hosted tools and tool search:** Prefer [OpenAI-hosted tools](https://developers.openai.com/api/docs/guides/tools) where they fit the workflow, such as web search, file search, code interpreter, image generation, and computer use. Hosted tools reduce custom orchestration burden and keep common tool patterns aligned with the Responses API and Agents SDK. Use custom function tools when you need to call your own systems, enforce domain-specific side effects, or expose internal business workflows. For large tool catalogs, consider using [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) to defer tool definitions and load only the relevant subset.
- **Tool preambles:** Preambles can improve chat UX because the user sees an initial, useful status update before the model generates the final response. They also make tool use easier to follow: the model can state what it's about to check or do, then continue from that same assistant state after tool results arrive.
- **`phase` handling:** If your application manually manages Responses state by passing output items back each turn instead of using `previous_response_id`, preserve the `phase` parameter on returned assistant output items and pass it back unchanged. This is especially important when using reasoning effort, preambles, or repeated tool calls. See [Phase parameter](https://developers.openai.com/api/docs/guides/reasoning#phase-parameter).
- **Compaction:** For long-running agents, use [conversation/state compaction](https://developers.openai.com/api/docs/guides/compaction) intentionally. Preserve completed actions, active assumptions, IDs, tool outcomes, unresolved blockers, and the next concrete goal.
- **Agents SDK:** For new agentic systems, use the latest [Agents SDK](https://developers.openai.com/api/docs/guides/agents) patterns for tool orchestration, tracing, handoffs, and state management rather than rebuilding orchestration from scratch.
- **Current date:** GPT-5.5 is aware of the current date in UTC. You don't need to add the current date to system instructions. Add explicit date or timezone context only when the application needs a business-specific timezone, policy-effective date, user-local date, or other non-UTC reference point.

## Prompting best practices

GPT-5.5 works best when prompts define the outcome and leave room for the model to choose an efficient solution path. Compared with earlier models, you can often use shorter, more outcome-oriented prompts: describe what good looks like, what constraints matter, what evidence is available, and what the final answer should contain.

Avoid carrying over every instruction from an older prompt stack. Legacy prompts often over-specify the process because earlier models needed more help staying on track. With GPT-5.5, that can add noise, narrow the model's search space, or lead to overly mechanical answers.

The patterns here are starting points. Adapt them to your product surface, tools, evals, and user experience goals.

### Personality and behavior

GPT-5.5's default style is efficient, direct, and task-oriented. This is useful for production systems: responses stay focused, behavior is easier to steer, and the model avoids unnecessary conversational padding.

For customer-facing assistants, support workflows, coaching experiences, and other conversational products, define both personality and collaboration style.

- **Personality** controls how the assistant sounds: tone, warmth, directness, formality, humor, empathy, and level of polish.
- **Collaboration style** controls how the assistant works: when it asks questions, when it makes assumptions, how proactive it should be, how much context it gives, when it checks work, and how it handles uncertainty or risk.

Keep both short. Personality instructions should shape the user experience. Collaboration instructions should shape task behavior. Neither should replace clear goals, success criteria, tool rules, or stopping conditions.

Example personality block for a steady task-focused assistant:

```text
# Personality
You are a capable collaborator: approachable, steady, and direct. Assume the user is competent and acting in good faith, and respond with patience, respect, and practical helpfulness.

Prefer making progress over stopping for clarification when the request is already clear enough to attempt. Use context and reasonable assumptions to move forward. Ask for clarification only when the missing information would materially change the answer or create meaningful risk, and keep any question narrow.

Stay concise without becoming curt. Give enough context for the user to understand and trust the answer, then stop. Use examples, comparisons, or simple analogies when they make the point easier to grasp. When correcting the user or disagreeing, be candid but constructive. When an error is pointed out, acknowledge it plainly and focus on fixing it.

Match the user's tone within professional bounds. Avoid emojis and profanity by default, unless the user explicitly asks for that style or has clearly established it as appropriate for the conversation.
```

Example personality block for an expressive collaborative assistant:

```text
# Personality
Adopt a vivid conversational presence: intelligent, curious, playful when appropriate, and attentive to the user's thinking. Ask good questions when the problem is blurry, then become decisive once there is enough context.

Be warm, collaborative, and polished. Conversation should feel easy and alive, but not chatty for its own sake. Offer a real point of view rather than merely mirroring the user, while staying responsive to their goals and constraints.

Be thoughtful and grounded when the task calls for synthesis or advice. State a clear recommendation when you have enough context, explain important tradeoffs, and name uncertainty without becoming evasive.
```

For more expressive products, add warmth, curiosity, humor, or point of view explicitly, but keep the block short. Use personality to shape the experience, not to compensate for unclear goals or missing task instructions.

### Improve time to first visible token with a preamble

In streaming applications, users notice how long it takes before the first visible response appears. GPT-5.5 may spend time reasoning, planning, or preparing tool calls before emitting visible text.

For longer or tool-heavy tasks, prompt the model to start with a short preamble: a brief visible update that acknowledges the request and states the first step. This can improve perceived responsiveness without changing the underlying task.

Use this pattern when the task may take more than one step, require tool calls, or involve a long-running agent workflow.

```text
Before any tool calls for a multi-step task, send a short user-visible update that acknowledges the request and states the first step. Keep it to one or two sentences.
```

For coding agents that expose separate message phases, you can be more explicit:

```text
You must always start with an intermediary update before any content in the analysis channel if the task will require calling tools. The user update should acknowledge the request and explain your first step.
```

### Outcome-first prompts and stopping conditions

GPT-5.5 is strongest when the prompt defines the target outcome, success criteria, constraints, and available context, then lets the model choose the path.

For many tasks, describe the destination rather than every step. This gives the model room to choose the right search, tool, or reasoning strategy for the task.

Prefer this:

```text
Resolve the customer's issue end to end.

Success means:
- the eligibility decision is made from the available policy and account data
- any allowed action is completed before responding
- the final answer includes completed_actions, customer_message, and blockers
- if evidence is missing, ask for the smallest missing field
```

**Avoid unnecessary absolute rules.** Older prompts often use strict instructions like `ALWAYS`, `NEVER`, `must`, and `only` to control model behavior. Use those words for true invariants, such as safety rules, required output fields, or actions that should never happen. For judgment calls, such as when to search, ask for clarification, use a tool, or keep iterating, prefer decision rules instead.

Avoid this style of instruction unless every step is truly required:

```text
First inspect A, then inspect B, then compare every field, then think through
all possible exceptions, then decide which tool to call, then call the tool,
then explain the entire process to the user.
```

Add explicit stopping conditions:

```text
Resolve the user query in the fewest useful tool loops, but do not let loop minimization outrank correctness, accessible fallback evidence, calculations, or required citation tags for factual claims.

After each result, ask: "Can I answer the user's core request now with useful evidence and citations for the factual claims?" If yes, answer.
```

Define missing-evidence behavior:

```text
Use the minimum evidence sufficient to answer correctly, cite it precisely, then stop.
```

### Formatting

GPT-5.5 is highly steerable on output format and structure. Use that control when it improves comprehension or product fit.

Set `text.verbosity`, describe the expected output shape, and reserve heavier structure for cases where it improves comprehension or your product UI needs a stable artifact. The API default for `text.verbosity` is `medium`; use `low` when you prefer shorter, more concise responses.

Plain conversational formatting:

```text
Let formatting serve comprehension. Use plain paragraphs as the default format for normal conversation, explanations, reports, documentation, and technical writeups. Keep the presentation clean and readable without making the structure feel heavier than the content.

Use headers, bold text, bullets, and numbered lists sparingly. Reach for them when the user requests them, when the answer needs clear comparison or ranking, or when the information would be harder to scan as prose. Otherwise, favor short paragraphs and natural transitions.

Respect formatting preferences from the user. If they ask for a terse answer, minimal formatting, no bullets, no headers, or a specific structure, follow that preference unless there is a strong reason not to.
```

Add explicit audience and length guidance:

```text
Write for a senior business audience. Keep the answer under 400 words. Use short paragraphs and only include bullets when they improve scannability. Prioritize the conclusion first, then the reasoning, then caveats.
```

For editing, rewriting, summaries, or customer-facing messages, tell the model what to preserve before asking it to improve style. This pattern is useful when you want polish without expansion.

```text
Preserve the requested artifact, length, structure, and genre first. Quietly improve clarity, flow, and correctness. Do not add new claims, extra sections, or a more promotional tone unless explicitly requested.
```

### Grounding, citations, and retrieval budgets

For grounded answers, citation behavior should be part of the prompt. Define what needs support, what counts as enough evidence, and how the model should behave when evidence is missing. Absence of evidence shouldn't automatically become a factual "no." For more details and examples, see the [citation formatting guide](https://developers.openai.com/api/docs/guides/citation-formatting).

#### Add an explicit retrieval budget

Retrieval budgets are stopping rules for search. They tell the model when enough evidence is enough.

```text
For ordinary Q&A, start with one broad search using short, discriminative keywords. If the top results contain enough citable support for the core request, answer from those results instead of searching again.

Make another retrieval call only when:
- The top results do not answer the core question.
- A required fact, parameter, owner, date, ID, or source is missing.
- The user asked for exhaustive coverage, a comparison, or a comprehensive list.
- A specific document, URL, email, meeting, record, or code artifact must be read.
- The answer would otherwise contain an important unsupported factual claim.

Do not search again to improve phrasing, add examples, cite nonessential details, or support wording that can safely be made more generic.
```

### Creative drafting guardrails

For drafting tasks, tell the model which claims must come from sources and which parts may be creatively written. This is especially important for slides, launch copy, customer summaries, talk tracks, leadership blurbs, and narrative framing.

```text
For creative or generative requests such as slides, leadership blurbs, outbound copy, summaries for sharing, talk tracks, or narrative framing, distinguish source-backed facts from creative wording.

- Use retrieved or provided facts for concrete product, customer, metric, roadmap, date, capability, and competitive claims, and cite those claims.
- Do not invent specific names, first-party data claims, metrics, roadmap status, customer outcomes, or product capabilities to make the draft sound stronger.
- If there is little or no citable support, write a useful generic draft with placeholders or clearly labeled assumptions rather than unsupported specifics.
```

### Frontend engineering and visual taste

For frontend work, refer to the [example instructions](https://developers.openai.com/api/docs/guides/frontend-prompt) for practical ways to steer UI quality. They cover product and user context, design-system alignment, first-screen usability, familiar controls, expected states, responsive behavior, and common generated-UI defaults to avoid, such as generic heroes, nested cards, decorative gradients, visible instructional text, and broken layouts.

### Prompt the model to check its work

Give GPT-5.5 access to tools that let it check outputs when validation is possible.

For coding agents, ask for concrete validation commands:

```text
After making changes, run the most relevant validation available:
- targeted unit tests for changed behavior
- type checks or lint checks when applicable
- build checks for affected packages
- a minimal smoke test when full validation is too expensive

If validation cannot be run, explain why and describe the next best check.
```

For visual artifacts, ask for inspection after rendering:

```text
Render the artifact before finalizing. Inspect the rendered output for layout, clipping, spacing, missing content, and visual consistency. Revise until the rendered output matches the requirements.
```

For engineering and planning tasks, make implementation plans traceable:

```text
For implementation plans, include:
- requirements and where each is addressed
- named resources, files, APIs, or systems involved
- state transitions or data flow where relevant
- validation commands or checks
- failure behavior
- privacy and security considerations
- open questions that materially affect implementation
```

### Phase parameter

Starting with GPT-5.4, long-running or tool-heavy Responses workflows can use assistant-item `phase` values to distinguish intermediate updates from final answers. GPT-5.5 uses the same pattern.

If you use `previous_response_id`, the API preserves prior assistant state automatically. If your application manually replays assistant output items into the next request, preserve each original `phase` value and pass it back unchanged. This matters most when a response includes preambles, repeated tool calls, or a final answer after intermediate assistant updates.

```text
If manually replaying assistant items:
- Preserve assistant `phase` values exactly.
- Use `phase: "commentary"` for intermediate user-visible updates.
- Use `phase: "final_answer"` for the completed answer.
- Do not add `phase` to user messages.
```

### Suggested prompt structure

Use this structure as a starting point for complex prompts. Keep each section short. Add detail only where it changes behavior.

```text
Role: [1-2 sentences defining the model's function, context, and job]

# Personality
[tone, demeanor, and collaboration style]

# Goal
[user-visible outcome]

# Success criteria
[what must be true before the final answer]

# Constraints
[policy, safety, business, evidence, and side-effect limits]

# Output
[sections, length, and tone]

# Stop rules
[when to retry, fallback, abstain, ask, or stop]
```