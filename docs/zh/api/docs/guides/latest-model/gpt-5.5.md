# 使用 GPT-5.5

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

## 简介

GPT-5.5 提升了复杂生产工作流的基线水平。它非常适合编码场景、工具密集型的智能体、基于事实的助手、长上下文检索、从产品规约到规划的工作流，以及对执行质量和回复润色要求较高的面向客户的工作流。

要充分发挥 GPT-5.5 的能力，应将其视为一个需要重新调优的新模型系列，而不是 `gpt-5.2` 或 `gpt-5.4`。的直接替代品。开始迁移时建议建立全新的基线，而不是照搬旧提示词栈中的所有指令。先从能在保持产品契约的前提下用最小提示词，随后针对代表性样本调优推理力度、冗长度、工具描述和输出格式。

GPT-5.5 支持 GPT-5.4 已有的所有 API 功能，包括 [提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching), [托管工具](https://developers.openai.com/api/docs/guides/tools#available-tools), [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search), [压缩](https://developers.openai.com/api/docs/guides/compaction)，以及 `phase` 对手动重放助手条目的处理。

请参阅 [提示最佳实践](#prompting-best-practices) 中成功提示模式的示例。

## What's new

- **更高效的推理：** GPT-5.5 以比以往模型更少的推理令牌即可取得出色的结果，即使在相同的推理强度下也是如此。在复杂、工具密集或多步骤的工作流中，令牌节省会不断累积，这一点尤为有用。
- **通过以结果为先的提示获得更强的任务执行能力：** GPT-5.5 更擅长围绕明确目标工作、保留约束条件，并将产品意图转化为具体的下一步。请描述预期结果、成功标准、允许的副作用、证据规则以及输出形态。除非确切的执行路径至关重要，否则应避免逐步式的流程指导。
- **更强且更精准的工具使用：** GPT-5.5 在大型工具集、多步骤服务工作流以及长时间运行的智能体任务中尤为有用。它在工具选择和参数使用方面通常更为精准。
- **语气通常更精炼，但可能更直接：** GPT-5.5 通常能以更少的提示脚手架，生成更温暖、更易读的回复。

## 行为变更

1. **推理强度现在默认为 `medium`:** GPT-5.5 默认为 `medium` 推理强度。将 `medium` 视为在质量、可靠性、延迟和成本方面推荐的均衡起点。对于延迟敏感的工作流，请在工具使用、规划、搜索或多步决策仍然重要时评估 `low` 再 `none` ，当工具使用、规划、搜索或多步决策仍然重要时，请评估 `none` 用于不需要推理或多链式工具调用的延迟关键任务，例如轻量级语音轮次、快速信息检索和分类。仅当评估显示可衡量的质量提升能证明额外延迟和成本合理时，才提升至 `high` 或 `xhigh` 。更多推荐设置详情，请参阅 [推理模型文档](https://developers.openai.com/api/docs/guides/reasoning) 。

   更高的推理强度并不自动更好。如果任务存在冲突指令、较弱的停止条件或开放式的工具访问，更高的强度可能导致过度思考、不必要的搜索或输出质量下降。仅当评估显示可衡量的质量提升时，才提升强度。

2. **图像输入默认保留更多视觉细节：** GPT-5.5 更新了图像输入的默认处理方式，以保留更多视觉细节并提升计算机使用性能。当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 `original` 行为，在不超过 10,240,000 像素或 6,000 像素尺寸限制的情况下保留图像而不进行缩放。对于 `high`，请直接指定该值；它在不超过 2,500,000 像素或 2,048 像素尺寸限制的情况下保留图像而不进行缩放。 `low` 现在专注于上下文效率，并以比先前模型更激进的方式对超过 512 像素尺寸限制的图像进行缩放。请参阅 [图像和视觉文档](https://developers.openai.com/api/docs/guides/images-vision).

3. **改进指令遵循能力：** GPT-5.5 以字面化且彻底的方式解读提示词，当产品需要时可以给出具体、描述性的指令。定义成功标准和停止规则，尤其是对于长时间运行、工具密集或证据收集型的工作流。参见 [编写以结果为先的提示词](#outcome-first-prompts-and-stopping-conditions) 以及 [保持适度的具体性](#formatting).

4. **默认风格更简洁直接：** GPT-5.5 默认倾向于高效、直接且以任务为导向。这对许多生产工作流很有用，但面向客户或对话式的体验可能需要明确指定个性、温度、推理过程和格式指引。使用 `text.verbosity` 有意设置： `medium` 为默认值，而 `low` 通常更适合作为简洁回复的起点。参见 [提示词最佳实践](#prompting-best-practices).

5. **编码工作流需要更强的编排：** GPT-5.5 更适合需要规划、工具使用、代码库导航、验证以及多步执行的复杂编码任务。对于编码 智能体，应明确说明复用、子智能体委托、测试预期、验收标准，以及何时继续推进、何时寻求帮助。

## 迁移快速入门

### 使用 Codex 自动迁移

Codex 可以通过以下方式应用本指南中的推荐更改： [OpenAI Docs 技能](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

```text
$openai-docs migrate this project to gpt-5.5
```

要在其他编码智能体中使用此技能，请从 [OpenAI 技能仓库下载](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

### API 和模型参数

- 将模型 slug 更新为 `gpt-5.5`.
- 使用 Responses API 处理任何推理、工具调用或多轮用例。
- Tune `reasoning.effort`。使用 `low` 进行高效推理， `medium` 在延迟与性能曲线上取得平衡， `high` 用于需要强推理且对延迟要求不高的复杂智能体任务，以及 `xhigh` 用于最具挑战性的异步智能体任务或评估模型智能边界的评测。详见 [推理模型文档](https://developers.openai.com/api/docs/guides/reasoning).
- 若要配置更简洁的回复，请将 `text.verbosity` 设置为 `low`。在 GPT-5.5 上，这将带来比 GPT-5.4 上的 `low` verbosity 比例更简洁的回复。
- 对于工具密集型或长时间运行的工作流，请验证你的应用是否正确处理 `phase`、前言以及 assistant-item 重放。
- 在准确性、token 消耗和端到端延迟方面与其他模型进行基准对比。

### 提示工程

- 明确预期结果和成功标准。
- 减少或移除详细的分步流程指导。除非产品要求该路径，否则让 GPT-5.5 自行选择路径。
- 尽可能在提示中移除输出模式定义。使用 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs) 来替代。
- 优化你的提示以提升缓存效果： [静态内容在前，动态内容在后](https://developers.openai.com/api/docs/guides/prompt-caching).
- 去掉当前日期。模型已经知道当前的 UTC 日期。
- 使用以下工具审查并优化你的提示： [提示词最佳实践](#prompting-best-practices).

## 使用推理模型

本指南适用于 GPT-5 系列模型，每当团队将工作负载迁移到推理模型时都值得重新阅读。GPT-5.5 沿用了许多在早期模型中首次出现的能力，但如果你是从早期的 GPT-5 模型、GPT-4.1 或类似 o3 的推理模型迁移过来，这些能力仍然值得重新审视。

团队可能会忽略这些特性，因为它们有一部分位于 API 配置与编排层面，而非提示本身。组合使用时，Responses API、推理控制、详细程度、结构化输出、提示缓存、工具设计、托管工具以及状态管理，能帮助推理模型在智能、可靠性、延迟和成本结构上发挥最佳水平。

- **Responses API:** GPT-5.5 在 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。使用 `previous_response_id` 中表现最佳，可用于多轮状态处理。对于无状态或零数据保留流程，请在每轮回传相关的返回输出项。详见 [从上一次响应传递上下文](https://developers.openai.com/api/docs/guides/conversation-state#passing-context-from-the-previous-response) 。
- **推理力度：** 使用 `reasoning.effort` 在以下选项之间选择 `low`, `medium`, `high`，或 `xhigh`。默认值为 `medium`，但许多工作负载使用 `low`。时也能表现良好。 `none` 将其留给那些低延迟比智能更重要的用例。详见 [推理模型](https://developers.openai.com/api/docs/guides/reasoning) 以获取详细建议。
- **冗长度:** 使用 `text.verbosity` 以控制输出长度。将最终答案的长度与推理质量分开处理；在需要时指定字数预算、章节数量、表格宽度或仅输出 JSON。
- **结构化输出:** 避免在提示中描述期望的输出模式。请使用 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs) 用于自动校验并提升准确性。
- **Prompt caching：** [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) 会针对符合条件的较长提示自动生效，可降低延迟和输入 token 成本。为最大化缓存命中率，请在请求开头保持稳定内容，将与用户相关的动态上下文放在末尾。对于具有相同前缀的重复流量，请使用 `prompt_cache_key` 保持一致，并跟踪 `usage.prompt_tokens_details.cached_tokens`.
- **工具调用：** GPT-5.5 支持与 GPT-5.4 相同的工具调用模式，包括函数工具以及工具密集型的智能体工作流。将大部分工具专属指导放在工具描述本身中：工具的功能、何时使用、所需输入、副作用、重试安全性以及常见错误模式。仅当工具专属上下文跨工具通用或实质性改变智能体的运行策略时，才将其加入系统指令。
- **托管工具和工具搜索：** 优先使用 [OpenAI-hosted tools](https://developers.openai.com/api/docs/guides/tools) 以契合工作流，例如网页搜索、文件搜索、代码解释器、图像生成和计算机使用。托管工具可减少自定义编排负担，并使常见工具模式与Responses API以及Agents SDK保持一致。当你需要调用自有系统、执行特定领域的副作用，或暴露内部业务工作流时，请使用自定义函数工具。对于大型工具目录，可考虑使用 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 以延迟工具定义，仅加载相关子集。
- **工具前置说明：** 前置说明可以改善聊天体验，因为用户在模型生成最终响应之前就能看到一条有用的初始状态更新。它们也让工具调用过程更易于跟踪：模型可以说明接下来要检查或执行的操作，然后在工具结果返回后从同一助手状态继续。
- **`phase` 处理：** 如果你的应用通过在每轮传回输出项来手动管理 Responses 状态，而非使用 `previous_response_id`，请在返回的助手输出项上保留该 `phase` 参数并原样传回。在使用推理强度、前置说明或重复工具调用时，这一点尤为重要。参见 [Phase parameter](https://developers.openai.com/api/docs/guides/reasoning#phase-parameter).
- **压缩：** 对于长时间运行的 智能体，使用 [conversation/state compaction](https://developers.openai.com/api/docs/guides/compaction) （对话/状态压缩），仅在明确意图下进行。保留已完成的活动、当前假设、ID、工具结果、未解决的阻塞项以及下一个具体目标。
- **Agents SDK：** 对于新的智能体系统，使用最新的 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 中的工具编排、追踪、交接和状态管理模式，而不是从零开始重建编排逻辑。
- **当前日期：** GPT-5.5 已知晓 UTC 当前日期。你无需将当前日期添加到系统指令中。仅当应用需要业务特定的时区、生效日期、用户本地日期或其他非 UTC 参考点时，才添加显式的日期或时区上下文。

## 提示最佳实践

GPT-5.5 在提示词明确描述期望结果并为模型留出选择高效解决方案路径的空间时表现最佳。与早期模型相比，你通常可以使用更简短、更聚焦于结果的提示词：描述什么算作良好结果、哪些约束重要、可用的证据有哪些，以及最终答案应包含哪些内容。

避免沿用旧版提示词栈中的每一条指令。旧版提示词往往会过度规定过程，因为早期模型需要更多帮助才能保持在正轨上。而在 GPT-5.5 上，这可能反而会引入噪声、收窄模型的搜索空间，或导致答案过于机械。

这里的模式只是起点。请结合你的产品界面、工具、评估方式和用户体验目标进行调整。

### 个性与行为

GPT-5.5 的默认风格高效、直接且以任务为导向。这对生产系统很有用：响应保持聚焦，行为更易引导，并且模型会避免不必要的对话式冗余。

对于面向客户的助手、支持工作流、辅导体验以及其他对话型产品，需要同时定义其个性与协作风格。

- **个性** 控制助手的声音风格：语气、亲和度、直接程度、正式度、幽默感、共情能力以及表达的精致程度。
- **协作风格** 控制助手的工作方式：何时提问、何时做出假设、应有多主动、提供多少上下文、何时检查工作，以及如何处理不确定性或风险。

保持两者简短。个性指令应当塑造用户体验。协作指令应当塑造任务行为。两者都不能替代清晰的目标、成功的评判标准、工具规则或停止条件。

用于稳定且专注于任务的智能体的个性示例块：

```text
# Personality
You are a capable collaborator: approachable, steady, and direct. Assume the user is competent and acting in good faith, and respond with patience, respect, and practical helpfulness.

Prefer making progress over stopping for clarification when the request is already clear enough to attempt. Use context and reasonable assumptions to move forward. Ask for clarification only when the missing information would materially change the answer or create meaningful risk, and keep any question narrow.

Stay concise without becoming curt. Give enough context for the user to understand and trust the answer, then stop. Use examples, comparisons, or simple analogies when they make the point easier to grasp. When correcting the user or disagreeing, be candid but constructive. When an error is pointed out, acknowledge it plainly and focus on fixing it.

Match the user's tone within professional bounds. Avoid emojis and profanity by default, unless the user explicitly asks for that style or has clearly established it as appropriate for the conversation.
```

用于表达性协作型智能体的个性示例块：

```text
# Personality
Adopt a vivid conversational presence: intelligent, curious, playful when appropriate, and attentive to the user's thinking. Ask good questions when the problem is blurry, then become decisive once there is enough context.

Be warm, collaborative, and polished. Conversation should feel easy and alive, but not chatty for its own sake. Offer a real point of view rather than merely mirroring the user, while staying responsive to their goals and constraints.

Be thoughtful and grounded when the task calls for synthesis or advice. State a clear recommendation when you have enough context, explain important tradeoffs, and name uncertainty without becoming evasive.
```

对于更具表现力的产品，可以明确地加入温暖感、好奇心、幽默感或观点，但请保持该块简短。使用个性来塑造体验，而不是用来弥补目标不清晰或任务指令缺失。

### 通过预填充消息缩短首字延迟

在流式应用中，用户会注意到在第一个可见响应出现之前需要等待多长时间。GPT-5.5 可能会在发出可见文本之前花时间进行推理、规划或准备工具调用。

对于较长或工具密集型任务，可以提示模型以一段简短的引导语开头：先给出一个简短的可见更新，确认请求并说明第一步。这可以在不改变底层任务的情况下改善感知到的响应速度。

当任务可能需要多个步骤、需要工具调用，或涉及长时间运行的智能体工作流时，可以使用此模式。

```text
Before any tool calls for a multi-step task, send a short user-visible update that acknowledges the request and states the first step. Keep it to one or two sentences.
```

对于暴露独立消息阶段的编码智能体，你可以更明确地这样做：

```text
You must always start with an intermediary update before any content in the analysis channel if the task will require calling tools. The user update should acknowledge the request and explain your first step.
```

### 以结果为导向的提示与停止条件

当提示词定义了目标结果、成功标准、约束以及可用上下文，并让模型自行选择路径时，GPT-5.5 的表现最佳。

对于许多任务，应描述目标，而不是罗列每一步。这样可以让模型根据任务自行选择合适的搜索、工具或推理策略。

推荐写法：

```text
Resolve the customer's issue end to end.

Success means:
- the eligibility decision is made from the available policy and account data
- any allowed action is completed before responding
- the final answer includes completed_actions, customer_message, and blockers
- if evidence is missing, ask for the smallest missing field
```

**避免不必要的绝对规则。** 较早的提示词常常使用如下严格指令 `ALWAYS`, `NEVER`, `must`，以及 `only` 来控制模型行为。请将这些措辞留给真正的不变项，例如安全规则、必需的输出字段或绝不应发生的操作。对于判断类问题，例如何时搜索、何时请求澄清、何时使用工具或何时继续迭代，应改用决策规则。

除非每一步都确实必要，否则应避免这种指令风格：

```text
First inspect A, then inspect B, then compare every field, then think through
all possible exceptions, then decide which tool to call, then call the tool,
then explain the entire process to the user.
```

添加明确的停止条件：

```text
Resolve the user query in the fewest useful tool loops, but do not let loop minimization outrank correctness, accessible fallback evidence, calculations, or required citation tags for factual claims.

After each result, ask: "Can I answer the user's core request now with useful evidence and citations for the factual claims?" If yes, answer.
```

定义证据缺失时的行为：

```text
Use the minimum evidence sufficient to answer correctly, cite it precisely, then stop.
```

### 格式化

GPT-5.5 在输出格式和结构上具有高度可引导性。当这种控制有助于理解或产品契合时，请善加利用。

设置 `text.verbosity`，描述预期的输出形态，并将更重的结构留给能够提升理解力或产品 UI 需要稳定产物的场景。API 针对 `text.verbosity` 的默认是 `medium`；若你偏好更简短 `low` 的回复，请使用。

简洁的口语化排版：

```text
Let formatting serve comprehension. Use plain paragraphs as the default format for normal conversation, explanations, reports, documentation, and technical writeups. Keep the presentation clean and readable without making the structure feel heavier than the content.

Use headers, bold text, bullets, and numbered lists sparingly. Reach for them when the user requests them, when the answer needs clear comparison or ranking, or when the information would be harder to scan as prose. Otherwise, favor short paragraphs and natural transitions.

Respect formatting preferences from the user. If they ask for a terse answer, minimal formatting, no bullets, no headers, or a specific structure, follow that preference unless there is a strong reason not to.
```

添加明确的受众与长度指引：

```text
Write for a senior business audience. Keep the answer under 400 words. Use short paragraphs and only include bullets when they improve scannability. Prioritize the conclusion first, then the reasoning, then caveats.
```

在编辑、改写、摘要或面向客户的消息场景中，先告诉模型需要保留什么，再要求其改进风格。当你希望润色而非扩展时，这种模式非常有用。

```text
Preserve the requested artifact, length, structure, and genre first. Quietly improve clarity, flow, and correctness. Do not add new claims, extra sections, or a more promotional tone unless explicitly requested.
```

### Grounding, citations, and retrieval budgets

对于有依据的答案，引用行为应纳入提示词中。明确哪些内容需要依据支持、何为充分证据，以及当证据缺失时模型应如何表现。缺少证据不应自动变成事实上的“否”。更多细节和示例，请参阅 [引用格式化指南](https://developers.openai.com/api/docs/guides/citation-formatting).

#### 添加显式的检索预算

检索预算是搜索的停止规则。它们告诉模型何时证据已经足够。

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

### 创意起草护栏

对于起草类任务，告诉模型哪些说法必须来自资料来源，哪些部分可以由你自由创作。这对于幻灯片、上线文案、客户摘要、宣讲话术、领导致辞以及叙事框架尤其重要。

```text
For creative or generative requests such as slides, leadership blurbs, outbound copy, summaries for sharing, talk tracks, or narrative framing, distinguish source-backed facts from creative wording.

- Use retrieved or provided facts for concrete product, customer, metric, roadmap, date, capability, and competitive claims, and cite those claims.
- Do not invent specific names, first-party data claims, metrics, roadmap status, customer outcomes, or product capabilities to make the draft sound stronger.
- If there is little or no citable support, write a useful generic draft with placeholders or clearly labeled assumptions rather than unsupported specifics.
```

### 前端工程与视觉品味

对于前端工作，请参阅 [示例说明](https://developers.openai.com/api/docs/guides/frontend-prompt) 了解引导 UI 质量的实用方法。它们涵盖了产品和用户上下文、设计系统一致性、首屏可用性、熟悉的控件、预期状态、响应式行为，以及需要避免的常见生成式 UI 默认值，例如通用的英雄区、嵌套卡片、装饰性渐变、可见的说明性文字以及布局错乱等问题。

### 提示模型检查其工作

让 GPT-5.5 访问能够在可以验证时检查输出的工具。

对于编码智能体，要求提供具体的验证命令：

```text
After making changes, run the most relevant validation available:
- targeted unit tests for changed behavior
- type checks or lint checks when applicable
- build checks for affected packages
- a minimal smoke test when full validation is too expensive

If validation cannot be run, explain why and describe the next best check.
```

对于视觉工件，要求在渲染后进行检查：

```text
Render the artifact before finalizing. Inspect the rendered output for layout, clipping, spacing, missing content, and visual consistency. Revise until the rendered output matches the requirements.
```

对于工程和规划任务，让实现计划可追溯：

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

### Phase 参数

从 GPT-5.4 开始，长期运行或工具调用密集的 Responses 工作流可使用 assistant-item `phase` 值来区分中间更新与最终答复。GPT-5.5 使用相同的模式。

如果你使用 `previous_response_id`, API 会自动保留之前的助手状态。如果你的应用将助手输出项手动重放到下一次请求中，请保留每个原始 `phase` 值并原样传回。当响应包含开场白、重复的工具调用，或在中间助手更新之后的最终答复时，这一点尤为重要。

```text
If manually replaying assistant items:
- Preserve assistant `phase` values exactly.
- Use `phase: "commentary"` for intermediate user-visible updates.
- Use `phase: "final_answer"` for the completed answer.
- Do not add `phase` to user messages.
```

### 建议的提示词结构

以此结构作为复杂提示词的起点。每个章节保持简洁，仅在影响行为处补充细节。

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