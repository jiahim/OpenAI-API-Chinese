# Realtime translation client events

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

These are events that the OpenAI Realtime Translation WebSocket server will accept from the client.

<a id="session.update"></a>

## session.update

Send this event to update the translation session configuration. Translation
sessions support updates to `audio.output.language`, `audio.input.transcription`,
and `audio.input.noise_reduction`.

### Schema

Schema name: `RealtimeTranslationClientEventSessionUpdate`

- `session: RealtimeTranslationSessionUpdateRequest`

  Translation session fields to update. The session `type` and `model` are set
  at creation and cannot be changed with `session.update`.

  - `audio: optional object { input, output }`

    Configuration for translation input and output audio.

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        Optional input noise reduction. Set to `null` to disable it.

        - `type: NoiseReductionType`

          Type of noise reduction. `near_field` is for close-talking microphones such as headphones, `far_field` is for far-field microphones such as laptop or conference room microphones.

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        Optional source-language transcription. When configured, the server emits
        `session.input_transcript.delta` events. Translation itself still runs from
        the input audio stream.

        - `model: string`

          The transcription model to use for source transcript deltas.

    - `output: optional object { language }`

      - `language: optional string`

        Target language for translated output audio and transcript deltas.

- `type: "session.update"`

  The event type, must be `session.update`.

  - `"session.update"`

- `event_id: optional string`

  Optional client-generated ID used to identify this event.

### Example

```json
{
  "type": "session.update",
  "session": {
    "audio": {
      "input": {
        "transcription": {
          "model": "gpt-realtime-whisper"
        },
        "noise_reduction": null
      },
      "output": {
        "language": "es"
      }
    }
  }
}
```

<a id="session.input_audio_buffer.append"></a>

## session.input_audio_buffer.append

Send this event to append audio bytes to the translation session input audio buffer.

WebSocket translation sessions accept base64-encoded 24 kHz PCM16 mono
little-endian raw audio bytes. Unsupported websocket audio formats return a
validation error because lower-quality audio materially degrades translation
quality.

Translation consumes 200 ms engine frames. For best realtime behavior, append
audio in 200 ms chunks. If a chunk is shorter, the server buffers it until it
has enough audio for one frame. If a chunk is longer, the server splits it into
200 ms frames and enqueues them back-to-back.

Keep appending silence while the session is active. If a client stops sending
audio and later resumes, model time treats the resumed audio as contiguous with
the previous audio rather than as a real-world pause.

### Schema

Schema name: `RealtimeTranslationClientEventInputAudioBufferAppend`

- `audio: string`

  Base64-encoded 24 kHz PCM16 mono audio bytes.

- `type: "session.input_audio_buffer.append"`

  The event type, must be `session.input_audio_buffer.append`.

  - `"session.input_audio_buffer.append"`

- `event_id: optional string`

  Optional client-generated ID used to identify this event.

### Example

```json
{
  "event_id": "event_456",
  "type": "session.input_audio_buffer.append",
  "audio": "Base64EncodedAudioData"
}
```

<a id="session.close"></a>

## session.close

Gracefully close the realtime translation session. The server flushes pending
input audio and emits any remaining translated output before closing the
session.

### Schema

Schema name: `RealtimeTranslationClientEventSessionClose`

- `type: "session.close"`

  The event type, must be `session.close`.

  - `"session.close"`

- `event_id: optional string`

  Optional client-generated ID used to identify this event.

### Example

```json
{
  "event_id": "event_789",
  "type": "session.close"
}
```
