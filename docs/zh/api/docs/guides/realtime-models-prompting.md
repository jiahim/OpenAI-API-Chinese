# 使用实时模型

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取对应文档页面的 Markdown 版本。

`gpt-realtime-2` 是我们面向低延迟语音-to-speech 应用的最先进 reasoning 语音模型。它可以在说话前进行思考，更可靠地遵循指令，使用更大的上下文窗口，并以比此前的实时模型更高的精度调用工具。

要利用这些提升，请设计更具意图的提示。明确说明助手的职责、决策点、工具调用行为以及护栏：它应当做什么、何时执行，以及应当避免什么。

从简单开始。不要一开始就过度编写提示。先从最简提示开始，运行
  评估，然后仅针对测试中失败的行为补充指令。

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
    


## Realtime 2 的变化

将 Realtime 2 提示为推理语音智能体，而不是作为基础语音机器人。

| 变化                                | 对提示的意义                                                                                                                                         |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 推理                             | 允许模型在发言或调用工具之前，针对复杂任务进行内部推理。使用开场白以避免尴尬的沉默或不必要的填充内容。            |
| 提示的精确性更加重要         | 将“提供帮助”这类笼统的指引替换为清晰的触发、操作和例外规则：何时行动、执行什么、何时不应执行。                         |
| 指令冲突的代价更高 | 移除相互冲突 `always`, `never`, `only`，和 `must` 的规则，除非确实必要。在规则相互竞争时定义优先级。                                |
| 工具行为更易调控       | 明确说明助手何时应立即行动、追问缺失信息、确认高精度的细节、在失败后重试，或进行上报。                 |
| 开场白是一类一等行为    | 模型可能在较长的推理或工具调用流程之前先做简短的进展说明。引导开场白何时出现、应当多简短，以及何时可以省略。 |
| 扩展的上下文窗口               | `gpt-realtime-2` 将 realtime 的上下文窗口从 32k 扩展到 128k tokens，使其更适合长会话和更大的系统提示。                |

前言不是隐藏的思维链。它们是简短的口头更新，例如
  "我现在就核对一下这个订单。"不要要求模型泄露私密推理。

## 推荐的提示结构

使用简短、带有标签的章节。模型应能快速找到相关指令。

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

并非每个用例都需要所有章节。只添加与你的产品相关的章节。

## 设置推理力度

`gpt-realtime-2` 可以牺牲延迟以换取更深入的推理。请使用仍然能为助手提供足够智能的最低推理等级来完成该工作流。

从 `low` 开始适用于大多数生产场景中的语音智能体。可根据任务复杂度、延迟容忍度和失败成本进行调整。

| 推理力度    | 适用场景                                            | 示例                                                                 |
| --------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| `minimal` | 延迟尽可能低优先，且任务简单。 | 智能家居指令、计时器、简单的日历查询。                    |
| `low`     | 你需要响应速度，同时需要基础推理能力。       | 客服支持、订单查询、简单的政策问题。                |
| `medium`  | 助手必须对多步骤任务进行推理。 | 技术支持、诊断、复杂的路由。                        |
| `high`    | 更深入的推理能显著提升成功率。       | 高精度工作流、升级决策、带有约束的任务。 |
| `xhigh`   | 为追求最高推理质量，额外的延迟和成本是值得的。  | 复杂规划、关键分诊、高风险工具编排。      |

除了 API 设置外，还要引导模型在何时以及多大程度上进行推理。

```text
## Reasoning

- For direct answers, simple lookups, and short confirmations, respond quickly and do not reason.
- For multi-step tasks, tool decisions, troubleshooting, or escalation, reason before acting.
- Do not perform extended reasoning when the user's audio is unclear; ask for clarification instead.
```

## 有意识地使用前言

开场白是简短的口头播报，让语音智能体在推理、查询信息或调用工具时显得反应及时。用得好时，能让用户安心，知道助手正在工作；用得不好时，则会变成废话，增加感知到的延迟。

`gpt-realtime-2` 默认会生成开场白。先测试默认行为。如果不符合你的产品体验，再显式调整。

