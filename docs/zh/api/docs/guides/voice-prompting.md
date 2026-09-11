# Prompting Realtime models

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

选择你要构建的 Realtime 模型。对于 GPT-Live，使用 [GPT-Live 提示词指南](https://developers.openai.com/api/docs/guides/live-prompting).







`gpt-realtime-2` 是我们最先进的推理语音模型，适用于低延迟的语音到语音应用。它能够在说话前进行思考，更可靠地遵循指令，使用更大的上下文窗口，并以比早期 realtime 模型更高的精度调用工具。

为了充分利用这些优势，请设计更具意图的提示词。明确定义智能体的职责、决策点、工具调用行为以及护栏：它应该做什么、何时执行，以及应该避免什么。

从简单开始。不要一开始就过度提示。先使用最小化的提示词，运行
  评估，然后仅针对测试中失败的行为添加指令。

## Choose a model

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

## Realtime 2.0 提示指南

    

      Use `gpt-realtime-2` when the voice agent needs stronger
      reasoning, tool selection, exact entity handling, or long-session state.
      Start with `reasoning.effort: "low"`, test default preamble
      behavior, and define clear confirmation boundaries before write actions.
    


## Realtime 2 的变更

将 Realtime 2 作为推理型语音智能体进行提示，而不是作为基础的语音机器人。

| 变更                                | 对提示词的意义                                                                                                                                         |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 推理                             | 允许模型在说话或调用工具之前，针对复杂任务进行内部推理。使用开场白以避免尴尬的沉默或不必要的填充内容。            |
| 提示词精度更重要         | 将“提供帮助”这类笼统的指导替换为清晰的触发、动作和例外规则：何时行动、做什么以及何时不做。                         |
| 指令冲突的代价更高 | 删除重复的 `always`, `never`, `only`、相互矛盾的 `must` 规则，除非它们确实必要。在规则发生竞争时定义优先级。                                |
| 工具行为更易于引导       | 明确助手何时应立即行动、追问缺失信息、确认高精度细节、在失败后重试，或进行上报。                 |
| 开场白是一等公民行为    | 模型在进行较长推理或工具调用流程之前，可能会先进行简短的更新说明。引导开场白何时出现、应当多简短，以及何时可以跳过。 |
| 扩展的上下文窗口               | `gpt-realtime-2` 将 realtime 的上下文窗口从 32k 扩展到 128k tokens，使其更适合长会话和更大的系统提示词。                |

开场白并不是隐藏的思维链。它们是简短的口头提示，例如
  "我现在去查看一下那个订单。"不要要求模型透露私有推理。

## 推荐的提示结构

使用简短且有标签的章节。模型应能快速找到相关说明。

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

并非每个用例都需要所有章节。根据你的产品添加相关章节即可。

## 设置推理努力程度

`gpt-realtime-2` 可以牺牲延迟以换取更深入的推理。使用仍然能为智能体提供足够智能的最低推理等级来完成该工作流。

从…开始 `low` 适用于大多数生产级语音智能体。可根据任务复杂度、延迟容忍度和失败成本进行上下调整。

| Effort    | 使用场景                                            | 示例                                                                 |
| --------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| `minimal` | 最低延迟最重要，且任务简单。 | 智能家居指令、计时器、简单的日历查询。                    |
| `low`     | 你需要在响应速度与基础推理之间取得平衡。       | 客服支持、订单查询、简单的政策问题。                |
| `medium`  | 助手必须对多步任务进行推理。 | 技术支持、诊断、复杂路由。                        |
| `high`    | 更深入的推理能显著提升成功率。       | 高精度工作流、升级决策、带有约束条件的任务。 |
| `xhigh`   | 最大程度的推理值得为之增加延迟和成本。  | 复杂规划、关键分诊、高风险工具编排。      |

除 API 设置外，还要引导模型在何时以及多大程度上进行推理。

```text
## Reasoning

- For direct answers, simple lookups, and short confirmations, respond quickly and do not reason.
- For multi-step tasks, tool decisions, troubleshooting, or escalation, reason before acting.
- Do not perform extended reasoning when the user's audio is unclear; ask for clarification instead.
```

## 有目的地使用前言

开场白是指在智能体智能体进行推理、查找信息或调用工具时，为保持响应感而播报的简短语音更新。使用得当可以让用户放心地知道助手正在工作；使用不当则会成为冗余信息，反而增加感知延迟。

`gpt-realtime-2` 默认会生成开场白。先测试默认行为。如果默认行为与你的产品体验不符，请显式进行调整。

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

`gpt-realtime-2` 当提示明确说明每种任务类型需要提供多少细节时，长度指引效果最佳。与其让模型"简洁"，不如在上下文中定义简洁的含义：直接回答、工具结果、故障排查、对比和升级等场景，各自可能需要不同的回复长度。

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

> 用户：应该选择哪个套餐？

> 助手：如果希望成本最低，请选择 Basic。如果需要团队权限和共享账单功能，请选择 Pro。如果合规审查或管理控制很重要，请选择 Enterprise。

## 设计工具行为

`gpt-realtime-2` 在工具调用方面能力更强，但工具行为仍然取决于提示和工具规范的设计。如果提示未定义何时执行、询问、确认或恢复，助手可能会过早调用工具、提出不必要的问题，或重复失败的调用。

### 设置工具调用积极性

较高的积极性适用于只读、低风险的操作。当工具会修改数据、触发外部副作用或依赖精确标识符时，较低的积极性更为合适。

| 工具类型                           | 默认行为                                          |
| ----------------------------------- | --------------------------------------------------------- |
| 只读、低风险的查询          | 当意图和所需字段明确时调用。           |
| 使用精确标识符的只读操作     | 在查询前确认标识符。                     |
| 用户可见的通信          | 发送前先起草或总结。                        |
| 账户变更                     | 调用前进行确认。                                   |
| 购买、取消、支付  | 调用前确认金额、目标和后果。   |
| 不可逆或高影响的操作 | 明确确认，并在适当时提供升级途径。 |

当你的操作中同时包含读取和写入动作时，可使用这个均衡的默认配置。请根据你的使用场景进行调整。

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

> 用户：从我的卡中扣除剩余余额。

Bad:

> 助手：我已为你的卡完成扣款。

优点：

> 助手：为确认，你希望我对存档的卡片收取剩余余额 248.16 美元。我可以继续吗？

### 从工具失败中恢复

工具失败是会话的一部分。良好的恢复策略应说明发生了什么，并向用户提供清晰的下一步操作。

不要以相同方式处理每一次失败。恢复行为应取决于工具类型、失败模式和对用户的影响。有些失败应静默重试，另一些则需要询问用户进行澄清、更正标识符、确认新操作，或选择其他路径。

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

> Assistant: 出现了一些问题。

优点：

> Assistant: 我未能为 O R D dash 3 1 2 5 B 2 3 找到匹配项。请问其中有哪个部分我说错了吗？

### 保持工具可用性同步

Realtime 模型乐于提供帮助。如果提示中提到了某个实际上并不存在的工具，或者工具列表与提示不匹配，模型可能会虚构一个工具名称，或假装自己已经完成了该操作。

例如，如果提示中引用了 `lookup_order`，但所提供的工具被命名为 `search_orders`，模型可能会调用错误的名称，或模拟该操作。

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

使用附录中的提示审计 meta prompt 来检查生产环境中的提示
  是否存在矛盾、缺失的工具以及脆弱的指令。

## 处理静音与背景音频

语音智能体智能体默认倾向于做出响应。在生产环境中，它们经常会听到不应获得语音回复的音频，例如沉默、背景噪音、保留音、电视音频或旁边的对话。

当助手应该保持安静并继续收听时，使用一个无操作的等待工具。该工具为模型提供一个有效的非说话动作，而不是让它说出类似“我在这里”或“我没听清”的内容。

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

将其与提示指令搭配使用：

```text
## Handling Silence and Background Noise

If the latest audio is silence, background noise, hold music, TV audio, side conversation, or speech not addressed to you, call `wait_for_user`.

Do not respond conversationally after calling this tool.

Do not say "I'm here," "I didn't catch that," "Take your time," or "Let me know when you're ready."

Resume normal responses only when the user clearly addresses you or asks for help.
```

将其用于未被指向的音频，而不是用于不清晰的用户请求。如果用户明显在向助手说话但内容无法理解，请改为请求澄清。

## 谨慎地使用消息通道

`gpt-realtime-2` 可以在 commentary 通道中产生用户可见的中间消息，并在 final 通道中产生面向用户的最终响应。当行为依赖于出现位置时，使用针对特定通道的指令。

| Channel      | 是否对用户可见？ | 用途                   |
| ------------ | ------------- | -------------------------- |
| `commentary` | 是           | 开场白和工具调用。  |
| `final`      | 是           | 面向用户的最终消息。 |

例如，工具调用发生在 commentary 通道中。如果你想让助手在工具调用之前、期间或之后说些什么，请根据 commentary 通道来指定该行为。

```text
Before calling tools in the commentary channel, briefly tell the user what you are doing.
```

`gpt-realtime-2` 可以在单次轮次中发出多个响应阶段。在 API 输出中，这种区分通过 `response.done` 事件表示，该事件包含一个 `phase` 值，用于指示内容是 commentary 还是最终答案。

你可以使用该字段在应用中以不同方式处理各个阶段。例如，可以将 commentary 作为简短的中间更新进行播放或显示，而 `final_answer` 则可以保留用于助手的最终完成回复。

```text
response.output[0].phase: "commentary"
response.output[1].phase: "final_answer"
```



### 示例响应阶段



用户提示：

> "这道 AP 生物题我做不下去了 [QUESTION]。"

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

模型应当只对能以高置信度理解的音频采取行动。如果音频不清晰，模型应当提出简短的澄清问题，而不是进行猜测。

不要让模型推断缺失的词语、调用工具、捕获实体、生成开场白，或耗费隐藏的推理时间来试图重建用户可能表达的内容。

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

> 用户音频：“Check order three one-” [cut off]

Bad:

> 助手：I'll check order 31 now.

优点：

> 助手：I heard only part of the order number. Could you repeat it digit by digit?

## 捕获精确实体

许多实时工作流依赖精确的值：订单 ID、追踪编号、电子邮件地址、确认码、账号、理赔号、工单 ID、支持参考号和电话号码。

语音让这件事变得困难。用户语速很快，会用不同方式组合数字、拼读部分值、使用填充词、在对话中途自我纠正，或读出发音相似的字符。一个错误的数字就可能导致查询失败或取错账户。

保守地采集实体。一次只收集一个值，只对明确的部分进行规范化，在调用工具前确认高精度的值，并确保每次更正都可恢复。

### 每次采集一个实体

当工作流需要多个值时，应逐个收集。这可以避免字段之间相互混淆，尤其是在语音对话中。

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

### 处理拼写出的字符

当用户逐个字符拼读 ID、代码、姓名或电子邮件地址时使用。读出的是输入形式，而不是最终值。

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

对于数字标识符，用户可以逐位说出数字、将其分组，或使用自然的数字短语。如果字段期望一个连续的数字值，请将清晰的数字语音转换为数字。

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

订单 ID、物流单号、账号、索赔编号、确认码以及类似的标识符都是高精度字段。在工具调用中使用它们之前，请先进行核对。

对于数值型标识符，请逐位回读其值。将其作为一个完整数字来读取可能会掩盖错误。

示例：

> 助手：确认一下，我听到的是 8... 3... 5... 2... 1。对吗？

如果用户更正了一个字符或数字，请在调用工具前完整复述更正后的值。

示例：

> Assistant: 好的。我有 8……3……5……7……1。这样正确吗？

```text
## Exact Identifier Confirmation

Before calling tools with high-precision identifiers:

- Confirm the final normalized value with the user.
- Read numeric identifiers back digit by digit.
- Do not use guessed, partial, or ambiguous values.
- If the user corrects the value, repeat the full corrected value before calling the tool.
```

### 逐字核对邮件内容

电子邮件地址是重要的信息。句点、连字符、下划线、重复字母以及听起来相似的名称都可能导致账户查询失败，或将消息发送到错误的地址。

请用户拼读电子邮件地址：

> Assistant: 你能逐个字母拼出这个电子邮箱地址吗？这样我可以确保我记录得完全准确。

读取时，请确认最终的准确地址：

> Assistant: Just to confirm, that is c-h-e-n at example dot com, right?

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

### 实体集合 工作流



#### 示例实体集合 工作流



当任务在任何工具调用之前需要精确值时，使用此完整 工作流。

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

`gpt-realtime-2` 它会比此前的实时模型更字面化地遵循指令。在旧模型上效果良好的提示词可能需要重新调优。

使用精确的语言。模型可能会优先考虑指令的确切措辞，而不是你原本期望的更广泛的行为。宽泛或僵硬的规则可能以出人意料的方式主导智能体的行为，尤其是当多条规则相互重叠时。

谨慎使用诸如 `must`, `only`, `never`，和 `always`。之类的约束词。仅在行为确实必要时使用它们，而不是作为一般性的强调。过度使用硬性约束会让智能体变得僵化、过度谨慎，或无法处理合理的例外情况。

优先使用精确的范围：

```text
For write actions that modify user data, ask for confirmation before calling the tool.
```

避免使用宽泛的范围：

```text
Always ask for confirmation before doing anything.
```

宽泛的版本可能导致在无害的只读查询（例如查询订单状态、获取库存信息或读取账户信息）之前出现不必要的确认。

### 字面解读示例



#### 字面解读陷阱示例



此提示过于局限：

```text
When a confirmation code is provided, repeat it verbatim and wait for a clear yes.
```

用户消息：

> 我的订单 ID 是 ORD-3125B23。

可能的失败：

模型可能不会应用该规则，因为用户提供的是订单 ID 而非确认码。开发者清楚预期行为，但指令的范围过于狭窄。

更安全的改写：

```text
When the user provides an exact identifier, including confirmation codes, order IDs, ticket IDs, reset PINs, claim numbers, tracking numbers, or account numbers, repeat the captured value and wait for confirmation before using it in a tool call.
```





通用提示建议：

- 优先使用明确的指令，而非依赖隐含意图。
- 除非行为确实必须严格限定，否则避免使用不必要的限制性措辞。
- 尽量减少相互矛盾的指引。
- 谨慎使用分层或互相竞争的优先级指令。
- 逐步测试提示词。措辞上的细微改动可能带来显著的行为差异。
- 从早期的实时模型迁移时，预计部分提示词需要重新组织结构才能获得最佳效果。

## 分别控制语言和口音

语言和口音应分别进行控制。

用户的口音与其目标语言并不相同。用户可能用印地语、西班牙语、法语或普通话口音说英语，但仍期望得到英语回复。

避免使用过于宽泛的语言指令，例如：

```text
Mirror the user.
Respond naturally in the user's language.
Switch languages when appropriate.
Sound local.
Adapt to the user's accent.
```

这些指令过于宽泛。模型可能将口音、填充词、回应语或零星的外语词曲解为切换语言的理由。

### 英语语言策略

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

### 多语言策略

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

`gpt-realtime-2` 可以更强烈地遵循口音指令，但模糊的口音提示可能导致漂移或意外的语言切换。

口音控制提示在指定以下要素时效果最佳：

- 目标口音；
- 哪些特征应保持稳定；
- 预期的节奏、重音和韵律；
- 口音适配是否应影响语言选择。

而不是：

```text
Sound Australian.
```

而是：

```text
## Accent

Speak English with a light Australian accent.

- Keep the accent stable from the first word to the last.
- Use natural Australian vowel shaping, but keep speech easy to understand.
- Do not exaggerate the accent.
- Do not change response language based on the user's accent.
```

### 自定义语音

使用 [Custom Voices](https://developers.openai.com/blog/updates-audio-models#custom-voices) 当标准音色无法稳定满足品牌、口音或角色需求时使用。

提示工程可以引导口音、节奏和表达方式，但无法完全替代音色设计。对于需要一致的品牌音色身份或口音保真度的用例，请考虑使用 [Custom Voices](https://developers.openai.com/blog/updates-audio-models#custom-voices).

Custom Voices 仅对获批客户开放。如需使用，请联系你的客户团队。

## 在长会话中保持状态

`gpt-realtime-2` 将实时上下文窗口从 32k 扩展到 128k tokens,更适合长会话。对于密集的双向对话,128k tokens 大致可以理解为约 1-2 小时的密集原始音频上下文。具体时长会因工具使用、内部推理、注入的记录以及其他会话细节而有所不同。

对于长上下文使用场景, `gpt-realtime-2` 在能够分辨哪些信息是最新的、哪些是背景信息、以及当来源冲突时哪些应当被忽略的情况下,表现最佳。不要依赖模型从原始转录文本或大量上下文转储中推断来源优先级。要使用结构化方式。

在启动带有大量上下文(如检索到的记录、之前的对话历史、政策、摘要、账户备注或背景文档)的会话时,使用结构化的模式。



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





## 从更早的实时模型迁移

从早期的实时模型迁移时，请将 prompt 视为行为层面，而不仅仅是要迁移的文本。

1. 使用 Codex 或强推理模型，根据最新的 Realtime 提示词指南重构提示词。附上本提示词指南的链接，以便在迁移时遵循最佳实践。
2. 将推理力度设置为 `low` ，而非默认值。仅当工作流需要更深度的规划时再上调。
3. 审查工具名称、参数、枚举、JSON schemas 以及其他设置，确保它们与预期实现一致。
4. 移除过时的示例。为主流程、歧义、中断、工具调用以及回退行为补充简短的示例。
5. 对比迁移前后具有代表性的对话。参照现有评估检查回归，并记录有意为之的行为变更。
6. 执行最终一致性检查。确认提示词能够清晰区分硬性要求、默认值、工具规则、安全规则以及回退行为。
7. 运行评估、检查具有代表性的失败案例，并迭代提示词，直到目标行为稳定可靠。

  

  


## Realtime 1.5 Prompting Guide

`gpt-realtime-1.5` 是 Realtime API 中的一个语音到语音模型。同样的 `gpt-realtime` 提示词编写指南同样适用于该模型。

语音到语音系统对于将语音打造为核心 AI 界面至关重要。 `gpt-realtime-1.5` 支持强大、可用的实时语音智能体，能够大规模处理关键任务工作流。

与早期的 realtime 预览模型相比， `gpt-realtime-1.5` 带来了更强的指令遵循能力、更可靠的工具调用、更好的语音质量以及整体更流畅的体验。这些改进使得从链式方法转向真正的实时体验成为可能，从而降低延迟，并生成听起来更自然、更具表现力的响应。

Realtime 模型受益于那些无法直接套用到基于文本的模型上的提示词编写技巧。本提示词指南首先给出一个推荐的提示词骨架，然后逐部分讲解，包含实用技巧、可直接复用的小模式以及可适配到你自身用例的示例。

## 通用技巧

- **持续迭代**：细微的措辞改动可能决定行为的成败。
  - 示例：对于不清晰的音频指令，我们将“inaudible”替换为“unintelligible”，改善了嘈杂输入的处理效果。
- **优先使用要点而非段落**：简洁清晰的要点优于冗长的段落。
- **用示例进行引导**：模型会严格遵循示例中的措辞。
- **保持精确**：含糊或相互冲突的指令会导致性能下降，效果与 GPT-5 类似。
- **控制语言**：如果出现不希望出现的语言切换，请将输出固定到目标语言。
- **减少重复**：添加一条多样性规则，以减少机械化的措辞。
- **使用全大写文本表示强调**：将关键规则大写可以使其更醒目，便于模型遵循。
- **将非文本规则转换为文本**：不要写 “IF x > 3 THEN ESCALATE”，而是写成 “IF MORE THAN THREE FAILURES THEN ESCALATE”。

## 提示结构

合理组织你的提示可以让模型更容易理解上下文，并在多轮交互中保持一致。这也能让你更轻松地迭代和修改有问题的部分。

- **What it does**: 在系统提示中使用清晰、带标签的章节，便于模型查找并遵循。每个章节应聚焦于一件事。
- **How to adapt**: 添加特定领域的章节（例如 Compliance、Brand Policy）。删除不需要的章节（例如，如果未遇到发音问题，则可删除 Reference Pronunciations）。

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

本节定义智能体的身份以及“完成”的含义。示例展示两种不同的身份，以演示在角色和目标明确时模型会多么严格地遵循它们。

- **何时使用**：模型未采用你所需的人设、角色或任务范围。
- **What it does**：锁定声音智能体的身份，使其回复始终基于该角色描述
- **How to adapt**：根据你的用例修改该角色

#### 示例（模型采用特定口音）

```
# Role & Objective
You are a Quebecois French-speaking customer service bot. Your task is to answer the user's question.
```

早期的实时预览：



  `gpt-realtime-1.5`:



  #### 示例（模型扮演某个角色）

```
# Role & Objective
You are a high-energy game-show host guiding the caller to guess a secret number from 1 to 100 to win 1,000,000$.
```

早期的实时预览：



  `gpt-realtime-1.5`:



  `gpt-realtime-1.5` 能够比此前的实时预览模型更可靠地执行指定角色。

## 性格与语气

`gpt-realtime-1.5` 在模仿特定性格或语气时遵循指令的能力较强。你可以根据使用场景的预期来定制语音体验和表达方式。

- **何时使用**: 回复显得平淡、过于冗长，或在多轮之间不一致。
- **What it does**: 设置语气、简洁度和节奏，让回复听起来自然且一致。
- **How to adapt**：调整亲切度/正式度与默认长度。对于受监管的领域，倾向于中性且精确的表达。添加与你的用例相关的其他小节。

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

### 速度指令

在 Realtime API 中， `speed` 参数改变的是播放速率，而不是模型的语音合成方式。若要真正加快语速，可添加能够引导节奏的指令。

- **何时使用**: 用户希望更快的说话声音；仅靠播放速度（使用 speed 参数）无法解决说话风格问题。
- **What it does**: 调整说话风格（简洁度、节奏），独立于客户端播放速度。
- **How to adapt**: 修改速度指令以满足用例需求。

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

早期的实时预览：



  `gpt-realtime-1.5`:



  通过明确的节奏指令， `gpt-realtime-1.5` 可以产生明显更快的节奏，又不会显得过于仓促。

### Language Constraint

语言约束可确保模型在有背景噪音或多语言输入等困难条件下，仍能始终以预期语言作出回应。

- **何时使用**: 在多语言或嘈杂环境中防止意外切换语言。
- **What it does**: 将输出锁定为所选语言，以防止意外的语言切换。
- **How to adapt**: 将 “English” 切换为目标语言；或根据你的用例添加更复杂的指令。

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

以下是使用以下指令应用后的响应： `gpt-realtime-1.5`.

![lang 约束 en](https://developers.openai.com/cookbook/assets/images/lang_constraint_en.png)

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

以下是使用以下指令应用后的响应： `gpt-realtime-1.5`.

![多语言](https://developers.openai.com/cookbook/assets/images/multi-language.png)

该模型能够根据自定义指令在一种语言与另一种语言之间进行语码转换。

### 减少重复

实时模型可以紧密遵循示例短语以保持品牌一致性，但可能会过度使用它们，导致回答听起来机械或重复。添加重复规则有助于在保持清晰度和品牌语调的同时维持表达的多样性。

- **何时使用**: 输出内容在多个回合或会话中重复使用相同的开头、填充词或句式。
- **What it does**: 添加多样性约束——抑制重复短语，引导使用同义词和不同的句式结构，同时保留必需的术语。
- **How to adapt**：调整严格程度（例如，“不要在每 N 个回合中重复使用相同的开头超过一次”），将必须保留的短语（法律/合规/品牌）加入白名单，并在需要一致性的地方允许更紧凑的措辞。

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

这些是响应 **在应用该指令之前** 之前 `gpt-realtime-1.5`。模型重复相同的确认： `Got it`.

![应用前重复](https://developers.openai.com/cookbook/assets/images/repeat_before.png)

这些是响应 **之后** 之前 `gpt-realtime-1.5`.

![应用后重复](https://developers.openai.com/cookbook/assets/images/repeat_after.png)

现在，模型能够变换其响应和确认方式，不再显得机械重复。

## 参考发音

本节介绍如何确保模型在语音交互过程中正确读出重要的单词、数字、名称和术语。

- **何时使用**: 品牌名称、技术术语或地点经常被读错。
- **What it does**: 通过音标提示提升信任感和清晰度。
- **How to adapt**: 保持列表简短；听到错误时及时更新。

#### 示例

```
# Reference Pronunciations
When voicing these words, use the respective pronunciations:
- Pronounce “SQL” as “sequel.”
- Pronounce “PostgreSQL” as “post-gress.”
- Pronounce “Kyiv” as “KEE-iv.”
- Pronounce "Huawei" as “HWAH-way”
```

早期的实时预览：



  `gpt-realtime-1.5`:



  通过参考发音说明， `gpt-realtime-1.5` 可以正确地将 SQL 读作“sequel”。

### 字母数字发音

Realtime S2S 在回读关键信息（电话、信用卡、订单 ID）时，可能会模糊或合并数字/字母。逐字显式确认可以避免误听，并让合成结果更清晰。

- **何时使用**: 如果模型难以捕获或回读电话号码、卡号、2FA 验证码、订单号、序列号、地址、单元号，或混合字母数字字符串。
- **What it does**: 强制模型逐字符朗读并使用分隔符，然后与用户确认并在修正后再次确认。可选用语音消歧符来区分字母（例如，“A as in Alpha”）。

#### 示例（通用说明章节）

```
# Instructions/Rules
- When reading numbers or codes, speak each character separately, separated by hyphens (e.g., 4-1-5).
- Repeat EXACTLY the provided number; do not omit any digits.
```

_提示：如果正在按照会话流程提示策略进行操作，可以指定需要在哪个会话状态下应用字母数字发音指令。_

#### 示例（对话状态中的指令）

_(取自我们 [openai-realtime-智能体](https://github.com/openai/openai-realtime-agents/blob/main/src/app/agentConfigs/customerServiceRetail/authentication.ts))_

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

这些是响应 **在应用该指令之前** 之前 `gpt-realtime-1.5`.

> 好的！号码是 55119765423。如有其他需要，请告诉我！

这些是响应 **之后** 之前 `gpt-realtime-1.5`.

> 好的！号码是：5-5-1-1-1-9-7-6-5-4-2-3。如有其他需要，请告诉我！

## 说明

本节介绍用于指导模型完成任务、应用最佳实践以及修复可能出现的问题的提示词指引。

也许并不令人意外，我们推荐的提示词模式与 [GPT-4.1 的提示词模式类似](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide).

### 指令遵循

与 GPT-4.1 和 GPT-5 一样，如果指令相互冲突、含糊不清或不明确， `gpt-realtime-1.5` 效果会更差。

- **何时使用**: 输出偏离规则、跳过阶段或误用工具。
- **What it does**: 在你发布之前，使用 LLM 指出歧义、冲突和缺失的定义。

#### **指令质量提示词（可在 ChatGPT 中使用，或与 API 配合使用）**

将以下提示词与 GPT-5 一起使用，以识别你的提示词中可以修复的问题区域。

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

#### **Prompt Optimization Meta Prompt（可在 ChatGPT 中使用，或与 API 配合使用）**

这个 meta 提示帮助你针对特定的失败模式来改进基础系统提示。提供当前提示并描述你遇到的问题，模型（GPT-5）会给出收紧约束并减少该问题的优化版本。

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

有时模型会以为自己听到了某些内容并尝试回应。你可以添加一条自定义指令，告诉模型在听到不清晰的音频或用户输入时应如何表现。请根据你的实际需求调整所需行为。例如，你可能希望模型重复同样的问题，而不是请求澄清。

- **何时使用**: 背景噪音、不完整的语句或静音会触发不必要的回复。
- **What it does**: 阻止误响应并产生优雅的澄清回复。
- **How to adapt**: 根据用例选择是请求澄清还是重复上一个问题。

#### 示例（咳嗽和音频不清晰）

```
# Instructions/Rules
...


## Unclear audio
- Always respond in the same language the user is speaking in, if unintelligible.
- Only respond to clear audio or text.
- If the user's audio is not clear (e.g. ambiguous input/background noise/silent/unintelligible) or if you did not fully hear or understand the user, ask for clarification using {preferred_language} phrases.
```

这些是响应 **之后** 之前 `gpt-realtime-1.5`.



  In this example, the model asks for clarification after my _(very)_ loud cough and unclear audio.

### 背景音乐或音效

在语音生成过程中，模型偶尔可能产生非预期的背景音乐、哼唱、有节奏的噪声或类声音的伪影。这些伪影会降低清晰度、分散用户注意力，或让助手显得不够专业。以下指令有助于避免或显著减少此类情况的发生。

- **何时使用**: 当你在 Realtime 音频响应中观察到意外的音乐元素或音效时使用。
- **What it does**: 引导模型避免生成这些不需要的音频伪影。
- **How to adapt**: 调整指令，尝试显式抑制你遇到的特定声音模式。

#### 示例

```
# Instructions/Rules
...
- Do not include any sound effects or onomatopoeic expressions in your responses.
```

## 工具

使用本节告诉模型如何使用你的函数和工具。明确说明何时调用工具、何时不调用工具、需要收集哪些参数、调用进行中要说些什么，以及如何处理错误或部分结果。

### 工具选择

`gpt-realtime-1.5` 会严格遵循指令。但是，如果你的指令与模型能够访问的内容相冲突（例如在提示中提及了 tools 列表中未传入的工具），就可能导致糟糕的响应。

- **何时使用**: 提示中提及了实际不可用的工具。
- **What it does**: 检查可用的工具和系统提示，以确保它们保持一致。

#### 示例

```
# Tools
## lookup_account(email_or_phone)
...


## check_outage(address)
...
```

我们需要确保可用的工具一致， **并且描述之间不相互矛盾**:

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

### 工具调用开场白

一些用例可以受益于 Realtime 模型在调用工具的同时提供音频响应。这能带来更好的用户体验，掩盖延迟。你可以根据自己的用例修改示例短语。

- **何时使用**: 用户需要在工具调用同时获得即时确认；有助于掩盖延迟。
- **What it does**: 在工具调用前添加一段简短、一致的前置说明。

#### 示例

```
# Tools
- Before any tool call, say one short line like “I’m checking that now.” Then call the tool immediately.
```

以下是使用以下指令应用后的响应： `gpt-realtime-1.5`.

![tool proactive](https://developers.openai.com/cookbook/assets/images/tool_proactive.png)

使用该指令时，模型会同时输出音频响应 "I'm checking that right now" 和工具调用。

#### 工具调用开场白 + 示例短语

如果你希望更精细地控制模型在调用工具时同时输出的短语类型，可以在工具的规范描述中添加示例短语。

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

有时模型会在工具调用之前请求确认。对于某些用例来说，这可能会给最终用户带来较差的体验，因为模型并未主动采取行动。

- **何时使用**：在显而易见的工具调用之前，智能体会先征求许可。
- **What it does**：消除不必要的确认循环。

#### 示例

```
# Tools
- When calling a tool, do not ask for any user confirmation. Be proactive
```

这些是响应 **之后** 之前 `gpt-realtime-1.5`.

![tool no confirm](https://developers.openai.com/cookbook/assets/images/tool_no_confirm.png)

在示例中，你会注意到实时模型没有生成任何响应音频；它直接调用了相应的工具。

_提示：如果你发现模型过快跳到调用工具，可以尝试让措辞更柔和一些。例如，将“proactive”这样较强的词换成更温和的表达，有助于引导模型采取更冷静、更不急切的方式。_

### 工具调用性能

随着用例日益复杂、可用工具数量不断增加，关键在于明确引导模型在何时使用每个工具，以及同样重要的——何时不应使用。清晰的使用规则不仅能提高工具调用的准确率，还能帮助模型在恰当的时机选择合适的工具。

- **何时使用**: 模型在工具调用性能方面表现吃力，需要明确指令以减少误用。
- **What it does**: 添加关于何时“使用/避免”每个工具的指令。你也可以添加关于工具调用顺序的指令（在工具调用 A 之后，你可以调用工具调用 B 或 C）

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

_提示：如果某个工具调用可能以不可预测的方式失败，请在提示中加入明确的失败处理指引，让模型能够优雅地应对。_

### 工具层级行为

你可以针对特定工具微调模型的行为，而不是应用一条全局规则。例如，你可能希望主动调用 READ 工具，而 WRITE 工具则需要明确确认。

- **何时使用**: 关于主动性、确认或开场白的全局指令并不适合所有工具。
- **What it does**: 添加针对每个工具的行为规则，用于定义模型应立即调用该工具、先确认，还是在调用前先说一段开场白。

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

一些工具输出，尤其是必须逐字重复的长字符串，可能对模型来说是分布外的内容。在训练期间，工具输出通常看起来是带有具名字段的 JSON 对象。如果你的工具返回原始字符串，并单独要求模型“完全重复”，模型可能更容易出现改写、截断或混入自身开场白的情况。

一个实用的修复方法是让工具输出看起来像一个普通的工具结果，并把逐字重复的要求以机器可执行的方式明确表达出来。

- **适用场景：** 工具返回 **较长或复杂的结构化内容** （多句指令、交接 数据包、ID / 链接、策略摘要、多步骤流程等），并且你观察到 **截断、改写、字段丢失、重排序，或模型混入自身前言/评论的情况**.

- **作用：** 将工具输出包装在一个 **简洁、明确的 JSON 信封** （中（例如， `response_text` 加上诸如 `require_repeat_verbatim`, `format`，之类的标记，或者 `content_type`），从而让响应看起来更 **符合分布** ，并使期望的呈现行为对机器而言是 **清晰可读的**.

- **如何改造：** 保持 schema **最小且稳定**。在两份文档中都清晰说明期望的工具输出结构：你的 **Tools 说明** 并且紧邻 **工具定义** （例如："如果 `require_repeat_verbatim` 为 true，则恰好输出 `response_text` ，不要输出其他内容"，或者"按原样呈现 `response_text` ；不要从工具输出中增删或重排字段"）。

#### 示例

#### 示例：原始字符串（更容易出错）

工具返回：

```text
I just sent you an email with the verification link. Please open it and click “Confirm”.
```

模型有时会说：

- “我已经通过电子邮件向你发送了验证链接……”（意译）

- 删去最后一句（截断）

- 添加额外的评论（“还有什么我可以帮忙的吗？”）

#### 示例：包装后的 JSON（更符合训练数据分布，更可靠）

工具返回：

```json
{
  "response_text": "I just sent you an email with the verification link. Please open it and click “Confirm”.",
  "require_repeat_verbatim": true
}
```

因为这看起来像典型的工具结果（JSON 对象），所以模型通常更容易处理：

- 识别何为“权威”内容（response_text）

- 理解实现约束（require_repeat_verbatim）

- 干净地复现工具输出，不截断也不添加额外说明

### 改写主管工具（应答者-思考者架构）

在许多语音场景中，实时模型充当应答者（向用户发言），而更强的文本模型充当思考者（执行规划、策略查询、SOP 完成）。文本回复并不会天然适合语音，因此在生成音频之前，应答者必须将思考者的文本改写为适合语音表达的回复。

- **何时使用**: 当响应者在收到思考者响应后，其口语输出听起来机械、过长或生硬时使用。
- **What it does**: 添加明确的指令，引导响应者将思考者的文本重新表述为简短、自然且以口语为先的回复。
- **How to adapt**: 调整措辞风格、开头方式和简洁性限制，以匹配你的用例预期。

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

下面是未使用改写指令的示例：

> Assistant: 您当前的信用卡余额为 32,323,232 澳元，为正值。

下面是使用改写指令的相同示例：

> Assistant:刚刚查完了——你的信用卡余额是三十二万三千两百三十二美元，对你有利。你上一次的付款是在八月一号处理的。这和你预期的相符吗？

### 常用工具

`gpt-realtime-1.5` 已经过训练，可有效使用以下常见工具。如果你的用例需要类似的行为，请使工具的名称、签名和描述与这些保持一致，以最大程度地提高可靠性并使其更符合分布。

以下是模型已经训练过的一些重要的常见工具：

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

本节介绍如何将对话划分为清晰且目标驱动的阶段，使模型在每一步都明确知道该做什么。它定义了每个阶段的目的、推进阶段的指令，以及进入下一阶段的明确“退出标准”。这可以防止模型停滞、跳过步骤或提前跳转，并确保从问候到问题解决的整个对话保持有序。

此外，通过将提示组织成不同的对话状态，可以更轻松地识别错误模式并更有效地迭代。

- **何时使用**: 如果对话显得杂乱无章、在达成目标之前陷入停滞，或者模型难以有效完成目标。
- **What it does**: 将交互划分为具有清晰目标、指令和退出条件的阶段。
- **How to adapt**: 将阶段重命名以匹配你的工作流；修改每个阶段的指令以遵循你期望的行为；让“退出条件”具体且简洁。

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

示例短语充当模型的“锚定示例”。它们展示了你希望模型遵循的风格、简洁度和语气，同时不会把它锁定在单一刻板的回复中。

- **何时使用**: 回复缺乏你的品牌风格或风格不一致。
- **What it does**: 提供模型可以灵活变换的示例短语，以保持自然简洁。
- **How to adapt**: 替换示例以贴合品牌；保留“不要总是使用”的警告。

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

_注意：如果你的语音系统最终只重复示例短语，导致语音体验更加机械，可以尝试添加 Variety 约束。我们观察到该方法可以解决此问题。_

### 对话流程 + 示例短语

在不同对话流程状态中添加示例短语是一个有用的做法，可以教会模型什么是好的回复：

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

### 进阶对话流程

随着用例越来越复杂，你需要一种既能扩展又能保持模型有效性的结构。关键在于在可维护性和简洁性之间取得平衡：过多僵化的状态会让模型不堪重负，损害性能，并使对话显得机械呆板。

更好的做法是设计能够降低模型感知复杂度的流程。通过以结构化但灵活的方式处理状态，可以让模型更容易保持专注和响应，从而提升用户体验。

管理复杂场景的两种常见模式是：

1. 将对话流程视为状态机
2. 通过 session.updates 实现动态对话流程

#### 对话流作为状态机

将会话定义为一个 JSON 结构，对状态和转换都进行编码。这样便于推理覆盖率、识别边界情况，并随时间跟踪变化。由于以代码形式存储，你可以随着流程演进对其进行版本管理、对比差异和扩展。状态机还能让你细致地控制会话从一个状态转移到另一个状态的方式与时机。

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

在这种模式中，对话会通过根据当前状态更新系统提示和工具列表来实时调整。你不会一次性向模型暴露所有可能的规则和工具，而是只提供与对话当前阶段相关的内容。

当某个状态的结束条件被满足时，你可以使用 session.update 进行状态转换，将提示和工具替换为下一阶段所需的内容。

这种方法降低了模型的认知负担，使其更容易处理复杂任务，而不会被无关上下文分散注意力。

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


## 安全与升级处理

在使用 Realtime 语音智能体时，往往需要一种可靠的方式来升级给人工处理。在本节中，你应该根据自身用例修改关于何时进行升级的指令。

- **何时使用**: 模型难以确定何时适当地升级给人工或回退系统
- **What it does**: 定义快速、可靠的升级方式以及要说的话。
- **How to adapt**: 插入你自己的阈值以及模型需要表达的内容。

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

第一个示例展示了使用该指令生成的对话响应 `gpt-4o-realtime-preview-2025-06-03` 。

![escalate 06](https://developers.openai.com/cookbook/assets/images/escalate_06.png)

第二个示例展示了使用该指令生成的对话响应 `gpt-realtime-1.5` 。

![escalate 07](https://developers.openai.com/cookbook/assets/images/escalate_07.png)

`gpt-realtime-1.5` 能够遵循指令，更可靠地转接给人工处理。



## 后续步骤

针对 GPT-Live：

- 审阅 [委派和工具](https://developers.openai.com/api/docs/guides/live-delegation) 用于后端提示词和应用自有上下文。
- 通过 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live) 或 [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)。连接。详见 [电话与 SIP](https://developers.openai.com/api/docs/guides/voice-sip?api=live) 以了解电话集成。
- [评估语音 智能体](https://developers.openai.com/api/docs/guides/voice-agents#evaluate-your-voice-agent) 在对话质量和已验证任务结果方面的表现。

Realtime 专用：

- 查看之前的 [Realtime prompting guide](https://developers.openai.com/cookbook/examples/realtime_prompting_guide) 以获取更多 `gpt-realtime-1.5` 示例。
- 查看 [Realtime eval guide](https://developers.openai.com/cookbook/examples/realtime_eval_guide) 以测试典型的语音智能体行为。
- 通过 [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime), [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime)，之类的标记，或者 [SIP](https://developers.openai.com/api/docs/guides/voice-sip?api=realtime).
- 了解 [Realtime conversation lifecycle](https://developers.openai.com/api/docs/guides/realtime-conversations) 并查看 [Realtime costs](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=realtime).