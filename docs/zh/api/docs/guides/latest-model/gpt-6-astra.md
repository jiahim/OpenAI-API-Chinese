---
latestModelInfo:
  model: gpt-6-astra
  migrationGuide: /api/docs/guides/latest-model/gpt-6-astra.md#migration-quickstart
  promptingGuide: /api/docs/guides/latest-model/gpt-6-astra.md#prompting-best-practices
---

# 使用 GPT-6

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 简介

GPT-6 模型系列包括 GPT-6 Astra、GPT-6 Sol 和 GPT-6 Luna。可根据任务所需的推理能力、延迟和成本来选择模型。

GPT-6 Astra 是我们迄今为止最智能的模型，在计算机操作、浏览、软件工程、科学和专业工作方面具有业界领先的表现。它擅长跨代码、浏览器和专业软件执行多步工作流。在 [多项评测中](https://openai.com/index/gpt-6-astra/)，Astra 以更少的输出 token 实现了更强效果——尽管其单价 token 定价更高，但每个任务的预估 API 成本低于早期模型。

GPT-6 Astra 也是我们迄今为止对齐程度最高的模型。它擅长谨慎行事、尊重任务边界，并以透明的方式进行沟通。当指令存在解释空间时，它会利用已有上下文填补常规空白，并在答案可能影响结果时提出有针对性的问题。它会吸收新要求、按要求调整方向，并在回答附带问题时始终把握整体任务。

若要基于 GPT-6 进行开发，请在 `model` 请求中设置 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 。如需 [`gpt-6-astra`](https://developers.openai.com/api/docs/models/gpt-6-astra) 最高能力级别，请使用该模型； [`gpt-6-sol`](https://developers.openai.com/api/docs/models/gpt-6-sol) 面对高难度任务需要强大推理能力时，请使用； [`gpt-6-luna`](https://developers.openai.com/api/docs/models/gpt-6-luna) 对于规模化的高效、可重复工作，请使用。

<a id="gpt-6-astra-what-is-new" className="scroll-mt-[110px]"></a>

## 新增功能

- **异步工具调用：** GPT-6 可以在你的应用运行工具的同时继续推理、调用其他工具，或回答请求中的独立部分。设置 `async: true` 于函数或自定义工具，并在准备好时使用原始 `call_id`。返回其结果。你的应用仍然负责执行工具并管理待处理任务。参见 [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling) 了解基础用法以及开发者自定义的等待工具模式。
- **中途引导：** 在 GPT-6 处理过程中发送额外的用户指令，例如更正或需求变更。在 WebSocket 连接下，Responses API 会保留已完成的工作，并将更新内容纳入一次 延续。参见 [中途引导](https://developers.openai.com/api/docs/guides/steering) 了解事件流与工具结果处理。
- **在会话中途更改推理同时保留缓存：** 添加 `configuration_update` 输入项，以在困难工作中提高推理力度，或在常规后续对话中降低推理力度，且无需重写原始提示前缀。更新后的推理力度将一直生效，直至另一个 `configuration_update` 输入项覆盖它。参见 [在会话中途更改推理](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 了解示例与兼容性。
- **偏差监测：** 作为我们 [强化版安全措施](https://openai.com/index/path-to-astra/) 的一部分，针对 GPT-6 Astra，我们的系统会异步监测偏差，并在必要时触发警报。参见 [失配监测](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 获取更多信息。

GPT-6 同样支持 GPT-5.6 已有的 API 能力，包括 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use), [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs), [流式传输](https://developers.openai.com/api/docs/guides/streaming-responses), [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [multi-智能体 编排](https://developers.openai.com/api/docs/guides/responses-multi-agent), [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching), [持久化推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls), [压缩](https://developers.openai.com/api/docs/guides/compaction)，以及 [pro 模式](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).

## 限制

- GPT-6 Astra 不支持 `none` reasoning effort；GPT-6 Sol 和 Luna 支持。
- 对于 GPT-6 Astra、Sol 和 Luna，欧盟数据驻留仅在 Standard 处理时可用。详见 [data residency eligibility](https://developers.openai.com/api/docs/guides/your-data#which-models-and-features-are-eligible-for-data-residency).

## 提示词最佳实践

以下提示可作为 GPT-6 模型系列的基础起点。它们针对在 GPT-6 Astra 中观察到的行为；请结合你选择的模型和实际工作负载进行评估。

### GPT-6 Astra 行为

- [主动性与持续跟进](#initiative-and-follow-through)：该模型被设计为更高效的合作者，因此在额外输入能够实质性改变结果时，更可能向用户提问。这可能导致它在用户期望它做出合理假设并持续推进时反而停下来。
- [指令遵循](#instruction-following)：GPT-6 Astra 在通用指令遵循方面比之前的模型更强，让你能更精细地控制其行为。它可能对技能和其他文件中包含的指令更加敏感，例如 `AGENTS.md`。我们 **强烈建议** 对模型可访问的技能和其他文件进行审计，检查其中可能影响其行为的指令。
- [个性与写作风格](#personality-and-writing-style)：该模型倾向于输出详细、格式化的回复，并可能在多次会话中使用重复的措辞。请明确指定你的应用所需的写作风格和结构。
- [子智能体委派](#subagent-delegation)：该模型进行委派的频率可能低于你工作流所需的程度。请明确指定它在并行任务中使用子智能体的时机和比例。
- [测试与验证](#testing-and-verification)：在编程任务中，该模型倾向于在认为任务完成之前进行充分的测试。对于较小的任务，这可能导致测试范围超出任务所需。

### 主动性以及跟进执行

GPT-6 Astra 在长时间任务中保持连贯性的能力总体上优于 GPT-5.6 Sol 及更早的模型。相比早期模型会直接作出假设的情况，它也更容易主动请求澄清。

若希望鼓励模型更自主地完成任务，可以从以下提示词开始：

```text
You should infer the user's intent and task scope from the instructions and prior conversation context. Your job is to bias towards action and carry the user's intended task to completion.

When the user expresses intent to perform new work or fix an existing issue, persist until the user's intended goal is complete. Progress autonomously towards the user's goal (e.g. creating isolated worktrees / checkouts if needed, resolving merge conflicts, read-only actions, creating draft PRs etc.) unless they are clearly destructive or irreversible.
```

当用户意图不明确时，模型更倾向于向用户请求澄清后再继续。如果用户的提示隐含了授权，请在提示词中引导模型按此继续执行：

```text
When the user's prompt indicates a request for action, such as "can you...", "I want to...", "help me..." and similar expressions, treat these as instructions to do the work and take action. Do not stop at acknowledging capability (e.g. "Yes…"), proposing a plan, or offering to continue. Do not settle for a partial or "helpful enough" solution that does not fully satisfy the user's task to save time, effort or tokens. If a task requires sustained work, complete all the necessary work until the intended outcome is fulfilled.
```

请在模型完成具体的、可供审阅的结果后，再提示模型请求批准。这样可以避免模型在还未充分完成其能完成的工作之前就被打断，通常也能更快地完成任务。

```text
Before asking the user clarifying questions, you should complete the work that is already authorized from context and necessary to make the proposed action concrete and reviewable. The user should be approving a concrete, reviewable result. For example, before deploying a change, writing to an external application, merging a PR or publishing a site, do all the required work first so that user approval is the final step. You don't need user permission for reversible tasks, read-only actions, reviews or fixes, or anything for which authorization is provided earlier in the session or strongly implied from the task instruction.

Do not introduce unsolicited warnings, disclaimers, approval flows, or safety/compliance checklists due to hypothetical risk.
```

模型默认还倾向于在工作过程中提出非阻塞式的问题，因此请根据你的应用所需的自主程度，对这些提示词进行相应调整。

### 指令遵循

GPT-6 Astra 能够更好地遵循较长的指令，但也对上下文中的信息更加敏感。例如，技能文件中不清晰或相互冲突的指引可能导致模型提前暂停并阻塞工作。请明确用户指令和技能之间的优先级。

```text
The user's instructions take precedence over guidelines provided in a skill. If explicit user instructions conflict with a skill's instructions, prioritize the user's instructions.
```

让模型识别导致其暂停或改变方向的技能和指令，也是提升模型行为透明度的有效方法。

```text
If a skill causes you to ask for permission or confirmation, pause, leave requested work unfinished, or diverge from the user's intent, name and link to the exact SKILL.md file you read, quote the relevant instruction, and briefly explain how it applies. Distinguish explicit skill requirements from your interpretation of guidelines.
```

当你的应用加载大量技能和指令文件时，可使用以下提示来发现潜在的静默和冲突指引，例如 `AGENTS.md`.

### 性格与写作风格

GPT-6 Astra 倾向于使用列表、表格和 Markdown 来让响应更易于浏览。如果你的应用需要减少格式的散文，请在指令中明确该偏好。

```text
Default to using clear, concise paragraphs, each developing one main idea. Use lists only when the information is genuinely parallel, sequential, or easier to compare, and avoid nested lists unless the hierarchy cannot be expressed clearly in prose. Use plain, simple language: familiar words, concrete examples, and precise verbs. Prefer active voice and direct statements.

Make sure to state the main point clearly and early, then develop it with the explanation and detail the reader needs. Let each sentence build on what came before. Develop the points that matter and provide enough support to be useful.
```

对于技术沟通场景，下面的提示有助于在使用清晰、连贯的语言的同时保持恰当的领域风格：

```text
Use plain language over jargon, and reference technical details only to the degree that it helps illustrate an idea or your work to the user. Communicate complex concepts in a clear and cohesive manner, and calibrate your writing to the level of background knowledge assumed from the user's prompt and context.
```

若要减少文本中的术语和套话，可以从以下提示开始：

```text
Avoid using slop words or phrases like "Bottom Line:" in conclusions, "delve," "foster," "leverage," "it's worth noting," "importantly," "Question? Answer." or "This isn't about X. It's about Y.", "genuinely" or hyphenated compound descriptions and adjectives. Do not use concluding summary statements such as "In short:..", "The simplest mental model is:...".

State the intended action directly. Avoid adding what you won't do, what will remain unchanged, or how you'll separate or categorize results. Do not use contrastive framing such as "X, not Y" or "X—not Y" that introduces an unprompted alternative that the user didn't ask about. Avoid invented compound labels like "exact-head checks" and "editorial-row layouts", vague qualifiers, and canned transitions; use plain verbs and prepositions to state the actual relationship directly.
```

### 子智能体委派

GPT-6 Astra 经过训练，能够将任务划分并委派给并行工作的子智能体。如果你要在自己的框架中实现多智能体系统，请使用以下提示词来调整 GPT-6 Astra 委派任务的程度：

```text
If at any point you can parallelize work by delegating tasks to another agent (no matter if you are the root or subagent), you should do so using collaboration tools if it could save time or improve quality.
```

智能体之间的消息可能存在语法或空格错误。使用以下提示词可以让智能体间的消息更易于阅读：

```text
Messages that you send to other agents and your final answer may be read by a human, so ensure they are legible. Always put proper spaces between words and/or numbers.
```

该模型通常能够很好地响应关于如何以及何时将任务委派给子智能体的提示词，因此请根据你的框架和多智能体实现来调整此行为。

### 测试与验证

对于编码任务，要校准一项变更所需的测试与验证量。这有助于避免因小幅改动而进行不必要的测试或重复检查。

```text
Do not write tests for reversible, low-impact changes that mirror the implementation. If you do choose to verify your work with tests, make sure that the tests are meaningful and necessary to verify implementation.

Run tests appropriate to the change and complete required checks. Once those pass, broaden or repeat testing only when new changes, failures, or unresolved concerns justify it; otherwise, continue toward completing the task.
```

## 迁移快速入门

### 使用 Codex 进行迁移

Codex 可以应用本指南中推荐更改，配合 [OpenAI Docs 技能](https://github.com/openai/codex/tree/main/codex-rs/skills/src/assets/samples/openai-docs).

```text
$openai-docs migrate this project to the GPT-6 model family
```

要在其他编码智能体中使用此技能，请从 [Codex 仓库](https://github.com/openai/codex/tree/main/codex-rs/skills/src/assets/samples/openai-docs).

### 更新 API 和模型参数

将 `model` 设置为 `gpt-6-astra`, `gpt-6-sol`，或 `gpt-6-luna`，然后检查以下内容：

- **Reasoning effort：** 在支持的情况下保留你当前的 effective [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning#reasoning-effort) 。GPT-6 Astra 不支持 `none`；请改用 `low` 。GPT-6 Sol 和 Luna 支持 `none`。如果现有请求使用了 `minimal`，请从 `low` 开始，并在具有代表性的任务上对比结果。在 Responses 中使用 `reasoning.effort` ，或在 Chat Completions 中使用 `reasoning_effort` 。
- **Tool calling：** 使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses#migrating-from-chat-completions)。GPT-6 Astra 支持 Chat Completions，但其工具调用需要使用 Responses。GPT-6 Sol 和 Luna 仅在 Chat Completions 中结合使用 `reasoning_effort: "none"`。时支持函数调用。涉及推理与工具组合时，请使用 Responses。
- **Unsupported parameters：** 当 reasoning effort 不是 `none`，时，请移除 `temperature`, `top_p`，以及 `top_logprobs`。对于 Chat Completions，还需要移除 `logprobs`。对于 Responses，移除 `message.output_text.logprobs` 从 `include`.
- **数据驻留：** 对于 GPT-6 Astra、Sol 和 Luna，EU 数据驻留仅在使用 Standard 处理时可用。GPT-6 Astra 的快速模式不包含延迟 SLA。参见 [快速模式兼容性](https://developers.openai.com/api/docs/guides/fast-mode#is-fast-mode-compatible-with-data-residency-zero-data-retention-and-a-baa).
- **更改推理力度：** 如果你的应用在响应之间更改力度，请在标准的单次智能体请求中使用 `configuration_update` 项。保持请求级别的 `reasoning.effort` 不变，以保留用于缓存的提示前缀。请查看 [兼容性限制](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 再采用此功能。
- **提示缓存：** 从 GPT-5.5 或更早版本迁移时，将 `prompt_cache_retention` 替换为 `prompt_cache_options.ttl` 设置为 `"30m"`。请查看 [提示缓存变更](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences)，包括缓存边界和缓存写入计费。
- **不必要的审批暂停：** 如果遇到模型在继续执行前反复请求批准的问题，请使用 [主动执行与跟进指引](#initiative-and-follow-through) 来引导模型更自主地执行。更多内容请参阅 [提示最佳实践](#prompting-best-practices) ，获取关于指令遵循、写作风格、子智能体委派和测试方面的指引。