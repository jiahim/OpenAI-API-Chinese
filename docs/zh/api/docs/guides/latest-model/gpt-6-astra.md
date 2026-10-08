---
latestModelInfo:
  model: gpt-6-astra
  migrationGuide: /api/docs/guides/latest-model/gpt-6-astra.md#migration-quickstart
  promptingGuide: /api/docs/guides/latest-model/gpt-6-astra.md#prompting-best-practices
---

# 使用 GPT-6

> 完整文档索引请参阅 [llms.txt](/llms.txt). 若要获取 Markdown 版本的文档页面，可在页面 URL 末尾添加 `.md` 。

根据任务所需的推理能力、速度和成本选择 GPT-6 模型。



- [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)

  **最强智能水平**

  适用于要求最高的推理、编程和专业工作。

- [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol)

  **速度、成本与智能水平兼顾**

  以更低成本实现接近 Astra 的复杂工作性能。

- [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)

  **速度最快，性价比最高**

  对于聚焦且任务量大的工作，性能出色。



要开始使用，请在 `model` 中设置 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 请求。如果你已经在使用 [`gpt-6-sol`](https://developers.openai.com/api/docs/models/gpt-6-sol)，请在切换到 GPT-6.1 Sol 之前查看 [迁移指南](#migration-quickstart) 。

### GPT-6 Astra

GPT-6 Astra 是我们迄今为止最智能的模型，在计算机使用、浏览、软件工程、科学和专业工作方面具有领先的性能。它可以在代码、浏览器和专业软件之间执行多步骤工作流。在 [多项评测中](https://openai.com/index/gpt-6-astra/)，Astra 以显著更少的输出 token 取得了更强的结果。尽管其每 token 定价更高，但每个任务的估计 API 成本仍低于早期模型。

GPT-6 Astra 也是我们迄今为止最对齐的模型。它擅长谨慎行事、尊重任务边界，并以透明的方式进行沟通。当指令留有解读空间时，它会利用已有的上下文填补常规缺口，并在答案可能改变结果时提出有针对性的问题。它会吸纳新的需求、按要求调整方向，并在回答旁枝问题时不忘更宏观的任务。

所有 GPT-6 Astra 用户还可以使用 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) 以及全新的 [极速模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) ，以获得我们最快的 API 速度。

<a id="gpt-61-sol"></a>
<a id="gpt-6.1-sol"></a>

### GPT-6.1 Sol

在需要以更低成本获得接近 Astra 性能时，可使用 GPT-6.1 Sol 来处理复杂编码、计算机使用以及专业工作。你
可以在自己的任务上将它与 Astra 进行对比，
以评估质量与成本之间的取舍。

将 `reasoning.effort` 设置为 `low`, `medium` （默认）、 `high`, `xhigh`，或 `max`.
使用 Responses API 来进行工具调用。Chat Completions 支持
不使用工具的请求。 `none` 和 `minimal` 推理力度不受支持。

请参阅 [模型页面](https://developers.openai.com/api/docs/models/gpt-6.1-sol) 了解规格、
定价和可用性，或参阅 [模型选择](https://developers.openai.com/api/docs/guides/model-selection#when-to-consider-gpt-61-sol)
获取模型选择方面的指导。

<a id="gpt-6-astra-what-is-new" className="scroll-mt-[110px]"></a>

## 新增内容

- **异步工具调用：** 在你的应用运行工具时，GPT-6 可以继续推理、调用其他工具，或回答请求中的独立部分。将 `async: true` 设置在 function 或自定义工具上，并在准备好后使用原始的 `call_id`。返回其结果。你的应用仍然负责执行工具并管理挂起的工作。参见 [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling) 了解基本用法和开发者自定义的等待工具模式。
- **中途转向：** 在 GPT-6 工作的过程中发送额外的用户指令，例如纠正或更改需求。通过 WebSocket 连接，Responses API 会保留已完成的工作，并将该更新包含在一次 延续 中。参见 [中途转向](https://developers.openai.com/api/docs/guides/steering) 了解事件流和工具结果的处理方式。
- **在对话中途更改推理同时保留缓存：** 添加一个 `configuration_update` 输入项，以便在困难工作中提高推理强度，或在常规后续任务中降低推理强度，而无需重写原始的提示前缀。更新的推理强度会一直生效，直到另一个 `configuration_update` 输入项覆盖它。参见 [在对话中途更改推理](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 了解示例和兼容性。
- **失准监控：** 作为我们 [强化后的安全防护](https://openai.com/index/path-to-astra/) 措施的一部分，针对 GPT-6 Astra，我们的系统会异步监控失准情况，并在必要时触发警报。参见 [错位监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 了解更多信息。

GPT-6 也支持 GPT-5.6 已有的现有 API 功能，包括 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use), [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [streaming](https://developers.openai.com/api/docs/guides/streaming-responses), [Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [multi-智能体 orchestration](https://developers.openai.com/api/docs/guides/responses-multi-agent), [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching), [persisted reasoning](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls), [compaction](https://developers.openai.com/api/docs/guides/compaction)，以及 [pro mode](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).

## 限制

- GPT-6 Astra 和 GPT-6.1 Sol 不支持 `none` 推理 effort；GPT-6 Sol 和 GPT-6 Luna 支持。
- Fast 模式为 GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 提供 EU 数据驻留，但不为 GPT-6 Astra 提供。 [Ultrafast 模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) 为 GPT-6.1 Sol 提供 US 和 EU 数据驻留以及全球处理。GPT-6 Astra Ultrafast 仅支持 US 数据驻留和全球处理。参见 [数据驻留资格](https://developers.openai.com/api/docs/guides/your-data#which-models-and-features-are-eligible-for-data-residency).

<a id="prompting-best-practices" className="scroll-mt-[110px]"></a>

## 提示词最佳实践

将以下提示作为整个 GPT-6 模型家族的起点。它们针对 GPT-6 Astra 中观察到的行为；请结合你选择的模型和工作负载进行评估。

### GPT-6 Astra 行为

- [主动性与持续推进](#initiative-and-follow-through)：该模型被设计为更高效的协作者，因此在额外输入可能实质性地改变结果时，更倾向于向用户提问。这可能导致它在用户期望它做出合理假设并继续推进时反而停下来。
- [指令遵循](#instruction-following)：GPT-6 Astra 在通用指令遵循方面比此前的模型更强，让你对其行为拥有更高的控制力。它对技能和其他文件中包含的指令可能更加敏感，例如 `AGENTS.md`。我们 **强烈建议** 审计模型可访问的技能和其他文件，检查是否存在可能影响其行为的指令。
- [性格与写作风格](#personality-and-writing-style)：该模型倾向于给出详细、格式化的回复，并可能在不同会话中使用重复出现的短语。请明确指定你的应用所需的写作风格与结构。
- [子智能体委派](#subagent-delegation)：该模型可能比你在 工作流 中期望的更少地进行委派。请明确指定它应在何时以及以多大程度使用子智能体来开展并行工作。
- [测试与验证](#testing-and-verification)：对于编码任务，该模型倾向于在认为任务完成前进行充分的测试。对于较小的任务，这可能导致测试范围超出任务所需。

### 主动性与执行力

GPT-6 Astra 在长时间任务中保持连贯性方面总体优于 GPT-5.6 Sol 及更早的模型。在早期模型通常会进行假设的情况下，它也更容易主动请求澄清。

若要鼓励模型更自主地工作，请从以下提示开始：

```text
You should infer the user's intent and task scope from the instructions and prior conversation context. Your job is to bias towards action and carry the user's intended task to completion.

When the user expresses intent to perform new work or fix an existing issue, persist until the user's intended goal is complete. Progress autonomously towards the user's goal (e.g. creating isolated worktrees / checkouts if needed, resolving merge conflicts, read-only actions, creating draft PRs etc.) unless they are clearly destructive or irreversible.
```

当用户意图不明确时，模型更有可能主动向用户请求澄清后再继续执行。如果用户的提示隐含授权，则提示模型直接推进：

```text
When the user's prompt indicates a request for action, such as "can you...", "I want to...", "help me..." and similar expressions, treat these as instructions to do the work and take action. Do not stop at acknowledging capability (e.g. "Yes…"), proposing a plan, or offering to continue. Do not settle for a partial or "helpful enough" solution that does not fully satisfy the user's task to save time, effort or tokens. If a task requires sustained work, complete all the necessary work until the intended outcome is fulfilled.
```

提示模型在准备好具体、可审查的结果之后再请求批准。这样可以避免在模型完成其力所能及的工作之前就阻塞任务，并且通常能更快地完成任务。

```text
Before asking the user clarifying questions, you should complete the work that is already authorized from context and necessary to make the proposed action concrete and reviewable. The user should be approving a concrete, reviewable result. For example, before deploying a change, writing to an external application, merging a PR or publishing a site, do all the required work first so that user approval is the final step. You don't need user permission for reversible tasks, read-only actions, reviews or fixes, or anything for which authorization is provided earlier in the session or strongly implied from the task instruction.

Do not introduce unsolicited warnings, disclaimers, approval flows, or safety/compliance checklists due to hypothetical risk.
```

该模型默认还喜欢在工作时提出非阻塞性的问题，因此请根据应用所需的自主程度调整这些提示。

### 指令遵循

GPT-6 Astra 能够更好地遵循较长的指令，但也可能对上下文中的信息更加敏感。例如，技能文件中含糊或冲突的指引可能导致模型提前暂停并阻断工作。请明确说明用户指令与技能之间的优先级。

```text
The user's instructions take precedence over guidelines provided in a skill. If explicit user instructions conflict with a skill's instructions, prioritize the user's instructions.
```

让模型识别导致其暂停或改变方向的技能和指令，也有助于为模型行为提供透明度。

```text
If a skill causes you to ask for permission or confirmation, pause, leave requested work unfinished, or diverge from the user's intent, name and link to the exact SKILL.md file you read, quote the relevant instruction, and briefly explain how it applies. Distinguish explicit skill requirements from your interpretation of guidelines.
```

当你的应用加载大量技能和指令文件时，可使用以下提示来查找静默且相互冲突的指引 `AGENTS.md`.

### 个性与写作风格

GPT-6 Astra 倾向于使用列表、表格和 Markdown 来让响应易于浏览。如果你的应用需要减少格式的文本，请在请求中明确该偏好。

```text
Default to using clear, concise paragraphs, each developing one main idea. Use lists only when the information is genuinely parallel, sequential, or easier to compare, and avoid nested lists unless the hierarchy cannot be expressed clearly in prose. Use plain, simple language: familiar words, concrete examples, and precise verbs. Prefer active voice and direct statements.

Make sure to state the main point clearly and early, then develop it with the explanation and detail the reader needs. Let each sentence build on what came before. Develop the points that matter and provide enough support to be useful.
```

对于技术沟通场景，以下提示有助于在使用清晰、连贯的语言的同时保持领域适配性：

```text
Use plain language over jargon, and reference technical details only to the degree that it helps illustrate an idea or your work to the user. Communicate complex concepts in a clear and cohesive manner, and calibrate your writing to the level of background knowledge assumed from the user's prompt and context.
```

若要在写作中减少术语和套话，可以从以下提示开始：

```text
Avoid using slop words or phrases like "Bottom Line:" in conclusions, "delve," "foster," "leverage," "it's worth noting," "importantly," "Question? Answer." or "This isn't about X. It's about Y.", "genuinely" or hyphenated compound descriptions and adjectives. Do not use concluding summary statements such as "In short:..", "The simplest mental model is:...".

State the intended action directly. Avoid adding what you won't do, what will remain unchanged, or how you'll separate or categorize results. Do not use contrastive framing such as "X, not Y" that introduces an unprompted alternative that the user didn't ask about. Avoid invented compound labels like "exact-head checks" and "editorial-row layouts", vague qualifiers, and canned transitions; use plain verbs and prepositions to state the actual relationship directly.
```

### 子智能体委派

GPT-6 Astra 经过训练，能够将工作划分并委派给并行工作的子智能体。如果你正在自己的调度框架中实现多智能体系统，可以使用以下提示来调整 GPT-6 Astra 应该委派多少工作：

```text
If at any point you can parallelize work by delegating tasks to another agent (no matter if you are the root or subagent), you should do so using collaboration tools if it could save time or improve quality.
```

智能体之间的消息可能存在语法或空格错误。可以使用以下提示让智能体智能体的消息更易阅读：

```text
Messages that you send to other agents and your final answer may be read by a human, so ensure they are legible. Always put proper spaces between words and/or numbers.
```

该模型通常能很好地响应关于如何以及何时将工作委派给子智能体的提示，因此可以根据你的调度框架和多智能体实现来调整此行为。

### 测试和验证

针对编码任务，校准一项更改所需的测试与验证程度。这有助于避免对小幅更改执行不必要的测试或反复检查。

```text
Do not write tests for reversible, low-impact changes that mirror the implementation. If you do choose to verify your work with tests, make sure that the tests are meaningful and necessary to verify implementation.

Run tests appropriate to the change and complete required checks. Once those pass, broaden or repeat testing only when new changes, failures, or unresolved concerns justify it; otherwise, continue toward completing the task.
```

## 迁移快速入门

### 使用 Codex 迁移

Codex 可以使用本指南中建议的更改， [OpenAI Docs 技能](https://github.com/openai/codex/tree/main/codex-rs/skills/src/assets/samples/openai-docs).

```text
$openai-docs migrate this project to the GPT-6 model family
```

要在其他编码智能体中使用此技能，请从 [Codex 仓库](https://github.com/openai/codex/tree/main/codex-rs/skills/src/assets/samples/openai-docs).

### 更新 API 和模型参数

将 `model` 设置为 `gpt-6-astra`, `gpt-6.1-sol`，或 `gpt-6-luna`，然后检查以下内容：

- **Reasoning effort:** 保留你当前的实际 [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning#reasoning-effort) （在受支持的模型中）。GPT-6 Astra 和 GPT-6.1 Sol 不支持 `none`；请改用 `low` 。GPT-6 Sol 和 GPT-6 Luna 支持 `none`。如果你现有的请求使用的是 `minimal`，请先使用 `low` 并在代表性任务上对比结果。在 Responses 中使用 `reasoning.effort` ，或在 Chat Completions 中使用 `reasoning_effort` 。
- **Tool calling:** 使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses#migrating-from-chat-completions)。GPT-6 Astra 和 GPT-6.1 Sol 支持 Chat Completions，但工具调用需要 Responses。GPT-6 Sol 和 GPT-6 Luna 仅在 Chat Completions 中支持 `reasoning_effort: "none"`。下的函数调用。需要带工具的推理时，请使用 Responses。
- **Unsupported parameters:** 当 reasoning effort 不是 `none`，时，请移除 `temperature`, `top_p`，和 `top_logprobs`. 对于 Chat Completions，还要移除 `logprobs`. 对于 Responses，移除 `message.output_text.logprobs` 从 `include`.
- **数据驻留：** Fast 模式为 GPT-6.1 Sol、GPT-6 Sol 和 GPT-6 Luna 提供 EU 数据驻留，但不为 GPT-6 Astra 提供。 [Ultrafast 模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) 针对 GPT-6.1 Sol 支持美国和欧盟数据驻留以及全球处理。GPT-6 Astra Ultrafast 仅支持美国数据驻留和全球处理。GPT-6 Astra 的快速模式不包含延迟 SLA。请参阅 [快速模式兼容性](https://developers.openai.com/api/docs/guides/fast-mode#is-fast-mode-compatible-with-data-residency-zero-data-retention-and-a-baa).
- **修改推理努力程度：** 如果你的应用在不同响应之间修改 effort，请使用 `configuration_update` 字段，作用于标准的单一智能体请求。保持请求级的 `reasoning.effort` 不变，以保留用于缓存的提示前缀。查看 [兼容性限制](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 再采用此功能。
- **提示缓存：** 从 GPT-5.5 或更早版本迁移时，将 `prompt_cache_retention` 替换为 `prompt_cache_options.ttl` 设置为 `"30m"`。请查看 [提示缓存变更](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences)，包括缓存边界和缓存写入计费。
- **不必要的审批暂停：** 如果遇到模型在继续执行前反复请求确认的问题，请使用 [主动推进指南](#initiative-and-follow-through) 来促使模型更自主地执行。其余内容请参阅 [提示工程最佳实践](#prompting-best-practices) ，获取关于遵循指令、写作风格、子智能体委派和测试方面的指导。