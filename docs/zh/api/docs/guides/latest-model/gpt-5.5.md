# 使用 GPT-5.5

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 简介

GPT-5.5 提升了复杂生产工作流的基线。它非常适合编码用例、大量使用工具的智能体、有依据的助手、长上下文检索、产品规格到计划的转换工作流，以及执行质量和回复润色至关重要的面向客户的工作流。

要充分利用 GPT-5.5，请将其视为需要调优的新模型系列，而不是 `gpt-5.2` 或 `gpt-5.4`。的即插即用替代品。开始迁移时，请使用全新的基线，而不是照搬旧提示词堆栈中的所有指令。从能保持产品契约的最小提示词开始，然后根据代表性示例调整推理力度、详细程度、工具描述和输出格式。

GPT-5.5 支持 GPT-5.4 已经提供的所有 API 功能，包括 [提示词缓存](https://developers.openai.com/api/docs/guides/prompt-caching), [托管工具](https://developers.openai.com/api/docs/guides/tools#available-tools), [工具搜索](https://developers.openai.com/api/docs/guides/tools-tool-search), [压缩](https://developers.openai.com/api/docs/guides/compaction)，以及 `phase` 手动重放助手项目的处理。

参见 [提示词最佳实践](#prompting-best-practices) ，了解成功提示词模式的示例。

## 新增内容

- **更高效的推理：** GPT-5.5 在更少的推理 token 下即可达到更强的结果，即便在相同的推理力度下也是如此。这在复杂、工具密集或多步骤工作流中尤为有用，因为 token 节省会累积。
- **更强的任务执行能力，配合结果优先的提示词：** GPT-5.5 更擅长从明确目标出发、保留约束，并将产品意图转化为具体的下一步行动。请描述预期结果、成功标准、允许的副作用、证据规则和输出格式。除非具体路径很重要，否则避免逐步过程指导。
- **更强更精确的工具使用：** GPT-5.5 在大型工具集、多步骤服务工作流和长时间运行的智能体任务中尤其有用。它在工具选择和参数使用上往往更加精确。
- **语气通常更优雅，但可能更直接：** GPT-5.5 往往能以更少的提示词脚手架产生更温暖、更易读的答案。

## 行为变更

1. **推理努力现在默认为 `medium`:** GPT-5.5 默认使用 `medium` 推理努力。将 `medium` 视为在质量、可靠性、延迟和成本方面推荐的平衡起点。对于延迟敏感的工作流，评估 `low` 之前， `none` 当工具使用、规划、搜索或多步骤决策仍然重要时。保留 `none` 用于不需要推理或多链工具调用的延迟关键任务，例如轻量级语音回合、快速信息检索和分类。增加到 `high` 或 `xhigh` 仅当评估显示可测量的质量提升，且证明额外的延迟和成本是合理的。参见 [推理模型文档](https://developers.openai.com/api/docs/guides/reasoning) 以获取推荐设置的更多详细信息。

   更高的推理努力并不自动更好。如果任务有冲突的指令、较弱的停止标准或开放式的工具访问，更高的努力可能导致过度思考、不必要的搜索或输出质量下降。仅在评估显示可测量的质量提升时才增加努力。

2. **图像输入默认保留更多视觉细节：** GPT-5.5 更新了图像输入的默认处理方式，以保留更多视觉细节并提升计算机使用性能。当 `image_detail` 未设置或设置为 `auto`，时，模型现在使用 `original` 行为，在不调整大小的情况下保留图像，最高可达 10,240,000 像素或 6,000 像素的尺寸限制。对于 `high`，直接指定值；它会在不调整大小的情况下保留图像，最高可达 2,500,000 像素或 2,048 像素的尺寸限制。 `low` 现在专注于上下文效率，并比之前的模型更积极地调整超过 512 像素尺寸限制的图像大小。参见 [图像和视觉文档](https://developers.openai.com/api/docs/guides/images-vision).

3. **改进的指令遵循：** GPT-5.5 以字面和彻底的方式解读提示，使产品需要时能够提供具体、描述性的指令。定义成功标准和停止规则，尤其是对于长时间运行、工具密集型或收集证据的工作流。请参阅 [以结果为导向的提示编写](#outcome-first-prompts-and-stopping-conditions) 和 [保持适当的特异性](#formatting).

4. **默认风格更简洁直接：** GPT-5.5 默认倾向于高效、直接且以任务为导向。这对于许多生产工作流很有用，但面向客户或对话式体验可能需要明确的人格、温暖度、理由和格式指导。使用 `text.verbosity` 要有意识： `medium` 是默认选项，而 `low` 通常是获得简洁响应的更好起点。请参阅 [提示最佳实践](#prompting-best-practices).

5. **编码工作流需要更强的编排：** GPT-5.5 更适合需要规划、工具使用、代码库导航、验证和多步骤执行的复杂编码任务。对于编码 智能体，要明确复用、子智能体委派、测试期望、验收标准，以及何时继续与何时寻求帮助。

## 迁移快速入门

### 使用 Codex 自动迁移

Codex 可以应用本指南中推荐的更改，配合 [OpenAI Docs 技能](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

```text
$openai-docs migrate this project to gpt-5.5
```

要在其他编码 智能体中使用此技能，请从以下位置下载： [OpenAI 技能仓库](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

### API 与模型参数

- 将模型 slug 更新为 `gpt-5.5`.
- 对于任何推理、工具调用或多轮用例，请使用 Responses API。
- 调整 `reasoning.effort`。使用 `low` 实现高效推理， `medium` 用于在延迟/性能曲线上取得平衡点， `high` 用于需要硬推理且延迟不太重要的复杂智能体任务，以及 `xhigh` 用于最困难的异步智能体任务或测试模型智能极限的评估。请参阅 [推理模型文档](https://developers.openai.com/api/docs/guides/reasoning).
- 要配置更简洁的响应，请将 `text.verbosity` 设置为 `low`。在 GPT-5.5 上，这将比 `low` GPT-5.4 的冗长程度产生成比例地更简洁的响应。
- 对于工具密集型或长时间运行的工作流，请验证你的应用程序是否正确处理 `phase`、前言和助手条目重放。
- 在准确性、令牌消耗和端到端延迟方面与其他模型进行基准测试。

### 提示词

- 说明预期结果和成功标准。
- 减少或移除详细的分步过程指导。除非产品要求特定路径，否则让 GPT-5.5 自行选择路径。
- 尽可能从提示中移除输出模式定义。改为使用 [结构化输出](https://developers.openai.com/api/docs/guides/structured-outputs) 。
- 针对缓存优化你的提示： [静态部分前置，动态部分后置](https://developers.openai.com/api/docs/guides/prompt-caching).
- 移除当前日期。模型已经知道当前的 UTC 日期。
- 使用以下内容审查并优化你的提示： [提示最佳实践](#prompting-best-practices).

## 使用推理模型

本指导适用于 GPT-5 系列模型，当团队将工作负载迁移到推理模型上时值得重新审视。GPT-5.5 延续了许多早期模型中首次出现的功能，但如果你从较早的 GPT-5 模型、GPT-4.1 或诸如 o3 的推理模型迁移过来，这些功能仍然值得回顾。

团队可能会忽略这些功能，因为它们部分位于 API 配置和编排中，而非提示本身。结合使用 Responses API、推理控制、详细程度、结构化输出、提示缓存、工具设计、托管工具和状态管理，可帮助推理模型实现最佳的智能、可靠性、延迟和成本表现。

- **Responses API：** GPT-5.5 在 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses)。中表现最佳。使用 `previous_response_id` 处理多轮状态。对于无状态或零数据保留流程，每轮传递返回的相关输出项。参见 [从上一响应传递上下文](https://developers.openai.com/api/docs/guides/conversation-state#passing-context-from-the-previous-response) 了解详情。
- **推理努力：** 使用 `reasoning.effort` 在 `low`, `medium`, `high`、或 `xhigh`。之间选择。默认值为 `medium`，但许多工作负载使用 `low`。也能表现良好。将 `none` 保留给低延迟比智能更重要的用例。参见 [推理模型](https://developers.openai.com/api/docs/guides/reasoning) 获取详细建议。
- **详细程度：** 使用 `text.verbosity` 控制输出长度。将最终答案的长度视为与推理质量无关；在需要时指定字数预算、章节数量、表格宽度或仅 JSON 输出。
- **结构化输出：** 避免在提示中描述预期的输出模式。使用 [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) 进行自动验证并提高准确性。
- **提示缓存：** [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) 会自动对符合条件的长提示生效，并可以降低延迟和输入 token 成本。为了最大化缓存命中率，请在请求开头保持稳定的内容。将动态的、特定于用户的内容放在接近末尾处。对于具有常见前缀的重复流量，请始终使用 `prompt_cache_key` 并跟踪 `usage.prompt_tokens_details.cached_tokens`.
- **工具调用：** GPT-5.5 支持与 GPT-5.4 相同的工具调用模式，包括函数工具和大量使用工具的智能体工作流。将大部分特定于工具的指导放在工具描述本身中：工具的作用、何时使用它、所需输入、副作用、重试安全性和常见错误模式。仅当工具特定的上下文适用于所有工具或实质性改变智能体的操作策略时，才将其添加到系统指令中。
- **托管工具和工具搜索：** 优先使用 [OpenAI 托管的工具](https://developers.openai.com/api/docs/guides/tools) 适用于符合工作流的场景，例如网页搜索、文件搜索、代码解释器、图像生成和计算机使用。托管工具减少自定义编排负担，并使常见工具模式与Responses API和Agents SDK保持一致。当您需要调用自己的系统、强制执行特定领域的副作用或暴露内部业务工作流时，请使用自定义函数工具。对于大型工具目录，请考虑使用 [tool search](https://developers.openai.com/api/docs/guides/tools-tool-search) 以延迟工具定义并仅加载相关子集。
- **工具前言：** 前言可以改善聊天用户体验，因为用户在模型生成最终响应之前会看到初始的、有用的状态更新。它们还使工具的使用更容易理解：模型可以说明它将要检查或做什么，然后在工具结果到达后从同一助手状态继续。
- **`phase` 处理：** 如果您的应用程序手动管理 Responses 状态，通过将输出项传递回每一轮，而不是使用 `previous_response_id`，请保留 `phase` 返回的助手输出项上的参数，并原样传回。在使用推理努力、前言或重复工具调用时，这一点尤其重要。参见 [Phase 参数](https://developers.openai.com/api/docs/guides/reasoning#phase-parameter).
- **压缩：** 对于长时间运行的智能体，请使用 [对话/状态压缩](https://developers.openai.com/api/docs/guides/compaction) 有意识地。保留已完成的动作、活跃的假设、ID、工具结果、未解决的阻碍因素以及下一个具体目标。
- **Agents SDK：** 对于新的智能体系统，请使用最新的 [Agents SDK](https://developers.openai.com/api/docs/guides/agents) 模式来处理工具编排、追踪、交接和状态管理，而不是从头重建编排。
- **当前日期：** GPT-5.5 知道 UTC 的当前日期。你无需在系统指令中添加当前日期。仅在应用需要业务特定的时区、政策生效日期、用户本地日期或其他非 UTC 参考点时，才添加明确的日期或时区上下文。

## 提示词最佳实践

当提示词定义好预期结果并为模型留出选择高效解决方案路径的空间时，GPT-5.5 表现最佳。与早期模型相比，你通常可以使用更简短、更以结果为导向的提示词：描述理想结果的样子、哪些约束条件重要、有哪些可用证据，以及最终答案应包含什么。

避免沿用旧提示词堆栈中的每一条指令。传统提示词往往过度指定流程，因为早期模型需要更多帮助才能保持在正轨上。对于 GPT-5.5，这可能会增加干扰、缩小模型的搜索空间，或导致过于机械的回答。

这里的模式是起点。根据你的产品界面、工具、评估和用户体验目标进行调整。

### 个性与行为

GPT-5.5 的默认风格高效、直接且以任务为导向。这对生产系统很有用：响应保持聚焦，行为更易引导，模型会避免不必要的对话填充。

对于面向客户的助手、支持工作流、辅导体验和其他对话型产品，既要定义个性，也要定义协作风格。

- **个性** 控制助手的声音表现：语气、温暖度、直接程度、正式程度、幽默感、共情能力以及精细程度。
- **协作风格** 控制助手的工作方式：何时提问、何时做出假设、应多主动、提供多少上下文、何时检查工作，以及如何处理不确定性或风险。

两者都应保持简短。个性指令应塑造用户体验。协作指令应塑造任务行为。两者都不应取代明确的目标、成功标准、工具规则或停止条件。

稳定的任务导向型助手的个性块示例：

```text
# Personality
You are a capable collaborator: approachable, steady, and direct. Assume the user is competent and acting in good faith, and respond with patience, respect, and practical helpfulness.

Prefer making progress over stopping for clarification when the request is already clear enough to attempt. Use context and reasonable assumptions to move forward. Ask for clarification only when the missing information would materially change the answer or create meaningful risk, and keep any question narrow.

Stay concise without becoming curt. Give enough context for the user to understand and trust the answer, then stop. Use examples, comparisons, or simple analogies when they make the point easier to grasp. When correcting the user or disagreeing, be candid but constructive. When an error is pointed out, acknowledge it plainly and focus on fixing it.

Match the user's tone within professional bounds. Avoid emojis and profanity by default, unless the user explicitly asks for that style or has clearly established it as appropriate for the conversation.
```

富有表现力的协作助手的个性块示例：

```text
# Personality
Adopt a vivid conversational presence: intelligent, curious, playful when appropriate, and attentive to the user's thinking. Ask good questions when the problem is blurry, then become decisive once there is enough context.

Be warm, collaborative, and polished. Conversation should feel easy and alive, but not chatty for its own sake. Offer a real point of view rather than merely mirroring the user, while staying responsive to their goals and constraints.

Be thoughtful and grounded when the task calls for synthesis or advice. State a clear recommendation when you have enough context, explain important tradeoffs, and name uncertainty without becoming evasive.
```

对于更具表现力的产品，明确加入温暖、好奇、幽默或观点，但保持块简短。使用个性来塑造体验，而不是弥补不清晰的目标或缺失的任务说明。

### 使用前导内容缩短首个可见令牌的时间

在流式应用中，用户会关注第一个可见响应出现前需要多长时间。GPT-5.5 在输出可见文本之前，可能会花时间进行推理、规划或准备工具调用。

对于较长的任务或工具密集型任务，提示模型以简短的前言开始：一段简短的可见更新，确认请求并说明第一步。这可以在不改变底层任务的情况下提升可感知的响应速度。

当任务可能需要多个步骤、需要调用工具，或涉及长时间运行的智能体 工作流时，使用此模式。

```text
Before any tool calls for a multi-step task, send a short user-visible update that acknowledges the request and states the first step. Keep it to one or two sentences.
```

对于暴露独立消息阶段的编码智能体，你可以更明确地表述：

```text
You must always start with an intermediary update before any content in the analysis channel if the task will require calling tools. The user update should acknowledge the request and explain your first step.
```

### 结果优先的提示词与停止条件

当提示词定义了目标结果、成功标准、约束条件和可用上下文，然后让模型自行选择路径时，GPT-5.5 的表现最为强劲。

对于许多任务，描述目标而非每一步。这能让模型有空间为任务选择正确的搜索、工具或推理策略。

推荐这样写：

```text
Resolve the customer's issue end to end.

Success means:
- the eligibility decision is made from the available policy and account data
- any allowed action is completed before responding
- the final answer includes completed_actions, customer_message, and blockers
- if evidence is missing, ask for the smallest missing field
```

**避免不必要的绝对规则。** 较旧的提示词常使用严格指令，如 `ALWAYS`, `NEVER`, `must`，以及 `only` 来控制模型行为。仅在真正的不可变项上使用这些措辞，例如安全规则、必填输出字段或绝不应发生的操作。对于需要判断的情况，例如何时搜索、请求澄清、使用工具或继续迭代，优先使用决策规则。

除非每一步都确实必要，否则避免这种风格的指令：

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

定义缺少证据时的行为：

```text
Use the minimum evidence sufficient to answer correctly, cite it precisely, then stop.
```

### 格式化

GPT-5.5 在输出格式和结构上具有很强的可引导性。当它有助于提升理解或产品契合度时，请利用这种控制。

设置 `text.verbosity`，描述预期的输出形状，并将较重的结构保留用于能提升理解或你的产品 UI 需要稳定产物的情况。API 的默认 `text.verbosity` 是 `medium`；使用 `low` 当你偏好更短、更简洁的响应时。

纯对话式格式：

```text
Let formatting serve comprehension. Use plain paragraphs as the default format for normal conversation, explanations, reports, documentation, and technical writeups. Keep the presentation clean and readable without making the structure feel heavier than the content.

Use headers, bold text, bullets, and numbered lists sparingly. Reach for them when the user requests them, when the answer needs clear comparison or ranking, or when the information would be harder to scan as prose. Otherwise, favor short paragraphs and natural transitions.

Respect formatting preferences from the user. If they ask for a terse answer, minimal formatting, no bullets, no headers, or a specific structure, follow that preference unless there is a strong reason not to.
```

添加明确的受众和长度指导：

```text
Write for a senior business audience. Keep the answer under 400 words. Use short paragraphs and only include bullets when they improve scannability. Prioritize the conclusion first, then the reasoning, then caveats.
```

对于编辑、重写、摘要或面向客户的讯息，在要求模型改进风格之前，先告诉模型要保留什么。当你希望润色而不扩充内容时，此模式很有用。

```text
Preserve the requested artifact, length, structure, and genre first. Quietly improve clarity, flow, and correctness. Do not add new claims, extra sections, or a more promotional tone unless explicitly requested.
```

### 基础支撑、引用与检索预算

对于有依据的答案，引用行为应作为提示词的一部分。应明确哪些内容需要支持、什么才算充分证据，以及当证据缺失时模型应如何表现。证据缺失不应自动变成事实性的“不是”。有关更多细节和示例，请参阅 [引用格式指南](https://developers.openai.com/api/docs/guides/citation-formatting).

#### 添加显式检索预算

检索预算（retrieval budgets）是搜索的停止规则。它们告诉模型何时收集到的证据已经足够。

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

对于起草任务，需告知模型哪些论断必须来源于资料，哪些部分可以自由创作。这一点对幻灯片、发布文案、客户摘要、演讲稿、领导层简介以及叙事框架尤为重要。

```text
For creative or generative requests such as slides, leadership blurbs, outbound copy, summaries for sharing, talk tracks, or narrative framing, distinguish source-backed facts from creative wording.

- Use retrieved or provided facts for concrete product, customer, metric, roadmap, date, capability, and competitive claims, and cite those claims.
- Do not invent specific names, first-party data claims, metrics, roadmap status, customer outcomes, or product capabilities to make the draft sound stronger.
- If there is little or no citable support, write a useful generic draft with placeholders or clearly labeled assumptions rather than unsupported specifics.
```

### 前端工程与视觉品味

对于前端工作，请参考 [示例指令](https://developers.openai.com/api/docs/guides/frontend-prompt) 以获取引导 UI 质量的实用方法。这些指令涵盖产品和用户上下文、设计系统对齐、首屏可用性、熟悉控件、预期状态、响应式行为，以及应避免的常见生成式 UI 默认设置，例如通用英雄区、嵌套卡片、装饰性渐变、可见的说明性文字和布局破损。

### 提示模型检查其工作

在可以进行验证时，给 GPT-5.5 提供可让其检查输出的工具。

对于编码智能体，要求提供具体的验证命令：

```text
After making changes, run the most relevant validation available:
- targeted unit tests for changed behavior
- type checks or lint checks when applicable
- build checks for affected packages
- a minimal smoke test when full validation is too expensive

If validation cannot be run, explain why and describe the next best check.
```

对于视觉产物，要求渲染后进行审查：

```text
Render the artifact before finalizing. Inspect the rendered output for layout, clipping, spacing, missing content, and visual consistency. Revise until the rendered output matches the requirements.
```

对于工程和规划任务，使实施计划可追踪：

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

### 阶段参数

从 GPT-5.4 开始，长时间运行或工具密集型的 Responses 工作流可以使用助手项 `phase` 值来区分中间更新与最终答案。GPT-5.5 使用相同的模式。

如果你使用 `previous_response_id`，API会自动保留先前的助手状态。如果你的应用手动将助手输出项重放到下一个请求中，请保留每个原始的 `phase` 值并将其原样传回。当响应包含前言、重复的工具调用或中间助手更新后的最终答案时，这一点最为重要。

```text
If manually replaying assistant items:
- Preserve assistant `phase` values exactly.
- Use `phase: "commentary"` for intermediate user-visible updates.
- Use `phase: "final_answer"` for the completed answer.
- Do not add `phase` to user messages.
```

### 建议的提示词结构

将这一结构作为复杂提示词的起点。保持每个部分简短。仅在影响行为的地方添加细节。

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