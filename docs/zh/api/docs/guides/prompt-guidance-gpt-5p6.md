# GPT-5.6 Sol 提示指南

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。你可以在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

# GPT-5.6 Sol 提示指南

在为 GPT-5.6 Sol 或 GPT-5.6 系列适配提示、工具描述、智能体 指令或提示栈时参考本指南。请结合最新的 [GPT-5.6 模型指南](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.6) 了解 API 细节、限制、价格和功能可用性。

GPT-5.6 在如下场景下表现最佳：由提示定义预期结果、关键约束、可用证据和完成标准，然后为模型留出选择高效路径的空间。

移除重复的指令和示例，并简化工具描述，可提升任务表现与 token 使用效率。在一组内部编码 智能体 评测中，使用更精简系统提示的配置将评测分数提高了约 10–15%，同时总 token 数减少了 41–66%，成本下降了 33–67%。不同工作负载下的结果会有所差异，因此请将这些范围视为参考方向，并基于你自有应用中的代表性任务验证改动效果。

## 先简化提示词

从一个已经可用的提示词和工具集开始。每次移除一组指令、示例或工具，然后重新运行相同的评测。

精简：

- 对同一条规则的重复陈述；
- 不改变行为的重复风格或流程说明；
- 不改变行为的示例；
- 针对模型已经能够稳定执行的行为的流程说明；
- 与任务无关的工具和工具描述。

保留：

- 用户可见的结果；
- 成功标准与停止条件；
- 安全、业务、证据与权限约束；
- 当路由依赖上下文时的工具路由规则；
- 所需的输出结构与校验要求。

回顾剩余的指令是否存在矛盾。GPT-5 类模型会严格遵循提示契约，因此相互冲突的规则可能比细节缺失带来更多不稳定性。

## 结果导向的提示与停止条件

描述目标，而不是规定每一步。当提示阐明"良好结果"的标准时，GPT-5.6 通常能自行选择高效的搜索、工具或推理路径。

建议采用：

```text
Resolve the customer's issue end to end.

Success means:
- make the eligibility decision from available policy and account evidence
- complete any allowed action before responding
- return completed_actions, customer_message, and blockers
- if required evidence is missing, ask for the smallest missing field
```

避免不必要的绝对规则。将 ALWAYS、NEVER、must、only 用于真正的不变项，例如安全规则、必填字段或绝不应发生的动作。对于需要判断的情况，例如何时搜索、提问、使用工具或继续迭代，应优先使用决策规则。

保留用户明确指定的值。当正确值是隐含的时，提供决策标准，让模型根据上下文或 schema 进行推理。避免使用通用默认值、关键词映射和宽泛的语义捷径。

添加停止条件：

    Resolve the request in the fewest useful tool loops, but do not let loop
    minimization outrank correctness, required evidence, calculations, or
    required citations.

    After each result, ask whether the core request can now be answered with
    useful evidence. If yes, answer. If required evidence is still missing,
    name the missing fact and use the smallest useful fallback.

## 个性化、协作与响应长度

GPT-5.6 默认情况下往往比 GPT-5.5 更简洁。在迁移时，检查像“保持简洁”或“简短一些”这样的笼统简洁指令是否仍然有用。它们对某些任务可能并不必要，有时反而会让回答过于简短。如果这些指令能稳定产出你的应用所需的结果，就保留它们。

