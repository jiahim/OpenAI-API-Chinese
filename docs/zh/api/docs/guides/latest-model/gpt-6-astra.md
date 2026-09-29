---
latestModelInfo:
  model: gpt-6-astra
  migrationGuide: /api/docs/guides/latest-model/gpt-6-astra.md#migration-quickstart
  promptingGuide: /api/docs/guides/latest-model/gpt-6-astra.md#prompting-best-practices
---

# 使用 GPT-6

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾添加 `.md` 获取。

根据任务所需的推理能力、速度和成本选择 GPT-6 模型。



- [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra)

  **最高智能水平**

  面向最具挑战性的推理、编码和专业技术工作。

- [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol)

  **速度、成本与智能的均衡**

  在更低成本下提供接近 Astra 的复杂工作性能。

- [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)

  **速度最快且性价比最高**

  为聚焦、高吞吐量任务提供强劲性能。



要开始使用，请在 `model` 中设置 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 请求。如果你已经在使用 [`gpt-6-sol`](https://developers.openai.com/api/docs/models/gpt-6-sol)，请查看 [迁移指南](#migration-quickstart) ，再切换到 GPT-6.1 Sol。

### GPT-6 Astra

GPT-6 Astra 是我们迄今为止最智能的模型，在计算机使用、浏览、软件工程、科学和专业工作方面具有领先性能。它能够跨代码、浏览器和专业软件执行多步骤工作流。在 [多项评估中](https://openai.com/index/gpt-6-astra/)，Astra 以显著更少的输出 token 取得了更强的结果。尽管其单价更高，但每个任务的估计 API 成本低于早期模型。

GPT-6 Astra 也是我们迄今为止对齐程度最高的模型。它擅长谨慎行事、尊重任务边界并以透明的方式进行沟通。当指令存在解读空间时，它会利用已有上下文填补常规缺口，并在答案可能改变结果时提出有针对性的问题。它会纳入新的要求、按要求调整方向，并在不偏离更广泛任务的前提下回答旁枝问题。

所有 GPT-6 Astra 用户还可以使用 [Fast 模式](https://developers.openai.com/api/docs/guides/fast-mode) 以及全新的 [Ultrafast 模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) ，享受我们最快的 API 速度。

<a id="gpt-61-sol"></a>
<a id="gpt-6.1-sol"></a>

### GPT-6.1 Sol

在需要接近 Astra 的性能但成本更低时，可使用 GPT-6.1 Sol 处理复杂编码、计算机使用和
专业工作。可在你的任务上将它与 Astra 进行对比，以评估质量与成本之间
的权衡。

设置 `reasoning.effort` 为 `low`, `medium` (默认), `high`, `xhigh`,或 `max`.
使用 Responses API 进行工具调用。Chat Completions 仅支持
不含工具的请求。 `none` 并且 `minimal` 不支持推理强度设置。

请参阅 [模型页面](https://developers.openai.com/api/docs/models/gpt-6.1-sol) 了解规格、
价格和可用性，或参阅 [模型选择](https://developers.openai.com/api/docs/guides/model-selection#when-to-consider-gpt-61-sol)
获取模型选择方面的指导。

<a id="gpt-6-astra-what-is-new" className="scroll-mt-[110px]"></a>

## 更新日志

- **异步工具调用：** 在你的应用运行工具期间，GPT-6 可以继续推理、调用其他工具，或回答请求中相互独立的部分。在函数或自定义工具上设置 `async: true` ，并在就绪后使用原始 `call_id`。返回其结果。你的应用仍然负责执行工具并管理挂起任务。参见 [异步工具调用](https://developers.openai.com/api/docs/guides/async-tool-calling) 了解基础用法和开发者自定义的等待工具模式。
- **中途引导：** 在 GPT-6 工作时发送额外的用户指令，例如纠正或变更需求。在 WebSocket 连接上，Responses API 会保留已完成的工作，并将该更新包含在 延续（延续）中。参见 [中途引导](https://developers.openai.com/api/docs/guides/steering) 了解事件流程和工具结果处理方式。
- **在对话中途更改推理强度同时保留缓存：** 添加一个 `configuration_update` 输入项以提高困难工作的推理强度，或在常规跟进中降低强度，而无需重写原始提示前缀。更新后的推理强度将一直生效，直到另一个 `configuration_update` 输入项覆盖它。参见 [在对话中途更改推理强度](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) 了解示例和兼容性。
- **失调监控：** 作为我们 [强化版安全措施](https://openai.com/index/path-to-astra/) 的一部分，针对 GPT-6 Astra，我们的系统会异步监控失调情况，并在必要时触发告警。参见 [失配监控](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring) 了解更多信息。

GPT-6 也支持 GPT-5.6 现有的 API 功能，包括 [computer use](https://developers.openai.com/api/docs/guides/tools-computer-use), [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs), [streaming](https://developers.openai.com/api/docs/guides/streaming-responses), [Programmatic Tool Calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling), [multi-智能体 orchestration](https://developers.openai.com/api/docs/guides/responses-multi-agent), [prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching), [persisted reasoning](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls), [compaction](https://developers.openai.com/api/docs/guides/compaction)，以及 [pro mode](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).

## 局限性

- GPT-6 Astra 和 GPT-6.1 Sol 不支持 `none` 推理强度；GPT-6 Sol 和 GPT-6 Luna 支持。
- GPT-6 Astra、GPT-6 Sol 或 GPT-6 Luna 在 EU 数据驻留下不可使用快速模式。 [超快模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) 仅支持美国数据驻留和全球处理，不支持欧盟或其他非美国区域处理端点。详见 [数据驻留资格](https://developers.openai.com/api/docs/guides/your-data#which-models-and-features-are-eligible-for-data-residency).

<a id="prompting-best-practices" className="scroll-mt-[110px]"></a>

## 提示最佳实践

以下提示可作为整个 GPT-6 模型族的起点。它们针对 GPT-6 Astra 中观察到的行为；请结合你选用的模型和工作负载对它们进行评估。

### GPT-6 Astra behavior

- [主动性与持续推进](#initiative-and-follow-through)：该模型被设计为更高效的协作者，因此当额外输入可能实质性改变结果时，它更倾向于向用户提问。这可能导致它在用户原本期望它做出合理假设并持续推进时停下来。
- [指令遵循](#instruction-following)：GPT-6 Astra 在通用指令遵循方面比之前的模型更强，让你对其行为拥有更大的控制权。它可能对技能和其他文件中包含的指令更为敏感，例如 `AGENTS.md`。我们 **强烈建议** 你审计模型可访问的技能和其他文件，以查找可能影响其行为的指令。
- [个性与写作风格](#personality-and-writing-style)：该模型倾向于给出详细、格式化的回复，并可能在不同会话中使用重复出现的短语。请明确指定你的应用所需的写作风格和结构。
- [子智能体委派](#subagent-delegation)：该模型可能针对你的工作流委派子智能体的频率低于预期。请明确说明它应在何时以及多大程度上使用子智能体来执行并行工作。
- [测试与验证](#testing-and-verification)：对于编程任务，该模型倾向于在认为任务完成之前进行充分的测试。对于较小的任务，这可能导致测试范围超出任务本身的所需。

### 主动性与持续跟进

GPT-6 Astra 在长任务中保持连贯性的能力总体上优于 GPT-5.6 Sol 及更早的模型。在更早的模型会做出假设的场景下，它也更可能主动请求澄清。

为了鼓励更自主的工作方式，可以从以下提示开始：

```text
You should infer the user's intent and task scope from the instructions and prior conversation context. Your job is to bias towards action and carry the user's intended task to completion.

When the user expresses intent to perform new work or fix an existing issue, persist until the user's intended goal is complete. Progress autonomously towards the user's goal (e.g. creating isolated worktrees / checkouts if needed, resolving merge conflicts, read-only actions, creating draft PRs etc.) unless they are clearly destructive or irreversible.
```

当用户的意图不明确时，模型更有可能主动向用户请求澄清后再继续。若用户的提示隐含授权，可以提示模型继续推进：

```text
When the user's prompt indicates a request for action, such as "can you...", "I want to...", "help me..." and similar expressions, treat these as instructions to do the work and take action. Do not stop at acknowledging capability (e.g. "Yes…"), proposing a plan, or offering to continue. Do not settle for a partial or "helpful enough" solution that does not fully satisfy the user's task to save time, effort or tokens. If a task requires sustained work, complete all the necessary work until the intended outcome is fulfilled.
```

提示模型在准备出具体、可审核的结果之后再请求批准。这可以避免在模型完成其能完成的工作之前就阻塞任务，通常能让任务更快完成。

```text
Before asking the user clarifying questions, you should complete the work that is already authorized from context and necessary to make the proposed action concrete and reviewable. The user should be approving a concrete, reviewable result. For example, before deploying a change, writing to an external application, merging a PR or publishing a site, do all the required work first so that user approval is the final step. You don't need user permission for reversible tasks, read-only actions, reviews or fixes, or anything for which authorization is provided earlier in the session or strongly implied from the task instruction.

Do not introduce unsolicited warnings, disclaimers, approval flows, or safety/compliance checklists due to hypothetical risk.
```

该模型在默认情况下工作时也倾向于提出非阻塞性的问题，因此可以根据应用所需的自主程度调整这些提示。

### 指令遵循

GPT-6 Astra 能更好地遵循较长的指令，但也可能对上下文中的信息更加敏感。例如，技能文件中含糊或冲突的指引可能导致模型过早暂停并阻断工作。请明确用户指令与技能之间的优先级。

```text
The user's instructions take precedence over guidelines provided in a skill. If explicit user instructions conflict with a skill's instructions, prioritize the user's instructions.
```

让模型识别导致其暂停或改变方向的技能与指令，也有助于提高模型行为的透明度。

```text
If a skill causes you to ask for permission or confirmation, pause, leave requested work unfinished, or diverge from the user's intent, name and link to the exact SKILL.md file you read, quote the relevant instruction, and briefly explain how it applies. Distinguish explicit skill requirements from your interpretation of guidelines.
```

当你的应用加载大量技能和指令文件时，可以使用以下提示来发现静默的或冲突的指引，例如 `AGENTS.md`.

### 个性与写作风格

GPT-6 Astra 倾向于使用列表、表格和 Markdown 来让回复更易于浏览。如果你的应用需要减少格式化的散文，请明确指定该偏好。

```text
Default to using clear, concise paragraphs, each developing one main idea. Use lists only when the information is genuinely parallel, sequential, or easier to compare, and avoid nested lists unless the hierarchy cannot be expressed clearly in prose. Use plain, simple language: familiar words, concrete examples, and precise verbs. Prefer active voice and direct statements.

Make sure to state the main point clearly and early, then develop it with the explanation and detail the reader needs. Let each sentence build on what came before. Develop the points that matter and provide enough support to be useful.
```

对于技术交流，下面的提示有助于在使用清晰连贯的语言与保持领域适配性之间取得平衡：

```text
Use plain language over jargon, and reference technical details only to the degree that it helps illustrate an idea or your work to the user. Communicate complex concepts in a clear and cohesive manner, and calibrate your writing to the level of background knowledge assumed from the user's prompt and context.
```

若要在写作中减少术语和套话，可以从以下提示开始：

```text
Avoid using slop words or phrases like "Bottom Line:" in conclusions, "delve," "foster," "leverage," "it's worth noting," "importantly," "Question? Answer." or "This isn't about X. It's about Y.", "genuinely" or hyphenated compound descriptions and adjectives. Do not use concluding summary statements such as "In short:..", "The simplest mental model is:...".

State the intended action directly. Avoid adding what you won't do, what will remain unchanged, or how you'll separate or categorize results. Do not use contrastive framing such as "X, not Y" that introduces an unprompted alternative that the user didn't ask about. Avoid invented compound labels like "exact-head checks" and "editorial-row layouts", vague qualifiers, and canned transitions; use plain verbs and prepositions to state the actual relationship directly.
```

### Subagent delegation

GPT-6 Astra 经过训练，能够将任务拆分并委派给并行工作的子智能体。如果你正在自己的 harness 中实现多智能体系统，可使用以下提示词来调整 GPT-6 Astra 委派工作的程度：

```text
If at any point you can parallelize work by delegating tasks to another agent (no matter if you are the root or subagent), you should do so using collaboration tools if it could save time or improve quality.
```

智能体之间的消息可能存在语法或空格错误。使用以下提示词可使智能体间的消息更易于阅读：

```text
Messages that you send to other agents and your final answer may be read by a human, so ensure they are legible. Always put proper spaces between words and/or numbers.
```

该模型通常能很好地响应关于如何以及何时将工作委派给子智能体的提示，因此请根据你的 harness 和多智能体实现来调整这一行为。

### 测试与验证

对于编码任务，需要校准一项更改所需的测试和验证量。这有助于避免为小幅更改进行不必要的测试或重复检查。

```text
Do not write tests for reversible, low-impact changes that mirror the implementation. If you do choose to verify your work with tests, make sure that the tests are meaningful and necessary to verify implementation.

Run tests appropriate to the change and complete required checks. Once those pass, broaden or repeat testing only when new changes, failures, or unresolved concerns justify it; otherwise, continue toward completing the task.
```

## 迁移快速入门

### 使用 Codex 进行迁移

Codex 可以通过以下方式应用本指南中的推荐更改： [OpenAI Docs 技能](https://github.com/openai/codex/tree/main/codex-rs/skills/src/assets/samples/openai-docs).

```text
$openai-docs migrate this project to the GPT-6 model family
```

若要在其他编码智能体中使用此技能，请从以下位置下载： [Codex 代码仓库](https://github.com/openai/codex/tree/main/codex-rs/skills/src/assets/samples/openai-docs).

### 更新 API 和模型参数

设置 `model` 为 `gpt-6-astra`, `gpt-6.1-sol`,或 `gpt-6-luna`，然后检查以下内容：

- **Reasoning effort:** 保留当前生效的 [reasoning effort](https://developers.openai.com/api/docs/guides/reasoning#reasoning-effort) （在受支持的模型上）。GPT-6 Astra 和 GPT-6.1 Sol 不支持 `none`；请改用 `low` 。GPT-6 Sol 和 GPT-6 Luna 支持 `none`。如果你的现有请求使用 `minimal`，请从 `low` 开始，并在具有代表性的任务上对比结果。在 Responses 中使用 `reasoning.effort` ，或在 Chat Completions 中使用 `reasoning_effort` 。
- **Tool calling:** 使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses#migrating-from-chat-completions)。GPT-6 Astra 和 GPT-6.1 Sol 支持 Chat Completions，但工具调用必须使用 Responses。GPT-6 Sol 和 GPT-6 Luna 仅在 Chat Completions 中结合以下参数支持 function calling： `reasoning_effort: "none"`。将 Responses 用于带工具的推理。
- **Unsupported parameters:** 当 reasoning effort 不是 `none`，时，请移除 `temperature`, `top_p`，以及 `top_logprobs`. 对于 Chat Completions，还要移除 `logprobs`. 对于 Responses，移除 `message.output_text.logprobs` from `include`.
- **数据驻留：** GPT-6 Astra、GPT-6 Sol 或 GPT-6 Luna 在 EU 数据驻留下不可使用快速模式。 [超快模式](https://developers.openai.com/api/docs/guides/ultrafast-mode) 仅支持美国数据驻留和全球处理，不支持欧盟或其他非美国区域处理端点。GPT-6 Astra 的快速模式不包含延迟 SLA。详见 [快速模式兼容性](https://developers.openai.com/api/docs/guides/fast-mode#is-fast-mode-compatible-with-data-residency-zero-data-retention-and-a-baa).
- **更改推理力度：** 如果你的应用在多次响应之间更改力度，请在标准的、单个智能体请求中使用 `configuration_update` items in standard, single-智能体 requests. Keep request-level `reasoning.effort` unchanged to preserve the prompt prefix for caching. Check the [兼容性限制](https://developers.openai.com/api/docs/guides/reasoning#change-reasoning-mid-conversation) ，然后再采用此功能。
- **提示缓存：** 从 GPT-5.5 或更早版本迁移时，将 `prompt_cache_retention` 替换为 `prompt_cache_options.ttl` 设置为 `"30m"`。请查看 [提示缓存变更](https://developers.openai.com/api/docs/guides/prompt-caching#summary-of-model-differences), including cache boundaries and cache-write billing.
- **不必要的审批暂停：** 如果模型在继续执行前反复请求确认才能继续，请使用 [主动推进与持续执行指南](#initiative-and-follow-through) 来促使模型更自主地执行。参阅 [提示最佳实践](#prompting-best-practices) 以获取有关指令遵循、写作风格、子智能体委派和测试的指导。