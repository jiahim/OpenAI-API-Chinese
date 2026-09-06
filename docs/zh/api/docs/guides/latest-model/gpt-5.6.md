---
latestModelInfo:
  model: gpt-5.6-sol
  migrationGuide: /api/docs/guides/upgrading-to-gpt-5p6-sol.md
  promptingGuide: /api/docs/guides/prompt-guidance-gpt-5p6.md
---

# 使用 GPT-5.6

> 如需完整文档索引,请参阅 [llms.txt](/llms.txt)。通过在页面 URL 后追加 `.md` 可获取该页面的 Markdown 版本。

## 简介

GPT-5.6 为复杂生产工作流树立了新的质量和效率基线。GPT-5.6 特别节省 token，并提升了前端美学，包括布局、视觉层次和设计判断力。

GPT-5.6 还引入了一种新的命名方案。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`，即用于旗舰能力的模型。使用 `gpt-5.6-terra` 以在更低价格下获得强劲性能，使用 `gpt-5.6-luna` 处理高吞吐量、高效率的工作负载。

从 GPT-5.5 或 GPT-5.4 迁移时，先沿用你当前的 GPT-5.5 或 GPT-5.4 推理设置，然后在代表性任务上测试同一设置和低一档的设置。GPT-5.6 通常能以更少的 token 保持或提升质量，但最佳设置取决于你的工作负载。

<a id="what-is-new" className="scroll-mt-[110px]"></a>

## 最近更新

- **程序化工具调用：** GPT-5.6 可以编写 JavaScript 来调用符合条件的工具、在调用之间传递结果，并在托管运行时中处理中间输出。使用 [程序化工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) 适用于不需要在每一步之间进行新模型判断的、有界的、工具密集型工作流。程序化工具调用兼容 ZDR，且不会产生额外的容器费用。
- **多智能体 [测试版]：** [多智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 让一个 GPT-5.6 实例并行协调多个子智能体并综合它们的结果。类似于 Codex 中的 ultra 模式，这可以缩短实际耗时并提升可清晰拆分为独立工作流的复杂任务的性能。多智能体 作为 Responses API 中的测试版功能提供，我们将根据开发者反馈持续迭代。
- **显式提示缓存：** GPT-5.6 允许你精确标记 OpenAI 缓存哪些可复用的提示前缀。你仍然可以在隐式模式下使用自动缓存。OpenAI 按未缓存输入价格的 1.25× 计费缓存写入，而缓存读取仍享受折扣。了解如何 [配置提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching).
- **持久化推理：** GPT-5.6 可以在多轮之间复用可用的推理项，以提高多轮质量和缓存效率。使用 `reasoning.context` 来选择该行为。了解如何 [跨调用保留推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls).
- **最大推理力度：** GPT-5.6 支持 `max` 推理力度，用于需要更多探索和验证的高难度任务。如果你当前使用 `xhigh`，请在代表性工作负载上对比两种设置。
- **Pro 模式：** GPT-5.6 可以执行更多模型工作以提升困难任务的可靠性，并返回单一最终答案。使用 `reasoning.mode: "pro"` 当质量比延迟和 token 使用量更重要时。了解如何 [使用 pro 模式](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).
- **Token 效率：** GPT-5.6 以更少的输出 token 达到旗舰级性能。
- **前端设计：** GPT-5.6 能创建更精致、更实用的网站和应用，在布局、视觉层次和设计判断方面表现更强。
- **意图理解：** GPT-5.6 能更好地从上下文推断用户的潜在目标和期望的工作深度，因此你通常无需逐步指定每个环节。请继续提供领域上下文、硬性约束、审批边界和成功标准。当存在重要的歧义需要主动提问时，明确告知模型。
- **原始图像细节：** GPT-5.6 保留图像尺寸，使用 `original` 或 `auto` 细节，但任一边超过 65,535 像素的图像会被缩放以适应该限制。API 会拒绝仍然超出 [30,000 patch 上限](https://developers.openai.com/api/docs/guides/images-vision#image-input-requirements)，的图像，而不是将其缩放到该限制以内。大图像会消耗更多输入 token 并增加延迟。了解如何 [选择图像细节级别](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level).

## 护栏

使用 GPT-5.6 模型时，用户可能会遇到一些安全防护措施，这些措施会在模型输出生成过程中运行的实时网络与生物风险误用分类器的作用下拦截或拒绝部分请求。还有一些请求耗时可能更长，因为生成过程会在中途暂停数秒，以便这些分类器同步审查输出。安全防护措施偶尔可能会干预合法工作，特别是在防御性活动与攻击性活动初期表现相似的双重用途领域。

如果你的应用服务于单个终端用户，请在每次请求中附带一个稳定的、保护隐私的 `safety_identifier` 。请参阅 [实施安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) 获取相关指导。

我们持续演进这些安全防护措施，使其在抵御对抗性压力的同时保持稳健有效，并保留对合法工作的访问，例如代码审查、漏洞研究、补丁开发、调试、安全教育以及防御性测试。





## 迁移快速入门

### 使用 Codex 进行迁移

Codex 可以按照本指南中推荐的更改进行 [OpenAI Docs 技能](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

```text
$openai-docs migrate this project to the GPT-5.6 model family
```

要在其他编码智能体中使用此技能，请从以下位置下载： [OpenAI skills 仓库](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

### 更新 API 和模型参数

- 为该工作负载选择目标模型。使用 `gpt-5.6-sol` 以获得旗舰级能力， `gpt-5.6-terra` 以兼顾智能与成本，或 `gpt-5.6-luna` 用于高效、大规模的工作负载。 `gpt-5.6` 别名会将请求路由到 `gpt-5.6-sol`.
- 使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 进行推理、工具调用和多轮工作流。
- 有意识地设置 `reasoning.effort` 。GPT-5.6 支持 `none`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
  - 如果你正在从 GPT-5.5 或 GPT-5.4 迁移，请将当前的推理力度保留为基线，然后比较低一级进行比较。
  - 如果你使用 `none`，请将其作为延迟基线，并同时测试 `low` ，当工作流受益于推理或工具使用时。
  - 使用 `medium` 作为平衡的起点，并将 `low` 用于对延迟敏感的工作负载。
  - 使用 `high` 或 `xhigh` ，在更多推理带来可衡量的质量提升时。
  - 保留 `max` 用于对质量要求最高的工作负载。可以比较 `max` 和 `xhigh` 以找到最适合你用例的质量、延迟和成本权衡方案。
- 要使用 pro 模式，请保留你选择的 GPT-5.6 模型，并将 `reasoning.mode` 设置为 `pro` 在 Responses API 中；不要切换到单独的 Pro 模型标识符。可独立选择 `reasoning.effort` 。如果省略它，GPT-5.6 在标准和 pro 模式下都会默认使用 `medium` 。参见 [推理模式](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 获取请求示例和计费详情。
- 根据先前推理仍有用的程度，配置持久化推理。GPT-5.6 模型默认为 `all_turns`；更早的模型默认为 `current_turn`.
  - 省略或将其设为 `reasoning.context` 或将其设置为 `auto` 以使用 `all_turns`, GPT-5.6 的默认行为。请检查响应的 `reasoning.context` 字段以确认实际生效的模式。
  - 有意识地设置 `reasoning.context` 设置为 `all_turns` 当任务的目标、假设和优先级在多轮交互中保持稳定时。
  - 使用 `all_turns`，时，请使用 `previous_response_id` 以使模型可以访问先前响应中的推理。
  - 在手动管理历史记录时，保留并重新发送先前的用户输入以及每个响应输出项。对于 `store: false` 或零数据保留 (Zero Data Retention)，重放 API 默认返回的加密推理项。
  - 有意识地设置 `reasoning.context` 设置为 `current_turn` 当先前的推理不再相关时。
- 审查提示缓存。你无需更改代码即可继续使用隐式缓存。由于 GPT-5.6 缓存写入成本是未缓存输入价格的 1.25×，因此请跟踪 `cached_tokens` 和 `cache_write_tokens` 以了解净成本。使用显式断点或 `prompt_cache_options.mode: "explicit"` 以避免不必要的写入，并将 `prompt_cache_retention` 替换为 `prompt_cache_options.ttl`.
- 要使用可编程工具调用 (Programmatic Tool Calling)，请添加 `programmatic_tool_calling` 工具，并使用 `allowed_callers`。将符合条件的工具加入。更新你的应用程序以处理 `program` 项、由程序发起的函数调用以及 `program_output` 项，同时保留每次调用的 `call_id` 和 `caller` 关联关系。请参阅 [《可编程工具调用指南》](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) 中的请求和 延续 示例。
  - 在具有代表性的任务上对启用了 PTC 的 工作流 进行基准测试。比较任务成功率、最终答案的完整性、所需证据、总 token 数、延迟和成本。仅当最终答案仍然满足所需的质量标准时，更少的调用次数、轮次或中间输出才算作改进。

## 提示词最佳实践

### 优先使用简洁的提示词

移除重复的指令和示例，并简化工具描述，可以提升任务表现和 token 使用效率。在一组内部编码智能体 评测运行中，使用更精简系统提示的配置将评测分数提高了大约 10–15%，同时将总 token 减少了 41–66%，成本降低了 33–67%。实际结果会因工作负载而异，因此请将这些区间视为方向性参考，并基于你自己应用中具有代表性的任务来验证改动效果。

在不丢失重要指导的前提下简化提示：

- 从一组已经能正常工作的提示和工具集开始。每次移除一组指令、示例或工具，然后重新运行相同的评测。
- 每条指令只写一次。
- 只暴露与任务相关的工具，并保持其描述简洁精确。
- 当示例和风格指南承载了产品需求或修正了已衡量的差距时，保留它们。
- 在运行开始时以及对话增长过程中都跟踪上下文。长会话会放大重复的提示和工具内容。

### 定义自主性和审批边界

GPT-5.6 在执行多步骤任务时可以主动且持续地推进。为每个请求明确授权的行动范围，使模型能够在安全、符合范围内的工作中持续推进，而不会无谓停顿，并在涉及外部、破坏性、高成本或超出范围的操作前及时停止。

一份简洁的策略通常就足够了：

```text
For requests to answer, explain, review, diagnose, or plan, inspect the relevant
materials and report the result. Do not implement changes unless the request also
asks for them.

