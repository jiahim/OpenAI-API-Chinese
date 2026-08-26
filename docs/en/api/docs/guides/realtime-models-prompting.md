# Using realtime models

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

`gpt-realtime-2` is our state-of-the-art reasoning voice model for low-latency speech-to-speech applications. It can think before it speaks, follow instructions more reliably, use a larger context window, and call tools with greater precision than earlier realtime models.

To take advantage of these gains, design prompts with more intent. Explicitly define the assistant's responsibilities, decision points, tool-calling behavior, and guardrails: what it should do, when it should do it, and what it should avoid.

Start simple. Do not over-prompt upfront. Begin with a minimal prompt, run
  evaluations, then add instructions only for behaviors that fail in testing.

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



## Realtime 2.0 Prompting Guide

    

      Use `gpt-realtime-2` when the voice agent needs stronger
      reasoning, tool selection, exact entity handling, or long-session state.
      Start with `reasoning.effort: "low"`, test default preamble
      behavior, and define clear confirmation boundaries before write actions.
    


## What changed in Realtime 2

Prompt Realtime 2 as a reasoning voice agent, not as a basic voice bot.

| Change                                | What it means for prompts                                                                                                                                         |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reasoning                             | Allow the model to reason internally for complex tasks before speaking or calling tools. Use preambles to avoid awkward silence or unnecessary filler.            |
| Prompt precision matters more         | Replace broad guidance like "be helpful" with clear trigger, action, and exception rules: when to act, what to do, and when not to do it.                         |
| Instruction conflicts are more costly | Remove overlapping `always`, `never`, `only`, and `must` rules unless they are truly required. Define priority when rules compete.                                |
| Tool behavior is more steerable       | Specify when the assistant should act immediately, ask for missing information, confirm high-precision details, retry after failure, or escalate.                 |
| Preambles are first-class behavior    | The model may speak brief updates before longer reasoning or tool-use flows. Steer when preambles should appear, how short they should be, and when to skip them. |
| Expanded context window               | `gpt-realtime-2` expands the realtime context window from 32k to 128k tokens, making it better suited for long sessions and larger system prompts.                |

Preambles aren't hidden chain-of-thought. They're short spoken updates such as
  "I'll check that order now." Don't ask the model to reveal private reasoning.

## Recommended prompt structure

Use short, labeled sections. The model should be able to find the relevant instructions quickly.

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

Not every use case needs every section. Add the sections that are relevant for your product.

## Set reasoning effort

`gpt-realtime-2` can trade latency for deeper reasoning. Use the lowest reasoning level that still gives the assistant enough intelligence for the workflow.

Start with `low` for most production voice agents. Tune up or down based on task complexity, latency tolerance, and failure cost.

| Effort    | Use when                                            | Example                                                                 |
| --------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| `minimal` | Lowest latency matters most and the task is simple. | Smart-home commands, timers, simple calendar checks.                    |
| `low`     | You need responsiveness plus basic reasoning.       | Customer support, order lookup, simple policy questions.                |
| `medium`  | The assistant must reason through multi-step tasks. | Technical support, diagnostics, complex routing.                        |
| `high`    | Deeper reasoning materially improves success.       | High-precision workflows, escalation decisions, tasks with constraints. |
| `xhigh`   | Maximum reasoning is worth added latency and cost.  | Complex planning, critical triage, high-stakes tool orchestration.      |

Beyond the API setting, steer the model on when and how much to reason.

```text
## Reasoning

- For direct answers, simple lookups, and short confirmations, respond quickly and do not reason.
- For multi-step tasks, tool decisions, troubleshooting, or escalation, reason before acting.
- Do not perform extended reasoning when the user's audio is unclear; ask for clarification instead.
```

## Use preambles intentionally

Preambles are short spoken updates that keep a voice agent feeling responsive while it reasons, looks something up, or calls a tool. Used well, they reassure the user that the assistant is working. Used poorly, they become filler and increase perceived latency.

`gpt-realtime-2` generates preambles by default. Start by testing the default behavior. If it does not match your product experience, tune it explicitly.

