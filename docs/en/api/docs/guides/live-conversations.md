# Managing GPT-Live sessions

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

After [connecting to GPT-Live](https://developers.openai.com/api/docs/guides/live), use session events to add context, display transcripts, and manage the connection. GPT-Live can listen and speak at the same time. Track transcript text, played audio, and backend task progress separately so your interface can show what the assistant is saying and what work is still running.

This guide assumes your connection has emitted `session.started`. See [Connections](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live) for connection setup and audio streaming, and [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation) for backend work.





## Configure a session

Choose the model, voice, and delegation mode when you create the session. Give the model instructions for the conversation and include relevant history. GPT-Live manages context automatically as the conversation grows.

### Configuration fields

| Setting      | Configure at startup                                                                                | Change during the session                            |
| ------------ | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Model        | Set the required `model`.                                                                           | Start a new session to change it.                    |
| Instructions | Set `instructions` for conversation behavior, up to 16,384 tokens.                                  | Add instructions with `session.instructions.append`. |
| History      | Set `input` to relevant prior text messages. It defaults to `[]`.                                   | Add context with append events.                      |
| Voice        | Set `audio.output.voice` to a supported voice or authorized custom voice. The default is `marin`.   | Start a new session to change it.                    |
| Delegation   | Set `delegation.type` to `client` or `responses`. Omitted or `null` delegation selects client mode. | Update Responses settings within the existing mode.  |
| Storage      | Set `store` to `true` to make the session available for forking. It defaults to `false`.            | Choose at startup.                                   |

### Voice options

Choose a voice when you create the session. Set `audio.output.voice` to the API name, such as `"quartz"`. GPT-Live includes these additional voice options:

| Voice    | API name   | Language   | Regional influence | Presentation | Source    |
| -------- | ---------- | ---------- | ------------------ | ------------ | --------- |
| Quartz   | `quartz`   | English    | Australian         | Feminine     | Generated |
| Ripple   | `ripple`   | English    | Australian         | Masculine    | Natural   |
| Vesper   | `vesper`   | English    | British            | Masculine    | Natural   |
| Willow   | `willow`   | English    | Irish              | Feminine     | Natural   |
| Stone    | `stone`    | English    | Irish              | Masculine    | Natural   |
| Gleam    | `gleam`    | English    | North American     | Feminine     | Natural   |
| Meridian | `meridian` | English    | North American     | Masculine    | Natural   |
| Bossa    | `bossa`    | Portuguese | Brazilian          | Feminine     | Natural   |
| Tempo    | `tempo`    | Portuguese | Brazilian          | Masculine    | Natural   |
| Beacon   | `beacon`   | English    | Filipino           | Masculine    | Generated |
| Delta    | `delta`    | English    | Southern U.S.      | Feminine     | Generated |
| Cinder   | `cinder`   | English    | Southern U.S.      | Masculine    | Generated |

Regional influence describes a voice’s speaking style. Test the voice with the languages and pronunciation your application needs. For an approved voice created from your own recording, see [Custom voices](https://developers.openai.com/api/docs/guides/custom-voices).





For WebSocket, choose `audio.format` at startup. The same format applies to input and output audio for the session. To use another format, start a new session. WebRTC negotiates its audio format during connection setup, so leave `audio.format` out of WebRTC requests. See [WebSocket audio formats](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) for supported formats and streaming details.

### Update a live session

Use `session.update` for changes to `session.delegation.responses` in a session already using Responses delegation. Send only the settings you want to change; omitted settings retain their values. See [Configure Responses delegation](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation) for the settings and update workflow.

Choose the delegation mode and the fields `model`, `instructions`, `input`, `audio`, and `store` at startup. Use `session.update` only for the supported Responses settings described above; other configuration fields are rejected. To switch delegation modes, create a new session. At startup, `delegation: null` selects client delegation rather than restoring default Responses settings.

A successful update emits `session.updated` with the resulting session configuration. Match it to your outgoing `event_id` through `client_event_id`. Handle [rejected commands](#handle-rejected-commands) in the same event loop. Track backend work and spoken output through their own events.

## Provide history and context

Use startup history to resume a topic, and append relevant context as the conversation continues. Keep trusted application instructions separate from user messages and factual results.

### Seed a session with prior conversation

Include prior text messages in `session.input` when you create the session. For example, add this `input` field to your [session creation configuration](https://developers.openai.com/api/docs/guides/live#connect-your-first-session):

```javascript
```

```python
from openai.types.live.session_config_param import SessionConfigParam

session: SessionConfigParam = {
    "model": "gpt-live-1",
    "input": [
        {
            "type": "message",
            "role": "user",
            "content": [
                {"type": "input_text", "text": "I need help with my recent order."}
            ],
        },
        {
            "type": "message",
            "role": "assistant",
            "content": [{"type": "output_text", "text": "What is the order number?"}],
        },
    ],
}
```


The list accepts up to 128 messages and 8,192 combined tokens. Each message has one text part and one of these roles: `developer`, `user`, or `assistant`. Developer and user messages use `input_text`; assistant messages use `text` or `output_text`. Put trusted application instructions in `instructions` or a developer message.

Select the text history needed for the next interaction and supply it at startup. During the session, add updates with the context events below. Send backend-specific items, such as tool results, through the [delegation workflow](https://developers.openai.com/api/docs/guides/live-delegation).

### Understand when context reaches the model

Put any context the model needs from the start in `input`; the full field is available when the session starts.

During a running session, `session.instructions.append`, `session.thinking.append`, and `session.commentary.append` add context over time. The acknowledgment arrives when the session timeline reaches the estimated end of the added context. Its `start_ms` and `end_ms` estimate where that update falls on the session timeline.

These times describe context delivery, not speech or playback. The model may still respond before it has used the whole update. When an action depends on a new instruction or fact, verify the resulting behavior in your application.

If the session timeline stops, the acknowledgment can remain pending. Match acknowledgments to the outgoing `event_id` through `client_event_id`, and keep handling errors while you wait. Closing the session returns errors for appends that are still pending.

### Add context during the conversation

Choose an event based on how the model should use the update:

- `session.instructions.append`: add trusted application instructions that influence behavior and speech.
- `session.thinking.append`: add factual context without asking the model to say it immediately.
- `session.commentary.append`: provide information for the model to say aloud, which it may paraphrase.

Each event takes plain-string `content` of up to 500 tokens and a required `delegation_id`. Use `null` for session-wide context. For example, send this after your application has verified the user's acceptance and started the lookup:

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.thinking.append",
    event_id: "context_1",
    delegation_id: null,
    content:
      "The user has already accepted the terms. The account lookup is still running.",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.thinking.append(
        event_id="context_1",
        delegation_id=None,
        content=(
            "The user has already accepted the terms. The account lookup is still "
            "running."
        ),
    )
```


Handle `session.thinking.appended` with `client_event_id: "context_1"`, or the corresponding error, to track this update. See [Understand when context reaches the model](#understand-when-context-reaches-the-model) for acknowledgment timing.

The assistant may repeat information supplied through any of these events. Send only information suitable for the conversation, and keep credentials and secrets in your backend. Use `session.instructions.append` for behavior defined by your application. Supply factual tool results as context, and enforce permissions and required confirmations in application code.

For page navigation, selections, and other UI changes, see [Share UI context](https://developers.openai.com/api/docs/guides/live-delegation#share-ui-context) for concise updates that help GPT-Live understand what the user is referring to.

For an update about a specific backend task, use the ID of the relevant client delegation. A delegation ID identifies the Live task; Responses response IDs and tool call IDs identify different objects. See [Send the right kind of update](https://developers.openai.com/api/docs/guides/live-delegation#send-the-right-kind-of-update) for the workflow.

When your application detects a problem, send a short correction through the session’s primary WebSocket or a [sideband WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband). See [Apply conversation guardrails](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) for checks, action controls, and playback handling.












## Manage speech and transcripts

### Transcript deltas

Listen for `session.input_transcript.delta` for user speech and `session.output_transcript.delta` for assistant speech. Each event contains a text fragment and its interval on the session timeline:

```json
{
  "type": "session.input_transcript.delta",
  "event_id": "event_transcript_1",
  "delta": "What is",
  "start_ms": 1000,
  "end_ms": 1200
}
```

Append each speaker’s `delta` fragments exactly as received, preserving spaces and repeated words. Retain their `start_ms` and `end_ms`. These values are milliseconds from the start of the session. The example above covers the interval from 1,000 ms up to, but excluding, 1,200 ms. They describe approximate fragment timing rather than exact word boundaries; use them instead of packet arrival times to organize the transcript.

Transcript events arrive for intervals that contain text, and delivery can be uneven. A fragment may contain only part of a sentence; a gap in delivery may be a network delay. Transcript deltas have no item ID or event that marks a completed conversational turn, so your application decides how to group them for display.

Processing transcript fragments is optional. You can use them to update your UI, run checks, or start work early while the conversation continues. For lightweight checks, consider a small model such as `gpt-5.6-luna` with low reasoning effort. See [React to transcript fragments](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments) for examples and connection guidance.

Use [transcript guardrails](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#run-checks-alongside-the-conversation) to monitor the conversation and trigger interventions while speech continues. If your application needs to check assistant speech before playback, see [Check speech before playback](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#check-speech-before-playback) for buffering, approval, interruption, and recovery handling.





Keep transcript timing separate from audio playback. WebSocket `session.output_audio.delta` events have no timing fields or output-audio-done event; WebRTC delivers audio through its media track. See [Connections](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) for audio handling.





### Display captions

GPT-Live is full duplex: the caller and assistant can speak at the same time. Update their captions independently so both speakers’ text can keep growing during overlapping speech.

If your app uses chat bubbles, the fragments “I’d like” and “ to change my booking” can appear in one caller bubble. If the assistant says “Sure” while the caller continues, show that acknowledgment separately while allowing the caller’s bubble to keep growing. Keep the original fragments and timestamps so text that arrives later can update the appropriate bubble.

Use `session.output_transcript.delta` for spoken captions and show backend updates separately. Keep decisions about running tools or canceling work in your application’s task logic, separate from how you group text for display.

### Control microphone input

Send `session.input_audio.mute` to mute input without ending the session:

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.input_audio.mute",
    event_id: "mute_1",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.input_audio.mute(
        event_id="mute_1",
    )
```


Wait for `session.input_audio.muted` with `client_event_id: "mute_1"` before treating the command as accepted. To resume input, send `session.input_audio.unmute` and wait for `session.input_audio.unmuted`. Handle errors for either command.

Muting input leaves the session running: the model can keep generating speech, and delegated work can continue. Use your application’s microphone capture and audio player controls when you also need to stop local recording or playback.

### Greet before the caller speaks

To have GPT-Live open the conversation, send greeting instructions after `session.started`. Specify the language, what the assistant should say, and that it should begin immediately, then pause to listen. Use the application’s chosen greeting language until the caller speaks. For example:

> Greet the caller now in English. Introduce yourself as the support assistant and ask how you can help. Then pause and listen.

1. Keep input audio running throughout this sequence, including silence before the caller speaks. On WebSocket, continue sending `session.input_audio.append`; on WebRTC, keep the input audio track active.
2. Send the instructions once with `session.instructions.append` and `delegation_id: null`.
3. Match `session.instructions.appended` to your command using `client_event_id`, and handle any error. This acknowledgment confirms that the instructions were accepted.

For exact wording and a known playback-completion point, play a verified recording or rendered clip through your application and [control GPT-Live playback while it plays](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed). Test greetings in the languages you support, including when the caller starts speaking during the greeting. See [Prompting voice models](https://developers.openai.com/api/docs/guides/live-prompting) for prompt design.

### Deliver a disclosure

Use `session.instructions.append` to request specific spoken wording for a disclosure. `session.commentary.append` may paraphrase the text. After `session.started`, for example, send:

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.instructions.append",
    event_id: "disclosure_1",
    delegation_id: null,
    content:
      "Immediately say the following disclosure exactly and in full before responding to the caller: This call may be recorded for quality and training purposes.",
  });
}
```

```python
from openai.resources.live.live import AsyncLiveConnection
from openai.resources.live.sideband import AsyncSidebandConnection


async def send_update(
    connection: AsyncLiveConnection | AsyncSidebandConnection,
) -> None:
    await connection.session.instructions.append(
        event_id="disclosure_1",
        delegation_id=None,
        content=(
            "Immediately say the following disclosure exactly and in full before "
            "responding to the caller: This call may be recorded for quality and "
            "training purposes."
        ),
    )
```


Keep input audio running, as in [Greet before the caller speaks](#greet-before-the-caller-speaks). An instruction sent during the conversation can interrupt speech in progress.

Check the generated disclosure and its playback before marking it delivered. The instruction acknowledgment records acceptance; use the audio itself to check the wording. For exact wording and a known playback-completion point, play a verified recording or rendered clip through your application and control GPT-Live output while it plays. See [Control playback when needed](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).





## Manage longer conversations

GPT-Live manages long conversations automatically and preserves your original startup instructions.

The default context window holds 128,000 tokens, including your instructions, conversation text, and audio tokens that don’t appear in the transcript.

GPT-Live summarizes older conversation history in the background. When context usage exceeds 90%, it starts a replacement voice engine within the same session. The replacement receives your original instructions and up to 8,192 tokens of conversation history, containing recent messages and, when available, a summary of older messages. Preparing a summary does not immediately change the running engine’s context.





Older conversation details may be summarized or omitted. Keep important facts, confirmed actions, and current task state in your application, and provide relevant context when needed.

## Store and fork a session

A fork starts a new session from a saved voice conversation. Use it to run several evaluation trials from the same reference conversation, or to let a user continue after an earlier session has ended. Each fork gets a new connection and session ID, with the source conversation and its saved configuration as its starting point.

### Run evaluations from a reference conversation

Suppose you want to test how your agent handles a caller changing an order. Record the setup once, through the point where the caller has identified the order. End and finalize that session before the caller asks to change it. Each evaluation can then fork the same reference session and receive the same next caller audio: “Actually, can you send it to my office instead?”

For each trial, restore the same test order and application state, supply the next caller input, and evaluate the new response and tool actions. You can repeat the scenario or compare supported Responses backend settings. Measure fork startup separately from response time. See the [GPT-Live evaluation guide](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) for choosing scenarios and measuring results.

Forks inherit the GPT-Live model, voice, and original instructions. To compare a different voice model or startup prompt, create new sessions with that configuration. The fork API uses the completed source recording, so end the reference session where you want the evaluation to begin.

### Continue after a session ends

For example, a caller may hang up and call back later, or reconnect after a dropped call. If the earlier session has a completed stored recording, your application can fork it on a new connection and continue from the saved conversation.

Save application task state alongside the source session ID. Before continuing, check the status of any outstanding backend work and give the new session its current results. For example, if an order update was already submitted, confirm its outcome before attempting another update. Use the new session ID for controls and sideband connections, and route subsequent backend results to the new session.

### Prepare a session for forking

1. **Enable storage when you create the source.** Set `store: true` in its session configuration. Storage defaults to `false`, must be enabled for your project, and requires a data policy that permits persistence.
2. **Save the source session ID.** Read it from `session.started` or the WebRTC creation response, and associate it with your application’s conversation record.
3. **Finish and close the source.** Complete required backend work, then follow [Usage and graceful close](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close). Keep the connection open until `session.closed` and handle any finalization error. Forking requires a completed stored recording; saving it can add time to finalization.
4. **Start a fork on a new connection.** Use the source ID with the transport flow below, save the new session ID, and complete startup before continuing the conversation. Set the child’s `store` explicitly: `true` if you want to fork its continuation later, or `false` if you do not need to store that trial. Omitting it inherits the source setting.

Stored recordings are available for 30 days. With Zero Data Retention (ZDR), `store` is treated as `false` and forking is unavailable. For fork-based evaluations, use a non-ZDR organization with storage enabled for the project.

If you have no completed stored recording, [start a new session with relevant saved text history](https://developers.openai.com/api/docs/guides/live-conversations#seed-a-session-with-prior-conversation). See [GPT-Live data controls](https://developers.openai.com/api/docs/guides/your-data#v1livesessions) for storage requirements.

For example, set this field in the source session’s WebSocket `session.start` configuration or WebRTC creation request:

```json
{
  "store": true
}
```

Start the fork through the transport your application uses:

| Transport | Start the fork                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| WebSocket | Connect to `wss://api.openai.com/v1/live/sessions/{source_session_id}/fork`.                                                                     |
| WebRTC    | Send a new SDP offer to `POST /v1/live/sessions/{source_session_id}/fork`. Apply the returned `transport.sdp` answer to the new peer connection. |

A fork inherits the source session’s model, original instructions, and input. Send only the supported overrides at startup:

- **WebSocket:** `store`, Responses delegation settings, and the new connection’s `audio.format`. Send a `session.start` event with a `session` object; use `{}` to keep inherited settings where supported.
- **WebRTC:** `store`, Responses delegation settings, and frontend client permissions.

For a WebSocket fork, set `audio.format` for the new connection or use the default PCM16 at 24 kHz. The source audio format and frontend data-channel permissions are not inherited. WebRTC negotiates audio format during connection setup; omit `audio.format`. WebRTC preserves frontend permission settings unless you override them.

For WebSocket, wait for `session.started` before sending more commands. For WebRTC, the HTTP request starts the session; continue through the negotiated connection without sending another `session.start`.

### Start a WebSocket fork

Set `OPENAI_API_KEY`. The examples use the stored source session ID saved by your application. They confirm startup and then close the fork. To continue the conversation, send and receive audio after `session.started` using the [WebSocket connection flow](https://developers.openai.com/api/docs/guides/voice-websockets?api=live). See the [fork WebSocket reference](https://developers.openai.com/api/reference/resources/live/fork-websocket) for the startup fields and events.

```javascript
import OpenAI from "openai";
import { ForksWS } from "openai/resources/live/forks/ws";

async function forkSession(sourceSessionId) {
  const ws = new ForksWS(new OpenAI(), { session_id: sourceSessionId });
  let finalized = false;
  try {
    for await (const event of ws) {
      if (event.type === "open") {
        ws.send({ type: "session.start", session: {} });
      } else if (event.type === "error") {
        throw event.error;
      } else if (event.type === "message") {
        if (event.message.type === "session.started") {
          console.log("Fork ready:", event.message.session.id);
          // This startup example closes the fork after confirming it is ready.
          ws.send({ type: "session.close" });
        } else if (event.message.type === "session.closed") {
          console.log("Final usage:", event.message.usage);
          finalized = true;
          break;
        }
      }
    }
    if (!finalized) throw new Error("Connection closed before session.closed");
  } finally {
    ws.close();
  }
}
```

```python
from openai import OpenAI


def fork_session(source_session_id: str) -> None:
    client = OpenAI()
    with client.live.forks.connect(session_id=source_session_id) as connection:
        connection.session.start(session={})
        finalized = False
        for event in connection:
            if event.type == "session.started":
                print("Fork ready:", event.session.id)
                # This startup example closes the fork after confirming it is ready.
                connection.session.close()
            elif event.type == "session.closed":
                print("Final usage:", event.usage)
                finalized = True
                break
            elif event.type == "error":
                raise RuntimeError(event.error.message)
        if not finalized:
            raise RuntimeError("Connection closed before session.closed")
```


### Start a WebRTC fork

Create a new SDP offer in your frontend and send it to your backend. The following backend examples use that offer and the stored source session ID from your application:

```javascript
import OpenAI from "openai";

async function forkSession(sourceSessionId, offerSdp) {
  const client = new OpenAI();
  const fork = await client.live.sessions.fork(sourceSessionId, {
    transport: { type: "webrtc", sdp: offerSdp },
  });
  console.log(JSON.stringify(fork));
}
```

```python
from openai import OpenAI


def fork_session(source_session_id: str, offer_sdp: str) -> None:
    client = OpenAI()
    fork = client.live.sessions.fork(
        source_session_id,
        transport={"type": "webrtc", "sdp": offer_sdp},
    )
    print(fork.model_dump_json())
```


Return the response to your frontend, apply `transport.sdp` as the new peer connection's answer, and retain the new `session.id`. Keep the API key on your backend.

Use the new session ID for sideband connections and session controls. Before retrying an unfinished action, check its outcome in your backend and restore the current application task state. If you have no completed stored recording, [seed a new session with saved history](#seed-a-session-with-prior-conversation).

### Download a recording

After the stored recording is finalized, download its audio with `GET /v1/live/sessions/{session_id}/content`. The response is binary stereo WAV, with input audio in the left channel and output audio in the right channel. The examples use the stored session ID from your application and stream the response to `recording.wav`:

```javascript
import OpenAI from "openai";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

async function downloadRecording(sessionId) {
  const client = new OpenAI();
  const response = await client.live.sessions.downloadRecording(sessionId);
  if (!response.body) throw new Error("Recording response has no body");
  await pipeline(response.body, createWriteStream("recording.wav"));
}
```

```python
from openai import OpenAI


def download_recording(session_id: str) -> None:
    client = OpenAI()
    with client.live.sessions.with_streaming_response.download_recording(
        session_id
    ) as response:
        response.stream_to_file("recording.wav")
```


## Close idle sessions and resume

For applications with long gaps between interactions, close the voice session during inactivity and start a new session when the user returns. Keep conversation context and application task state so the user can continue without repeating themselves. For example, an in-car assistant can resume when the driver activates voice again, while a coding assistant can keep its backend worker running between voice conversations.

1. **Decide when to close.** Use an application-controlled inactivity timeout based on audio activity, assistant playback, and application interactions. Allow for expected pauses, such as reading or thinking. Close only when playback has finished and no pending work requires the current voice session. Gaps between transcript events alone do not establish silence.
2. **Save state and close gracefully.** Save the source session ID, conversation context, and current task state. Finish any required Responses work, then follow [Usage and graceful close](#usage-and-graceful-close): install the `session.closed` listener, send `session.close`, and wait for `session.closed` before releasing the connection. With client delegation, application-managed backend work can continue independently while voice is closed.
3. **Detect when to restart.** Offer a button labeled **Resume conversation**, a push-to-talk control, or an application-managed wake trigger. A closed Live session cannot listen for the user. If you use local speech detection to restart automatically, keep microphone capture active and buffer the opening speech through connection setup. Deliver that audio once the new session is ready, so the user’s first words are preserved.
4. **Restore context in a new session.** If the source was created with `store: true`, storage is enabled and permitted, and its recording finalized successfully, [fork the stored session](#prepare-a-session-for-forking). Otherwise, [start a new session with saved text history](#seed-a-session-with-prior-conversation). Save the new session ID, check the status of outstanding backend operations, and route subsequent results to the new session. Keep operation status in your application so restarting does not repeat completed actions.

Muting the microphone leaves the session active. Choose an idle timeout by comparing avoided voice duration with session-creation costs and the delay before voice becomes ready again. See [Voice session costs](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live#voice-session-costs) and [WebRTC initialization charges](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live#webrtc-initialization-charges).

## Handle errors and end the session

Keep reading session events until the session finalizes. Distinguish a rejected command, a failed connection, and a completed session so your application can recover appropriately.

### Handle rejected commands

Read `error` events alongside acknowledgments. When present, `error.client_event_id` identifies the outgoing command that failed:

```json
{
  "type": "error",
  "event_id": "event_error",
  "error": {
    "type": "invalid_request_error",
    "code": "immutable_field_update",
    "message": "The delegation type cannot change after session startup.",
    "param": "session.delegation.type",
    "client_event_id": "event_update"
  }
}
```

Provide a general error handler for errors whose code is `null` or whose client event ID is absent. For an immutable-field error, keep the current configuration or create a new session with the intended settings.

### Handle moderation

Moderation can affect the session in two ways:

- Some moderation events end the session.
- Others cut off assistant audio for the remainder of its current speech and emit an `error` event without ending the session.

Keep handling `error` events while audio is playing. Track audio interruption and session closure separately, and mark a spoken message as delivered only after checking its playback. Apply your own [conversation guardrails](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) alongside built-in moderation.

### Usage and graceful close

`session.usage.updated` reports cumulative voice duration in seconds:

```json
{
  "type": "session.usage.updated",
  "event_id": "event_usage_1",
  "usage": { "seconds": 12 },
  "context_window": { "usage_ratio": 0.42 }
}
```

Use the latest `usage.seconds` as the running total for voice duration. For example, updates of 12 and then 15 seconds mean 15 seconds of use. Track backend token usage separately from nested Responses completion events. See [Cost optimization](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live) for usage accounting.

To close gracefully:

1. Finish any delegated Responses work your application needs, including pending function results and response continuations.
2. Install the `session.closed` listener before sending `session.close`.
3. Send `session.close` and stop submitting new work to the session. Keep the WebSocket or WebRTC connection, data channel, and any attached sideband receiver alive while pending session events drain.
4. Read the final `usage.seconds`, `reason`, and session snapshot from `session.closed`. Preserve delegated usage already received through `response.event`.
5. Clean up transports and audio devices after that event. If finalization fails or exceeds a timeout your application sets, report incomplete finalization and release the resources.

Sending `session.close` cancels queued Responses and rejects further commands. An active response can finish, but one waiting for a function result cannot continue after closing starts. Decide separately whether to finish or cancel work your application runs through client delegation.

Use `session.closed` to confirm finalization and read the final configuration snapshot. Keep the transport open until this event arrives. If the socket closes first, record finalization as unconfirmed; if it closes after a valid `session.closed`, retain the confirmed result.

The final event's `reason` explains why the session ended:

| Reason            | Meaning                                                              |
| ----------------- | -------------------------------------------------------------------- |
| `close_requested` | Your application sent `session.close` or called the hangup endpoint. |
| `expired`         | The session reached its duration limit.                              |
| `content`         | A safety filter ended the session.                                   |
| `remote_hangup`   | The remote primary connection ended gracefully.                      |
| `connection_lost` | The primary or upstream connection was lost unexpectedly.            |

A `session.closed` event confirms finalization even when the reason is a connection loss or safety termination. Without that event, final usage remains unconfirmed. A stored session can take longer to finalize while its recording is saved; choose an application timeout that accounts for storage.

### Recover from a failed connection

An HTTP session-creation error means the session did not reach `session.started`. Handle startup errors separately from errors in a running session. If a running connection fails before `session.closed`, retain the latest observed usage and mark final usage as unconfirmed.

If a completed stored recording is available, [fork it](#store-and-fork-a-session) to continue in a new session. Otherwise, create a replacement session with relevant saved history. Before continuing, check unfinished actions with your backend, restore current task state, and update result routing so late results from the previous session cannot overwrite newer work.