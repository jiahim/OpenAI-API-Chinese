---
latestModelInfo:
  model: gpt-6-astra
  migrationGuide: /api/docs/guides/latest-model/gpt-6-astra.md#migration-quickstart
  promptingGuide: /api/docs/guides/latest-model/gpt-6-astra.md#prompting-best-practices
---

# 使用 GPT-6 Astra

> 完整文档索引请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾附加 `.md` 即可获取对应文档页面的 Markdown 版本。

## 简介

GPT-6 Astra 是我们迄今为止最智能的模型，在计算机使用、浏览、软件工程、科学和专业工作方面具有业界领先的性能。它擅长跨代码、浏览器和专业软件执行多步骤工作流。在 [多项评估中](https://openai.com/index/gpt-6-astra/)，Astra 在使用明显更少的输出令牌的同时取得了更强的结果——尽管其单令牌价格更高，但每个任务的预估 API 成本仍低于早期模型。

GPT-6 Astra 也是我们迄今为止对齐程度最高的模型。它擅长审慎行事、尊重任务边界并进行透明的沟通。当指令留有解读空间时，它会利用已有上下文填补常规空缺，并在答案可能改变结果时提出针对性的问题。它会吸收新的要求、按指示调整方向，并在不偏离整体任务的前提下回答附带问题。

要使用 Astra 构建，请在 `model` 响应接口 `gpt-6-astra` 请求中将 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 设置为模型。

<a id="gpt-6-astra-what-is-new" className="scroll-mt-[110px]"></a>

## 新增功能

- **异步工具调用：** GPT-6 Astra 可以在你的应用运行某个工具的同时继续推理、调用其他工具，或回答请求中的独立部分。设置 `async: true` 为函数或自定义工具上的异步，并在就绪时使用原始的 `call_id`。返回其结果。你的应用仍然负责执行工具并管理待处理任务。参见 [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling) 了解基础用法以及开发者自定义的等待工具模式。
- **中途引导：** 在 GPT-6 Astra 工作期间发送额外的用户指令，例如更正或需求变更。通过 WebSocket 连接，Responses API 会保留已完成的工作，并在 延续 中包含该更新。参见 [中途引导](https://developers.openai.com/api/docs/guides/steering) 了解事件流和工具结果处理方式。
- **在对话中途更改推理同时保留缓存：** 添加一个 `configuration_update` 输入项，以在处理困难任务时提高推理力度，或在处理常规后续任务时降低推理力度，而无需重写原始的提示前缀。更新后的推理力度会一直生效，直到另一个 `configuration_update` 输入项覆盖它。参见 [在对话中途更改推理](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 了解示例和兼容性。
- **失准监控：** 作为我们 [强化安全措施](https://openai.com/index/path-to-astra/) 的一部分，针对 GPT-6 Astra，我们的系统会异步监控失准情况，并在必要时触发警报。参见 [失准监测](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 以获取更多信息。
- **限制：** GPT-6 Astra 不支持设置 `none` 推理强度。 [快速模式](https://developers.openai.com/api/docs/guides/fast-mode) 对使用 EU 数据驻留的 GPT-6 Astra 不可用。

GPT-6 Astra 也支持 GPT-5.6 已有的 API 能力，包括 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use), [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [streaming](https://developers.openai.com/api/docs/guides/streaming-responses), [Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [multi-智能体 orchestration](https://developers.openai.com/api/docs/guides/responses-multi-agent), [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching), [persisted reasoning](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls), [compaction](https://developers.openai.com/api/docs/guides/compaction)、 [pro mode](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).

## 提示最佳实践

GPT-6 Astra 比 GPT-5.6 Sol 等以往模型更智能、能力更强，并且还表现出可通过针对你的用例对模型进行提示来优化的行为模式。

### GPT-6 Astra 行为

- [主动性与持续跟进](#initiative-and-follow-through) – 该模型被设计为更高效的协作者，因此在补充输入可能实质性地改变结果时，更倾向于向用户提问。这可能导致它在用户期望它做出合理假设并继续执行时停下来。
- [指令遵循](#instruction-following) – GPT-6 Astra 在通用指令遵循方面比之前的模型更强，让你对其行为拥有更大的控制权。它对技能和其他文件中包含的指令可能更加敏感，例如 `AGENTS.md`。我们 **强烈建议** 审计模型可访问的技能和其他文件中的指令，这些指令可能会影响其行为。
- [个性与写作风格](#personality-and-writing-style) – 该模型倾向于给出详细、格式化的回复，并可能在不同会话中使用重复的短语。请明确指定你的应用所需的写作风格和结构。
- [子智能体委派](#subagent-delegation) – 该模型对你的 工作流 委派子任务的频率可能低于预期。请明确指定它应在何时以及以何种程度使用子智能体来执行并行工作。
- [测试与验证](#testing-and-verification) – 在编码任务中，该模型倾向于在认为任务完成之前进行充分的测试。对于较小的任务，这可能导致测试范围超过任务所需。

### 主动发起与持续推进

GPT-6 Astra 在长时间任务中保持连贯性的能力通常优于 GPT-5.6 Sol 及更早的模型。它也更容易在早期模型会做出假设的地方主动请求澄清。

为了鼓励更加自主的工作，可以从以下提示开始：

```text
You should infer the user's intent and task scope from the instructions and prior conversation context. Your job is to bias towards action and carry the user's intended task to completion.

When the user expresses intent to perform new work or fix an existing issue, persist until the user's intended goal is complete. Progress autonomously towards the user's goal (e.g. creating isolated worktrees / checkouts if needed, resolving merge conflicts, read-only actions, creating draft PRs etc.) unless they are clearly destructive or irreversible.
```

当用户意图不明确时，模型更有可能向用户请求澄清后再继续。如果用户的提示隐含了授权，请提示模型按此继续：

```text
When the user's prompt indicates a request for action, such as "can you...", "I want to...", "help me..." and similar expressions, treat these as instructions to do the work and take action. Do not stop at acknowledging capability (e.g. "Yes…"), proposing a plan, or offering to continue. Do not settle for a partial or "helpful enough" solution that does not fully satisfy the user's task to save time, effort or tokens. If a task requires sustained work, complete all the necessary work until the intended outcome is fulfilled.
```

提示模型在准备好具体、可复核的结果之后再请求批准。这可以避免在模型完成其能够完成的工作之前就阻塞任务，并且通常会更快地完成任务。

```text
Before asking the user clarifying questions, you should complete the work that is already authorized from context and necessary to make the proposed action concrete and reviewable. The user should be approving a concrete, reviewable result. For example, before deploying a change, writing to an external application, merging a PR or publishing a site, do all the required work first so that user approval is the final step. You don't need user permission for reversible tasks, read-only actions, reviews or fixes, or anything for which authorization is provided earlier in the session or strongly implied from the task instruction.

Do not introduce unsolicited warnings, disclaimers, approval flows, or safety/compliance checklists due to hypothetical risk.
```

该模型默认还倾向于在工作时提出非阻塞性问题，因此请根据应用所需的自主程度调整这些提示。

### 指令遵循

GPT-6 Astra 能更好地遵循较长的指令，但也可能对上下文中的信息更加敏感。例如，技能文件中不清晰或冲突的指引可能导致模型提前暂停并阻止工作。请明确用户指令和技能的优先级。

```text
The user's instructions take precedence over guidelines provided in a skill. If explicit user instructions conflict with a skill's instructions, prioritize the user's instructions.
```

让模型识别导致其暂停或改变方向的技能和指令，也有助于提高模型行为的透明度。

```text
If a skill causes you to ask for permission or confirmation, pause, leave requested work unfinished, or diverge from the user's intent, name and link to the exact SKILL.md file you read, quote the relevant instruction, and briefly explain how it applies. Distinguish explicit skill requirements from your interpretation of guidelines.
```

当你的应用加载大量技能和指令文件时，可以使用以下提示来发现隐性和冲突的指引，例如 `AGENTS.md`.

### 性格与写作风格

GPT-6 Astra 倾向于使用列表、表格和 Markdown 来让回答更易于浏览。如果你的应用需要格式较少的散文，请在偏好中指定该需求。

```text
Default to using clear, concise paragraphs, each developing one main idea. Use lists only when the information is genuinely parallel, sequential, or easier to compare, and avoid nested lists unless the hierarchy cannot be expressed clearly in prose. Use plain, simple language: familiar words, concrete examples, and precise verbs. Prefer active voice and direct statements.

Make sure to state the main point clearly and early, then develop it with the explanation and detail the reader needs. Let each sentence build on what came before. Develop the points that matter and provide enough support to be useful.
```

在进行技术沟通时，可以使用以下提示在清晰、连贯的语言与领域适配性之间取得平衡：

```text
Use plain language over jargon, and reference technical details only to the degree that it helps illustrate an idea or your work to the user. Communicate complex concepts in a clear and cohesive manner, and calibrate your writing to the level of background knowledge assumed from the user's prompt and context.
```

若要在写作中减少术语和套话，可以从以下提示开始：

```text
Avoid using slop words or phrases like "Bottom Line:" in conclusions, "delve," "foster," "leverage," "it's worth noting," "importantly," "Question? Answer." or "This isn't about X. It's about Y.", "genuinely" or hyphenated compound descriptions and adjectives. Do not use concluding summary statements such as "In short:..", "The simplest mental model is:...".

State the intended action directly. Avoid adding what you won't do, what will remain unchanged, or how you'll separate or categorize results. Do not use contrastive framing such as "X, not Y" or "X—not Y" that introduces an unprompted alternative that the user didn't ask about. Avoid invented compound labels like "exact-head checks" and "editorial-row layouts", vague qualifiers, and canned transitions; use plain verbs and prepositions to state the actual relationship directly.
```

### 子智能体委派

GPT-6 Astra 经过训练，能够将工作划分并委派给并行工作的子智能体。如果你要在 harness 中实现多智能体系统，请使用以下提示来调整 GPT-6 Astra 应委派多少工作：

```text
If at any point you can parallelize work by delegating tasks to another agent (no matter if you are the root or subagent), you should do so using collaboration tools if it could save time or improve quality.
```

智能体之间的消息可能包含语法或空格错误。使用以下提示可以让智能体间的消息更易于阅读：

```text
Messages that you send to other agents and your final answer may be read by a human, so ensure they are legible. Always put proper spaces between words and/or numbers.
```

该模型通常对如何以及何时应将工作委派给子智能体的提示反应良好，因此可以根据你的 harness 和多智能体实现来调整此行为。

### 测试与验证

对于编码任务，需要校准一项改动所需的测试与验证程度。这有助于避免为小改动进行不必要的测试或重复检查。

```text
Do not write tests for reversible, low-impact changes that mirror the implementation. If you do choose to verify your work with tests, make sure that the tests are meaningful and necessary to verify implementation.

Run tests appropriate to the change and complete required checks. Once those pass, broaden or repeat testing only when new changes, failures, or unresolved concerns justify it; otherwise, continue toward completing the task.
```

## 迁移快速入门

### 使用 Codex 进行迁移

Codex 可通过 OpenAI Docs 技能应用本指南中推荐的更改 [该公司 Docs 技能](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

```text
$openai-docs migrate this project to GPT-6 Astra
```

要在其他编码 智能体 中使用此技能，请从 OpenAI skills 仓库下载 [该公司 skills 仓库](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

### 更新 API 和模型参数

设置 `model` 响应接口 `gpt-6-astra`，然后检查以下内容：

- **推理强度：** 如果你当前使用 `none` 或 `minimal`，请从 `low` 开始并对比结果；否则请保留你当前生效的 [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning#reasoning-effort)。在 Responses 中使用 `reasoning.effort` ，或在 Chat Completions 中使用 `reasoning_effort` 。
- **工具调用：** 使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses#migrating-from-chat-completions)。GPT-6 Astra 支持 Chat Completions，但工具调用需要使用 Responses。
- **不支持的参数：** 移除 `temperature`, `top_p`，和 `top_logprobs`。对于 Chat Completions，还需移除 `logprobs`。对于 Responses，请从 `message.output_text.logprobs` 中移除 `include`.
- **快速模式：** 对于欧盟数据驻留，请使用 Standard 处理。GPT-6 Astra 不支持 `service_tier: "fast"` 或 `service_tier: "priority"` 配合欧盟数据驻留。GPT-6 Astra 的快速模式不包含延迟 SLA。参见 [快速模式兼容性](https://developers.openai.com/api/docs/guides/fast-mode#is-fast-mode-compatible-with-data-residency-zero-data-retention-and-a-baa).
- **更改推理力度：** 如果你的应用在多个响应之间更改力度，请使用 `configuration_update` 项于标准的、单一智能体请求中。请保持请求级别的 `reasoning.effort` 不变，以保留用于缓存的提示前缀。请查看 [兼容性限制](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 后再采用此功能。
- **提示缓存：** 当从 GPT-5.5 或更早版本迁移时，请将 `prompt_cache_retention` 替换为 `prompt_cache_options.ttl` 设置为 `"30m"`。请查看 [提示缓存变更](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences)，包括缓存边界和缓存写入计费。
- **不必要的审批暂停：** 如果你遇到模型在继续执行前反复请求审批的问题，请使用 [主动性与跟进指南](#initiative-and-follow-through) 来提示更自主的执行。参见其余的 [提示最佳实践](#prompting-best-practices) 以获取关于指令遵循、写作风格、子智能体委派和测试的指导。