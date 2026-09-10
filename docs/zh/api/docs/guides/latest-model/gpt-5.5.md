# 使用 GPT-5.5

> 完整文档索引请参阅 [llms.txt](/llms.txt)。页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 介绍

GPT-5.5 提升了复杂生产工作流的基线水平。它非常适合编程场景、调用大量工具的智能体、有据可依的助手、长上下文检索、从产品规格到实施计划的工作流，以及那些对执行质量和回复润色要求严苛的面向客户的工作流。

要充分发挥 GPT-5.5 的能力，请将它视作一个需要重新调优的新模型系列，而不是可以即插即用替换 `gpt-5.2` 或 `gpt-5.4`。的替代品。开始迁移时请使用全新的基线，而不是把旧提示词栈里的每条指令都搬过来。从能保留产品契约的最小提示词开始，再针对有代表性的样本来调优推理强度、冗长度、工具描述和输出格式。

GPT-5.5 支持所有 GPT-5.4 已有的API 功能，包括 [提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching), [托管工具](https://developers.openai.com/api/docs/guides/tools#available-tools), [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search), [上下文压缩](https://developers.openai.com/api/docs/guides/compaction)，以及 `phase` 对手动重放 assistant 项的处理。

请参阅 [提示词最佳实践](#prompting-best-practices) 了解成功提示模式的相关示例。

## 最近更新

- **更高效的推理：** GPT-5.5 在使用比以往模型更少的推理 token 的情况下也能取得出色的结果，即使在相同的推理投入下也是如此。这在工具繁多或多步骤的工作流中尤其有用，因为节省的 token 会不断累积。
- **以结果为先的提示，带来更强的任务执行能力：** GPT-5.5 更擅长围绕明确目标工作，保留各项约束，并将产品意图转化为具体的下一步操作。请描述预期结果、成功标准、允许的副作用、证据规则以及输出形式。除非确切路径至关重要，否则应避免给出逐步式的流程指导。
- **更强且更精准的工具调用能力：** GPT-5.5 在大型工具面、多步骤服务工作流以及长时间运行的智能体任务中尤为有用。它在工具选择和参数使用上往往更加精准。
- **语气通常更精致，但也可能更直接：** GPT-5.5 通常能给出更温暖、更易读的答案，且所需的提示脚手架更少。

## 行为变更

1. **推理强度现在默认为 `medium`:** GPT-5.5 默认采用 `medium` 推理强度。将其视为在质量、可靠性、延迟和成本方面推荐的平衡起点。对于延迟敏感的工作流，请在 `medium` 之前评估 `low` ，适用于工具使用、规划、搜索或多步决策仍然很重要的场景。将 `none` 保留给那些不需要推理或多链式工具调用的延迟关键型任务，例如轻量级语音对话、快速信息检索和分类。仅当评估显示可衡量的质量提升能证明额外延迟和成本合理时，才提升至 `none` 或 `high` 或 `xhigh` 。更多关于推荐设置的详细信息，请参阅 [推理模型文档](https://developers.openai.com/api/docs/guides/reasoning) 。

   更高的推理强度并不一定更好。如果任务包含相互冲突的指令、较弱的停止条件或开放式工具访问，更高的强度可能导致过度思考、不必要的搜索或输出质量下降。仅当评估显示可衡量的质量提升时，才提高推理强度。

2. **默认情况下，图像输入会保留更多视觉细节：** GPT-5.5 更新了图像输入的默认处理方式，以保留更多视觉细节并提升计算机使用性能。当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 `original` 行为，保留图像而不进行缩放，最高支持 10,240,000 像素或 6,000 像素的尺寸限制。对于 `high`，请直接指定该值；它会保留图像而不进行缩放，最高支持 2,500,000 像素或 2,048 像素的尺寸限制。 `low` 现在更注重上下文效率，会比之前的模型更激进地对超过 512 像素尺寸限制的图像进行缩放。请参阅 [图像与视觉文档](https://developers.openai.com/api/docs/guides/images-vision).

3. **改进指令遵循能力：** GPT-5.5 会以字面且彻底的方式解读提示词，从而在产品需要时支持具体且描述性的指令。定义成功标准和停止规则，尤其是针对长时间运行、工具密集或需要收集证据的工作流。请参阅 [编写以结果为先的提示词](#outcome-first-prompts-and-stopping-conditions) 和 [保持适度的具体性](#formatting).

4. **默认风格更加简洁直接：** GPT-5.5 默认倾向于高效、直接且以任务为导向。这对许多生产工作流很有用，但面向客户或对话式的体验可能需要明确指定个性、温度、理由以及格式引导。使用 `text.verbosity` 意图明确： `medium` 是默认值， `low` 通常作为简洁响应的更佳起点。请参阅 [提示词最佳实践](#prompting-best-practices).

5. **编码工作流需要更强的编排：** GPT-5.5 更适合需要规划、工具使用、代码库导航、验证以及多步执行的复杂编码任务。对于编码 智能体，应明确说明复用、子智能体委派、测试预期、验收标准，以及何时继续执行、何时寻求帮助。

## 迁移快速入门

### 使用 Codex 自动迁移

Codex 可以使用本指南中推荐的更改，配合 [OpenAI Docs 技能](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

```text
$openai-docs migrate this project to gpt-5.5
```

要在其他编码智能体中使用此技能，请从 [OpenAI 技能仓库](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

### API 和模型参数

- 将模型 slug 更新为 `gpt-5.5`.
- 针对任何推理、工具调用或多轮对话场景，请使用 Responses API。
- 调节 `reasoning.effort`。可使用 `low` 进行高效推理， `medium` 在延迟/性能曲线上取得平衡， `high` 应对需要高强度推理且对延迟容忍度较低的复杂智能体任务，以及 `xhigh` 应对最困难的异步智能体任务或测试模型智能边界的评估。请参阅 [推理模型文档](https://developers.openai.com/api/docs/guides/reasoning).
- 若要配置更简洁的响应，请将 `text.verbosity` 设置为 `low`。在 GPT-5.5 上，这相比 GPT-5.4 的 `low` 详细程度会带来比例上更简洁的响应。
- 对于工具密集或长时间运行的工作流，请验证你的应用是否正确处理 `phase`、前置说明和助手项回放。
- 在准确性、token 消耗和端到端延迟方面与其他模型进行基准对比。

### 提示工程

- 说明预期结果和成功标准。
- 减少或移除详细的分步骤流程指引。除非产品要求该路径，否则让 GPT-5.5 自行选择路径。
- 尽可能在提示中移除输出 schema 定义。使用 [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) 代替。
- 优化你的提示以利用缓存： [静态部分在前，动态部分在后](https://developers.openai.com/api/docs/guides/prompt-caching).
- 移除当前日期。模型已经知道当前的 UTC 日期。
- 使用以下方式查看并优化你的提示： [提示词最佳实践](#prompting-best-practices).

## 使用推理模型

本指南适用于 GPT-5 系列模型，每当团队将工作负载迁移到推理模型时，都值得重新审视。GPT-5.5 延续了早期模型中首次出现的许多能力，但如果你正在从更早的 GPT-5 模型、GPT-4.1，或诸如 o3 之类的推理模型迁移过来，仍然值得回顾这些能力。

团队可能会忽视这些功能，因为它们部分位于 API 配置与编排之中，而非提示本身。结合使用时，Responses API、推理控制、详细程度、结构化输出、提示缓存、工具设计、托管工具和状态管理，能够帮助推理模型在智能水平、可靠性、延迟和成本方面达到最佳表现。

- **Responses API:** GPT-5.5 在Responses API [响应接口](https://developers.openai.com/api/docs/guides/migrate-to-responses)。可使用 `previous_response_id` 中效果最佳，可用于多轮状态处理。对于无状态或零数据保留流程，请在每一轮传回相关的返回输出项。详见 [从上一次响应传递上下文](https://developers.openai.com/api/docs/guides/conversation-state#passing-context-from-the-previous-response) 以了解详情。
- **推理投入度：** 使用 `reasoning.effort` 在以下选项之间选择： `low`, `medium`, `high`，或 `xhigh`。默认值为 `medium`，但许多工作负载在该值下表现良好，使用 `low`。将 `none` 用于低延迟比智能程度更重要的场景。详见 [推理模型](https://developers.openai.com/api/docs/guides/reasoning) 的详细建议。
- **详细程度：** 使用 `text.verbosity` 来控制输出长度。将最终答案长度与推理质量分开对待；根据需要指定字数预算、章节数量、表格宽度或仅输出 JSON。
- **结构化输出：** 避免在提示中描述预期的输出架构。请使用 [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) 用于自动校验并提升准确度。
- **提示缓存：** [提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching) 对符合条件的长提示会自动生效，可降低延迟和输入 token 成本。为最大化缓存命中，请将稳定内容放在请求开头，将动态的、用户特定的上下文放在末尾。通过 `usage.prompt_tokens_details.cached_tokens` 来衡量复用情况。使用可选的 [`prompt_cache_key`](https://developers.openai.com/api/docs/guides/prompt-caching#separate-prompts-with-cache-keys) ，可以为不同客户或用户分别维护缓存账目，从而更容易解释每个分组的缓存 token 使用与计费，也有助于防止跨用户探测缓存命中。
- **工具调用：** GPT-5.5 支持与 GPT-5.4 相同的工具调用模式，包括函数工具和工具密集型的 智能体 工作流。将工具相关的多数指引放在工具自身的描述中：工具的作用、何时使用、所需输入、副作用、重试安全性以及常见错误模式。仅当内容跨多个工具适用或会实质性改变 智能体 的运行策略时，才将其加入系统指令。
- **托管工具与工具搜索：** 优先选择 [OpenAI 托管工具](https://developers.openai.com/api/docs/guides/tools) 当其契合 工作流 时，例如 网页搜索、文件搜索、代码解释器、图像生成和计算机使用。托管工具可减少自定义编排负担，并使常见工具模式与 Responses API 及 Agents SDK 保持一致。当你需要调用自有系统、执行特定领域的副作用，或暴露内部业务工作流时，使用自定义函数工具。对于大型工具目录，可以考虑使用 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 来延迟工具定义，只加载相关的子集。
- **工具前置说明：** 前置说明可以改善聊天用户体验，因为用户在模型生成最终回复之前会先看到一条有用的初始状态更新。它们也使工具调用更易于跟踪：模型可以先说明即将检查或执行的内容，在工具结果返回后再从同一助手状态继续。
- **`phase` 处理：** 如果你的应用通过每轮传回输出项来手动管理 Responses 状态，而不是使用 `previous_response_id`，请保留返回的助手输出项上的 `phase` 参数，并在再次发起请求时原样传回。在使用推理力度、前置说明或重复工具调用时，这一点尤其重要。参见 [Phase parameter](https://developers.openai.com/api/docs/guides/reasoning#phase-parameter).
- **压缩：** 对于长时间运行的智能体，请使用 [conversation/state compaction](https://developers.openai.com/api/docs/guides/compaction) 有意地进行压缩。保留已完成的操作、当前假设、ID、工具结果、未解决的阻塞点以及下一个具体目标。
- **Agents SDK：** 对于新的智能体系统，请使用最新的 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 提供的工具编排、追踪、交接和状态管理模式，而不是从零开始重建编排逻辑。
- **当前日期：** GPT-5.5 知晓 UTC 当前日期。你无需在系统指令中额外添加当前日期。仅当应用需要特定业务的时区、生效日期策略、用户本地日期或其他非 UTC 参考点时，才添加显式的日期或时区上下文。

## 提示最佳实践

GPT-5.5 在提示定义最终结果并为模型留出选择高效解决方案路径的空间时表现最佳。与早期模型相比，你通常可以使用更短、更聚焦于结果的提示：描述良好的输出是什么样的、哪些约束是重要的、可用哪些证据，以及最终答案应包含什么。

避免将旧提示堆栈中的每一条指令都照搬过来。旧版提示常常过度规定流程，因为早期模型需要更多帮助才能保持在正确轨道上。而使用 GPT-5.5 时，这可能会引入噪声、缩小模型的搜索空间，或导致答案过于机械。

这里的模式只是起点。请根据你的产品界面、工具、评估和用户体验目标进行调整。

### 个性与行为

GPT-5.5 的默认风格高效、直接且以任务为导向。这对生产系统非常有用：响应保持聚焦，行为更易引导，模型避免了不必要的对话铺垫。

对于面向客户的助手、支持工作流、辅导体验以及其他对话类产品，需同时定义其个性与协作风格。

- **Personality** 控制助手的表达风格：语气、亲和度、直接程度、正式程度、幽默感、共情能力以及表达的打磨程度。
- **Collaboration style** 控制助手的工作方式：何时提问、何时做假设、应有多主动、提供多少上下文、何时核对工作，以及如何处理不确定性与风险。

都应保持简短。个性化指令用于塑造用户体验；协作指令用于塑造任务行为。两者都不能取代清晰的目标、成功标准、工具规则或停止条件。

面向稳定、以任务为中心的智能体的个性化示例块：

```text
# Personality
You are a capable collaborator: approachable, steady, and direct. Assume the user is competent and acting in good faith, and respond with patience, respect, and practical helpfulness.

Prefer making progress over stopping for clarification when the request is already clear enough to attempt. Use context and reasonable assumptions to move forward. Ask for clarification only when the missing information would materially change the answer or create meaningful risk, and keep any question narrow.

Stay concise without becoming curt. Give enough context for the user to understand and trust the answer, then stop. Use examples, comparisons, or simple analogies when they make the point easier to grasp. When correcting the user or disagreeing, be candid but constructive. When an error is pointed out, acknowledge it plainly and focus on fixing it.

Match the user's tone within professional bounds. Avoid emojis and profanity by default, unless the user explicitly asks for that style or has clearly established it as appropriate for the conversation.
```

面向表达丰富、善于协作的智能体的个性化示例块：

```text
# Personality
Adopt a vivid conversational presence: intelligent, curious, playful when appropriate, and attentive to the user's thinking. Ask good questions when the problem is blurry, then become decisive once there is enough context.

Be warm, collaborative, and polished. Conversation should feel easy and alive, but not chatty for its own sake. Offer a real point of view rather than merely mirroring the user, while staying responsive to their goals and constraints.

Be thoughtful and grounded when the task calls for synthesis or advice. State a clear recommendation when you have enough context, explain important tradeoffs, and name uncertainty without becoming evasive.
```

对于更具表现力的产品，可以明确加入温暖感、好奇心、幽默感或个人观点，但仍需保持该块简短。用个性化来塑造体验，而不是用它来弥补目标不清或任务指令缺失。

### 通过前缀文本缩短首可见 token 的出现时间

在流式应用中，用户会注意到从开始到第一条可见响应出现所花费的时间。GPT-5.5 在输出可见文本之前，可能会花时间进行推理、规划或准备工具调用。

对于耗时较长或工具密集型的任务，可以提示模型以一段简短的“开场白”开始：先给出一段可见的简短更新，确认请求并说明第一步。这样可以在不改变底层任务的前提下，提升用户对响应速度的感受。

当任务可能需要多个步骤、必须调用工具，或涉及长时间运行的智能体工作流时，可以使用这一模式。

```text
Before any tool calls for a multi-step task, send a short user-visible update that acknowledges the request and states the first step. Keep it to one or two sentences.
```

对于公开区分不同消息阶段的编程智能体，你可以表达得更明确：

```text
You must always start with an intermediary update before any content in the analysis channel if the task will require calling tools. The user update should acknowledge the request and explain your first step.
```

### 以结果为导向的提示与停止条件

当提示定义目标成果、成功标准、约束条件以及可用上下文，然后让模型自主选择路径时，GPT-5.5 的表现最为强大。

对于许多任务，应描述目标结果而非每一步操作。这能让模型有空间为任务选择合适的搜索、工具或推理策略。

推荐写法：

```text
Resolve the customer's issue end to end.

Success means:
- the eligibility decision is made from the available policy and account data
- any allowed action is completed before responding
- the final answer includes completed_actions, customer_message, and blockers
- if evidence is missing, ask for the smallest missing field
```

**避免不必要的硬性规则。** 较旧的提示通常使用严格的指令，比如 `ALWAYS`, `NEVER`, `must`，以及 `only` 来控制模型行为。这些措辞应仅用于真正的强制约束，例如安全规则、必需的输出字段或绝对不应发生的操作。对于判断性决策（例如何时搜索、何时请求澄清、何时使用工具或何时继续迭代），应优先采用决策规则。

除非每一步都确实必需，否则避免这种指令风格：

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

定义缺失证据时的行为：

```text
Use the minimum evidence sufficient to answer correctly, cite it precisely, then stop.
```

### 格式设置

GPT-5.5 在输出格式和结构上具有高度的可控性。当这种控制有助于提升理解或更契合产品需求时，请善加利用。

设置 `text.verbosity`，描述期望的输出形式，并将更重的结构留给有助于理解或产品 UI 需要稳定产物的场景。API 默认对 `text.verbosity` 使用 `medium`；当你倾向于更简短、更精炼的回复时，请使用 `low` 。

纯对话式排版：

```text
Let formatting serve comprehension. Use plain paragraphs as the default format for normal conversation, explanations, reports, documentation, and technical writeups. Keep the presentation clean and readable without making the structure feel heavier than the content.

Use headers, bold text, bullets, and numbered lists sparingly. Reach for them when the user requests them, when the answer needs clear comparison or ranking, or when the information would be harder to scan as prose. Otherwise, favor short paragraphs and natural transitions.

Respect formatting preferences from the user. If they ask for a terse answer, minimal formatting, no bullets, no headers, or a specific structure, follow that preference unless there is a strong reason not to.
```

添加明确的受众和长度指引：

```text
Write for a senior business audience. Keep the answer under 400 words. Use short paragraphs and only include bullets when they improve scannability. Prioritize the conclusion first, then the reasoning, then caveats.
```

对于编辑、改写、摘要或面向客户的文案，请在要求模型改进风格之前，先告诉它需要保留哪些内容。当你想让文本更精致但又不希望扩写时，这种模式非常有用。

```text
Preserve the requested artifact, length, structure, and genre first. Quietly improve clarity, flow, and correctness. Do not add new claims, extra sections, or a more promotional tone unless explicitly requested.
```

### Grounding、引用与检索预算

对于有依据的答案，引用行为应当成为提示的一部分。需要明确指出哪些内容需要支持、什么算作足够的证据，以及当证据缺失时模型应当如何应对。缺少证据不应自动等同于事实上的“否定”。更多细节和示例，请参阅 [引用格式化指南](https://developers.openai.com/api/docs/guides/citation-formatting).

#### 添加显式检索预算

检索预算是搜索的停止规则。它们告诉模型何时已收集到足够的证据。

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

### 创意写作护栏

对于起草类任务，需告知模型哪些陈述必须来自来源，哪些部分可以由模型自由创作。这一点对于演示文稿、发布文案、客户摘要、宣讲脚本、高管介绍以及叙事框架尤其重要。

```text
For creative or generative requests such as slides, leadership blurbs, outbound copy, summaries for sharing, talk tracks, or narrative framing, distinguish source-backed facts from creative wording.

- Use retrieved or provided facts for concrete product, customer, metric, roadmap, date, capability, and competitive claims, and cite those claims.
- Do not invent specific names, first-party data claims, metrics, roadmap status, customer outcomes, or product capabilities to make the draft sound stronger.
- If there is little or no citable support, write a useful generic draft with placeholders or clearly labeled assumptions rather than unsupported specifics.
```

### 前端工程与视觉品味

对于前端工作，请参阅 [示例说明](https://developers.openai.com/api/docs/guides/frontend-prompt) ，了解引导界面质量的实用方法。其中涵盖了产品和用户上下文、设计系统对齐、首屏可用性、常见控件、预期状态、响应式行为，以及需要避免的常见生成式界面默认设置，例如通用英雄区、嵌套卡片、装饰性渐变、可见的说明性文字以及破损的布局。

### 提示模型检查其工作结果

让 GPT-5.5 访问那些能够在可以验证时检查输出的工具。

对于编码智能体，请其给出具体的验证命令：

```text
After making changes, run the most relevant validation available:
- targeted unit tests for changed behavior
- type checks or lint checks when applicable
- build checks for affected packages
- a minimal smoke test when full validation is too expensive

If validation cannot be run, explain why and describe the next best check.
```

对于可视化产物，请在渲染后要求进行检查：

```text
Render the artifact before finalizing. Inspect the rendered output for layout, clipping, spacing, missing content, and visual consistency. Revise until the rendered output matches the requirements.
```

对于工程和规划任务，使实施计划可追溯：

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

从 GPT-5.4 开始，长时间运行或工具密集型的 Responses 工作流可以使用 assistant-item `phase` 值来区分中间更新与最终回答。GPT-5.5 采用相同的模式。

如果使用 `previous_response_id`，API 会自动保留先前的 assistant 状态。如果你的应用手动将 assistant 输出项重放到下一次请求中，请保留每个原始 `phase` 值并原样传回。当响应包含前言、重复的工具调用，或在中间 assistant 更新之后的最终回答时，这一点尤为重要。

```text
If manually replaying assistant items:
- Preserve assistant `phase` values exactly.
- Use `phase: "commentary"` for intermediate user-visible updates.
- Use `phase: "final_answer"` for the completed answer.
- Do not add `phase` to user messages.
```

### 建议的提示词结构

将此结构作为复杂提示的起点。每个部分都应保持简洁，仅在会改变行为的部分补充细节。

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