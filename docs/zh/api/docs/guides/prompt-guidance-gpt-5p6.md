# GPT-5.6 Sol 的提示词使用指南

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

# GPT-5.6 Sol 的提示指南

在将提示词、工具描述、智能体指令或提示词栈适配到 GPT-5.6 Sol 或 GPT-5.6 系列时，请使用本指南。请结合当前的 [GPT-5.6 模型指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6) 了解 API 的详细信息、限制、定价和功能可用性。

当提示词定义结果、重要约束、可用证据和完成标准，并留出空间让模型选择高效路径时，GPT-5.6 表现最佳。

移除重复的指令和示例并简化工具描述，可以提高任务性能和令牌效率。在内部编码智能体评估运行样本中，采用精简系统提示词的配置将评估分数提高了约 10–15%，同时将总令牌数减少了 41–66%，成本降低了 33–67%。结果因工作负载而异，因此请将这些范围视为方向性指导，并在你自己应用中的代表性任务上验证更改。

## 首先简化提示词

从一个已经可用的提示词和工具集开始。一次移除一组指令、示例或工具，然后重新运行相同的评估。

精简：

- 同一规则的重复陈述；
- 不改变行为的重复样式或流程说明；
- 不改变行为的示例；
- 针对模型已可靠执行的行为的流程说明；
- 与任务无关的工具及工具描述。

保留：

- 用户可见的结果；
- 成功标准和停止条件；
- 安全、业务、证据和权限约束；
- 当路由依赖于上下文时的工具路由规则；
- 所需的输出形状和验证要求。

检查剩余说明是否存在矛盾。GPT-5 类模型严格遵守提示词契约，因此相互冲突的规则可能比缺少细节更容易引发不稳定。

## 以结果为先的提示词与停止条件

描述目标，而非规定每一个步骤。当提示词明确了理想结果时，GPT-5.6 通常能够选择高效的搜索、工具或推理路径。

推荐：

```text
Resolve the customer's issue end to end.

Success means:
- make the eligibility decision from available policy and account evidence
- complete any allowed action before responding
- return completed_actions, customer_message, and blockers
- if required evidence is missing, ask for the smallest missing field
```

避免不必要的绝对规则。仅在真正的恒定条件（如安全规则、必填字段或绝不应发生的操作）中使用“始终”“绝不”“必须”和“唯一”。对于需要判断的情况（例如何时搜索、提问、使用工具或继续迭代），更推荐使用决策规则。

保留用户明确给出的值。当正确值隐含时，提供决策标准，让模型从上下文或模式中推理。避免使用通用默认值、关键词映射和宽泛的语义捷径。

添加停止条件：

    Resolve the request in the fewest useful tool loops, but do not let loop
    minimization outrank correctness, required evidence, calculations, or
    required citations.

    After each result, ask whether the core request can now be answered with
    useful evidence. If yes, answer. If required evidence is still missing,
    name the missing fact and use the smallest useful fallback.

## 个性、协作与回复长度

GPT-5.6 默认情况下往往比 GPT-5.5 更简洁。迁移时，请检查“Be concise”或“Keep it short”等广泛的简洁性指令是否仍然有用。对于某些任务，它们可能不是必需的，有时会使响应过于简短。当它们能可靠地产生你的应用所需输出时，请保留它们。

