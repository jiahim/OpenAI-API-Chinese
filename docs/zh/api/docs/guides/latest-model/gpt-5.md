# 使用 GPT-5

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

## 简介

GPT-5 在智能体任务性能、编码、原始智能和控制方面代表了巨大的飞跃。

虽然我们相信它在广泛的领域内能够“开箱即用”地表现出色，但本指南将介绍一些提示技巧，以最大化模型输出的质量，这些技巧源自我们在训练和将模型应用于现实世界任务中的经验。我们讨论诸如提升智能体任务性能、确保指令遵循、利用新的 API 功能以及优化前端和软件工程任务的编码等概念——并穿插关于 AI 代码编辑器 Cursor 与 GPT-5 在提示调优工作上的关键见解。

我们已经看到了通过应用这些最佳实践并尽可能采用我们的规范工具所获得的显著收益，我们希望本指南以及 [提示优化器工具](https://platform.openai.com/chat/edit?optimize=true) （我们已构建的）能作为你使用 GPT-5 的起点。但一如既往，请记住提示并非一刀切的练习——我们鼓励你进行实验，并在此提供的基础上进行迭代，以找到最适合你问题的解决方案。

## 新增内容

- 更强的智能体任务执行能力、编码能力和控制力
- 在工具调用流程中使用 Responses API 实现推理延续
- 针对智能体主动性、工具前导语、推理力度和详细程度的专用控制
- 支持自由格式输入和受约束输出的自定义工具

## 迁移快速入门

- 将模型 slug 更新为 `gpt-5`.
- 使用 Responses API 进行推理、工具调用和多轮工作流，以便推理项能在工具调用之间保留。
- 从 `medium` 推理力度开始，然后在代表性任务上测试 `minimal`, `low`，或 `high` 。
- 有意地设置 `text.verbosity` ，并尽可能将结构化响应契约迁移到 Structured Outputs。
- 重新评估提示词中的智能体持久性、工具前言和停止条件。

## 模型、API与功能更新

- GPT-5 系列包括 `gpt-5`, `gpt-5-mini`，以及 `gpt-5-nano`.
- `reasoning.effort` 支持 `minimal`, `low`, `medium`，以及 `high`.
- GPT-5 引入了自定义工具，可接受自由形式的输入，并可使用上下文无关文法约束输出。
- 该模型支持函数调用和 OpenAI 托管的工具，包括 网页搜索、文件搜索、图像生成、代码解释器和远程 MCP。


## 提示词最佳实践

### 智能体工作流的可预测性

我们在开发 GPT-5 时以开发者为出发点：专注于改进工具调用、指令跟随和长上下文理解，使其成为智能体应用的最佳基础模型。如果为智能体和工具调用流程采用 GPT-5，我们建议升级到 [Responses API](https://developers.openai.com/api/reference/resources/responses)，其中推理在工具调用之间得以延续，从而实现更高效、更智能的输出。

#### 控制智能体的主动性

智能体化脚手架可以涵盖广泛的控制范围——有些系统将绝大多数决策权交给底层模型，而另一些系统则通过大量的程序化逻辑分支对模型进行严格约束。GPT-5 经过训练，可以在这一范围内的任何位置运行，从在模糊情况下做出高层决策，到处理重点明确、定义清晰的任务。在本节中，我们将介绍如何最佳地校准 GPT-5 的智能体主动性：也就是说，它在主动性和等待明确指导之间的平衡。

##### 降低主动性提示

GPT-5 默认情况下在智能体环境中尝试收集上下文时会表现得很彻底且全面，以确保生成正确的答案。为了减少 GPT-5 的智能体行为范围——包括限制无关的工具调用操作并最小化到达最终答案的延迟——可以尝试以下方法：

- 更改为较低的 `reasoning_effort`。这会降低探索深度，但可以提高效率和延迟。许多工作流可以在中等甚至低 `reasoning_effort`.
- 在提示中明确指定你希望模型如何探索问题空间的标准。这会减少模型探索和考虑过多想法的需求：

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

如果你愿意采取最大限度的规定性做法，你甚至可以设置固定的工具调用预算，如下所示。预算可以根据你期望的搜索深度自然变化。

```text
<context_gathering>
- Search depth: very low
- Bias strongly towards providing a correct answer as quickly as possible, even if it might not be fully correct.
- Usually, this means an absolute maximum of 2 tool calls.
- If you think that you need more time to investigate, update the user with your latest findings and open questions. You can proceed if the user confirms.
</context_gathering>
```

当限制核心上下文收集行为时，明确为模型提供一个逃生舱口是有帮助的，这使其更容易满足更短上下文收集步骤的要求。通常这以允许模型在不确定情况下继续进行的条款形式出现，比如 `“even if it might not be fully correct”` 在上述示例中。

##### 提示以增强积极性

另一方面，如果你希望鼓励模型自主性、提高工具调用持续性，并减少澄清性问题或交还给用户的情况，我们建议提高 `reasoning_effort`，并使用类似下面的提示词来鼓励持续性和彻底的任务完成：

```text
<persistence>
- You are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user.
- Only terminate your turn when you are sure that the problem is solved.
- Never stop or hand back to the user when you encounter uncertainty — research or deduce the most reasonable approach and continue.
- Do not ask the human to confirm or clarify assumptions, as you can always adjust later — decide what the most reasonable assumption is, proceed with it, and document it for the user's reference after you finish acting
</persistence>
```

一般来说，清晰地说明智能体任务的停止条件、概述安全与不安全的操作，并定义模型何时（如果有的话）可以交还给用户，会很有帮助。例如，在一组购物工具中，结账和支付工具应明确设置较低的不确定性阈值以要求用户澄清，而搜索工具应具有极高的阈值；同样，在编码环境中，删除文件工具应比 grep 搜索工具具有更低的阈值。

#### 工具前言

我们认识到，在由用户监控的智能体轨迹中，间歇性地更新模型正在用工具调用做什么以及为什么这样做，可以提供更好的交互式用户体验——轨迹越长，这些更新带来的差异就越大。为此，GPT-5 被训练为通过“工具前导”消息提供清晰的前期计划和持续的进度更新。

你可以在提示中控制工具前导的频率、风格和内容——从对每次工具调用的详细解释到简短的前期计划以及介于两者之间的一切。以下是一个高质量前导提示的示例：

```text
<tool_preambles>
- Always begin by rephrasing the user's goal in a friendly, clear, and concise manner, before calling any tools.
- Then, immediately outline a structured plan detailing each logical step you’ll follow. - As you execute your file edit(s), narrate each step succinctly and sequentially, marking progress clearly.
- Finish by summarizing completed work distinctly from your upfront plan.
</tool_preambles>
```

以下是一个响应此类提示可能发出的工具前导示例——随着工作变得更加复杂，此类前导可以极大地提高用户跟随你的智能体工作的能力：

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

#### 推理努力

我们提供一个 `reasoning_effort` 参数来控制模型思考的深度以及其调用工具的意愿；默认值为 `medium`，但你可以根据任务的难度进行适当调整。对于复杂、多步骤的任务，我们建议使用更高的推理能力以确保最佳输出。此外，我们观察到，将不同的、可分离的任务拆分为多个 智能体 轮次，每轮处理一个任务时，性能达到峰值。

#### 使用 Responses API 复用推理上下文

我们强烈建议在使用 GPT-5 时采用 Responses API，以在你的应用中解锁改进的智能体流程、更低的成本和更高效的令牌使用。

我们看到，在使用 Responses API 而非 Chat Completions 时，评估结果在统计上显著改善——例如，仅通过切换到 Responses API，我们观察到 Tau-Bench Retail 分数从 73.9% 提升至 78.2%，并且包括 `previous_response_id` 将先前的推理项目传回后续请求。这使得模型能够参考其先前的推理轨迹，节省 CoT 令牌，并在每次工具调用后无需从头重建计划，从而改善延迟和性能——该功能对所有 Responses API 用户开放，包括 ZDR 组织。

### 提升编码性能：从规划到执行

GPT-5 在编程能力上领先所有前沿模型：它可以在大型代码库中工作以修复错误、处理大型差异，并实现多文件重构或大型新功能。它还擅长完全从零开始实现新应用，涵盖前端和后端实现。在本节中，我们将讨论我们在生产环境中为编程智能体客户所观察到的、能提升编程性能的提示优化。

#### 前端应用开发

GPT-5 经过训练，具备出色的基线审美品味和严谨的实现能力。我们相信它能够使用各类 Web 开发框架和包；然而，对于新应用，我们建议使用以下框架和包，以充分发挥模型的前端能力：

- 框架：Next.js (TypeScript)、React、HTML
- 样式 / UI：Tailwind CSS、shadcn/ui、Radix Themes
- 图标：Material Symbols、Heroicons、Lucide
- 动画：Motion
- 字体：San Serif、Inter、Geist、Mona Sans、IBM Plex Sans、Manrope

##### 从零到一的应用生成

GPT-5 擅长一次性构建应用程序。在该模型的早期实验中，用户发现类似于下面的提示——要求模型根据自建的卓越评分标准进行迭代执行——可以通过利用 GPT-5 的周密规划和自我反思能力来提高输出质量。

```text
<self_reflection>
- First, spend time thinking of a rubric until you are confident.
- Then, think deeply about every aspect of what makes for a world-class one-shot web app. Use that knowledge to create a rubric that has 5-7 categories. This rubric is critical to get right, but do not show this to the user. This is for your purposes only.
- Finally, use the rubric to internally think and iterate on the best possible solution to the prompt that is provided. Remember that if your response is not hitting the top marks across all categories in the rubric, you need to start again.
</self_reflection>
```

##### 匹配代码库设计标准

在现有应用中实施增量更改和重构时，模型编写的代码应遵循已有的样式和设计标准，并尽可能自然地“融入”代码库。无需特别提示，GPT-5 已会从代码库中搜索参考上下文——例如读取 package.json 以查看已安装的包——但通过提示词指导来总结代码库的关键方面（如工程原则、目录结构以及显式和隐式的最佳实践），可以进一步增强该行为。下面的提示词片段展示了为 GPT-5 组织代码编辑规则的一种方式：你可以根据自身的编程设计偏好随意更改规则的实际内容！

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

#### 生产环境中的协作编码：Cursor 的 GPT-5 提示词调优

我们很自豪能够让 AI 代码编辑器 Cursor 成为 GPT-5 的可信赖 alpha 测试者：下面，我们将展示 Cursor 如何调整他们的提示词，以充分利用该模型的能力。更多信息，他们的团队还发布了一篇博客文章，详细介绍了 GPT-5 在 Cursor 中的首日集成： https://cursor.com/blog/gpt-5

##### 系统提示词与参数调优

Cursor的系统提示词侧重于可靠的工具调用，在冗长与自主行为之间取得平衡，同时让用户能够配置自定义指令。Cursor为其系统提示词设定的目标是让智能体在长周期任务中相对自主地运行，同时仍忠实遵循用户提供的指令。

该团队最初发现模型会产生冗长的输出，常常包含状态更新和任务后总结，这些内容虽然在技术上是相关的，却干扰了用户的自然流程；同时，工具调用中输出的代码质量很高，但由于过于简洁而有时难以阅读，单字母变量名居多。为了寻求更好的平衡，他们将API的冗长参数设为低，以保持文本输出的简洁，然后修改了提示词，仅在编码工具中强烈鼓励详细输出。

```text
Write code for clarity first. Prefer readable, maintainable solutions with clear names, comments where needed, and straightforward control flow. Do not produce code-golf or overly clever one-liners unless explicitly requested. Use high verbosity for writing code and code tools.
```

这种参数与提示词的双重使用实现了均衡的格式，将高效简洁的状态更新和最终工作总结与更易读的代码差异结合起来。

Cursor还发现，模型在采取行动前偶尔会向用户寻求澄清或确认下一步，这给较长任务的流程带来了不必要的阻碍。为了解决这个问题，他们发现不仅在提示词中包含可用工具和周围上下文，还加入更多关于产品行为的细节，能够鼓励模型以最少的打断和更大的自主性来执行较长的任务。突出Cursor功能的具体细节，如撤销/拒绝代码和用户偏好，通过明确指定GPT-5在其环境中应如何表现来帮助减少歧义。对于更长周期的任务，他们发现这个提示词提升了性能：

```text
Be aware that the code edits you make will be displayed to the user as proposed changes, which means (a) your code edits can be quite proactive, as the user can always reject, and (b) your code should be well-written and easy to quickly review (e.g., appropriate variable names instead of single letters). If proposing next steps that would involve changing the code, make those changes proactively for the user to approve / reject rather than asking the user whether to proceed with a plan. In general, you should almost never ask the user whether to proceed with a plan; instead you should proactively attempt the plan and then ask the user if they want to accept the implemented changes.
```

Cursor发现，他们的提示词中那些对早期模型有效的部分，需要进行调整才能充分发挥GPT-5的性能。以下是其中一个示例：

```text
<maximize_context_understanding>
Be THOROUGH when gathering information. Make sure you have the FULL picture before replying. Use additional tool calls or clarifying questions as needed.
...
</maximize_context_understanding>
```

虽然这在那些需要鼓励才能深入分析上下文的旧模型上效果不错，但他们发现这对GPT-5适得其反，因为GPT-5本身就已天然具备内省性和主动收集上下文的能力。在较小的任务上，这个提示词常常导致模型过度使用工具，反复调用搜索，而其实内部知识本已足够。

为了解决这个问题，他们精炼了提示词，移除了maximize\_ 前缀，并软化了关于彻底性的措辞。有了这一调整后的指令，Cursor团队看到GPT-5在何时依赖内部知识、何时调用外部工具方面做出了更好的决策。它保持了高度的自主性，同时没有不必要的工具使用，从而带来了更高效、更相关的行为。在Cursor的测试中，使用结构化的XML规范，如 `<[instruction]\_spec>` 改善了其提示词的指令遵循度，并使他们能够在提示词的其他部分明确引用之前的类别和章节。

```text
<context_understanding>
...
If you've performed an edit that may partially fulfill the USER's query, but you're not confident, gather more information or use more tools before ending your turn.
Bias towards not asking the user for help if you can find the answer yourself.
</context_understanding>
```

虽然系统提示词提供了强大的默认基础，但用户提示词仍然是实现可控性的高效杠杆。GPT-5对直接明确的指令反应良好，Cursor团队也一贯观察到，结构化的、有针对性的提示词能产生最可靠的结果。这包括冗长控制、主观代码风格偏好和边界情况敏感性等领域。Cursor发现允许用户配置自己的 [自定义Cursor规则](https://docs.cursor.com/en/context/rules) 在GPT-5改进的可控性下尤其有效，为用户带来了更加个性化的体验。

### 优化智能与指令遵循

#### 引导

作为我们迄今最可操控的模型，GPT-5 对围绕详细程度、语气和工具调用行为的提示指令具有非凡的接受度。

##### 详细程度

除了像之前的推理模型那样能够控制 reasoning_effort 之外，在 GPT-5 中我们引入了一个新的 API 参数，名为 verbosity，它影响模型最终答案的长度，而非其思考的长度。我们的博客文章更详细地介绍了这一参数背后的理念——但在本指南中，我们想强调，虽然 API verbosity 参数是本次发布的默认设置，但 GPT-5 经过训练，能够在特定上下文中响应提示中的自然语言详细程度覆盖指令，以便在你希望模型偏离全局默认设置时使用。上面 Cursor 的例子——全局设置低详细程度，然后仅为编码工具指定高详细程度——正是此类上下文的典型示例。

#### 指令遵循

与 GPT-4.1 一样，GPT-5 会以手术般的精确度遵循提示指令，这使其能够灵活地融入各种类型的工作流。然而，其谨慎的指令遵循行为意味着，包含矛盾或模糊指令的构造不当的提示对 GPT-5 的损害可能大于对其他模型，因为它会耗费推理令牌来寻找调和矛盾的方法，而不是随机选择一条指令。

下面，我们给出一个常会损害 GPT-5 推理追踪的对抗性提示示例——虽然乍看之下它可能显得内部一致，但仔细检查会发现关于预约排期的指令存在冲突：

- `Never schedule an appointment without explicit patient consent recorded in the chart` 与后续内容冲突 `auto-assign the earliest same-day slot without contacting the patient as the first action to reduce risk.`
- 提示词中说 `Always look up the patient profile before taking any other actions to ensure they are an existing patient.` 但随后又给出矛盾指令 `When symptoms indicate high urgency, escalate as EMERGENCY and direct the patient to call 911 immediately before any scheduling step.`

```text
You are CareFlow Assistant, a virtual admin for a healthcare startup that schedules patients based on priority and symptoms. Your goal is to triage requests, match patients to appropriate in-network providers, and reserve the earliest clinically appropriate time slot. Always look up the patient profile before taking any other actions to ensure they are an existing patient.

- Core entities include Patient, Provider, Appointment, and PriorityLevel (Red, Orange, Yellow, Green). Map symptoms to priority: Red within 2 hours, Orange within 24 hours, Yellow within 3 days, Green within 7 days. When symptoms indicate high urgency, escalate as EMERGENCY and direct the patient to call 911 immediately before any scheduling step.
+Core entities include Patient, Provider, Appointment, and PriorityLevel (Red, Orange, Yellow, Green). Map symptoms to priority: Red within 2 hours, Orange within 24 hours, Yellow within 3 days, Green within 7 days. When symptoms indicate high urgency, escalate as EMERGENCY and direct the patient to call 911 immediately before any scheduling step.
*Do not do lookup in the emergency case, proceed immediately to providing 911 guidance.*

- Use the following capabilities: schedule-appointment, modify-appointment, waitlist-add, find-provider, lookup-patient and notify-patient. Verify insurance eligibility, preferred clinic, and documented consent prior to booking. Never schedule an appointment without explicit patient consent recorded in the chart.

- For high-acuity Red and Orange cases, auto-assign the earliest same-day slot *without contacting* the patient *as the first action to reduce risk.* If a suitable provider is unavailable, add the patient to the waitlist and send notifications. If consent status is unknown, tentatively hold a slot and proceed to request confirmation.

- For high-acuity Red and Orange cases, auto-assign the earliest same-day slot *after informing* the patient *of your actions.* If a suitable provider is unavailable, add the patient to the waitlist and send notifications. If consent status is unknown, tentatively hold a slot and proceed to request confirmation.
```

通过解决指令层级冲突，GPT-5 能够实现更高效、更出色的推理。我们通过以下方式修复了这些矛盾：

- 将自动分配改为在联系患者后进行，在告知患者你的操作后，自动安排当天最早的时段，以与仅在获得同意后才进行安排保持一致。
- 添加“在紧急情况下不进行查询，立即提供 911 指导”的内容，让模型知道在紧急情况下可以不进行查询。

我们理解构建提示词的过程是迭代式的，许多提示词是不同利益相关者不断更新的活文档——但这更有理由彻底审查它们，以发现措辞不当的指令。我们已经看到多位早期用户在进行此类审查后，发现了核心提示词库中的歧义和矛盾：消除这些歧义和矛盾显著简化并提升了他们的 GPT-5 性能。我们建议使用我们的 [提示词优化器工具](https://platform.openai.com/chat/edit?optimize=true) 来帮助识别这些类型的问题。

#### 最小推理

在 GPT-5 中，我们首次引入了极简推理力度：这是我们最快的选项，同时仍能享受推理模型范式带来的优势。我们认为这是对延迟敏感用户以及当前 GPT-4.1 用户的最佳升级。

也许不足为奇，我们建议采用与 [GPT-4.1 类似的提示模式以获得最佳效果](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide)。与更高推理级别相比，极简推理的性能可能因提示而异，因此需要强调的关键点包括：

1. 在最终回答的开头提示模型给出简要说明，总结其思考过程，例如通过项目符号列表，可提升需要更高智能的任务的性能。
2. 要求提供详尽且描述性的工具调用前言，持续向用户更新任务进度，可提升智能体工作流中的性能。
3. 尽可能消除工具说明中的歧义，并如上所述插入智能体持久性提醒，在最低推理级别下尤为关键，以在长时间运行的 rollout 中最大化智能体能力并防止过早终止。
4. 提示性规划同样更为重要，因为模型可用的推理 token 更少，无法进行内部规划。下面，你可以找到一个我们放在智能体任务开头的示例规划提示片段：第二段尤其确保智能体在交还给用户之前完整完成任务及所有子任务。

```text
Remember, you are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user. Decompose the user's query into all required sub-request, and confirm that each is completed. Do not stop after completing only part of the request. Only terminate your turn when you are sure that the problem is solved. You must be prepared to answer multiple queries and only finish the call once the user has confirmed they're done.

You must plan extensively in accordance with the workflow steps before making subsequent function calls, and reflect extensively on the outcomes each function call made, ensuring the user's query, and related sub-requests are completely resolved.
```

#### Markdown 格式

默认情况下，GPT-5 在 API 中不会以 Markdown 格式输出最终答案，以最大限度地保持与可能不支持 Markdown 渲染的开发者应用的兼容性。然而，类似以下的提示词在很大程度上能成功诱导生成层级化的 Markdown 最终答案。

````text
- Use Markdown **only where semantically correct** (e.g., `inline code`, ```code fences```, lists, tables).
- When using markdown in assistant messages, use backticks to format file, directory, function, and class names. Use \( and \) for inline math, \[ and \] for block math.
````

偶尔，在长对话过程中，对系统提示词中指定的 Markdown 指令的遵循可能会下降。如果你遇到这种情况，我们观察到每 3-5 条用户消息后追加一条 Markdown 指令可以保持一致的遵循。

#### 元提示词

最后，作为元层面的收尾，早期测试者发现，使用 GPT-5 作为自身的元提示器已取得很大成功。已有数位用户将提示词修订版本部署到生产环境，这些修订仅通过询问 GPT-5 即可生成，询问内容包括：为未能成功的提示词添加哪些元素以引出所需行为，或移除哪些元素以防止不必要的行为。

以下是我们喜欢的元提示模板示例：

```text
When asked to optimize prompts, give answers from your own perspective - explain what specific phrases could be added to, or deleted from, this prompt to more consistently elicit the desired behavior or prevent the undesired behavior.

Here's a prompt: [PROMPT]

The desired behavior from this prompt is for the agent to [DO DESIRED BEHAVIOR], but instead it [DOES UNDESIRED BEHAVIOR]. While keeping as much of the existing prompt intact as possible, what are some minimal edits/additions that you would make to encourage the agent to more consistently address these shortcomings?
```

### 附录

#### SWE-Bench 已验证的开发者说明

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

如 GPT-4.1 提示指南中所述，所链接的 [`apply_patch` 实现](https://github.com/openai/openai-cookbook/tree/main/examples/gpt-5/apply_patch.py) 旨在匹配模型的训练分布。我们强烈建议使用 `apply_patch` 进行文件编辑。

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