如果希望在多个请求中获得更一致的控制，请在 `text.verbosity` 中设置默认的详细程度，然后用提示词指定任务相关的需求。选择 `low`, `medium`，或 `high` 作为请求的默认详细程度。在提示词中指定任何任务特定的长度、结构或必需内容。详见 [设置 `text.verbosity`](https://developers.openai.com/api/docs/guides/deployment-checklist#set-up-textverbosity) 中的 API 示例。

对于面向客户的助手和协作类产品，需同时定义人格与协作风格。

- 个性控制语气、温暖感、直接程度、正式程度、幽默感、同理心与表达精致度。
- 协作风格控制模型何时提问、做出假设、主动推进、解释权衡、检查工作以及处理不确定性。

两者都应保持简洁。性格设定应塑造用户体验；协作指令应塑造任务行为。两者都不应取代清晰的目标、成功的判定标准、工具规则或停止条件。

当任务要求更简短的回复时，应明确模型必须保留的信息以及可以省略的细节。例如：

    Lead with the conclusion. Include the evidence needed to support it, any material
    caveat, and the next action. Omit secondary detail and repetition.

    Keep all required facts, decisions, caveats, and next steps. Trim introductions,
    repetition, generic reassurance, and optional background first.

这为模型提供了一个明确的优先级顺序：先保留完成任务所需的内容，再删去价值较低的细节。

诸如“friendly”（友好）或“empathetic”（共情）之类的笼统标签可能存在歧义。应当描述定义你产品语气的写作选择，例如：如何直接陈述答案、何时承认问题，以及是否适合给出安慰或结束语。

    State the answer directly. If the user reports a problem, acknowledge the
    specific issue before giving the next step. Use reassurance only when it is
    relevant. Omit generic praise and unnecessary sign-offs.

避免使用诸如“始终使用用户语言回复”之类的笼统语言规则，除非这确实是产品需求。应明确指定预期的输出语言及其适用场景。

对于编辑、改写、摘要以及面向客户的草稿，应明确告知模型需要保留的内容：

    Preserve the requested artifact, length, structure, genre, and factual claims
    first. Improve clarity, flow, and correctness without adding new claims,
    sections, or a more promotional tone unless requested.

## 定义自主性与审批边界

GPT-5.6 在执行多步骤任务时可以主动且持续地推进。为每个请求明确授权的行动范围，使模型能够在不必要暂停的情况下继续安全、范围内的工作，同时在涉及外部操作、破坏性操作、高成本操作或超出范围的操作之前停止。

一份简洁的策略通常就足够了：

    For requests to answer, explain, review, diagnose, or plan, inspect the
    relevant materials and report the result. Do not implement changes unless
    the request also asks for them.

    For requests to change, build, or fix, make the requested in-scope local
    changes and run relevant non-destructive validation without asking first.

    Require confirmation for external writes, destructive actions, purchases,
    or a material expansion of scope.

明确列出安全的本地操作，例如读取文件、检查日志、编辑范围内的代码以及运行测试。把策略集中放在一处，每条规则只陈述一次。像“先询问”“不要变更”“等待批准”这样的重复指令，可能会导致对安全、预期内的操作产生不必要的批准请求。

对于长期运行的任务，明确当前的工作层级。区分研究、设计、实现、评审和外部协调，避免模型在各层级之间静默切换。

## 工具路由

仅暴露与任务相关的工具。工具描述应说明工具的功能、使用场景、重要的返回字段以及错误行为。

当正确性依赖于前置的检索或查找时，需明确说明：

    Before taking an action, resolve required discovery, retrieval, and
    validation steps. Do not skip a prerequisite because the intended final
    state seems obvious.

当多个读取操作相互独立时，应将它们并行化。当一个结果决定下一步操作时，应保持顺序执行。在并行检索之后，应先综合结果再采取行动。

如果某个工具返回为空、不完整或异常狭窄的结果，在断定不存在结果之前，尝试一到两次有意义的回退方案。

## 程序化工具调用

Programmatic Tool Calling（PTC）最适合有明确边界的工作流，在这些工作流中，代码可以处理多个工具结果或较大的中间输出，并返回一个更小的结构化结果。

仅仅需要多次调用、并行调用或依赖调用，并不能成为使用 Programmatic Tool Calling 的理由。

适用场景：

- 过滤、连接、排序、排名、去重和聚合；
- 对大量相似记录进行批处理；
- 重复的确定性校验；
- 可被压缩为紧凑 schema 的大型结构化结果。

在以下情况下优先使用直接工具调用：

- 一次调用即可完成；
- 中间输出本身已经很小；
- 每个结果都可能影响下一步决策；
- 某个动作需要批准；
- 最终答案必须保留引用或原生产物；
- 该 工作流 需要在调用之间进行语义判断。

不要依赖诸如“高效使用程序化工具调用”这样的通用指令。要说明有界的阶段、允许使用的工具、输出结构、重试上限、停止条件，以及回到直接模型判断的交接。

    Use Programmatic Tool Calling only for the bounded record-reduction stage.
    Call only the documented read-only tools. Filter and deduplicate the
    intermediate results, then emit exactly the required compact schema with
    evidence fields. Retry transient failures at most twice. Use direct tool
    calls for approval, semantic judgment, citations, and final validation.

如果两条路径都需要，定义一条清晰的交接，并告诉模型不要切换路径或重复已完成的工作。

该 `program_output` item 和最终 assistant `message` 是彼此独立的输出；务必分别测试。理论上，程序可能返回正确的记录，而消息却遗漏了必需的字段、引用或注意事项。

在相同的代表性任务上比较直接调用和程序化调用。检查最终响应是否正确、完整，并包含所需的证据。然后比较总 token 数、延迟、成本、调用次数、轮次和重试次数。仅当响应仍能通过你现有的评估时，才将更低的资源使用视为改进。

## 接地、引用与检索预算

对于有依据的答案，引用行为应当作为提示的一部分。需要明确说明什么内容需要佐证、什么算作充分证据，以及在缺少证据时该如何应对。缺少证据不应自动等同于事实层面的“否定”。

    For ordinary Q&A, start with one broad search using short, discriminative
    keywords. If the top results contain enough support for the core request,
    answer from those results.

    Make another retrieval call only when a required fact, owner, date, ID, or
    source is missing; the user asked for exhaustive coverage or comparison; a
    specific artifact must be read; or an important claim would otherwise be
    unsupported.

    Do not search again only to improve phrasing, add examples, or support
    nonessential detail.

对于研究与综合分析：

- 仅引用检索到的来源；
- 为每项主张附上对应的引用；
- 将推断与直接支持的事实分别标注；
- 说明来源之间的冲突；
- 缩小答案范围或报告缺失证据,而不是猜测。

在创意类撰写中，要区分有来源支持的事实与创意性措辞。不要为了使稿件听上去更有力而虚构姓名、指标、日期、路线图状态、客户成果或产品能力。

## 长时间运行的工作流和状态

对于多步骤或工具调用密集的任务，应在首次工具调用前提示模型输出一段简短的可见前言，然后在主要阶段切换时给出稀疏的、基于结果的更新。不要让模型对例行的工具调用进行叙述。

    Before tool calls for a multi-step task, send a one- or two-sentence
    user-visible update that states the first step. During the task, update only
    when a major phase begins or a finding changes the plan. Each update should
    state one concrete outcome and the next step.

在重放历史记录时保留助手阶段（phase）值，以便模型能够区分评论与最终答案。如果使用 previous_response_id，之前的助手状态会自动保留。如果是手动重放历史记录，请原样保留每个原始阶段值，不要更改。

在主要里程碑之后进行压缩，而不是在每一轮都压缩。压缩后保持提示在功能上的一致性，并将被压缩的项视为不透明状态。

当目标、假设和优先级在多轮对话中保持稳定时，持续保留的推理是有用的。当先前的推理不再相关时，则使用当前轮的行为。不要将持续保留的推理视为始终启用的优化：过时的推理会增加 token 数、提高延迟，并使模型锚定在已过时的方法上。

提示缓存也会影响提示的构建。保持可复用前缀的稳定，避免在大型系统提示中进行不必要的变更。仅当显式缓存断点能够改善工作负载下实测的缓存行为和成本时，才使用它们。

## Reasoning effort

在更改当前的推理强度之前，先建立基线。

- 保留当前的 GPT-5.5 或 GPT-5.4 推理 effort 作为基线。
- 在代表性任务上测试相同设置以及低一级的设置。
- 在保证质量的前提下，对延迟敏感的工作使用 low。
- 使用 medium 作为平衡的起点。
- 仅当评估显示有显著收益时才使用 high 或 xhigh。
- 将 max 留给最难的、质量优先的工作负载；不要全局推荐它。

在提高推理投入之前，先检查提示是否缺少成功标准、依赖规则、工具路由规则或验证循环。

## 前端与可视化任务

GPT-5.6 在布局、视觉层次和设计判断方面表现更强。仍需提供产品上下文，保留现有设计系统，并标明关键的状态和约束。

对于增量式前端变更：

- 检视并保留现有的设计令牌、组件和模式；
- 除非被要求，否则不要添加额外功能或装饰性 UI；
- 保持响应式行为和预期的状态；
- 在最终确定前渲染并检视结果。

对于涉及视觉、计算机使用、定位或 OCR 等对空间精度有要求的任务，请有意识地选择图像细节级别。当额外输入成本和延迟可接受时，对体积较大、内容密集或对坐标敏感的图片使用 original 细节级别。

## Check work before finishing

为 GPT-5.6 提供能够校验输出的工具，并说明哪些校验是重要的。

对于编码任务：

```text
After making changes, run the most relevant validation available:
- targeted tests for changed behavior
- type checks or lint checks when applicable
- build checks for affected packages
- a minimal smoke test when full validation is too expensive

If validation cannot be run, explain why and describe the next best check.
```

对于可视化产物：

    Render the artifact before finalizing. Inspect layout, clipping, spacing,
    missing content, and visual consistency. Revise until the rendered output
    matches the requirements.

对于实施方案，应包含需求、命名的资源或文件、状态转换或数据流、校验检查、失败行为、隐私或安全考量，以及对实施有实质影响的开放性问题。

## 建议的提示结构

将该结构用作复杂提示词的起点。每个部分保持简洁，仅在影响行为的地方补充细节。

    Role: [the model's function and context]

    Personality: [tone and collaboration style]

    Goal: [user-visible outcome]

    Success criteria: [what must be true before the final answer]

    Constraints: [policy, safety, business, evidence, and side-effect limits]

    Tools: [which tools to use, when, and what not to use]

    Output: [sections, length, format, and tone]

    Stop rules: [when to retry, fallback, abstain, ask, or stop]

## 提示词迁移 工作流

将现有应用迁移到 GPT-5.6 时：

1. 切换模型并保留当前的推理力度。
2. 在修改提示词之前运行具有代表性的评估。
3. 移除过时的脚手架、重复的指令以及无关的工具。
4. 仅添加能修复已测量回归问题的最小且有针对性的指令。
5. 在每次修改提示词或推理设置后重新运行评估。

不要一次性重写整个可用的提示栈。否则你无法判断行为变化是来自模型、推理设置、提示、工具集还是运行时。

当提示出现回退时，使用一小批真实追踪对其进行调试。识别失败模式，找出可能导致该失败的指令或矛盾之处，进行精确修改，然后重新运行相同的用例。