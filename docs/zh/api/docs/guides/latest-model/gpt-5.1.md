# 使用 GPT-5.1

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加以下内容获取 `.md` 来访问。

## 介绍

GPT-5.1 旨在平衡智能与速度，以应对各种智能体和编码任务，同时引入了一种新的 `none` 低延迟交互的推理模式。基于 GPT-5 的优势，GPT-5.1 能更好地校准提示难度，在低复杂度输入上消耗更少的 token，并更高效地处理高难度输入。除此之外，GPT-5.1 在个性、语气和输出格式方面更具可操控性。

虽然 GPT-5.1 对大多数应用开箱即用，但本指南着重介绍能在实际部署中最大化性能的提示模式。这些技巧源于广泛的内部测试以及与构建生产环境 智能体 的合作伙伴的协作，在这些场景中，微小的提示改动往往能大幅提升可靠性和用户体验。我们希望本指南能作为一个起点：提示调优是迭代性的，最佳效果将来自将这些模式适配到你的具体工具和工作流中。

## 新功能

- 新增 `none` 低延迟交互的推理模式
- 在低复杂度和高挑战性输入上，推理 token 的使用得到更好的校准
- 个性、语气和输出格式更具可操控性
- 为编码 智能体 应用补丁和 shell 工具指南

## 迁移快速入门

对于使用 GPT-4.1、GPT-5.1 的开发者， `none` 推理投入度应能自然适配大多数不需要推理的低延迟用例。

对于使用 GPT-5 的开发者，我们看到遵循以下几条关键指导的客户取得了显著成功：

1. **坚持性：** GPT-5.1 现在具有更校准的推理 token 消耗，但有时可能过于简洁，并可能以牺牲答案完整性为代价。通过提示强调坚持性和完整性的重要性可能会有所帮助。
2. **输出格式和冗长程度：** 虽然整体更详细，但 GPT-5.1 偶尔会冗长，因此在指令中明确期望的输出详细程度是值得的。
3. **编码 智能体：** 如果你正在开发编码 智能体，请将你的 `apply_patch` 工具迁移到我们新的命名实现。
4. **指令遵循：** 对于其他行为问题，GPT-5.1 在指令遵循方面表现出色，你应该能够通过检查冲突指令并明确表达来显著塑造行为。

