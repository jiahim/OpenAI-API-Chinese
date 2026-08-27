---
latestModelInfo:
  model: gpt-5.6-sol
  migrationGuide: /api/docs/guides/upgrading-to-gpt-5p6-sol.md
  promptingGuide: /api/docs/guides/prompt-guidance-gpt-5p6.md
---

# 使用 GPT-5.6

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 简介

GPT-5.6 为复杂的生产工作流设定了新的质量和效率基线。GPT-5.6 特别节省 token，并改进了前端美学，包括布局、视觉层次和设计判断。

GPT-5.6 还引入了新的命名方案。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`，这是旗舰能力的模型。使用 `gpt-5.6-terra` 以获得低价下的强大性能，以及 `gpt-5.6-luna` 用于高效、高容量的工作负载。

从 GPT-5.5 或 GPT-5.4 迁移时，先使用当前的 GPT-5.5 或 GPT-5.4 推理设置，然后在代表性任务上测试相同设置和低一级的设置。GPT-5.6 通常能以更少的 token 保持或提高质量，但最佳设置取决于你的工作负载。

## 新增内容

- **编程式工具调用：** GPT-5.6 可以编写 JavaScript 来调用符合条件的工具，在调用之间传递结果，并在托管运行时中处理中间输出。使用 [编程式工具调用](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) 适用于有界、工具密集型的工作流，这些工作流不需要在每一步之间进行新的模型判断。编程式工具调用与 ZDR 兼容，且无需额外的容器成本。
- **多智能体 [测试版]：** [多智能体](https://developers.openai.com/api/docs/guides/responses-multi-agent) 允许一个 GPT-5.6 实例并行协调多个子智能体并综合其结果。类似于 Codex 中的超模式，这可以缩短挂钟时间，并提高可清晰划分为独立工作流的复杂任务的性能。多智能体作为 Responses API 中的测试版功能可用，我们将根据开发者反馈进行迭代。
- **显式提示缓存：** GPT-5.6 允许你精确标记 OpenAI 缓存哪些可重用的提示前缀。你仍然可以在隐式模式下使用自动缓存。OpenAI 对缓存写入按未缓存输入费率 1.25 倍计费，而缓存读取仍享受折扣。了解如何 [配置提示缓存](https://developers.openai.com/api/docs/guides/prompt-caching).
- **持久化推理：** GPT-5.6 可以在多轮对话中重用可用的推理项，以提高多轮质量和缓存效率。使用 `reasoning.context` 来选择行为。了解如何 [跨调用保留推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls).
- **最大推理努力：** GPT-5.6 支持 `max` 针对需要更多探索和验证的高要求任务的推理努力。如果你目前使用 `xhigh`，请在代表性工作负载上比较两种设置。
- **专业模式：** GPT-5.6 可以执行更多模型工作来提高困难任务的可靠性并返回单个最终答案。使用 `reasoning.mode: "pro"` 当质量比延迟和令牌使用更重要时。了解如何 [使用专业模式](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).
- **令牌效率：** GPT-5.6 以更少的输出令牌达到前沿性能。
- **前端设计：** GPT-5.6 能创建更精致、更可用的网站和应用，布局、视觉层次和设计判断力更强。
- **意图理解：** GPT-5.6 能更好地从上下文推断用户的底层目标和预期工作水平，因此你通常无需规定每一步。继续提供领域上下文、硬约束、审批边界和成功标准。当重要歧义应触发提问时，告诉模型。
- **原始图像细节：** GPT-5.6 保留发送图像的原始尺寸 `original` 或 `auto` ，而不是将它们调整到补丁预算或像素尺寸限制。大图像可能使用更多输入令牌并增加延迟。了解如何 [选择图像细节级别](https://developers.openai.com/api/docs/guides/images-vision#choose-an-image-detail-level).

## 安全保障

使用 GPT-5.6 模型时，用户可能会遇到因实时网络和生物滥用分类器在生成模型输出时运行而阻止或拒绝某些请求的护栏。其他请求可能需要更长时间，因为在流式生成过程中会暂停数秒，等待这些分类器同步审查输出。护栏有时也可能干预合法工作，特别是在防御性和攻击性活动最初看起来相似的“双重用途”领域。

如果你的应用服务的是终端用户，请在每个请求中发送稳定的、保护隐私的 `safety_identifier` 。参见 [实施安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) 以获取指导。

我们正在不断演进这些护栏，使其在抵御对抗性压力时保持稳健和有效，同时保障合法工作的访问，例如代码审查、漏洞研究、补丁开发、调试、安全教育以及防御性测试。





## 迁移快速入门

### 使用 Codex 迁移

Codex 可应用本指南中的建议更改，使用 [OpenAI Docs skill](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

```text
$openai-docs migrate this project to the GPT-5.6 model family
```

要在其他编码智能体中使用此技能，请从 [OpenAI skills repository下载](https://github.com/openai/skills/tree/main/skills/.curated/openai-docs).

### 更新 API 和模型参数

- 为工作负载选择目标模型。使用 `gpt-5.6-sol` 获取前沿能力， `gpt-5.6-terra` 在智能与成本之间取得平衡，或 `gpt-5.6-luna` 用于高效、高吞吐量的工作负载。 `gpt-5.6` 别名将请求路由到 `gpt-5.6-sol`.
- 使用 [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) 进行推理、工具调用和多轮工作流。
- 有意设置 `reasoning.effort` 。GPT-5.6 支持 `none`, `low`, `medium`, `high`, `xhigh`，并且 `max`.
  - 如果你要从 GPT-5.5 或 GPT-5.4 迁移，请保留当前的推理力度作为基准，然后对比低一级的选项。
  - 如果你使用 `none`，请将其作为延迟基准，同时测试 `low` 在工作流受益于推理或工具使用时的情况。
  - 使用 `medium` 作为平衡起点，并使用 `low` 用于延迟敏感型工作负载。
  - 使用 `high` 或 `xhigh` 当更多推理能带来可衡量的质量提升时。
  - 保留 `max` 用于最注重质量的工作负载。对比 `max` 和 `xhigh` 以为你的用例找到最佳的质量、延迟和成本权衡。
- 要使用专业模式，请保持你选择的 GPT-5.6 模型，并设置 `reasoning.mode` 为 `pro` 在 Responses API 中；不要切换到单独的 Pro 模型标识。选择 `reasoning.effort` 独立设置。如果省略，GPT-5.6 默认使用 `medium` 在标准和专业模式下均如此。参见 [推理模式](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode) 获取请求示例和计费详情。
- 根据先前推理中仍有相关的部分来配置持久化推理。GPT-5.6 模型默认使用 `all_turns`；早期模型默认使用 `current_turn`.
  - 省略 `reasoning.context` 或将其设置为 `auto` 以使用 `all_turns`，即 GPT-5.6 的默认值。检查响应的 `reasoning.context` 字段以确认生效的模式。
  - 设置 `reasoning.context` 当 `all_turns` 任务的目标、假设和优先级在各轮之间保持稳定时。
  - 使用 `all_turns`，时，继续使用 `previous_response_id` 以将之前响应的推理内容提供给模型。
  - 手动管理历史记录时，保留并重新发送之前的用户输入和每个响应输出项。对于 `store: false` 或零数据保留，重放 API 默认返回的加密推理项。
  - 设置 `reasoning.context` 为 `current_turn` 当之前的推理不再相关时。
- 查看提示缓存。你无需更改代码即可继续使用隐式缓存。由于 GPT-5.6 缓存写入成本为未缓存输入速率的 1.25 倍，需跟踪 `cached_tokens` 和 `cache_write_tokens` 以了解净成本。使用显式断点或 `prompt_cache_options.mode: "explicit"` 来避免不必要的写入，并将 `prompt_cache_retention` 替换为 `prompt_cache_options.ttl`.
- 要使用程序化工具调用，请添加 `programmatic_tool_calling` 工具并通过 `allowed_callers`。选择符合资格的工具。更新你的应用程序以处理 `program` 项、程序发出的函数调用和 `program_output` 项，同时保留每次调用的 `call_id` 和 `caller` 关联。请参阅 [以编程方式调用工具指南](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling) 以获取请求和延续示例。
  - 在代表性任务上对启用 PTC 的工作流进行基准测试。比较任务成功率、最终答案的完整性、所需证据、总令牌数、延迟和成本。只有在最终答案仍达到所需质量水平时，较少的调用次数、轮次或中间输出才算作改进。

## 提示词最佳实践

### 偏好精简的提示词

移除重复的指令和示例，并简化工具描述，可以提高任务性能并节省 token。在一组内部编码智能体评估运行的样本中，采用更精简系统提示的配置将评估分数提高了约 10–15%，同时将总 token 用量减少了 41–66%，成本降低了 33–67%。结果会因工作负载而异，因此请将这些范围视为方向性参考，并在你自己应用中的代表性任务上验证这些更改。

要在不丢失重要指导的情况下简化提示：

- 从一个已经可用的提示词和工具集开始。每次移除一组指令、示例或工具，然后重新运行相同的评估。
- 每条指令只陈述一次。
- 只暴露与任务相关的工具，并保持其描述简洁准确。
- 当示例和风格指导体现了产品要求或纠正了已测得的差距时，保留它们。
- 在运行开始时以及对话增长过程中都要跟踪上下文。长时间会话会放大重复出现的提示词和工具内容的影响。

### 定义自主性与审批边界

GPT-5.6 在执行多步骤任务时可以主动且持续地工作。定义每个请求所授权的操作级别，以便模型无需不必要的中断即可继续安全、在范围内的操作，同时在外部、破坏性、高成本或超出范围的操作前停下来。

通常，一个简洁的策略就足够了：

```text
For requests to answer, explain, review, diagnose, or plan, inspect the relevant
materials and report the result. Do not implement changes unless the request also
asks for them.