为了在多个请求中获得更一致的控制，请使用 `text.verbosity` 设置默认详细程度，然后使用提示词指定任务特定的要求。选择 `low`, `medium`，或 `high` 作为请求的默认详细程度。在提示词中，指定任何任务特定的长度、结构或必需内容。参见 [设置 `text.verbosity`](https://developers.openai.com/api/docs/guides/deployment-checklist#set-up-textverbosity) 获取 API 示例。

对于面向客户的助手和协作产品，请同时定义个性和协作风格。

- 个性化控制语气、温暖度、直接性、正式度、幽默感、共情和润色。
- 协作风格控制模型何时提问、做出假设、主动行动、解释权衡、检查工作以及处理不确定性。

两者都要简短。个性应塑造用户体验；协作指令应塑造任务行为。两者都不应取代明确的目标、成功标准、工具规则或停止条件。

当任务要求更短的答案时，识别模型必须保留的信息以及可以省略的细节。例如：

    Lead with the conclusion. Include the evidence needed to support it, any material
    caveat, and the next action. Omit secondary detail and repetition.

    Keep all required facts, decisions, caveats, and next steps. Trim introductions,
    repetition, generic reassurance, and optional background first.

这为模型提供了清晰的优先顺序：保留完成任务所需的内容，然后移除价值较低的细节。

像“友好”或“富有同理心”这样的宽泛标签可能含糊不清。描述定义产品基调的写作选择，例如如何直接陈述答案、何时承认问题，以及是否适合提供安慰或结束语。

    State the answer directly. If the user reports a problem, acknowledge the
    specific issue before giving the next step. Use reassurance only when it is
    relevant. Omit generic praise and unnecessary sign-offs.

避免使用笼统的语言规则，如“始终以用户的语言回答”，除非这确实是产品要求。指定预期的输出语言及其何时应改变。

对于编辑、重写、摘要和面向客户的草稿，告诉模型要保留什么：

    Preserve the requested artifact, length, structure, genre, and factual claims
    first. Improve clarity, flow, and correctness without adding new claims,
    sections, or a more promotional tone unless requested.

## 定义自主性与审批边界

GPT-5.6 在执行多步骤任务时可以主动且持续地工作。明确每个请求授权执行的操作级别，以便模型在没有不必要停顿的情况下继续安全的、范围内的任务，同时在涉及外部、破坏性、高成本或扩大范围的操作之前停止。

简洁的策略通常就足够了：

    For requests to answer, explain, review, diagnose, or plan, inspect the
    relevant materials and report the result. Do not implement changes unless
    the request also asks for them.

    For requests to change, build, or fix, make the requested in-scope local
    changes and run relevant non-destructive validation without asking first.

    Require confirmation for external writes, destructive actions, purchases,
    or a material expansion of scope.

明确列出安全的本机操作，如读取文件、检查日志、编辑范围内的代码和运行测试。将策略集中在一处，每个规则仅陈述一次。重复诸如“先询问”、“不要变更”或“等待批准”等指令，可能会导致对安全、预期操作产生不必要的批准请求。

对于长时间运行的任务，请定义当前的工作层级。区分研究、设计、实现、审查和外部协调，以免模型在各个层级之间无声地切换。

## 工具路由

仅公开与任务相关的工具。工具描述应说明该工具的功能、使用时机、重要返回字段及错误行为。

当正确性依赖于前置检索或查找时，应明确说明：

    Before taking an action, resolve required discovery, retrieval, and
    validation steps. Do not skip a prerequisite because the intended final
    state seems obvious.

当多个读取操作相互独立时，应并行执行。当一个结果决定下一步操作时，应保持顺序执行。并行检索后，应先综合信息再采取行动。

如果工具返回空结果、部分结果或异常狭窄的结果，在得出结论说结果不存在之前，尝试一两个有意义的回退方案。

## 编程式工具调用

程序化工具调用（PTC）最适合有界工作流，其中代码可以处理多个工具结果或大型中间输出，并返回更小的结构化结果。

单独使用多个、并行或依赖调用并不能证明程序化工具调用的合理性。

用于：

- 过滤、连接、排序、排名、去重和聚合；
- 跨许多类似记录进行批处理；
- 重复的确定性验证；
- 可以缩减为紧凑模式的大型结构化结果。

在以下情况下优先使用直接工具调用：

- 一次调用即可；
- 中间输出已经很小；
- 每个结果可能会改变下一个决策；
- 某个操作需要审批；
- 最终答案必须保留引用或原生产物；
- 工作流需要调用之间的语义判断。

不要依赖诸如“高效使用编程式工具调用”之类的通用说明。应明确界定阶段、可用工具、输出架构、重试上限、停止条件，以及交还回模型直接判断的交接方式。

    Use Programmatic Tool Calling only for the bounded record-reduction stage.
    Call only the documented read-only tools. Filter and deduplicate the
    intermediate results, then emit exactly the required compact schema with
    evidence fields. Retry transient failures at most twice. Use direct tool
    calls for approval, semantic judgment, citations, and final validation.

如果两条路径都需要，则定义一次明确的交接，并告知模型不要切换路径或重复已完成的工作。

The `program_output` item 和最终助手 `message` 是独立的输出；请务必对两者都进行测试。理论上，程序可能返回正确记录，而消息却遗漏了必填字段、引用或注意事项。

在相同的代表性任务上比较直接调用和编程式调用。检查最终响应是否正确、完整，是否包含所需的证据。然后比较总 token 数、延迟、成本、调用次数、回合数和重试次数。只有在响应仍能通过你现有的评估时，才将较低的资源使用视为改进。

## 基础依据、引用和检索预算

对于基于事实的回答，引用行为应作为提示的一部分。明确哪些内容需要支持、什么算作充分证据，以及在证据缺失时应如何表现。证据缺失不应自动成为事实性的“没有”。

    For ordinary Q&A, start with one broad search using short, discriminative
    keywords. If the top results contain enough support for the core request,
    answer from those results.

    Make another retrieval call only when a required fact, owner, date, ID, or
    source is missing; the user asked for exhaustive coverage or comparison; a
    specific artifact must be read; or an important claim would otherwise be
    unsupported.

    Do not search again only to improve phrasing, add examples, or support
    nonessential detail.

针对研究和综合：

- 仅引用检索到的来源；
- 将引用附加到其支持的声明上；
- 将推断与直接支持的事实分开标注；
- 说明来源之间的冲突；
- 缩小答案范围或报告缺失证据，而非猜测。

对于创意草稿，需区分有来源支撑的事实与创意性措辞。不要为了增强草稿说服力而虚构名称、指标、日期、路线图状态、客户成果或产品能力。

## 长时间运行的工作流与状态

对于多步骤或工具密集型任务，在首次工具调用前，提示模型简短可见的前导内容，然后在重大阶段变化时提供稀疏的、基于结果的更新。不要要求模型叙述常规工具调用。

    Before tool calls for a multi-step task, send a one- or two-sentence
    user-visible update that states the first step. During the task, update only
    when a major phase begins or a finding changes the plan. Each update should
    state one concrete outcome and the next step.

回放历史时保留助手阶段值，以便模型区分评论与最终答案。如果使用previous_response_id，则之前的助手状态会自动保留。如果手动回放历史，保持每个原始阶段值不变。

在重大里程碑后压缩，而不是每轮都压缩。压缩后保持提示词功能一致，并将压缩项视为不透明状态。

当目标、假设和优先级在轮次间保持稳定时，持久化的推理是有用的。当早期推理不再相关时，使用当前轮次的行为。不要将持久化推理视为始终开启的优化：过时的推理会增加令牌数、提高延迟，并使模型锚定于过时的方法。

提示词缓存也影响提示词的构建。保持可重用前缀的稳定性，避免大型系统提示词中不必要的变更。仅在明确改善测量到的缓存行为和负载成本时，使用显式缓存断点。

## 推理努力程度

在更改推理力度之前，先以当前的推理力度建立基线。

- 以当前 GPT-5.5 或 GPT-5.4 的推理投入作为基线。
- 在代表性任务上测试相同设置及低一级的设置。
- 在保持质量的前提下，对延迟敏感的工作使用低设置。
- 使用中等设置作为平衡起点。
- 仅当评估显示有显著提升时，才使用高或极高设置。
- 将最高设置保留给最注重质量的工作负载；不要全局推荐使用。

在增加推理努力之前，检查提示词是否缺少成功标准、依赖规则、工具路由规则或验证循环。

## 前端与视觉任务

GPT-5.6 在布局、视觉层次和设计判断方面更强大。仍需提供产品背景，保留现有设计体系，并标注重要的状态和约束。

对于增量前端更改：

- 检查并保留现有的设计令牌、组件和模式；
- 除非被要求，否则不添加额外功能或装饰性 UI；
- 保留响应式行为和预期的状态；
- 在最终确定前渲染并检查结果。

对于视觉、计算机使用、本地化或 OCR 任务，当空间精度至关重要时，请有意选择图像细节。当额外的输入成本和延迟合理时，对大型、密集或坐标敏感的图像使用原始细节。

## 完成前检查工作

为 GPT-5.6 提供能够验证输出的工具，并说明哪些验证是重要的。

对于编码：

```text
After making changes, run the most relevant validation available:
- targeted tests for changed behavior
- type checks or lint checks when applicable
- build checks for affected packages
- a minimal smoke test when full validation is too expensive

If validation cannot be run, explain why and describe the next best check.
```

对于视觉工件：

    Render the artifact before finalizing. Inspect layout, clipping, spacing,
    missing content, and visual consistency. Revise until the rendered output
    matches the requirements.

对于实施计划，包括需求、命名资源或文件、状态转换或数据流、验证检查、失败行为、隐私或安全考虑，以及对实施有实质性影响的未决问题。

## 建议的提示词结构

以此结构作为复杂提示词的起点。保持每个部分简洁。仅在会改变行为的地方添加细节。

    Role: [the model's function and context]

    Personality: [tone and collaboration style]

    Goal: [user-visible outcome]

    Success criteria: [what must be true before the final answer]

    Constraints: [policy, safety, business, evidence, and side-effect limits]

    Tools: [which tools to use, when, and what not to use]

    Output: [sections, length, format, and tone]

    Stop rules: [when to retry, fallback, abstain, ask, or stop]

## 提示词迁移工作流

当将现有应用程序迁移到 GPT-5.6 时：

1. 切换模型并保持当前推理努力程度。
2. 在更改提示词之前运行有代表性的评估。
3. 移除过时的脚手架、重复的指令和不相关的工具。
4. 仅添加最小的针对性指令来修复已测得的回归。
5. 每次更改提示词或推理后重新运行评估。

不要一次性重写一套能够正常工作的提示词组合。否则，你无法分辨行为变化究竟是来自模型、推理设置、提示词、工具集，还是运行时环境。

当提示词出现性能回退时，使用一小部分真实追踪记录进行调试。先识别失败模式，找出可能引起问题的指令或矛盾之处，进行精准修改，然后重新运行相同的测试用例。