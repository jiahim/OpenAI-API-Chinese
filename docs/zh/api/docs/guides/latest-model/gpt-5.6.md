---
latestModelInfo:
  model: gpt-5.6-sol
  migrationGuide: /api/docs/guides/upgrading-to-gpt-5p6-sol.md
  promptingGuide: /api/docs/guides/prompt-guidance-gpt-5p6.md
---

# 使用 GPT-5.6

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 简介

GPT-5.6 为复杂生产工作流树立了全新的质量和效率基准。GPT-5.6 特别节省 token，并提升了前端美学，包括布局、视觉层次和设计判断力。

GPT-5.6 还引入了新的命名方案。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`，这是旗舰能力的模型。使用 `gpt-5.6-terra` 以更低的价格获得强劲性能， `gpt-5.6-luna` 用于高效、大规模的工作负载。

从 GPT-5.5 或 GPT-5.4 迁移时，从你当前的 GPT-5.5 或 GPT-5.4 推理设置开始，然后在代表性任务上测试相同的设置和低一级的设置。GPT-5.6 通常能用更少的 token 维持或提升质量，但最佳设置取决于你的工作负载。

## 新增内容

- **程序化工具调用：** GPT-5.6 可以编写 JavaScript 来调用符合条件的工具，在调用之间传递结果，并在托管运行时中处理中间输出。使用 [程序化工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) 适用于有界的、工具密集型的工作流，这些工作流在每个步骤之间不需要新的模型判断。程序化工具调用兼容 ZDR，且不会产生额外的容器费用。
- **Multi-智能体 [测试版]：** [Multi-智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 让一个 GPT-5.6 实例并行协调多个子智能体，并综合它们的结果。类似于 Codex 中的 ultra 模式，这可以缩短实际运行时间，并提升可清晰拆分为独立工作流的复杂任务的性能。Multi-智能体 在 Responses API 中作为测试版功能提供，以便我们根据开发者反馈持续迭代。
- **显式提示缓存：** GPT-5.6 允许你精确标记哪些可复用的提示前缀会由 OpenAI 进行缓存。你仍可以在隐式模式下使用自动缓存。OpenAI 对缓存写入按未缓存输入价格的 1.25 倍计费，而缓存读取仍享受折扣。了解如何 [配置提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching).
- **持久化推理：** GPT-5.6 可以在多轮之间复用可用的推理项，以提升多轮质量并提高缓存效率。使用 `reasoning.context` 来选择行为。了解如何 [跨调用保留推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls).
- **最大推理努力程度：** GPT-5.6 支持 `max` 针对需要更多探索和验证的高难度任务的推理努力程度。如果你当前使用 `xhigh`，请在具有代表性的工作负载上对两种设置进行比较。
- **Pro 模式：** GPT-5.6 可以执行更多模型工作，以提升困难任务的可靠性，并返回单个最终答案。通过 `reasoning.mode: "pro"` 当质量比延迟和 token 用量更重要时。了解如何使用 [使用 pro 模式](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).
- **Token 效率：** GPT-5.6 以更少的输出 token 达到前沿性能。
- **前端设计：** GPT-5.6 能创建更精致、更实用的网站和应用，在布局、视觉层次和设计判断方面表现更强。
- **意图理解：** GPT-5.6 能够更好地从上下文推断用户的潜在目标和预期的工作深度，因此你通常无需规定每个步骤。请继续提供领域上下文、硬性约束、审批边界和成功标准。当出现重要歧义需要追问时，请明确告知模型。
- **原始图像细节：** GPT-5.6 会保留随 `original` 或 `auto` 发送的图像的原始尺寸细节，而不是将它们压缩到某个 patch 预算或像素尺寸上限。较大的图像会消耗更多输入 token 并增加延迟。了解如何 [选择图像细节等级](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level).

## 安全防护

使用 GPT-5.6 模型时，用户可能会遇到一些安全防护措施，它们会拦截或拒绝部分请求，因为会在模型输出生成时运行实时网络与生物风险滥用分类器。还有一些请求可能耗时更长，因为生成过程会在中途暂停数秒，以便这些分类器同步审查输出。安全防护措施偶尔也会干预合法的工作，尤其是在防御性与攻击性活动初期表现相似的双重用途领域。

如果你的应用面向最终个人用户，请在每个请求中附带一个稳定且保护隐私的 `safety_identifier` 。详见 [实施安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) 获取指引。

我们持续迭代这些安全防护措施，使其在面对对抗性压力时依然稳健有效，同时保留对合法工作的访问，例如代码审查、漏洞研究、补丁开发、调试、安全教育以及防御性测试。





## 迁移快速入门

### 使用 Codex 进行迁移

Codex 可以按照本指南中的建议进行更改，方法是使用 [OpenAI Docs 技能](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

```text
$openai-docs migrate this project to the GPT-5.6 model family
```

如需在其他编码智能体中使用此技能，请从 [OpenAI skills 仓库](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

### 更新 API 和模型参数

- 为工作负载选择目标模型。可使用 `gpt-5.6-sol` 以获得前沿能力， `gpt-5.6-terra` 以兼顾智能与成本，或 `gpt-5.6-luna` 用于高效的高吞吐量工作负载。 `gpt-5.6` 别名会将请求路由到 `gpt-5.6-sol`.
- 使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 以进行推理、工具调用和多轮工作流。
- 设置 `reasoning.effort` 时请有意识地选择。GPT-5.6 支持 `none`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
  - 如果你正在从 GPT-5.5 或 GPT-5.4 迁移，请保留当前的推理力度作为基线，然后与低一级进行比较。
  - 如果你使用 `none`，请将其作为延迟基线保留，并同时测试 `low` ，当工作流受益于推理或工具使用时。
  - 使用 `medium` 作为均衡的起点，并 `low` 用于对延迟敏感的工作负载。
  - 使用 `high` 或 `xhigh` ，当更多推理带来可衡量的质量提升时。
  - 保留 `max` 用于对质量要求最高的工作负载。比较 `max` 和 `xhigh` 以找到最适合你用例的质量、延迟和成本权衡。
- 要使用 pro 模式，请保留你选择的 GPT-5.6 模型，并将 `reasoning.mode` 设置为 `pro` ，应用于 Responses API；不要切换到单独的 Pro 模型 slug。选择 `reasoning.effort` 是独立的。如果省略它，GPT-5.6 在标准模式和 pro 模式下都将默认为 `medium` 。参见 [reasoning mode](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 获取请求示例和计费详情。
- 根据先前推理仍然相关的程度，配置持久化推理。GPT-5.6 模型默认为 `all_turns`；早期模型默认为 `current_turn`.
  - 省略 `reasoning.context` 或将其设置为 `auto` 以使用 `all_turns`，即 GPT-5.6 的默认值。检查响应中的 `reasoning.context` 字段以确认实际生效的模式。
  - 设置 `reasoning.context` 设置为 `all_turns` 在任务的目标、假设和优先级在各轮中保持稳定时使用。
  - 使用 `all_turns`，时，使用 `previous_response_id` 以使模型能够使用先前响应的推理内容。
  - 在手动管理历史记录时，保留并重新发送之前的用户输入和每个响应输出项。对于 `store: false` 或零数据保留，重放 API 默认返回的加密推理项。
  - 设置 `reasoning.context` 设置为 `current_turn` 当先前的推理不再相关时。
- 查看提示缓存。你无需更改代码即可继续使用隐式缓存。由于 GPT-5.6 缓存写入的成本是未缓存输入的 1.25 倍，请跟踪 `cached_tokens` 和 `cache_write_tokens` 以了解净成本。使用显式断点或 `prompt_cache_options.mode: "explicit"` 以避免不必要的写入，并将 `prompt_cache_retention` 替换为 `prompt_cache_options.ttl`.
- 要使用程序化工具调用，请添加 `programmatic_tool_calling` 工具并通过 `allowed_callers`。启用符合条件的工具。更新你的应用以处理 `program` 项、程序发出的函数调用，以及 `program_output` 项，同时保留每次调用的 `call_id` 和 `caller` 关联。参阅 [程序化工具调用指南](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) 中的请求和 延续 示例。
  - 在具有代表性的任务上对启用 PTC 的 工作流 进行基准测试。比较任务成功率、最终答案的完整性、所需证据、总令牌数、延迟和成本。只有在最终答案仍能达到所需质量标准时，更少的调用次数、轮次或中间输出才算改进。

## 提示词最佳实践

### 优先使用精简的提示词

去除重复的指令和示例，并精简工具描述，可以提升任务表现与 token 使用效率。在一组内部编程智能体评测运行中，使用更精简系统提示的配置，将评测分数提升了约 10–15%，同时将总 token 减少 41–66%，成本降低 33–67%。实际结果会因工作负载而异，因此请将这些范围视为方向性参考，并针对你自己应用中的代表性任务对改动进行验证。

若要在不丢失重要指引的前提下精简提示：

- 从一组已经可用的提示词和工具集开始。每次移除一组指令、示例或工具，然后重新运行相同的评估。
- 每条指令只写一次。
- 仅暴露与任务相关的工具，并保持其描述简洁而准确。
- 当示例和风格指导承载了产品需求或修正了已测得的差距时，予以保留。
- 在运行开始时以及对话推进过程中都追踪上下文。较长的会话可能会放大重复的提示词和工具内容。

### 定义自主性与审批边界

GPT-5.6 在执行多步任务时可以主动且持续地推进。为每个请求明确授权的行动范围，让模型能够在安全、符合范围的作业中持续推进，而无需不必要地暂停，并在涉及外部、破坏性、高成本或超出范围的操作之前及时停止。

一段简洁的策略通常就足够：

```text
For requests to answer, explain, review, diagnose, or plan, inspect the relevant
materials and report the result. Do not implement changes unless the request also
asks for them.

For requests to change, build, or fix, make the requested in-scope local changes
and run relevant non-destructive validation without asking first.

Require confirmation for external writes, destructive actions, purchases, or a
material expansion of scope.
```

明确列出安全的本地操作，例如读取文件、检查日志、修改范围内的代码以及运行测试。将策略集中在一处，每条规则只写一次。诸如“先询问”“不要变更”“等待批准”等重复性指令，可能导致模型对安全且符合预期的操作提出不必要的审批请求。

### 设置回复长度与风格

GPT-5.6 默认情况下往往比 GPT-5.5 更简洁。在迁移时，请检查诸如“Be concise”或“Keep it short”这类广泛的简洁性指令是否仍然有用。对于某些任务而言，它们可能是不必要的，有时还会让回复过于简短。当这些指令能够稳定生成你应用所需的输出时，请保留它们。

若要在不同请求中获得更一致的控制，请使用 `text.verbosity` 来设置默认的详细程度，然后使用提示来满足任务特定的要求。

#### 设置默认值 `text.verbosity`

选择 `low`, `medium`，或 `high` 作为请求的默认详细程度。在提示中指定任何任务特定的长度、结构或必需的内容。请参阅 [设置 `text.verbosity`](https://developers.openai.com/api/docs/guides/deployment-checklist#set-up-textverbosity) 以获取API示例。

#### 指定简短回答必须包含的内容

当任务要求给出更简短的答复时，需识别模型必须保留的信息以及可以省略的细节。例如：

```text
Lead with the conclusion. Include the evidence needed to support it, any material
caveat, and the next action. Omit secondary detail and repetition.

Keep all required facts, decisions, caveats, and next steps. Trim introductions,
repetition, generic reassurance, and optional background first.
```

这为模型设定了一个明确的优先级顺序：先保留完成任务所需的内容，再删去价值较低的细节。

#### 定义语气

像“友好”或“共情”这样宽泛的标签可能会产生歧义。请描述定义你产品语气风格的写作选择，例如陈述答案的直接程度、何时承认问题，以及是否适合进行安抚或结束语。

```text
State the answer directly. If the user reports a problem, acknowledge the
specific issue before giving the next step. Use reassurance only when it is
relevant. Omit generic praise and unnecessary sign-offs.
```

### Pro 模式

#### 在质量最为重要时选择 pro 模式

Pro 模式是一种 Responses API 执行模式，它会在返回单个最终答案之前对请求投入更多的模型工作。它可以提高困难任务的可靠性，但会增加延迟，并在上报的使用量中汇总这些工作所产生的 token。这些 token 按所选模型的标准 token 费率计费。

当边际质量提升会对结果产生实质性影响，且任务足够困难、能够从中受益时（例如复杂的优化、高价值的编码或评审，或具有明确评估标准的深度分析），请使用 pro 模式。对于例行的、对延迟敏感或高吞吐量工作，以及当你的评估未显示 pro 模式带来显著收益时，请优先使用标准模式。

推理模式和推理努力程度是相互独立的。Pro 模式适用于任何 GPT-5.6 模型及其支持的推理努力程度。请从与你的标准模式基线相同的模型和努力程度开始，然后在具有代表性的任务上比较配置，而不是假设最高的努力程度始终是最佳权衡。

#### 在 API 中配置 pro 模式

在 API 请求中启用 pro 模式。沿用你在标准模式下使用的同一个面向结果的提示词：说明目标、相关上下文、约束条件、所需证据、成功标准以及输出格式。你无需要求模型“使用 pro 模式”、“更深入思考”或生成多个候选答案。

例如：

```text
Review this database migration plan for failure modes that could cause data loss
or extended downtime. For each finding, cite the relevant step, estimate impact
and likelihood, and recommend a specific mitigation. Return the five most
important risks in severity order.
```

#### 对比质量与成本

在相同的代表性任务上对比 standard 与 pro 模式。衡量任务成功率、回答完整性、所需证据、总 token 数、延迟和成本。在 pro 模式带来的质量或可靠性提升值得额外模型开销的场景中选择性地使用 pro 模式。

请参阅 [推理模式指南](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).

### Programmatic Tool Calling

#### 按任务形态选择 Programmatic Tool Calling

程序化工具调用（Programmatic Tool Calling，PTC）最适合用于有界的工作流，其中代码可以处理多个工具结果或较大的中间输出，并返回一个更小的结构化结果。可将其用于过滤、连接、排序、去重、聚合、校验或其他可预测的处理。

仅仅因为存在多个、并行或存在依赖关系的调用，并不足以使用程序化工具调用。在以下情况下，优先选择直接的、非 PTC 的工具调用：

- 单次调用即可完成
- 中间输出已经足够小
- 每个结果都可能改变模型的下一个决策
- 某个动作需要获得批准
- 最终输出必须保留引用或原生制品

#### Make routing instructions task-specific

不要依赖工具可用性或诸如“高效地使用程序化工具调用”这类通用指令来生成正确的路由。当直接调用和程序化调用都可用时，请明确说明：

- 哪个有界阶段应该使用程序化工具调用。
- 它可以调用哪些工具。
- 确切的输出模式以及所需的证据。
- 并发、重试和停止限制。
- 哪些工作应该保持直接执行。

工具说明应记录预期的返回字段、类型和错误行为。如果模型在编写程序之前无法确定返回结构，应优先直接调用工具，以便在决定如何使用结果之前先检查结果。

如果需要使用两条路径，请定义一个清晰的交接，并告知模型不要切换路径或重复已完成的工作。

例如：

```text
<tool_orchestration>
Use Programmatic Tool Calling for [bounded stage] using only [eligible tools].
Run independent calls concurrently when safe. Use only documented tool input
and output fields.

Process and reduce the intermediate results, then emit exactly [output schema],
including the evidence needed for the final answer.

Stop when [condition] is met. Retry transient failures at most [R] times.
Do not repeat completed calls or perform side-effecting actions. If a required
result is still missing, return a clear structured failure.

Use direct tool calls for [semantic judgment, approval, or final validation].
</tool_orchestration>
```

#### 评估最终答案

该 `program_output` item 和最终助手 `message` 输出是分开的；务必对两者都进行测试。理论上，程序可以返回正确的记录，而消息遗漏了必填字段、引用或注意事项。

在相同的代表性任务上比较直接调用和程序化调用。检查最终响应是否正确、完整，并包含所需的证据。然后比较总 token 数、延迟、成本、调用次数、轮次和重试次数。只有在响应仍能通过你现有的评估时，才能将更低的资源使用视为改进。

请参阅 [程序化工具调用指南](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling).