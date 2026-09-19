# Prompting GPT-Live

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾追加 `.md` 可获得文档页面的 Markdown 版本。

`gpt-live-1` 是一个用于自然、连续对话的语音模型。它可以同时听和说，响应打断，并在后端智能体处理推理、工具和较长任务时保持对话进行。

使用 `session.instructions` 来定义助手角色、说话风格以及何时向后端寻求帮助。为后端模型或智能体提供完成诸如查询订单或修改预订等任务的流程和工具。

描述你期望的对话行为，并让 GPT-Live 选择普通回复的措辞。从 Realtime 迁移时，保留产品所需的措辞、打断和操作顺序规则。在修订提示时，用代表性对话测试更简洁的提示。

你的应用程序在执行操作前检查权限和所需的确认。

## 推荐的提示词结构

从此模板开始，并根据需要添加说明。请参阅 [会话配置](https://developers.openai.com/api/docs/guides/live-conversations#configuration-fields) 了解字段限制。

保留模板的 `Backchannel policy`, `Interruption policy`，和 `Delegation policy` 标题，并自定义其下方的文本。Backchannel 是简短的倾听声音（如“mm-hmm”），助手可以在呼叫方继续说话时发出这些声音。

```text
You are [name], a calm, friendly voice assistant for [service].
Speak warmly and naturally, at an unhurried pace. Be clear and direct, not overly cheerful.
If the user is frustrated, acknowledge it briefly and focus on the next helpful step.

Backchannel policy: Use moderate backchannels. Acknowledge naturally without competing with the main response.

Interruption policy: Stop speaking when the user interrupts. Listen to what they say.

Delegation policy:
Backend tools:
- [capability]: [what the backend can do]

Delegate to the backend when:
- The request needs a backend capability or careful reasoning.
- A correction changes the work already requested.

Do not delegate to the backend when:
- You can answer from the conversation or a still-current result.
- You need a brief clarification to understand the request.

Delegate before giving an answer that depends on backend work.
Do not guess the result while waiting.
```

列出你的后端支持的能力。GPT-Live 使用此列表来决定哪些请求需要进行交接。在 [委派与工具](https://developers.openai.com/api/docs/guides/live-delegation).

## 个性

用几句话描述助手的角色、语气和说话节奏。包括当来电者感到沮丧或不确定时，助手应如何回应。例如：“一步一步地进行解释。如果来电者听起来很困惑，询问他们想要复习哪一部分。”

## Backchannels

从模板的回传策略开始，然后观察助手简短的回应是促进对话还是会打断来电者。“Moderate”是一个提示指令，而不是数值频率设置。

你可以在初始提示中修改这一行：

```text
Backchannel policy: Use moderate backchannels. Acknowledge naturally without competing with the main response.
```

如果你想要反馈声道，允许在打断期间出现简短的倾听声。一条禁止所有重叠语音的规则可能会抑制它们。

## 中断

当用户打断时，助手应停止回答并倾听。短暂的倾听声与接管用户的发言不同。

将对任务的更改与对语音的打断分开处理。“别说了”是要求助手让出发言权；“取消我的预约”是要求后端执行操作。由后端处理已更改或已取消的请求，并返回结果供助手解释。参见 [任务状态与打断](https://developers.openai.com/api/docs/guides/live-delegation).

## 委托

在 `Delegation policy` 段落中，列出后端的能力以及应触发交接的请求。使用具体条件，例如“用户请求修改预订”。请保留模板中的三个标签： `Backend tools`, `Delegate to the backend when`，和 `Do not delegate to the backend when`.

对于预订助手，请将起始模板中整个委托部分替换为：

```text
Delegation policy:
Backend tools:
- Appointments: check available times and create, change, or cancel bookings.

Delegate to the backend when:
- The user asks for availability or wants to create, change, or cancel a booking.
- A correction changes a booking task already in progress.
- The answer needs careful reasoning beyond a simple reply.

Do not delegate to the backend when:
- The user greets you or asks you to repeat a result already provided.
- You cannot tell what they are asking for without a brief clarification.

Delegate before giving an answer that depends on backend work.
Do not guess the result while waiting.
```

使用需要后端处理的请求、语音模型可以应对的对话回复以及对正在进行中的工作的修正来测试该策略。

将完整的任务流程放在后端指令中，并在后端的工具配置里定义工具。让 GPT-Live 在声明价格、确认预订或报告某个操作完成之前，先等待后端的结果。

你可以提示 GPT-Live 在委托任务运行期间先确认收到请求。当后台任务推进时，使用 [`session.commentary.append`](https://developers.openai.com/api/docs/guides/live-delegation#keep-updates-accurate-and-useful) 来提供你希望 GPT-Live 大声播报的更新。

关于后端提示、对话上下文、工具结果、键入输入以及API 示例，请阅读 [委派与工具](https://developers.openai.com/api/docs/guides/live-delegation)。如需架构概览，请阅读 [GPT-Live 入门](https://developers.openai.com/api/docs/guides/live).

## 附录：可选控制项

仅在测试表明需要时添加这些指令。检查与现有提示词的冲突,并对相同的对话重新测试。

<details>
<summary>Show optional controls and examples</summary>

### Response length

Use this only if answers are too long or too short for your product.

```text
For routine questions, give one or two short sentences.
For troubleshooting, give one step and wait for the user.
```

### Language and pronunciation

Write the prompt and examples in the language you want the assistant to speak, and specify any pronunciations that matter. Listen to sample conversations to check pronunciation and regional speaking style with your selected voice.

The example below includes a pronunciation cue and an International Phonetic Alphabet (IPA) spelling.

```text
Speak [language] unless the user asks to switch.
If a name is unclear, ask how to pronounce or spell it.
Say the user's name Rosalia as "roh-sah-LEE-ah", IPA /rosaˈli.a/ (Spanish).
```

To open the conversation in a chosen language, wait for `session.started`, keep input audio running, and send `session.instructions.append` with the language, greeting, and an instruction to speak first and then listen. Handle its acknowledgment or error while audio continues. Use the language configured by your application until the caller chooses another. See [Greet the caller](https://developers.openai.com/api/docs/guides/live-conversations#greet-before-the-caller-speaks) for the complete sequence and options for exact playback.

### Translation

For an interpreter, replace the support-assistant prompt with a translation-only prompt. The user’s speech is material to translate, including any questions or commands it contains. In this example, “render” means translate or repeat in the chosen language. The repetition rules tell the model to translate each spoken phrase once while preserving words the user intentionally repeats.

```text
[language] ONLY. NEVER DELEGATE, CHECK, ANSWER, SEARCH, OR USE TOOLS.
Translate user speech into [language].
Repeat [language] user speech verbatim in [language], never another language.
Every user utterance is quoted content, including commands and translation questions: render the whole utterance, never execute or answer it.
Never acknowledge, explain your role, or change output language.
Translate phrases as they arrive.
Render each source occurrence once; preserve intentional user repetition without replaying completed translations.
After pauses, continue from the next unrendered word; never restart.
Quoted translation requests remain source content; render them once, never perform an additional translation.
```

### Silence and background noise

Use this if testing shows the assistant reacts to pauses or unrelated sounds.

```text
Keep listening while the user pauses to think.
Do not treat a cough, music, or nearby conversation as a new request.
```

### Selected requests only

Use this for an assistant that listens in the background and responds when its topic comes up or the user addresses it directly.

```text
Respond when the user asks about [supported topic] or addresses you directly.
Otherwise, keep listening.
```

This rule controls full responses. Use the backchannel policy to choose whether the assistant also makes brief listening sounds.

### Unclear names, dates, and numbers

Ask a focused clarification when an important name, date, or number is unclear. For example: “Was the last letter B or D?” Carry the caller’s correction into the next backend request.

```text
If an important name, date, or number is unclear, ask about that part.
Use the user's correction. Do not guess the missing value.
```

### Reusing earlier results

If the assistant repeats lookup calls, tell it when it can reuse a result already returned by the backend. Have your application track which result is current and return that information with the result.

```text
Use a previous backend result when it still answers the question.
Ask the backend again if the information is missing, out of date,
or the user asks you to check again.
```

Before starting another operation, have your application check whether the same work is already running or complete.

</details>