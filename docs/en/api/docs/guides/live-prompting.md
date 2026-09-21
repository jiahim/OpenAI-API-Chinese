# Prompting GPT-Live

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

`gpt-live-1` is a voice model for natural, continuous conversation. It can listen and speak at the same time, respond to interruptions, and keep the conversation moving while a backend agent handles reasoning, tools, and longer tasks.

Use `session.instructions` for the assistant’s role, speaking style, and when to ask the backend for help. Give the backend model or agent the procedures and tools for tasks such as looking up an order or changing a booking.

Describe the conversational behavior you want, and let GPT-Live choose the wording for ordinary replies. When migrating from Realtime, keep the rules your product needs for wording, interruptions, and the order of actions. Test the simpler prompt on representative conversations as you revise it.

Your application checks permissions and required confirmations before executing an action.

## Recommended prompt structure

Start with this template and add instructions as needed. See [session configuration](https://developers.openai.com/api/docs/guides/live-conversations#configuration-fields) for field limits.

Keep the template’s `Backchannel policy`, `Interruption policy`, and `Delegation policy` headings, and customize the text beneath them. Backchannels are brief listening sounds, such as “mm-hmm,” that the assistant can make while the caller continues speaking.

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

List the capabilities your backend supports. GPT-Live uses this list to decide which requests to hand off. Configure the backend’s actual tools in [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation).

## Personality

Describe the assistant’s role, tone, and speaking pace in a few sentences. Include how it should respond when a caller is frustrated or unsure. For example: “Explain one step at a time. If the caller sounds confused, ask which part they want to go over.”

## Backchannels

Start with the template’s backchannel policy, then listen for whether the assistant’s brief acknowledgments help the conversation or interrupt the caller. “Moderate” is a prompting instruction, not a numerical frequency setting.

You can modify this line from the starter prompt:

```text
Backchannel policy: Use moderate backchannels. Acknowledge naturally without competing with the main response.
```

If you want backchannels, allow brief listening sounds during interruptions. A rule that forbids all overlapping speech can suppress them.

## Interruptions

When the user interrupts, the assistant should stop its answer and listen. A brief listening sound is different from taking over the user's turn.

Handle changes to a task separately from interruptions to speech. “Stop talking” asks the assistant to yield; “Cancel my booking” asks the backend to take an action. Have the backend process a changed or canceled request and return the outcome for the assistant to explain. See [task state and interruptions](https://developers.openai.com/api/docs/guides/live-delegation).

## Delegation

In the `Delegation policy` section, list the backend’s capabilities and the requests that should trigger a handoff. Use concrete conditions, such as “the user asks to change a booking.” Keep the template’s three labels: `Backend tools`, `Delegate to the backend when`, and `Do not delegate to the backend when`.

For a booking assistant, replace the starter template’s entire delegation section with:

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

Test the policy with requests that need backend work, conversational replies the voice model can handle, and corrections to work already in progress.

Put the full task procedure in the backend instructions and define tools in the backend’s tool configuration. Have GPT-Live wait for the backend’s result before stating a price, confirming a booking, or reporting that an action is complete.

You can prompt GPT-Live to acknowledge a request while delegated work runs. As background work progresses, use [`session.commentary.append`](https://developers.openai.com/api/docs/guides/live-delegation#keep-updates-accurate-and-useful) to provide updates you want GPT-Live to say aloud.

For backend prompts, conversation context, tool results, typed input, and API examples, read [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation). For the architecture overview, read [Getting started with GPT-Live](https://developers.openai.com/api/docs/guides/live).

## Appendix: Optional controls

Add these instructions only when testing shows a need. Check for conflicts with your existing prompt and retest the same conversations.

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