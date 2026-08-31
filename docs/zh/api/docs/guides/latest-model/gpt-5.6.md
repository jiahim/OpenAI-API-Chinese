---
latestModelInfo:
  model: gpt-5.6-sol
  migrationGuide: /api/docs/guides/upgrading-to-gpt-5p6-sol.md
  promptingGuide: /api/docs/guides/prompt-guidance-gpt-5p6.md
---

# 使用 GPT-5.6

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过将 `.md` 附加到页面 URL 来获取文档页面的 Markdown 版本。

## 简介

GPT-5.6 为复杂的生产工作流树立了新的质量和效率基线。GPT-5.6 尤其在 token 使用上更为高效，并改善了前端美学，涵盖布局、视觉层次和设计判断。

GPT-5.6 还引入了新的命名方案。 `gpt-5.6` 别名用于将请求路由到 `gpt-5.6-sol`，它是具备旗舰能力的模型。使用 `gpt-5.6-terra` 可在更低价格下获得强劲性能，使用 `gpt-5.6-luna` 适用于高效、大规模的工作负载。

从 GPT-5.5 或 GPT-5.4 迁移时，可以先沿用当前的 GPT-5.5 或 GPT-5.4 推理设置，然后在具有代表性的任务上测试相同设置和低一档的设置。GPT-5.6 通常能在使用更少 token 的同时保持或提升质量，但最佳设置取决于你的工作负载。

## 新增内容

