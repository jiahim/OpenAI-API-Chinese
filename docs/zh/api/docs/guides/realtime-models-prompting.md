# 使用实时模型

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾追加 `.md` 可获得文档页面的 Markdown 版本。

`gpt-realtime-2` 是我们用于低延迟语音到语音应用的先进推理语音模型。与早期的实时模型相比，它能在说话前思考，更可靠地遵循指令，使用更大的上下文窗口，并以更高的精度调用工具。

为充分利用这些优势，请更有意图地设计提示。明确界定智能体的职责、决策点、工具调用行为及护栏：它应做什么、何时做，以及应避免什么。

从简单开始。不要一开始就过度提示。先用一个最小提示运行
  评估，然后只为在测试中失败的行为添加指令。

## 选择模型

<table>
  <thead>
    <tr>
      <th>Model</th>
      <th>Use when</th>
      <th>Prompting focus</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style={{ whiteSpace: "nowrap" }}>
        [`gpt-realtime-2`](https://developers.openai.com/api/docs/models/gpt-realtime-2)
      </td>
      <td>
        You need the strongest realtime reasoning, tool use, and instruction
        following.
      </td>
      <td>
        Tune reasoning effort, preambles, tool policies, exact entity capture,
        and long-session state.
      </td>
    </tr>
    <tr>
      <td style={{ whiteSpace: "nowrap" }}>
        [`gpt-realtime-1.5`](https://developers.openai.com/api/docs/models/gpt-realtime-1.5)
      </td>
      <td>You need a fast, reliable non-reasoning speech-to-speech model.</td>
      <td>
        Follow the core realtime prompt structure and test for latency-sensitive
        behavior.
      </td>
    </tr>
  </tbody>
</table>



## Realtime 2.0 提示词指南

    

      Use `gpt-realtime-2` when the voice agent needs stronger
      reasoning, tool selection, exact entity handling, or long-session state.
      Start with `reasoning.effort: "low"`, test default preamble
      behavior, and define clear confirmation boundaries before write actions.
    


## Realtime 2 中的变更内容

将 Realtime 2 作为推理语音智能体来提示，而不是作为基础语音机器人。

| 变化                                | 对提示词的影响                                                                                                                                         |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 推理                             | 允许模型在说话或调用工具前，先对复杂任务进行内部推理。使用开场白来避免尴尬的沉默或不必要的填充内容。            |
| 提示词的精确性更为重要         | 将“要乐于助人”等宽泛指导替换为明确的触发条件、行动和例外规则：何时行动、做什么、何时不做。                         |
| 指令冲突的代价更高 | 移除重叠的 `always`, `never`, `only`，以及 `must` 规则，除非确实需要。在规则竞争时定义优先级。                                |
| 工具行为更易引导       | 指定助手何时应立即行动、何时询问缺失信息、何时确认高精度细节、何时在失败后重试或升级处理。                 |
| 开场白是一等行为    | 模型在更长的推理或工具使用流程前，可能会先说简短的更新。引导开场白应在何时出现、应多简短，以及何时跳过它们。 |
| 扩展的上下文窗口               | `gpt-realtime-2` 将实时上下文窗口从32k扩展到128k个令牌，使其更适合长时间会话和更大的系统提示词。                |

开场语并不是隐藏的思维链。它们是简短的口头更新，例如
  “我现在就查那个订单。” 不要要求模型透露私密的推理过程。

## 推荐的提示词结构

使用简短、带标签的小节。模型应能快速找到相关指令。

```text
# Role and Objective

# Personality and Tone

# Language

# Reasoning

# Message Channels

# Preambles

# Verbosity

# Tools

# Unclear Audio

# Entity Capture

# Long Context Behavior

# Escalation
```

并非每个用例都需要所有小节，添加与你的产品相关的小节即可。

## 设置推理努力

`gpt-realtime-2` 可以在延迟与更深层推理之间进行权衡。使用仍能让助手具备足够智能以完成工作流的最低推理级别。

从 `low` 开始，适用于大多数生产环境下的语音智能体。根据任务复杂性、延迟容忍度和失败成本进行上下调整。

| 投入程度    | 适用场景                                            | 示例                                                                 |
| --------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| `minimal` | 延迟最为关键，且任务简单。 | 智能家居指令、定时器、简单日历查询。                    |
| `low`     | 你需要快速响应，同时具备基础推理能力。       | 客户支持、订单查询、简单政策问题。                |
| `medium`  | 助手必须推理多步骤任务。 | 技术支持、诊断、复杂路由。                        |
| `high`    | 更深入的推理能显著提升成功率。       | 高精度工作流、升级决策、带约束条件的任务。 |
| `xhigh`   | 最大推理值得增加延迟和成本。  | 复杂规划、关键分诊、高风险工具编排。      |

除 API 设置外，还要引导模型决定何时推理以及推理多少。

```text
## Reasoning

- For direct answers, simple lookups, and short confirmations, respond quickly and do not reason.
- For multi-step tasks, tool decisions, troubleshooting, or escalation, reason before acting.
- Do not perform extended reasoning when the user's audio is unclear; ask for clarification instead.
```

## 有目的地使用前言

前言是简短的语音更新，让语音智能体在思考、查资料或调用工具时保持响应感。使用得当，它们能让用户确信助手正在工作；使用不当，它们会变成填充内容，增加感知延迟。

`gpt-realtime-2` 默认会生成前言。先测试默认行为。如果不符合你的产品体验，再明确调整。

![前言生成与播放时间线](https://developers.openai.com/images/platform/guides/realtime-2-preambles.png)

```text
## Preambles

Use short preambles only when they help the user understand that work is happening.

### When to use a preamble

Use a preamble when:

- you are about to call a tool that may take noticeable time;
- you need to reason through a multi-step request;
- you are checking records, availability, account state, or policy details;
- you are preparing an escalation or handoff;
- silence would make the assistant feel unresponsive.

When a preamble is needed, output it immediately before substantive reasoning or tool use.

### When to not use a preamble

Do not use a preamble when:

- the answer is direct and can be given immediately;
- the user is only confirming, correcting, or declining something;
- the audio is unclear and you need clarification;
- the latest audio is silence, background noise, hold music, TV audio, or side conversation;
- the tool call is lightweight and the user would not benefit from an update.

### Preamble style

When using a preamble:

- keep it natural, calm, and concise;
- vary the wording across turns;
- describe the action, not the internal reasoning;
- avoid filler.

Avoid phrases like:

- "Let me think..."
- "Hmm..."
- "One moment while I process that..."
- "I am now going to access the tool..."

### Preamble length

Use one short sentence.

Do not exceed two short sentences unless the user needs an explanation before a high-impact action.

### Prefer

- "I'll check that order now."
- "I'll look up your appointment details."
- "I'll verify that before we make any changes."
- "I'll check the policy and then give you the next step."
- "I'll pull that up so we can make sure it's the right account."

### Avoid

- "Let me think about that for a second."
- "Please wait while I process your request."
- "I'm going to use my tools now."
- "Interesting question. I will reason through this carefully."
```

## 控制响应长度

`gpt-realtime-2` 当提示词指定每种任务类型应提供多少细节时，最符合长度指导原则。与其告诉模型“要简洁”，不如在上下文中定义简洁的含义：直接回答、工具结果、问题排查、比较和升级可能各自需要不同的响应长度。

```text
## Verbosity

- Direct answers: Use 1-2 short sentences.
- Clarifying questions: Ask one question at a time.
- Tool results: Summarize the result first, then give only the next useful action.
- Product or option comparisons: Include key differences, tradeoffs, and who each option fits.
- Troubleshooting: Give one step at a time unless the user asks for the full procedure.
- Escalations: Briefly explain why escalation is needed and what will happen next.
```

示例：

> 用户：我应该选择哪个套餐？

> 助手：如果你想要最低成本，请选择基础版。如果你需要团队权限和共享计费，请选择专业版。如果合规审查或管理员控制很重要，请选择企业版。

## 设计工具行为

`gpt-realtime-2` 在工具调用方面更强，但工具行为仍取决于提示词和工具规格的设计。如果提示词未定义何时执行、询问、确认或恢复，助手可能会过早调用工具、提出不必要的问题，或重复失败的调用。

### 设置工具调用急切度

高急切度适合只读、低风险的操作。当工具修改数据、触发外部影响或依赖精确标识符时，低急切度更佳。

| 工具类型                           | 默认行为                                          |
| ----------------------------------- | --------------------------------------------------------- |
| 只读、低风险查找          | 当意图和必填字段明确时调用。           |
| 使用精确标识符进行只读操作     | 查找前确认标识符。                     |
| 用户可见的通信          | 发送前先起草或总结。                        |
| 账户变更                     | 调用前确认。                                   |
| 购买、取消、支付  | 调用前确认金额、目标和后果。   |
| 不可逆或高影响操作 | 明确确认，并在适当时提供升级处理。 |

当你的操作同时包含读和写时，使用这个平衡的默认值。根据你的使用情况进行调整。

```text
## Tools

Use only the tools explicitly provided in the current tool list. Do not invent, assume, simulate, or rename tools.

For read-only tools:

- Call the tool when the user's intent is clear and all required fields are available.
- Do not ask for confirmation unless the lookup depends on a high-precision identifier or there is meaningful risk of using the wrong record.
- Ask a clarification question only if a required field is missing, ambiguous, or conflicting.

For write tools or external actions:

- Summarize the intended action before calling the tool.
- Include the key consequence, such as what will be changed, sent, canceled, ordered, or charged.
- Ask for confirmation.
- Do not call the tool until the user clearly confirms.

For exact identifiers:

- Treat order IDs, tracking numbers, account numbers, confirmation codes, phone numbers, and email addresses as high precision.
- Normalize only when the field type is clear.
- Confirm the final value before account-specific lookups, validation, or write actions.

After tool calls:

- Only say an action was completed after the tool call succeeds.
- If the tool fails, explain the failure briefly, avoid raw errors, and give the user a clear next step.
```

高风险示例：

> 用户：请从我的卡中扣除剩余余额。

错误：

> 助手：我已从你的卡中扣款。

正确：

> 助手：请确认，您希望我从存档的卡中扣款 248.16 美元以支付剩余余额。我是否继续？

### 从工具故障中恢复

工具失败是对话的一部分。良好的恢复应该解释发生了什么，并给用户一个明确的下一步。

不要以同样的方式对待每一次失败。恢复行为应取决于工具类型、失败模式和对用户的影响。有些失败应通过重试静默处理。其他的则需要要求用户澄清、更正标识符、确认新操作或选择备用路径。

```text
## Tool Failures

If a tool call fails:

1. Briefly explain what failed in user-friendly language.
2. Do not blame the user or expose raw tool errors.
3. If the failure may be due to an exact identifier, read back the value used and ask the user to correct it.
4. If the failure may be temporary, offer to retry once.
5. If the same failure happens repeatedly, offer an alternate path or escalation.

Do not repeatedly call the same tool with the same arguments after failure.

Do not ask for a different identifier until you have first checked whether the captured value was correct.
```

错误示例：

> 助手：出错了。

良好：

> 助手：我无法找到与 O R D 破折号 3 1 2 5 B 2 3 匹配的内容。我是否弄错了其中任何部分？

### 保持工具可用性同步

Realtime 模型很乐于提供帮助。如果提示中提到了一个实际上不可用的工具，或者工具列表与提示不匹配，模型可能会虚构一个工具名称或假装已完成该操作。

例如，如果提示引用了 `lookup_order`，但提供的工具名为 `search_orders`，模型可能会调用错误的名称或模拟操作。

```text
## Tool Availability

Use only the tools that are explicitly provided in the current tool list.

Do not invent, assume, or simulate tools. If a tool is mentioned in the instructions but is not present in the tool list, treat it as unavailable.

If the user requests an action that requires an unavailable tool:

1. Do not pretend to complete the action.
2. Briefly explain that the tool is not available.
3. Offer the closest supported next step.

Only say an action was completed after the relevant tool call succeeds.
```

使用附录中的提示审计元提示来审查生产提示
  ，以检查矛盾、缺失工具和脆弱的指令。

## 处理静音和背景音频

语音智能体倾向于默认做出响应。在生产环境中，它们经常会听到不应得到语音响应的音频，例如静音、背景噪音、等待音乐、电视音频或旁白对话。

当助手应保持安静并继续聆听时，使用无操作等待工具。该工具为模型提供了一个有效的非说话动作，而不是让它说出诸如“我在这里”或“我没听清”之类的话。

工具设计：

```json
{
  "name": "wait_for_user",
  "description": "Call this when the latest audio does not need a spoken response, such as silence, background noise, hold music, TV audio, side conversation, or speech not addressed to the assistant. This tool helps end the turn without a spoken reply.",
  "parameters": {
    "type": "object",
    "properties": {},
    "required": []
  }
}
```

搭配提示指令使用：

```text
## Handling Silence and Background Noise

If the latest audio is silence, background noise, hold music, TV audio, side conversation, or speech not addressed to you, call `wait_for_user`.

Do not respond conversationally after calling this tool.

Do not say "I'm here," "I didn't catch that," "Take your time," or "Let me know when you're ready."

Resume normal responses only when the user clearly addresses you or asks for help.
```

将此用于非针对助手的音频，而非模糊的用户请求。如果用户明确在跟助手说话但内容不清晰，应请求澄清。

## 有意识地使用消息通道

`gpt-realtime-2` 可以在评论渠道中生成用户可见的中间消息，并在最终渠道中生成面向用户的最终响应。当行为取决于其出现位置时，请使用特定于渠道的指令。

| 通道      | 用户可见？ | 用途                   |
| ------------ | ------------- | -------------------------- |
| `commentary` | 是           | 开场白和工具调用。  |
| `final`      | 是           | 最终面向用户的消息。 |

例如，工具调用发生在评论频道中。如果你希望助手在工具使用之前、期间或之后说些什么，请在评论频道中指定该行为。

```text
Before calling tools in the commentary channel, briefly tell the user what you are doing.
```

`gpt-realtime-2` 可以在单次交互中发出多个响应阶段。在 API 输出中，这种区别由 `response.done` 事件表示，该事件包含一个 `phase` 值，用于指示内容是评论还是最终答案。

你可以在应用程序中使用此字段以不同方式处理每个阶段。例如，评论可以作为简短的中间更新播放或显示，而 `final_answer` 可以保留给助手的完整响应。

```text
response.output[0].phase: "commentary"
response.output[1].phase: "final_answer"
```

响应阶段示例

用户提示：

> "我被这道 AP 生物题难住了 [QUESTION]。"

缩短的 API 响应：

```json
{
  "type": "response.done",
  "response": {
    "output": [
      {
        "phase": "commentary",
        "content": [
          {
            "type": "output_audio",
            "transcript": "Let's zero in on the enzyme's shape and binding, since that's the key idea here."
          }
        ]
      },
      {
        "phase": "final_answer",
        "content": [
          {
            "type": "output_audio",
            "transcript": "What changes at the active site at high temperature?"
          }
        ]
      }
    ]
  }
}
```

## 处理不清晰的音频

模型应仅对其有把握理解的音频采取行动。如果音频不清晰，模型应提出简短的澄清问题，而不是猜测。

不要让模型推断缺失的词语、调用工具、捕获实体、生成前言，或花费隐藏的推理时间来尝试重建用户可能说过的话。

```text
## Unclear Audio

- Only respond to clear audio or text.
- If the user's audio is not clear, ask for clarification using a short English phrase such as "Sorry, could you repeat that clearly?"
- Don't repeat the same unclear-audio clarification twice.
- Treat audio as unclear if it is ambiguous, noisy, silent, unintelligible, partially cut off, or if you are unsure of the exact words the user said.
- Do not guess what the user meant from unclear audio.
- Do not reason when the audio is unclear.
- Do not provide a preamble or call tools in the commentary channel when the audio is unclear.
```

示例：

> 用户音频：“查一下订单三一——”【中断】

错误示例：

> 助手：我现在就来查看订单 31。

良好做法：

> 助理：我只听到了订单号的一部分。你能逐位重复一遍吗？

## 捕获精确实体

许多实时工作流依赖精确值：订单 ID、追踪号、电子邮件地址、确认码、账号、理赔号、工单 ID、支持引用和电话号码。

语音使这一点变得困难。用户语速快、分组数字的方式不同、拼写部分值、使用填充词、中途自我纠正，或发出听起来相似的字符。一个错误的数字可能导致查询失败或检索到错误的账户。

保守地捕获实体。一次收集一个值，仅规范化清晰的内容，在调用工具前确认高精度值，并让每次更正都可恢复。

### 一次收集一个实体

当工作流需要多个值时，请逐一收集。这样可以防止字段混淆，尤其是在语音对话中。

```text
## Entity Collection Order

Collect required values one at a time.

- Ask for only the next missing value.
- Do not ask for multiple values in the same turn.
- Before asking, check whether the value was already provided earlier in the conversation or the session.
- If a possible value already exists, confirm it with the user before using it.

Example:

"I see tracking number ABC-54321 from earlier. Should I use that one, or do you have a different tracking number?"

Do not call tools until the current value has been collected, validated, and confirmed.
```

### 处理逐字拼出的字符

当用户逐个字符拼写 ID、代码、名称或电子邮件地址时使用此功能。口语形式是输入，而非最终值。

```text
## Spelled-Out Characters

When a user dictates an ID, code, or email character by character, treat the spoken sequence as one compact value. Preserve explicitly spoken separators like dash, dot, underscore, slash, or plus; otherwise do not add spaces or separators.

Examples:

- "A B C one two three" -> "ABC123"
- "B C dash nine eight seven" -> "BC-987"
- "J O H N at example dot com" -> "john@example.com"

Do not insert spaces between spelled-out characters unless the user explicitly says the value contains spaces.
```

### 仔细规范化口语数字

对于数字标识符，用户可以逐个说出数字、分组说出，或使用自然的数字短语。如果字段期望一个连续的数值，则将清晰的数字语音转换为数字。

```text
## Spoken Number Handling

Convert spoken numbers into digits when collecting numeric identifiers.

Examples:

- "one two three four" -> "1234"
- "one twenty three" -> "123"
- "one nineteen" -> "119"
- "ninety nine eleven" -> "9911"
- "nine thousand nine hundred eleven" -> "9911"

If multiple interpretations are plausible, ask the user to clarify before using the value.

Example:

"I heard either 119 or 1-19. Could you repeat the number digit by digit?"
```

### 在工具调用前确认精确标识符

订单 ID、追踪编号、账号、索赔号、确认码及类似的标识符都是高精度的字段。在工具调用中使用它们之前，请先确认其准确性。

对于数字型标识符，请逐位读出数值。将数值作为一个整体读出可能会掩盖错误。

示例：

> 助手：确认一下，我听到的是 8... 3... 5... 2... 1。对吗？

如果用户更正了一个字符或数字，在调用工具前重复完整的更正值。

示例：

> 助手：明白了。我有 8... 3... 5... 7... 1。对吗？

```text
## Exact Identifier Confirmation

Before calling tools with high-precision identifiers:

- Confirm the final normalized value with the user.
- Read numeric identifiers back digit by digit.
- Do not use guessed, partial, or ambiguous values.
- If the user corrects the value, repeat the full corrected value before calling the tool.
```

### 逐字符确认电子邮件

电子邮件地址是重要的值。点号、破折号、下划线、重复字母以及发音相似的名称可能导致账户查找失败，或将消息发送到错误的地址。

请用户拼写电子邮件地址：

> 助手：你能逐字符拼写这个电子邮件地址吗？这样我可以确保完全正确。

读回时，请确认最终地址准确无误：

> 助手：只是确认一下，那是 c-h-e-n@‌example.com，对吗？

```text
## Email Confirmation

Email addresses must be captured exactly.

If the user says the email naturally without spelling it out, ask them to repeat it character by character.

Example:

"Could you spell the email address character by character so I can make sure I have it exactly right?"

When reading an email back, confirm the exact final email address.

Example:

"Just to confirm, that is c-h-e-n at example dot com, right?"
```

### 实体收集工作流

示例实体集合 工作流

当任务在任何工具调用前需要精确值时，请使用此完整 工作流。

```text
## Entity Collection Workflow

When a workflow requires an exact value, collect and confirm it before using it in any tool call.

Exact values include order IDs, tracking numbers, confirmation codes, account numbers, claim numbers, ticket IDs, support references, email addresses, phone numbers, and similar identifiers.

Follow this workflow:

1. Collect the next required value.

- Ask for only one missing value at a time.
- Do not ask for multiple exact values in the same turn.
- Before asking, check whether the value was already provided earlier in the conversation or session.

2. Normalize only what is clear.

- Convert clearly spoken digits or spelled-out characters into the expected format.
- Preserve explicit separators such as dashes, dots, underscores, slashes, and plus signs.
- Do not guess, infer, repair, or fill in unclear characters.
- If the value could be interpreted in more than one way, ask the user to repeat or clarify it.

3. Confirm the final value.

- Read back the normalized value before using it.
- For numeric identifiers, confirm digit by digit.
- For email addresses, confirm character by character when precision matters.
- Wait for a clear confirmation from the user.

4. Call the tool only after confirmation.

- Do not call lookup, account, messaging, payment, booking, or update tools with guessed, partial, ambiguous, or unconfirmed values.

5. Recover safely from corrections.

- If the user corrects any part of the value, update the value, repeat the full corrected value, and ask for confirmation again.
- Do not use the corrected value in a tool call until the user confirms the full final value.

Examples:

User: My order ID is ORD-3125B23.

Assistant: Just to confirm, I heard O-R-D dash 3-1-2-5-B-2-3. Is that right?

User: It is 83521 - actually, the fourth digit is 7.

Assistant: Got it. I have 8... 3... 5... 7... 1. Is that correct?

User: My email is chen@example.com.

Assistant: Could you spell that email address character by character so I can make sure I have it exactly right?

Never call tools with guessed, partial, ambiguous, or unconfirmed exact values.
```

## 避免字面指令陷阱

`gpt-realtime-2` 比早期的实时模型更严格地遵循指令。在旧模型上效果良好的提示词可能需要调整。

使用精确的语言。模型可能更优先考虑指令的确切措辞，而不是你意图中的更广泛行为。宽泛或僵化的规则可能以令人惊讶的方式主导助手的行为，尤其是当多条规则重叠时。

对于如 `must`, `only`, `never`，以及 `always`。这样的约束词要谨慎。只在行为确实需要时使用它们，而不是作为一般强调。过度使用硬约束可能使助手变得僵化、过度谨慎，或者无法处理合理的例外情况。

偏好精确的范围：

```text
For write actions that modify user data, ask for confirmation before calling the tool.
```

避免宽泛的范围：

```text
Always ask for confirmation before doing anything.
```

宽泛的版本可能导致在进行无害的只读查询（如查看订单状态、检索可用性或读取账户信息）之前出现不必要的确认。

### 字面解释示例

示例：字面解释陷阱

此提示词过于狭窄：

```text
When a confirmation code is provided, repeat it verbatim and wait for a clear yes.
```

用户消息：

> 我的订单 ID 是 ORD-3125B23。

可能的失败情况：

由于用户提供的是订单 ID 而非确认码，模型可能无法执行该规则。开发者的意图清晰明确，但指令的范围过于狭窄。

更安全的改写：

```text
When the user provides an exact identifier, including confirmation codes, order IDs, ticket IDs, reset PINs, claim numbers, tracking numbers, or account numbers, repeat the captured value and wait for confirmation before using it in a tool call.
```

一般提示建议：

- 优先使用明确的指令，而非隐含的意图。
- 除非行为确实必须严格固定，否则避免使用不必要的限制词。
- 尽量减少相互矛盾的指导。
- 对分层或相互竞争的优先级指令要谨慎。
- 逐步测试提示词。微小的措辞变化可能会产生巨大的行为影响。
- 从较早的实时模型迁移时，应预期某些提示词可能需要重构才能获得最佳效果。

## 分别控制语言与口音

语言与口音应当分开控制。

用户的口音与其预期使用的语言并不相同。用户可能带有印地语、西班牙语、法语或普通话口音说英语，但仍期望得到英语回复。

避免使用过于宽泛的语言指令，例如：

```text
Mirror the user.
Respond naturally in the user's language.
Switch languages when appropriate.
Sound local.
Adapt to the user's accent.
```

这些指令过于宽泛。模型可能会将口音、填充词、反馈词或孤立的非母语单词视为切换语言的依据。

### 英语语言政策

```text
## Language

English is the default response language.

- Do not infer language from accent alone.
- Ignore short filler sounds, backchannels, and isolated foreign words for language detection.
- Only switch languages if the user explicitly asks or provides a substantive utterance in another language.
- If language confidence is low, ask a short clarification instead of guessing.
- Keep preambles, spoken bridges, tool-related messages, and final answers in the same language.
- Accent adaptation must not change the response language.
```

### 多语言政策

```text
## Language

Default to English unless the user clearly uses another language.

Switch languages only when:

- the user explicitly asks to use another language;
- the user provides a substantive utterance in another language. A substantive utterance means the user gives a complete request, question, or correction in another language, not just a greeting, name, address, filler word, or borrowed phrase.

Do not switch languages based on:

- accent;
- pronunciation;
- filler words;
- short backchannels;
- names;
- addresses;
- isolated foreign words.

If uncertain, ask:

"Would you like me to continue in English or [LANGUAGE]?"
```

### 口音控制

`gpt-realtime-2` 可以更强烈地遵循口音指令，但模糊的口音提示可能导致偏移或意外的语言切换。

口音控制提示在明确指定以下内容时效果最佳：

- 目标口音；
- 哪些特征应保持稳定；
- 预期的语速、重音和韵律；
- 口音自适应是否应影响语言选择。

而不是：

```text
Sound Australian.
```

使用：

```text
## Accent

Speak English with a light Australian accent.

- Keep the accent stable from the first word to the last.
- Use natural Australian vowel shaping, but keep speech easy to understand.
- Do not exaggerate the accent.
- Do not change response language based on the user's accent.
```

### 自定义语音

当标准语音无法 [自定义语音](https://developers.openai.com/blog/updates-audio-models#custom-voices) 可靠地满足品牌、口音或角色要求时，请使用。

提示可以引导口音、语速和表达方式，但无法完全替代语音设计。对于需要一致的品牌语音形象或口音保真度的用例，请考虑 [自定义语音](https://developers.openai.com/blog/updates-audio-models#custom-voices).

自定义语音仅对已获批准的客户开放。请联系你的客户团队获取访问权限。

## 在长时间会话中维护状态

`gpt-realtime-2` 将实时上下文窗口从 32k 扩展到 128k 个 token，使其更适合长时间会话。对于密集的双向对话，128k 个 token 最好理解为大约 1-2 小时的密集原始音频上下文。具体时长会因工具使用、内部推理、注入的记录和其他会话细节而异。

对于长上下文用例， `gpt-realtime-2` 在能够判断哪些信息是当前的、哪些是背景、以及当来源冲突时哪些应被忽略的情况下，表现最佳。不要依赖模型从原始转录或大型上下文转储中推断来源优先级。请使用结构化方式。

在开始一个包含大量上下文的会话时，使用结构化模式，例如检索到的记录、先前的对话历史、政策、摘要、账户备注或背景文档。

长会话上下文模板示例

```text
## Context

### Current State

- **Current task:** [current task]
- **Latest known state:** [current value]
- **Next safe step:** [what the assistant should do next]

### Authoritative Sources

- **Fact or record:** [fact or record]
- **Source:** [tool result / active policy / verified record]
- **Status:** current
- **Retrieved:** [date/time or this turn]

### Historical or Background Sources

- **Older fact or record:** [older fact or record]
- **Source:** [prior conversation / older record / summary]
- **Status:** stale or background
- **Note:** Do not use for current decisions if it conflicts with a current source.

### Relevant Policy or Rules

- [decision rule or constraint]

### Other Context

- [potentially useful but non-authoritative background]
```

## 从早期实时模型迁移

从早期实时模型迁移时，应将提示词视为行为表面，而不仅仅是待移植的文本。

1. 使用 Codex 或强大的推理模型，依据最新的 Realtime 提示指南重构提示。附上本提示指南的链接，将迁移建立在最佳实践之上。
2. 将推理强度设置为 `low` 而非默认值。仅对需要更深入规划的工作流提升该设置。
3. 审查工具名称、参数、枚举、JSON 模式及其他设置，确保其与预期实现相符。
4. 移除过时示例。为成功路径、歧义、中断、工具调用和回退行为添加简短示例。
5. 对比迁移前后的代表性对话。针对现有评估检查回归问题，并记录有意的行为变更。
6. 进行最终的一致性检查。确认提示清晰区分硬性要求、默认值、工具规则、安全规则和回退行为。
7. 运行评估，检查代表性失败案例，并反复调整提示，直到目标行为稳定可靠。

  

  


## Realtime 1.5 提示词指南

`gpt-realtime-1.5` 是 Realtime API 中的语音到语音模型。相同的 `gpt-realtime` 提示词指导适用于此模型。

语音到语音系统对于实现语音作为核心 AI 界面至关重要。 `gpt-realtime-1.5` 支持强大且可用的实时语音智能体，能够处理大规模的关键任务工作流。

与早期的实时预览模型相比， `gpt-realtime-1.5` 提供了更强的指令遵循、更可靠的工具调用、更好的语音质量和整体更流畅的感觉。这些改进使得从链式方法转向真正的实时体验变得切实可行，减少延迟并产生听起来更自然、更有表现力的响应。

实时模型受益于那些不直接适用于基于文本的模型的提示技术。本提示指南首先提供一个建议的提示模板，然后逐步讲解每个部分，包括实用技巧、可复制的小模式，以及你可以根据自己的用例进行调整的示例。

## 一般提示

- **持续迭代**：细微的措辞变化可能决定行为的成败。
  - 示例：对于不清晰的音频指令，我们将“inaudible”改为“unintelligible”，从而改进了对嘈杂输入的处理。
- **优先使用列表而非段落**：清晰简短的列表优于长篇段落。
- **用示例引导**：模型会紧密跟随示例短语。
- **保持精确**：模糊或冲突的指令会导致性能下降，类似于 GPT-5。
- **控制语言**：如果出现不期望的语言切换，可将输出固定到目标语言。
- **减少重复**：添加“多样性”规则以减少机械化的措辞。
- **使用大写文本强调**：将关键规则大写可使其更突出，并更易于模型遵循。
- **将非文本规则转换为文本**：不要写“IF x > 3 THEN ESCALATE”，而应写“IF MORE THAN THREE FAILURES THEN ESCALATE”。

## 提示词结构

组织你的提示词可以让模型更容易理解上下文并在多轮对话中保持一致。这也有助于你迭代和修改有问题的部分。

- **作用**：在系统提示中使用清晰、带标签的部分，以便模型能够找到并遵循它们。每个部分专注于一件事。
- **如何调整**：添加特定领域的部分（例如，合规、品牌政策）。移除你不需要的部分（例如，如果不处理发音问题，则移除参考发音）。

示例

```
# Role & Objective        — who you are and what “success” means
# Personality & Tone      — the voice and style to maintain
# Context                 — retrieved context, relevant info
# Reference Pronunciations — phonetic guides for tricky words
# Tools                   — names, usage rules, and preambles
# Instructions / Rules    — do’s, don’ts, and approach
# Conversation Flow       — states, goals, and transitions
# Safety & Escalation     — fallback and handoff logic
```

## 角色与目标

本节定义智能体的身份以及“完成”的含义。示例展示了两种不同的身份，以演示当角色和目标明确时，模型会多么严格地遵循它们。

- **使用时机**：模型未承担你所需的角色、任务范围或身份设定。
- **作用**：固定智能体的身份，使其响应符合该角色描述。
- **调整方法**：根据你的用例修改角色设置。

#### 示例（模型采用特定口音）

```
# Role & Objective
You are a Quebecois French-speaking customer service bot. Your task is to answer the user's question.
```

早期实时预览：



  `gpt-realtime-1.5`:



  #### 示例（模型扮演角色）

```
# Role & Objective
You are a high-energy game-show host guiding the caller to guess a secret number from 1 to 100 to win 1,000,000$.
```

更早的实时预览版：



  `gpt-realtime-1.5`:



  `gpt-realtime-1.5` 能够比更早的实时预览模型更可靠地扮演指定角色。

## 个性与语气

`gpt-realtime-1.5` 在模仿特定个性或语气时能很好地遵循指令。你可以根据用例的需求调整语音体验和表达方式。

- **使用时机**：回复感觉平淡、过于冗长，或在不同轮次间不一致。
- **作用**：设置语气、简洁度和节奏，让回复听起来自然且一致。
- **如何调整**：调整温暖/正式程度和默认长度。对于受监管领域，偏向中立的精确性。添加与你的用例相关的其他小节。

#### 示例

```
# Personality & Tone
## Personality
- Friendly, calm and approachable expert customer service assistant.

## Tone
- Warm, concise, confident, never fawning.

## Length
2–3 sentences per turn.
```

#### 示例（多情感）

```
# Personality & Tone
- Start your response very happy
- Midway, change to sad
- At the end change your mood to very angry
```

`gpt-realtime-1.5`:



  该模型能够遵循复杂指令，并在整个音频响应过程中在三种情绪之间切换。

### 速度指令

在 Realtime API 中， `speed` 参数改变的是播放速率，而非模型合成语音的方式。若要让声音实际听起来更快，应添加能够引导语速的指令。

- **使用时机**：用户希望语音速度更快；仅靠播放速度（speed 参数）无法调整说话风格。
- **作用**：调整说话风格（简洁性、节奏），与客户端播放速度无关。
- **如何调整**：修改速度指令以满足用例需求。

#### 示例

```
# Personality & Tone
## Personality
- Friendly, calm and approachable expert customer service assistant.

## Tone
- Warm, concise, confident, never fawning.

## Length
- 2–3 sentences per turn.

## Pacing
- Deliver your audio response fast, but do not sound rushed.
- Do not modify the content of your response, only increase speaking speed for the same response.
```

早期实时预览：



  `gpt-realtime-1.5`:



  通过明确的节奏指示， `gpt-realtime-1.5` 可以产生明显更快的节奏，而不会显得过于仓促。

### 语言约束

语言约束确保模型即使在诸如背景噪声或多语言输入等具有挑战性的条件下，也能持续以预期语言进行响应。

- **适用场景**：为防止在多语言或嘈杂环境中意外切换语言。
- **功能作用**：将输出锁定为所选语言，以防止意外更改语言。
- **如何调整**：将“English”替换为你的目标语言；或根据你的用例添加更复杂的指令。

#### 示例（固定为一种语言）

```
# Personality & Tone
## Personality
- Friendly, calm and approachable expert customer service assistant.

## Tone
- Warm, concise, confident, never fawning.

## Length
- 2–3 sentences per turn.

## Language
- The conversation will be only in English.
- Do not respond in any other language even if the user asks.
- If the user speaks another language, politely explain that support is limited to English.
```

这些是使用 `gpt-realtime-1.5`.

![lang 约束 en](https://developers.openai.com/cookbook/assets/images/lang_constraint_en.png)

#### 示例（模型教授一门语言）

```
# Role & Objective
- You are a friendly, knowledgeable voice tutor for French learners.
- Your goal is to help the user improve their French speaking and listening skills through engaging conversation and clear explanations.
- Balance immersive French practice with supportive English guidance to ensure understanding and progress.

# Personality & Tone
## Personality
- Friendly, calm and approachable expert customer service assistant.

## Tone
- Warm, concise, confident, never fawning.

## Length
- 2–3 sentences per turn.

## Language
### Explanations
Use English when explaining grammar, vocabulary, or cultural context.

### Conversation
Speak in French when conducting practice, giving examples, or engaging in dialogue.
```

这些是应用指令后得到的响应，使用了 `gpt-realtime-1.5`.

![多语言](https://developers.openai.com/cookbook/assets/images/multi-language.png)

模型能够根据自定义指令在不同语言之间进行语码转换。

### 减少重复

实时模型可以紧密遵循示例短语以保持品牌一致性，但可能会过度使用这些短语，使响应听起来机械或重复。添加重复规则有助于在保持清晰度和品牌风格的同时维持多样性。

- **适用场景**：跨回合或跨会话的输出会重复使用相同的开头、填充词或句式。
- **功能说明**：增加多样性约束——抑制重复短语，引导同义词和替代句式，同时保持必要术语不变。
- **如何调整**：调整严格程度（例如，“每隔 N 轮不得重复使用同一个开头”），白名单必须保留的短语（法律/合规/品牌），并在一致性重要时允许更紧凑的措辞。

#### 示例

```
# Personality & Tone
## Personality
- Friendly, calm and approachable expert customer service assistant.

## Tone
- Warm, concise, confident, never fawning.

## Length
- 2–3 sentences per turn.

## Language
- The conversation will be only in English.
- Do not respond in any other language even if the user asks.
- If the user speaks another language, politely explain that support is limited to English.

## Variety
- Do not repeat the same sentence twice.
- Vary your responses so they don't sound robotic.
```

这些是在 **之前** 应用该指令时 `gpt-realtime-1.5`。的响应。模型重复相同的确认： `Got it`.

![之前重复](https://developers.openai.com/cookbook/assets/images/repeat_before.png)

这些是在 **之后** 应用该指令时 `gpt-realtime-1.5`.

![之后重复](https://developers.openai.com/cookbook/assets/images/repeat_after.png)

现在模型能够变化其响应和确认，不再听起来机械。

## 参考发音

本节介绍如何确保模型在语音交互过程中正确发音重要的单词、数字、名称和术语。

- **使用时机**：品牌名、技术术语或地名常易读错。
- **作用**：通过发音提示增强信任感和清晰度。
- **调整方法**：保持简短列表；听到错误时及时更新。

#### 示例

```
# Reference Pronunciations
When voicing these words, use the respective pronunciations:
- Pronounce “SQL” as “sequel.”
- Pronounce “PostgreSQL” as “post-gress.”
- Pronounce “Kyiv” as “KEE-iv.”
- Pronounce "Huawei" as “HWAH-way”
```

早期实时预览：



  `gpt-realtime-1.5`:



  根据参考发音说明， `gpt-realtime-1.5` 能够正确地将 SQL 读作“sequel”。

### 字母数字发音

Realtime S2S 在回读关键信息（电话、信用卡、订单 ID）时可能会模糊或合并数字/字母。逐字符的明确确认可以防止听错并促使更清晰的合成。

- **适用场景**：如果模型难以捕获或读回电话号码、卡号、2FA 验证码、订单 ID、序列号、地址、单元号或混合字母数字字符串。
- **功能说明**：强制模型一次输出一个字符并带分隔符，然后与用户确认，并在更正后再次确认。可选地对字母使用语音消歧（例如，“A 代表 Alpha”）。

#### 示例（通用指令部分）

```
# Instructions/Rules
- When reading numbers or codes, speak each character separately, separated by hyphens (e.g., 4-1-5).
- Repeat EXACTLY the provided number; do not omit any digits.
```

_提示：如果你正在遵循对话流程提示策略，可以指定哪个对话状态需要应用字母数字发音指令。_

#### 示例（对话状态中的指令）

_（取自我们 [openai-realtime-智能体](https://github.com/openai/openai-realtime-agents/blob/main/src/app/agentConfigs/customerServiceRetail/authentication.ts))_

```txt
{
    "id": "3_get_and_verify_phone",
    "description": "Request phone number and verify by repeating it back.",
    "instructions": [
      "Politely request the user’s phone number.",
      "Once provided, confirm it by repeating each digit and ask if it’s correct.",
      "If the user corrects you, confirm AGAIN to make sure you understand.",
    ],
    "examples": [
      "I'll need some more information to access your account if that's okay. May I have your phone number, please?",
      "You said 0-2-1-5-5-5-1-2-3-4, correct?",
      "You said 4-5-6-7-8-9-0-1-2-3, correct?"
    ],
    "transitions": [{
      "next_step": "4_authentication_DOB",
      "condition": "Once phone number is confirmed"
    }]
}
```

这些是使用 **之前** 应用指令时的响应 `gpt-realtime-1.5`.

> 当然可以！数字是 55119765423。如果你还需要其他帮助，请告诉我！

这些是对应的响应 **之后** 使用以下指令应用 `gpt-realtime-1.5`.

> 当然可以！这个号码是：5-5-1-1-1-9-7-6-5-4-2-3。如果你还需要其他帮助，请告诉我！

## Instructions

本章涵盖提示词指南，指导你的模型解决任务、应用最佳实践并修复可能的问题。

也许并不意外，我们推荐的提示模式与 [GPT-4.1 以获得最佳结果](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide).

### 指令遵循

与 GPT-4.1 和 GPT-5 类似，如果指令相互冲突、含糊或不清晰， `gpt-realtime-1.5` 其表现会更差。

- **适用场景**：输出偏离规则、跳过阶段或误用工具。
- **作用**：使用 LLM 在发布前指出歧义、冲突和缺失的定义。

#### **指令质量提示（可用于 ChatGPT 或与API配合使用）**

使用以下提示词配合 GPT-5，识别出你提示词中可以修复的问题区域。

```
## Role & Objective
You are a **Prompt-Critique Expert**.
Examine a user-supplied LLM prompt and surface any weaknesses following the instructions below.


## Instructions
Review the prompt that is meant for an LLM to follow and identify the following issues:
- Ambiguity: Could any wording be interpreted in more than one way?
- Lacking Definitions: Are there any class labels, terms, or concepts that are not defined that might be misinterpreted by an LLM?
- Conflicting, missing, or vague instructions: Are directions incomplete or contradictory?
- Unstated assumptions: Does the prompt assume the model has to be able to do something that is not explicitly stated?


## Do **NOT** list issues of the following types:
- Invent new instructions, tool calls, or external information. You do not know what tools need to be added that are missing.
- Issues that you are unsure about.


## Output Format
"""
# Issues
- Numbered list; include brief quote snippets.

# Improvements
- Numbered list; provide the revised lines you would change and how you would change them.

# Revised Prompt
- Revised prompt where you have applied all your improvements surgically with minimal edits to the original prompt
"""
```

#### **提示词优化元提示词（可在 ChatGPT 中使用，或与 API 搭配使用）**

这个元提示有助于你通过针对特定失败模式来改进基础系统提示。提供当前提示并描述你遇到的问题，模型（GPT-5）将建议优化后的变体，以收紧约束并减少该问题。

```
Here's my current prompt to an LLM:
[BEGIN OF CURRENT PROMPT]
{CURRENT_PROMPT}
[END OF CURRENT PROMPT]

But I see this issue happening from the LLM:
[BEGIN OF ISSUE]
{ISSUE}
[END OF ISSUE]
Can you provide some variants of the prompt so that the model can better understand the constraints to alleviate the issue?
```

### 无音频或音频不清晰

有时模型会以为自己听到了某些内容并尝试回应。你可以添加自定义指令，告诉模型在听到不清晰的音频或用户输入时该如何表现。请根据你的使用场景修改期望的行为。例如，你可能希望模型重复同一个问题，而不是请求澄清。

- **适用场景**：背景噪音、不完整的词语或静音会触发不必要的回复。
- **功能说明**：阻止虚假回复，并生成自然的澄清请求。
- **调整方法**：根据用例选择是要求澄清还是重复上一个问题。

#### 示例（咳嗽和音频不清晰）

```
# Instructions/Rules
...


## Unclear audio
- Always respond in the same language the user is speaking in, if unintelligible.
- Only respond to clear audio or text.
- If the user's audio is not clear (e.g. ambiguous input/background noise/silent/unintelligible) or if you did not fully hear or understand the user, ask for clarification using {preferred_language} phrases.
```

这些是应用指令后的响应 **（即** 使用该指令应用之后的结果） `gpt-realtime-1.5`.



  在此示例中，模型在我的 _（非常）_ 响亮的咳嗽和模糊的音频之后请求澄清。

### 背景音乐或音效

有时，模型在语音生成过程中可能会产生意想不到的背景音乐、哼唱、节奏性噪音或类似声音的伪影。这些伪影会降低清晰度、分散用户注意力，或让助手显得不够专业。以下说明有助于防止或显著减少这些情况的发生。

- **适用场景**：当你在 Realtime 音频响应中观察到意外的音乐元素或音效时使用。
- **作用**：引导模型避免生成这些不需要的音频伪影。
- **如何调整**：调整指令，尝试明确抑制你遇到的具体声音模式。

#### 示例

```
# Instructions/Rules
...
- Do not include any sound effects or onomatopoeic expressions in your responses.
```

## 工具

使用此部分告诉模型如何使用你的函数和工具。明确说明何时应调用工具、何时不应调用，需要收集哪些参数，调用进行中应说什么，以及如何处理错误或部分结果。

### 工具选择

`gpt-realtime-1.5` 严格遵循指令。然而，如果你的指令与模型可访问的内容冲突，例如在提示中提到未传入工具列表的工具，可能会导致糟糕的响应。

- **使用时机**：提示词提及了实际不可用的工具。
- **作用**：审查可用工具和系统提示词，确保它们保持一致。

#### 示例

```
# Tools
## lookup_account(email_or_phone)
...


## check_outage(address)
...
```

我们需要确保相同的工具可用，且 **描述之间不相互矛盾**:

```json
[
{
    "name": "lookup_account",
    "description": "Retrieve a customer account using either an email or phone number to enable verification and account-specific actions.",
    "parameters": {
      ...
  },
{
    "name": "check_outage",
    "description": "Check for network outages affecting a given service address and return status and ETA if applicable.",
    "parameters": {
      ...
  }
]
```

### 工具调用序言

某些使用场景可能受益于 Realtime 模型在调用工具的同时提供音频响应。这可以带来更好的用户体验，掩盖延迟。你可以修改示例短语以适配你的使用场景。

- **使用时机**：用户需要在工具调用的同时立即获得确认；有助于掩盖延迟。
- **作用**：在工具调用之前添加简短且一致的提示语。

#### 示例

```
# Tools
- Before any tool call, say one short line like “I’m checking that now.” Then call the tool immediately.
```

这些是应用指令后得到的响应，使用了 `gpt-realtime-1.5`.

![工具主动](https://developers.openai.com/cookbook/assets/images/tool_proactive.png)

使用该指令时，模型在发起工具调用的同时输出了一段音频响应“我马上查一下”。

#### 工具调用前言 + 示例短语

如果你希望在模型调用工具的同时更精确地控制其输出的短语类型，可以在工具规格描述中添加示例短语。

#### 示例

```python
tools = [
    {
        "name": "lookup_account",
        "description": """Retrieve a customer account using either an email or phone number to enable verification and account-specific actions.

Preamble sample phrases:
- For security, I’ll pull up your account using the email on file.
- Let me look up your account by {email} now.
- I’m fetching the account linked to {phone} to verify access.
- One moment—I’m opening your account details.""",
        "parameters": {
            "type": "object",
            "properties": {
                "email": {"type": "string"},
                "phone": {"type": "string"},
            },
            "additionalProperties": False,
        },
    },
    {
        "name": "check_outage",
        "description": """Check for network outages affecting a given service address and return status and ETA if applicable.

Preamble sample phrases:
- I’ll check for any outages at {service_address} right now.
- Let me look up network status for your area.
- I’m checking whether there’s an active outage impacting your address.
- One sec—verifying service status and any posted ETA.""",
        "parameters": {
            "type": "object",
            "properties": {
                "service_address": {"type": "string"},
            },
            "required": ["service_address"],
            "additionalProperties": False,
        },
    },
]
```


### 无需确认的工具调用

有时模型可能会在工具调用前请求确认。对于某些用例，这可能导致最终用户体验不佳，因为模型不够主动。

- **使用时机**：智能体在明显的工具调用前请求许可。
- **作用**：消除不必要的确认循环。

#### 示例

```
# Tools
- When calling a tool, do not ask for any user confirmation. Be proactive
```

这些是响应 **在** 应用指令之后 `gpt-realtime-1.5`.

![工具无确认](https://developers.openai.com/cookbook/assets/images/tool_no_confirm.png)

在示例中，你会注意到实时模型没有生成任何响应音频；它直接调用了相应的工具。

_提示：如果你注意到模型过快地跳转到调用工具，尝试软化措辞。例如，将“主动”等较强词汇替换为更温和的措辞，可以帮助引导模型采取更冷静、不那么急切的策略。_

### 工具调用性能

随着用例日益复杂且可用工具数量增加，明确引导模型何时使用每种工具、同样重要的是何时不使用，变得至关重要。清晰的使用规则不仅能提高工具调用准确性，还能帮助模型在正确时机选择正确的工具。

- **使用时机**：模型在工具调用性能上遇到困难，需要明确的指令以减少误用。
- **作用**：添加关于何时“使用/避免”每个工具的指令。你还可以添加关于工具调用顺序的指令（在工具调用 A 之后，你可以调用工具调用 B 或 C）。

#### 示例

```
# Tools
- When you call any tools, you must output at the same time a response letting the user know that you are calling the tool.

## lookup_account(email_or_phone)
Use when: verifying identity or viewing plan/outage flags.
Do NOT use when: the user is clearly anonymous and only asks general questions.


## check_outage(address)
Use when: user reports connectivity issues or slow speeds.
Do NOT use when: question is billing-only.


## refund_credit(account_id, minutes)
Use when: confirmed outage > 240 minutes in the past 7 days.
Do NOT use when: outage is unconfirmed; route to Diagnose → check_outage first.


## schedule_technician(account_id, window)
Use when: repeated failures after reboot and outage status = false.
Do NOT use when: outage status = true (send status + ETA instead).


## escalate_to_human(account_id, reason)
Use when: user seems very frustrated, abuse/harassment, repeated failures, billing disputes >$50, or user requests escalation.
```

_提示：如果工具调用可能不可预测地失败，请添加清晰的失败处理指令，以便模型能妥善响应。_

### 工具级别行为

你可以针对特定工具微调模型的行为，而不是应用一条全局规则。例如，你可能希望 READ 工具被主动调用，而 WRITE 工具则需要明确确认。

- **使用时机**：关于主动性、确认或开场白的全局指令并不适用于每个工具。
- **功能说明**：添加按工具划分的行为规则，用于定义模型是应立即调用工具、先确认，还是在调用前先说开场白。

#### 示例

```
# TOOLS
- For the tools marked PROACTIVE: do not ask for confirmation from the user and do not output a preamble.
- For the tools marked as CONFIRMATION FIRST: always ask for confirmation to the user.
- For the tools marked as PREAMBLES: Before any tool call, say one short line like “I’m checking that now.” Then call the tool immediately.


## lookup_account(email_or_phone) — PROACTIVE
Use when: verifying identity or accessing billing.
Do NOT use when: caller refuses to identify after second request.


## check_outage(address) — PREAMBLES
Use when: caller reports failed connection or speed lower than 10 Mbps.
Do NOT use when: purely billing OR when internet speed is above 10 Mbps.
If either condition applies, inform the customer you cannot assist and hang up.


## refund_credit(account_id, minutes) — CONFIRMATION FIRST
Use when: confirmed outage > 240 minutes in the past 7 days (credit 60 minutes).
Do NOT use when: outage unconfirmed.
Confirmation phrase: “I can issue a credit for this outage—would you like me to go ahead?”


## schedule_technician(account_id, window) — CONFIRMATION FIRST
Use when: reboot + line checks fail AND outage=false.
Windows: “10am–12pm ET” or “2pm–4pm ET”.
Confirmation phrase: “I can schedule a technician to visit—should I book that for you?”


## escalate_to_human(account_id, reason) — PREAMBLES
Use when: harassment, threats, self-harm, repeated failure, billing disputes > $50, caller is frustrated, or caller requests escalation.
Preamble: “Let me connect you to a senior agent who can assist further.”
```

### 工具输出格式

某些工具输出，尤其是必须逐字重复的长字符串，可能超出模型的分布范围。在训练过程中，工具输出通常看起来像具有命名字段的JSON对象。如果你的工具返回原始字符串，并单独要求模型“完全重复”，模型可能更倾向于改写、截断或混入自己的前言。

一个实用的修复方法是让工具输出看起来像正常的工具结果，并使逐字重复的要求在机器层面明确化。

- **何时使用：** 当工具返回 **长或复杂的结构化内容** （多句指令、交接包、ID/链接、策略摘要、多步骤流程等），且你观察到 **截断、改写、字段丢失、重新排序，或模型混入自己的前言/评论**.

- **作用：** 将工具输出包装在 **一个小的、明确的JSON信封** （例如， `response_text` 外加诸如 `require_repeat_verbatim`, `format`，或 `content_type`）使响应看起来更像 **分布内** ，且预期的实现行为对 **机器清晰**.

- **如何适配：** 保持schema **最小且稳定**。在你的 **工具说明** 以及工具定义旁边 **的** （例如，“如果 `require_repeat_verbatim` 为真，则仅输出 `response_text` ，不输出其他内容”，或“按原样渲染 `response_text` ；不得从工具输出中添加、省略或重新排序字段。”）

#### 示例

#### 示例：原始字符串（更容易出错）

工具返回：

```text
I just sent you an email with the verification link. Please open it and click “Confirm”.
```

模型有时会说：

- “我已通过电子邮件向你发送验证链接……”（转述）

- 删除最后一句（截断）

- 添加额外评论（“还有什么我可以帮忙的吗？”）

#### 示例：包装后的 JSON（更符合分布，更可靠）

工具返回：

```json
{
  "response_text": "I just sent you an email with the verification link. Please open it and click “Confirm”.",
  "require_repeat_verbatim": true
}
```

因为这看起来像典型的工具结果（JSON 对象），模型通常更容易处理：

- 识别“权威”内容是什么（response_text）

- 理解实现约束（require_repeat_verbatim）

- 干净地复现工具输出，不进行截断或添加额外注释

### 重新表述 Supervisor 工具（响应者-思考者架构）

在许多语音设置中，实时模型充当应答者（与用户对话），而更强的文本模型充当思考者（进行规划、策略查询、SOP 完成）。文本回复不一定适合语音，因此应答者必须在生成音频之前将思考者的文本改写为适合音频的回复。

- **使用时机**：当响应者的语音输出在收到思考者的响应后听起来过于机械、冗长或生硬时。
- **作用**：添加清晰的指令，引导响应者将思考者的文本重新表述为简短、自然、以语音为先的回复。
- **如何调整**：调整措辞风格、开场白和简洁度限制，以匹配你的用例预期。

#### 示例

```
# Tools
## Supervisor Tool
Name: getNextResponseFromSupervisor(relevantContextFromLastUserMessage: string)


When to call:
- Any request outside the allow list.
- Any factual, policy, account, or process question.
- Any action that might require internal lookups or system changes.


When not to call:
- Simple greetings and basic chitchat.
- Requests to repeat or clarify.
- Collecting parameters for later Supervisor use:
  - phone_number for account help (getUserAccountInfo)
  - zip_code for store lookup (findNearestStore)
  - topic or keyword for policy lookup (lookupPolicyDocument)


Usage rules and preamble:
1) Say a neutral filler phrase to the user, then immediately call the tool. Approved fillers: “One moment.”, “Let me check.”, “Just a second.”, “Give me a moment.”, “Let me see.”, “Let me look into that.” Fillers must not imply success or failure.
2) Do not mention the “Supervisor” when responding with filler phrase.
3) relevantContextFromLastUserMessage is a one-line summary of the latest user message; use an empty string if nothing salient.
4) After the tool returns, apply Rephrase Supervisor and send your reply.


### Rephrase Supervisor
- Start with a brief conversational opener using active language, then flow into the answer (for example: “Thanks for waiting—”, “Just finished checking that.”, “I’ve got that pulled up now.”).
- Keep it short: no more than 2 sentences.
- Use this template: opener + one-sentence gist + up to 3 key details + a quick confirmation or choice (for example: “Does that match what you expected?”, “Want me to review options?”).
- Read numbers for speech: money naturally (“$45.20” → “forty-five dollars and twenty cents”), phone numbers 3-3-4, addresses with individual digits, dates/times plainly (“August twelfth”, “three-thirty p.m.”).
```

以下是一个不带改写指令的示例：

> Assistant：你当前的信用卡余额为正，为 32,323,232 AUD。

以下是带有改写指令的同一示例：

> 助手：刚刚检查完毕——你的信用卡余额为三千二百三十二万三千二百三十二美元，余额归你所有。你上次付款已于八月一日处理。这是否符合你的预期？

### 常用工具

`gpt-realtime-1.5` 已被训练用于有效使用以下常见工具。如果你的用例需要类似行为，请保持名称、签名和描述接近这些示例，以最大化可靠性并更符合分布。

以下是一些模型已接受训练的重要常见工具：

#### 示例

```
# answer(question: string)
Description: Call this when the customer asks a question that you don't have an answer to or asks to perform an action.


# escalate_to_human()
Description: Call this when a customer asks for escalation, or to talk to someone else, or expresses dissatisfaction with the call.


# finish_session()
Description: Call this when a customer says they're done with the session or doesn't want to continue. If it's ambiguous, confirm with the customer before calling.
```

## 对话流程

本节介绍如何将对话组织为清晰、目标驱动的阶段，使模型在每个步骤中确切知道该做什么。它定义了每个阶段的目的、推进指令以及进入下一阶段的明确“退出标准”。这可以防止模型停滞、跳过步骤或提前跳跃，并确保对话从问候到解决全程保持有序。

同样，通过将提示词组织为不同的对话状态，更容易识别错误模式并更有效地迭代。

- **使用时机**：如果对话显得杂乱无章、在达成目标前停滞不前，或模型难以有效完成目标。
- **作用**：将交互分解为具有清晰目标、指令和退出标准的多个阶段。
- **如何调整**：重命名阶段以匹配你的工作流；修改各阶段的指令以遵循预期行为；保持“退出当”具体且简洁。

#### 示例

```
# Conversation Flow
## 1) Greeting
Goal: Set tone and invite the reason for calling.
How to respond:
- Identify as NorthLoop Internet Support.
- Keep the opener brief and invite the caller’s goal.
- Confirm that customer is a Northloop customer
Exit to Discovery: Caller states they are a Northloop customer and mentions an initial goal or symptom.


## 2) Discover
Goal: Classify the issue and capture minimal details.
How to respond:
- Determine billing vs connectivity with one targeted question.
- For connectivity: collect the service address.
- For billing/account: collect email or phone used on the account.
Exit when: Intent and address (for connectivity) or email/phone (for billing) are known.


## 3) Verify
Goal: Confirm identity and retrieve the account.
How to respond:
- Once you have email or phone, call lookup_account(email_or_phone).
- If lookup fails, try the alternate identifier once; otherwise proceed with general guidance or offer escalation if account actions are required.
Exit when: Account ID is returned.


## 4) Diagnose
Goal: Decide outage vs local issue.
How to respond:
- For connectivity, call check_outage(address).
- If outage=true, skip local steps; move to Resolve with outage context.
- If outage=false, guide a short reboot/cabling check; confirm each step’s result before continuing.
Exit when: Root cause known.


## 5) Resolve
Goal: Apply fix, credit, or appointment.
How to respond:
- If confirmed outage > 240 minutes in the last 7 days, call refund_credit(account_id, 60).
- If outage=false and issue persists after basic checks, offer “10am–12pm ET” or “2pm–4pm ET” and call schedule_technician(account_id, chosen window).
- If the local fix worked, state the result and next steps briefly.
Exit when: A fix/credit/appointment has been applied and acknowledged by the caller.


## 6) Confirm/Close
Goal: Confirm outcome and end cleanly.
How to respond:
- Restate the result and any next step (e.g., stabilization window or tech ETA).
- Invite final questions; close politely if none.
Exit when: Caller declines more help.
```

### 示例短语

示例短语充当模型的“锚定示例”。它们展示了您希望模型遵循的风格、简洁性和语气，而不会将其锁定在单一的固定回答中。

- **何时使用**：响应缺乏你的品牌风格或不够一致。
- **它做什么**：提供示例短语，模型可据此变化以保持自然和简洁。
- **如何调整**：将示例替换为更贴合品牌的表述；保留“不要总是使用”的警告。

#### 示例

```
# Sample Phrases
- Below are sample examples that you should use for inspiration. DO NOT ALWAYS USE THESE EXAMPLES, VARY YOUR RESPONSES.

Acknowledgements: “On it.” “One moment.” “Good question.”
Clarifiers: “Do you want A or B?” “What’s the deadline?”
Bridges: “Here’s the quick plan.” “Let’s keep it simple.”
Empathy (brief): “That’s frustrating—let’s fix it.”
Closers: “Anything else before we wrap?” “Happy to help next time.”
```

_注意：如果你的语音系统最终只是持续重复示例短语，导致语音体验更机械化，请尝试添加 Variety 约束。我们已看到此方法能解决问题。_

### 对话流程 + 示例短语

在不同的对话流程状态中添加示例短语，以教导模型何为良好响应，这是一种有用的模式：

#### 示例

```
# Conversation Flow
## 1) Greeting
Goal: Set tone and invite the reason for calling.
How to respond:
- Identify as NorthLoop Internet Support.
- Keep the opener brief and invite the caller’s goal.
Sample phrases (do not always repeat the same phrases, vary your responses):
- “Thanks for calling NorthLoop Internet—how can I help today?”
- “You’ve reached NorthLoop Support. What’s going on with your service?”
- “Hi there—tell me what you’d like help with.”
Exit when: Caller states an initial goal or symptom.


## 2) Discover
Goal: Classify the issue and capture minimal details.
How to respond:
- Determine billing vs connectivity with one targeted question.
- For connectivity: collect the service address.
- For billing/account: collect email or phone used on the account.
Sample phrases (do not always repeat the same phrases, vary your responses):
- “Is this about your bill or your internet speed?”
- “What address are you using for the connection?”
- “What’s the email or phone number on the account?”
Exit when: Intent and address (for connectivity) or email/phone (for billing) are known.


## 3) Verify
Goal: Confirm identity and retrieve the account.
How to respond:
- Once you have email or phone, call lookup_account(email_or_phone).
- If lookup fails, try the alternate identifier once; otherwise proceed with general guidance or offer escalation if account actions are required.
Sample phrases:
- “Thanks—looking up your account now.”
- “If that doesn’t pull up, what’s the other contact—email or phone?”
- “Found your account. I’ll take care of this.”
Exit when: Account ID is returned.


## 4) Diagnose
Goal: Decide outage vs local issue.
How to respond:
- For connectivity, call check_outage(address).
- If outage=true, skip local steps; move to Resolve with outage context.
- If outage=false, guide a short reboot/cabling check; confirm each step’s result before continuing.
Sample phrases (do not always repeat the same phrases, vary your responses):
- “I’m running a quick outage check for your area.”
- “No outage reported—let’s try a fast modem reboot.”
- “Please confirm the modem lights: is the internet light solid or blinking?”
Exit when: Root cause known.


## 5) Resolve
Goal: Apply fix, credit, or appointment.
How to respond:
- If confirmed outage > 240 minutes in the last 7 days, call refund_credit(account_id, 60).
- If outage=false and issue persists after basic checks, offer “10am–12pm ET” or “2pm–4pm ET” and call schedule_technician(account_id, chosen window).
- If the local fix worked, state the result and next steps briefly.
Sample phrases (do not always repeat the same phrases, vary your responses):
- “There’s been an extended outage—adding a 60-minute bill credit now.”
- “No outage—let’s book a technician. I can do 10am–12pm ET or 2pm–4pm ET.”
- “Credit applied—you’ll see it on your next bill.”
Exit when: A fix/credit/appointment has been applied and acknowledged by the caller.


## 6) Confirm/Close
Goal: Confirm outcome and end cleanly.
How to respond:
- Restate the result and any next step (e.g., stabilization window or tech ETA).
- Invite final questions; close politely if none.
Sample phrases (do not always repeat the same phrases, vary your responses):
- “We’re all set: [credit applied / appointment booked / service restored].”
- “You should see stable speeds within a few minutes.”
- “Your technician window is 10am–12pm ET.”
Exit when: Caller declines more help.

```

### 高级对话流程

随着用例日益复杂，你需要一种既能扩展又能保持模型高效的结构。关键在于维护性与简洁性之间的平衡：过多僵化的状态会使模型负担过重，损害性能，并让对话显得机械。

更好的方法是设计能降低模型感知复杂度的流程。通过以结构化但灵活的方式处理状态，你可以让模型更易于保持专注和响应，从而改善用户体验。

管理复杂场景的两种常见模式是：

1. 对话流作为状态机
2. 通过 session.updates 实现动态对话流

#### 对话流程作为状态机

将你的对话定义为一种同时编码状态和转换的 JSON 结构。这样可以轻松分析覆盖范围、识别边界情况，并随时间跟踪变化。由于它以代码形式存储，你可以随着流程的演变对其进行版本控制、差异比较和扩展。状态机还让你能够精细地控制对话从一个状态转换到另一个状态的确切方式和时机。

#### 示例

```json
# Conversation States
[
  {
    "id": "1_greeting",
    "description": "Begin each conversation with a warm, friendly greeting, identifying the service and offering help.",
    "instructions": [
        "Use the company name 'Snowy Peak Boards' and provide a warm welcome.",
        "Let them know upfront that for any account-specific assistance, you’ll need some verification details."
    ],
    "examples": [
      "Hello, this is Snowy Peak Boards. Thanks for reaching out! How can I help you today?"
    ],
    "transitions": [{
      "next_step": "2_get_first_name",
      "condition": "Once greeting is complete."
    }, {
      "next_step": "3_get_and_verify_phone",
      "condition": "If the user provides their first name."
    }]
  },
  {
    "id": "2_get_first_name",
    "description": "Ask for the user’s name (first name only).",
    "instructions": [
      "Politely ask, 'Who do I have the pleasure of speaking with?'",
      "Do NOT verify or spell back the name; just accept it."
    ],
    "examples": [
      "Who do I have the pleasure of speaking with?"
    ],
    "transitions": [{
      "next_step": "3_get_and_verify_phone",
      "condition": "Once name is obtained, OR name is already provided."
    }]
  },
  {
    "id": "3_get_and_verify_phone",
    "description": "Request phone number and verify by repeating it back.",
    "instructions": [
      "Politely request the user’s phone number.",
      "Once provided, confirm it by repeating each digit and ask if it’s correct.",
      "If the user corrects you, confirm AGAIN to make sure you understand.",
    ],
    "examples": [
      "I'll need some more information to access your account if that's okay. May I have your phone number, please?",
      "You said 0-2-1-5-5-5-1-2-3-4, correct?",
      "You said 4-5-6-7-8-9-0-1-2-3, correct?"
    ],
    "transitions": [{
      "next_step": "4_authentication_DOB",
      "condition": "Once phone number is confirmed"
    }]
  },
...
```

#### 动态对话流程

在此模式中，对话通过基于当前状态更新系统提示和工具列表，实现实时调整。你不是一次性向模型展示所有可能的规则和工具，而是只提供与对话当前阶段相关的内容。

当某个状态的结束条件满足时，你可以使用 session.update 进行转换，用下一阶段所需的提示和工具替换当前的提示和工具。

这种方法减轻了模型的认知负担，使其更易处理复杂任务，而不会被不必要的上下文所干扰。

#### 示例

```python
from typing import Dict, List, Literal

State = Literal["verify", "resolve"]

# Allowed transitions
TRANSITIONS: Dict[State, List[State]] = {
    "verify": ["resolve"],
    "resolve": [],  # terminal
}


def build_state_change_tool(current: State) -> dict:
    allowed = TRANSITIONS[current]
    readable = ", ".join(allowed) if allowed else "no further states (terminal)"
    return {
        "type": "function",
        "name": "set_conversation_state",
        "description": (
            f"Switch the conversation phase. Current: '{current}'. "
            f"You may switch only to: {readable}. "
            "Call this AFTER exit criteria are satisfied."
        ),
        "parameters": {
            "type": "object",
            "properties": {"next_state": {"type": "string", "enum": allowed}},
            "required": ["next_state"],
        },
    }


# Minimal business tools per state
TOOLS_BY_STATE: Dict[State, List[dict]] = {
    "verify": [
        {
            "type": "function",
            "name": "lookup_account",
            "description": "Fetch account by email or phone.",
            "parameters": {
                "type": "object",
                "properties": {"email_or_phone": {"type": "string"}},
                "required": ["email_or_phone"],
            },
        }
    ],
    "resolve": [
        {
            "type": "function",
            "name": "schedule_technician",
            "description": "Book a technician visit.",
            "parameters": {
                "type": "object",
                "properties": {
                    "account_id": {"type": "string"},
                    "window": {"type": "string", "enum": ["10-12 ET", "14-16 ET"]},
                },
                "required": ["account_id", "window"],
            },
        }
    ],
}

# Short, phase-specific instructions
INSTRUCTIONS_BY_STATE: Dict[State, str] = {
    "verify": (
        "# Role & Objective\n"
        "Verify identity to access the account.\n\n"
        "# Conversation (Verify)\n"
        "- Ask for the email or phone on the account.\n"
        "- Read back digits one-by-one (e.g., '4-1-5… Is that correct?').\n"
        "Exit when: Account ID is returned.\n"
        'When exit is satisfied: call set_conversation_state(next_state="resolve").'
    ),
    "resolve": (
        "# Role & Objective\n"
        "Apply a fix by booking a technician.\n\n"
        "# Conversation (Resolve)\n"
        "- Offer two windows: '10–12 ET' or '2–4 ET'.\n"
        "- Book the chosen window.\n"
        "Exit when: Appointment is confirmed.\n"
        "When exit is satisfied: end the call politely."
    ),
}


def build_session_update(state: State) -> dict:
    """Return the JSON payload for a Realtime `session.update` event."""
    return {
        "type": "session.update",
        "session": {
            "instructions": INSTRUCTIONS_BY_STATE[state],
            "tools": TOOLS_BY_STATE[state] + [build_state_change_tool(state)],
        },
    }
```


## 安全与升级

在使用 Realtime 语音智能体时，拥有可靠的方式升级到人工处理通常很重要。在本节中，你应该根据你的用例修改关于何时升级的说明。

- **适用场景**：模型难以判断何时应适当升级到人工或备用系统
- **作用**：定义快速、可靠的升级路径及应说的话术。
- **如何调整**：插入你自己的阈值以及模型应说的话术。

#### 示例

```
# Safety & Escalation
When to escalate (no extra troubleshooting):
- Safety risk (self-harm, threats, harassment)
- User explicitly asks for a human
- Severe dissatisfaction (e.g., “extremely frustrated,” repeated complaints, profanity)
- **2** failed tool attempts on the same task **or** **3** consecutive no-match/no-input events
- Out-of-scope or restricted (e.g., real-time news, financial/legal/medical advice)

What to say at the same time as calling the escalate_to_human tool (MANDATORY):
- “Thanks for your patience—I’m connecting you with a specialist now.”
- Then call the tool: `escalate_to_human`

Examples that would require escalation:
- “This is the third time the reset didn’t work. Just get me a person.”
- “I am extremely frustrated!”
```

第一个示例展示了来自 `gpt-4o-realtime-preview-2025-06-03` 使用该指令的对话响应。

![escalate 06](https://developers.openai.com/cookbook/assets/images/escalate_06.png)

第二个示例展示了来自 `gpt-realtime-1.5` 使用该指令的对话响应。

![escalate 07](https://developers.openai.com/cookbook/assets/images/escalate_07.png)

`gpt-realtime-1.5` 能够更可靠地遵循指令并升级给人工处理。



## 后续步骤

- 回顾前面的 [Realtime 提示指南](https://developers.openai.com/cookbook/examples/realtime_prompting_guide) 获取更多 `gpt-realtime-1.5` 示例。
- 回顾 [Realtime 评估指南](https://developers.openai.com/cookbook/examples/realtime_eval_guide) 以测试代表性的语音智能体行为。
- 了解如何通过 [WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc), [WebSocket](https://developers.openai.com/api/docs/guides/realtime-websocket)，或 [SIP](https://developers.openai.com/api/docs/guides/realtime-sip).
- 了解 [Realtime 对话生命周期](https://developers.openai.com/api/docs/guides/realtime-conversations).
- 回顾 [Realtime 成本](https://developers.openai.com/api/docs/guides/realtime-costs).