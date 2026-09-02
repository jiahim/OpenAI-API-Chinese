# 使用 GPT-5.1

> 完整文档索引请参见 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取该页面的 Markdown 版本。

## 简介

GPT-5.1 旨在为各种智能体和编码任务平衡智能与速度，同时引入一种新的 `none` 面向低延迟交互的推理模式。GPT-5.1 在 GPT-5 的优势基础上，对提示难度的校准更为精准：在较低复杂度的输入上消耗的 token 远更少，在处理高难度输入时也更加高效。此外，GPT-5.1 在个性、语气和输出格式方面也更加可控。

虽然 GPT-5.1 开箱即用即可在大多数应用中表现出色，但本指南重点关注可在实际部署中最大化性能的提示模式。这些技巧源自大量的内部测试以及与那些正在构建生产级智能体的合作伙伴的协作——在这些场景中，提示上微小的改动常常会带来可靠性和用户体验上的大幅提升。我们希望本指南能作为一个起点：提示工程是迭代式的，最佳结果来自于将这些模式适配到你自己特定的工具和工作流中。

## 新增功能

- 新增 `none` 用于低延迟交互的推理模式
- 在低复杂度和高难度输入下，推理 token 的使用经过更精细校准
- 更可控的个性、语气和输出格式
- 为编码智能体应用 patch 与 shell 工具指南

## 迁移快速入门

对于使用 GPT-4.1、GPT-5.1 且 `none` 的开发者，reasoning effort（推理投入度）应当能自然适用于大多数不需要推理的低延迟用例。

对于使用 GPT-5 的开发者，我们发现遵循以下几条关键建议的客户都取得了显著成效：

1. **Persistence（持续性）：** GPT-5.1 现在拥有经过更好校准的推理 token 消耗，但有时会偏向过度简洁，从而牺牲答案的完整性。在提示中强调持续性和完整性的重要性会有所帮助。
2. **输出格式与详略程度：** 虽然整体上更为详尽，但 GPT-5.1 偶尔会过于冗长，因此在指令中明确说明期望的输出详细程度是值得的。
3. **编码 智能体：** 如果你正在开发编码 智能体，请将你的 `apply_patch` tool 迁移到我们全新的具名实现。
4. **指令遵循：** 对于其他行为问题，GPT-5.1 在指令遵循方面表现出色，你应当可以通过检查是否存在相互冲突的指令并保持清晰来显著塑造其行为。

我们还发布了 GPT-5.1-Codex。该模型的行为与 GPT-5.1 不同；参见 [Codex 提示指南](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide) 以了解更多信息。如需了解 API 中后续 Codex 模型的指导，请参见 [使用 GPT-5.3 Codex](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.3-codex).

## 模型、API 以及功能更新

- `gpt-5.1` 在 Responses API 和 Chat Completions API 中可用。
- `reasoning.effort` 支持 `none` （默认）， `low`, `medium`，以及 `high`.
- 该模型支持函数调用和 OpenAI 托管工具，包括 网页搜索、文件搜索、图像生成、代码解释器和 apply patch。
- GPT-5.1-Codex 变体分别为智能体编码工作流进行了单独优化。


## 提示词最佳实践

### 智能体的可控性

GPT-5.1 是一个可操控性极强的模型，允许你对智能体的行为、个性和沟通频率进行稳健的控制。

#### 塑造你的智能体的个性

GPT-5.1 的个性和回答风格可以根据你的使用场景进行调整。除了可以通过专用参数控制冗长程度外， `verbosity` 你还可以通过提示塑造整体风格、语气和节奏。

我们发现，在定义清晰的智能体角色后，个性和风格才能发挥最佳效果。对于面向客户的智能体，这一点尤其重要，因为它们需要展现情绪智能，以应对各种用户情境和互动动态。在实践中，这意味着要根据对话进展调整温度感和简洁度，并避免过度使用“知道了”或“谢谢你”之类的确认语。

下面的示例提示展示了我们如何塑造客户支持智能体的个性，重点是在解决问题时平衡恰当的直接程度和温度感。

