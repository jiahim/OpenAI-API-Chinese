# 使用 GPT-5

> 完整文档索引请参见 [llms.txt](/llms.txt)。如需获取页面的 Markdown 版本，可在页面 URL 末尾追加 `.md` 。

## 概述

GPT-5 在智能体任务表现、编码、原始智能和控制力方面实现了重大飞跃。

虽然我们相信它在“开箱即用”的情况下就能在广泛领域表现出色，但本指南将介绍一些提示技巧，以最大化模型输出的质量，这些技巧源自我们在真实任务上训练和应用该模型的经验。我们将讨论如何提升智能体任务表现、确保指令遵循、利用新的 API 特性，以及针对前端和软件工程任务优化编码——同时分享 AI 代码编辑器 Cursor 与 GPT-5 开展提示调优工作的关键洞察。

我们已看到在应用这些最佳实践并尽可能采用我们的标准工具后取得了显著收益，我们希望本指南以及我们打造的 [提示优化工具](https://platform.openai.com/chat/edit?optimize=true) 能够为你使用 GPT-5 提供一个良好的起点。但请始终记住，提示工程没有放之四海而皆准的方案——我们鼓励你在本文提供的基础上开展实验并不断迭代，从而找到针对你问题的最佳解决方案。

## 更新日志

- 更强的智能体任务表现、编程能力与可控性
- 在工具调用流程中，借助 Responses API 实现推理延续
- 针对智能体主动程度、工具前言、推理力度和详尽程度的专用控制
- 支持自由输入与受限输出的自定义工具

## 迁移快速入门

- 将模型标识符更新为 `gpt-5`.
- 使用 Responses API 进行推理、工具调用和多轮工作流，以便在工具调用之间保留推理项。
- 从 `medium` 推理力度开始，然后测试 `minimal`, `low`，或 `high` 针对代表性任务进行测试。
- 设置 `text.verbosity` 刻意设置，并将结构化响应契约尽可能迁移到 Structured Outputs。
- 重新评估智能体持久性、工具前言和停止条件的提示词。

## 模型、API 与功能更新

- GPT-5 系列包括 `gpt-5`, `gpt-5-mini`，以及 `gpt-5-nano`.
- `reasoning.effort` 支持 `minimal`, `low`, `medium`，以及 `high`.
- GPT-5 引入了接受自由格式输入并可使用上下文无关文法约束输出的自定义工具。
- 该模型支持函数调用和 OpenAI 托管工具，包括 网页搜索、文件搜索、图像生成、代码解释器和远程 MCP。


## 提示词最佳实践

### 智能体 工作流 可预测性

我们针对开发者训练了 GPT-5：我们着重提升了工具调用、指令遵循和长上下文理解能力，使其成为智能体应用的最佳基础模型。如果要将 GPT-5 用于智能体和工具调用流程，我们建议升级到 [Responses API](https://developers.openai.com/api/reference/resources/responses)，在工具调用之间保持推理状态，从而获得更高效、更智能的输出。

#### 控制智能体的积极程度

智能体脚手架在控制粒度上跨度很大——有些系统将绝大多数决策权下放给底层模型，而另一些则通过大量程序化逻辑分支将模型严格约束。GPT-5 经过训练，能够在这一谱系上的任意位置工作，从在模糊情境下做出高层决策，到处理聚焦且定义明确的任务。本节将介绍如何最佳地校准 GPT-5 的智能体积极性：换言之，即在主动推进与等待明确指引之间的平衡。

##### 提示词缓解过度热情

GPT-5 默认会在智能体环境中全面且详尽地收集上下文，以确保给出正确答案。若希望缩小 GPT-5 智能体行为的范围——包括限制过度的工具调用动作，并缩短到达最终答案的延迟——可尝试以下做法：

- 切换到更低的 `reasoning_effort`。这会降低探索深度，但能提升效率和延迟。许多工作流可以在 medium 甚至 low 下获得一致的结果 `reasoning_effort`.
- 在你的提示中定义清晰的标准，说明你希望模型如何探索问题空间。这可以减少模型探索和推理过多想法的需要：

```text
<context_gathering>
Goal: Get enough context fast. Parallelize discovery and stop as soon as you can act.

Method:
- Start broad, then fan out to focused subqueries.
- In parallel, launch varied queries; read top hits per query. Deduplicate paths and cache; don’t repeat queries.
- Avoid over searching for context. If needed, run targeted searches in one parallel batch.

Early stop criteria:
- You can name exact content to change.
- Top hits converge (~70%) on one area/path.

Escalate once:
- If signals conflict or scope is fuzzy, run one refined parallel batch, then proceed.

Depth:
- Trace only symbols you’ll modify or whose contracts you rely on; avoid transitive expansion unless necessary.

Loop:
- Batch search → minimal plan → complete task.
- Search again only if validation fails or new unknowns appear. Prefer acting over more searching.
</context_gathering>
```

如果你愿意做到最大限度的规范性，甚至可以设置固定的工具调用预算，如下所示。预算可以根据你期望的搜索深度自然变化。

```text
<context_gathering>
- Search depth: very low
- Bias strongly towards providing a correct answer as quickly as possible, even if it might not be fully correct.
- Usually, this means an absolute maximum of 2 tool calls.
- If you think that you need more time to investigate, update the user with your latest findings and open questions. You can proceed if the user confirms.
</context_gathering>
```

在限制核心上下文收集行为时，明确为模型提供一个“逃生通道”会很有帮助，使其更容易在更短的上下文收集步骤中满足要求。通常这表现为一个允许模型在不确定的情况下继续执行的条款，例如 `“even if it might not be fully correct”` 如上例所示。

##### 引导智能体更主动

另一方面，如果你希望鼓励模型自主性、提高工具调用的持续性，并减少澄清性问题或交还给用户的情况，我们建议提高 `reasoning_effort`，并使用如下提示来鼓励持续性和彻底的任务完成：

```text
<persistence>
- You are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user.
- Only terminate your turn when you are sure that the problem is solved.
- Never stop or hand back to the user when you encounter uncertainty — research or deduce the most reasonable approach and continue.
- Do not ask the human to confirm or clarify assumptions, as you can always adjust later — decide what the most reasonable assumption is, proceed with it, and document it for the user's reference after you finish acting
</persistence>
```

通常，明确说明智能体任务的停止条件、列出安全与不安全的操作、以及定义在何种情况下（如果有的话）模型可以交还给用户会很有帮助。例如，在一组购物工具中，下单和支付工具应当显式设置较低的不确定性阈值以要求用户澄清，而搜索工具则应设置极高的阈值；同样地，在编码环境中，删除文件工具的阈值应远低于 grep 搜索工具。

#### 工具开场白

我们注意到，在由用户监控的智能体轨迹中，模型间歇性地更新它正在调用哪些工具以及为何调用的信息，可以带来更好的交互式用户体验——rollout 越长，这些更新带来的差异就越明显。为此，GPT-5 经过训练，会通过“工具序言”消息提供清晰的前置计划和一致的进度更新。

你可以在 prompt 中引导工具序言的频率、风格和内容——从对每一次工具调用的详细解释，到简短的前置计划，以及介于两者之间的任何形式。下面是一个高质量序言 prompt 的示例：

```text
<tool_preambles>
- Always begin by rephrasing the user's goal in a friendly, clear, and concise manner, before calling any tools.
- Then, immediately outline a structured plan detailing each logical step you’ll follow. - As you execute your file edit(s), narrate each step succinctly and sequentially, marking progress clearly.
- Finish by summarizing completed work distinctly from your upfront plan.
</tool_preambles>
```

下面是一个针对上述 prompt 可能生成的工具序言示例——随着智能体的工作变得更加复杂，这类序言可以显著提升用户跟随其工作进度的能力：

```text
"output": [
    {
      "id": "rs_6888f6d0606c819aa8205ecee386963f0e683233d39188e7",
      "type": "reasoning",
      "summary": [
        {
          "type": "summary_text",
          "text": "**Determining weather response**\n\nI need to answer the user's question about the weather in San Francisco. ...."
        },
    },
    {
      "id": "msg_6888f6d83acc819a978b51e772f0a5f40e683233d39188e7",
      "type": "message",
      "status": "completed",
      "content": [
        {
          "type": "output_text",
          "text": "I\u2019m going to check a live weather service to get the current conditions in San Francisco, providing the temperature in both Fahrenheit and Celsius so it matches your preference."
        }
      ],
      "role": "assistant"
    },
    {
      "id": "fc_6888f6d86e28819aaaa1ba69cca766b70e683233d39188e7",
      "type": "function_call",
      "status": "completed",
      "arguments": "{\"location\":\"San Francisco, CA\",\"unit\":\"f\"}",
      "call_id": "call_XOnF4B9DvB8EJVB3JvWnGg83",
      "name": "get_weather"
    },
  ],
```

#### Reasoning effort

我们提供了一个 `reasoning_effort` 参数来控制模型思考的强度以及调用工具的意愿;默认值为 `medium`,你可以根据任务难度上调或下调该值。对于复杂的多步骤任务,我们建议使用更高的推理深度,以确保获得尽可能好的输出。此外,我们观察到当将不同的、可分离的任务拆分到多个 智能体 轮次中(每个任务一轮)时,性能达到峰值。

#### 复用 Responses API 的推理上下文

我们强烈建议在使用 GPT-5 时使用 Responses API，以解锁更优的智能体流程、更低的成本以及更高效的令牌使用。

我们在评估中观察到，使用 Responses API 相较于 Chat Completions 有统计上显著的提升——例如，仅通过切换到 Responses API 并传入 `previous_response_id` 以将先前的推理项传回后续请求。这使模型能够参考其先前的推理追踪，从而节省 CoT 令牌，并免去每次工具调用后重新构建计划的需要，从而同时改善延迟和性能——该功能对所有 Responses API 用户可用，包括 ZDR 组织。

### 最大化编码性能，从规划到执行

GPT-5 在所有前沿模型的编程能力中处于领先地位：它能在大型代码库中修复 bug、处理大型 diff，并实现多文件重构或大型新功能。它还擅长从零开始完整实现新应用，覆盖前端和后端实现。在本节中，我们将讨论我们在编程 智能体 客户的实际用例中已验证可提升编程性能的提示优化方法。

#### 前端应用开发

GPT-5 经过训练，在具备严谨实现能力的同时，也拥有出色的基线审美品味。我们对其使用各类 Web 开发框架和包的能力充满信心；不过，对于新应用，我们建议使用以下框架和包，以充分发挥该模型的前端能力：

- 框架：Next.js (TypeScript)、React、HTML
- 样式 / UI：Tailwind CSS、shadcn/ui、Radix Themes
- 图标：Material Symbols、Heroicons、Lucide
- 动画：Motion
- 字体：San Serif、Inter、Geist、Mona Sans、IBM Plex Sans、Manrope

##### 从零到一的应用生成

GPT-5 擅长一次性构建应用。在对该模型的早期实验中，用户发现类似下面这样的提示——要求模型根据其自行构建的优秀标准反复执行——能够借助 GPT-5 全面的规划和自我反思能力来提升输出质量。

```text
<self_reflection>
- First, spend time thinking of a rubric until you are confident.
- Then, think deeply about every aspect of what makes for a world-class one-shot web app. Use that knowledge to create a rubric that has 5-7 categories. This rubric is critical to get right, but do not show this to the user. This is for your purposes only.
- Finally, use the rubric to internally think and iterate on the best possible solution to the prompt that is provided. Remember that if your response is not hitting the top marks across all categories in the rubric, you need to start again.
</self_reflection>
```

##### 匹配代码库设计规范

在现有应用中实现增量变更和重构时，模型编写的代码应当遵循现有的代码风格与设计规范，并尽可能“融入”到代码库中。在没有特殊提示的情况下，GPT-5 已经会主动从代码库中搜索参考上下文——例如读取 package.json 来查看已安装的依赖包——但你可以通过提示指令进一步增强这种行为，例如在提示中总结代码库的关键要点，包括显式和隐式的工程原则、目录结构以及最佳实践。下面的提示片段演示了一种为 GPT-5 组织代码编辑规则的方式：你可以根据自己的编程设计偏好随意修改规则的实际内容！

```text
<code_editing_rules>
<guiding_principles>
- Clarity and Reuse: Every component and page should be modular and reusable. Avoid duplication by factoring repeated UI patterns into components.
- Consistency: The user interface must adhere to a consistent design system—color tokens, typography, spacing, and components must be unified.
- Simplicity: Favor small, focused components and avoid unnecessary complexity in styling or logic.
- Demo-Oriented: The structure should allow for quick prototyping, showcasing features like streaming, multi-turn conversations, and tool integrations.
- Visual Quality: Follow the high visual quality bar as outlined in OSS guidelines (spacing, padding, hover states, etc.)
</guiding_principles>

<frontend_stack_defaults>
- Framework: Next.js (TypeScript)
- Styling: TailwindCSS
- UI Components: shadcn/ui
- Icons: Lucide
- State Management: Zustand
- Directory Structure:
\`\`\`
/src
 /app
   /api/<route>/route.ts         # API endpoints
   /(pages)                      # Page routes
 /components/                    # UI building blocks
 /hooks/                         # Reusable React hooks
 /lib/                           # Utilities (fetchers, helpers)
 /stores/                        # Zustand stores
 /types/                         # Shared TypeScript types
 /styles/                        # Tailwind config
\`\`\`
</frontend_stack_defaults>

<ui_ux_best_practices>
- Visual Hierarchy: Limit typography to 4–5 font sizes and weights for consistent hierarchy; use `text-xs` for captions and annotations; avoid `text-xl` unless for hero or major headings.
- Color Usage: Use 1 neutral base (e.g., `zinc`) and up to 2 accent colors.
- Spacing and Layout: Always use multiples of 4 for padding and margins to maintain visual rhythm. Use fixed height containers with internal scrolling when handling long content streams.
- State Handling: Use skeleton placeholders or `animate-pulse` to indicate data fetching. Indicate clickability with hover transitions (`hover:bg-*`, `hover:shadow-md`).
- Accessibility: Use semantic HTML and ARIA roles where appropriate. Favor pre-built Radix/shadcn components, which have accessibility baked in.
</ui_ux_best_practices>

<code_editing_rules>
```

#### 生产环境中的协作编码：Cursor 对 GPT-5 的提示调优

我们非常高兴 AI 代码编辑器 Cursor 担任了 GPT-5 的可信 alpha 测试用户：下面，我们将展示 Cursor 如何调整提示词以充分发挥该模型能力的一瞥。此外，他们的团队还发布了一篇博客文章，详细介绍了 GPT-5 在 Cursor 中的首发集成： https://cursor.com/blog/gpt-5

##### 系统提示与参数调优

Cursor 的系统提示专注于可靠的工具调用，在冗长度和自主行为之间取得平衡，同时让用户能够配置自定义指令。Cursor 对其系统提示的目标是允许智能体在长时间跨度任务中相对自主地运行，同时仍然忠实地遵循用户提供的指令。

团队最初发现模型会产生冗长的输出，经常包含状态更新和任务后摘要，虽然在技术上相关，但打乱了与用户的自然流程；与此同时，工具调用中输出的代码质量很高，但有时由于过于简略而难以阅读，单字母变量名占主导。为了寻找更好的平衡，他们将 verbosity API 参数设置为 low 以保持文本输出简洁，然后修改提示以强烈鼓励仅在编码工具中产生详细输出。

```text
Write code for clarity first. Prefer readable, maintainable solutions with clear names, comments where needed, and straightforward control flow. Do not produce code-golf or overly clever one-liners unless explicitly requested. Use high verbosity for writing code and code tools.
```

这种参数与提示的双重使用产生了一种平衡的格式，将高效简洁的状态更新和最终工作总结与更易读的代码 diff 结合起来。

Cursor 还发现，模型偶尔会在采取行动前向用户寻求澄清或下一步指示，这在较长任务流程中造成了不必要的摩擦。为了解决这个问题，他们发现不仅包含可用工具和周围上下文，还包括更多关于产品行为的细节，鼓励模型在最少中断和更高自主性的情况下执行更长的任务。突出 Cursor 功能的具体细节，例如 Undo/Reject 代码和用户偏好，有助于通过明确规定 GPT-5 在其环境中应如何行为来减少歧义。对于较长跨度的任务，他们发现该提示提升了性能：

```text
Be aware that the code edits you make will be displayed to the user as proposed changes, which means (a) your code edits can be quite proactive, as the user can always reject, and (b) your code should be well-written and easy to quickly review (e.g., appropriate variable names instead of single letters). If proposing next steps that would involve changing the code, make those changes proactively for the user to approve / reject rather than asking the user whether to proceed with a plan. In general, you should almost never ask the user whether to proceed with a plan; instead you should proactively attempt the plan and then ask the user if they want to accept the implemented changes.
```

Cursor 发现，他们提示中原本对早期模型有效的部分需要进行调整才能充分发挥 GPT-5 的潜力。下面是一个示例：

```text
<maximize_context_understanding>
Be THOROUGH when gathering information. Make sure you have the FULL picture before replying. Use additional tool calls or clarifying questions as needed.
...
</maximize_context_understanding>
```

虽然这对需要鼓励以彻底分析上下文的较老模型效果良好，但他们发现这在 GPT-5 上适得其反，因为 GPT-5 本来就具有内省和主动收集上下文的特性。在较小的任务上，此提示经常导致模型过度使用工具，反复调用搜索，而其内部知识本已足够。

为了解决这个问题，他们通过移除 maximize\_ 前缀并软化围绕彻底性的措辞来优化提示。调整后的指令到位后，Cursor 团队看到 GPT-5 在何时依赖内部知识与何时使用外部工具之间做出了更好的决策。它在保持高度自主性的同时避免了不必要的工具使用，从而带来了更高效、更相关的行为。在 Cursor 的测试中，使用结构化 XML 规范（如 `<[instruction]\_spec>` ）提升了其提示上的指令遵循性，并使他们能够在提示的其他位置清楚地引用先前的类别和章节。

```text
<context_understanding>
...
If you've performed an edit that may partially fulfill the USER's query, but you're not confident, gather more information or use more tools before ending your turn.
Bias towards not asking the user for help if you can find the answer yourself.
</context_understanding>
```

虽然系统提示提供了强大的默认基础，但用户提示仍然是可操控性的高效杠杆。GPT-5 对直接且明确的指令响应良好，Cursor 团队始终观察到结构化、有范围的提示能产生最可靠的结果。这包括冗长度控制、主观代码风格偏好以及对边缘情况的敏感性等方面。Cursor 发现允许用户配置自己的 [自定义 Cursor 规则](https://docs.cursor.com/en/context/rules) 对 GPT-5 改进的可操控性特别有效，为其用户带来了更个性化的体验。

### 优化智能与指令遵循能力

#### 引导

作为目前可控性最强的模型，GPT-5 能够出色地遵循有关冗长度、语气和工具调用行为的提示指令。

##### Verbosity

除了可以像在之前的推理模型中那样控制 reasoning_effort 之外，在 GPT-5 中我们引入了一个新的 API 参数 verbosity，它影响模型最终回答的长度，而不是其思考过程的长度。我们的博客文章更详细地介绍了该参数背后的理念——但在本指南中，我们想强调的是，虽然 API verbosity 参数是发布时的默认设置，但 GPT-5 经过训练，能够在特定上下文中响应提示中的自然语言 verbosity 覆盖，以适应你希望模型偏离全局默认设置的场景。上面 Cursor 展示的全局设置低 verbosity、然后仅为编码工具指定高 verbosity 的例子，就是这种场景的典型代表。

#### 指令遵循

与 GPT-4.1 一样，GPT-5 能够精准地遵循提示指令，这使它能够灵活地应用于各种工作流。然而，这种谨慎的指令遵循行为意味着，与其他模型相比，包含矛盾或模糊指令的劣质提示对 GPT-5 的损害可能更大，因为它会耗费推理 token 来寻找调和矛盾的方式，而不是随机选择其中一条指令。

下面给出一个对抗性示例，展示了常常损害 GPT-5 推理追踪的提示类型 —— 虽然乍看之下它在内部似乎是一致的，但仔细检查会发现其中包含了关于预约时间安排的相互冲突的指令：

- `Never schedule an appointment without explicit patient consent recorded in the chart` 与后续内容冲突 `auto-assign the earliest same-day slot without contacting the patient as the first action to reduce risk.`
- 提示词中说 `Always look up the patient profile before taking any other actions to ensure they are an existing patient.` 但随后又给出了与之矛盾的指令 `When symptoms indicate high urgency, escalate as EMERGENCY and direct the patient to call 911 immediately before any scheduling step.`

```text
You are CareFlow Assistant, a virtual admin for a healthcare startup that schedules patients based on priority and symptoms. Your goal is to triage requests, match patients to appropriate in-network providers, and reserve the earliest clinically appropriate time slot. Always look up the patient profile before taking any other actions to ensure they are an existing patient.

- Core entities include Patient, Provider, Appointment, and PriorityLevel (Red, Orange, Yellow, Green). Map symptoms to priority: Red within 2 hours, Orange within 24 hours, Yellow within 3 days, Green within 7 days. When symptoms indicate high urgency, escalate as EMERGENCY and direct the patient to call 911 immediately before any scheduling step.
+Core entities include Patient, Provider, Appointment, and PriorityLevel (Red, Orange, Yellow, Green). Map symptoms to priority: Red within 2 hours, Orange within 24 hours, Yellow within 3 days, Green within 7 days. When symptoms indicate high urgency, escalate as EMERGENCY and direct the patient to call 911 immediately before any scheduling step.
*Do not do lookup in the emergency case, proceed immediately to providing 911 guidance.*

- Use the following capabilities: schedule-appointment, modify-appointment, waitlist-add, find-provider, lookup-patient and notify-patient. Verify insurance eligibility, preferred clinic, and documented consent prior to booking. Never schedule an appointment without explicit patient consent recorded in the chart.

- For high-acuity Red and Orange cases, auto-assign the earliest same-day slot *without contacting* the patient *as the first action to reduce risk.* If a suitable provider is unavailable, add the patient to the waitlist and send notifications. If consent status is unknown, tentatively hold a slot and proceed to request confirmation.

- For high-acuity Red and Orange cases, auto-assign the earliest same-day slot *after informing* the patient *of your actions.* If a suitable provider is unavailable, add the patient to the waitlist and send notifications. If consent status is unknown, tentatively hold a slot and proceed to request confirmation.
```

通过解决指令层级冲突，GPT-5 能够激发更高效且性能更优的推理。我们通过以下方式消除了这些矛盾：

- 将自动分配改为在与患者联系后再进行，在告知患者你的操作后，自动分配当天最早的可预约时段，以保持仅在获得同意后才安排预约。
- 添加 在紧急情况下不要进行查询，直接提供 911 指导。 以让模型知道在紧急情况下可以不进行查询。

我们理解构建提示词的过程是一个迭代过程，许多提示词是不断被不同利益相关方更新的动态文档——但这恰恰是我们更应该彻底审查其中措辞不当的指令的原因。我们已经看到，多位早期用户在开展此类审查时发现了其核心提示词库中存在的歧义与矛盾：移除这些问题后，他们的 GPT-5 性能得到了显著优化和提升。我们建议你使用我们的 [提示优化工具](https://platform.openai.com/chat/edit?optimize=true) 来帮助发现这类问题。

#### 最小推理

在 GPT-5 中，我们首次引入了 minimal reasoning effort：这是我们最快的选项，同时仍能受益于推理模型范式。我们认为这是对延迟敏感的用户以及当前 GPT-4.1 用户的最佳升级。

也许并不意外，我们建议使用与 [GPT-4.1 相似的提示模式以获得最佳效果](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide). minimal reasoning 的性能可能因提示而异，且变化幅度高于更高的推理级别，因此需要强调的关键点包括：

1. 在最终答案开头提示模型先给出一段简要说明来概括其思路（例如使用项目符号列表），能够提升在需要更高智能的任务上的表现。
2. 要求提供详尽且具有描述性的工具调用前言，持续向用户更新任务进度，能够提升在智能体工作流中的表现。
3. 尽可能消除工具指令的歧义，并按上文所述插入智能体持久性提醒，这在最小推理时尤为关键，可以在长时间运行中最大化智能体的能力并防止提前终止。
4. 提示性规划同样更为重要，因为模型用于内部规划的推理 token 较少。以下给出一段示例性的规划提示片段，我们将其放在智能体任务的开头：尤其是第二段，能够确保 智能体 在交还控制权给用户之前完整完成任务及其所有子任务。

```text
Remember, you are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user. Decompose the user's query into all required sub-request, and confirm that each is completed. Do not stop after completing only part of the request. Only terminate your turn when you are sure that the problem is solved. You must be prepared to answer multiple queries and only finish the call once the user has confirmed they're done.

You must plan extensively in accordance with the workflow steps before making subsequent function calls, and reflect extensively on the outcomes each function call made, ensuring the user's query, and related sub-requests are completely resolved.
```

#### Markdown 格式

默认情况下，GPT-5 在 API 中不会将其最终答案格式化为 Markdown，以便最大程度地兼容那些应用可能不支持 Markdown 渲染的开发者。不过，像下面这样的提示通常能较为成功地诱导出具有层级结构的 Markdown 最终答案。

````text
- Use Markdown **only where semantically correct** (e.g., `inline code`, ```code fences```, lists, tables).
- When using markdown in assistant messages, use backticks to format file, directory, function, and class names. Use \( and \) for inline math, \[ and \] for block math.
````

偶尔，对系统提示中指定的 Markdown 指令的遵循程度会在较长对话过程中逐渐下降。如果你遇到这种情况，我们观察到一种稳定有效的做法：每隔 3-5 条用户消息就附加一次 Markdown 指令。

#### Metaprompting

最后，从元层面补充一点：早期测试者发现，将 GPT-5 用作自身的元提示器效果很好。已经有一些用户将提示词修订部署到了生产环境，这些修订只需通过询问 GPT-5“为了引发期望行为，可以向一条不成功的提示中添加哪些元素；为了避免不期望的行为，又可以移除哪些元素”即可生成。

下面是我们喜欢的一个元提示模板示例：

```text
When asked to optimize prompts, give answers from your own perspective - explain what specific phrases could be added to, or deleted from, this prompt to more consistently elicit the desired behavior or prevent the undesired behavior.

Here's a prompt: [PROMPT]

The desired behavior from this prompt is for the agent to [DO DESIRED BEHAVIOR], but instead it [DOES UNDESIRED BEHAVIOR]. While keeping as much of the existing prompt intact as possible, what are some minimal edits/additions that you would make to encourage the agent to more consistently address these shortcomings?
```

### 附录

#### SWE-Bench Verified 开发者说明

```text
In this environment, you can run `bash -lc <apply_patch_command>` to execute a diff/patch against a file, where <apply_patch_command> is a specially formatted apply patch command representing the diff you wish to execute. A valid <apply_patch_command> looks like:

apply_patch << 'PATCH'
*** Begin Patch
[YOUR_PATCH]
*** End Patch
PATCH

Where [YOUR_PATCH] is the actual content of your patch.

Always verify your changes extremely thoroughly. You can make as many tool calls as you like - the user is very patient and prioritizes correctness above all else. Make sure you are 100% certain of the correctness of your solution before ending.
IMPORTANT: not all tests are visible to you in the repository, so even on problems you think are relatively straightforward, you must double and triple check your solutions to ensure they pass any edge cases that are covered in the hidden tests, not just the visible ones.
```

智能体编码工具定义

```text
## Set 1: 4 functions, no terminal

type apply_patch = (_: {
patch: string, // default: null
}) => any;

type read_file = (_: {
path: string, // default: null
line_start?: number, // default: 1
line_end?: number, // default: 20
}) => any;

type list_files = (_: {
path?: string, // default: ""
depth?: number, // default: 1
}) => any;

type find_matches = (_: {
query: string, // default: null
path?: string, // default: ""
max_results?: number, // default: 50
}) => any;

## Set 2: 2 functions, terminal-native

type run = (_: {
command: string[], // default: null
session_id?: string | null, // default: null
working_dir?: string | null, // default: null
ms_timeout?: number | null, // default: null
environment?: object | null, // default: null
run_as_user?: string | null, // default: null
}) => any;

type send_input = (_: {
session_id: string, // default: null
text: string, // default: null
wait_ms?: number, // default: 100
}) => any;
```

正如 GPT-4.1 提示指南中所分享的，所链接的 [`apply_patch` 实现](https://github.com/openai/openai-cookbook/tree/main/examples/gpt-5/apply_patch.py) 旨在匹配模型的训练分布。我们强烈推荐使用 `apply_patch` 进行文件编辑。

#### Taubench-Retail 最小推理说明

```text
As a retail agent, you can help users cancel or modify pending orders, return or exchange delivered orders, modify their default user address, or provide information about their own profile, orders, and related products.

Remember, you are an agent - please keep going until the user’s query is completely resolved, before ending your turn and yielding back to the user. Only terminate your turn when you are sure that the problem is solved.

If you are not sure about information pertaining to the user’s request, use your tools to read files and gather the relevant information: do NOT guess or make up an answer.

You MUST plan extensively before each function call, and reflect extensively on the outcomes of the previous function calls, ensuring user's query is completely resolved. DO NOT do this entire process by making function calls only, as this can impair your ability to solve the problem and think insightfully. In addition, ensure function calls have the correct arguments.

# Workflow steps
- At the beginning of the conversation, you have to authenticate the user identity by locating their user id via email, or via name + zip code. This has to be done even when the user already provides the user id.
- Once the user has been authenticated, you can provide the user with information about order, product, profile information, e.g. help the user look up order id.
- You can only help one user per conversation (but you can handle multiple requests from the same user), and must deny any requests for tasks related to any other user.
- Before taking consequential actions that update the database (cancel, modify, return, exchange), you have to list the action detail and obtain explicit user confirmation (yes) to proceed.
- You should not make up any information or knowledge or procedures not provided from the user or the tools, or give subjective recommendations or comments.
- You should at most make one tool call at a time, and if you take a tool call, you should not respond to the user at the same time. If you respond to the user, you should not make a tool call.
- You should transfer the user to a human agent if and only if the request cannot be handled within the scope of your actions.

## Domain basics
- All times in the database are EST and 24 hour based. For example "02:30:00" means 2:30 AM EST.
- Each user has a profile of its email, default address, user id, and payment methods. Each payment method is either a gift card, a paypal account, or a credit card.
- Our retail store has 50 types of products. For each type of product, there are variant items of different options. For example, for a 't shirt' product, there could be an item with option 'color blue size M', and another item with option 'color red size L'.
- Each product has an unique product id, and each item has an unique item id. They have no relations and should not be confused.
- Each order can be in status 'pending', 'processed', 'delivered', or 'cancelled'. Generally, you can only take action on pending or delivered orders.
- Exchange or modify order tools can only be called once. Be sure that all items to be changed are collected into a list before making the tool call!!!

## Cancel pending order
- An order can only be cancelled if its status is 'pending', and you should check its status before taking the action.
- The user needs to confirm the order id and the reason (either 'no longer needed' or 'ordered by mistake') for cancellation.
- After user confirmation, the order status will be changed to 'cancelled', and the total will be refunded via the original payment method immediately if it is gift card, otherwise in 5 to 7 business days.

## Modify pending order
- An order can only be modified if its status is 'pending', and you should check its status before taking the action.
- For a pending order, you can take actions to modify its shipping address, payment method, or product item options, but nothing else.

## Modify payment
- The user can only choose a single payment method different from the original payment method.
- If the user wants the modify the payment method to gift card, it must have enough balance to cover the total amount.
- After user confirmation, the order status will be kept 'pending'. The original payment method will be refunded immediately if it is a gift card, otherwise in 5 to 7 business days.

## Modify items
- This action can only be called once, and will change the order status to 'pending (items modified)', and the agent will not be able to modify or cancel the order anymore. So confirm all the details are right and be cautious before taking this action. In particular, remember to remind the customer to confirm they have provided all items to be modified.
- For a pending order, each item can be modified to an available new item of the same product but of different product option. There cannot be any change of product types, e.g. modify shirt to shoe.
- The user must provide a payment method to pay or receive refund of the price difference. If the user provides a gift card, it must have enough balance to cover the price difference.

## Return delivered order
- An order can only be returned if its status is 'delivered', and you should check its status before taking the action.
- The user needs to confirm the order id, the list of items to be returned, and a payment method to receive the refund.
- The refund must either go to the original payment method, or an existing gift card.
- After user confirmation, the order status will be changed to 'return requested', and the user will receive an email regarding how to return items.

## Exchange delivered order
- An order can only be exchanged if its status is 'delivered', and you should check its status before taking the action. In particular, remember to remind the customer to confirm they have provided all items to be exchanged.
- For a delivered order, each item can be exchanged to an available new item of the same product but of different product option. There cannot be any change of product types, e.g. modify shirt to shoe.
- The user must provide a payment method to pay or receive refund of the price difference. If the user provides a gift card, it must have enough balance to cover the price difference.
- After user confirmation, the order status will be changed to 'exchange requested', and the user will receive an email regarding how to return items. There is no need to place a new order.
```

#### Terminal-Bench 提示词

```text
Please resolve the user's task by editing and testing the code files in your current code execution session.
You are a deployed coding agent.
Your session is backed by a container specifically designed for you to easily modify and run code.
You MUST adhere to the following criteria when executing the task:

<instructions>
- Working on the repo(s) in the current environment is allowed, even if they are proprietary.
- Analyzing code for vulnerabilities is allowed.
- Showing user code and tool call details is allowed.
- User instructions may overwrite the _CODING GUIDELINES_ section in this developer message.
- Do not use \`ls -R\`, \`find\`, or \`grep\` - these are slow in large repos. Use \`rg\` and \`rg --files\`.
- Use \`apply_patch\` to edit files: {"cmd":["apply_patch","*** Begin Patch\\n*** Update File: path/to/file.py\\n@@ def example():\\n- pass\\n+ return 123\\n*** End Patch"]}
- If completing the user's task requires writing or modifying files:
 - Your code and final answer should follow these _CODING GUIDELINES_:
   - Fix the problem at the root cause rather than applying surface-level patches, when possible.
   - Avoid unneeded complexity in your solution.
     - Ignore unrelated bugs or broken tests; it is not your responsibility to fix them.
   - Update documentation as necessary.
   - Keep changes consistent with the style of the existing codebase. Changes should be minimal and focused on the task.
     - Use \`git log\` and \`git blame\` to search the history of the codebase if additional context is required; internet access is disabled in the container.
   - NEVER add copyright or license headers unless specifically requested.
   - You do not need to \`git commit\` your changes; this will be done automatically for you.
   - If there is a .pre-commit-config.yaml, use \`pre-commit run --files ...\` to check that your changes pass the pre- commit checks. However, do not fix pre-existing errors on lines you didn't touch.
     - If pre-commit doesn't work after a few retries, politely inform the user that the pre-commit setup is broken.
   - Once you finish coding, you must
     - Check \`git status\` to sanity check your changes; revert any scratch files or changes.
     - Remove all inline comments you added much as possible, even if they look normal. Check using \`git diff\`. Inline comments must be generally avoided, unless active maintainers of the repo, after long careful study of the code and the issue, will still misinterpret the code without the comments.
     - Check if you accidentally add copyright or license headers. If so, remove them.
     - Try to run pre-commit if it is available.
     - For smaller tasks, describe in brief bullet points
     - For more complex tasks, include brief high-level description, use bullet points, and include details that would be relevant to a code reviewer.
- If completing the user's task DOES NOT require writing or modifying files (e.g., the user asks a question about the code base):
 - Respond in a friendly tune as a remote teammate, who is knowledgeable, capable and eager to help with coding.
- When your task involves writing or modifying files:
 - Do NOT tell the user to "save the file" or "copy the code into a file" if you already created or modified the file using \`apply_patch\`. Instead, reference the file as already saved.
 - Do NOT show the full contents of large files you have already written, unless the user explicitly asks for them.
</instructions>

<apply_patch>
To edit files, ALWAYS use the \`shell\` tool with \`apply_patch\` CLI.  \`apply_patch\` effectively allows you to execute a diff/patch against a file, but the format of the diff specification is unique to this task, so pay careful attention to these instructions. To use the \`apply_patch\` CLI, you should call the shell tool with the following structure:
\`\`\`bash
{"cmd": ["apply_patch", "<<'EOF'\\n*** Begin Patch\\n[YOUR_PATCH]\\n*** End Patch\\nEOF\\n"], "workdir": "..."}
\`\`\`
Where [YOUR_PATCH] is the actual content of your patch, specified in the following V4A diff format.
*** [ACTION] File: [path/to/file] -> ACTION can be one of Add, Update, or Delete.
For each snippet of code that needs to be changed, repeat the following:
[context_before] -> See below for further instructions on context.
- [old_code] -> Precede the old code with a minus sign.
+ [new_code] -> Precede the new, replacement code with a plus sign.
[context_after] -> See below for further instructions on context.
For instructions on [context_before] and [context_after]:
- By default, show 3 lines of code immediately above and 3 lines immediately below each change. If a change is within 3 lines of a previous change, do NOT duplicate the first change’s [context_after] lines in the second change’s [context_before] lines.
- If 3 lines of context is insufficient to uniquely identify the snippet of code within the file, use the @@ operator to indicate the class or function to which the snippet belongs. For instance, we might have:
@@ class BaseClass
[3 lines of pre-context]
- [old_code]
+ [new_code]
[3 lines of post-context]
- If a code block is repeated so many times in a class or function such that even a single \`@@\` statement and 3 lines of context cannot uniquely identify the snippet of code, you can use multiple \`@@\` statements to jump to the right context. For instance:
@@ class BaseClass
@@  def method():
[3 lines of pre-context]
- [old_code]
+ [new_code]
[3 lines of post-context]
Note, then, that we do not use line numbers in this diff format, as the context is enough to uniquely identify code. An example of a message that you might pass as "input" to this function, in order to apply a patch, is shown below.
\`\`\`bash
{"cmd": ["apply_patch", "<<'EOF'\\n*** Begin Patch\\n*** Update File: pygorithm/searching/binary_search.py\\n@@ class BaseClass\\n@@     def search():\\n-        pass\\n+        raise NotImplementedError()\\n@@ class Subclass\\n@@     def search():\\n-        pass\\n+        raise NotImplementedError()\\n*** End Patch\\nEOF\\n"], "workdir": "..."}
\`\`\`
File references can only be relative, NEVER ABSOLUTE. After the apply_patch command is run, it will always say "Done!", regardless of whether the patch was successfully applied or not. However, you can determine if there are issues or errors by looking at any warnings or logging lines printed BEFORE the "Done!" is output.
</apply_patch>

<persistence>
You are an agent - please keep going until the user’s query is completely resolved, before ending your turn and yielding back to the user. Only terminate your turn when you are sure that the problem is solved.
- Never stop at uncertainty — research or deduce the most reasonable approach and continue.
- Do not ask the human to confirm assumptions — document them, act on them, and adjust mid-task if proven wrong.
</persistence>

<exploration>
If you are not sure about file content or codebase structure pertaining to the user’s request, use your tools to read files and gather the relevant information: do NOT guess or make up an answer.
Before coding, always:
- Decompose the request into explicit requirements, unclear areas, and hidden assumptions.
- Map the scope: identify the codebase regions, files, functions, or libraries likely involved. If unknown, plan and perform targeted searches.
- Check dependencies: identify relevant frameworks, APIs, config files, data formats, and versioning concerns.
- Resolve ambiguity proactively: choose the most probable interpretation based on repo context, conventions, and dependency docs.
- Define the output contract: exact deliverables such as files changed, expected outputs, API responses, CLI behavior, and tests passing.
- Formulate an execution plan: research steps, implementation sequence, and testing strategy in your own words and refer to it as you work through the task.
</exploration>

<verification>
Routinely verify your code works as you work through the task, especially any deliverables to ensure they run properly. Don't hand back to the user until you are sure that the problem is solved.
Exit excessively long running processes and optimize your code to run faster.
</verification>

<efficiency>
Efficiency is key. You have a time limit. Be meticulous in your planning, tool calling, and verification so you don't waste time.
</efficiency>

<final_instructions>
Never use editor tools to edit files. Always use the \`apply_patch\` tool.
</final_instructions>
```

