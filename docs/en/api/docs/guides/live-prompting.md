# Prompting GPT-Live

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

`gpt-live-1` is a voice model for natural, continuous conversation. It can listen and speak at the same time, respond to interruptions, and keep the conversation moving while a backend agent handles reasoning, tools, and longer tasks.

Give GPT-Live a goal and room to conduct the conversation. The live prompt need not prescribe every question or acknowledgment. Define the assistant’s role, conversational style, and when to involve the backend. Give GPT-Live flexibility in its phrasing, acknowledgments, and pacing.

When migrating from Realtime, start with a simpler prompt. Test which rules for exact wording, fixed response sequences, or turn-taking your product still needs. Revise existing instructions and remove conflicts as you iterate.

Keep detailed procedures in the backend prompt and enforce permissions and tool execution checks in your application.

## Recommended prompt structure

The live model has a small context window. Use the template below as your `session.instructions` value and add only the optional controls your application needs.

GPT-Live delegates reasoning and tool use to your backend while it handles the conversation. Configure backend prompts and tools in [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation).

Keep the policy labels. Customize the personality, backchannel behavior, backend capabilities, and delegation conditions for your product.

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

List only capabilities your backend actually has. These describe what it can help with; they are not instructions for the live model to call a tool.

## Personality

Give the assistant a clear role, tone, and pace. Also describe how it should respond when someone is frustrated or unsure. A few short sentences, like the opening of the starter prompt, are enough.

The live prompt controls speaking behavior, including tone, pace, backchannels, and interruptions. Keep long business procedures in the backend prompt.

## Backchannels

A backchannel is a short listening sound, such as “mm-hmm.” Start with moderate backchannels so the assistant shows it is listening without taking over the conversation.

You can modify this line from the starter prompt:

```text
Backchannel policy: Use moderate backchannels. Acknowledge naturally without competing with the main response.
```

Do not add a blanket “never speak while the user is speaking” rule alongside it. That can also suppress helpful listening sounds. Change the policy only if your product needs different behavior, then listen to real conversations to check the result.

## Interruptions

When the user interrupts, the assistant should stop its answer and listen. A brief listening sound is different from taking over the user's turn.

Stopping speech does not automatically stop backend work. “Stop talking” and “Cancel my booking” mean different things. If the user changes or cancels a request, the backend must handle that change and confirm what happened. See [task state and interruptions](https://developers.openai.com/api/docs/guides/live-delegation).

## Delegation

Organize the `Delegation policy` section of your prompt under three labels: `Backend tools`, `Delegate to the backend when`, and `Do not delegate to the backend when`. Describe the backend's capabilities, then give concrete conditions, such as “the user asks to change a booking,” instead of “delegate when needed.”

Tell GPT-Live when to delegate and what the backend can help with. Put tool-call instructions and result-handling procedures in the backend prompt.

For example, replace the starter prompt's delegation section with a policy like this; do not add a second policy:

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

List only capabilities your backend has. Check the policy against a few real user requests: which ones should trigger delegation, and which should not?

Keep the full procedure and tool schemas in the backend prompt. The live model only needs the short handoff rules. It must not promise a booking, guess a price, or claim an action has finished before the backend confirms it.

For backend prompts, conversation context, tool results, typed input, and API examples, read [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation). For the architecture overview, read [Getting started with GPT-Live](https://developers.openai.com/api/docs/guides/live).

## Appendix: Optional controls

**Only add a rule if you need to change a specific behavior.** Most applications should start with the short prompt above. Copying every example makes the prompt longer and can introduce conflicting instructions.

<details>
<summary>Show optional controls and examples</summary>

### Response length

Use this only if answers are too long or too short for your product.

```text
For routine questions, give one or two short sentences.
For troubleshooting, give one step and wait for the user.
```

### Language and pronunciation

Use this when your product needs a particular language or pronunciation. A voice choice does not guarantee a regional accent.

Write your prompt in the language you want the model to speak. For example, if the assistant will speak Spanish, write its instructions and example responses in Spanish.

```text
Speak [language] unless the user asks to switch.
If a name is unclear, ask how to pronounce or spell it.
Say the user's name Rosalia as "roh-sah-LEE-ah", IPA /rosaˈli.a/ (Spanish).
```

For a greeting before the caller has spoken, append a fresh `session.instructions.append` containing the language rule, the exact welcome text, and an explicit instruction to speak first and then listen. Wait for its acknowledgment and keep the audio stream running. See [Greet the caller](https://developers.openai.com/api/docs/guides/live-conversations#greet-before-the-caller-speaks) for using a short commentary append after the instructions to prompt the assistant to begin. Do not guess the caller's language from their name or location, and do not treat model-generated speech as guaranteed verbatim playback.

### Translation

Add this only for an interpreter. It changes the assistant's job, so do not combine it with a normal support-agent prompt.

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

Use this for an assistant that should respond only to a narrow set of requests.

```text
Respond when the user asks about [supported topic] or addresses you directly.
Otherwise, keep listening.
```

This affects when the assistant responds. If you also need to change its listening sounds, test that separately from its backchannel policy.

### Unclear names, dates, and numbers

Prompts do not guarantee exact capture. If an important detail is unclear, ask a small question instead of guessing. For example: “Was the last letter B or D?”

```text
If an important name, date, or number is unclear, ask about that part.
Use the user's correction. Do not guess the missing value.
```

### Reusing earlier results

Add a rule only if the assistant repeats lookups unnecessarily. Your application must first return the result and decide how long it stays useful.

```text
Use a previous backend result when it still answers the question.
Ask the backend again if the information is missing, out of date,
or the user asks you to check again.
```

A prompt does not guarantee duplicate work will be avoided. Keep that check in your application.

</details>