For requests to change, build, or fix, make the requested in-scope local changes
and run relevant non-destructive validation without asking first.

Require confirmation for external writes, destructive actions, purchases, or a
material expansion of scope.
```

明确列出安全的本地操作，例如读取文件、检查日志、编辑范围内的代码以及运行测试。将策略集中在一处，每条规则只写一次。重复诸如“先询问”、“不要修改”或“等待批准”之类的指示，可能导致对安全、预期内的操作产生不必要的审批请求。

### 设置响应长度和风格

GPT-5.6 默认情况下往往比 GPT-5.5 更简洁。在迁移时，请检查诸如“简洁一些”或“保持简短”这类宽泛的简短指令是否仍然有用。它们对某些任务可能并非必需，有时甚至会让回复过于简短。当它们能够稳定地生成你的应用所需的结果时，保留即可。

若要在不同请求间获得更一致的控制，可使用 `text.verbosity` 来设置默认的详细程度，然后通过提示词提出任务相关的具体要求。

#### 设置默认值 `text.verbosity`

选择 `low`, `medium`，或 `high` 作为请求的默认详细程度。在提示中指定任何特定任务的长度、结构或必需内容。参阅 [设置 `text.verbosity`](https://developers.openai.com/api/docs/guides/deployment-checklist#set-up-textverbosity) 获取API 示例。

#### 指定简短回答必须包含的内容

当任务需要更简短的答案时，明确模型必须保留的信息以及可以省略的细节。例如：

```text
Lead with the conclusion. Include the evidence needed to support it, any material
caveat, and the next action. Omit secondary detail and repetition.

Keep all required facts, decisions, caveats, and next steps. Trim introductions,
repetition, generic reassurance, and optional background first.
```

这为模型提供了一个清晰的优先级顺序：保留完成任务所需的内容，然后移除价值较低的细节。

#### 定义基调

诸如“友好”或“有同理心”这样的宽泛标签可能含义不清。请描述定义你产品语气的写作选择，例如陈述答案的直接程度、何时承认问题，以及是否适合使用安抚或结束语。

```text
State the answer directly. If the user reports a problem, acknowledge the
specific issue before giving the next step. Use reassurance only when it is
relevant. Omit generic praise and unnecessary sign-offs.
```

### Pro mode

#### 当质量最为重要时，请选择 pro mode

Pro 模式是 Responses API 的一种执行模式，它会在返回单个最终答复之前对请求投入更多模型工作。它可以提高困难任务的可靠性，但会增加延迟，并在报告的用量中汇总这些工作所产生的 token。这些 token 按所选模型的标准 token 费率计费。

当质量的边际提升会显著影响结果、且任务足够困难以从中受益时（例如复杂优化、高价值的编码或代码评审，以及具有明确评估标准的深度分析），可使用 pro 模式。对于常规、对延迟敏感或高吞吐量的工作，以及当你的评估未显示 pro 模式带来显著收益时，请优先使用标准模式。

推理模式与推理强度相互独立。Pro 模式适用于任何 GPT-5.6 模型及其支持的推理强度。从与标准模式基线相同的模型和强度开始，然后在具有代表性的任务上比较各配置，而不要假设最高强度始终是最佳权衡。

#### 在 API 中配置 pro 模式

在 API 请求中启用 pro 模式。沿用你在标准模式下使用的同一个面向结果的提示词：说明目标、相关上下文、约束条件、所需证据、成功标准以及输出格式。你无需让模型“使用 pro 模式”“更深入地思考”或生成多个候选答案。

例如：

```text
Review this database migration plan for failure modes that could cause data loss
or extended downtime. For each finding, cite the relevant step, estimate impact
and likelihood, and recommend a specific mitigation. Return the five most
important risks in severity order.
```

#### 比较质量与成本

在相同的代表性任务上比较标准模式和专业模式。衡量任务成功率、回答完整性、所需证据、总 token 数、延迟和成本。选择性地使用专业模式，前提是其质量或可靠性的提升足以证明额外的模型开销是合理的。

详细了解请参阅 [推理模式指南](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).

### 程序化工具调用

#### 按任务形态选择程序化工具调用

程序化工具调用（PTC）最适合用于有界的工作流，即代码可以处理多个工具结果或较大的中间输出，并返回一个更小的结构化结果。可将其用于过滤、连接、排序、去重、聚合、校验或其他可预测的处理。

仅凭多次、并行或存在依赖关系的调用不足以成为使用程序化工具调用的理由。在以下情况下，优先使用直接的、非 PTC 的工具调用：

- 一次调用即可
- 中间输出已经很小
- 每个结果都可能改变模型的下一个决策
- 某个操作需要审批
- 最终输出必须保留引用或原生产物

#### 让路由指令针对具体任务

不要依赖工具可用性或诸如“高效地使用 Programmatic Tool Calling”之类的通用指令来生成正确的路由。当直接调用和程序化调用都可用时，请明确说明：

- 哪个有界阶段应使用 Programmatic Tool Calling。
- 它可以调用哪些工具。
- 确切的输出架构和所需的证据。
- 并发、重试和停止限制。
- 哪些工作应保持直接执行。

工具描述应当说明其预期的返回字段、类型以及错误行为。如果模型在编写程序前无法确定返回结构，应优先采用直接工具调用，以便在决定如何使用结果之前先检视返回内容。

如果两条路径都需要使用，请定义一次清晰的交接，并告知模型不要切换路径或重复已完成的工作。

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

该 `program_output` item 和最终助手 `message` 是两段独立的输出，请务必分别测试。理论上，程序可能返回了正确的记录，而消息却遗漏了必填字段、引用或注意事项。

在相同的代表性任务上比较直接调用和程序化调用。检查最终响应是否正确、完整，并包含所需的证据。然后比较总 token 数、延迟、成本、调用次数、轮次和重试次数。只有当响应仍然通过你现有的评估时，才将较低的资源使用视为改进。

详细了解请参阅 [程序化工具调用指南](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling).