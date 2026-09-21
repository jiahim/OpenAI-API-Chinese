# Server-side controls

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Choose your API to see its connection steps and session events.



## Control a GPT-Live session from your server

Attach your application server to an existing GPT-Live WebRTC or SIP session when the server needs to receive conversation events, execute private tools, or update the conversation. This second connection is called a **sideband WebSocket**. Both connections share one session while WebRTC or SIP carries the primary audio.

The sideband carries events and commands. Your application supplies the tool execution, authorization checks, and business rules. Keep API keys and tool credentials on your server.

### Decide whether you need a sideband

For browser applications, use the [WebRTC data channel](https://developers.openai.com/api/docs/guides/voice-webrtc?api=live) for captions and local UI updates. Use a sideband when transcript processing runs on your server, such as guardrail checks, sentiment analysis, or speculative tool calls. Your server can receive events and steer the same session directly while browser audio stays on WebRTC. See [React to transcript fragments](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments) for examples.

If your backend streams audio over the primary [WebSocket connection](https://developers.openai.com/api/docs/guides/voice-websockets?api=live), use that connection to receive events and send commands.

[Responses delegation](https://developers.openai.com/api/docs/guides/live-delegation) also works without a sideband. The browser can forward function-call events from its data channel to an authenticated backend for execution. OpenAI-hosted tools run through the delegated backend without an application tool executor.

### Attach to the existing session

1. Save the ID of the session your backend will control. For WebRTC, use `session.id` from the JSON response to `POST /v1/live/sessions`. For SIP, [accept the incoming call](https://developers.openai.com/api/docs/guides/voice-sip?api=live#accept-or-reject-the-call) first, then use `data.session_id` from its webhook. Keep the ID alongside the application's user and conversation record.
2. Open a WebSocket from your server at the following URL, substituting the saved ID unchanged. Authenticate with `Authorization: Bearer $OPENAI_API_KEY` using the project authentication that created or accepted the session. Include the same connection headers required when creating the session.

```text
   wss://api.openai.com/v1/live/sessions/{session_id}/attach
```

3. Receive events and send commands on the attached socket. The session is already running; do not send `session.start` again.

Use the session ID unchanged, including its prefix, and verify that your application has authorized access to that session.

### Observe events and send commands

| Task                         | Events or commands                                                                                                                                                     |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Follow the conversation      | Receive user and assistant transcript deltas, delegation events, and nested Responses events.                                                                          |
| Update backend configuration | Use `session.update` to change supported settings within the existing delegation mode. Startup settings such as the frontend model and audio configuration stay fixed. |
| Provide context              | Use `session.instructions.append` for instructions, `session.thinking.append` for quiet context, and `session.commentary.append` for speakable updates.                |
| Return tool results          | With Responses delegation, send `response.item.create`, then `response.create` to continue backend work.                                                               |
| Control microphone input     | Use `session.input_audio.mute` and `session.input_audio.unmute`. Muting input does not stop the assistant's output.                                                    |
| Finish the session           | Send `session.close` and receive `session.closed` before disconnecting.                                                                                                |

Commands follow the same validation and delegation rules as on the primary connection. For context appends, use `delegation_id: null` for general session context; a non-null ID must identify an existing client delegation. See [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation) for configuration, function execution, and the context append examples.

For browser sessions, keep microphone input and speaker output on the negotiated WebRTC media track. Use the sideband for conversation events and control, and track playback in your audio player.

### Receive reflected audio

A sideband also receives copies of subsequent input and output audio while the primary connection carries the live media:

| Event                        | Audio field | Timing                                                                       |
| ---------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `session.input_audio.append` | `audio`     | No timestamps.                                                               |
| `session.output_audio.delta` | `delta`     | `start_ms` and `end_ms` describe the output's range on the session timeline. |

Both payloads are base64-encoded raw mono PCM16LE at 24 kHz, regardless of the primary transport's audio format. Neither event has an `event_id`. Reflected input contains received audio before input muting; it does not confirm that the model consumed those samples. Reflected output ranges can have gaps for dropped frames and do not indicate when the caller heard the audio.

Send microphone audio only through the primary connection. Use the sideband to receive reflected audio.

### Assign one owner for each action

Choose whether the browser or backend handles each action. If both connections receive a function-call event, execute the function once. Apply the same ownership rule to context updates and requests to continue backend work.

Attach early if the backend needs to observe the conversation from the start. Store transcripts and tool state in your application, including any history collected before attachment.

The browser can still receive session events when a sideband is attached. Keep sensitive tool credentials and authorization decisions in your backend, and return only the context needed for the conversation.





## Apply conversation guardrails

Use your server's primary WebSocket or sideband to monitor the conversation and check requests against your application's policies. Your application runs the checks, blocks affected actions, and sends corrective instructions when a check triggers.

### Run checks alongside the conversation

Guardrails are one use of [processing transcript fragments as they arrive](https://developers.openai.com/api/docs/guides/live-delegation#react-to-transcript-fragments). The same stream can start a speculative lookup or update the UI alongside these checks.

1. **Monitor transcripts.** Accumulate `session.input_transcript.delta` fragments to check user requests for jailbreak attempts, sensitive information, or policy violations. Use `session.output_transcript.delta` to check assistant speech for unsupported claims or responses outside your application's scope. Keep each check associated with the transcript and application request it evaluated.
2. **Run checks concurrently.** A fast, lightweight model can evaluate requests while the conversation continues. Return a small structured result, such as `{"triggered": true}`, that your application can act on. Run actions that require approval only after their checks pass. Keep them blocked if a check fails or times out.
3. **Block affected actions.** When a check triggers, mark the request as blocked in application state. Check that state before executing a tool or committing a change, including work already queued.
4. **Stop related work.** Cancel application-owned jobs where your backend supports cancellation, and discard late results from blocked or superseded requests. With Responses delegation, stop executing affected custom functions and do not send `response.create` to continue blocked work. This does not cancel an already-running hosted response or stop frontend speech.
5. **Record and redirect.** Log the decision with the affected request and delegation IDs, then send a corrective instruction.

See [Transcript deltas](https://developers.openai.com/api/docs/guides/live-conversations#transcript-deltas) for collecting fragments and [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation#keep-updates-accurate-and-useful) for keeping backend results aligned with the current task.

### Redirect the conversation

Use `session.instructions.append` for guardrail steering. It can interrupt speech in progress and apply a new instruction. For example, after your application blocks a request, send:

```javascript
export function sendUpdate(connection) {
  connection.send({
    type: "session.instructions.append",
    event_id: "guardrail_block_17",
    delegation_id: null,
    content:
      "Stop speaking immediately. Do not continue or act on the last request. Refuse briefly, then wait.",
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
        event_id="guardrail_block_17",
        delegation_id=None,
        content=(
            "Stop speaking immediately. Do not continue or act on the last request. "
            "Refuse briefly, then wait."
        ),
    )
```


Keep the instruction application-authored. Do not copy untrusted user text into it as an instruction. Use `delegation_id: null` for this session-wide correction, and keep `content` within 500 tokens.

Match `session.instructions.appended` to your command through `client_event_id`. The acknowledgment arrives after estimated context injection. To stop audio reaching the caller, use the playback controls below.

For disclosures that request specific spoken wording, also use instructions. See [Deliver a disclosure](https://developers.openai.com/api/docs/guides/live-conversations#deliver-a-disclosure) for an example and playback considerations.

### Control playback when needed

If your application needs to block model audio, control playback at the client or media relay. Temporarily mute or drop the output, discard locally queued audio, and send the corrective instruction. Resume playback according to your application's recovery policy after clearing stale audio; an instruction acknowledgment is not a signal to resume. A sideband alone does not control playback, and corrective instructions cannot retract audio the caller has already heard.

`session.input_audio.mute` controls the caller's microphone input. It does not mute model output or cancel delegated work.

### Check speech before playback

For most applications, [monitor user and assistant transcripts](#run-checks-alongside-the-conversation) while the conversation continues. When a guardrail triggers, your application can block affected actions or send corrective instructions.

If your application needs to check assistant speech before playback, buffer the audio in your player or media bridge before sending it to the caller. Keep receiving audio and transcript events while the check runs, and read transcripts independently of playback.

1. **Collect audio and its transcript.** Implement output voice activity detection (VAD) in your application, or use a noise gate provided by your media framework, to identify candidate speech segments. GPT-Live does not provide an output VAD or noise gate for this workflow. Wait for the transcript needed to check each segment.
2. **Release approved audio.** When a segment passes the check, enqueue its original buffered audio for playback. If the check fails, the transcript is missing, or the check times out, discard the segment and use an application-defined safe fallback.
3. **Handle interruptions.** Associate the audio, transcript, check result, and playback state with an application-generated ID. When an interruption cancels that speech, clear its buffered and queued audio and ignore any later approval for it.

A pause can mark a candidate segment while the model is still composing an answer. If your policy requires checking a complete answer, define how your application establishes completion; voice activity detection alone cannot establish that the whole answer is finished.

Buffering adds latency. Discarded speech remains in the model’s conversation context, so test how the conversation continues after withheld audio or a fallback.

### Test the intervention

Test allowed and blocked requests, false positives, slow or failed checks, a trigger during speech, a trigger while a tool is running, and late results from canceled work. Verify action blocking, application state, corrective speech, and actual playback separately. If you control output, include queued audio and recovery in the test. Use the [voice agent evaluation Cookbook](https://developers.openai.com/cookbook/examples/audio/voice_agent_evaluation) to compare task success and spoken response time.

## Finish cleanly

Keep receiving events while tools finish and the session reports final usage. Register the `session.closed` handler before sending `session.close`, and keep the WebRTC connection, data channel, and sideband open while pending work drains. Save the final session usage and any backend usage received in Responses events before cleanup. If the connection fails before the final event arrives, record finalization as incomplete. See [Managing sessions](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) for the close sequence.

  

  


The Realtime API allows clients to connect directly to the API server via WebRTC or SIP. However, you'll most likely want tool use and other business logic to reside on your application server to keep this logic private and client-agnostic.

Keep tool use, business logic, and other details secure on the server side by connecting over a “sideband” control channel. We now have sideband options for both SIP and WebRTC connections.

A sideband connection means there are two active connections to the same Realtime session: one from the user's client and one from your application server. The server connection can be used to monitor the session, update instructions, and respond to tool calls.

## With WebRTC

1. When [establishing a peer connection](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime) you fetch and receive an SDP response from the Realtime API to configure the connection. If you used the sample code from the WebRTC guide, that looks something like this:

```javascript
const baseUrl = "https://api.openai.com/v1/realtime/calls";
const sdpResponse = await fetch(baseUrl, {
  method: "POST",
  body: offer.sdp,
  headers: {
    Authorization: `Bearer ${EPHEMERAL_KEY}`,
    "Content-Type": "application/sdp",
  },
});
```


2. The fetch response will contain a `Location` header that has a unique call ID that can be used on the server to establish a WebSocket connection to that same Realtime session.

```javascript
// Location: /v1/realtime/calls/rtc_123456
const location = sdpResponse.headers.get("Location");
const callId = location?.split("/").pop();
console.log(callId);
```


3. On a server, you can then [listen for events and configure the session](https://developers.openai.com/api/docs/guides/realtime-conversations) just as you would from a typical Realtime API WebSocket connection, using that call ID with the URL
   `wss://api.openai.com/v1/realtime?call_id=rtc_xxxxx`, as shown below:

```javascript
import WebSocket from "ws";
const callId = "rtc_u1_9c6574da8b8a41a18da9308f4ad974ce";

// Connect to a WebSocket for the in-progress call
const url = "wss://api.openai.com/v1/realtime?call_id=" + callId;
const ws = new WebSocket(url, {
  headers: {
    Authorization: "Bearer " + process.env.OPENAI_API_KEY,
  },
});

ws.on("open", function open() {
  console.log("Connected to server.");

  // Send client events over the WebSocket once connected
  ws.send(
    JSON.stringify({
      type: "session.update",
      session: {
        type: "realtime",
        instructions: "Be extra nice today!",
      },
    })
  );
});

// Listen for and parse server events
ws.on("message", function incoming(message) {
  console.log(JSON.parse(message.toString()));
});
```


In this way, you are able to add tools, monitor sessions, and carry out business logic on the server instead of needing to configure those actions on the client.

## With SIP

1. A user connects to OpenAI via phone over SIP.
2. OpenAI sends a webhook to your application’s server webhook URL, notifying your app of the state of the session. The webhook will look something like:

```json
POST https://my_website.com/webhook_endpoint
user-agent: OpenAI/1.0 (+https://platform.openai.com/docs/webhooks)
content-type: application/json
webhook-id: wh_685342e6c53c8190a1be43f081506c52 # unique id for idempotency
webhook-timestamp: 1750287078 # timestamp of delivery attempt
webhook-signature: v1,K5oZfzN95Z9UVu1EsfQmfVNQhnkZ2pj9o9NDN/H/pI4= # signature to verify authenticity from OpenAI

{
  "object": "event",
  "id": "evt_685343a1381c819085d44c354e1b330e",
  "type": "realtime.call.incoming",
  "created_at": 1750287018, // Unix timestamp
  "data": {
    "call_id": "some_unique_id",
    "sip_headers": [
      { "name": "From", "value": "sip:+142555512112@sip.example.com" },
      { "name": "To", "value": "sip:+18005551212@sip.example.com" },
      { "name": "Call-ID", "value": "03782086-4ce9-44bf-8b0d-4e303d2cc590"}
    ]
  }
}

```

3. The application server opens a WebSocket connection to the Realtime API using the `call_id` value provided in the webhook, via a URL like this: `wss://api.openai.com/v1/realtime?call_id={callId}`. The WebSocket connection will live for the life of the SIP call.

The WebSocket connection can then be used to send and receive events to control the call, just as you would if the session was initiated with a WebSocket connection. This includes monitoring the call, updating instructions dynamically, and responding to tool calls.