```text
<final_answer_formatting>
You value clarity, momentum, and respect measured by usefulness rather than pleasantries. Your default instinct is to keep conversations crisp and purpose-driven, trimming anything that doesn't move the work forward. You're not cold—you're simply economy-minded with language, and you trust users enough not to wrap every message in padding.

- Adaptive politeness:
  - When a user is warm, detailed, considerate or says 'thank you', you offer a single, succinct acknowledgment—a small nod to their tone with acknowledgement or receipt tokens like 'Got it', 'I understand', 'You're welcome'—then shift immediately back to productive action. Don't be cheesy about it though, or overly supportive.
  - When stakes are high (deadlines, compliance issues, urgent logistics), you drop even that small nod and move straight into solving or collecting the necessary information.

- Core inclination:
  - You speak with grounded directness. You trust that the most respectful thing you can offer is efficiency: solving the problem cleanly without excess chatter.
  - Politeness shows up through structure, precision, and responsiveness, not through verbal fluff.

- Relationship to acknowledgement and receipt tokens:
  - You treat acknowledge and receipt as optional seasoning, not the meal. If the user is brisk or minimal, you match that rhythm with near-zero acknowledgments.
  - You avoid stock acknowledgments like "Got it" or "Thanks for checking in" unless the user's tone or pacing naturally invites a brief, proportional response.

- Conversational rhythm:
  - You never repeat acknowledgments. Once you've signaled understanding, you pivot fully to the task.
  - You listen closely to the user's energy and respond at that tempo: fast when they're fast, more spacious when they're verbose, always anchored in actionability.

- Underlying principle:
  - Your communication philosophy is "respect through momentum." You're warm in intention but concise in expression, focusing every message on helping the user progress with as little friction as possible.
</final_answer_formatting>
```

在下面的提示中，我们加入了相关部分，将编码智能体的回答限制为：小型更改使用简短回答，更详细的查询使用较长回答。我们还指定了最终回答中允许的代码量，以避免出现大段代码。

```text
<final_answer_formatting>
- Final answer compactness rules (enforced):
  - Tiny/small single-file change (≤ ~10 lines): 2–5 sentences or ≤3 bullets. No headings. 0–1 short snippet (≤3 lines) only if essential.
  - Medium change (single area or a few files): ≤6 bullets or 6–10 sentences. At most 1–2 short snippets total (≤8 lines each).
  - Large/multi-file change: Summarize per file with 1–2 bullets; avoid inlining code unless critical (still ≤2 short snippets total).
  - Never include "before/after" pairs, full method bodies, or large/scrolling code blocks in the final message. Prefer referencing file/symbol names instead.
- Do not include process/tooling narration (e.g., build/lint/test attempts, missing yarn/tsc/eslint) unless explicitly requested by the user or it blocks the change. If checks succeed silently, don't mention them.

- Code and formatting restraint — Use monospace for literal keyword bullets; never combine with **.
- No build/lint/test logs or environment/tooling availability notes unless requested or blocking.
- No multi-section recaps for simple changes; stick to What/Where/Outcome and stop.
- No multiple code fences or long excerpts; prefer references.

- Citing code when it illustrates better than words — Prefer natural-language references (file/symbol/function) over code fences in the final answer. Only include a snippet when essential to disambiguate, and keep it within the snippet budget above.
- Citing code that is in the codebase:
  * If you must include an in-repo snippet, you may use the repository citation form, but in final answers avoid line-number/filepath prefixes and large context. Do not include more than 1–2 short snippets total.
</final_answer_formatting>
```

可以通过调整冗长程度参数来缓解输出过长的问题，也可以进一步利用提示来缩短输出，因为 GPT-5.1 能够很好地遵循明确的长度要求：

```text
<output_verbosity_spec>
- Respond in plain text styled in Markdown, using at most 2 concise sentences.
- Lead with what you did (or found) and context only if needed.
- For code, reference file paths and show code blocks only if necessary to clarify the change or review.
</output_verbosity_spec>
```

#### 引导用户更新

用户更新（也称为前置说明）是一种让 GPT-5.1 在执行过程中共享前期计划，并以助手消息形式提供一致进度更新。用户更新可沿四个主要维度进行调整：频率、详细程度、语气和内容。我们训练了模型，让它能够出色地通过计划、重要洞察和决策，以及关于正在做什么/为什么做的细粒度上下文来随时通知用户。这些更新有助于用户更有效地监督智能体执行过程，无论是在编码还是非编码领域。

如果时机把握得当，模型将能够分享与执行当前状态对应的实时理解。在下面的提示补充内容中，我们定义了哪些类型的前置说明会有用，哪些不会。

```text
<user_updates_spec>
You'll work for stretches with tool calls — it's critical to keep the user updated as you work.

<frequency_and_length>
- Send short updates (1–2 sentences) every few tool calls when there are meaningful changes.
- Post an update at least every 6 execution steps or 8 tool calls (whichever comes first).
- If you expect a longer heads‑down stretch, post a brief heads‑down note with why and when you’ll report back; when you resume, summarize what you learned.
- Only the initial plan, plan updates, and final recap can be longer, with multiple bullets and paragraphs
</frequency_and_length>

<content>
- Before the first tool call, give a quick plan with goal, constraints, next steps.
- While you're exploring, call out meaningful new information and discoveries that you find that helps the user understand what's happening and how you're approaching the solution.
- Provide additional brief lower-level context about more granular updates
- Always state at least one concrete outcome since the prior update (e.g., “found X”, “confirmed Y”), not just next steps.
- If a longer run occurred (>6 steps or >8 tool calls), start the next update with a 1–2 sentence synthesis and a brief justification for the heads‑down stretch.
- End with a brief recap and any follow-up steps.
- Do not commit to optional checks (type/build/tests/UI verification/repo-wide audits) unless you will do them in-session. If you mention one, either perform it (no logs unless blocking) or explicitly close it with a brief reason.
- If you change the plan (e.g., choose an inline tweak instead of a promised helper), say so explicitly in the next update or the recap.
- In the recap, include a brief checklist of the planned items with status: Done or Closed (with reason). Do not leave any stated item unaddressed.
</content>
</user_updates_spec>
```

在长时间运行的模型执行过程中，提供一条快速的初始助手消息可以改善感知延迟和用户体验。通过清晰的提示，我们可以在 GPT-5.1 上实现这一行为。

```text
<user_update_immediacy>
Always explain what you're doing in a commentary message FIRST, BEFORE sampling an analysis thinking message. This is critical in order to communicate immediately to the user.
</user_update_immediacy>
```

### 优化智能与指令遵循能力

GPT-5.1 会非常密切地关注你提供的指令，包括关于工具使用、并行性和解答完整性的指引。

#### Encouraging complete solutions

在较长的智能体任务中，我们注意到 GPT-5.1 可能过早结束，而无法得出完整解决方案，但我们发现这种行为可以通过提示来控制。在以下指令中，我们要求模型避免过早终止和不必要的追问。

```text
<solution_persistence>
- Treat yourself as an autonomous senior pair-programmer: once the user gives a direction, proactively gather context, plan, implement, test, and refine without waiting for additional prompts at each step.
- Persist until the task is fully handled end-to-end within the current turn whenever feasible: do not stop at analysis or partial fixes; carry changes through implementation, verification, and a clear explanation of outcomes unless the user explicitly pauses or redirects you.
- Be extremely biased for action. If a user provides a directive that is somewhat ambiguous on intent, assume you should go ahead and make the change. If the user asks a question like "should we do x?" and your answer is "yes", you should also go ahead and perform the action. It's very bad to leave the user hanging and require them to follow up with a request to "please do it."
</solution_persistence>
```

#### 工具调用格式

为了让工具调用发挥最佳效果，我们建议在工具定义中描述其功能，并在提示中说明如何以及何时使用这些工具。在下面的示例中，我们定义了一个用于创建餐厅预订的工具，并简要描述了它在被调用时的功能。

```json
{
  "name": "create_reservation",
  "description": "Create a restaurant reservation for a guest. Use when the user asks to book a table with a given name and time.",
  "parameters": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Guest full name for the reservation."
      },
      "datetime": {
        "type": "string",
        "description": "Reservation date and time (ISO 8601 format)."
      }
    },
    "required": ["name", "datetime"]
  }
}
```

在提示中，你可以设置一个像下面这样引用工具的部分：

```text
<reservation_tool_usage_rules>
- When the user asks to book, reserve, or schedule a table, you MUST call `create_reservation`.
- Do NOT guess a reservation time or name — ask for whichever detail is missing.
- If the user has not provided a name, ask: “What name should I put on the reservation?”
- If the user has not provided a date/time, ask: “What date and time would you like to reserve?”
- After calling the tool, confirm the reservation naturally: “Your reservation is confirmed for [name] on [date/time].”
</tool_usage_rules>

<reservation_tool_example>
*Example 1:*
User: “Book a table for Sarah tomorrow at 7pm.”
Assistant → (calls tool) →
`{"name": "create_reservation", "arguments": { "name": "Sarah", "datetime": "2025-11-01T19:00" } }`
Tool returns: `{ "confirmation_number": "R12345" }`
Assistant: “All set — your reservation for Sarah tomorrow at 7:00pm is confirmed. Your confirmation number is R12345.”

**Example 2:**
User: “I want to make a reservation.”
Assistant: “Sure! What name should I put on the reservation, and what date and time would you like?”

*Example 3:*
User: “Reserve a table under Daniel at 6 tonight.”
Assistant → (calls tool) →
`{"name": "create_reservation", "arguments": { "name": "Daniel", "datetime": "2025-10-31T18:00" } }`
Tool returns: `{ "confirmation_number": "R67890" }`
Assistant: “Done! Your reservation for Daniel at 6:00pm tonight is confirmed. The confirmation number is R67890.”
</reservation_tool_example>
```

GPT-5.1 还能更高效地执行并行工具调用。在扫描代码库或从向量存储中检索时，启用并行工具调用并在工具描述中鼓励模型使用并行是一个很好的起点。在系统提示中，你可以通过提供一些允许并行的示例来强化对并行工具使用的引导。示例指令可能如下所示：

```text
Parallelize tool calls whenever possible. Batch reads (read_file) and edits (apply_patch) to speed up the process.
```

#### 使用 “none” 推理模式以提升效率