- **程序化工具调用：** GPT-5.6 可以编写 JavaScript 来调用符合条件的工具、在调用之间传递结果，并在托管运行时中处理中间输出。使用 [程序化工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) 适用于有界、工具密集型的工作流，且每步之间无需新的模型判断。程序化工具调用兼容 ZDR，不会产生额外的容器费用。
- **多智能体 [beta]：** [多智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 使 GPT-5.6 实例能够并行协调多个子智能体并综合它们的结果。与 Codex 中的 ultra 模式类似，它可以缩短实际运行时间，并提升可清晰拆分为独立工作流的复杂任务的性能。多智能体 作为 beta 功能在 Responses API 中提供，以便我们根据开发者反馈持续改进。
- **显式提示缓存：** GPT-5.6 允许你精确标记 OpenAI 缓存的可复用提示前缀。你仍可在隐式模式下使用自动缓存。OpenAI 按未缓存输入价格的 1.25× 计费缓存写入，缓存读取仍享有折扣。了解如何 [配置提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching).
- **持久化推理：** GPT-5.6 可在多个轮次之间复用可用的推理项，以提升多轮质量和缓存效率。使用 `reasoning.context` 来选择行为。了解如何 [跨调用保留推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls).
- **最大推理力度：** GPT-5.6 支持 `max` 推理力度，以应对需要更多探索和验证的高难度任务。如果你目前使用 `xhigh`，请在代表性工作负载上对比两种设置。
- **Pro 模式：** GPT-5.6 可执行更多模型工作以提升困难任务的可靠性，并返回单个最终答案。可通过 `reasoning.mode: "pro"` 在质量比延迟和 token 用量更重要时使用。了解如何 [使用 pro 模式](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).
- **Token 效率：** GPT-5.6 以更少的输出 token 达到旗舰级性能。
- **前端设计：** GPT-5.6 能创建更精致、更可用的网站和应用，在布局、视觉层次和设计判断上表现更强。
- **意图理解：** GPT-5.6 能更好地从上下文推断用户的潜在目标和预期的工作深度，因此你通常无需规定每一步。请继续提供领域上下文、硬性约束、审批边界和成功标准；当遇到重要的歧义应触发追问时，请告知模型。
- **原始图像细节：** GPT-5.6 会保留通过 `original` 或 `auto` 发送的图像的原始细节尺寸，而非将其缩放到 patch 预算或像素尺寸限制。大图像会占用更多输入 token 并增加延迟。了解如何 [选择图像细节级别](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level).

## Safeguards

在使用 GPT-5.6 模型时，用户可能会遇到一些安全防护措施，由于实时网络和生物滥用分类器会在模型输出生成时运行，这些防护措施会阻止或拒绝某些请求。其他请求可能会耗时更长，因为在这些分类器同步审查输出时，生成过程会暂停数秒。安全防护措施偶尔可能会干预合法工作，尤其是在防御性和攻击性活动初期可能相似的两用领域。

如果你的应用为各个最终用户提供服务，请在每次请求中附带一个稳定的、保护隐私的 `safety_identifier` 。参见 [实施安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) 以获取指导。

我们正在持续演进这些安全防护措施，使其在抵御对抗性压力的同时保持稳健有效，并保留对合法工作的访问，例如代码审查、漏洞研究、补丁开发、调试、安全教育和防御性测试。





## 迁移快速开始

### 使用 Codex 进行迁移

Codex 可以通过以下方式应用本指南中建议的更改 [OpenAI Docs 技能](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

```text
$openai-docs migrate this project to the GPT-5.6 model family
```

要在其他编码智能体中使用此技能，请从 [OpenAI 技能仓库](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

### 更新 API 和模型参数

- 为工作负载选择目标模型。使用 `gpt-5.6-sol` 以获得旗舰性能， `gpt-5.6-terra` 以兼顾智能与成本，或 `gpt-5.6-luna` 用于高效、大规模的工作负载。 `gpt-5.6` 别名会将请求路由到 `gpt-5.6-sol`.
- 使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 进行推理、工具调用和多轮工作流。
- 设置 `reasoning.effort` 时请慎重。GPT-5.6 支持 `none`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
  - 如果你正在从 GPT-5.5 或 GPT-5.4 迁移，请将当前的推理强度作为基线，然后对比低一档。
  - 如果你使用 `none`，请将其作为延迟基线，同时测试 `low` ，当 工作流 能从推理或工具使用中受益时。
  - 使用 `medium` 作为均衡的起点，以及 `low` 用于对延迟敏感的工作负载。
  - 使用 `high` 或 `xhigh` 以在更多推理带来可衡量的质量提升时使用。
  - 预留 `max` 用于最严苛的、要求质量优先的工作负载。可与 `max` 和 `xhigh` 进行比较，以找到适合你用例的最佳质量、延迟和成本权衡。
- 若要使用 pro 模式，请保留你选定的 GPT-5.6 模型，并将 `reasoning.mode` 设为 `pro` ，在 Responses API 中使用；不要切换到单独的 Pro 模型标识符。可独立选择 `reasoning.effort` 。如果省略它，GPT-5.6 在标准模式和 pro 模式下都会默认使用 `medium` 。请参阅 [reasoning mode](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 获取请求示例和计费详情。
- 根据先前推理的相关程度，配置持久化推理。GPT-5.6 模型默认使用 `all_turns`；更早的模型默认使用 `current_turn`.
  - 省略该参数 `reasoning.context` 或将其设为 `auto` 以使用 `all_turns`，即 GPT-5.6 的默认值。请检查响应中的 `reasoning.context` 字段以确认实际生效的模式。
  - 设置 `reasoning.context` 设为 `all_turns` 当任务的目标、假设和优先级在多轮交互中保持稳定时，
  - 使用 `all_turns`，并使用 `previous_response_id` 以便让模型可以访问来自先前响应的推理。
  - 在手动管理历史记录时，请保留并重新发送先前的用户输入以及每一个响应输出项。对于 `store: false` 或零数据留存（Zero Data Retention）场景，请重放 API 默认返回的加密推理项。
  - 设置 `reasoning.context` 设为 `current_turn` 当先前的推理不再相关时。
- 审查提示缓存。你无需更改代码即可继续使用隐式缓存。由于 GPT-5.6 的缓存写入费用是未缓存输入价格的 1.25 倍，请跟踪 `cached_tokens` 和 `cache_write_tokens` 以了解净成本。使用显式断点或 `prompt_cache_options.mode: "explicit"` 以避免不必要的写入，并将 `prompt_cache_retention` 替换为 `prompt_cache_options.ttl`.
- 要使用程序化工具调用（Programmatic Tool Calling），请添加 `programmatic_tool_calling` 工具，并使用 `allowed_callers`。将符合条件的工具加入。更新你的应用以处理 `program` 项、由程序发起的函数调用，以及 `program_output` 项，同时保留每次调用的 `call_id` 和 `caller` 关联。请参阅 [程序化工具调用指南](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) 中关于请求和 延续 的示例。
  - 在具有代表性的任务上对启用 PTC 的 工作流 进行基准测试。对比任务成功率、最终答案的完整性、所需的证据、总 token 数、延迟和成本。只有在最终答案仍满足所需质量标准的前提下，调用次数、轮次或中间输出更少才算改进。

## 提示工程最佳实践

### 优先使用更简洁的提示

去除重复的指令和示例,并简化工具描述,可以提升任务表现和 token 使用效率。在一组内部编码智能体评测运行样本中,精简系统提示词配置使评测分数提升约 10–15%,同时总 token 减少 41–66%,成本降低 33–67%。不同工作负载的结果会有所差异,因此请将这些范围视作参考方向,并基于你自己应用中的代表性任务验证改动效果。

在不丢失关键信息的前提下精简提示词,可参考以下做法:

- 从一个已经能正常工作的提示词和工具集开始。每次移除一组指令、示例或工具，然后重新运行相同的评测。
- 每条指令只陈述一次。
- 只暴露与任务相关的工具,并保持其描述简洁而精准。
- 当示例和风格指引承载了产品需求或能修正已观测到的差距时,保留它们。
- 在运行开始时以及会话过程中跟踪上下文。较长的会话会放大重复的提示词和工具内容。

### 定义自主性与审批边界

GPT-5.6 在执行多步骤任务时可以主动且持续地推进。为每个请求明确授权的行动范围，使模型能够在安全、符合既定范围的前提下不间断地继续工作，同时在涉及外部操作、具有破坏性、成本较高或超出既定范围的操作前及时停下。

通常，一份简洁的策略就足够了：

```text
For requests to answer, explain, review, diagnose, or plan, inspect the relevant
materials and report the result. Do not implement changes unless the request also
asks for them.

For requests to change, build, or fix, make the requested in-scope local changes
and run relevant non-destructive validation without asking first.

Require confirmation for external writes, destructive actions, purchases, or a
material expansion of scope.
```

明确列出安全的本地操作，例如读取文件、检查日志、修改既定范围内的代码以及运行测试。将策略集中在一个地方，每条规则只陈述一次。像“先询问”“不要改动”或“等待批准”这类重复性的指令，会导致对安全、预期的操作发出不必要的审批请求。

### 设置响应长度和风格

GPT-5.6 默认情况下往往比 GPT-5.5 更简洁。在迁移时，请检查诸如“保持简洁”或“简短一些”之类的笼统简短性指令是否仍然有用。对于某些任务来说，它们可能并不必要，有时甚至会让回答过于简短。当这些指令能够可靠地生成应用所需的输出时，请保留它们。

如需在多个请求间获得更一致的控制，可使用 `text.verbosity` 来设置默认的详细程度，然后使用提示词来满足任务的具体需求。

#### 设置默认值 `text.verbosity`

选择 `low`, `medium`，或 `high` 作为请求的默认详细程度。在提示中指定特定任务所需的长度、结构或必填内容。请参阅 [设置 `text.verbosity`](https://developers.openai.com/api/docs/guides/deployment-checklist#set-up-textverbosity) 中的API示例。

#### Specify what a short answer must include

当任务要求更简短的答案时，要识别模型必须保留的信息以及可以省略的细节。例如：

```text
Lead with the conclusion. Include the evidence needed to support it, any material
caveat, and the next action. Omit secondary detail and repetition.

Keep all required facts, decisions, caveats, and next steps. Trim introductions,
repetition, generic reassurance, and optional background first.
```

这为模型提供了清晰的优先级顺序：先保留完成任务所需的内容，再删除价值较低的细节。

#### 定义语气

像“友好的”或“有同理心的”这类宽泛的标签可能含义模糊。请描述能够定义你产品语气风格的写作选择，例如如何直接给出答案、何时应承认问题，以及安抚用户或礼貌收尾是否合适。

```text
State the answer directly. If the user reports a problem, acknowledge the
specific issue before giving the next step. Use reassurance only when it is
relevant. Omit generic praise and unnecessary sign-offs.
```

### Pro mode

#### 在质量优先时选择 pro mode

Pro 模式是一种 Responses API 执行模式，它会在返回单个最终答案之前为请求投入更多的模型算力。它可以提升困难任务的可靠性，但会增加延迟，并在上报的使用量中累计这部分算力所产生的 token。这些 token 按所选模型的标准 token 费率计费。

当边际质量提升会显著影响结果、并且任务足够困难以从中受益时（例如复杂的优化、高价值的编码或代码评审，以及具有明确评估标准的深度分析），可以使用 pro 模式。对于例行的、对延迟敏感或高吞吐的工作，以及当你的评估未显示 pro 模式带来显著收益时，应优先使用标准模式。

推理模式与推理努力程度相互独立。Pro 模式可与任何 GPT-5.6 模型及其支持的推理努力程度配合工作。建议从与你的标准模式基线相同的模型和推理努力程度开始，然后在具有代表性的任务上比较不同配置，而不要假设最高努力程度始终是最佳权衡。

#### 在 API 中配置专业模式

在 API 请求中启用 pro 模式。沿用你在标准模式下使用的那种以结果为导向的提示词：阐明目标、相关上下文、约束条件、所需证据、成功标准以及输出格式。你无需在提示中要求模型“使用 pro 模式”、“更深入思考”或生成多个候选答案。

例如：

```text
Review this database migration plan for failure modes that could cause data loss
or extended downtime. For each finding, cite the relevant step, estimate impact
and likelihood, and recommend a specific mitigation. Return the five most
important risks in severity order.
```

#### 比较质量与成本

在相同的代表性任务上比较 standard 和 pro 模式。衡量任务成功率、答案完整性、所需证据、总令牌数、延迟和成本。在 pro 模式能带来足够质量或可靠性提升以抵消额外模型开销的场景中有选择地使用它。

在 [推理模式指南](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).

### 程序化工具调用

#### 根据任务形态选择程序化工具调用

程序化工具调用（PTC）最适合用于有界的工作流，即代码可以处理多个工具结果或较大的中间输出，并返回一个更小的结构化结果。可将其用于过滤、连接、排序、去重、聚合、校验或其他可预测的处理任务。

仅仅因为多个调用、并行调用或存在依赖调用，并不足以作为使用程序化工具调用的理由。在以下情况下，应优先使用直接的、非 PTC 的工具调用：

- 一次调用即可
- 中间输出本身已经很小
- 每个结果都可能改变模型的下一个决策
- 某个动作需要审批
- 最终输出必须保留引用或原生产物

#### 针对具体任务制定路由指令

不要依赖工具可用性或“高效使用程序化工具调用”等通用指令来生成正确的路由。当直接调用和程序化调用都可用时，请明确说明：

- 哪个有界阶段应使用程序化工具调用。
- 它可以调用哪些工具。
- 确切的输出架构和所需的证据。
- 并发、重试以及停止限制。
- 哪些工作应保持直接执行。

工具描述应记录其预期返回字段、类型和错误行为。如果模型在编写程序前无法确定返回结构，建议直接调用工具，以便在决定如何使用之前先检查结果。

如果两条路由都需要，请定义一次清晰的交接，并告知模型不要切换路由或重复已完成的工作。

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

该 `program_output` item 和最终的助手 `message` 是相互独立的输出，请务必同时测试两者。理论上，程序可能返回了正确的记录，但消息遗漏了必填字段、引用或注意事项。

在同一组具有代表性的任务上比较直接调用和程序化调用。检查最终响应是否正确、完整，并包含所需的证据。然后对比总 token 数、延迟、成本、调用次数、轮次和重试次数。只有当响应仍然通过现有评估时，才把更低资源消耗视为改进。

在 [程序化工具调用指南](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling).