# Realtime translation

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Realtime translation lets you stream source audio into a dedicated translation session and receive translated audio plus transcript deltas while the speaker is still talking. Use it for live interpretation, multilingual calls, broadcasts, meetings, lessons, and video rooms.

Use [`gpt-realtime-translate`](https://developers.openai.com/api/docs/models/gpt-realtime-translate) when your application should translate what a human says. If you need an assistant that answers questions, calls tools, and manages a conversation, use [`gpt-realtime-2.1`](https://developers.openai.com/api/docs/models/gpt-realtime-2.1) with a standard Realtime session instead.

## How translation sessions differ

Realtime translation sessions use a different architecture from voice-agent sessions:

| Voice-agent session                         | Translation session                              |
| ------------------------------------------- | ------------------------------------------------ |
| Connects to `/v1/realtime`.                 | Connects to `/v1/realtime/translations`.         |
| The model acts as an assistant.             | The model acts as an interpreter.                |
| Uses a conversation and response lifecycle. | Streams continuously from incoming audio.        |
| May call tools and produce assistant turns. | Produces translated audio and transcript deltas. |
| You can call `response.create`.             | You don't call `response.create`.                |

Translation starts from the audio stream itself. Keep appending audio, including silence between phrases, and handle output events as they arrive.

## Choose a transport

Use WebRTC when the browser captures or plays audio. WebRTC sends source audio as a media track and receives translated speech as a remote audio track, so you don't need to manually resample or play PCM chunks.

Use WebSockets when your server already receives raw audio, such as Twilio Media Streams, SIP media, broadcast ingest, or a media worker. With WebSockets, send base64-encoded 24 kHz PCM16 audio and play returned audio deltas yourself.

## Create a browser WebRTC session

For browser apps, create a short-lived client secret on your server. Don't expose your standard API key in the browser.

Create a translation client secret

```javascript
app.post("/session", async (req, res) => {
  const language = req.body.targetLanguage ?? "es";

  const response = await fetch(
    "https://api.openai.com/v1/realtime/translations/client_secrets",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Safety-Identifier": "hashed-user-id",
      },
      body: JSON.stringify({
        session: {
          model: "gpt-realtime-translate",
          audio: {
            output: { language },
          },
        },
      }),
    }
  );

  res.status(response.status).json(await response.json());
});
```


In the browser, capture audio, create a peer connection, and post the SDP offer to the translation calls endpoint:

Connect a browser translation call

```javascript
const { value: clientSecret } = await fetch("/session", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ targetLanguage: "es" }),
}).then((response) => response.json());

const sourceStream = await navigator.mediaDevices.getUserMedia({
  audio: true,
});

const pc = new RTCPeerConnection();
pc.addTrack(sourceStream.getAudioTracks()[0], sourceStream);

const translatedAudio = new Audio();
translatedAudio.autoplay = true;
pc.ontrack = ({ streams }) => {
  translatedAudio.srcObject = streams[0];
};

const events = pc.createDataChannel("oai-events");
events.onmessage = ({ data }) => {
  const event = JSON.parse(data);
  if (event.type === "session.output_transcript.delta") {
    subtitles.textContent += event.delta;
  }
};

const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

const sdpResponse = await fetch(
  "https://api.openai.com/v1/realtime/translations/calls",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${clientSecret}`,
      "Content-Type": "application/sdp",
    },
    body: offer.sdp,
  }
);

if (!sdpResponse.ok) {
  throw new Error(await sdpResponse.text());
}

await pc.setRemoteDescription({
  type: "answer",
  sdp: await sdpResponse.text(),
});
```


## Create a WebSocket session

Connect to the dedicated translation endpoint and select the model in the URL:

Install the `ws` package for Node.js or the `websocket-client` package for Python before running this example.

Connect to a translation session

```javascript
import WebSocket from "ws";

const ws = new WebSocket(
  "wss://api.openai.com/v1/realtime/translations?model=gpt-realtime-translate",
  {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "OpenAI-Safety-Identifier": "hashed-user-id",
    },
  }
);
```

```python
import os
import websocket

ws = websocket.WebSocket()
ws.connect(
    "wss://api.openai.com/v1/realtime/translations?model=gpt-realtime-translate",
    header=[
        f"Authorization: Bearer {os.environ['OPENAI_API_KEY']}",
        "OpenAI-Safety-Identifier: hashed-user-id",
    ],
)
```


Configure the target language after the socket opens:

Configure the target language

```javascript
ws.on("open", () => {
  ws.send(
    JSON.stringify({
      type: "session.update",
      session: {
        audio: {
          output: {
            language: "es",
          },
        },
      },
    })
  );
});
```

```python
import json

ws.send(
    json.dumps(
        {
            "type": "session.update",
            "session": {
                "audio": {
                    "output": {
                        "language": "es",
                    },
                },
            },
        }
    )
)
```


Then append audio continuously:

Append source audio

```javascript
ws.send(
  JSON.stringify({
    type: "session.input_audio_buffer.append",
    audio: base64Pcm16,
  })
);
```

```python
ws.send(
    json.dumps(
        {
            "type": "session.input_audio_buffer.append",
            "audio": base64_pcm16,
        }
    )
)
```


Listen for translated audio and transcripts:

Listen for translated audio and transcripts

```javascript
ws.on("message", (data) => {
  const event = JSON.parse(data.toString());

  if (event.type === "session.output_audio.delta") {
    playPcm16(event.delta);
  }

  if (event.type === "session.output_transcript.delta") {
    process.stdout.write(event.delta);
  }

  if (event.type === "session.input_transcript.delta") {
    updateSourceTranscript(event.delta);
  }
});
```

```python
while True:
    event = json.loads(ws.recv())

    if event["type"] == "session.output_audio.delta":
        play_pcm16(event["delta"])

    if event["type"] == "session.output_transcript.delta":
        print(event["delta"], end="", flush=True)

    if event["type"] == "session.input_transcript.delta":
        update_source_transcript(event["delta"])
```


## Close a WebSocket session

When your source stream ends, send a [`session.close`](https://developers.openai.com/api/reference/resources/realtime/translation-client-events#session-close) event before closing the WebSocket. The event tells the service to flush pending input audio, emit any remaining translated audio and transcript output, and then send a `session.closed` event. The `session.close` event is only supported for translation sessions.

After you send `session.close`, stop appending audio and continue reading events in your normal receive loop until you receive `session.closed`. Closing the socket immediately can drop translated output still draining from the session.

Close a translation session

```javascript
let translationSessionClosing = false;

function closeTranslationSession() {
  if (translationSessionClosing) {
    return;
  }

  translationSessionClosing = true;
  ws.send(
    JSON.stringify({
      type: "session.close",
    })
  );
}

ws.on("message", (data) => {
  const event = JSON.parse(data.toString());

  if (event.type === "session.output_audio.delta") {
    playPcm16(event.delta);
  }

  if (event.type === "session.output_transcript.delta") {
    process.stdout.write(event.delta);
  }

  if (event.type === "session.input_transcript.delta") {
    updateSourceTranscript(event.delta);
  }

  if (event.type === "session.closed") {
    ws.close();
  }
});

// Call this when the source stream ends.
closeTranslationSession();
```

```python
translation_session_closing = False


def close_translation_session():
    global translation_session_closing
    if translation_session_closing:
        return

    translation_session_closing = True
    ws.send(json.dumps({"type": "session.close"}))


# Call this when the source stream ends.
close_translation_session()

while True:
    event = json.loads(ws.recv())

    if event["type"] == "session.output_audio.delta":
        play_pcm16(event["delta"])

    if event["type"] == "session.output_transcript.delta":
        print(event["delta"], end="", flush=True)

    if event["type"] == "session.input_transcript.delta":
        update_source_transcript(event["delta"])

    if event["type"] == "session.closed":
        ws.close()
        break
```


## Build listen-along translation

Use listen-along translation when one source speaker or stream needs translated audio for an audience. Examples include livestreams, conference talks, webinars, earnings calls, lectures, and videos.

The typical architecture is:

```text
source audio -> translation session -> translated audio + subtitles
```

Create one translation session for each target language. If the same English source needs Spanish and French output, create one English-to-Spanish session and one English-to-French session.

For browser listen-along apps, capture tab audio with `getDisplayMedia()`, send it over WebRTC, and play the remote translated audio track. For production broadcasts, run translation in a server media worker and publish translated audio tracks or captions to listeners.

## Build conversational translation

Use conversational translation when two or more participants speak across languages. Examples include support calls, sales calls, tutoring, and video rooms.

Keep participant audio tracks separate. Mixing speakers into one stream makes speaker identity, speaker captions, and overlapping speech more difficult to handle.

For a two-person call, create one translation session per direction:

```text
Caller A audio -> translate into Caller B language -> play to Caller B
Caller B audio -> translate into Caller A language -> play to Caller A
```

For group rooms, session count depends on active speakers and target languages:

```text
translation sessions ~= active source speaker tracks x distinct target languages
```

For small rooms, each listener can create browser-side translation sidecars for the remote speakers they want translated. For larger rooms, use a server-side participant or media worker that subscribes to each source speaker once, creates one translation session per target language, and republishes translated tracks.

## Test quality and latency

Test translation with real audio and bilingual review. Automated metrics can help, but they won't catch every error users notice.

Test:

- language-pair quality;
- names, numbers, dates, currency, and phone numbers;
- domain-specific terminology;
- code-switching and mixed-language conversation;
- accents, fast speech, and overlapping speech;
- first translated audio latency;
- end-of-utterance latency;
- subtitle timing;
- voice consistency;
- reconnect behavior.

If your use case depends on exact names or domain terms, build a golden set before launch and review failures manually.

## Production checklist

- Choose WebRTC for browser media and WebSockets for server media.
- Use the dedicated `/v1/realtime/translations` endpoint.
- Stream audio continuously, including silence between phrases.
- Use `session.close` and wait for `session.closed` before closing a WebSocket session.
- Keep speaker tracks separate for conversational translation.
- Use one session per output language.
- Render both source and target transcripts when useful.
- Expose controls for original audio, translated audio, subtitles, mute, and volume.
- Surface reconnecting, delayed, and unavailable states.
- Track latency apart from translation quality.

## Related guides

[Realtime and audio overview



      Compare voice-agent, translation, and transcription sessions.](https://developers.openai.com/api/docs/guides/realtime)

[WebRTC connection



      Connect browser media to a realtime session.](https://developers.openai.com/api/docs/guides/realtime-webrtc)

[WebSocket connection



      Stream raw audio through a server-side media pipeline.](https://developers.openai.com/api/docs/guides/realtime-websocket)

[Realtime transcription



      Stream transcript deltas from live audio.](https://developers.openai.com/api/docs/guides/realtime-transcription)