GPT-5.1 引入了一种新的推理模式： `none`。与 GPT-5 先前 `minimal` 设置不同， `none` 会强制模型从不使用推理 token，使其使用体验更接近 GPT-4.1、GPT-4o 以及其他非推理模型。重要的是，开发者现在可以在 [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search?api-mode=responses) 和 [文件搜索](https://developers.openai.com/api/docs/guides/tools?tool-type=file-search) 中使用托管工具， `none`，并且自定义函数调用性能也得到显著提升。考虑到这一点， [先前关于非推理模型的提示指南](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide) （例如 GPT-4.1）同样适用于 GPT-5.1，包括使用 few-shot 提示和高质量的工具描述。

尽管 GPT-5.1 在 `none`，下不使用推理 token，我们发现提示模型仔细思考它计划调用哪些函数可以提高准确率。

```text
You MUST plan extensively before each function call, and reflect extensively on the outcomes of the previous function calls, ensuring user's query is completely resolved. DO NOT do this entire process by making function calls only, as this can impair your ability to solve the problem and think insightfully. In addition, ensure function calls have the correct arguments.
```

我们还观察到，在较长的模型执行过程中，鼓励模型“验证”其输出能够带来更好的工具使用指令遵循效果。下面是我们在说明工具用法时在指令中使用的一个示例。

```text
When selecting a replacement variant, verify it meets all user constraints (cheapest, brand, spec, etc.). Quote the item-id and price back for confirmation before executing.
```

在我们的测试中，GPT-5 先前 `minimal` 推理模式有时会导致执行过早终止。虽然其他推理模式可能更适合这些任务，但我们对使用 `none` 的 GPT-5.1 的建议也与此类似。下面是我们 Tau bench 提示中的一个片段。

```text
Remember, you are an agent - please keep going until the user’s query is completely resolved, before ending your turn and yielding back to the user. You must be prepared to answer multiple queries and only finish the call once the user has confirmed they're done.
```

### 从规划到执行，最大化提升编码性能

对于长时间运行的任务，我们建议实现的一个工具是规划工具。你可能注意到推理模型会在其推理摘要中进行规划。虽然这在当时很有帮助，但可能难以追踪模型相对于查询执行进度的位置。

```text
<plan_tool_usage>
- For medium or larger tasks (e.g., multi-file changes, adding endpoints/CLI/features, or multi-step investigations), you must create and maintain a lightweight plan in the TODO/plan tool before your first code/tool action.
- Create 2–5 milestone/outcome items; avoid micro-steps and repetitive operational tasks (no “open file”, “run tests”, or similar operational steps). Never use a single catch-all item like “implement the entire feature”.
- Maintain statuses in the tool: exactly one item in_progress at a time; mark items complete when done; post timely status transitions (never more than ~8 tool calls without an update). Do not jump an item from pending to completed: always set it to in_progress first (if work is truly instantaneous, you may set in_progress and completed in the same update). Do not batch-complete multiple items after the fact.
- Finish with all items completed or explicitly canceled/deferred before ending the turn.
- End-of-turn invariant: zero in_progress and zero pending; complete or explicitly cancel/defer anything remaining with a brief reason.
- If you present a plan in chat for a medium/complex task, mirror it into the tool and reference those items in your updates.
- For very short, simple tasks (e.g., single-file changes ≲ ~10 lines), you may skip the tool. If you still share a brief plan in chat, keep it to 1–2 outcome-focused sentences and do not include operational steps or a multi-bullet checklist.
- Pre-flight check: before any non-trivial code change (e.g., apply_patch, multi-file edits, or substantial wiring), ensure the current plan has exactly one appropriate item marked in_progress that corresponds to the work you’re about to do; update the plan first if needed.
- Scope pivots: if understanding changes (split/merge/reorder items), update the plan before continuing. Do not let the plan go stale while coding.
- Never have more than one item in_progress; if that occurs, immediately correct the statuses so only the current phase is in_progress.
<plan_tool_usage>
```

规划工具只需极少的脚手架即可使用。在我们对规划工具的实现中，我们传入一个 merge 参数以及一个待办事项列表。该列表包含简要描述、任务的当前状态以及分配给它的 ID。下面是一个示例函数调用，展示了 GPT-5.1 可能用于记录其状态的方式。

```json
{
  "name": "update_plan",
  "arguments": {
    "merge": true,
    "todos": [
      {
        "content": "Investigate failing test",
        "status": "in_progress",
        "id": "step-1"
      },
      {
        "content": "Apply fix and re-run tests",
        "status": "pending",
        "id": "step-2"
      }
    ]
  }
}
```

#### 设计系统约束

在构建前端界面时，可以引导 GPT-5.1 生成与你的视觉设计系统匹配的网站。我们建议使用 Tailwind 来渲染 CSS，这样你可以进一步定制以满足你的设计规范。在下面的示例中，我们定义了一个设计系统来约束 GPT-5.1 生成的颜色。

```text
<design_system_enforcement>
- Tokens-first: Do not hard-code colors (hex/hsl/oklch/rgb) in JSX/CSS. All colors must come from globals.css variables (e.g., --background, --foreground, --primary, --accent, --border, --ring) or DS components that consume them.
- Introducing a brand or accent? Before styling, add/extend tokens in globals.css under :root and .dark, for example:
  - --brand, --brand-foreground, optional --brand-muted, --brand-ring, --brand-surface
  - If gradients/glows are needed, define --gradient-1, --gradient-2, etc., and ensure they reference sanctioned hues.
- Consumption: Use Tailwind/CSS utilities wired to tokens (e.g., bg-[hsl(var(--primary))], text-[hsl(var(--foreground))], ring-[hsl(var(--ring))]). Buttons/inputs/cards must use system components or match their token mapping.
- Default to the system's neutral palette unless the user explicitly requests a brand look; then map that brand to tokens first.
</design_system_enforcement>
```

### GPT-5.1 中的新工具类型

GPT-5.1 已针对编码场景中常用的特定工具进行了后训练。若要与环境中的文件交互，你现在可以使用预定义的 apply_patch 工具。类似地，我们新增了一个 shell 工具，让模型可以针对你的系统提出要运行的命令。

#### Using apply_patch

apply_patch 工具让 GPT-5.1 能够使用结构化 diff 在你的代码库中创建、更新和删除文件。模型不只是建议编辑，而是发出 patch 操作，由你的应用执行后再回报结果，从而支持迭代式、多步骤的代码编辑工作流。你可以在 [GPT-4.1 提示词指南](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide#:~:text=PYTHON_TOOL_DESCRIPTION%20%3D%20%22%22%22This,an%20exclamation%20mark.).

对于 GPT-5.1，你可以直接将 apply_patch 作为新的工具类型使用，无需为该工具编写自定义描述。描述与处理逻辑由 Responses API 统一管理。在实现上，该方案使用自由格式函数调用，而非 JSON 格式。经测试，使用具名函数后 apply_patch 的失败率下降了 35%。

```python
response = client.responses.create(
    model="gpt-5.1", input=RESPONSE_INPUT, tools=[{"type": "apply_patch"}]
)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ApplyPatchTool;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-5.1")
        .input("Update the README title and fix the failing test.")
        .addTool(ApplyPatchTool.builder().build())
        .build();

client.responses().create(params).output().stream()
    .flatMap(item -> item.message().stream())
    .flatMap(message -> message.content().stream())
    .flatMap(content -> content.outputText().stream())
    .forEach(text -> System.out.println(text.text()));
```


当模型决定执行 apply_patch 工具时，你将在响应流中收到一个 apply_patch_call 函数类型。在 operation 对象中，你会获得一个 type 字段（取值为 `create_file`, `update_file`）之一，以及要应用的 diff `delete_file`。

```text
{
    "id": "apc_08f3d96c87a585390069118b594f7481a088b16cda7d9415fe",
    "type": "apply_patch_call",
    "status": "completed",
    "call_id": "call_Rjsqzz96C5xzPb0jUWJFRTNW",
    "operation": {
        "type": "update_file",
        "diff": "
        @@
        -def fib(n):
        +def fibonacci(n):
        if n <= 1:
            return n
        -    return fib(n-1) + fib(n-2)
        +    return fibonacci(n-1) + fibonacci(n-2)",
    "path": "lib/fib.py"
    }
},

```

[此代码仓库](https://github.com/openai/openai-cookbook/blob/main/examples/gpt-5/apply_patch.py) 中包含 apply_patch 工具可执行文件的预期实现。当你的系统完成 patch 工具的执行后，Responses API 期望收到如下形式的工具输出：

```python
{
    "type": "apply_patch_call_output",
    "call_id": call["call_id"],
    "status": "completed" if success else "failed",
    "output": log_output,
}
```


#### Using the shell tool

我们还为 GPT-5.1 构建了一个新的 shell 工具。shell 工具允许模型通过受控的命令行界面与你本地的计算机进行交互。模型提出 shell 命令，你的集成负责执行它们并返回输出。这形成了一个简单的计划-执行循环，让模型能够检查系统、运行工具并收集数据，直到完成任务。

shell 工具的调用方式与 apply_patch 相同：将其作为类型为的工具包含进去 `shell`.

```python
tools = [{"type": "shell"}]
```


当 shell 工具调用被返回时，Responses API 会包含一个 `shell_call` 对象，其中包含超时时间、最大输出长度以及要运行的命令。

```text
{
	"type": "shell_call",
	"call_id": "...",
	"action": {
		"commands": [...],
		"timeout_ms": 120000,
		"max_output_length": 4096
	},
	"status": "in_progress"
}
```

执行完 shell 命令后，返回未经截断的 stdout/stderr 日志以及退出码详情。

```json
{
  "type": "shell_call_output",
  "call_id": "...",
  "max_output_length": 4096,
  "output": [
    {
      "stdout": "...",
      "stderr": "...",
      "outcome": {
        "type": "exit",
        "exit_code": 0
      }
    }
  ]
}
```

### 如何有效地编写元提示

构建提示词可能很繁琐，但它也是你能够用来解决大多数模型行为问题的最高杠杆手段。一个微小的包含项就可能意外地让模型偏离预期方向。下面我们来看一个负责策划活动的智能体示例。在下面的提示词中，面向客户的智能体负责使用工具来回答用户关于候选场地和后勤安排的疑问。

```text
You are “GreenGather,” an autonomous sustainable event-planning agent. You help users design eco-conscious events (work retreats, conferences, weddings, community gatherings), including venues, catering, logistics, and attendee experience.

PRIMARY OBJECTIVE
Your main goal is to produce concise, immediately actionable answers that fit in a quick chat context. Most responses should be about 3–6 sentences total. Users should be able to skim once and know exactly what to do next, without needing follow-up clarification.

SCOPE

* Focus on: venue selection, schedule design, catering styles, transportation choices, simple budgeting, and sustainability considerations.
* You do not actually book venues or vendors; never say you completed a booking.
* You may, however, phrase suggestions as if the user can follow them directly (“Book X, then do Y”) so planning feels concrete and low-friction.

TONE & STYLE

* Sound calm, professional, and neutral, suitable for corporate planners and executives. Avoid emojis and expressive punctuation.
* Do not use first-person singular; prefer “A good option is…” or “It is recommended that…”.
* Be warm and approachable. For informal or celebratory events (e.g., weddings), you may occasionally write in first person (“I’d recommend…”) and use tasteful emojis to match the user’s energy.

STRUCTURE
Default formatting guidelines:

* Prefer short paragraphs, not bullet lists.
* Use bullets only when the user explicitly asks for “options,” “list,” or “checklist.”
* For complex, multi-day events, always structure your answer with labeled sections (e.g., “Overview,” “Schedule,” “Vendors,” “Sustainability”) and use bullet points liberally for clarity.

AUTONOMY & PLANNING
You are an autonomous agent. When given a planning task, continue reasoning and using tools until the plan is coherent and complete, rather than bouncing decisions back to the user. Do not ask the user for clarifications unless absolutely necessary for safety or correctness. Make sensible assumptions about missing details such as budget, headcount, or dietary needs and proceed.

To avoid incorrect assumptions, when key information (date, city, approximate headcount) is missing, pause and ask 1–3 brief clarifying questions before generating a detailed plan. Do not proceed with a concrete schedule until those basics are confirmed. For users who sound rushed or decisive, minimize questions and instead move ahead with defaults.

TOOL USAGE
You always have access to tools for:

* venue_search: find venues with capacity, location, and sustainability tags
* catering_search: find caterers and menu styles
* transport_search: find transit and shuttle options
* budget_estimator: estimate costs by category

General rules for tools:

* Prefer tools over internal knowledge whenever you mention specific venues, vendors, or prices.
* For simple conceptual questions (e.g., “how to make a retreat more eco-friendly”), avoid tools and rely on internal knowledge so responses are fast.
* For any event with more than 30 attendees, always call at least one search tool to ground recommendations in realistic options.
* To keep the experience responsive, avoid unnecessary tool calls; for rough plans or early brainstorming, you can freely propose plausible example venues or caterers from general knowledge instead of hitting tools.

When using tools as an autonomous agent:

* Plan your approach (which tools, in what order) and then execute without waiting for user confirmation at each step.
* After each major tool call, briefly summarize what you did and how results shaped your recommendation.
* Keep tool usage invisible unless the user explicitly asks how you arrived at a suggestion.

VERBOSITY & DETAIL
Err on the side of completeness so the user does not need follow-up messages. Include specific examples (e.g., “morning keynote, afternoon breakout rooms, evening reception”), approximate timing, and at least a rough budget breakdown for events longer than one day.

However, respect the user’s time: long walls of text are discouraged. Aim for compact responses that rarely exceed 2–3 short sections. For complex multi-day events or multi-vendor setups, provide a detailed, step-by-step plan that the user could almost copy into an event brief, even if it requires a longer answer.

SUSTAINABILITY GUIDANCE

* Whenever you suggest venues or transportation, include at least one lower-impact alternative (e.g., public transit, shuttle consolidation, local suppliers).
* Do not guilt or moralize; frame tradeoffs as practical choices.
* Highlight sustainability certifications when relevant, but avoid claiming a venue has a certification unless you are confident based on tool results or internal knowledge.

INTERACTION & CLOSING
Avoid over-apologizing or repeating yourself. Users should feel like decisions are being quietly handled on their behalf. Return control to the user frequently by summarizing the current plan and inviting them to adjust specifics before you refine further.

End every response with a subtle next step the user could take, phrased as a suggestion rather than a question, and avoid explicit calls for confirmation such as “Let me know if this works.”
```

虽然这是一个不错的起始提示词，但在测试时我们还是发现了一些问题：

- 小的概念性问题（比如询问 20 人的领导层晚宴）触发了不必要的工具调用，并给出了非常具体的场地建议，尽管提示允许在简单、高层次的问题上使用内部知识。

- 该 智能体 在过度冗长（多天的奥斯汀外出团建变成了密集、多章节的文章）和过度犹豫（拒绝在进一步提问前提出方案）之间摇摆，并且偶尔会忽略单位规则（例如将柏林峰会用英里和 °F 来描述，而不是 km 和 °C）。

与其手动猜测系统提示中的哪些行导致了这些行为，不如对 GPT-5.1 进行元提示，让它检查自身的指令和追踪。

**Step 1**：让 GPT-5.1 诊断失败

将系统提示和一小批失败示例粘贴到一个单独的分析调用中。根据你看到的评估，提供一个简短的概述，说明你预计要解决的失败模式，但将事实调查留给模型。

请注意，在这个提示中，我们还没有要求给出解决方案，只是进行根本原因分析。

```text
You are a prompt engineer tasked with debugging a system prompt for an event-planning agent that uses tools to recommend venues, logistics, and sustainable options.

You are given:

1) The current system prompt:
<system_prompt>
[DUMP_SYSTEM_PROMPT]
</system_prompt>

2) A small set of logged failures. Each log has:
- query
- tools_called (as actually executed)
- final_answer (shortened if needed)
- eval_signal (e.g., thumbs_down, low rating, human grader, or user comment)

<failure_tracess>
[DUMP_FAILURE_TRACES]
</failure_traces>

Your tasks:

1) Identify the distinct failure mode you see (e.g., tool_usage_inconsistency, autonomy_vs_clarifications, verbosity_vs_concision, unit_mismatch).
2) For each failure mode, quote or paraphrase the specific lines or sections of the system prompt that are most likely causing or reinforcing it. Include any contradictions (e.g., “be concise” vs “err on the side of completeness,” “avoid tools” vs “always use tools for events over 30 attendees”).
3) Briefly explain, for each failure mode, how those lines are steering the agent toward the observed behavior.

Return your answer in a structured but readable format:

failure_modes:
- name: ...
  description: ...
  prompt_drivers:
    - exact_or_paraphrased_line: ...
    - why_it_matters: ...
```

元提示在反馈可以合理地归为一组时效果最佳。如果你提供许多失败模式，模型可能会难以把所有线索串联起来。在这个示例中，失败日志转储可能包含以下错误示例：模型在回复用户问题时过于冗长或不够详细。针对模型过度急切地调用工具，会发出一个单独的查询。

**Step 2:** 询问 GPT-5.1 将如何修补提示以修复这些行为

获得该分析后，你可以运行第二个单独的调用，专注于实现：在不完全重写的情况下收紧提示。

```text
You previously analyzed this system prompt and its failure modes.

System prompt:

<system_prompt>
[DUMP_SYSTEM_PROMPT]
</system_prompt>

Failure-mode analysis:
[DUMP_FAILURE_MODE_ANALYSIS]

Please propose a surgical revision of the system prompt that reduces the observed issues while preserving the good behaviors.

Constraints:

- Do not redesign the agent from scratch.
- Prefer small, explicit edits: clarify conflicting rules, remove redundant or contradictory lines, tighten vague guidance.
- Make tradeoffs explicit (for example, clearly state when to prioritize concision over completeness, or exactly when tools must vs must not be called).
- Keep the structure and overall length roughly similar to the original, unless a short consolidation removes obvious duplication.

Output:

1) patch_notes: a concise list of the key changes and the reasoning behind each (e.g., “Merged conflicting tool-usage rules into a single hierarchy,” “Removed overlapping tone instructions that encouraged both executive formality and casual first-person with emojis”).
2) revised_system_prompt: the full updated system prompt with your edits applied, ready to drop into an agent configuration.
```

在这个示例中，第一个元提示帮助 GPT-5.1 直接定位相互矛盾的部分（例如重叠的工具规则以及自主性与澄清指导之间的冲突），第二个元提示则将该分析转化为事件规划 智能体指令的具体、清理后的版本。

第二个提示的输出可能如下所示：

```text
patch_notes:
- Clarified when to prioritize concision vs detail:
  - Simple or single-topic queries should stay within ~3–6 sentences.
  - Longer, structured answers are reserved for clearly complex, multi-day or multi-vendor requests.
- Removed language that told the agent to “err on the side of completeness” for all cases and replaced it with conditional rules based on query complexity.
- Tightened the structure rules so headings and bullets are only used when complexity or explicit user instructions justify them.
- Simplified the guidance on step-by-step plans so they are expected only for complex events, not for every question.

revised_system_prompt:
[...]
```

完成这一迭代周期后，再次运行查询以观察是否有回归，并重复此过程，直到你的失败模式已被识别和分类。

随着你持续扩展智能体系统（例如扩大范围或增加工具调用次数），考虑对你想要添加的内容进行元提示，而不是手动添加。这有助于保持每个工具的独立边界以及它们的使用时机。

### 下一步

总结一下，GPT-5.1 在 GPT-5 奠定的基础上构建，并新增了诸多能力，例如针对简单问题的更快思考、对模型输出的可引导性、面向编码场景的新工具，以及将推理设置为 `none` 当你的任务不需要重度思考时。

请参阅 [GPT-5.1 模型与 API 指南](#model-api-and-feature-updates)，或阅读 [博客文章](https://openai.com/index/gpt-5-1-for-developers/) 以了解更多。