![Preamble generation and playback timeline](https://developers.openai.com/images/platform/guides/realtime-2-preambles.png)

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

## Control response length

`gpt-realtime-2` follows length guidance best when the prompt specifies how much detail to give for each task type. Instead of telling the model to "be concise," define what concise means in context: direct answers, tool results, troubleshooting, comparisons, and escalations may each need different response lengths.

```text
## Verbosity

- Direct answers: Use 1-2 short sentences.
- Clarifying questions: Ask one question at a time.
- Tool results: Summarize the result first, then give only the next useful action.
- Product or option comparisons: Include key differences, tradeoffs, and who each option fits.
- Troubleshooting: Give one step at a time unless the user asks for the full procedure.
- Escalations: Briefly explain why escalation is needed and what will happen next.
```

Example:

> User: Which plan should I choose?

> Assistant: If you want the lowest cost, choose Basic. If you need team permissions and shared billing, choose Pro. If compliance review or admin controls matter, choose Enterprise.

## Design tool behavior

`gpt-realtime-2` is stronger at tool calling, but tool behavior still depends on prompt and tool-spec design. If the prompt does not define when to act, ask, confirm, or recover, the assistant may call tools too early, ask unnecessary questions, or repeat failed calls.

### Set tool-call eagerness

High eagerness works well for read-only, low-risk actions. Low eagerness is better when tools modify data, trigger external effects, or depend on exact identifiers.

| Tool type                           | Default behavior                                          |
| ----------------------------------- | --------------------------------------------------------- |
| Read-only, low-risk lookup          | Call when intent and required fields are clear.           |
| Read-only with exact identifier     | Confirm the identifier before lookup.                     |
| User-visible communication          | Draft or summarize before sending.                        |
| Account changes                     | Confirm before calling.                                   |
| Purchases, cancellations, payments  | Confirm amount, target, and consequence before calling.   |
| Irreversible or high-impact actions | Confirm explicitly and offer escalation when appropriate. |

Use this balanced default when you have a mix of read and write actions. Tailor it based on your use case.

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

High-risk example:

> User: Charge my card for the remaining balance.

Bad:

> Assistant: I've charged your card.

Good:

> Assistant: To confirm, you want me to charge the card on file $248.16 for the remaining balance. Should I proceed?

### Recover from tool failures

Tool failures are part of the conversation. A good recovery should explain what happened and give the user a clear next step.

Do not treat every failure the same. Recovery behavior should depend on the tool type, failure mode, and user impact. Some failures should be handled silently with a retry. Others require asking the user to clarify, correct an identifier, confirm a new action, or choose an alternate path.

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

> Assistant: Something went wrong.

Good:

> Assistant: I couldn't find a match for O R D dash 3 1 2 5 B 2 3. Did I get any part of that wrong?

### Keep tool availability synchronized

Realtime models are eager to help. If the prompt mentions a tool that is not actually available, or if the tool list does not match the prompt, the model may invent a tool name or pretend it completed the action.

For example, if the prompt references `lookup_order`, but the provided tool is named `search_orders`, the model may call the wrong name or simulate the action.

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

Use the prompt audit meta prompt in the appendix to review production prompts
  for contradictions, missing tools, and brittle instructions.

## Handle silence and background audio

Voice agents tend to respond by default. In production, they often hear audio that should not receive a spoken response, such as silence, background noise, hold music, TV audio, or side conversations.

Use a no-op wait tool when the assistant should stay quiet and keep listening. The tool gives the model a valid non-speaking action instead of making it say things like "I'm here" or "I didn't catch that."

Tool design:

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

Pair it with prompt instructions:

```text
## Handling Silence and Background Noise

If the latest audio is silence, background noise, hold music, TV audio, side conversation, or speech not addressed to you, call `wait_for_user`.

Do not respond conversationally after calling this tool.

Do not say "I'm here," "I didn't catch that," "Take your time," or "Let me know when you're ready."

Resume normal responses only when the user clearly addresses you or asks for help.
```

Use this for non-addressed audio, not for unclear user requests. If the user is clearly speaking to the assistant but the content is unintelligible, ask for clarification instead.

## Use message channels deliberately

`gpt-realtime-2` can produce user-visible intermediate messages in the commentary channel and final user-facing responses in the final channel. Use channel-specific instructions when the behavior depends on where it appears.

| Channel      | User-visible? | Used for                   |
| ------------ | ------------- | -------------------------- |
| `commentary` | Yes           | Preambles and tool calls.  |
| `final`      | Yes           | Final user-facing message. |

For example, tool calls happen in the commentary channel. If you want the assistant to say something before, during, or after tool use, specify that behavior in relation to the commentary channel.

```text
Before calling tools in the commentary channel, briefly tell the user what you are doing.
```

`gpt-realtime-2` can emit multiple response phases in a single turn. In API output, this distinction is represented by the `response.done` event, which includes a `phase` value that indicates whether the content is commentary or the final answer.

You can use this field to handle each phase differently in your application. For example, commentary can be played or displayed as a short intermediate update, while `final_answer` can be reserved for the assistant's completed response.

```text
response.output[0].phase: "commentary"
response.output[1].phase: "final_answer"
```



### Example response phases



User prompt:

> "I'm stuck on this AP Bio question [QUESTION]."

Shortened API response:

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





## Handle unclear audio

The model should only act on audio it can understand with confidence. If the audio is unclear, the model should ask a brief clarification question instead of guessing.

Do not let the model infer missing words, call tools, capture entities, generate preambles, or spend hidden reasoning time trying to reconstruct what the user may have said.

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

Example:

> User audio: "Check order three one-" [cut off]

Bad:

> Assistant: I'll check order 31 now.

Good:

> Assistant: I heard only part of the order number. Could you repeat it digit by digit?

## Capture exact entities

Many realtime workflows depend on exact values: order IDs, tracking numbers, email addresses, confirmation codes, account numbers, claim numbers, ticket IDs, support references, and phone numbers.

Voice makes this hard. Users speak quickly, group numbers in different ways, spell partial values, use filler, correct themselves mid-turn, or pronounce characters that sound alike. One wrong digit can fail a lookup or retrieve the wrong account.

Capture entities conservatively. Collect one value at a time, normalize only what is clear, confirm high-precision values before tool calls, and make every correction recoverable.

### Collect one entity at a time

When a workflow needs multiple values, collect them one at a time. This prevents fields from blending together, especially in voice conversations.

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

### Handle spelled-out characters

Use this when users spell IDs, codes, names, or email addresses one character at a time. The spoken form is input, not the final value.

```text
## Spelled-Out Characters

When a user dictates an ID, code, or email character by character, treat the spoken sequence as one compact value. Preserve explicitly spoken separators like dash, dot, underscore, slash, or plus; otherwise do not add spaces or separators.

Examples:

- "A B C one two three" -> "ABC123"
- "B C dash nine eight seven" -> "BC-987"
- "J O H N at example dot com" -> "john@example.com"

Do not insert spaces between spelled-out characters unless the user explicitly says the value contains spaces.
```

### Normalize spoken numbers carefully

For numeric identifiers, users may say digits individually, group them, or use natural number phrases. If the field expects one continuous numeric value, convert clear numeric speech into digits.

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

### Confirm exact identifiers before tool calls

Order IDs, tracking numbers, account numbers, claim numbers, confirmation codes, and similar identifiers are high-precision fields. Confirm them before using them in a tool call.

For numeric identifiers, read the value back digit by digit. Reading the value as a full number can hide errors.

Example:

> Assistant: Just to confirm, I heard 8... 3... 5... 2... 1. Is that right?

If the user corrects one character or digit, repeat the full corrected value before calling the tool.

Example:

> Assistant: Got it. I have 8... 3... 5... 7... 1. Is that correct?

```text
## Exact Identifier Confirmation

Before calling tools with high-precision identifiers:

- Confirm the final normalized value with the user.
- Read numeric identifiers back digit by digit.
- Do not use guessed, partial, or ambiguous values.
- If the user corrects the value, repeat the full corrected value before calling the tool.
```

### Confirm emails character by character

Email addresses are important values. Dots, dashes, underscores, repeated letters, and similar-sounding names can cause account lookup failures or send messages to the wrong address.

Ask the user to spell the email address:

> Assistant: Could you spell the email address character by character so I can make sure I have it exactly right?

When reading it back, confirm the exact final address:

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

### Entity collection workflow



#### Example Entity collection workflow



Use this full workflow when a task requires exact values before any tool call.

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





## Avoid literal instruction traps

`gpt-realtime-2` follows instructions more literally than earlier realtime models. Prompts that worked well on older models may need tuning.

Use precise language. The model may prioritize the exact wording of an instruction over the broader behavior you intended. Broad or rigid rules can dominate the assistant's behavior in surprising ways, especially when multiple rules overlap.

Be careful with constraint words such as `must`, `only`, `never`, and `always`. Use them when the behavior is truly required, not as general emphasis. Overusing hard constraints can make the assistant rigid, overly cautious, or unable to handle reasonable exceptions.

Prefer precise scope:

```text
For write actions that modify user data, ask for confirmation before calling the tool.
```

Avoid broad scope:

```text
Always ask for confirmation before doing anything.
```

The broad version may cause unnecessary confirmations before harmless read-only lookups, such as checking order status, retrieving availability, or reading account information.

### Literal interpretation example



#### Example literal interpretation trap



This prompt is too narrow:

```text
When a confirmation code is provided, repeat it verbatim and wait for a clear yes.
```

User message:

> My order ID is ORD-3125B23.

Possible failure:

The model may not apply the rule because the user provided an order ID, not a confirmation code. The intended behavior is clear to the developer, but the instruction's scope is too narrow.

Safer rewrite:

```text
When the user provides an exact identifier, including confirmation codes, order IDs, ticket IDs, reset PINs, claim numbers, tracking numbers, or account numbers, repeat the captured value and wait for confirmation before using it in a tool call.
```





General prompting recommendations:

- Prefer explicit instructions over implied intent.
- Avoid unnecessary constraint words unless behavior truly must be rigid.
- Minimize contradictory guidance.
- Be cautious with layered or competing priority instructions.
- Test prompts incrementally. Small wording changes can have large behavioral effects.
- When migrating from earlier realtime models, expect some prompts to require restructuring for best results.

## Control language and accent separately

Language and accent should be controlled separately.

A user's accent is not the same as their intended language. A user may speak English with a Hindi, Spanish, French, or Mandarin accent and still expect English responses.

Avoid broad language instructions such as:

```text
Mirror the user.
Respond naturally in the user's language.
Switch languages when appropriate.
Sound local.
Adapt to the user's accent.
```

These are too broad. The model may interpret accent, filler words, backchannels, or isolated foreign words as a reason to switch languages.

### English language policy

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

### Multilingual policy

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

### Accent control

`gpt-realtime-2` can follow accent instructions more strongly, but vague accent prompts can cause drift or unintended language switching.

Accent-control prompts work best when they specify:

- the target accent;
- which characteristics should remain stable;
- the intended pacing, stress, and prosody;
- whether accent adaptation should affect language choice.

Instead of:

```text
Sound Australian.
```

Use:

```text
## Accent

Speak English with a light Australian accent.

- Keep the accent stable from the first word to the last.
- Use natural Australian vowel shaping, but keep speech easy to understand.
- Do not exaggerate the accent.
- Do not change response language based on the user's accent.
```

### Custom voices

Use [Custom Voices](https://developers.openai.com/blog/updates-audio-models#custom-voices) when standard voices cannot reliably meet brand, accent, or character requirements.

Prompting can steer accent, pacing, and delivery, but it cannot fully replace voice design. For use cases that require consistent branded voice identity or accent fidelity, consider [Custom Voices](https://developers.openai.com/blog/updates-audio-models#custom-voices).

Custom Voices are available only to approved customers. Contact your account team for access.

## Maintain state in long sessions

`gpt-realtime-2` expands the realtime context window from 32k to 128k tokens, making it better suited for long sessions. For dense two-way conversations, 128k tokens is best thought of as roughly 1-2 hours of dense raw audio context. This will vary depending on tool use, internal reasoning, injected records, and other session details.

For long-context use cases, `gpt-realtime-2` performs best when it can tell what information is current, what is background, and what should be ignored if sources conflict. Do not rely on the model to infer source priority from a raw transcript or large context dump. Use structure.

Use a structured pattern when starting a session with a large amount of context, such as retrieved records, prior conversation history, policies, summaries, account notes, or background documents.



### Example long-session context template



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





## Migrate from earlier realtime models

When migrating from earlier realtime models, treat the prompt as a behavior surface, not just text to port.

1. Use Codex or a strong reasoning model to restructure the prompt around the latest Realtime prompting guidance. Include a link to this prompting guide to ground the migration in best practices.
2. Set reasoning effort to `low` instead of the default. Increase only for workflows that require deeper planning.
3. Audit tool names, parameters, enums, JSON schemas, and other settings to make sure they match the expected implementation.
4. Remove stale examples. Add short examples for happy paths, ambiguity, interruptions, tool calls, and fallback behavior.
5. Compare representative conversations before and after migration. Check for regressions against an existing eval and document intentional behavior changes.
6. Run a final consistency pass. Confirm the prompt clearly separates hard requirements, defaults, tool rules, safety rules, and fallback behavior.
7. Run evals, inspect representative failures, and iterate on the prompt until the target behaviors are reliable.

  

  


## Realtime 1.5 Prompting Guide

`gpt-realtime-1.5` is a speech-to-speech model in the Realtime API. The same `gpt-realtime` prompting guidance applies to this model.

Speech-to-speech systems are essential for enabling voice as a core AI interface. `gpt-realtime-1.5` supports robust, usable realtime voice agents that can handle mission-critical workflows at scale.

Compared with earlier realtime preview models, `gpt-realtime-1.5` delivers stronger instruction following, more reliable tool calling, better voice quality, and an overall smoother feel. These gains make it practical to move from chained approaches to true realtime experiences, cutting latency and producing responses that sound more natural and expressive.

Realtime models benefit from prompting techniques that wouldn't directly apply to text-based models. This prompting guide starts with a suggested prompt skeleton, then walks through each part with practical tips, small patterns you can copy, and examples you can adapt to your use case.

## General Tips

- **Iterate relentlessly**: Small wording changes can make or break behavior.
  - Example: For unclear audio instruction, we swapped “inaudible” → “unintelligible” which improved noisy input handling.
- **Prefer bullets over paragraphs**: Clear, short bullets outperform long paragraphs.
- **Guide with examples**: The model closely follows sample phrases.
- **Be precise**: Ambiguity or conflicting instructions = degraded performance similar to GPT-5.
- **Control language**: Pin output to a target language if you see unwanted language switching.
- **Reduce repetition**: Add a Variety rule to reduce robotic phrasing.
- **Use capitalized text for emphasis**: Capitalizing key rules makes them stand out and easier for the model to follow.
- **Convert non-text rules to text**: instead of writing "IF x > 3 THEN ESCALATE", write, "IF MORE THAN THREE FAILURES THEN ESCALATE".

## Prompt Structure

Organizing your prompt makes it easier for the model to understand context and stay consistent across turns. It also makes it easier for you to iterate and modify problematic sections.

- **What it does**: Use clear, labeled sections in your system prompt so the model can find and follow them. Keep each section focused on one thing.
- **How to adapt**: Add domain-specific sections (e.g., Compliance, Brand Policy). Remove sections you don’t need (e.g., Reference Pronunciations if not struggling with pronunciation).

Example

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

## Role and Objective

This section defines who the agent is and what “done” means. The examples show two different identities to demonstrate how tightly the model will adhere to role and objective when they’re explicit.

- **When to use**: The model is not taking on the persona, role, or task scope you need.
- **What it does**: Pins identity of the voice agent so that its responses are conditioned to that role description
- **How to adapt**: Modify the role based on your use case

#### Example (model takes on a specific accent)

```
# Role & Objective
You are a Quebecois French-speaking customer service bot. Your task is to answer the user's question.
```

Earlier realtime preview:



  `gpt-realtime-1.5`:



  #### Example (model takes on a character)

```
# Role & Objective
You are a high-energy game-show host guiding the caller to guess a secret number from 1 to 100 to win 1,000,000$.
```

Earlier realtime preview:



  `gpt-realtime-1.5`:



  `gpt-realtime-1.5` is able to enact the specified role more reliably than earlier realtime preview models.

## Personality and Tone

`gpt-realtime-1.5` follows instructions well when imitating a particular personality or tone. You can tailor the voice experience and delivery depending on what your use case expects.

- **When to use**: Responses feel flat, overly verbose, or inconsistent across turns.
- **What it does**: Sets voice, brevity, and pacing so replies sound natural and consistent.
- **How to adapt**: Tune warmth/formality and default length. For regulated domains, favor neutral precision. Add other subsections that are relevant to your use case.

#### Example

```
# Personality & Tone
## Personality
- Friendly, calm and approachable expert customer service assistant.

## Tone
- Warm, concise, confident, never fawning.

## Length
2–3 sentences per turn.
```

#### Example (multi-emotion)

```
# Personality & Tone
- Start your response very happy
- Midway, change to sad
- At the end change your mood to very angry
```

`gpt-realtime-1.5`:



  The model is able to adhere to the complex instructions and switch between three emotions throughout the audio response.

### Speed Instructions

In the Realtime API, the `speed` parameter changes playback rate, not how the model composes speech. To actually sound faster, add instructions that can guide the pacing.

- **When to use**: Users want faster speaking voice; playback speed (with speed parameter) alone doesn’t fix speaking style.
- **What it does**: Tunes speaking style (brevity, cadence) independent of client playback speed.
- **How to adapt**: Modify speed instruction to meet use case requirements.

#### Example

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

Earlier realtime preview:



  `gpt-realtime-1.5`:



  With explicit pacing instructions, `gpt-realtime-1.5` can produce a noticeably faster pace without sounding too hurried.

### Language Constraint

Language constraints ensure the model consistently responds in the intended language, even in challenging conditions like background noise or multilingual inputs.

- **When to use**: To prevent accidental language switching in multilingual or noisy environments.
- **What it does**: Locks output to the chosen language to prevent accidental language changes.
- **How to adapt**: Switch “English” to your target language; or add more complex instructions based on your use case.

#### Example (pinning to one language)

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

These are the responses after applying the instruction using `gpt-realtime-1.5`.

![lang constraint en](https://developers.openai.com/cookbook/assets/images/lang_constraint_en.png)

#### Example (model teaches a language)

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

These are the responses after applying the instruction using `gpt-realtime-1.5`.

![multi language](https://developers.openai.com/cookbook/assets/images/multi-language.png)

The model is able to code-switch from one language to another based on custom instructions.

### Reduce Repetition

The realtime model can follow sample phrases closely to stay on-brand, but it may overuse them, making responses sound robotic or repetitive. Adding a repetition rule helps maintain variety while preserving clarity and brand voice.

- **When to use**: Outputs recycle the same openings, fillers, or sentence patterns across turns or sessions.
- **What it does**: Adds a variety constraint—discourages repeated phrases, nudges synonyms and alternate sentence structures, and keeps required terms intact.
- **How to adapt**: Tune strictness (e.g., “don’t reuse the same opener more than once every N turns”), whitelist must-keep phrases (legal/compliance/brand), and allow tighter phrasing where consistency matters.

#### Example

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

These are the responses **before** applying the instruction using `gpt-realtime-1.5`. The model repeats the same confirmation: `Got it`.

![repeat before](https://developers.openai.com/cookbook/assets/images/repeat_before.png)

These are the responses **after** applying the instruction using `gpt-realtime-1.5`.

![repeat after](https://developers.openai.com/cookbook/assets/images/repeat_after.png)

Now the model is able to vary its responses and confirmation and not sound robotic.

## Reference Pronunciations

This section covers how to ensure the model pronounces important words, numbers, names, and terms correctly during spoken interactions.

- **When to use**: Brand names, technical terms, or locations are often mispronounced.
- **What it does**: Improves trust and clarity with phonetic hints.
- **How to adapt**: Keep to a short list; update as you hear errors.

#### Example

```
# Reference Pronunciations
When voicing these words, use the respective pronunciations:
- Pronounce “SQL” as “sequel.”
- Pronounce “PostgreSQL” as “post-gress.”
- Pronounce “Kyiv” as “KEE-iv.”
- Pronounce "Huawei" as “HWAH-way”
```

Earlier realtime preview:



  `gpt-realtime-1.5`:



  With the reference pronunciation instructions, `gpt-realtime-1.5` can correctly pronounce SQL as "sequel."

### Alphanumeric Pronunciations

Realtime S2S can blur or merge digits/letters when reading back key info (phone, credit card, order IDs). Explicit character-by-character confirmation prevents mishearing and drives clearer synthesis.

- **When to use**: If the model struggles to capture or read back phone numbers, card numbers, 2FA codes, order IDs, serials, addresses, unit numbers, or mixed alphanumeric strings.
- **What it does**: Forces the model to speak one character at a time with separators, then confirm with the user and reconfirm after corrections. Optionally uses a phonetic disambiguator for letters (e.g., “A as in Alpha”).

#### Example (general instruction section)

```
# Instructions/Rules
- When reading numbers or codes, speak each character separately, separated by hyphens (e.g., 4-1-5).
- Repeat EXACTLY the provided number; do not omit any digits.
```

_Tip: If you are following a conversation flow prompting strategy, you can specify which conversation state needs to apply the alpha-numeric pronunciations instruction._

#### Example (instruction in conversation state)

_(taken from the conversation flow of the prompt of our [openai-realtime-agents](https://github.com/openai/openai-realtime-agents/blob/main/src/app/agentConfigs/customerServiceRetail/authentication.ts))_

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

These are the responses **before** applying the instruction using `gpt-realtime-1.5`.

> Sure! The number is 55119765423. Let me know if you need anything else!

These are the responses **after** applying the instruction using `gpt-realtime-1.5`.

> Sure! The number is: 5-5-1-1-1-9-7-6-5-4-2-3. Please let me know if you need anything else!

## Instructions

This section covers prompt guidance for instructing your model to solve your task, apply best practices, and fix possible problems.

Perhaps unsurprisingly, we recommend prompting patterns that are similar to [GPT-4.1 for best results](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide).

### Instruction Following

Like GPT-4.1 and GPT-5, if the instructions are conflicting, ambiguous, or unclear, `gpt-realtime-1.5` will perform worse.

- **When to use**: Outputs drift from rules, skip phases, or misuse tools.
- **What it does**: Uses an LLM to point out ambiguity, conflicts, and missing definitions before you ship.

#### **Instructions Quality Prompt (can be used in ChatGPT or with API)**

Use the following prompt with GPT-5 to identify problematic areas in your prompt that you can fix.

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

#### **Prompt Optimization Meta Prompt (can be used in ChatGPT or with API)**

This meta-prompt helps you improve your base system prompt by targeting a specific failure mode. Provide the current prompt and describe the issue you’re seeing, the model (GPT-5) will suggest refined variants that tighten constraints and reduce the problem.

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

### No Audio or Unclear Audio

Sometimes the model thinks it hears something and tries to respond. You can add a custom instruction telling the model how to behave when it hears unclear audio or user input. Modify the desired behavior to fit your use case. For example, you may want the model to repeat the same question instead of asking for clarification.

- **When to use**: Background noise, partial words, or silence trigger unwanted replies.
- **What it does**: Stops spurious responses and creates graceful clarification.
- **How to adapt**: Choose whether to ask for clarification or repeat the last question depending on use case.

#### Example (coughing and unclear audio)

```
# Instructions/Rules
...


## Unclear audio
- Always respond in the same language the user is speaking in, if unintelligible.
- Only respond to clear audio or text.
- If the user's audio is not clear (e.g. ambiguous input/background noise/silent/unintelligible) or if you did not fully hear or understand the user, ask for clarification using {preferred_language} phrases.
```

These are the responses **after** applying the instruction using `gpt-realtime-1.5`.



  In this example, the model asks for clarification after my _(very)_ loud cough and unclear audio.

### Background Music or Sounds

Occasionally, the model may generate unintended background music, humming, rhythmic noises, or sound-like artifacts during speech generation. These artifacts can diminish clarity, distract users, or make the assistant feel less professional. The following instructions help prevent or significantly reduce these occurrences.

- **When to use**: Use when you observe unintended musical elements or sound effects in Realtime audio responses.
- **What it does**: Steers the model to avoid generating these unwanted audio artifacts.
- **How to adapt**: Adjust the instruction to try to explicitly suppress the specific sound patterns you are encountering.

#### Example

```
# Instructions/Rules
...
- Do not include any sound effects or onomatopoeic expressions in your responses.
```

## Tools

Use this section to tell the model how to use your functions and tools. Spell out when and when not to call a tool, which arguments to collect, what to say while a call is running, and how to handle errors or partial results.

### Tool Selection

`gpt-realtime-1.5` follows instructions closely. However, if you have instructions that conflict with what the model can access, such as mentioning tools in your prompt that are NOT passed in the tools list, it can lead to bad responses.

- **When to use**: Prompts mention tools that aren’t actually available.
- **What it does**: Reviews the available tools and system prompt to ensure they align.

#### Example

```
# Tools
## lookup_account(email_or_phone)
...


## check_outage(address)
...
```

We need to ensure the same tools are available and **the descriptions do not contradict each other**:

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

### Tool Call Preambles

Some use cases could benefit from the Realtime model providing an audio response at the same time as calling a tool. This leads to a better user experience, masking latency. You can modify the sample phrase to fit your use case.

- **When to use**: Users need immediate confirmation at the same time as a tool call; helps mask latency.
- **What it does**: Adds a short, consistent preamble before a tool call.

#### Example

```
# Tools
- Before any tool call, say one short line like “I’m checking that now.” Then call the tool immediately.
```

These are the responses after applying the instruction using `gpt-realtime-1.5`.

![tool proactive](https://developers.openai.com/cookbook/assets/images/tool_proactive.png)

Using the instruction, the model outputs an audio response "I'm checking that right now" at the same time as the tool call.

#### Tool Call Preambles + Sample Phrases

If you want to control more closely what type of phrases the model outputs at the same time it calls a tool, you can add sample phrases in the tool spec description.

#### Example

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


### Tool Calls Without Confirmation

Sometimes the model might ask for confirmation before a tool call. For some use cases, this can lead to poor experience for the end user since the model is not being proactive.

- **When to use**: The agent asks for permission before obvious tool calls.
- **What it does**: Removes unnecessary confirmation loops.

#### Example

```
# Tools
- When calling a tool, do not ask for any user confirmation. Be proactive
```

These are the responses **after** applying the instruction using `gpt-realtime-1.5`.

![tool no confirm](https://developers.openai.com/cookbook/assets/images/tool_no_confirm.png)

In the example, you notice that the realtime model did not produce any response audio; it directly called the respective tool.

_Tip: If you notice the model is jumping too quickly to call a tool, try softening the wording. For example, swapping out stronger terms like “proactive” with something gentler can help guide the model to take a calmer, less eager approach._

### Tool Call Performance

As use cases grow more complex and the number of available tools increases, it becomes critical to explicitly guide the model on when to use each tool and just as importantly, when not to. Clear usage rules not only improve tool call accuracy but also help the model choose the right tool at the right time.

- **When to use**: Model is struggling with tool call performance and needs the instructions to be explicit to reduce misuse.
- **What it does**: Add instructions on when to “use/avoid” each tool. You can also add instructions on sequences of tool calls (after Tool call A, you can call Tool call B or C)

#### Example

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

_Tip: If a tool call can fail unpredictably, add clear failure-handling instructions so the model responds gracefully._

### Tool Level Behavior

You can fine-tune how the model behaves for specific tools instead of applying one global rule. For example, you may want READ tools to be called proactively, while WRITE tools require explicit confirmation.

- **When to use**: Global instructions for proactiveness, confirmation, or preambles don’t suit every tool.
- **What it does**: Adds per-tool behavior rules that define whether the model should call the tool immediately, confirm first, or speak a preamble before the call.

#### Example

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

### Tool Output Formatting

Some tool outputs, especially long strings that must be repeated verbatim, can be out-of-distribution for the model. During training, tool outputs commonly look like JSON objects with named fields. If your tool returns a raw string and separately asks the model to “repeat exactly,” the model may be more prone to paraphrasing, truncation, or blending in its own preamble.

A practical fix is to make the tool output look like a normal tool result and make the verbatim requirement machine-explicit.

- **When to use:** A tool returns **long or complex structured content** (multi-sentence instructions, handoff packets, IDs/links, policy summaries, multi-step procedures, etc.) and you observe **truncation, paraphrasing, dropped fields, reordering, or the model blending in its own preamble/commentary**.

- **What it does:** Wraps the tool output in a **small, explicit JSON envelope** (e.g., `response_text` plus flags like `require_repeat_verbatim`, `format`, or `content_type`) so the response looks more **in-distribution** and the expected realization behavior is **machine-clear**.

- **How to adapt:** Keep the schema **minimal and stable**. Clearly document the expected tool output shape in both your **Tools instructions** and next to the **tool definition** (e.g., “If `require_repeat_verbatim` is true, output exactly `response_text` and nothing else,” or “Render `response_text` as-is; do not add, omit, or reorder fields from the tool output.”).

#### Examples

#### Example: raw string (more error-prone)

Tool returns:

```text
I just sent you an email with the verification link. Please open it and click “Confirm”.
```

Model sometimes says:

- “I’ve emailed you a verification link…” (paraphrase)

- Drops the last sentence (truncation)

- Adds extra commentary (“Can I help with anything else?”)

#### Example: wrapped JSON (more in-distribution, more reliable)

Tool returns:

```json
{
  "response_text": "I just sent you an email with the verification link. Please open it and click “Confirm”.",
  "require_repeat_verbatim": true
}
```

Because this looks like a typical tool result (JSON object), the model generally has an easier time:

- recognizing what the “authoritative” content is (response_text)

- understanding the realization constraint (require_repeat_verbatim)

- reproducing the tool output cleanly, without truncation or extra commentary

### Rephrase Supervisor Tool (Responder-Thinker Architecture)

In many voice setups, the realtime model acts as the responder (speaks to the user) while a stronger text model acts as the thinker (does planning, policy lookups, SOP completion). Text replies are not automatically good for speech, so the responder must rephrase the thinker’s text into an audio-friendly response before generating audio.

- **When to use**: When the responder’s spoken output sounds robotic, too long, or awkward after receiving a thinker response.
- **What it does**: Adds clear instructions that guide the responder to rephrase the thinker’s text into a short, natural, speech-first reply.
- **How to adapt**: Tweak phrasing style, openers, and brevity limits to match your use case expectations.

#### Example

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

Here’s an example without the rephrasing instruction:

> Assistant: Your current credit card balance is positive at 32,323,232 AUD.

Here’s the same example with the rephrasing instruction:

> Assistant: Just finished checking that—your credit card balance is thirty-two million three hundred twenty-three thousand two hundred thirty-two dollars in your favor. Your last payment was processed on August first. Does that match what you expected?

### Common Tools

`gpt-realtime-1.5` has been trained to effectively use the following common tools. If your use case needs similar behavior, keep the names, signatures, and descriptions close to these to maximize reliability and to be more in-distribution.

Below are some of the important common tools that the model has been trained on:

#### Example

```
# answer(question: string)
Description: Call this when the customer asks a question that you don't have an answer to or asks to perform an action.


# escalate_to_human()
Description: Call this when a customer asks for escalation, or to talk to someone else, or expresses dissatisfaction with the call.


# finish_session()
Description: Call this when a customer says they're done with the session or doesn't want to continue. If it's ambiguous, confirm with the customer before calling.
```

## Conversation Flow

This section covers how to structure the dialogue into clear, goal-driven phases so the model knows exactly what to do at each step. It defines the purpose of each phase, the instructions for moving through it, and the concrete “exit criteria” for transitioning to the next. This prevents the model from stalling, skipping steps, or jumping ahead, and ensures the conversation stays organized from greeting to resolution.

As well, by organizing your prompt into various conversation states, it becomes easier to identify error modes and iterate more effectively.

- **When to use**: If conversations feel disorganized, stall before reaching the goal, or the model struggles to effectively complete the objective.
- **What it does**: Breaks the interaction into phases with clear goals, instructions and exit criteria.
- **How to adapt**: Rename phases to match your workflow; modify instructions for each phase to follow your intended behavior; keep “Exit when” concrete and minimal.

#### Example

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

### Sample Phrases

Sample phrases act as “anchor examples” for the model. They show the style, brevity, and tone you want it to follow, without locking it into one rigid response.

- **When to use**: Responses lack your brand style or are not consistent.
- **What it does**: Provides sample phrases the model can vary to stay natural and brief.
- **How to adapt**: Swap examples for brand-fit; keep the “do not always use” warning.

#### Example

```
# Sample Phrases
- Below are sample examples that you should use for inspiration. DO NOT ALWAYS USE THESE EXAMPLES, VARY YOUR RESPONSES.

Acknowledgements: “On it.” “One moment.” “Good question.”
Clarifiers: “Do you want A or B?” “What’s the deadline?”
Bridges: “Here’s the quick plan.” “Let’s keep it simple.”
Empathy (brief): “That’s frustrating—let’s fix it.”
Closers: “Anything else before we wrap?” “Happy to help next time.”
```

_Note: If your voice system ends up consistently only repeating the sample phrases, leading to a more robotic voice experience, try adding the Variety constraint. We’ve seen this fix the issue._

### Conversation flow + Sample Phrases

It is a useful pattern to add sample phrases in the different conversation flow states to teach the model what a good response looks like:

#### Example

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

### Advanced Conversation Flow

As use cases grow more complex, you’ll need a structure that scales while keeping the model effective. The key is balancing maintainability with simplicity: too many rigid states can overload the model, hurting performance and making conversations feel robotic.

A better approach is to design flows that reduce the model’s perceived complexity. By handling state in a structured but flexible way, you make it easier for the model to stay focused and responsive, which improves user experience.

Two common patterns for managing complex scenarios are:

1. Conversation Flow as State Machine
2. Dynamic Conversation Flow via session.updates

#### Conversation Flow as State Machine

Define your conversation as a JSON structure that encodes both states and transitions. This makes it easy to reason about coverage, identify edge cases, and track changes over time. Since it’s stored as code, you can version, diff, and extend it as your flow evolves. A state machine also gives you fine-grained control over exactly how and when the conversation moves from one state to another.

#### Example

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

#### Dynamic Conversation Flow

In this pattern, the conversation adapts in real time by updating the system prompt and tool list based on the current state. Instead of exposing the model to all possible rules and tools at once, you only provide what’s relevant to the active phase of the conversation.

When the end conditions for a state are met, you use session.update to transition, replacing the prompt and tools with those needed for the next phase.

This approach reduces the model’s cognitive load, making it easier for it to handle complex tasks without being distracted by unnecessary context.

#### Example

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


## Safety & Escalation

Often with Realtime voice agents, having a reliable way to escalate to a human is important. In this section, you should modify the instructions on WHEN to escalate depending on your use case.

- **When to use**: Model is struggling to determine when to properly escalate to a human or fallback system
- **What it does**: Defines fast, reliable escalation and what to say.
- **How to adapt**: Insert your own thresholds and what the model has to say.

#### Example

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

The first example shows conversation responses from `gpt-4o-realtime-preview-2025-06-03` using the instruction.

![escalate 06](https://developers.openai.com/cookbook/assets/images/escalate_06.png)

The second example shows conversation responses from `gpt-realtime-1.5` using the instruction.

![escalate 07](https://developers.openai.com/cookbook/assets/images/escalate_07.png)

`gpt-realtime-1.5` is able to follow the instruction and escalate to a human more reliably.



## Next steps

- Review the earlier [Realtime prompting guide](https://developers.openai.com/cookbook/examples/realtime_prompting_guide) for more `gpt-realtime-1.5` examples.
- Review the [Realtime eval guide](https://developers.openai.com/cookbook/examples/realtime_eval_guide) to test representative voice-agent behavior.
- Learn how to connect with [WebRTC](https://developers.openai.com/api/docs/guides/realtime-webrtc), [WebSocket](https://developers.openai.com/api/docs/guides/realtime-websocket), or [SIP](https://developers.openai.com/api/docs/guides/realtime-sip).
- Learn the [Realtime conversation lifecycle](https://developers.openai.com/api/docs/guides/realtime-conversations).
- Review [Realtime costs](https://developers.openai.com/api/docs/guides/realtime-costs).