For requests to change, build, or fix, make the requested in-scope local changes
and run relevant non-destructive validation without asking first.

Require confirmation for external writes, destructive actions, purchases, or a
material expansion of scope.
```

明确列出安全的本机操作，如读取文件、查看日志、编辑范围内的代码以及运行测试。将策略集中在一个位置，并且每条规则只声明一次。重复诸如“先询问”、“不要更改”或“等待批准”之类的指令可能会导致对安全、预期的操作产生不必要的批准请求。

### 设置响应长度和风格

GPT-5.6 默认倾向于比 GPT-5.5 更简洁。迁移时，请检查“简洁”或“保持简短”等宽泛的简洁性指令是否仍然有用。对于某些任务，它们可能是不必要的，有时会让回复过于简短。当它们能可靠地产生你的应用所需的输出时，请保留它们。

为了在请求间获得更一致的控制，请使用 `text.verbosity` 来设置默认的详细程度，然后使用提示词来满足任务特定的要求。

#### 使用以下方式设置默认值 `text.verbosity`

选择 `low`, `medium`，或 `high` 作为请求的默认详细程度。在提示词中，指定任何特定于任务的长度、结构或必需内容。参见 [设置 `text.verbosity`](https://developers.openai.com/api/docs/guides/deployment-checklist#set-up-textverbosity) 以获取 API 示例。

#### 指定简短回答必须包含的内容

当任务要求更简短的答案时，确定模型必须保留的信息和可以省略的细节。例如：

```text
Lead with the conclusion. Include the evidence needed to support it, any material
caveat, and the next action. Omit secondary detail and repetition.

Keep all required facts, decisions, caveats, and next steps. Trim introductions,
repetition, generic reassurance, and optional background first.
```

这为模型提供了明确的优先级顺序：保留完成任务所需的内容，然后去除价值较低的细节。

#### 定义语气

诸如“友好”或“富有同理心”这类宽泛的标签可能含义模糊。请描述定义产品语气的写作选择，例如如何直接陈述答案、何时承认问题，以及是否需要安抚或结束语。

```text
State the answer directly. If the user reports a problem, acknowledge the
specific issue before giving the next step. Use reassurance only when it is
relevant. Omit generic praise and unnecessary sign-offs.
```

### 专业模式

#### 当质量最重要时选择专业模式

Pro 模式是 Responses API 的一种执行模式，在返回单个最终答案之前，会对请求应用更多模型工作。它可以提高困难任务的可靠性，但会增加延迟，并在报告的使用量中汇总这些工作的令牌。这些令牌按所选模型的标准令牌费率计费。

当质量的边际提升对结果产生实质影响，且任务足够困难而能从中受益时（例如复杂的优化、高价值的编码或审查，或具有明确评估标准的深层分析），请使用 Pro 模式。对于常规、对延迟敏感或高工作量的工作，以及你的评估未显示 Pro 模式有显著收益时，请优先使用标准模式。

推理模式和推理工作量是独立的。Pro 模式可与任何 GPT-5.6 模型及其支持的推理工作量配合使用。从与标准模式基线相同的模型和工作量开始，然后在代表性任务上比较配置，而不是假设最高工作量始终是最佳的权衡。

#### 在API中配置专业模式

在 API 请求中启用专业模式。保持与标准模式相同的以结果为导向的提示词：说明目标、相关上下文、约束、所需证据、成功标准和输出格式。你无需要求模型“使用专业模式”、“更深入思考”或生成多个候选答案。

例如：

```text
Review this database migration plan for failure modes that could cause data loss
or extended downtime. For each finding, cite the relevant step, estimate impact
and likelihood, and recommend a specific mitigation. Return the five most
important risks in severity order.
```

#### 比较质量与成本

在同一组代表性任务上比较标准模式和专业模式。衡量任务成功率、答案完整性、所需证据、总 token 数、延迟和成本。仅在专业模式的质量或可靠性提升足以证明额外模型工作合理时，有选择地使用专业模式。

了解更多，请参阅 [推理模式指南](https://developers.openai.com/api/docs/guides/reasoning#reasoning-mode).

### 编程式工具调用

#### 按任务形态选择编程式工具调用

程序化工具调用（PTC）最适合有界工作流，在这些工作流中，代码可以处理多个工具结果或大型中间输出，并返回更小的结构化结果。将其用于过滤、连接、排序、去重、聚合、验证或其他可预测的处理。

仅凭多次、并行或依赖调用并不能证明程序化工具调用的合理性。在以下情况下，更倾向于直接的非PTC工具调用：

- 一次调用即可
- 中间输出已经很小
- 每个结果都可能改变模型的下一个决策
- 某个操作需要审批
- 最终输出必须保留引用或原生工件

#### 让路由指令针对具体任务

不要依赖工具可用性或诸如“高效使用编程式工具调用”之类的通用指示来选择正确的路由。当直接调用和编程式调用都可用时，请明确说明：

- 哪个受限阶段应使用程序化工具调用。
- 它可调用哪些工具。
- 精确的输出架构和所需证据。
- 并发、重试和停止限制。
- 哪些工作应保持直接处理。

工具描述应记录其预期的返回字段、类型和错误行为。如果模型在编写程序之前无法确定返回形状，则优先使用直接工具调用，以便在决定如何使用结果之前先检查结果。

如果需要两条路线，定义一条明确的交接，并告知模型不要切换路线或重复已完成的工作。

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

该 `program_output` 条目和最终助手消息 `message` 是独立的输出；请务必同时测试两者。理论上，程序可以返回正确的记录，而消息中却遗漏了必需字段、引用或注意事项。

在相同的代表性任务上比较直接调用和程序化调用。检查最终响应是否正确、完整，并包含所需的证据。然后比较总令牌数、延迟、成本、调用次数、轮次和重试次数。仅当响应仍然通过你现有的评估时，才将资源使用量降低视为改进。

了解更多信息，请参阅 [程序化工具调用指南](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling).