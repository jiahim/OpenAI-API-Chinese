---
latestModelInfo:
  model: gpt-5.6-sol
  migrationGuide: /api/docs/guides/upgrading-to-gpt-5p6-sol.md
  promptingGuide: /api/docs/guides/prompt-guidance-gpt-5p6.md
---

# 使用 GPT-5.6

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

## 简介

GPT-5.6 为复杂的生产工作流树立了新的质量和效率基线。GPT-5.6 特别节省 token，并改善了前端美学，包括布局、视觉层次和设计判断力。

GPT-5.6 还引入了一种新的命名方案。 `gpt-5.6` 别名会将请求路由到 `gpt-5.6-sol`,该模型具备旗舰级能力。使用 `gpt-5.6-terra` 以更低的价格获得强劲性能,使用 `gpt-5.6-luna` 处理高效、大规模的工作负载。

从 GPT-5.5 或 GPT-5.4 迁移时,先沿用你当前的 GPT-5.5 或 GPT-5.4 推理设置,然后在代表性任务上测试同一设置和降低一级的设置。GPT-5.6 常常能在使用更少 token 的情况下保持或提升质量,但最佳设置取决于你的工作负载。

<a id="what-is-new" className="scroll-mt-[110px]"></a>

## 新增功能

- **可编程工具调用：** GPT-5.6 可以编写 JavaScript 来调用符合条件的工具、在调用之间传递结果，并在托管运行时中处理中间输出。可使用 [可编程工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) 来处理那些不需要在每一步都进行新的模型判断、且以工具为主的有界工作流。可编程工具调用兼容 ZDR，且不会产生额外的容器费用。
- **多智能体[测试版]：** [多智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 让一个 GPT-5.6 实例并行协调多个子智能体，并综合它们的结果。与 Codex 中的 ultra 模式类似，这可以缩短实际耗时，并提升那些能清晰拆分为独立工作流的复杂任务的性能。多智能体作为测试版功能在Responses API中提供，我们将根据开发者的反馈持续迭代。
- **显式提示缓存：** GPT-5.6 允许你精确指定OpenAI要缓存的可复用提示前缀。你仍可以在隐式模式下使用自动缓存。OpenAI对缓存写入按未缓存输入价格的 1.25 倍计费，而缓存读取仍享有折扣。了解如何 [配置提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching).
- **持久化推理：** GPT-5.6 可以在多个轮次间复用可用的推理项，以提升多轮质量与缓存效率。使用 `reasoning.context` 来选择该行为。了解如何 [跨调用保留推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls).
- **最高推理力度：** GPT-5.6 支持 `max` 推理力度，以应对需要更多探索与验证的高要求任务。如果你当前使用 `xhigh`，请在具有代表性的工作负载上对比两种设置。
- **Pro 模式：** GPT-5.6 可以执行更多的模型工作，以提高困难任务下的可靠性，并返回单一的最终答案。使用 `reasoning.mode: "pro"` 在质量比延迟和 token 用量更重要时适用。了解如何 [使用 pro 模式](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).
- **Token 效率：** GPT-5.6 以更少的输出 token 达到旗舰级性能。
- **前端设计：** GPT-5.6 能生成更精致、更可用的网站和应用，在布局、视觉层次和设计判断上表现更强。
- **意图理解：** GPT-5.6 能更好地从上下文中推断用户的潜在目标和期望的工作深度，因此你通常无需逐一指定每一步。请继续提供领域背景、硬性约束、审批边界和成功标准，并告知模型在出现重要歧义时应主动发问。
- **原始图像细节：** GPT-5.6 会保留图像尺寸与 `original` 或 `auto` 细节，但任一边超过 65,535 像素的图像会被等比缩放以满足该上限。若缩放后仍超出 [30,000 patch 上限](https://developers.openai.com/api/docs/guides/images-vision#image-input-requirements)，API 会直接拒绝这些图像，而不是继续缩放以适配该上限。较大的图像会消耗更多的输入 token 并增加延迟。了解如何 [选择图像细节等级](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level).

## 安全防护

使用 GPT-5.6 模型时，用户可能会遇到一些防护机制，它们会因实时运行的网络安全和生物安全误用分类器而拦截或拒绝部分请求，这些分类器会在模型生成输出的过程中执行。其他请求耗时可能更长，因为生成过程会在中途暂停数秒，以便这些分类器同步审查输出。防护机制偶尔会干预合法工作，特别是在防御性和攻击性活动初期可能表现相似的双重用途领域。

如果你的应用面向单个最终用户，请在每个请求中附带发送一个稳定的、保护隐私的 `safety_identifier` 。详见 [实施安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) 指南。

我们正在持续改进这些防护机制，使其在承受对抗性压力时依然稳健有效，同时保留对合法工作的访问，例如代码审查、漏洞研究、补丁开发、调试、安全教育和防御性测试。

<a id="migrate-to-gpt-56"></a>

## 迁移快速入门

### 使用 Codex 进行迁移

Codex 可以使用本指南中的建议更改，配合 [OpenAI Docs skill](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

```text
$openai-docs migrate this project to the GPT-5.6 model family
```

如需在其他编码智能体中使用此技能，请从 [OpenAI skills 仓库下载](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

### 更新 API 和模型参数

- 为工作负载选择目标模型。可使用 `gpt-5.6-sol` 以获得旗舰级能力， `gpt-5.6-terra` 在智能与成本之间取得平衡，或 `gpt-5.6-luna` 用于高效的大规模工作负载。 `gpt-5.6` 别名会将请求路由到 `gpt-5.6-sol`.
- 使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 进行推理、工具调用和多轮工作流。
- 请有意识地设置 `reasoning.effort` 。GPT-5.6 支持 `none`, `low`, `medium`, `high`, `xhigh`，以及 `max`.
  - 如果你正在从 GPT-5.5 或 GPT-5.4 迁移，请将当前的推理强度作为基线，然后与低一档进行比较。
  - 如果你使用 `none`，请将其作为延迟基线，并同时测试 `low` ，当 工作流 能从推理或工具使用中受益时。
  - 使用 `medium` 作为平衡的起点， `low` 用于对延迟敏感的工作负载。
  - 使用 `high` 或 `xhigh` ，用于在更多推理带来可衡量的质量提升时。
  - 保留 `max` 用于对质量要求最高的工作负载。对比 `max` 和 `xhigh` ，为你的用例找到最佳的质量、延迟和成本权衡。
- 要使用 pro 模式，请保留你选定的 GPT-5.6 模型，并将 `reasoning.mode` 设置为 `pro` 在 Responses API 中；不要切换到单独的 Pro 模型 slug。独立选择 `reasoning.effort` 。如果省略它，GPT-5.6 在标准模式和 pro 模式下默认使用 `medium` 。请参阅 [reasoning mode](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) ，查看请求示例和计费详情。
- 根据先前推理的剩余相关程度，配置持久化推理。GPT-5.6 模型默认 `all_turns`；更早的模型默认 `current_turn`.
  - 省略 `reasoning.context` 或将其设置为 `auto` 以使用 `all_turns`, the GPT-5.6 default. Check the response's `reasoning.context` 字段以确认实际生效的模式。
  - 请有意识地设置 `reasoning.context` 设置为 `all_turns` 当任务的目标、假设和优先级在多轮交互中保持稳定时。
  - 使用 `all_turns`，继续使用 `previous_response_id` 以便模型可以使用来自先前响应的推理。
  - 手动管理历史记录时，请保留并重新发送之前的用户输入以及每个响应输出项。对于 `store: false` 或零数据保留（Zero Data Retention），请重放 API 默认返回的加密推理项。
  - 请有意识地设置 `reasoning.context` 设置为 `current_turn` 当先前的推理不再相关时。
- 检查提示缓存。你无需更改代码即可继续使用隐式缓存。由于 GPT-5.6 缓存写入成本是非缓存输入价格的 1.25 倍，请跟踪 `cached_tokens` 和 `cache_write_tokens` 以了解净成本。使用显式断点或 `prompt_cache_options.mode: "explicit"` 以避免不必要的写入，并使用 `prompt_cache_retention` 替换 `prompt_cache_options.ttl`.
- 要使用 Programmatic Tool Calling，请添加 `programmatic_tool_calling` 工具，并通过 `allowed_callers`。选择启用符合条件的工具。更新你的应用程序以处理 `program` 项、由程序发出的函数调用，以及 `program_output` 项，同时保留每次调用的 `call_id` 和 `caller` 关联关系。请参阅 [Programmatic Tool Calling 指南](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) 以获取请求和 延续 示例。
  - 在代表性任务上对启用 PTC 的 工作流 进行基准测试。比较任务成功率、最终答案完整性、所需证据、总令牌数、延迟和成本。仅当最终答案仍满足所需质量标准时，更少的调用、轮次或中间输出才算改进。

## 提示最佳实践

### 推荐使用简洁的提示

删除重复的说明和示例，并简化工具描述，可以提升任务表现与 token 使用效率。在一组内部的编程智能体评测中，采用更精简系统提示的配置让评测分数大约提升了 10–15%，同时总 token 用量减少 41–66%，成本降低 33–67%。不同工作负载的结果会有所差异，因此请将这些区间视为方向性参考，并基于你自身应用中的代表性任务对改动进行验证。

在保留关键指引的前提下简化提示：

- 从一个已经能正常工作的提示和工具集开始。每次移除一组指令、示例或工具，然后重新运行相同的评测。
- 每条指令只写一次。
- 只暴露与任务相关的工具，并保持其描述简洁、精确。
- 当示例和风格指南承载了产品需求或用于弥补已测出的差距时，保留它们。
- 在运行开始时以及对话持续增长的过程中都要追踪上下文。长会话会放大重复的提示和工具内容。

### 定义自主性与审批边界

GPT-5.6 在执行多步骤任务时可以主动且持续地推进。为每个请求明确授权的行动范围，以便模型能够安全且在范围内地持续工作，避免不必要的停顿，同时在涉及外部、具有破坏性、成本较高或超出范围的操作之前停下。

一个简洁的策略通常就足够了：

```text
For requests to answer, explain, review, diagnose, or plan, inspect the relevant
materials and report the result. Do not implement changes unless the request also
asks for them.

For requests to change, build, or fix, make the requested in-scope local changes
and run relevant non-destructive validation without asking first.

Require confirmation for external writes, destructive actions, purchases, or a
material expansion of scope.
```

明确列出安全的本地操作，例如读取文件、检查日志、修改范围内的代码以及运行测试。将策略集中放在一处，每个规则只陈述一次。诸如“先询问”、“不要修改”或“等待批准”之类的重复指令，可能会导致对安全的、预期的操作产生不必要的审批请求。

### 设置回复长度与风格

GPT-5.6 默认情况下比 GPT-5.5 更简洁。迁移时，请检查诸如 “Be concise” 或 “Keep it short” 之类的笼统简洁指令是否仍然有用。对于某些任务，这些指令可能并不必要，有时甚至会让回答过于简短。当它们能够稳定产出你的应用所需的输出时，请保留这些指令。

若要在多个请求间获得更一致的控制，可使用 `text.verbosity` 来设置默认的详略程度，然后使用 prompt 来满足特定任务的要求。

#### 设置默认值 `text.verbosity`

选择 `low`, `medium`，或 `high` 作为请求的默认详细程度。在提示中指定任何任务特定的长度、结构或必需的内容。参见 [设置 `text.verbosity`](https://developers.openai.com/api/docs/guides/deployment-checklist#set-up-textverbosity) 以获取一个 API 示例。

#### Specify what a short answer must include

当任务需要较短的回复时，识别模型必须保留的信息以及可以省略的细节。例如：

```text
Lead with the conclusion. Include the evidence needed to support it, any material
caveat, and the next action. Omit secondary detail and repetition.

Keep all required facts, decisions, caveats, and next steps. Trim introductions,
repetition, generic reassurance, and optional background first.
```

这样可以为模型设定明确的优先级：保留完成任务所需的内容，然后删除价值较低的细节。

#### 设定语气风格

像“友好的”或“有同理心的”这样的宽泛标签可能含糊不清。应描述定义产品语气的写作选择，例如直接陈述答案的程度、何时承认问题，以及安抚语气或结束语是否合适。

```text
State the answer directly. If the user reports a problem, acknowledge the
specific issue before giving the next step. Use reassurance only when it is
relevant. Omit generic praise and unnecessary sign-offs.
```

### Pro 模式

#### 在质量最为重要时选择 pro 模式

Pro 模式是 Responses API 的一种执行模式，会在返回单个最终答案前对请求投入更多的模型工作。它可以提升困难任务的可靠性，但会增加延迟，并将这些工作产生的 tokens 汇总到上报的用量中。这些 tokens 按所选模型的标准 token 费率计费。

当边际质量提升会对结果产生实质性影响，且任务足够困难（例如复杂优化、高价值的编码或评审，或具有明确评估标准的深度分析）时，可使用 Pro 模式。对于常规、对延迟敏感或高吞吐量的工作，以及当你的评估未显示 Pro 模式带来明显收益时，应优先使用标准模式。

推理模式和推理努力程度是相互独立的。Pro 模式可与任何 GPT-5.6 模型及其支持的推理努力程度配合使用。建议先使用与标准模式基线相同的模型和努力程度，然后在具有代表性的任务上比较各配置，而不是直接假设最高努力程度始终是最佳权衡。

#### 在 API 中配置 pro 模式

在 API 请求中启用 pro 模式。沿用你在标准模式下使用的同一个面向结果的提示：说明目标、相关上下文、约束条件、所需证据、成功标准以及输出格式。你无需让模型“使用 pro 模式”“更深入思考”或生成多个候选答案。

例如：

```text
Review this database migration plan for failure modes that could cause data loss
or extended downtime. For each finding, cite the relevant step, estimate impact
and likelihood, and recommend a specific mitigation. Return the five most
important risks in severity order.
```

#### 比较质量与成本

在相同代表性任务上比较标准模式与 pro 模式。衡量任务成功率、答案完整性、所需证据、总 token 数、延迟和成本。仅在 pro 模式带来的质量或可靠性提升值得额外模型开销时，有选择地使用 pro 模式。

更多信息请参阅 [推理模式指南](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).

### 程序化工具调用

#### 按任务形态选择程序化工具调用

程序化工具调用（Programmatic Tool Calling，PTC）最适用于有界的工作流，即代码可以处理多个工具结果或较大的中间输出，并返回一个更小的结构化结果。可将其用于过滤、连接、排序、去重、聚合、校验或其他可预测的处理任务。

仅靠多个、并行或存在依赖关系的调用，并不足以证明需要使用程序化工具调用。在以下情况下，应优先选择直接的非 PTC 工具调用：

- 一次调用即可
- 中间输出本身已经足够小
- 每个结果都可能改变模型的下一个决策
- 某个操作需要审批
- 最终输出必须保留引用或原生产物

#### 让路由指令针对具体任务

不要依赖工具可用性或诸如“高效使用程序化工具调用”这样的通用指令来生成正确的路由。当直接调用和程序化调用都可用时，请明确说明：

- 哪个有界阶段应使用程序化工具调用。
- 它可以调用哪些工具。
- 确切的输出模式与所需的证据。
- 并发、重试与停止限制。
- 哪些工作应保持直接处理。

工具描述应记录其预期的返回字段、类型和错误行为。如果模型在编写程序之前无法确定返回结构，应优先采用直接工具调用，以便在决定如何使用结果之前先检查返回值。

如果两条路径都需要，请定义一次明确的交接，并告知模型不要切换路径或重复已完成的工作。

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

该 `program_output` item 和最终的助手 `message` 输出是分开的；请务必对两者都进行测试。从理论上讲，程序可以返回正确的记录，而消息却遗漏了必需的字段、引用或注意事项。

在具有代表性的同一任务上比较直接调用和程序化调用。检查最终响应是否正确、完整，并包含所需的证据。然后比较总令牌数、延迟、成本、调用次数、轮次和重试次数。仅当响应仍能通过你现有的评估时，才将更低的资源使用视为改进。

更多信息请参阅 [程序化工具调用指南](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling).