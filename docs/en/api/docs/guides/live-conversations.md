# Managing GPT-Live sessions

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

After [connecting to GPT-Live](https://developers.openai.com/api/docs/guides/live), use session events to update context, display transcripts, and manage the connection's lifecycle. The model can listen and speak at the same time, so keep received events, audio playback, and backend task state separate in your application.

This guide assumes your connection has emitted `session.started`. See [Connections](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live) for connection setup and audio streaming, and [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation) for backend work.





## Configure a session

Choose the model, voice, and delegation mode when you create the session. Give the model instructions for the conversation and include relevant history. GPT-Live manages context automatically as the conversation grows.

### Configuration fields

| Setting      | Configure at startup                                                                                | Change during the session                            |
| ------------ | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Model        | Set the required `model`.                                                                           | Start a new session to change it.                    |
| Instructions | Set `instructions` for conversation behavior, up to 16,384 tokens.                                  | Add instructions with `session.instructions.append`. |
| History      | Set `input` to relevant prior text messages. It defaults to `[]`.                                   | Append context; don't replace the startup history.   |
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

Regional influence describes a voice's speaking style, not a guarantee of accent fidelity. For an approved voice created from your own recording, see [Custom voices](https://developers.openai.com/api/docs/guides/custom-voices).





For WebSocket, choose the shared `audio.format` at startup; it cannot change during the session. For WebRTC, omit this field because the connection negotiates its audio format. See [WebSocket audio formats](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) for format and streaming details.

### Update a live session

Use `session.update` for changes to `session.delegation.responses` in a session already using Responses delegation. Send only the settings you want to change; omitted settings retain their values. See [Configure Responses delegation](https://developers.openai.com/api/docs/guides/live-delegation#configure-responses-delegation) for the settings and update workflow.

You cannot change the delegation mode after startup. In particular, setting `delegation` to `null` selects client mode; it does not reset a Responses session. The startup fields `model`, `instructions`, `input`, `audio`, and `store` are not accepted update fields. Unknown configuration fields are rejected.

A successful update emits `session.updated` with the full resolved session configuration. When you supply an `event_id`, the acknowledgment returns it as `client_event_id`. Check for [rejected commands](#handle-rejected-commands) as well as acknowledgments. Acceptance confirms the configuration update; it does not establish that a backend task ran or that the model spoke.

## Provide history and context

Use startup history to resume a topic, and append relevant context as the conversation continues. Keep trusted application instructions separate from user messages and factual results.

### Seed a session with prior conversation

Include prior text messages in `session.input` when you create the session. For example, add this `input` field to your [session creation configuration](https://developers.openai.com/api/docs/guides/live#connect-your-first-session):

```javascript
/** @type {import("openai/resources/live/live").SessionConfig} */
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


The list accepts up to 128 messages and 8,192 combined tokens. Supported roles are `developer`, `user`, and `assistant`, each with one text part. Developer and user messages use `input_text`; assistant messages use `text` or `output_text`. Put trusted application instructions in `instructions` or a developer message. The list does not accept the `system` role.

Select the history needed for the next interaction. `input` is a startup field, not a way to replace history during a running session. It also does not accept the full range of backend input items used in Responses delegation.

### Understand when context reaches the model

The full `input` supplied at session creation is available to the model when the session starts. Put context the model needs from the beginning in this field.

During a running session, the `session.instructions.append`, `session.thinking.append`, and `session.commentary.append` events feed content into the model over time. Their acknowledgments wait until frame progress reaches the estimated end of context injection. The returned `start_ms` and `end_ms` describe an estimated range on the session timeline, not speech or playback completion. They do not prove that the model consumed the entire update. Don't assume its next speech will reflect the whole update.

If frame progress stops, an acknowledgment can remain pending. Closing the session reports an error for pending appends. Match each acknowledgment to the outgoing `event_id` through `client_event_id`, and keep handling errors while you wait.

### Add context during the conversation

Choose an event based on how the model should use the update:

- `session.instructions.append`: add trusted application instructions that influence behavior and speech.
- `session.thinking.append`: add factual context without asking the model to say it immediately.
- `session.commentary.append`: provide information for the model to say aloud, which it may paraphrase.

Each event takes plain-string `content` of up to 500 tokens and a required `delegation_id`. Use `null` for session-wide context. For example, send this after your application has verified the user's acceptance and started the lookup:

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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


Wait for `session.thinking.appended` with `client_event_id: "context_1"`, or handle an error. The acknowledgment confirms that context was accepted. It does not confirm speech, playback, or completion of an external action.

Quiet context can influence later speech; it is not a privacy boundary. Keep credentials, secrets, and text the model must never reveal out of all three events. Use the instructions event for application-authored behavior, not untrusted tool output. Enforce permissions and required confirmations in your application.

For page navigation, selections, and other UI changes, see [Share UI context](https://developers.openai.com/api/docs/guides/live-delegation#share-ui-context) for concise updates that help GPT-Live understand what the user is referring to.

For results tied to a backend task, use a known client delegation ID and follow [Send the right kind of update](https://developers.openai.com/api/docs/guides/live-delegation#send-the-right-kind-of-update). That ID is not a Responses response ID or tool call ID.

Use instructions to steer the conversation after an application check triggers. Your server can monitor events and send these corrections through a [sideband WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#decide-whether-you-need-a-sideband) attached to the existing session, or through its primary WebSocket. See [Apply conversation guardrails](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) for concurrent checks, action blocking, and playback control.








## Build the conversation interface

Display transcripts and microphone state independently of backend progress. Receiving assistant text does not tell you how much audio the user has heard.

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

Append fragments in order for each speaker, retaining `start_ms` and `end_ms`. These are milliseconds on the session timeline, with intervals that include the start and exclude the end. They are not wall-clock timestamps, packet arrival times, or exact word alignments.

Only intervals containing transcript text produce events, and network delivery can be uneven. Do not infer silence from a missing event or treat a fragment as a complete user turn. Transcript deltas have no item ID or authoritative turn-completed event.

Processing transcript fragments is optional. You can use them to update your UI, run checks, or start work early while the conversation continues. For lightweight checks, consider a small model such as `gpt-5.6-luna` with low reasoning effort. See [React to transcript fragments](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments) for examples and connection guidance.

For conversation guardrails, check accumulated user and assistant text as it arrives. Transcript delivery does not provide an advance buffer for approving speech before playback. See [Control playback when needed](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).





If your interface groups text into turns, keep that grouping revisable. Preserve the original fragments, allow user and assistant intervals to overlap, and tune any gap timeout against recorded conversations. A brief acknowledgment from the other speaker may belong within an ongoing exchange. Grouping fragments must not trigger tool execution or cancel backend work by itself.





Keep transcript timing separate from audio playback. WebSocket `session.output_audio.delta` events have no timing fields or output-audio-done event; WebRTC delivers audio through its media track. See [Connections](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) for audio handling.

### Display captions

Build caption rows that can grow while both speakers are talking:

1. **Preserve the text.** Store each speaker's original `delta`, `start_ms`, and `end_ms`. Concatenate text exactly as received, including spaces and repeated words. Don't trim fragments or insert spaces between them.
2. **Update each speaker independently.** Allow user and assistant rows to grow during overlapping speech. Keep earlier assistant text visible after an interruption, and start a new row when the assistant resumes.
3. **Keep rows stable.** Assign display IDs in your application and preserve row order as text grows. Don't derive row identity from changing text or end timestamps, or move a row to the bottom whenever it receives a fragment.
4. **Revisit grouping for late fragments.** Use transcript timestamps to group nearby fragments from the same speaker. Allow late text to update earlier rows and revise fragment assignments while retaining the original fragments. These display groups are not complete semantic turns; any gap threshold is an application choice to test.
5. **Let the reader control scrolling.** Follow new text while the reader is at the bottom. Pause automatic scrolling when they scroll up, and provide a way to return to the latest captions.
6. **Show tool progress in a status area.** Use assistant transcript events for spoken captions. Display tool activity and backend results outside the captions; receiving a result does not mean the assistant has said it.

Test the display with overlapping speech, short acknowledgments, interruptions, long pauses, and translation where the two speakers' text arrives at different rates.

### Control microphone input

Send `session.input_audio.mute` to mute input without ending the session:

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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

Muting input does not stop inference, delegated work, or generated speech. Control microphone capture and audio playback separately in your application when those controls are needed.

### Greet before the caller speaks

To request a greeting after `session.started`:

1. Send one fresh `session.instructions.append` with `delegation_id: null`. Include the greeting, its language, and an explicit instruction to greet immediately without waiting for the caller, then pause and listen. Keep the existing startup instructions.
2. Wait for `session.instructions.appended`, matching its `client_event_id` to your command. Handle a rejected command before continuing.
3. Keep input audio running, including silence before the caller speaks. On WebSocket, continue sending `session.input_audio.append`; on WebRTC, keep the negotiated input audio track active. Observe output transcript and audio for the greeting.

Use the language specified by your application until the caller speaks; don't infer it from a name, phone number, or location. See [Prompting voice models](https://developers.openai.com/api/docs/guides/live-prompting) for prompt design.

For a greeting that needs to follow application instructions, send those instructions with `session.instructions.append`, then use a short `session.commentary.append` to prompt the assistant to begin. For example: “Begin the conversation now, following the instructions provided.” Keep input audio running, including silence before the caller speaks.

Instructions request a greeting; they do not guarantee exact wording or uninterrupted playback. The API does not emit an opening-completed event, and acknowledgment does not mean the greeting was heard. Use application-controlled playback if the audio must be verbatim. Test your greeting with the languages and interruptions your application supports.

### Deliver a disclosure

Use `session.instructions.append` to request specific spoken wording for a disclosure. `session.commentary.append` may paraphrase the text. After `session.started`, for example, send:

```javascript
/**
 * @param {import("openai/resources/live/ws").LiveWS | import("openai/resources/live/sideband/ws").SidebandWS} connection
 */
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


Keep input audio running as described in [Greet before the caller speaks](#greet-before-the-caller-speaks). Choose the delivery point deliberately: an instruction sent during the conversation can interrupt speech in progress.

This requests the wording; it does not guarantee exact delivery. Verify the complete spoken disclosure and actual playback before marking it delivered. `session.instructions.appended` confirms only that the instruction was accepted. If exact audio delivery is required, play a verified recording or rendered clip through your application and control GPT-Live output while it plays. See [Control playback when needed](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#control-playback-when-needed).





## Manage longer conversations

GPT-Live automatically manages context during long conversations; no configuration parameter is needed. The instructions you provide at session start are preserved throughout compaction. You don’t need to resend them.

The default context window holds 128,000 tokens, including your instructions, conversation text, and audio tokens that don’t appear in the transcript.

GPT-Live summarizes older conversation history in the background. When context usage exceeds 90%, it starts a replacement voice engine within the same session. The replacement receives your original instructions and up to 8,192 tokens of conversation history, containing recent messages and, when available, a summary of older messages. Preparing a summary does not immediately change the running engine’s context.





Older conversation details may be summarized or omitted. Keep important facts, confirmed actions, and current task state in your application, and provide relevant context when needed.

## Store and fork a session

Set `store` to `true` in the session configuration at creation to save a recording for later download or forking. Storage defaults to `false` and must be enabled for your project. Downloads and forks require a completed stored recording and a data policy that permits persistence. Recordings expire after 30 days. With Zero Data Retention, `store` is treated as `false`, and recording downloads and forks are unavailable. See [GPT-Live data controls](https://developers.openai.com/api/docs/guides/your-data#v1livesessions).

For example, add this field to the `session` object in your WebSocket `session.start` event or WebRTC creation request:

```json
{
  "store": true
}
```

Save the source session ID from `session.started` or the WebRTC creation response. A fork starts a **new session with a new ID** from the stored session state. It does not reopen the original connection or reuse the source session ID.

Start the fork through the transport your application uses:

| Transport | Start the fork                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| WebSocket | Connect to `wss://api.openai.com/v1/live/sessions/{source_session_id}/fork`.                                                                     |
| WebRTC    | Send a new SDP offer to `POST /v1/live/sessions/{source_session_id}/fork`. Apply the returned `transport.sdp` answer to the new peer connection. |

A fork inherits the stored session configuration, subject to the transport rules below. For a WebSocket fork, send `session.start` with a required `session` object; `{}` supplies no overrides. Do not supply a new model or repeat the original instructions or input. You can override `store`, Responses delegation settings, and the new WebSocket audio format. WebRTC forks can override `store`, Responses delegation settings, and frontend client permissions. Omitting `store` on a fork inherits the source session's setting.

A WebSocket fork does **not** inherit the source audio format: set `audio.format` explicitly or use the default PCM16 at 24 kHz. It also discards inherited frontend data-channel permissions. WebRTC forks negotiate their audio format and reject `audio.format`; they preserve frontend permission settings unless you override them.

Wait for `session.started` before sending further WebSocket commands. WebRTC starts through the HTTP request and must not receive a second `session.start` on its data channel.

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

Use the new session ID for later sideband connections and session controls. Keep application task state separately: restoring conversation state does not confirm that a pending backend action completed. Reconcile uncertain results before retrying an action. If you don't have a stored session to fork, [seed a new session with saved history](#seed-a-session-with-prior-conversation).

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

An error code can be `null`, and an error may lack a client event ID. Handle those cases without assuming a command succeeded. For an immutable-field error, keep the current configuration or create a new session with the intended settings.

### Handle moderation

Moderation can affect the session in two ways:

- Some moderation events end the session.
- Others cut off assistant audio for the remainder of its current speech and emit an `error` event without ending the session.

Read `error` events even while audio is playing. Don't assume every moderation error closes the session, or that an audio interruption means the connection failed. Keep application state aligned with the session lifecycle, and don't mark an interrupted spoken message as fully delivered. Application-level [conversation guardrails](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live#apply-conversation-guardrails) remain separate from this built-in moderation behavior.

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

These are snapshots, not increments to sum. Backend token usage is separate; preserve it from nested Responses completion events. See [Cost optimization](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live) for usage accounting.

To close gracefully:

1. Finish any delegated Responses work your application needs, including pending function results and response continuations.
2. Install the `session.closed` listener before sending `session.close`.
3. Send `session.close` and stop submitting new work to the session. Keep the WebSocket or WebRTC connection, data channel, and any attached sideband receiver alive while pending session events drain.
4. Read the final `usage.seconds`, `reason`, and session snapshot from `session.closed`. Preserve delegated usage already received through `response.event`.
5. Clean up transports and audio devices after that event. If finalization fails or exceeds a timeout your application sets, report incomplete finalization and release the resources.

Sending `session.close` cancels queued Responses and rejects further commands. An active response can finish, but one waiting for a function result cannot continue after closing starts. Decide separately whether to finish or cancel work your application runs through client delegation.

The `session.closed` event establishes finalization; the embedded session is a configuration snapshot. A socket close alone does not establish success, and a transport close code after a valid final event does not invalidate finalization. Closing WebRTC immediately after sending the command can prevent delivery of the final event.

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

If a stored session is available, [fork it](#store-and-fork-a-session) to start a new session from its saved state. Otherwise, create a replacement session with relevant saved history. Reconcile pending actions with your backend before retrying them, and suppress stale results from the previous session. Restore application state explicitly rather than assuming a new connection resumes the previous session or its pending work.