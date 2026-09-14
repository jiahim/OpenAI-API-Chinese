---
latestModelInfo:
  model: gpt-6-astra
  migrationGuide: /api/docs/guides/latest-model/gpt-6-astra.md#migration-quickstart
  promptingGuide: /api/docs/guides/latest-model/gpt-6-astra.md#prompting-best-practices
---

# 使用 GPT-6 Astra

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

## 简介

GPT-6 Astra 是我们迄今为止最智能的模型，在计算机使用、浏览、软件工程、科学和专业工作方面具有业界领先的性能。它擅长在代码、浏览器和专业软件中执行多步骤工作流。在 [多项评测中](https://openai.com/index/gpt-6-astra/)，Astra 取得了更强的结果，同时使用的输出 token 显著更少——尽管其单价更高，但每个任务的预估 API 成本低于早期模型。

GPT-6 Astra 也是我们迄今为止对齐程度最高的模型。它擅长谨慎行事、尊重任务边界并以透明的方式进行沟通。当指令存在解读空间时，它会利用已有的上下文来填补常规缺口，并在答案可能改变结果时提出有针对性的问题。它能够吸收新的需求、按要求调整方向，并在不失对整体任务把控的情况下回答旁支问题。

若要使用 Astra 构建，请将模型设置 `model` 为 `gpt-6-astra` ，并在一次 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 请求中发起调用。

<a id="gpt-6-astra-what-is-new" className="scroll-mt-[110px]"></a>

## 最近更新

- **异步工具调用：** GPT-6 Astra 可以在你的应用程序运行某个工具的同时，继续进行推理、调用其他工具，或回答请求中的独立部分。设置 `async: true` ，对函数或自定义工具开启该行为，并在准备好后通过原始的 `call_id`。返回其结果。工具仍由你的应用程序执行并管理未完成的工作。参见 [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling) 了解基本用法和由开发者定义的等待工具模式。
- **中途引导：** 在 GPT-6 Astra 工作时发送额外的用户指令，例如更正或需求变更。在 WebSocket 连接上，Responses API 会保留已完成的工作，并将该更新纳入一次 延续。参见 [中途引导](https://developers.openai.com/api/docs/guides/steering) 了解事件流和工具结果处理方式。
- **在对话中途更改推理同时保留缓存：** 添加一个 `configuration_update` 输入项，可在不重写原始提示前缀的情况下，针对困难任务提高推理力度，或针对常规后续任务降低推理力度。更新后的推理力度在出现另一个 `configuration_update` 输入项覆盖它之前一直生效。参见 [在对话中途更改推理](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 了解示例与兼容性。
- **失准监控：** 作为我们针对 [强化安全防护](https://openai.com/index/path-to-astra/) 所做工作的一部分，我们的系统会针对 GPT-6 Astra 异步监控失准情况，并在必要时触发告警。参见 [Misalignment monitoring](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 了解更多信息。
- **限制：** GPT-6 Astra 不支持设置 `none` reasoning effort。 [Fast mode](https://developers.openai.com/api/docs/guides/fast-mode) 在采用 EU 数据驻留时，GPT-6 Astra 无法使用。

GPT-6 Astra 同时支持 GPT-5.6 已有的 API 能力，包括 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use), [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [streaming](https://developers.openai.com/api/docs/guides/streaming-responses), [Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [multi-智能体 orchestration](https://developers.openai.com/api/docs/guides/responses-multi-agent), [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching), [persisted reasoning](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls), [compaction](https://developers.openai.com/api/docs/guides/compaction)，以及 [pro mode](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).

## 提示最佳实践

GPT-6 Astra 比 GPT-5.6 Sol 等先前的模型更加智能且能力更强，同时它也展现出可以通过针对你的用例进行提示来优化的行为模式。

### GPT-6 Astra 行为

- [主动推进与跟进](#initiative-and-follow-through) – 该模型被设计为更高效的协作者，因此在额外输入可能实质性改变结果时，更倾向于向用户提问。这可能导致模型在用户原本期望它做出合理假设并继续推进时停下。
- [指令遵循](#instruction-following) – GPT-6 Astra 在通用指令遵循方面强于此前的模型，让你对其行为拥有更高的控制力。它可能对技能和其他文件中所包含的指令更加敏感，例如 `AGENTS.md`。我们 **强烈建议** 对模型可访问的技能和其他文件进行审查，排查可能影响其行为的指令。
- [个性与写作风格](#personality-and-writing-style) – 该模型倾向于给出详细、格式化的回答，并可能在不同会话中重复使用相同的措辞。请明确指定你的应用所需的写作风格与结构。
- [子智能体委派](#subagent-delegation) – 该模型在委派时可能少于你的 工作流所期望的频率。请明确在何时以及多大程度上应使用子智能体来执行并行工作。
- [测试与验证](#testing-and-verification) – 对于编码任务，该模型倾向于在认为任务完成前进行充分的测试。对于较小的任务，这可能导致测试范围超过任务本身的实际需要。

### 主动性以及贯彻执行

GPT-6 Astra 在长时间任务中保持连贯的能力通常优于 GPT-5.6 Sol 及更早的模型。在早期模型会做假设的情况下，它也更容易主动请求澄清。

若要鼓励更自主的工作方式，可从以下提示词开始：

```text
You should infer the user's intent and task scope from the instructions and prior conversation context. Your job is to bias towards action and carry the user's intended task to completion.

When the user expresses intent to perform new work or fix an existing issue, persist until the user's intended goal is complete. Progress autonomously towards the user's goal (e.g. creating isolated worktrees / checkouts if needed, resolving merge conflicts, read-only actions, creating draft PRs etc.) unless they are clearly destructive or irreversible.
```

当用户意图不明确时，模型更倾向于主动向用户请求澄清后再继续。若用户的提示词隐含了授权，可提示模型直接执行：

```text
When the user's prompt indicates a request for action, such as "can you...", "I want to...", "help me..." and similar expressions, treat these as instructions to do the work and take action. Do not stop at acknowledging capability (e.g. "Yes…"), proposing a plan, or offering to continue. Do not settle for a partial or "helpful enough" solution that does not fully satisfy the user's task to save time, effort or tokens. If a task requires sustained work, complete all the necessary work until the intended outcome is fulfilled.
```

提示模型在准备好具体且可审核的结果之后再请求批准。这样可以避免模型在尚未完成其能完成的工作之前就阻塞任务，通常也能更快地完成整个任务。

```text
Before asking the user clarifying questions, you should complete the work that is already authorized from context and necessary to make the proposed action concrete and reviewable. The user should be approving a concrete, reviewable result. For example, before deploying a change, writing to an external application, merging a PR or publishing a site, do all the required work first so that user approval is the final step. You don't need user permission for reversible tasks, read-only actions, reviews or fixes, or anything for which authorization is provided earlier in the session or strongly implied from the task instruction.

Do not introduce unsolicited warnings, disclaimers, approval flows, or safety/compliance checklists due to hypothetical risk.
```

默认情况下，模型在工作过程中也倾向于提出非阻塞性的问题，请根据你的应用所需的自主程度对这些提示词进行相应调整。

### 指令遵循

GPT-6 Astra 能更好地遵循较长的指令，但也可能对上下文中的信息更加敏感。例如，技能文件中不清晰或相互冲突的指引可能导致模型过早暂停并阻止工作。请明确用户指令与技能之间的优先级。

```text
The user's instructions take precedence over guidelines provided in a skill. If explicit user instructions conflict with a skill's instructions, prioritize the user's instructions.
```

让模型识别导致其暂停或改变方向的技能和指令，也能有效提升模型行为的透明度。

```text
If a skill causes you to ask for permission or confirmation, pause, leave requested work unfinished, or diverge from the user's intent, name and link to the exact SKILL.md file you read, quote the relevant instruction, and briefly explain how it applies. Distinguish explicit skill requirements from your interpretation of guidelines.
```

当你的应用加载大量技能和指令文件时，可使用以下提示来查找静默和相互冲突的指引，例如 `AGENTS.md`.

### 个性与写作风格

GPT-6 Astra 倾向于使用列表、表格和 Markdown 来让响应更易于浏览。如果你的应用需要较少格式化的散文，请在提示中说明该偏好。

```text
Default to using clear, concise paragraphs, each developing one main idea. Use lists only when the information is genuinely parallel, sequential, or easier to compare, and avoid nested lists unless the hierarchy cannot be expressed clearly in prose. Use plain, simple language: familiar words, concrete examples, and precise verbs. Prefer active voice and direct statements.

Make sure to state the main point clearly and early, then develop it with the explanation and detail the reader needs. Let each sentence build on what came before. Develop the points that matter and provide enough support to be useful.
```

在技术沟通方面，以下提示有助于在使用清晰、连贯的语言与保持领域适配性之间取得平衡：

```text
Use plain language over jargon, and reference technical details only to the degree that it helps illustrate an idea or your work to the user. Communicate complex concepts in a clear and cohesive manner, and calibrate your writing to the level of background knowledge assumed from the user's prompt and context.
```

若要在写作中减少术语和套话，可以从以下提示入手：

```text
Avoid using slop words or phrases like "Bottom Line:" in conclusions, "delve," "foster," "leverage," "it's worth noting," "importantly," "Question? Answer." or "This isn't about X. It's about Y.", "genuinely" or hyphenated compound descriptions and adjectives. Do not use concluding summary statements such as "In short:..", "The simplest mental model is:...".

State the intended action directly. Avoid adding what you won't do, what will remain unchanged, or how you'll separate or categorize results. Do not use contrastive framing such as "X, not Y" or "X—not Y" that introduces an unprompted alternative that the user didn't ask about. Avoid invented compound labels like "exact-head checks" and "editorial-row layouts", vague qualifiers, and canned transitions; use plain verbs and prepositions to state the actual relationship directly.
```

### 子智能体委派

GPT-6 Astra 经过训练，能够将工作拆分并委派给并行工作的子智能体。如果你要在 harness 中实现多智能体系统，请使用以下提示来调整 GPT-6 Astra 委派工作的程度：

```text
If at any point you can parallelize work by delegating tasks to another agent (no matter if you are the root or subagent), you should do so using collaboration tools if it could save time or improve quality.
```

智能体之间的消息可能存在语法或空格错误。使用以下提示让智能体智能体之间的消息更易于阅读：

```text
Messages that you send to other agents and your final answer may be read by a human, so ensure they are legible. Always put proper spaces between words and/or numbers.
```

该模型通常能很好地响应关于如何以及何时将工作委派给子智能体的提示，因此可以根据你的 harness 和多智能体实现来调整这种行为。

### 测试与验证

对于编码任务，校准一项变更所需的测试与验证量。这有助于避免对小改动进行不必要的测试或重复检查。

```text
Do not write tests for reversible, low-impact changes that mirror the implementation. If you do choose to verify your work with tests, make sure that the tests are meaningful and necessary to verify implementation.

Run tests appropriate to the change and complete required checks. Once those pass, broaden or repeat testing only when new changes, failures, or unresolved concerns justify it; otherwise, continue toward completing the task.
```

## 迁移快速入门

### 使用 Codex 进行迁移

Codex 可以使用 [OpenAI Docs 技能应用本指南中的建议更改](https://github.com/openai/codex/tree/main/codex-rs/skills/src/assets/samples/openai-docs).

```text
$openai-docs migrate this project to GPT-6 Astra
```

要在其他编码 智能体 中使用此技能，请从 [Codex 仓库](https://github.com/openai/codex/tree/main/codex-rs/skills/src/assets/samples/openai-docs).

### 更新 API 和模型参数

Set `model` 为 `gpt-6-astra`，然后检查以下内容：

- **Reasoning effort:** If you currently use `none` or `minimal`, start with `low` and compare results. Otherwise, preserve your current effective [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning#reasoning-effort). Use `reasoning.effort` in Responses or `reasoning_effort` in Chat Completions.
- **Tool calling:** Use the [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses#migrating-from-chat-completions). GPT-6 Astra supports Chat Completions, but tool calling requires Responses.
- **Unsupported parameters:** Remove `temperature`, `top_p`, and `top_logprobs`. For Chat Completions, also remove `logprobs`. For Responses, remove `message.output_text.logprobs` from `include`.
- **Fast mode:** 对于欧盟数据驻留，请使用 Standard 处理方式。GPT-6 Astra 不支持 `service_tier: "fast"` or `service_tier: "priority"` 使用欧盟数据驻留。GPT-6 Astra 的快速模式不包含延迟 SLA。请参阅 [快速模式兼容性](https://developers.openai.com/api/docs/guides/fast-mode#is-fast-mode-compatible-with-data-residency-zero-data-retention-and-a-baa).
- **更改推理力度：** 如果你的应用在多次响应之间更改了推理力度，请在标准、单智能体请求中使用 `configuration_update` 项。请保持请求级别的 `reasoning.effort` 不变，以保留用于缓存的提示词前缀。请查阅 [兼容性限制](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 后再采用此功能。
- **提示词缓存：** 从 GPT-5.5 或更早版本迁移时，请将 `prompt_cache_retention` 替换为 `prompt_cache_options.ttl` 设置为 `"30m"`。请参阅 [提示词缓存变更](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences)，包括缓存边界和缓存写入计费。
- **不必要的审批暂停：** 如果你遇到模型在继续执行前反复请求审批的问题，请使用 [主动性与跟进指引](#initiative-and-follow-through) 来提示更自主的执行。请参阅其余的 [提示最佳实践](#prompting-best-practices) ，获取关于指令遵循、写作风格、子智能体委派和测试方面的指导。