![开场白生成与播放时间线](https://developers.openai.com/images/platform/guides/realtime-2-preambles.png)

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

`gpt-realtime-2` 当提示词明确指定了每种任务类型需要给出多少细节时，长度指南效果最佳。与其告诉模型“要简洁”，不如在上下文中定义简洁的含义：直接回答、工具结果、故障排查、对比以及升级处理各自可能需要不同的回答长度。

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

> 助手：如果你希望成本最低，请选择 Basic。如果你需要团队权限和共享账单，请选择 Pro。如果合规审查或管理员控制很重要，请选择 Enterprise。

## 设计工具行为

`gpt-realtime-2` 在工具调用方面表现更强，但工具行为仍然取决于提示与工具规范的设计。如果提示未定义何时执行、何时询问、何时确认或何时恢复，助手可能会过早调用工具、提出不必要的问题，或重复失败的调用。

### 设置工具调用积极性

较高的主动性适用于只读、低风险的操作。较低的主动性更适合在工具会修改数据、触发外部副作用或依赖精确标识符时使用。

| 工具类型                           | 默认行为                                          |
| ----------------------------------- | --------------------------------------------------------- |
| 只读、低风险查询          | 当意图明确且所需字段齐全时调用。           |
| 使用精确标识符的只读操作     | 在查询前确认标识符。                     |
| 面向用户的沟通          | 在发送前起草或汇总。                        |
| 账号变更                     | 在调用前进行确认。                                   |
| 购买、取消、支付  | 在调用前确认金额、目标和影响。   |
| 不可逆或高影响的操作 | 明确确认，并在适当时提供升级途径。 |

当你的操作中读写混合时，使用这个均衡的默认值。请根据你的具体用例进行调整。

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

> User: Charge my card for the remaining balance.

Bad:

> Assistant: I've charged your card.

良好：

> Assistant: 为了确认，你想让我对存档卡 $248.16 的剩余余额进行扣款。我应该继续吗？

### 从工具失败中恢复

工具失败是对话的一部分。良好的恢复应当说明发生了什么，并为用户提供清晰的下一步操作。

不要对每一次失败都同等对待。恢复行为应取决于工具类型、失败模式以及对用户的影响。有些失败应当静默重试处理；其他情况则需要请用户澄清、修正标识符、确认新的操作，或选择替代路径。

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

Bad:

> 助手：出了点问题。

良好：

> 助手：我没能找到与 O R D dash 3 1 2 5 B 2 3 匹配的项。我哪里说错了吗？

### 保持工具可用性同步

Realtime 模型急于提供帮助。如果提示中提及了实际不可用的工具，或者工具列表与提示不匹配，模型可能会凭空编造一个工具名称，或者假装自己完成了该操作。

例如，如果提示引用了 `lookup_order`，但提供的工具名称是 `search_orders`，模型可能会调用错误的名称或模拟该操作。

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

使用附录中的提示审计元提示来检查生产环境中的提示
  是否存在矛盾、缺失工具以及易出错的指令。

## 处理静默与背景音频

语音 智能体 默认倾向于做出回应。在生产环境中，它们经常会听到不应触发语音回复的音频，例如静音、背景噪声、等待音乐、电视音频或旁人的对话。

当助手应保持安静并继续聆听时，使用一个空操作的等待工具。该工具为模型提供一个有效的非说话动作，而不是让它说出诸如“我在呢”或“我没听清”之类的话。

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

与提示词指令配合使用：

```text
## Handling Silence and Background Noise

If the latest audio is silence, background noise, hold music, TV audio, side conversation, or speech not addressed to you, call `wait_for_user`.

Do not respond conversationally after calling this tool.

Do not say "I'm here," "I didn't catch that," "Take your time," or "Let me know when you're ready."

Resume normal responses only when the user clearly addresses you or asks for help.
```

将此用于未被定向的音频，而非含糊不清的用户请求。如果用户显然正在对助手说话，但内容难以理解，应改为请求澄清。

## 谨慎使用消息通道

`gpt-realtime-2` 可以在 commentary 频道中生成用户可见的中间消息,并在 final 频道中生成面向用户的最终响应。当行为取决于其出现的位置时,请使用针对频道的指令。

| Channel      | 是否对用户可见 | 用途                   |
| ------------ | ------------- | -------------------------- |
| `commentary` | 是           | 前导内容和工具调用。  |
| `final`      | 是           | 面向用户的最终消息。 |

例如，工具调用发生在 commentary 通道中。如果希望助手在工具使用之前、期间或之后发言，请相对于 commentary 通道指定该行为。

```text
Before calling tools in the commentary channel, briefly tell the user what you are doing.
```

`gpt-realtime-2` 可以在单次轮次中发出多个响应阶段。在 API 输出中，这种区别通过以下方式表示： `response.done` 事件，该事件包含一个 `phase` 值，用于指示内容是 commentary 还是最终回答。

你可以在应用中使用此字段对每个阶段进行不同处理。例如，commentary 可以作为简短的中间更新播放或显示，而 `final_answer` 可以保留给助手的最终回答使用。

```text
response.output[0].phase: "commentary"
response.output[1].phase: "final_answer"
```



### 响应阶段示例



用户提示词：

> "我这道 AP 生物题卡住了 [QUESTION]。"

已缩短的 API 响应：

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

模型应当仅对它能够有信心理解的音频采取行动。如果音频不清晰，模型应当提出一个简短的澄清问题，而不是进行猜测。

不要让模型推断缺失的词语、调用工具、捕获实体、生成开场白，或花费隐藏的推理时间来重建用户可能说过的话。

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

> 用户音频：“查看订单三一-”[中断]

Bad:

> 助手：我现在查看订单 31。

良好：

> 助手：我只听到了订单号的一部分。能逐位数字重复一遍吗？

## 捕获精确实体

许多实时工作流依赖于精确的值：订单 ID、追踪编号、电子邮件地址、确认码、账号、理赔编号、工单 ID、支持引用号和电话号码。

语音让这件事变得困难。用户说话很快，会以不同方式组合数字、部分拼写、使用填充词、在对话中途自我纠正，或者读出读音相近的字符。一个错误的数字就可能导致查询失败或取错账户。

应保守地捕获实体信息。一次只收集一个值，只规范化明确的部分，在调用工具前确认高精度值，并确保每次更正都可恢复。

### 一次收集一个实体

当一个工作流需要多个值时，请一次只收集一个。这可以防止字段相互混淆，尤其是在语音对话中。

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

### 处理逐字符拼写

在用户逐字拼读 ID、代码、名称或电子邮件地址时使用。朗读的是输入过程，而不是最终结果。

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

对于数字标识符，用户可以逐个说出数字、将数字分组，或使用自然数短语。如果字段需要一个连续的数字值，请将清晰的数字语音转换为数字。

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

### 在调用工具前确认准确的标识符

订单 ID、追踪号、账号、理赔号、确认码以及类似的标识符都属于高精度字段。在工具调用中使用它们之前，请先进行确认。

对于数字标识符，请逐位回读其值。将其作为一个完整数字来读取可能会掩盖错误。

示例：

> Assistant: 再确认一下，我听到的是 8... 3... 5... 2... 1。对吗？

如果用户更正了一个字符或数字，请在调用工具之前重复完整的更正后的值。

示例：

> 助手：好的。我有 8… 3… 5… 7… 1。这样对吗？

```text
## Exact Identifier Confirmation

Before calling tools with high-precision identifiers:

- Confirm the final normalized value with the user.
- Read numeric identifiers back digit by digit.
- Do not use guessed, partial, or ambiguous values.
- If the user corrects the value, repeat the full corrected value before calling the tool.
```

### 逐字符确认电子邮件

电子邮件地址是很重要的信息。句点、连字符、下划线、重复字母以及读音相近的名称都可能造成账号查找失败，或将消息发送到错误的地址。

请让用户拼出电子邮件地址：

> Assistant：你能逐字符拼出这个电子邮箱地址吗？这样我就能确保记录完全准确。

回读时，请确认最终的精确地址：

> 智能体：再确认一下，c-h-e-n at example dot com，对吗？

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

### 实体集合工作流



#### 示例实体集合工作流



当任务在任何工具调用之前需要精确值时，请使用此完整的工作流。

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

`gpt-realtime-2` 比早期的实时模型更严格地遵循指令。在旧模型上效果良好的提示词可能需要进行调优。

使用精确的语言。模型可能会优先遵循指令的准确措辞，而不是你原本期望的更广泛行为。宽泛或僵化的规则可能以出人意料的方式主导助手的行为，尤其是在多条规则重叠时。

谨慎使用约束性词语，例如 `must`, `only`, `never`，以及 `always`。仅在行为确有要求时使用它们，而不要用于一般强调。过度使用硬性约束可能使助手变得僵化、过度谨慎，或无法处理合理的例外情况。

优先使用精确的范围：

```text
For write actions that modify user data, ask for confirmation before calling the tool.
```

避免宽泛的范围：

```text
Always ask for confirmation before doing anything.
```

宽泛的版本可能会导致在执行无害的只读查询前进行不必要的确认，例如检查订单状态、获取可用性信息或读取账户信息。

### 字面解读示例



#### 字面解读陷阱示例



这个提示过于狭窄：

```text
When a confirmation code is provided, repeat it verbatim and wait for a clear yes.
```

用户消息：

> 我的订单 ID 是 ORD-3125B23。

可能的失败：

模型可能不会应用该规则，因为用户提供的是订单 ID 而不是确认码。预期行为对开发者来说很明确，但指令的范围过于狭窄。

更安全的改写：

```text
When the user provides an exact identifier, including confirmation codes, order IDs, ticket IDs, reset PINs, claim numbers, tracking numbers, or account numbers, repeat the captured value and wait for confirmation before using it in a tool call.
```





通用提示建议：

- 优先使用明确的指令，而非隐含的意图。
- 除非行为确实必须严格，否则避免使用不必要的约束性措辞。
- 尽量减少相互矛盾的指导。
- 谨慎使用分层或相互竞争的优先级指令。
- 逐步测试提示。措辞的细微变化可能会对行为产生很大影响。
- 当从较早的实时模型迁移时，预计部分提示需要重构才能获得最佳效果。

## 分别控制语言和口音

语言和口音应分开控制。

用户的口音与其预期使用的语言并不相同。用户可能带印度尼西亚语、西班牙语、法语或普通话口音说英语，但仍期望收到英语回复。

避免使用过于宽泛的语言指令，例如：

```text
Mirror the user.
Respond naturally in the user's language.
Switch languages when appropriate.
Sound local.
Adapt to the user's accent.
```

这些指令过于宽泛。模型可能会将口音、语气词、附和声或孤立的非英语词汇误判为切换语言的依据。

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

`gpt-realtime-2` 可以更强烈地遵循口音指令，但模糊的口音提示可能导致偏移或意外切换语言。

口音控制提示在明确指定以下内容时效果最佳：

- 目标口音；
- 哪些特征应保持稳定；
- 预期的节奏、重音和韵律；
- 口音适配是否应影响语言选择。

请勿使用：

```text
Sound Australian.
```

请改用：

```text
## Accent

Speak English with a light Australian accent.

- Keep the accent stable from the first word to the last.
- Use natural Australian vowel shaping, but keep speech easy to understand.
- Do not exaggerate the accent.
- Do not change response language based on the user's accent.
```

### 自定义语音

使用 [自定义语音](https://developers.openai.com/blog/updates-audio-models#custom-voices) 当标准语音无法可靠满足品牌、口音或角色需求时。

提示词可以引导口音、节奏和表达方式，但无法完全替代语音设计。对于需要一致的品牌语音身份或口音保真度的用例，请考虑 [自定义语音](https://developers.openai.com/blog/updates-audio-models#custom-voices).

自定义语音仅向已获批的客户开放。请联系你的客户团队申请访问权限。

## 在长时间会话中保持状态

`gpt-realtime-2` 将实时上下文窗口从 32k 扩展到 128k token，使其更适合长时间会话。对于密集的双向对话，128k token 大致可视为约 1-2 小时的密集原始音频上下文。实际时长会因工具使用、内部推理、注入的记录以及其他会话细节而有所不同。

对于长上下文用例， `gpt-realtime-2` 在能够区分哪些是当前信息、哪些是背景信息，以及当来源冲突时应忽略哪些内容时表现最佳。不要依赖模型从原始转录文本或大量上下文转储中推断来源优先级。请使用结构化方式。

在会话开始时，如果存在大量上下文（例如检索到的记录、先前的对话历史、政策、摘要、账户备注或背景文档），请使用结构化的模式。



### 长会话上下文模板示例



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

从更早的实时模型迁移时，应将提示视为一种行为界面，而非仅仅是要迁移的文本。

1. 使用 Codex 或较强的推理模型，根据最新的 Realtime 提示词编写指南重构提示词，并附上该指南的链接，以便基于最佳实践完成迁移。
2. 将推理强度设置为 `low` （而非默认值）。仅在需要更深入规划的工作流中提高该值。
3. 审查工具名称、参数、枚举、JSON schema 和其他设置，确保它们与预期实现一致。
4. 移除过时的示例。针对正常路径、歧义、中断、工具调用和回退行为添加简短示例。
5. 对比迁移前后的代表性对话。针对现有评估检查是否有回归，并记录有意的行为变更。
6. 执行最终的一致性检查。确认提示词清晰地区分了硬性要求、默认值、工具规则、安全规则和回退行为。
7. 运行评估，检查有代表性的失败用例，并迭代提示词，直到目标行为稳定可靠。

  

  


## Realtime 1.5 提示词指南

`gpt-realtime-1.5` 是 Realtime API 中的一个语音到语音模型。同样的 `gpt-realtime` 提示词指南也适用于该模型。

语音到语音系统对于将语音作为核心 AI 交互方式至关重要。 `gpt-realtime-1.5` 支持稳健、可用的实时语音智能体，能够大规模处理关键任务工作流。

与早期的实时预览模型相比， `gpt-realtime-1.5` 在指令遵循、更可靠的工具调用、更佳的语音质量以及整体更流畅的体验方面都有所提升。这些改进使从链式方案转向真正的实时体验成为可能，可降低延迟，并生成听起来更自然、更具表现力的响应。

实时模型受益于那些不能直接套用于文本模型的提示词技巧。本提示词指南首先给出一个建议的提示词骨架，然后逐部分讲解实用技巧、可直接复用的小模式以及可适配到你具体用例的示例。

## 通用建议

- **持续迭代**：细微的措辞改动可能决定行为成败。
  - 示例：针对不清晰的音频指令，我们将“inaudible”改为“unintelligible”，从而改善了对嘈杂输入的处理。
- **优先使用要点而非段落**：清晰简短的要点优于冗长的段落。
- **用示例引导**：模型会紧密遵循示例短语。
- **保持精确**：指令含糊或相互冲突会导致性能下降，与 GPT-5 类似。
- **控制语言**：若出现不希望出现的语言切换，请将输出固定为目标语言。
- **减少重复**：添加多样性规则以减少机械化的措辞。
- **使用全大写文本进行强调**：将关键规则大写可使其更醒目，便于模型遵循。
- **将非文本规则转换为文本**：与其写 “IF x > 3 THEN ESCALATE”，不如写成 “IF MORE THAN THREE FAILURES THEN ESCALATE”。

## 提示词结构

整理提示词能让模型更轻松地理解上下文，并在多轮对话中保持一致。这也让你能更轻松地迭代和修改有问题的部分。

- **作用**：在系统提示中使用清晰、带标签的章节，便于模型查找和遵循。每个章节聚焦一件事即可。
- **如何适配**：添加领域相关的章节（例如合规、品牌规范）。删除不需要的章节（例如，如果不存在发音困扰，可删除参考发音）。

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

本节定义智能体是谁，以及“完成”意味着什么。示例展示了两种不同的身份，以演示当角色和目标明确时，模型会如何严格遵循它们。

- **适用场景**: 模型未采用你需要的人设、角色或任务范围。
- **作用**: 锁定语音智能体的身份，使其回复以该角色描述为条件
- **如何适配**: 根据你的使用场景修改角色

#### 示例（模型使用特定口音）

```
# Role & Objective
You are a Quebecois French-speaking customer service bot. Your task is to answer the user's question.
```

更早的实时预览：



  `gpt-realtime-1.5`:



  #### 示例（模型扮演某个角色）

```
# Role & Objective
You are a high-energy game-show host guiding the caller to guess a secret number from 1 to 100 to win 1,000,000$.
```

更早的实时预览：



  `gpt-realtime-1.5`:



  `gpt-realtime-1.5` 能够比早期的实时预览模型更可靠地扮演所指定的角色。

## 性格与语气

`gpt-realtime-1.5` 在模仿特定性格或语气时能很好地遵循指令。你可以根据用例的预期来定制语音体验和表达方式。

- **适用场景**: Responses 显得平淡、过于冗长，或在多轮之间不一致。
- **作用**: 设定语气、简洁度和节奏，使回复听起来自然且一致。
- **如何适配**: 调整亲和度/正式程度以及默认长度。对于受监管的领域，倾向于中性且精确的语气。添加与你的用例相关的其他小节。

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

#### 示例（多情绪）

```
# Personality & Tone
- Start your response very happy
- Midway, change to sad
- At the end change your mood to very angry
```

`gpt-realtime-1.5`:



  该模型能够遵循复杂的指令，并在整个音频回复中在三种情绪之间切换。

### Speed Instructions

在 Realtime API 中， `speed` 参数改变的是播放速率，而非模型的语音合成方式。若要真正听起来更快，可以添加能够引导语速的提示。

- **适用场景**: 用户希望语速更快；仅靠回放速度参数（speed 参数）无法改善说话风格。
- **作用**: 可独立于客户端回放速度，调整说话风格（简洁度、节奏）。
- **如何适配**: 修改速度指令以满足用例需求。

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

更早的实时预览：



  `gpt-realtime-1.5`:



  借助明确的节奏指令， `gpt-realtime-1.5` 可以产生明显更快的节奏，但又不会显得过于仓促。

### Language Constraint

语言约束确保模型在背景噪声或多语言输入等困难条件下也能始终以预期语言进行回复。

- **适用场景**: 在多语言或嘈杂环境中防止意外切换语言。
- **作用**: 将输出锁定为所选语言,以防止语言被意外更改。
- **如何适配**: 将“English”切换为目标语言;或根据你的用例添加更复杂的指令。

#### 示例（固定到单一语言）

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

这些是应用该指令后生成的响应，使用 `gpt-realtime-1.5`.

![lang constraint en](https://developers.openai.com/cookbook/assets/images/lang_constraint_en.png)

#### 示例（模型教一门语言）

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

这些是应用该指令后生成的响应，使用 `gpt-realtime-1.5`.

![多语言](https://developers.openai.com/cookbook/assets/images/multi-language.png)

该模型可根据自定义指令在语言之间进行代码转换（code-switch）。

### Reduce Repetition

realtime 模型可以紧密遵循示例短语以保持品牌一致性，但它可能会过度使用这些短语，导致响应听起来机械或重复。添加重复规则有助于在保持清晰度和品牌语调的同时维持多样性。

- **适用场景**: 输出会在多轮或多次会话中重复相同的开场白、填充语或句式。
- **作用**: 增加多样性约束——抑制重复短语，引导使用同义词和不同的句式结构，同时保留必须保留的术语。
- **如何适配**: 调整严格程度（例如“同一开场白在 N 轮之内不重复使用”），将必须保留的短语（法务/合规/品牌）加入白名单，并在需要一致性的地方允许更紧凑的措辞。

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

这些是响应 **在** 应用该指令之前的输出， `gpt-realtime-1.5`。模型会重复相同的确认语： `Got it`.

![应用前重复](https://developers.openai.com/cookbook/assets/images/repeat_before.png)

这些是响应 **之后** 应用该指令之前的输出， `gpt-realtime-1.5`.

![应用后重复](https://developers.openai.com/cookbook/assets/images/repeat_after.png)

现在模型可以变换响应和确认语，听起来不再机械重复。

## 参考发音

本节介绍如何确保模型在语音交互过程中正确发音重要的词汇、数字、名称和术语。

- **适用场景**: 品牌名称、技术术语或地点常常被读错。
- **作用**: 通过发音提示增强信任感和清晰度。
- **如何适配**: 保持简短的列表；听到错误时及时更新。

#### 示例

```
# Reference Pronunciations
When voicing these words, use the respective pronunciations:
- Pronounce “SQL” as “sequel.”
- Pronounce “PostgreSQL” as “post-gress.”
- Pronounce “Kyiv” as “KEE-iv.”
- Pronounce "Huawei" as “HWAH-way”
```

更早的实时预览：



  `gpt-realtime-1.5`:



  借助参考发音指令， `gpt-realtime-1.5` 可以将 SQL 正确地读作 "sequel"。

### 字母数字读音

Realtime S2S 在回读关键信息（电话、信用卡、订单 ID）时可能会模糊或合并数字/字母。逐字符明确确认可以防止误听，并促使合成更清晰。

- **适用场景**: 如果模型难以捕获或回读电话号码、卡号、2FA 验证码、订单 ID、序列号、地址、单元编号，或字母数字混合字符串。
- **作用**: 强制模型逐字逐句地说话并加上分隔符,然后与用户确认并在更正后再次确认。可选择性地对字母使用语音消歧符(例如,“A as in Alpha”)。

#### 示例（通用指令章节）

```
# Instructions/Rules
- When reading numbers or codes, speak each character separately, separated by hyphens (e.g., 4-1-5).
- Repeat EXACTLY the provided number; do not omit any digits.
```

_提示：如果你在沿用某种对话流提示策略，可以指定需要应用字母-数字发音指令的对话状态。_

#### 示例（对话状态中的指令）

_（取自我们的提示词对话流程 [openai-realtime-智能体](https://github.com/openai/openai-realtime-agents/blob/main/src/app/agentConfigs/customerServiceRetail/authentication.ts))_

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

这些是响应 **在** 应用该指令之前的输出， `gpt-realtime-1.5`.

> 好的！这个数字是 55119765423。如果还需要其他帮助，请告诉我！

这些是响应 **之后** 应用该指令之前的输出， `gpt-realtime-1.5`.

> 好的！这个数字是：5-5-1-1-1-9-7-6-5-4-2-3。如果还需要其他帮助，请告诉我！

## 说明

本节介绍如何通过提示词指导其完成任务、运用最佳实践，并排查可能遇到的问题。

或许并不意外，我们建议采用与 [GPT-4.1 类似的提示词模式以获得最佳效果](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide).

### 指令遵循

与 GPT-4.1 和 GPT-5 一样，如果指令相互冲突、含糊不清或不明确， `gpt-realtime-1.5` 模型的表现会变差。

- **适用场景**: 输出偏离规则、跳过阶段或误用工具。
- **作用**: 在发布前使用 LLM 来指出歧义、冲突和缺失的定义。

#### **指令质量提示（可在 ChatGPT 中使用，或与API一起使用）**

使用以下提示配合 GPT-5 来识别你提示中可以修复的问题区域。

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

#### **Prompt Optimization Meta Prompt（可在 ChatGPT 中或与 API 配合使用）**

这个元提示可帮助你针对特定的失败模式来改进基础系统提示。提供当前提示并描述你遇到的问题，模型（GPT-5）会给出收紧约束、减少该问题的优化版本。

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

有时模型会认为自己听到了某些内容并尝试进行响应。你可以添加一条自定义指令，告诉模型在听到不清晰的音频或用户输入时应如何行为。根据你的使用场景调整期望的行为。例如，你可能希望模型重复相同的问题，而不是要求澄清。

- **适用场景**: 背景噪音、部分语音或静音会触发不必要的回复。
- **作用**: 阻止误响应，并产生优雅的澄清回复。
- **如何适配**: 根据用例选择是请求澄清还是重复上一个问题。

#### 示例（咳嗽和音频不清晰）

```
# Instructions/Rules
...


## Unclear audio
- Always respond in the same language the user is speaking in, if unintelligible.
- Only respond to clear audio or text.
- If the user's audio is not clear (e.g. ambiguous input/background noise/silent/unintelligible) or if you did not fully hear or understand the user, ask for clarification using {preferred_language} phrases.
```

这些是响应 **之后** 应用该指令之前的输出， `gpt-realtime-1.5`.



  在这个示例中，模型在我大声咳嗽和音频不清晰后会要求澄清。 _（非常）_ 大声的咳嗽以及不清晰的音频后会请求澄清。

### 背景音乐或音效

偶尔，模型在语音生成过程中可能会产生非预期的背景音乐、哼唱、有节奏的噪音或类似声音的伪影。这些伪影会降低清晰度、分散用户注意力，或让智能体显得不够专业。以下指令有助于防止或显著减少这些情况的发生。

- **适用场景**: 当你在 Realtime 音频响应中观察到非预期的音乐元素或音效时使用。
- **作用**: 引导模型避免生成这些不需要的音频伪影。
- **如何适配**: 调整指令，尝试显式抑制你遇到的特定声音模式。

#### 示例

```
# Instructions/Rules
...
- Do not include any sound effects or onomatopoeic expressions in your responses.
```

## 工具

使用本节来告诉模型如何使用你的函数和工具。明确说明在什么情况下应调用工具、什么情况下不应调用工具、需要收集哪些参数、在调用进行时应输出什么内容，以及如何处理错误或部分结果。

### 工具选择

`gpt-realtime-1.5` 能够严格遵循指令。但是，如果你的指令与模型实际可以访问的内容存在冲突，例如在提示中提到了并未传入 tools 列表中的工具，就可能导致较差的响应。

- **适用场景**: 提示中提及了实际不可用的工具。
- **作用**: 检查可用的工具和系统提示，确保它们保持一致。

#### 示例

```
# Tools
## lookup_account(email_or_phone)
...


## check_outage(address)
...
```

我们需要确保可用的工具相同，并且 **各描述之间不要相互矛盾**:

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

### 工具调用前导说明

某些用例可以从 Realtime 模型在调用工具的同时提供音频响应中受益。这能带来更好的用户体验，并掩盖延迟。你可以根据自己的用例修改示例短语。

- **适用场景**: 用户需要在工具调用同时获得即时确认；有助于掩盖延迟。
- **作用**: 在工具调用前添加简短、一致的前导语。

#### 示例

```
# Tools
- Before any tool call, say one short line like “I’m checking that now.” Then call the tool immediately.
```

这些是应用该指令后生成的响应，使用 `gpt-realtime-1.5`.

![工具主动调用](https://developers.openai.com/cookbook/assets/images/tool_proactive.png)

模型根据指令在发起工具调用的同时输出音频回复 "I'm checking that right now"。

#### 工具调用开场白 + 示例短语

如果希望更精细地控制模型在调用工具的同时输出的短语类型，可以在工具的规格描述中添加示例短语。

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


### 未经确认的工具调用

有时模型可能会在工具调用前请求确认。在某些用例中，由于模型表现不够主动，这可能会给终端用户带来较差的体验。

- **适用场景**: 智能体在进行明显的工具调用前会先请求许可。
- **作用**: 去除不必要的确认循环。

#### 示例

```
# Tools
- When calling a tool, do not ask for any user confirmation. Be proactive
```

这些是响应 **之后** 应用该指令之前的输出， `gpt-realtime-1.5`.

![tool no confirm](https://developers.openai.com/cookbook/assets/images/tool_no_confirm.png)

在这个示例中，你会注意到 realtime 模型并未生成任何响应音频，而是直接调用了相应的工具。

_提示：如果你发现模型太快地跳转到调用工具，尝试软化措辞会有所帮助。例如，把“proactive”这类较强的词替换得更温和一些，可以引导模型采取更沉稳、不那么急切的方式。_

### 工具调用性能

随着用例日益复杂、可用工具数量不断增多，明确指导模型何时使用每个工具、何时不使用，变得至关重要。清晰的使用规则不仅能提升工具调用的准确率，还能帮助模型在合适的时机选择合适的工具。

- **适用场景**: 模型在工具调用性能方面表现吃力，需要明确的使用说明以减少误用。
- **作用**: 添加关于何时“使用/避免”每个工具的说明。你也可以添加关于工具调用顺序的说明（在工具调用 A 之后，你可以调用工具调用 B 或 C）

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

_提示：如果某个工具调用可能不可预测地失败，请添加清晰的失败处理说明，以便模型能够优雅地应对。_

### 工具级别行为

你可以针对特定工具微调模型的行为，而不是套用一套全局规则。例如，你可能希望主动调用读取（READ）类工具，而写入（WRITE）类工具则需要明确的确认。

- **适用场景**: 关于主动性、确认或开场白的全局指令并不适用于每个工具。
- **作用**: 添加针对具体工具的行为规则，用以定义模型应当立即调用工具、先确认后再调用，还是在调用前说一段开场白。

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

### 工具输出格式化

一些工具输出（尤其是必须逐字重复的长字符串）可能不在模型的分布范围内。在训练过程中，工具输出通常表现为具有命名字段的 JSON 对象。如果你的工具返回原始字符串，并另行要求模型“完全重复”，模型可能更容易出现改述、截断或混入自身前言的情况。

一种实用的修复方法是将工具输出呈现为正常的工具结果，并以机器可显式的方式表达逐字要求。

- **何时使用：** 工具返回 **较长或复杂的结构化内容** （多句指令、交接 数据包、ID/链接、策略摘要、多步骤流程等），并且你观察到 **截断、改述、字段丢失、重排序，或模型混入自身的前言/评论**.

- **它做了什么：** 将工具输出包裹在一个 **小型、明确的 JSON 信封** （例如。， `response_text` 以及诸如 `require_repeat_verbatim`, `format`，之类的标志， `content_type`），从而使响应看起来更 **符合分布** ，且期望的实现行为是 **机器可清晰解析的**.

- **如何适配：** 保持模式 **最小且稳定**。在以下两处明确记录预期的工具输出形态： **工具说明** 并在 **工具定义旁** （例如：“如果 `require_repeat_verbatim` 为真，则仅输出 `response_text` ，除此之外不输出任何内容”，或“按原样呈现 `response_text` ；不得在工具输出中新增、删减或重排字段。”）。

#### 示例

#### 示例：原始字符串（更容易出错）

工具返回：

```text
I just sent you an email with the verification link. Please open it and click “Confirm”.
```

模型有时会说：

- “我已通过邮件向你发送了验证链接……”（意译）

- 删除最后一句（截断）

- 添加额外评论（“还有什么可以帮你的吗？”）

#### 示例：包装后的 JSON（分布更接近训练数据，更可靠）

工具返回：

```json
{
  "response_text": "I just sent you an email with the verification link. Please open it and click “Confirm”.",
  "require_repeat_verbatim": true
}
```

由于这看起来像典型的工具结果（JSON 对象），模型通常会更轻松地处理：

- 识别“权威”内容是什么（response_text）

- 理解实现约束（require_repeat_verbatim）

- 清晰地复现工具输出，不截断也不附加额外说明

### 改写监督器工具（响应者-思考者架构）

在许多语音设置中，realtime 模型充当响应者（与用户对话），而更强的文本模型充当思考者（进行规划、策略查询、SOP 完成）。文本回复并不会自动适合语音，因此响应者必须在生成音频之前，将思考者的文本重新措辞为适合音频的回复。

- **适用场景**: 当回复者的语音输出在收到思考者响应后听起来机械、过长或生硬时。
- **作用**: 添加明确指示，引导回复者将思考者的文本改写为简短、自然、面向语音的回复。
- **如何适配**: 根据你的用例期望调整措辞风格、开场方式和长度限制。

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

下面是一个没有改写指令的示例：

> 助手：你当前的信用卡余额为正，金额为 32,323,232 澳元。

下面是带有改写指令的相同示例：

> 助手：我刚查完，你的信用卡余额为一千三百二十三万二千三百三十二美元，状态为溢余。你上一次的付款已于 8 月 1 日处理完成。这和你预期的相符吗？

### 常用工具

`gpt-realtime-1.5` 已经过训练，能够有效使用以下常见工具。如果你的用例需要类似的行为，请尽量保持名称、签名和描述与这些工具相近，以最大化可靠性并贴合训练分布。

下面是模型已训练过的一些重要的常见工具：

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

本节介绍如何将对话结构化为清晰的、以目标为导向的阶段，让模型准确知道在每一步应该做什么。它定义了每个阶段的目的、推进阶段的指引，以及进入下一阶段的明确“退出条件”。这可以避免模型停滞、跳过步骤或提前跳转，确保从开场到问题解决的整个对话始终井然有序。

此外，通过将提示组织为不同的对话状态，可以更容易地识别错误模式并更高效地进行迭代。

- **适用场景**: 如果对话显得杂乱无序、在未达成目标前就停滞不前，或者模型难以有效完成目标。
- **作用**: 将交互划分为多个阶段，并为每个阶段设置明确的目标、指令和退出条件。
- **如何适配**: 将各阶段重命名以匹配你的工作流；根据预期行为修改每个阶段的指令；保持“退出条件”具体且简洁。

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

示例短语充当模型的“锚点示例”。它们展示了希望模型遵循的风格、简洁程度和语气，而不会将其锁定在某个僵化的回复中。

- **适用场景**: 回复缺乏你的品牌风格或不够一致。
- **作用**: 提供模型可以灵活变化的示例短语，以保持自然和简洁。
- **如何适配**: 替换示例以贴合品牌；保留“不要始终使用”的提醒。

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

_注意：如果你的语音系统最终只会重复示例短语，导致语音体验更加机械，可以尝试添加 Variety 约束。我们发现这能解决问题。_

### 会话流程 + 示例短语

在不同对话流程状态中添加示例短语是一种有用的模式，可用于教会模型什么样的响应是良好的：

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

### 高级对话流

随着用例日益复杂，你需要一种既能扩展又能保持模型效果的结构。关键在于在可维护性与简洁性之间取得平衡：过于僵化的状态会让模型不堪重负，降低表现并让对话显得机械生硬。

更好的做法是设计能够降低模型感知复杂度的流程。通过以结构化但灵活的方式处理状态，可以让模型更容易保持专注和响应灵敏，从而提升用户体验。

管理复杂场景的两种常见模式是：

1. 将会话流视为状态机
2. 通过 session.updates 实现动态会话流

#### 作为状态机的会话流程

将你的对话定义为一个 JSON 结构，对状态和转换都进行编码。这样便于推理覆盖率、识别边界情况并跟踪随时间发生的变化。由于它以代码形式存储，因此可以像版本控制一样进行版本管理、差异对比，并在流程演进时进行扩展。状态机还能让你精细控制对话从一个状态转移到另一个状态的具体方式和时机。

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

在这种模式下，对话会根据当前状态实时调整系统提示和工具列表。你不会一次性把全部规则和工具都暴露给模型，而是只提供与当前对话阶段相关的内容。

当某个状态的结束条件满足时，你可以使用 session.update 进行状态切换，将提示和工具替换为下一阶段所需的内容。

这种方式可以减轻模型的认知负担，让它更容易处理复杂任务，而不会被无关的上下文干扰。

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

在使用 Realtime 语音智能体时,拥有一个可靠的方式升级到人工处理往往很重要。在本节中,你应根据自身用例修改关于何时升级处理的指令。

- **适用场景**: 模型难以确定何时恰当地升级给人工或备用系统
- **作用**: 定义快速、可靠的升级流程以及要说的话术。
- **如何适配**: 插入你自己的阈值以及模型要说的话术。

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

第一个示例展示了使用 `gpt-4o-realtime-preview-2025-06-03` 时的对话响应。

![escalate 06](https://developers.openai.com/cookbook/assets/images/escalate_06.png)

第二个示例展示了 `gpt-realtime-1.5` 时的对话响应。

![escalate 07](https://developers.openai.com/cookbook/assets/images/escalate_07.png)

`gpt-realtime-1.5` 能够遵循指令并更可靠地升级给人工处理。



## 后续步骤

- 查看之前的 [Realtime 提示指南](https://developers.openai.com/cookbook/examples/realtime_prompting_guide) 了解更多 `gpt-realtime-1.5` 示例。
- 查看 [Realtime 评估指南](https://developers.openai.com/cookbook/examples/realtime_eval_guide) 以测试代表性的语音智能体行为。
- 了解如何通过 [WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc), [WebSocket](https://developers.openai.com/api/docs/guides/realtime-websocket)，之类的标志， [SIP](https://developers.openai.com/api/docs/guides/realtime-sip).
- 了解 [Realtime 对话生命周期](https://developers.openai.com/api/docs/guides/realtime-conversations).
- 查看 [Realtime 成本](https://developers.openai.com/api/docs/guides/realtime-costs).