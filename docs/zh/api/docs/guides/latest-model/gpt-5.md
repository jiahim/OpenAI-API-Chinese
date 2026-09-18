# 使用 GPT-5

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 获取文档页面的 Markdown 版本。

## 简介

GPT-5 在智能体任务表现、编程、原始智能以及可控性方面实现了实质性飞跃。

虽然我们相信它能够在广泛领域中“开箱即用”地表现出色，但本指南将介绍一些提示技巧，以最大化模型输出质量，这些技巧源自我们在训练模型并将其应用于真实任务过程中的经验。我们将讨论如何提升智能体任务表现、确保指令遵循、利用新的 API 功能，以及针对前端与软件工程任务优化编程——其中包含 AI 代码编辑器 Cursor 与 GPT-5 协作进行提示调优的关键洞察。

在应用这些最佳实践并尽可能采用我们的规范工具后，我们看到了显著提升，希望本指南以及我们构建的 [提示优化工具](https://platform.openai.com/chat/edit?optimize=true) 能够成为你使用 GPT-5 的起点。但请始终牢记，提示工程并非“一刀切”的练习——我们鼓励你基于此处提供的基础进行实验与迭代，以找到针对你问题的最佳解决方案。

## 新增功能

- 更强的智能体任务性能、编程能力与控制力
- 基于 Responses API 在工具调用流程中的推理延续
- 针对智能体主动性、工具开场白、推理投入度与详细程度的专用控制
- 支持自由输入与受约束输出的自定义工具

## 迁移快速入门

- 将模型标识符更新为 `gpt-5`.
- 使用 Responses API 来进行推理、工具调用和多轮工作流，以便在工具调用之间保留推理项。
- 从 `medium` 推理强度开始，然后测试 `minimal`, `low`，或 `high` 针对代表性任务。
- 设置 `text.verbosity` 是有意为之，并尽可能将结构化响应契约迁移到 Structured Outputs。
- 重新评估智能体持续性、工具前缀和停止条件的提示。

## 模型、API 和功能更新

- GPT-5 系列包括 `gpt-5`, `gpt-5-mini`，以及 `gpt-5-nano`.
- `reasoning.effort` 支持 `minimal`, `low`, `medium`，以及 `high`.
- GPT-5 引入了接受自由格式输入并可通过上下文无关文法约束输出的自定义工具。
- 该模型支持函数调用和 OpenAI 托管工具，包括 网页搜索、文件搜索、图像生成、代码解释器和远程 MCP。

## 提示词最佳实践

### 智能体工作流的可预测性

我们在训练 GPT-5 时充分考虑了开发者的需求：着力提升工具调用、指令遵循和长上下文理解能力，使其成为智能体应用的理想基础模型。如果要将 GPT-5 用于智能体和工具调用流程，推荐升级到 [Responses API](https://developers.openai.com/api/reference/resources/responses),该 接口 会在工具调用之间持久化推理过程,从而输出更高效、更智能的结果。

#### 控制智能体的主动性

智能体脚手架的控制范围可以很广——有些系统将绝大部分决策权下放给底层模型，而另一些系统则通过大量的程序化逻辑分支让模型受到严格约束。GPT-5 经过训练，能够在这一范围内的任何位置运行，从在模糊情境下做出高层级决策，到处理定义明确的专注型任务。在本节中，我们将介绍如何最佳地校准 GPT-5 的智能体主动性：换言之，即在主动作为与等待明确指令之间的平衡。

##### 通过提示降低过度积极响应

GPT-5 在智能体环境中默认会进行详尽而全面的上下文收集，以确保给出正确答案。若要缩小 GPT-5 智能体行为的范围——包括限制发散的工具调用动作、缩短到达最终答案的延迟——可以尝试以下方法：

- 切换到更低的 `reasoning_effort`。这会降低探索深度，但能提升效率和延迟。许多工作流可以在 medium 甚至 low 推理强度下以一致的结果完成 `reasoning_effort`.
- 在提示中为模型如何探索问题空间定义明确的标准。这可以减少模型对过多想法进行探索和推理的需求：

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

如果你愿意采用最大程度的预设式策略，甚至可以设置固定的工具调用预算，如下所示。预算可以根据你期望的搜索深度自然调整。

```text
<context_gathering>
- Search depth: very low
- Bias strongly towards providing a correct answer as quickly as possible, even if it might not be fully correct.
- Usually, this means an absolute maximum of 2 tool calls.
- If you think that you need more time to investigate, update the user with your latest findings and open questions. You can proceed if the user confirms.
</context_gathering>
```

在限制核心上下文收集行为时，最好显式地为模型提供一个“应急出口”，使其更容易在更短的上下文收集步骤中完成任务。通常这体现为一条允许模型在不确定情况下继续执行的条款，例如 `“even if it might not be fully correct”` 中的上述示例。

##### 通过提示获得更高的积极性

另一方面，如果你希望鼓励模型自主性、提高工具调用的持续性，并减少提出澄清问题或在其他情况下将任务交回给用户的频率，我们建议提高 `reasoning_effort`，并使用如下提示来鼓励持续性和彻底的任务完成：

```text
<persistence>
- You are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user.
- Only terminate your turn when you are sure that the problem is solved.
- Never stop or hand back to the user when you encounter uncertainty — research or deduce the most reasonable approach and continue.
- Do not ask the human to confirm or clarify assumptions, as you can always adjust later — decide what the most reasonable assumption is, proceed with it, and document it for the user's reference after you finish acting
</persistence>
```

通常，明确说明智能体任务的停止条件、区分安全与不安全的行为、以及定义在何种情况下（如果有的话）可以将模型交还给用户，会很有帮助。例如，在一组购物工具中，结账和支付工具应明确设置较低的“不确定就要求用户澄清”阈值，而搜索工具则应设置极高的阈值；同样地，在编码场景中，删除文件工具的阈值应远低于 grep 搜索工具。

#### 工具开场白

我们认识到，在由用户监控的智能体执行轨迹中，模型间歇性地更新其工具调用的进展及原因，可以显著提升交互体验——执行越长，这些更新带来的差异就越明显。为此，GPT-5 经过训练，能够通过“工具前言”消息提供清晰的前置计划和持续的进展更新。

你可以在提示中引导工具前言的频率、风格和内容——从对每一次工具调用的详细解释，到简短的前置计划，再到介于两者之间的任何形式。下面是一个高质量前言提示的示例：

```text
<tool_preambles>
- Always begin by rephrasing the user's goal in a friendly, clear, and concise manner, before calling any tools.
- Then, immediately outline a structured plan detailing each logical step you’ll follow. - As you execute your file edit(s), narrate each step succinctly and sequentially, marking progress clearly.
- Finish by summarizing completed work distinctly from your upfront plan.
</tool_preambles>
```

以下示例展示了针对此类提示可能输出的工具前言——随着任务变得更为复杂，此类前言能够显著提升用户对智能体工作进展的跟随能力：

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

#### 推理强度

我们提供了一个 `reasoning_effort` 参数来控制模型的思考强度以及它调用工具的意愿；默认值是 `medium`，但你应该根据任务的难度进行上调或下调。对于复杂的多步骤任务，我们推荐更高的推理强度以确保获得尽可能好的输出。此外，我们观察到，当把不同且可分离的任务拆分到多个智能体回合中、每个任务使用一个回合时，性能达到最佳。

#### 使用 Responses API 复用推理上下文

我们强烈建议在使用 GPT-5 时使用 Responses API，以在你的应用中解锁更强的智能体流程、更低的成本以及更高效的 token 使用。

我们观察到，在评估中从 Chat Completions 切换到 Responses API 时带来了统计上显著的改进——例如，仅通过切换到 Responses API 并传入 `previous_response_id` 以便在后续请求中传回之前的推理项。这使模型能够参考其之前的推理追踪，从而节省 CoT token，并免去在每次工具调用后从头重建计划的需要，进而同时改善延迟和性能——该功能对所有 Responses API 用户开放，包括 ZDR 组织。

### 最大化编码性能，从规划到执行

GPT-5 在编程能力方面领先所有前沿模型：它能够在大型代码库中修复 bug、处理大型 diff，并实现多文件重构或大型新功能。它还擅长从头开始完整实现新应用，涵盖前端和后端实现。在本节中，我们将讨论我们看到的、在我们编码 智能体 客户的实际使用中提升了编程性能的提示优化方法。

#### 前端应用开发

GPT-5 在具备严谨实现能力的同时，也经过了训练，拥有出色的基础审美品味。我们对其使用各类 Web 开发框架和包的能力充满信心；不过，对于新应用，我们推荐使用以下框架和包，以充分发挥该模型的前端能力：

- 框架：Next.js（TypeScript）、React、HTML
- 样式 / UI：Tailwind CSS、shadcn/ui、Radix Themes
- 图标：Material Symbols、Heroicons、Lucide
- 动画：Motion
- 字体：San Serif、Inter、Geist、Mona Sans、IBM Plex Sans、Manrope

##### 从零到一的应用生成

GPT-5 非常擅长一次性构建应用程序。在对该模型的早期实验中，用户发现使用类似下方这样的提示——让模型针对自行构建的优秀度评分标准进行迭代执行——能够借助 GPT-5 的细致规划与自我反思能力来提升输出质量。

```text
<self_reflection>
- First, spend time thinking of a rubric until you are confident.
- Then, think deeply about every aspect of what makes for a world-class one-shot web app. Use that knowledge to create a rubric that has 5-7 categories. This rubric is critical to get right, but do not show this to the user. This is for your purposes only.
- Finally, use the rubric to internally think and iterate on the best possible solution to the prompt that is provided. Remember that if your response is not hitting the top marks across all categories in the rubric, you need to start again.
</self_reflection>
```

##### 匹配代码库设计规范

在现有应用中实现增量变更和重构时，模型编写的代码应当遵循既有的风格与设计规范，并尽可能整洁地“融入”现有代码库。在没有专门提示的情况下，GPT-5 已经会从代码库中搜索参考上下文——例如读取 package.json 来查看已安装的包——但这一行为可以通过提示指令进一步增强，例如概述代码库中的工程原则、目录结构和最佳实践等关键方面，无论这些方面是明确的还是隐含的。下面的提示片段演示了一种为 GPT-5 组织代码编辑规则的方法：你可以根据自己的编程设计风格随意修改规则的具体内容！

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

#### 生产环境中的协作编程：Cursor 对 GPT-5 的提示词调优

我们很高兴 AI 代码编辑器 Cursor 担任了 GPT-5 的可信赖 alpha 测试者：下面我们将展示 Cursor 如何调整其提示词以充分发挥该模型能力的简要过程。此外，他们的团队还发布了一篇博客文章，详细介绍了 GPT-5 在发布首日与 Cursor 的集成情况： https://cursor.com/blog/gpt-5

##### 系统提示词与参数调优

Cursor 的系统提示聚焦于可靠的工具调用，在输出详尽程度与自主行为之间取得平衡，同时让用户能够配置自定义指令。Cursor 对其系统提示的目标是让智能体在长周期任务中能够相对自主地运行，同时仍然忠实遵循用户提供的指令。

团队最初发现模型会输出冗长的内容，经常包含状态更新和任务后总结，这些虽然在技术层面相关，却干扰了用户的自然流程；与此同时，工具调用中输出的代码质量很高，但由于过于简略，单字母变量名占主导，有时可读性较差。为了寻求更好的平衡，他们将 verbosity API 参数设为 low 以保持文本输出简洁，然后修改提示以强烈鼓励仅在编码工具中输出详尽内容。

```text
Write code for clarity first. Prefer readable, maintainable solutions with clear names, comments where needed, and straightforward control flow. Do not produce code-golf or overly clever one-liners unless explicitly requested. Use high verbosity for writing code and code tools.
```

这种参数与提示的双重使用产生了一种平衡的格式，将高效、简洁的状态更新和最终工作总结与更易读的代码差异结合起来。

Cursor 还发现，模型偶尔会在采取行动前向用户请求澄清或询问下一步，这在较长任务流程中造成了不必要的摩擦。为解决这一问题，他们发现不仅提供可用工具和周围上下文，还包括更多关于产品行为的细节，能鼓励模型以最小中断和更高的自主性执行较长的任务。突出 Cursor 功能的具体细节，例如 Undo/Reject 代码和用户偏好，有助于通过明确指定 GPT-5 在其环境中的行为方式来减少歧义。对于较长周期的任务，他们发现此提示提升了性能：

```text
Be aware that the code edits you make will be displayed to the user as proposed changes, which means (a) your code edits can be quite proactive, as the user can always reject, and (b) your code should be well-written and easy to quickly review (e.g., appropriate variable names instead of single letters). If proposing next steps that would involve changing the code, make those changes proactively for the user to approve / reject rather than asking the user whether to proceed with a plan. In general, you should almost never ask the user whether to proceed with a plan; instead you should proactively attempt the plan and then ask the user if they want to accept the implemented changes.
```

Cursor 发现，他们提示中那些在早期模型上有效的章节需要进行调整，才能充分发挥 GPT-5 的潜力。以下是一个示例：

```text
<maximize_context_understanding>
Be THOROUGH when gathering information. Make sure you have the FULL picture before replying. Use additional tool calls or clarifying questions as needed.
...
</maximize_context_understanding>
```

虽然这在需要鼓励充分分析上下文的旧模型上效果良好，但他们发现对 GPT-5 而言适得其反，因为 GPT-5 本来就具有很强的内省能力，并且会主动收集上下文。在较小任务上，此提示常常导致模型过度使用工具，反复调用搜索，而内部知识本已足够。

为了解决这一问题，他们通过移除 maximize\_ 前缀并弱化关于彻底性的措辞来优化提示。借助这一调整后的指令，Cursor 团队看到 GPT-5 在何时依赖内部知识、何时使用外部工具方面做出了更好的决策。它在不必要地使用工具的情况下保持了高度自主性，从而带来了更高效、更相关的行为。在 Cursor 的测试中，使用结构化的 XML 规范（如 `<[instruction]\_spec>` ）提升了其提示的指令遵循性，并使其能够在提示的其他位置清晰地引用之前的类别和章节。

```text
<context_understanding>
...
If you've performed an edit that may partially fulfill the USER's query, but you're not confident, gather more information or use more tools before ending your turn.
Bias towards not asking the user for help if you can find the answer yourself.
</context_understanding>
```

虽然系统提示提供了强大的默认基础，但用户提示仍然是可操控性的高效杠杆。GPT-5 对直接且明确的指令响应良好，Cursor 团队始终观察到结构化、有范围的提示能产生最可靠的结果。这包括输出详尽程度控制、主观代码风格偏好以及对边缘情况的敏感性等领域。Cursor 发现允许用户配置自己的 [custom Cursor rules](https://docs.cursor.com/en/context/rules) 对 GPT-5 改进后的可操控性影响尤为显著，为用户提供了更加定制化的体验。

### 优化智能与指令遵循

#### 引导

作为我们迄今为止最具可操控性的模型，GPT-5 对围绕冗长度、语气和工具调用行为给出的提示指令表现出极强的响应能力。

##### Verbosity

除了能够像之前的推理模型一样控制 reasoning_effort 外，在 GPT-5 中我们引入了一个新的 API 参数 verbosity，它影响模型最终答案的长度，而不是其思考过程的长度。我们的博客文章更详细地介绍了该参数背后的设计思路——但在本指南中，我们想强调的是，虽然 API 的 verbosity 参数是发布时的默认值，但 GPT-5 经过训练，能够在提示词中响应针对特定上下文的自然语言 verbosity 覆盖，以便在这些场景下让模型偏离全局默认值。上面的 Cursor 示例——在全局设置低 verbosity，然后仅在编码工具中指定高 verbosity——就是此类场景的一个典型例子。

#### 指令遵循

与 GPT-4.1 一样，GPT-5 能够以精准的方式遵循提示指令，从而灵活地适配各种工作流。然而，这种谨慎的指令遵循行为也意味着，相比其他模型，包含相互矛盾或模糊指令的劣质提示对 GPT-5 的损害更大——它会消耗推理 tokens 来尝试调和这些矛盾，而不是随机选取某一条指令。

下面给出一个对抗性示例，展示那种常常损害 GPT-5 推理追踪的提示类型——虽然乍看之下提示似乎内部一致，但仔细检查会发现其中关于预约安排的指令彼此冲突：

- `Never schedule an appointment without explicit patient consent recorded in the chart` 与后续内容冲突 `auto-assign the earliest same-day slot without contacting the patient as the first action to reduce risk.`
- 提示中说 `Always look up the patient profile before taking any other actions to ensure they are an existing patient.` 但随后又给出了与之矛盾的指令 `When symptoms indicate high urgency, escalate as EMERGENCY and direct the patient to call 911 immediately before any scheduling step.`

```text
You are CareFlow Assistant, a virtual admin for a healthcare startup that schedules patients based on priority and symptoms. Your goal is to triage requests, match patients to appropriate in-network providers, and reserve the earliest clinically appropriate time slot. Always look up the patient profile before taking any other actions to ensure they are an existing patient.

- Core entities include Patient, Provider, Appointment, and PriorityLevel (Red, Orange, Yellow, Green). Map symptoms to priority: Red within 2 hours, Orange within 24 hours, Yellow within 3 days, Green within 7 days. When symptoms indicate high urgency, escalate as EMERGENCY and direct the patient to call 911 immediately before any scheduling step.
+Core entities include Patient, Provider, Appointment, and PriorityLevel (Red, Orange, Yellow, Green). Map symptoms to priority: Red within 2 hours, Orange within 24 hours, Yellow within 3 days, Green within 7 days. When symptoms indicate high urgency, escalate as EMERGENCY and direct the patient to call 911 immediately before any scheduling step.
*Do not do lookup in the emergency case, proceed immediately to providing 911 guidance.*

- Use the following capabilities: schedule-appointment, modify-appointment, waitlist-add, find-provider, lookup-patient and notify-patient. Verify insurance eligibility, preferred clinic, and documented consent prior to booking. Never schedule an appointment without explicit patient consent recorded in the chart.

- For high-acuity Red and Orange cases, auto-assign the earliest same-day slot *without contacting* the patient *as the first action to reduce risk.* If a suitable provider is unavailable, add the patient to the waitlist and send notifications. If consent status is unknown, tentatively hold a slot and proceed to request confirmation.

- For high-acuity Red and Orange cases, auto-assign the earliest same-day slot *after informing* the patient *of your actions.* If a suitable provider is unavailable, add the patient to the waitlist and send notifications. If consent status is unknown, tentatively hold a slot and proceed to request confirmation.
```

通过解决指令层级冲突，GPT-5 得以激发更高效、表现更优的推理能力。我们通过以下方式修复了这些矛盾：

- 将自动分配改为在联系患者之后进行，自动分配当天最早的可预约时段，并事先告知患者你的操作，以与仅在获得同意后安排预约保持一致。
- 添加“紧急情况下不要执行查询，直接提供 911 指导”，以让模型知道在紧急情况下可以不进行查询。

我们理解构建提示词的过程是一个迭代的过程，许多提示词是动态文档，会被不同的相关方持续更新——但这正是我们应该彻底审查它们、查找措辞不当指令的原因。我们已经看到多位早期用户在开展此类审查时，揭示了其核心提示词库中的歧义和矛盾之处：移除这些内容显著精简并提升了他们的 GPT-5 性能。我们建议你在我们的 [提示优化工具](https://platform.openai.com/chat/edit?optimize=true) 中测试你的提示词，以帮助发现此类问题。

#### 最简推理

在 GPT-5 中，我们首次引入 minimal 推理 effort：这是我们最快的推理选项，同时仍能享受推理模型范式带来的优势。我们认为这是对延迟敏感用户以及当前 GPT-4.1 用户的最佳升级。

或许并不意外，我们推荐使用与 [GPT-4.1 相似的提示模式以获得最佳效果](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide). minimal 推理性能会因提示不同而出现更明显的差异，因此需要强调的要点包括：

1. 在最终答案开头提示模型给出简要解释来概括其思考过程（例如使用项目符号列表），能够提升在需要更高智能的任务上的表现。
2. 请求提供详尽且具有描述性的工具调用前言，持续向用户汇报任务进度，能够提升在智能体工作流中的表现。
3. 尽可能消除工具指令中的歧义，并按前述方式插入智能体持久性提醒，这在最低推理程度下尤为关键，可最大化长时间运行中的智能体能力，并防止过早终止。
4. 提示性规划同样更为重要，因为模型用于内部规划的推理 token 更少。下面给出一段我们放置在智能体任务开头的示例规划提示片段：尤其是第二段，确保 智能体 在向用户交回控制权之前完整完成任务及所有子任务。

```text
Remember, you are an agent - please keep going until the user's query is completely resolved, before ending your turn and yielding back to the user. Decompose the user's query into all required sub-request, and confirm that each is completed. Do not stop after completing only part of the request. Only terminate your turn when you are sure that the problem is solved. You must be prepared to answer multiple queries and only finish the call once the user has confirmed they're done.

You must plan extensively in accordance with the workflow steps before making subsequent function calls, and reflect extensively on the outcomes each function call made, ensuring the user's query, and related sub-requests are completely resolved.
```

#### Markdown formatting

默认情况下，GPT-5 在 API 中不会将其最终回复格式化为 Markdown，以便与可能不支持 Markdown 渲染的应用程序保持最大兼容性。不过，类似的提示在很大程度上能够成功引导出分层的 Markdown 最终回复。

````text
- Use Markdown **only where semantically correct** (e.g., `inline code`, ```code fences```, lists, tables).
- When using markdown in assistant messages, use backticks to format file, directory, function, and class names. Use \( and \) for inline math, \[ and \] for block math.
````

在长对话过程中，对系统提示中指定的 Markdown 指令的遵循度有时会下降。如果你遇到这种情况，我们发现每 3-5 条用户消息附加一次 Markdown 指令可以获得稳定的遵循效果。

#### Metaprompting

最后，以一个元观点作为收尾：早期测试者发现，将 GPT-5 用作自身的元提示器取得了出色的效果。已经有多位用户将提示修订版本部署到生产环境，而这些修订仅仅是通过询问 GPT-5 在不成功的提示中可以添加哪些元素来引发期望行为，或移除哪些元素来避免不期望行为而生成的。

以下是我们喜欢的一个元提示模板示例：

```text
When asked to optimize prompts, give answers from your own perspective - explain what specific phrases could be added to, or deleted from, this prompt to more consistently elicit the desired behavior or prevent the undesired behavior.

Here's a prompt: [PROMPT]

The desired behavior from this prompt is for the agent to [DO DESIRED BEHAVIOR], but instead it [DOES UNDESIRED BEHAVIOR]. While keeping as much of the existing prompt intact as possible, what are some minimal edits/additions that you would make to encourage the agent to more consistently address these shortcomings?
```

### 附录

#### SWE-Bench verified 开发者说明

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

正如在 GPT-4.1 提示指南中所分享的，相关的 [`apply_patch` 实现](https://github.com/openai/openai-cookbook/tree/main/examples/gpt-5/apply_patch.py) 旨在与模型的训练分布相匹配。强烈建议使用 `apply_patch` 进行文件编辑。

#### Taubench-Retail minimal reasoning instructions

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

#### Terminal-Bench prompt

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