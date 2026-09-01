---
latestModelInfo:
  model: gpt-5.6-sol
  migrationGuide: /api/docs/guides/upgrading-to-gpt-5p6-sol.md
  promptingGuide: /api/docs/guides/prompt-guidance-gpt-5p6.md
---

# 使用 GPT-5.6

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

## 介绍

GPT-5.6 为复杂的生产工作流树立了新的质量和效率基线。GPT-5.6 特别节省 token，并在前端美学（包括布局、视觉层次和设计判断）方面有所提升。

GPT-5.6 还引入了新的命名方案。 `gpt-5.6` 别名会将请求路由到 `gpt-5.6-sol`，即旗舰能力模型。使用 `gpt-5.6-terra` 可在更低价格下获得强劲性能， `gpt-5.6-luna` 适用于高效、大规模的工作负载。

从 GPT-5.5 或 GPT-5.4 迁移时，建议先沿用你当前的 GPT-5.5 或 GPT-5.4 推理设置，然后在代表性任务上测试同一设置以及低一级的设置。GPT-5.6 通常能在使用更少 token 的情况下保持或提升质量，但最佳设置取决于你的工作负载。

## 新增内容

- **编程式工具调用：** GPT-5.6 可以编写 JavaScript 来调用符合条件的工具、在调用之间传递结果，并在托管运行时中处理中间输出。使用 [编程式工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) 可用于那些步骤间不需要新模型判断的、工具密集且有界的任务。编程式工具调用兼容 ZDR，且不会产生额外的容器费用。
- **多智能体[测试版]：** [多智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 让一个 GPT-5.6 实例并行协调多个子智能体，并整合它们的结果。类似于 Codex 中的 ultra 模式，它能缩短实际耗时，并提升可清晰拆分为独立工作流的复杂任务的表现。多智能体 在 Responses API 中作为测试版功能提供，我们会根据开发者反馈持续迭代。
- **显式提示缓存：** GPT-5.6 允许你精确指定 OpenAI 缓存哪些可复用的提示前缀。你仍可以在隐式模式下使用自动缓存。OpenAI 按未缓存输入价格的 1.25 倍计费缓存写入，缓存读取仍享受折扣。了解如何 [配置提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching).
- **持久化推理：** GPT-5.6 可以在多轮之间复用可用的推理项，从而提升多轮质量与缓存效率。使用 `reasoning.context` 以选择行为。了解如何 [跨调用保留推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls).
- **最大推理力度：** GPT-5.6 支持 `max` 推理力度，适用于需要更多探索与验证的高难度任务。如果你当前使用 `xhigh`，请在代表性工作负载上对比两种设置。
- **Pro 模式：** GPT-5.6 可执行更多模型工作以提升困难任务的可靠性，并返回单一最终答案。通过 `reasoning.mode: "pro"` 当质量比延迟和 token 使用量更重要时。了解如何 [使用 pro 模式](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).
- **Token 效率：** GPT-5.6 以更少的输出 token 达到旗舰级性能。
- **前端设计：** GPT-5.6 能创建更精致、更实用的网站和应用，具有更强的布局、视觉层次和设计判断力。
- **意图理解：** GPT-5.6 能更好地从上下文中推断用户的潜在目标和预期的工作完成度，因此你通常无需明确规定每一步。继续提供领域上下文、硬性约束、审批边界和成功标准。当遇到重要歧义应触发提问时，请告知模型。
- **原始图像细节：** GPT-5.6 保留图像尺寸并使用 `original` 或 `auto` 细节级别，但超过任一边 65,535 像素的图像会被缩小以符合该限制。API 会拒绝仍超过 [30,000 补丁上限](https://developers.openai.com/api/docs/guides/images-vision#image-input-requirements)，的图像，而不是将其调整大小以符合该上限。较大的图像会使用更多输入令牌并增加延迟。了解如何 [选择图像细节级别](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level).

## 保障措施

使用 GPT-5.6 模型时，用户可能会遇到一些安全机制，这些机制会在模型输出生成过程中运行实时的网络与生物风险分类器，从而拦截或拒答部分请求。还有一些请求耗时更长，因为在流式输出过程中，生成会暂停数秒，等待这些分类器同步审查输出结果。安全机制偶尔会对正当工作造成干预，特别是在攻防用途并存的双重用途领域，因为防御性和攻击性活动在初期可能看起来很相似。

如果你的应用面向个人最终用户，请在每次请求中附带一个稳定的、 `safety_identifier` 。请参阅 [实施安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) 获取相关指引。

我们正在持续演进这些安全机制，使其在面对对抗性压力时依然稳健有效，同时保留对正当工作的访问，例如代码审查、漏洞研究、补丁开发、调试、安全教育和防御性测试。





## 迁移快速入门

### 使用 Codex 进行迁移

Codex 可以应用本指南中的推荐更改，方法是使用 [OpenAI Docs 技能](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

```text
$openai-docs migrate this project to the GPT-5.6 model family
```

如需在其他编码 智能体 中使用此技能，请从 [OpenAI skills 仓库](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

### 更新 API 和模型参数

- 根据工作负载选择目标模型。使用 `gpt-5.6-sol` 以获得旗舰级能力， `gpt-5.6-terra` 可在智能与成本之间取得平衡，或 `gpt-5.6-luna` 用于高效、大规模的工作负载。 `gpt-5.6` 别名会将请求路由至 `gpt-5.6-sol`.
- 使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 进行推理、工具调用和多轮工作流。
- 请根据工作负载谨慎设置 `reasoning.effort` 。GPT-5.6 支持 `none`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
  - 如果你是从 GPT-5.5 或 GPT-5.4 迁移，请保留当前的推理强度作为基线，然后再比较低一档。
  - 如果你使用 `none`，请将其作为延迟基线，同时测试 `low` ，当 工作流 需要推理或工具调用时使用。
  - 使用 `medium` 作为均衡的起点， `low` 用于对延迟敏感的工作负载。
  - 使用 `high` 或 `xhigh` ，在更多推理能带来可衡量的质量提升时使用。
  - 预留 `max` 用于对质量要求最严苛的工作负载。比较 `max` 和 `xhigh` ，为你的用例找到最佳的质量、延迟和成本权衡。
- 若要使用 pro 模式，请保持所选的 GPT-5.6 模型，并将 `reasoning.mode` 设为 `pro` ，在 Responses API 中设置；不要切换到单独的 Pro 模型标识符。可独立选择 `reasoning.effort` 。若省略该字段，GPT-5.6 在标准和 pro 模式下都默认使用 `medium` 。有关请求示例和计费详情，请参阅 [推理模式](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 。
- 根据仍然相关的先前推理量来配置持久化推理。GPT-5.6 模型默认 `all_turns`；早期模型默认 `current_turn`.
  - 省略 `reasoning.context` 或将其设置为 `auto` 以使用 `all_turns`，即 GPT-5.6 的默认值。请检查响应中的 `reasoning.context` 字段以确认实际生效的模式。
  - 请根据工作负载谨慎设置 `reasoning.context` 设为 `all_turns` 用于任务的目标、假设和优先级在多轮中保持稳定的情况。
  - 使用 `all_turns`，可继续使用 `previous_response_id` 以便让模型可以访问先前响应中的推理。
  - 在手动管理历史记录时，请保留并重新发送先前的用户输入以及每个响应输出项。对于 `store: false` 或零数据留存（Zero Data Retention），请重放 API 默认返回的加密推理项。
  - 请根据工作负载谨慎设置 `reasoning.context` 设为 `current_turn` 当先前的推理不再相关时。
- 回顾提示缓存。你无需更改代码即可继续使用隐式缓存。由于 GPT-5.6 的缓存写入成本是未缓存输入价格的 1.25 倍，请跟踪 `cached_tokens` 和 `cache_write_tokens` 以了解净成本。使用显式断点或 `prompt_cache_options.mode: "explicit"` 以避免不必要的写入，并将 `prompt_cache_retention` 替换为 `prompt_cache_options.ttl`.
- 若要使用程序化工具调用（Programmatic Tool Calling），请添加 `programmatic_tool_calling` 符合条件的工具，并通过 opt 启用工具 `allowed_callers`。请更新你的应用以处理 `program` 项、程序发出的函数调用，以及 `program_output` 项，同时保留每个调用的 `call_id` 和 `caller` 关联。请参阅 [Programmatic Tool Calling 指南](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) ，查看请求和延续示例。
  - 在代表性任务上对启用了 PTC 的工作流进行基准测试。比较任务成功率、最终答案完整性、所需证据、总 token 数、延迟和成本。只有当最终答案仍能达到所需的质量标准时，更少的调用、轮次或中间输出才算改进。

## 提示词最佳实践

### 优先使用简洁的提示词

去除重复的指令和示例，并简化工具描述，可以提升任务表现与 token 使用效率。在一组内部编码智能体评估运行中，使用更精简系统提示的配置将评估分数提高了约 10–15%，同时将总 token 减少 41–66%、成本降低 33–67%。不同工作负载的结果会有所差异，因此请将这些区间视为方向性参考，并基于你自身应用中的代表性任务验证变更效果。

在不丢失关键指引的前提下简化提示：

- 从一个已经可用的提示词和工具集开始。每次移除一组指令、示例或工具，然后重新运行同一组评测。
- 每条指令只写一次。
- 只暴露与任务相关的工具，并保持其描述简洁准确。
- 当示例和风格指导承载了产品需求或用于弥补已测出的差距时，保留它们。
- 在运行开始时以及对话增长过程中跟踪上下文。长会话会放大重复出现的提示词和工具内容的影响。

### 定义自主性与审批边界

GPT-5.6 在执行多步骤任务时可以主动且持续地推进。为每个请求明确授权的行动范围，让模型能够在不必要暂停的情况下继续安全的、任务范围内的工作，同时在涉及外部操作、具有破坏性、高成本或扩大范围的行为之前及时停止。

通常一条简洁的策略就足够了：

```text
For requests to answer, explain, review, diagnose, or plan, inspect the relevant
materials and report the result. Do not implement changes unless the request also
asks for them.

For requests to change, build, or fix, make the requested in-scope local changes
and run relevant non-destructive validation without asking first.

Require confirmation for external writes, destructive actions, purchases, or a
material expansion of scope.
```

明确列出允许的安全本地操作，例如读取文件、检查日志、修改任务范围内的代码以及运行测试。策略集中在一处，每条规则只陈述一次。重复诸如“先询问”、“不要修改”或“等待批准”之类的指令，可能会导致对安全的、符合预期的操作产生不必要的批准请求。

### 设置响应长度和风格

GPT-5.6 默认往往比 GPT-5.5 更简洁。迁移时，请检查诸如 “Be concise” 或 “Keep it short” 这类宽泛的简短指令是否仍然有用。对于某些任务，这些指令可能并不必要，有时甚至会让回答过于简短。当这些指令能够稳定产出你的应用所需的输出时，请保留它们。

如需在多次请求中获得更一致的控制，请使用 `text.verbosity` 来设置默认的详细程度，再通过提示词指定具体任务的要求。

#### 设置默认值 `text.verbosity`

Choose `low`, `medium`，或 `high` 作为请求的默认详细程度。在提示中指定任何特定任务所需的长度、结构或必需内容。参见 [设置 `text.verbosity`](https://developers.openai.com/api/docs/guides/deployment-checklist#set-up-textverbosity) 以获取 API 示例。

#### 指定简短回答必须包含的内容

当任务要求较短的回复时，先识别模型必须保留的信息，以及可以省略的细节。例如：

```text
Lead with the conclusion. Include the evidence needed to support it, any material
caveat, and the next action. Omit secondary detail and repetition.

Keep all required facts, decisions, caveats, and next steps. Trim introductions,
repetition, generic reassurance, and optional background first.
```

这样可以为模型明确一个优先级顺序：保留完成任务所需的内容，然后删去价值较低的细节。

#### 定义语气

诸如“友好的”或“富有同理心的”这类宽泛标签可能含义模糊。请描述定义你产品语气风格的具体写作选择，例如直接陈述答案的程度、何时承认问题，以及在何时适合加入安抚或结束语。

```text
State the answer directly. If the user reports a problem, acknowledge the
specific issue before giving the next step. Use reassurance only when it is
relevant. Omit generic praise and unnecessary sign-offs.
```

### Pro 模式

#### 在质量最重要时选择 Pro 模式

Pro 模式是一种 Responses API 执行模式，它会在返回单个最终答案之前对请求应用更多的模型工作。它可以提高困难任务的可靠性，但会增加延迟，并在报告的使用量中汇总这些工作产生的 token。这些 token 按所选模型的标准 token 费率计费。

当边际质量提升会对结果产生实质性影响，且任务足够复杂以从中受益时（例如复杂优化、高价值编码或评审，以及具有明确评估标准的深度分析），请使用 pro 模式。对于常规、对延迟敏感或高吞吐量的工作，以及当你的评估未显示 pro 模式带来显著收益时，请优先使用标准模式。

推理模式和推理强度是相互独立的。Pro 模式可与任何 GPT-5.6 模型及其支持的推理强度配合使用。从与你的标准模式基线相同的模型和强度开始，然后在具有代表性的任务上比较各配置，而不是假设最高强度始终是最佳权衡。

#### 在 API 中配置 pro 模式

在 API 请求中启用 pro 模式。沿用你在标准模式下使用的同一以结果为导向的提示：说明目标、相关上下文、约束、所需证据、成功标准以及输出格式。你无需让模型“使用 pro 模式”“更深入地思考”或生成多个候选答案。

例如：

```text
Review this database migration plan for failure modes that could cause data loss
or extended downtime. For each finding, cite the relevant step, estimate impact
and likelihood, and recommend a specific mitigation. Return the five most
important risks in severity order.
```

#### 对比质量与成本

在相同的代表性任务上比较标准模式和专业模式。衡量任务成功率、答案完整性、所需证据、总 token 数、延迟和成本。有选择地使用专业模式，仅在其质量或可靠性提升足以抵消额外模型开销时采用。

在以下指南中了解更多信息： [reasoning mode guide](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).

### Programmatic Tool Calling

#### 按任务形态选择 Programmatic Tool Calling

Programmatic Tool Calling（PTC）最适合用于有明确边界的 工作流，由代码处理多个工具结果或较大的中间输出，并返回一个更小的结构化结果。可用于过滤、连接、排序、去重、聚合、校验或其他可预测的处理。

仅当存在多个调用、并行调用或依赖调用本身，并不足以成为使用 Programmatic Tool Calling 的理由。在以下情况下，应优先选择直接的非 PTC 工具调用：

- 一次调用即可
- 中间输出本身已经较小
- 每个结果都可能改变模型的下一步决策
- 某个操作需要批准
- 最终输出必须保留引用或原生产物

#### 让路由指令针对具体任务

不要依赖工具可用性或诸如“高效地使用程序化工具调用”这类通用指令来生成正确的路由。当直接调用和程序化调用都可用时，请明确说明：

- 哪个有界阶段应使用程序化工具调用。
- 它可能调用的工具。
- 确切的输出 schema 和所需的证据。
- 并发、重试和停止限制。
- 哪些工作应保持直接执行。

工具描述应记录其预期的返回字段、类型和错误行为。如果模型在编写程序前无法确定返回结构，应优先采用直接调用工具的方式，使其能在决定如何使用结果之前先检查结果。

如果两条路径都需要，请定义一次清晰的交接，并告诉模型不要切换路径或重复已完成的工作。

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

该 `program_output` item 与最终的助手 `message` 输出是相互独立的；请确保对两者都进行测试。理论上，程序可以返回正确的记录，而消息却遗漏了必需的字段、引用或说明。

在同一组具有代表性的任务上比较直接调用与程序化调用方式。检查最终响应是否正确、完整，并包含所需的证据。然后对比总 token 数、延迟、成本、调用次数、轮次以及重试次数。仅当响应仍然通过你现有的评估时，才可将更低的资源使用视为改进。

在以下指南中了解更多信息： [程序化工具调用指南](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling).