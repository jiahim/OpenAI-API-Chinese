# 使用 GPT-5.5

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 简介

GPT-5.5 提升了复杂生产工作流的基线能力。它非常适合编码场景、工具密集型 智能体、有据可查的助手、长上下文检索、产品规格到计划的工作流，以及对执行质量和回复润色要求很高的面向客户的工作流。

要充分发挥 GPT-5.5 的优势，应将它视为需要重新调优的新模型系列，而不是作为 `gpt-5.2` 或 `gpt-5.4`。的直接替代品进行迁移。从全新基线开始迁移，而不是沿用旧提示词栈中的每一条指令。先从能够保留产品契约的最小提示词入手，再针对代表性示例调优推理强度、输出详尽度、工具描述和输出格式。

GPT-5.5 支持 GPT-5.4 已有的全部 API 功能，包括 [提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching), [托管工具](https://developers.openai.com/api/docs/guides/tools#available-tools), [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search), [compaction](https://developers.openai.com/api/docs/guides/compaction),以及 `phase` 对手动重放的助手项的处理。

请参阅 [提示最佳实践](#prompting-best-practices) 以获取成功提示模式的示例。

## 新功能

- **更高效的推理：** GPT-5.5 以更少的推理 token 达到强劲效果，即使在相同推理强度下也是如此。这在复杂、工具密集或多步骤的工作流中尤其有用，因为节省的 token 会不断累积。
- **使用结果导向的提示实现更强的任务执行：** GPT-5.5 更擅长基于明确目标工作，保持约束条件，并将产品意图转化为具体的下一步行动。请描述预期结果、成功标准、允许的副作用、证据规则以及输出形式。除非确切的路径至关重要，否则应避免给出逐步式的过程指导。
- **更强且更精准的工具调用：** GPT-5.5 在大型工具面、多步骤服务工作流以及长时间运行的智能体任务中尤其有用。它在工具选择和参数使用上往往更加精准。
- **语气通常更加精致，但可能更直接：** GPT-5.5 通常会给出更温暖、更易读的答复，且所需的提示脚手架更少。

## 行为变更

1. **推理力度现在默认为 `medium`:** GPT-5.5 默认采用 `medium` 推理力度。将 `medium` 视为质量、可靠性、延迟和成本的推荐平衡起点。对于延迟敏感型工作流，请评估 `low` 是否在 `none` 之前使用——当工具使用、规划、搜索或多步决策仍然重要时。 `none` 保留给不需要推理或多链式工具调用的延迟关键型任务，例如轻量级语音轮次、快速信息检索和分类。仅当评估显示出可衡量的质量提升且值得额外延迟和成本时，才提升到 `high` 或 `xhigh` 。有关推荐设置的更多详细信息，请参阅 [推理模型文档](https://developers.openai.com/api/docs/guides/reasoning) 。

   更高的推理力度并不总是更好。如果任务存在相互冲突的指令、较弱的停止条件或开放式的工具访问，更高的力度可能导致过度思考、不必要的搜索或输出质量下降。仅当评估显示出可衡量的质量提升时，才增加推理力度。

2. **默认情况下，图像输入会保留更多视觉细节：** GPT-5.5 更新了图像输入的默认处理方式，以保留更多视觉细节并提升计算机使用性能。当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 `original` 行为，在不超过 10,240,000 像素或 6,000 像素尺寸限制的情况下保留图像而不进行缩放。对于 `high`，请直接指定该值；它在不超过 2,500,000 像素或 2,048 像素尺寸限制的情况下保留图像而不进行缩放。 `low` 现在侧重于上下文效率，并以比之前的模型更激进的方式对超过 512 像素尺寸限制的图像进行缩放。请参阅 [图像与视觉文档](https://developers.openai.com/api/docs/guides/images-vision).

3. **改进的指令遵循：** GPT-5.5 以字面化和彻底的方式解读提示词，使产品在需要时能够使用具体且描述详尽的指令。定义成功标准和停止规则，特别是对于长时间运行、工具密集型或需要收集证据的工作流。参见 [编写以结果为先的提示词](#outcome-first-prompts-and-stopping-conditions) 和 [保持恰当的具体程度](#formatting).

4. **默认风格更简洁直接：** GPT-5.5 默认倾向于高效、直接且以任务为导向。这对许多生产工作流很有用，但面向客户或对话式体验可能需要明确的人格特征、亲和力、推理过程和格式指引。使用 `text.verbosity` 时有意识地： `medium` 是默认值，而 `low` 通常是更简洁响应的更好起点。参见 [提示词最佳实践](#prompting-best-practices).

5. **编码工作流需要更强的编排：** GPT-5.5 更适合需要规划、工具使用、代码库导航、验证和多步骤执行的复杂编码任务。对于编码智能体，应明确说明复用、子智能体委派、测试期望、验收标准，以及何时继续推进、何时寻求帮助。

## 迁移快速入门

### 使用 Codex 自动迁移

Codex 可以按照本指南中推荐的做法进行修改，配合 [OpenAI Docs 技能](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

```text
$openai-docs migrate this project to gpt-5.5
```

如需在其他编码智能体中使用该技能，可从 [OpenAI skills 仓库](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

### API 和模型参数

- 将模型 slug 更新为 `gpt-5.5`.
- 对任何推理、工具调用或多轮对话场景，使用 Responses API。
- Tune `reasoning.effort`。使用 `low` 进行高效推理， `medium` 在延迟/性能曲线上提供平衡的选项， `high` 用于需要强推理能力且对延迟不太敏感的复杂智能体任务，以及 `xhigh` 用于最具挑战性的异步智能体任务或测试模型智能边界的评估。参见 [推理模型文档](https://developers.openai.com/api/docs/guides/reasoning).
- 若要配置更简洁的响应，请将 `text.verbosity` 设置为 `low`。在 GPT-5.5 上，这将比 `low` 与 GPT-5.4 配合使用时的详细程度产生比例上更简洁的响应。
- 对于工具密集型或长时间运行的工作流，请验证你的应用能否正确处理 `phase`、前言和助手项的重放。
- 在准确性、token 消耗和端到端延迟方面与其他模型进行基准测试。

### 提示词

- 说明预期结果和成功标准。
- 减少或删除详细的分步骤流程指引。除非产品要求该路径，否则让 GPT-5.5 自己选择路径。
- 尽可能从提示中移除输出 schema 定义。使用 [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) 。
- 优化你的提示以利于缓存： [静态部分在前，动态部分在后](https://developers.openai.com/api/docs/guides/prompt-caching).
- 去掉当前日期。模型本身已经知道当前的 UTC 日期。
- 使用以下工具审查并优化你的提示 [提示词最佳实践](#prompting-best-practices).

## 使用推理模型

本指南适用于 GPT-5 系列模型，每当团队将工作负载迁移到推理模型时都值得重新阅读。GPT-5.5 沿用了早期模型中首次出现的许多能力，但如果你是从更早的 GPT-5 模型、GPT-4.1 或 o3 等推理模型迁移而来，这些能力仍然值得回顾。

团队可能会忽略这些能力，因为它们部分位于 API 配置和编排层面，而非提示本身。结合使用时，Responses API、推理控制、详细度、结构化输出、提示缓存、工具设计、托管工具和状态管理有助于推理模型在智能、可靠性、延迟和成本方面达到最佳表现。

- **Responses API：** GPT-5.5 在以下场景中效果最佳 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。使用 `previous_response_id` 用于多轮状态处理。对于无状态或零数据保留流程，每轮回传相关的返回输出项。参见 [从上一次响应传递上下文](https://developers.openai.com/api/docs/guides/conversation-state#passing-context-from-the-previous-response) 了解详情。
- **推理投入度：** 使用 `reasoning.effort` 在以下选项中选择 `low`, `medium`, `high`，或 `xhigh`。默认是 `medium`，但许多工作负载使用 `low`。请将 `none` 用于低延迟比智能更重要的用例。请参阅 [Reasoning Models](https://developers.openai.com/api/docs/guides/reasoning) 了解详细建议。
- **详细程度（Verbosity）：** 使用 `text.verbosity` 来控制输出长度。将最终答案长度与推理质量分开看待；根据需要指定字数预算、章节数量、表格宽度或仅输出 JSON。
- **结构化输出（Structured Outputs）：** 避免在提示中描述期望的输出模式。请使用 [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) 用于自动验证并提高准确性。
- **提示缓存：** [提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching) 会自动对符合条件的较长提示生效，并可降低延迟与输入 token 成本。为最大化缓存命中，请将稳定内容放在请求开头，把与用户相关的动态上下文放在末尾。借助 `usage.prompt_tokens_details.cached_tokens` 来衡量复用情况。对共享可复用前缀的请求使用稳定的 [`prompt_cache_key`](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-keys) 。该 key 有助于把相关请求路由到同一缓存，对优化 GPT-5.5 的缓存命中率很重要。对于流量较大的组，请遵循 [将流量分散到更多 key 的指南](https://developers.openai.com/api/docs/guides/prompt-caching#prompt-cache-keys).
- **工具调用：** GPT-5.5 支持与 GPT-5.4 相同的工具调用模式，包括函数工具和重度依赖工具的 智能体 工作流。将大部分针对具体工具的指导放在工具描述本身中：工具的作用、何时使用、所需输入、副作用、重试安全性以及常见错误模式。仅当某个工具特定上下文跨工具通用或会实质性改变 智能体 的运行策略时，才将其加入系统指令。
- **托管工具和工具搜索：** 优先使用 [OpenAI 托管工具](https://developers.openai.com/api/docs/guides/tools) ，例如 网页搜索、文件搜索、代码解释器、图像生成和计算机使用。当工具与 工作流 契合时使用它们。托管工具可减少自定义编排负担，并使常见工具模式与 Responses API 和 Agents SDK 保持一致。当你需要调用自有系统、强制执行特定领域的副作用，或暴露内部业务工作流时，请使用自定义函数工具。对于大型工具目录，可考虑使用 [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search) 来延迟工具定义，仅加载相关的子集。
- **工具前导说明：** 前导说明可以改善聊天用户体验，因为用户在模型生成最终响应之前会先看到一条有用的状态更新。它们也使工具调用更易于跟踪：模型可以先说明它将要检查或执行的操作，待工具结果返回后，从同一助手状态继续。
- **`phase` 处理：** 如果你的应用通过每轮传回输出项来手动管理 Responses 状态，而不是使用 `previous_response_id`，请保留 `phase` 参数，并将其原样传回。这在使用推理力度、前导内容或重复的工具调用时尤其重要。参见 [Phase 参数](https://developers.openai.com/api/docs/guides/reasoning#phase-parameter).
- **压缩：** 对于长时间运行的智能体，请使用 [conversation/state compaction](https://developers.openai.com/api/docs/guides/compaction) 有选择地进行压缩。保留已完成的操作、当前有效的假设、ID、工具结果、未解决的阻碍以及下一个具体目标。
- **Agents SDK：** 对于新的智能体系统，请使用最新的 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 中的工具编排、追踪、交接和状态管理模式，而不是从零开始重建编排逻辑。
- **当前日期：** GPT-5.5 知晓当前的 UTC 日期。你无需在系统指令中添加当前日期。仅当应用需要业务特定的时区、生效日期、用户本地日期或其他非 UTC 参考点时，才添加明确的日期或时区上下文。

## 提示词最佳实践

GPT-5.5 在提示中明确定义目标，并为模型留出选择高效解决路径的空间时表现最佳。与早期模型相比，你通常可以使用更简短、更面向结果的提示：描述什么是好的结果、哪些约束重要、可以获取哪些证据，以及最终答案应包含哪些内容。

避免从旧的提示堆叠中原样照搬每一条指令。旧版提示常常过度规定流程，因为早期模型需要更多帮助才能保持方向。使用 GPT-5.5 时，这样做会增加噪声、缩小模型的搜索空间，或导致过于机械的回答。

这里的模式只是起点。请根据你的产品界面、工具、评估和用户体验目标进行调整。

### Personality and behavior

GPT-5.5 的默认风格高效、直接且以任务为导向。这对于生产系统非常有用：回复保持聚焦，行为更易于引导，并且模型会避免不必要的对话式冗余。

对于面向客户的助手、支持工作流、教练式体验以及其他对话型产品，需要同时定义其个性和协作风格。

- **Personality** 控制助手的表达风格：语气、亲切度、直接程度、正式程度、幽默感、共情能力以及表达的精致程度。
- **Collaboration style** 控制助手的工作方式：何时提问、何时做出假设、应有多主动、提供多少上下文、何时核对工作，以及如何处理不确定性或风险。

保持两者简短。性格类指令应塑造用户体验，协作类指令应塑造任务行为。两者都不能取代明确的目标、成功标准、工具规则或停止条件。

面向稳定且专注任务的智能体的性格示例块：

```text
# Personality
You are a capable collaborator: approachable, steady, and direct. Assume the user is competent and acting in good faith, and respond with patience, respect, and practical helpfulness.

Prefer making progress over stopping for clarification when the request is already clear enough to attempt. Use context and reasonable assumptions to move forward. Ask for clarification only when the missing information would materially change the answer or create meaningful risk, and keep any question narrow.

Stay concise without becoming curt. Give enough context for the user to understand and trust the answer, then stop. Use examples, comparisons, or simple analogies when they make the point easier to grasp. When correcting the user or disagreeing, be candid but constructive. When an error is pointed out, acknowledge it plainly and focus on fixing it.

Match the user's tone within professional bounds. Avoid emojis and profanity by default, unless the user explicitly asks for that style or has clearly established it as appropriate for the conversation.
```

面向富表现力、协作型智能体的性格示例块：

```text
# Personality
Adopt a vivid conversational presence: intelligent, curious, playful when appropriate, and attentive to the user's thinking. Ask good questions when the problem is blurry, then become decisive once there is enough context.

Be warm, collaborative, and polished. Conversation should feel easy and alive, but not chatty for its own sake. Offer a real point of view rather than merely mirroring the user, while staying responsive to their goals and constraints.

Be thoughtful and grounded when the task calls for synthesis or advice. State a clear recommendation when you have enough context, explain important tradeoffs, and name uncertainty without becoming evasive.
```

对于更具表现力的产品，可以显式加入温暖、好奇、幽默或观点，但请保持该块简短。用性格来塑造体验，而不是用它来弥补目标不清或任务指令缺失。

### 通过前言（preamble）改善首个可见令牌的时间

在流式应用中，用户会注意到在看到首条可见响应之前等待了多长时间。GPT-5.5 可能会在输出可见文本之前花费时间进行推理、规划或准备工具调用。

对于耗时较长或涉及大量工具的任务，可以提示模型以简短的序言开头：先给出一段简短的可见更新，确认请求并说明第一步。这可以在不改变底层任务的前提下改善主观响应速度。

当任务可能需要多个步骤、需要工具调用，或涉及长时间运行的 智能体 工作流 时，使用此模式。

```text
Before any tool calls for a multi-step task, send a short user-visible update that acknowledges the request and states the first step. Keep it to one or two sentences.
```

对于暴露独立消息阶段的编码 智能体，你可以表达得更明确一些：

```text
You must always start with an intermediary update before any content in the analysis channel if the task will require calling tools. The user update should acknowledge the request and explain your first step.
```

### 以结果为导向的提示与停止条件

当提示词明确了目标结果、成功标准、约束条件以及可用的上下文，并让模型自行选择实现路径时，GPT-5.5 的表现最为出色。

对于许多任务，应该描述目标，而不是逐一指定每个步骤。这样可以为模型留出余地，为任务选择合适的搜索、工具或推理策略。

推荐做法：

```text
Resolve the customer's issue end to end.

Success means:
- the eligibility decision is made from the available policy and account data
- any allowed action is completed before responding
- the final answer includes completed_actions, customer_message, and blockers
- if evidence is missing, ask for the smallest missing field
```

**避免不必要的绝对规则。** 较早的提示词经常使用严格的指令，例如 `ALWAYS`, `NEVER`, `must`,以及 `only` 来控制模型行为。仅将这些措辞用于真正的不变条件，例如安全规则、必需的输出字段，或者绝不应发生的操作。对于需要判断的情况，例如何时搜索、何时请求澄清、何时使用工具、何时继续迭代，请改用决策规则。

除非每个步骤都是真正必需的，否则请避免这种指令风格：

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

### 格式化

GPT-5.5 在输出格式与结构上具有高度可引导性。当这种控制力有助于理解或契合产品需求时，请善加利用。

设置 `text.verbosity`，描述期望的输出形态，并将更重的结构保留给有助于理解或你产品 UI 需要稳定产物的场景。该API 对 `text.verbosity` 的默认值 `medium`；为 `low` ；当你希望回复更短、更精炼时使用。

简洁的口语化格式：

```text
Let formatting serve comprehension. Use plain paragraphs as the default format for normal conversation, explanations, reports, documentation, and technical writeups. Keep the presentation clean and readable without making the structure feel heavier than the content.

Use headers, bold text, bullets, and numbered lists sparingly. Reach for them when the user requests them, when the answer needs clear comparison or ranking, or when the information would be harder to scan as prose. Otherwise, favor short paragraphs and natural transitions.

Respect formatting preferences from the user. If they ask for a terse answer, minimal formatting, no bullets, no headers, or a specific structure, follow that preference unless there is a strong reason not to.
```

添加明确的受众与长度要求：

```text
Write for a senior business audience. Keep the answer under 400 words. Use short paragraphs and only include bullets when they improve scannability. Prioritize the conclusion first, then the reasoning, then caveats.
```

对于编辑、改写、摘要或面向客户的消息，在要求模型改进风格之前，先告诉它需要保留哪些内容。当你希望润色而不增加篇幅时，这种模式非常有用。

```text
Preserve the requested artifact, length, structure, and genre first. Quietly improve clarity, flow, and correctness. Do not add new claims, extra sections, or a more promotional tone unless explicitly requested.
```

### Grounding, citations, and retrieval budgets

对于有依据的答案，引文行为应当成为提示的一部分。需要明确定义哪些内容需要支持、什么算作足够的证据，以及当证据缺失时模型应当如何行为。缺乏证据不应自动变成事实性的"否"。如需更多详情与示例，请参阅 [引文格式指南](https://developers.openai.com/api/docs/guides/citation-formatting).

#### 添加明确的检索预算

检索预算是搜索的停止规则。它们告诉模型在何时已有的证据已经足够。

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

对于起草类任务，需要明确告知模型哪些陈述必须来自资料来源，哪些部分可以由其自由创作。这一点对于幻灯片、上线文案、客户摘要、讲解话术、领导寄语以及叙事框架尤为重要。

```text
For creative or generative requests such as slides, leadership blurbs, outbound copy, summaries for sharing, talk tracks, or narrative framing, distinguish source-backed facts from creative wording.

- Use retrieved or provided facts for concrete product, customer, metric, roadmap, date, capability, and competitive claims, and cite those claims.
- Do not invent specific names, first-party data claims, metrics, roadmap status, customer outcomes, or product capabilities to make the draft sound stronger.
- If there is little or no citable support, write a useful generic draft with placeholders or clearly labeled assumptions rather than unsupported specifics.
```

### 前端工程与视觉品味

对于前端工作，请参阅 [示例说明](https://developers.openai.com/api/docs/guides/frontend-prompt) 了解引导 UI 质量的实用方法。这些说明涵盖产品与用户上下文、设计系统一致性、首屏易用性、熟悉的控件、预期状态、响应式行为，以及需要避免的常见生成式 UI 默认设置，例如通用的首屏模块、嵌套卡片、装饰性渐变、可见的引导文案和破损的布局。

### 提示模型检查其工作

让 GPT-5.5 访问能够在可验证时检查输出的工具。

对于编码智能体,请提供具体的验证命令:

```text
After making changes, run the most relevant validation available:
- targeted unit tests for changed behavior
- type checks or lint checks when applicable
- build checks for affected packages
- a minimal smoke test when full validation is too expensive

If validation cannot be run, explain why and describe the next best check.
```

对于可视化产物,请在渲染后要求进行检查:

```text
Render the artifact before finalizing. Inspect the rendered output for layout, clipping, spacing, missing content, and visual consistency. Revise until the rendered output matches the requirements.
```

对于工程和规划任务,使实现计划可追溯:

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

从 GPT-5.4 开始，运行时间较长或工具密集型的 Responses 工作流可以使用 assistant-item `phase` 取值来区分中间更新和最终回答。GPT-5.5 使用相同的模式。

如果你使用 `previous_response_id`，API 会自动保留先前的 assistant 状态。如果你的应用需要在下一个请求中手动重放 assistant 输出项，请保留每个原始 `phase` 取值并原样回传。当响应包含开场白、重复的工具调用，或在中间 assistant 更新之后的最终回答时，这一点最为重要。

```text
If manually replaying assistant items:
- Preserve assistant `phase` values exactly.
- Use `phase: "commentary"` for intermediate user-visible updates.
- Use `phase: "final_answer"` for the completed answer.
- Do not add `phase` to user messages.
```

### 建议的提示词结构

可以将此结构作为复杂提示的起点。保持每个部分简短，仅在会改变行为的地方补充细节。

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