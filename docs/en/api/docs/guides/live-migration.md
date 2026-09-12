# Migrate to GPT-Live

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

GPT-Live handles the voice conversation while a backend handles task reasoning and tools. Keep your application logic, tool implementations, permissions, and durable state. The migration connects those responsibilities to the new voice interface.

This guide uses an appointment assistant: check availability, ask the user to confirm a slot, then book it. Start with a connected session from [Getting started](https://developers.openai.com/api/docs/guides/live), and keep representative conversations from your existing application for comparison.

## Before you migrate

Record the requirements your migrated application must preserve:

- **Tools and business rules:** List your existing prompts, tools, and workflows, including the conditions for each action.
- **Input types:** Identify where audio, typed text, and images enter your application and which backend needs them. See [Add images and visual context](https://developers.openai.com/api/docs/guides/live-delegation#add-images-and-visual-context).
- **Decisions that depend on audio:** Identify decisions that need the original sound, beyond the words in a transcript. See [Preserve decisions that depend on audio](https://developers.openai.com/api/docs/guides/live-migration?migration-path=realtime#preserve-decisions-that-depend-on-audio).
- **Speech and playback:** Specify when speech may start, when it must stop, and which checks must finish before audio plays.
- **Permissions and guardrails:** List authorization, confirmation, and input/output checks, and where your application enforces them. See [Adapt your guardrails](#adapt-your-guardrails).
- **Durable state:** Identify the records, task progress, and pending actions your application must keep across disconnects and new sessions.
- **Baseline conversations:** Save representative conversations and their starting state, expected tool actions, final application state, and spoken responses from your current application.

Use [Getting started](https://developers.openai.com/api/docs/guides/live) for session setup and the [voice agent evaluation Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) to plan your comparison.

## Choose your delegation mode

Your existing architecture is a useful starting point:

- **Responses delegation** fits a Realtime app where the model selects functions and your application executes them. A hosted Responses model takes over task reasoning and tool selection.
- **Client delegation** fits an existing text agent or orchestrator. Your application supplies context, invokes that backend, and returns results to GPT-Live.

Either migration path can use either mode. For example, a Realtime app that already has a separate backend agent may keep it with client delegation. Also consider how much control you need over backend context, execution, and reviewing results before they reach GPT-Live. See [Choose a delegation mode](https://developers.openai.com/api/docs/guides/live-delegation#choose-a-delegation-mode) for the full comparison.

## Choose your migration path

Select the path that matches the application you have today.



## From Realtime API

Start with the [GPT-Live prompting guide](https://developers.openai.com/api/docs/guides/live-prompting). Split your existing prompt between the voice model and the backend instead of copying it wholesale into `session.instructions`. Keep conversation style and delegation guidance in the voice prompt; move detailed workflows and tool-use instructions to the backend.

**Before:** the Realtime model handles speech and selects functions such as `check_availability` and `book_appointment`. Your application executes the functions and returns their results.

**After:** GPT-Live handles speech and delegates task work. The backend selects the same functions; your application still validates and executes them. The steps here use Responses delegation. If you retain an external agent, use the [client adapter](https://developers.openai.com/api/docs/guides/live-migration?migration-path=text-agent#connect-your-existing-agent) instead.

### How Responses delegation works

Configure the backend model, instructions, and tools in `delegation.responses`. When GPT-Live decides a request needs backend work, the Live service calls that Responses model and supplies relevant conversation context. The backend reasons about the task and selects tools. Your application still runs custom functions, enforces permissions, and returns their results.

For the appointment assistant:

1. The user asks which appointments are available on Friday, and GPT-Live delegates the request.
2. The Responses backend requests `check_availability`.
3. Your application runs the function, returns its result, and continues the backend response.
4. GPT-Live uses the answer from the backend to discuss available slots with the user.

GPT-Live can keep the conversation going while backend work runs. Finishing that work does not mean the assistant has finished speaking. See [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation) for configuration and the full event flow.

### Preserve decisions that depend on audio

Check whether existing tool decisions depend on acoustic evidence, such as a voicemail beep or a recorded greeting's cadence. GPT-Live hears the incoming audio, but its voice frontend delegates work instead of issuing ordinary structured function calls. In client mode, `session.delegation.created` carries metadata and timing, without raw audio, task text, or parsed tool arguments. A delegated backend does not automatically receive the waveform.

For answering-machine detection, explicitly route incoming audio to an audio-capable detector. One application-managed architecture to evaluate runs a separate Realtime session alongside GPT-Live for part of the call:

1. Send a copy of the incoming call audio to both sessions.
2. Have the detector report its classification through a structured function call. Check each result against your schema, reject stale results, and keep an unknown state when evidence is insufficient. Allow later evidence to revise the decision.
3. Send relevant trusted context to GPT-Live, and apply your application's policy to outgoing audio playback.

Keep human or machine classification separate from recording readiness. Recognizing voicemail does not establish that the greeting and beep have finished or that recording can begin. A classifier result or context acknowledgment also does not establish permission to play audio. Use [Adapt your guardrails](#adapt-your-guardrails) and the [playback controls](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed) to enforce that decision in the audio path your application controls.

Test a short “hello” that develops into a voicemail greeting, call-screening prompts, and a person picking up during voicemail. If you stop the detector before the call ends, test later human pickup after it stops. Choose when to stop the detector based on these tests and its added cost. The first human classification alone does not establish that further detection is unnecessary.

### Adapt the connection and audio lifecycle

Replace Realtime session setup with the [GPT-Live connection procedure](https://developers.openai.com/api/docs/guides/live). Recheck your transport's startup and audio format. WebRTC carries audio on media tracks and JSON events on the data channel. A primary WebSocket carries audio in JSON events.

If your Realtime application uses a server connection to monitor the call or enforce guardrails, adapt it to the [GPT-Live sideband connection](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#attach-to-the-existing-session). Follow [Adapt your guardrails](#adapt-your-guardrails) for the changes to conversation checks and playback.

| Existing Realtime behavior                                                                            | GPT-Live adaptation                                                                                             |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Send WebSocket audio with `input_audio_buffer.append`.                                                | Send `session.input_audio.append`; its `audio` field contains base64 raw audio.                                 |
| Play `response.output_audio.delta` from its `delta` field.                                            | Play `session.output_audio.delta` from its `delta` field, in order.                                             |
| Commit audio or create a response to start a turn when using manual turn control.                     | Stream audio continuously. GPT-Live decides when to speak; remove manual audio commits and voice-turn triggers. |
| Track audio generation and response completion with `response.output_audio.done` and `response.done`. | GPT-Live has no corresponding event marking the end of each spoken response. Track playback in your client.     |
| Display user captions from input transcription events.                                                | Append `session.input_transcript.delta` text to the user's captions.                                            |
| Display assistant captions from `response.output_audio_transcript.delta`.                             | Append `session.output_transcript.delta` text to the assistant's captions.                                      |

**Generation and playback:** In Realtime, `response.output_audio.done` marks the end of audio generation, while `response.done` marks the end of the response stream. These events can also occur when a response is interrupted or unsuccessful; check `response.status` in `response.done`. Neither confirms that buffered audio has finished playing. For example, the server can finish generating while the client still has a second of audio to play. Drive a "speaking" indicator from playback state.

**Captions:** Input transcription represents the user's speech; output transcription represents the assistant's generated speech. When input transcription is enabled, Realtime sends updates through `conversation.item.input_audio_transcription.delta` and a final transcript through `conversation.item.input_audio_transcription.completed`. A `delta` is a new text fragment. In GPT-Live, append each fragment to the corresponding speaker's captions independently because listening and speaking can overlap. A fragment is not a complete turn or confirmation of playback. See [Display captions](https://developers.openai.com/api/docs/guides/live-conversations#display-captions) for a display recipe.

In GPT-Live, `response.create` starts or continues delegated Responses work. It does not grant permission for the voice model to speak. For startup, greetings, interruptions, and closing a session, follow [Managing sessions](https://developers.openai.com/api/docs/guides/live-conversations).

### Split conversation and backend instructions

Move conversation style and delegation guidance into `session.instructions`. Move business rules and tool-use instructions into `delegation.responses.instructions`. For a backend you run yourself, keep those rules in its existing prompt.

**Before: one Realtime prompt**

```text
Help callers book appointments. Speak briefly. Check availability with the tool,
ask the caller to confirm a slot, then book it. Never claim an unverified booking.
```

**After: GPT-Live conversation instructions**

```text
Help callers book appointments. Keep spoken replies brief. Delegate availability
checks and booking requests. Ask the caller to confirm the proposed slot.
Only announce a booking when the backend reports that it succeeded.
```

**After: backend instructions**

```text
Use the appointment tools to check current availability. Before booking, verify
that the caller confirmed the exact slot and still has permission to book it.
Apply the latest correction. Return verified availability, booking, or failure
status with the date, time, and time zone.
```

Enforce confirmation and permission checks in your application before executing a tool. Prompt instructions guide the models; they do not enforce those checks. See [Prompting voice models](https://developers.openai.com/api/docs/guides/live-prompting) for prompt design.

### Adapt your function handlers

Keep the implementation of `check_availability` and `book_appointment`. Move their definitions from Realtime's `session.tools` or `response.tools` to `delegation.responses.tools`, using the Responses function schema. Move tool-selection settings to `delegation.responses.tool_choice` and `delegation.responses.parallel_tool_calls`. See [Configure Responses delegation](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation).

The function still returns a result for its original `call_id`. What changes is where your handler receives the call and sends the result:

| Step                                 | Realtime API                                                                     | GPT-Live with Responses delegation                                                                                |
| ------------------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Receive the completed function call. | Read `response.output_item.done`.                                                | Unwrap `response.event`, then read its inner `response.output_item.done`.                                         |
| Identify and execute the operation.  | Read the item's `name`, `arguments`, and `call_id`; run your authorized handler. | Keep that handler and its checks. Preserve the outer `delegation_id` and backend response ID in your application. |
| Return each function result.         | Send `conversation.item.create`.                                                 | Send `response.item.create`.                                                                                      |
| Continue after all required results. | Send `response.create`.                                                          | Send `response.create` to continue backend work.                                                                  |

For example, after `check_availability` returns one verified slot, your result changes as follows. These are messages on an already-connected session; `call_availability` stands for the actual call ID you received.

**Before: Realtime result**

```json
{
  "type": "conversation.item.create",
  "item": {
    "type": "function_call_output",
    "call_id": "call_availability",
    "output": "{\"available\":true,\"slot_id\":\"slot_friday_14\",\"booked\":false}"
  }
}
```

**After: GPT-Live result**

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "response.item.create",
    event_id: "availability_result_1",
    item: {
      type: "function_call_output",
      call_id: "call_availability",
      output: '{"available":true,"slot_id":"slot_friday_14","booked":false}',
    },
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection
from openai.types.responses.response_input_item_param import ResponseInputItemParam


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    item: ResponseInputItemParam = {
        "type": "function_call_output",
        "call_id": "call_availability",
        "output": '{"available":true,"slot_id":"slot_friday_14","booked":false}',
    }
    await connection.response.item.create(
        event_id="availability_result_1",
        item=item,
    )
```


After submitting every required function result, continue the backend:

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "response.create",
    event_id: "continue_availability_1",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.response.create(
        event_id="continue_availability_1",
    )
```


For the initial migration, setting `parallel_tool_calls` to `false` simplifies result handling. Collect calls from completed output-item events even if a terminal lifecycle snapshot has `output: []`. An arguments-done event alone does not supply the function name and `call_id`. Follow the complete [function-result procedure](https://developers.openai.com/api/docs/guides/live-delegation#complete-a-client-actionable-function-call) for collection, output submission, and errors.

### Preserve context and apply corrections

Responses delegation supplies relevant voice conversation context to the backend. Keep the authoritative appointment state in your application: selected slot, confirmed slot, permissions, active operation, and outcome. Live conversation history can be compacted; it is not your booking record.

If the user says “Actually, Friday instead” while a Thursday lookup is pending, update the task's revision and invalidate the earlier slot confirmation. Before executing a booking, check that its arguments still match the current task and confirmation. Return an accurate superseded or cancelled result for any pending function call your application declines, then complete the required output batch before continuing. If a booking already succeeded, reconcile that result and the requested change before taking another action.

Transcript fragments can arrive late or overlap with assistant speech. Append each `delta` exactly as received and use `start_ms` and `end_ms` to group the display. These timestamps are not definitive turn boundaries or word-level playback timestamps. Clarify important dates, names, and numbers when intent is uncertain. See [Managing sessions](https://developers.openai.com/api/docs/guides/live-conversations) for transcript and context handling.

**Images and screen context:** If your Realtime application accepts images, route them to a vision-capable backend and return relevant text to GPT-Live. Both client and Responses delegation support this pattern. See [Add images and visual context](https://developers.openai.com/api/docs/guides/live-delegation#add-images-and-visual-context).

  


  


## From a text agent or chained pipeline

**Before:** a text agent receives written requests and uses its tools and saved state. A chained, or cascaded, voice pipeline adds speech-to-text before that agent and text-to-speech after it.

**After:** GPT-Live provides the voice interface and delegates task work to your existing agent. For a chained pipeline, it replaces the separate speech-to-text and text-to-speech stages. Keep the models, instructions, tools, workflow, and durable state in your backend where they still fit the task.

### Connect your existing agent

Configure `delegation` as `{"type":"client"}` during [session setup](https://developers.openai.com/api/docs/guides/live). Your application receives a notification such as this:

```json
{
  "type": "session.delegation.created",
  "offset_ms": 1000,
  "delegation": {
    "id": "item_appointment_1",
    "type": "delegation",
    "target": "client"
  }
}
```

The notification contains metadata, not request text, tool arguments, or a complete transcript. Keep the actual `delegation.id` unchanged. Assemble the agent's input from recent role-labeled transcript fragments and verified application state, including the active task and latest correction. A delegation can arrive before a complete sentence appears in the transcript. If the available context does not establish the request, gather more context or ask for clarification before acting.

In a text application, you might pass the user's latest message directly to your agent. With GPT-Live, add an adapter that supplies that context and returns a concise, verified result:

Connect a client delegation to your agent

```javascript
async function handleDelegation(event, app) {
  if (
    event.type !== "session.delegation.created" ||
    event.delegation?.target !== "client"
  )
    return;

  const context = app.readContext();
  if (!context) return; // Retain the notice; resolve the request before acting.

  const summary = await app.runAgent({
    revision: context.revision,
    recentConversation: context.recentConversation,
    task: context.task,
  });

  if (app.currentRevision() !== context.revision) return;

  app.send({
    type: "session.commentary.append",
    event_id: crypto.randomUUID(),
    delegation_id: event.delegation.id,
    content: summary,
  });
}
```

```python
from collections.abc import Awaitable, Callable
from dataclasses import dataclass
from uuid import uuid4

from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection
from openai.types.live.server_event import ServerEvent


@dataclass(frozen=True)
class Context:
    revision: int
    recent_conversation: str
    task: str


async def handle_delegation(
    event: ServerEvent,
    connection: AsyncLiveConnection | AsyncSidebandConnection,
    *,
    read_context: Callable[[], Context | None],
    run_agent: Callable[[Context], Awaitable[str]],
    current_revision: Callable[[], int],
) -> None:
    if (
        event.type != "session.delegation.created"
        or event.delegation.target != "client"
    ):
        return
    context = read_context()
    if context is None:
        return  # Retain the notice; resolve the request before acting.
    summary = await run_agent(context)
    if current_revision() != context.revision:
        return
    await connection.session.commentary.append(
        event_id=str(uuid4()),
        delegation_id=event.delegation.id,
        content=summary,
    )
```


The adapter uses application callbacks to read context, run your agent, and check the current task revision; these aren't SDK methods. The context callback returns a ready snapshot containing recent conversation and the current task, or no snapshot when the request remains unclear. The agent callback invokes your existing agent and returns a verified summary of at most 500 tokens. In JavaScript, the application-provided `send` callback sends the JSON event on your Live connection. In Python, the adapter sends the update through the SDK `connection` directly.

If context is not ready, retain the notification and invoke the adapter again after resolving the request. Before invoking this adapter, claim the delegation in your application so duplicate delivery cannot start the same operation twice. Keep authorization, confirmation, operation IDs, and retry decisions in your backend. The revision check prevents this adapter from announcing an outdated result; the backend must also check the current revision before a side effect such as booking.

For the appointment assistant, the context should establish the requested date and time zone, previously offered slots, any confirmed slot, and the latest correction. An availability result should say that a slot is available and that no booking has been made. Only return a booking confirmation after the booking succeeds. See [Client delegation](https://developers.openai.com/api/docs/guides/live-delegation#receive-a-client-delegation) for the full setup and result flow.

### Route updates and corrections

Keep structured tool output and workflow details in your backend. Return short factual updates to GPT-Live:

- Use `session.thinking.append` for background progress, such as a lookup that is still running.
- Use `session.commentary.append` for a verified result the user should hear.
- Use `session.instructions.append` for application-authored behavioral guidance.

All three take plain-string `content` of at most 500 tokens and require `delegation_id`. Use the original client delegation ID for related work or `null` for general session context. Match append acknowledgments through `client_event_id`. Acceptance does not establish speech or playback. See [Send the right kind of update](https://developers.openai.com/api/docs/guides/live-delegation#send-the-right-kind-of-update).

When the user says “Actually, Friday instead,” update the active task and its revision, invalidate any Thursday confirmation, and direct the existing agent to the corrected request. Decide whether to cancel, change, or let the pending lookup finish. Discard an outdated result before returning it to GPT-Live. An interruption in speech does not cancel a backend operation, and a cancellation request does not prove that an action was cancelled.

Backend work may outlive the voice session. Persist its status in your application. In a later voice interaction, start a new session with the relevant saved context; see [Managing sessions](https://developers.openai.com/api/docs/guides/live-conversations).

### Adapt text and speech safeguards

A text agent can finish and validate a reply before displaying it. A chained pipeline may validate the complete reply before sending it to text-to-speech. GPT-Live can speak while backend work is still running, so withholding a tool result or backend continuation does not hold all speech.

Follow [Adapt your guardrails](#adapt-your-guardrails) to retain your checks and account for continuous speech.

Keep typed input connected to your existing backend. Treat a typed correction as an update to the same task, and send relevant verified context to the voice session. See [Accept typed input](https://developers.openai.com/api/docs/guides/live-delegation#accept-typed-input) and [Keep updates accurate and useful](https://developers.openai.com/api/docs/guides/live-delegation#keep-updates-accurate-and-useful).



## Adapt your guardrails

Keep the input and output safeguards from your existing application when migrating from either architecture. GPT-Live can continue speaking while backend work and policy checks run, so apply checks to both the conversation and the actions your backend takes.

Use a [sideband WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) when your server needs independent access to a browser-owned session. Your server can receive transcripts and send corrective instructions while audio stays on WebRTC. If it already owns the primary WebSocket, use that event stream; Responses delegation does not require an additional sideband.

1. Monitor user and assistant transcript events and run your checks alongside the conversation.
2. Block affected tools and external actions in application code. Cancel related application-owned work where supported, and prevent late results from continuing a blocked request.
3. Send `session.instructions.append` to redirect the assistant, and record the decision in your application.

For example, if a caller asks the appointment assistant to change another person's booking without permission, block the booking operation before it runs. Then instruct the assistant to explain that it cannot make the change. Verify both the unchanged booking record and the spoken response; the refusal alone does not enforce authorization.

A corrective instruction cannot retract audio already heard. If checks must finish before playback, add buffering and approval to the audio path your application controls and account for the added latency. Follow [Apply conversation guardrails](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) for the complete flow, a corrective instruction example, and playback controls. For required opening wording, see [Deliver a disclosure](https://developers.openai.com/api/docs/guides/live-conversations#deliver-a-disclosure).

## Validate the migration

Compare the migrated assistant with representative conversations from your current application. Keep the scenarios, backend tools, and success criteria consistent, repeat each scenario, and record intentional behavior changes alongside regressions:

- **Actions and spoken confirmations:** Check availability, ask for confirmation, and book only the confirmed slot. Verify the backend outcome, spoken answer, and client playback separately.
- **Corrections and duplicate prevention:** Change Thursday to Friday during a pending request. Discard outdated results and ensure retries cannot create a second booking.
- **Permissions:** Try an unauthorized action and a booking without confirmation. Check that application policy blocks execution.
- **Guardrail interventions:** Trigger a check during speech and during tool execution. Verify corrective speech, blocked actions, late-result handling, and playback recovery. Include slow checks and false positives.
- **Interruptions:** Speak while the assistant is talking or working. Verify the conversation, audio playback, and backend task state independently.
- **Failures and reconnects:** Exercise tool errors, lost results, and disconnects. Reconcile uncertain outcomes before retrying, and restore relevant saved context in a new session.

Use [Reduce backend latency](https://developers.openai.com/api/docs/guides/live-delegation#reduce-backend-latency) to tune the migrated backend. Compare useful spoken response time and task success with the [voice agent evaluation Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation), and use [Cost optimization](https://developers.openai.com/api/docs/guides/voice-latency-cost) to compare usage and cost.