我们还发布了 GPT-5.1-Codex。该模型的行为与 GPT-5.1 不同；参见 [Codex 提示指南](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide) 了解更多信息。关于 API 中后续 Codex 模型的指导，请参阅 [使用 GPT-5.3 Codex](https://developers.openai.com/api/docs/guides/latest-model?model=gpt-5.3-codex).

## 模型、API与功能更新

- `gpt-5.1` 可在 Responses API 和 Chat Completions API 中使用。
- `reasoning.effort` 支持 `none` （默认）， `low`, `medium`，以及 `high`.
- 该模型支持函数调用和 OpenAI 托管的工具，包括 网页搜索、文件搜索、图像生成、代码解释器和应用补丁。
- GPT-5.1-Codex 变体针对智能体编码工作流进行了单独优化。


## 提示词最佳实践

### 智能体可控性

GPT-5.1 是一个高度可操控的模型，可让你对 智能体 的行为、个性和沟通频率进行稳健的控制。

#### 塑造你的智能体的个性

GPT-5.1 的个性与回复风格可根据你的使用场景进行调整。虽然冗长度可通过专用 `verbosity` 参数控制，你还可以通过提示词塑造整体的风格、语气和节奏。

我们发现，当你定义清晰的 智能体角色时，个性与风格效果最佳。这对面向客户的 智能体尤为重要，它们需要展现情商以应对各种用户情境和互动动态。在实践中，这意味着根据对话状态调整亲近度和简洁度，并避免“明白了”或“谢谢”等过多的确认用语。

下面的示例提示词展示了我们如何为客服 智能体塑造个性，重点是在解决问题时平衡直率与亲近感的恰当程度。

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

在下面的提示词中，我们加入了限制编码 智能体回复的段落，使其在小的改动上保持简短，在更详细的查询上则更详细。我们还指定了最终回复中允许的代码量，以避免大段代码块。

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

多余的输出长度可通过调整冗长度参数来缓解，并可通过提示词进一步减少，因为 GPT-5.1 能很好地遵循具体的长度指导：

```text
<output_verbosity_spec>
- Respond in plain text styled in Markdown, using at most 2 concise sentences.
- Lead with what you did (or found) and context only if needed.
- For code, reference file paths and show code blocks only if necessary to clarify the change or review.
</output_verbosity_spec>
```

#### 获取用户更新

用户更新（也称为前言）是 GPT-5.1 在部署期间分享前期计划并以助手消息形式提供一致进度更新的一种方式。用户更新可沿四个主要维度进行调整：频率、详细程度、语气和内容。我们训练模型擅长通过计划、重要见解和决策，以及关于正在做什么及其原因的细粒度上下文来让用户了解情况。这些更新有助于用户更有效地监督智能体部署，无论是在编码还是非编码领域。

如果时机得当，模型将能够分享一个映射到部署当前状态的时点理解。在下面的提示添加中，我们定义了哪些类型的前言是有用的，哪些不是。

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

在较长时间运行的模型执行中，提供快速的初始助手消息可以改善感知延迟和用户体验。我们可以通过清晰的提示与 GPT-5.1 实现这种行为。

```text
<user_update_immediacy>
Always explain what you're doing in a commentary message FIRST, BEFORE sampling an analysis thinking message. This is critical in order to communicate immediately to the user.
</user_update_immediacy>
```

### 优化智能与指令遵循

GPT-5.1 将高度关注你提供的指令，包括关于工具使用、并行性和解决方案完整性的指导。

#### 鼓励提供完整解决方案

在较长的智能体任务中，我们注意到 GPT-5.1 可能会在未达成完整解决方案的情况下提前结束，但我们发现这种行为可以通过提示词来调整。在以下指令中，我们告诉模型避免提前终止和提出不必要的后续问题。

```text
<solution_persistence>
- Treat yourself as an autonomous senior pair-programmer: once the user gives a direction, proactively gather context, plan, implement, test, and refine without waiting for additional prompts at each step.
- Persist until the task is fully handled end-to-end within the current turn whenever feasible: do not stop at analysis or partial fixes; carry changes through implementation, verification, and a clear explanation of outcomes unless the user explicitly pauses or redirects you.
- Be extremely biased for action. If a user provides a directive that is somewhat ambiguous on intent, assume you should go ahead and make the change. If the user asks a question like "should we do x?" and your answer is "yes", you should also go ahead and perform the action. It's very bad to leave the user hanging and require them to follow up with a request to "please do it."
</solution_persistence>
```

#### 工具调用格式

为了使工具调用最有效，我们建议在工具定义中描述功能，并在提示词中说明如何/何时使用工具。在下面的示例中，我们定义了一个创建餐厅预订的工具，并简洁地描述了它被调用时的作用。

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

在提示词中，你可以有一个引用该工具的部分，如下所示：

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

GPT-5.1 还能更高效地执行并行工具调用。在扫描代码库或从向量存储中检索时，启用并行工具调用并在工具描述中鼓励模型使用并行是一个很好的起点。在系统提示词中，你可以通过提供一些允许并行的示例来强化并行工具的使用。示例指令可能如下：

```text
Parallelize tool calls whenever possible. Batch reads (read_file) and edits (apply_patch) to speed up the process.
```

#### 使用“none”推理模式以提高效率

GPT-5.1 引入了一种新的推理模式： `none`。与 GPT-5 之前的 `minimal` 设置不同， `none` 强制模型不使用推理 token，使其在使用上更接近 GPT-4.1、GPT-4o 以及其他先前的非推理模型。重要的是，开发者现在可以使用托管工具，如 [网页搜索](https://developers.openai.com/api/docs/guides/tools-web-search?api-mode=responses) 和 [文件搜索](https://developers.openai.com/api/docs/guides/tools?tool-type=file-search) 结合使用 `none`，自定义函数调用的性能也显著提升。考虑到这一点， [关于提示非推理模型的先前指导](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide) （如 GPT-4.1）同样适用于此，包括使用少样本提示和高质量的工具描述。

虽然 GPT-5.1 在使用 `none`，时不使用推理 token，但我们发现提示模型仔细考虑计划调用的函数可以提高准确性。

```text
You MUST plan extensively before each function call, and reflect extensively on the outcomes of the previous function calls, ensuring user's query is completely resolved. DO NOT do this entire process by making function calls only, as this can impair your ability to solve the problem and think insightfully. In addition, ensure function calls have the correct arguments.
```

我们还观察到，在较长的模型执行过程中，鼓励模型“验证”其输出可以更好地遵循指令进行工具使用。以下是我们澄清工具用法时在指令中使用的示例。

```text
When selecting a replacement variant, verify it meets all user constraints (cheapest, brand, spec, etc.). Quote the item-id and price back for confirmation before executing.
```

在我们的测试中，GPT-5 之前的 `minimal` 推理模式有时会导致执行提前终止。虽然其他推理模式可能更适合这些任务，但我们对 GPT-5.1 在使用 `none` 时的指导类似。以下是来自 Tau 基准测试提示的示例片段。

```text
Remember, you are an agent - please keep going until the user’s query is completely resolved, before ending your turn and yielding back to the user. You must be prepared to answer multiple queries and only finish the call once the user has confirmed they're done.
```

### 从规划到执行，最大化编码性能

对于长时间运行的任务，我们推荐实现一种规划工具。你可能已经注意到推理模型会在其推理摘要中进行规划。虽然这在当时很有帮助，但要跟踪模型相对于查询执行的位置可能会很困难。

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

规划工具可以用最少的脚手架来实现。在我们的规划工具实现中，我们传递一个合并参数以及一个待办事项列表。列表包含简要描述、任务当前状态以及分配给的 ID。以下是一个 GPT-5.1 可能用来记录其状态的函数调用示例。

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

#### 设计系统强制

在构建前端界面时，GPT-5.1 可以被引导以生成符合你视觉设计系统的网站。我们建议使用 Tailwind 来渲染 CSS，你可以进一步定制以符合你的设计指南。在下面的示例中，我们定义了一个设计系统来约束 GPT-5.1 生成的颜色。

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

GPT-5.1 已在编码场景中常用的特定工具上进行了后训练。现在，你可以使用预定义的 apply_patch 工具与你的环境中的文件进行交互。类似地，我们添加了一个 shell 工具，让模型可以为你的系统提出要运行的命令。

#### 使用 apply_patch

apply_patch 工具可让 GPT-5.1 使用结构化差异在你的代码库中创建、更新和删除文件。模型不只是建议编辑，而是发出补丁操作，你的应用程序应用这些操作并随后回报结果，从而支持迭代式多步骤代码编辑工作流。你可以在以下位置找到更多使用细节和上下文： [GPT-4.1 提示指南](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide#:~:text=PYTHON_TOOL_DESCRIPTION%20%3D%20%22%22%22This,an%20exclamation%20mark.).

使用 GPT-5.1，你可以将 apply_patch 用作新的工具类型，而无需为工具编写自定义描述。描述和处理由 Responses API 管理。在底层，此实现使用自由形式的函数调用，而非 JSON 格式。在测试中，命名函数将 apply_patch 失败率降低了 35%。

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


当模型决定执行 apply_patch 工具时，你将在响应流中收到 apply_patch_call 函数类型。在操作对象内，你将收到一个 type 字段（其值为 `create_file`, `update_file`、 `delete_file`）之一）以及要实施的差异。

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

[此仓库](https://github.com/openai/openai-cookbook/blob/main/examples/gpt-5/apply_patch.py) 包含 apply_patch 工具可执行文件的预期实现。当你的系统完成补丁工具的执行后，Responses API 期望以下形式的工具输出：

```python
{
    "type": "apply_patch_call_output",
    "call_id": call["call_id"],
    "status": "completed" if success else "failed",
    "output": log_output,
}
```


#### 使用 shell 工具

我们还为 GPT-5.1 构建了一个新的 shell 工具。该 shell 工具允许模型通过受控的命令行界面与你的本地计算机交互。模型提出 shell 命令；你的集成执行这些命令并返回输出。这创建了一个简单的计划-执行循环，让模型能够检查系统、运行实用程序并收集数据，直到完成任务。

shell 工具的调用方式与 apply_patch 相同：将其作为类型为 `shell`.

```python
tools = [{"type": "shell"}]
```


当返回 shell 工具调用时，Responses API 包含一个 `shell_call` 对象，其中包含超时时间、最大输出长度以及要运行的命令。

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

执行 shell 命令后，返回未截断的 stdout/stderr 日志以及退出代码详细信息。

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

### 如何有效进行元提示词

构建提示词可能很繁琐，但这也是解决大多数模型行为问题时能做的最具杠杆效应的事情。小小的包含内容可能会意外地让模型产生不良行为。让我们通过一个规划活动的智能体示例来探讨。在下面的提示词中，面向客户的智能体被要求使用工具来回答用户关于潜在场地和后勤的问题。

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

尽管这是一个强有力的起始提示词，但我们在测试中注意到了一些问题：

- 小的概念性问题（如询问20人领导力晚宴）触发了不必要的工具调用和非常具体的场地建议，尽管提示词允许对简单、高层级的问题使用内部知识。

- 智能体在过于冗长（多日奥斯汀异地会议演变为密集多节的文章）和过于犹豫（拒绝在未提出更多问题的情况下给出方案）之间摇摆不定，并且偶尔忽略单元规则（柏林峰会用英里和°F描述，而非公里和°C）。

与其手动猜测系统提示中的哪些行导致了这些行为，我们可以对 GPT-5.1 进行元提示，让它检查自身的指令和追踪。

**步骤 1**：请 GPT-5.1 诊断故障

将系统提示和一小批失败示例粘贴到单独的调用中进行分析。基于你已看到的评估，先简要概述你预期要处理的失败模式，但将事实调查工作留给模型。

请注意，在此提示中，我们还没有要求给出解决方案，只要求进行根本原因分析。

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

当反馈在逻辑上可以归为一组时，元提示的效果最佳。如果你提供太多失败模式，模型可能难以将所有线索串联起来。在此示例中，失败日志的转储可能包含一些错误示例，例如模型在回答用户问题时过于冗长或过于简短。对于模型过于急切调用工具的问题，则会单独发出查询。

**步骤 2：** 请 GPT-5.1 给出如何修补提示以修复这些行为

一旦你获得该分析，你可以进行第二次独立的调用，专注于实现：在不完全重写提示的前提下进行收紧。

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

在此示例中，第一个元提示帮助 GPT-5.1 直接指向相互矛盾的部分（例如重叠的工具规则，以及自主性与澄清指导之间的冲突），第二个元提示将该分析转化为事件策划智能体指令的简洁、清理后的版本。

第二个提示的输出可能看起来像这样：

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

在此迭代周期之后，再次运行查询以观察任何回归，并重复此过程，直到你的失败模式被识别和处理完毕。

随着你继续扩展你的智能体系统（例如，扩大范围或增加工具调用的数量），考虑对你想要做的增补进行元提示，而不是手工添加。这有助于为每个工具及其使用时机保持清晰的边界。

### 后续内容

总之，GPT-5.1 建立在 GPT-5 奠定的基础上，并增添了诸如对简单问题更快思考、模型输出可操控性、用于编程场景的新工具，以及将推理设置为 `none` （当你的任务无需深度思考时）的选项。

查看 [GPT-5.1 模型和 API 指南](#model-api-and-feature-updates)，或阅读 [博客文章](https://openai.com/index/gpt-5-1-for-developers/) 以了解更多信息。

