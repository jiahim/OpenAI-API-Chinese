# Realtime translation server events

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

These are events emitted from the OpenAI Realtime Translation WebSocket server to the client.

<a id="error"></a>

## error

Returned when an error occurs, which could be a client problem or a server
problem. Most errors are recoverable and the session will stay open, we
recommend to implementors to monitor and log error messages by default.

### Schema

Schema name: `RealtimeServerEventError`

- `error: RealtimeError`

  Details of the error.

  - `message: string`

    A human-readable error message.

  - `type: string`

    The type of error (e.g., "invalid_request_error", "server_error").

  - `code: optional string or null`

    Error code, if any.

  - `event_id: optional string or null`

    The event_id of the client event that caused the error, if applicable.

  - `param: optional string or null`

    Parameter related to the error, if any.

- `event_id: string`

  The unique ID of the server event.

- `type: "error"`

  The event type, must be `error`.

  - `"error"`

### Example

```json
{
    "event_id": "event_890",
    "type": "error",
    "error": {
        "type": "invalid_request_error",
        "code": "invalid_event",
        "message": "The 'type' field is missing.",
        "param": null,
        "event_id": "event_567"
    }
}
```

<a id="session.created"></a>

## session.created

Returned when a translation session is created. Emitted automatically when a
new connection is established as the first server event. This event contains
the default translation session configuration.

### Schema

Schema name: `RealtimeTranslationServerEventSessionCreated`

- `event_id: string`

  The unique ID of the server event.

- `session: RealtimeTranslationSession`

  The translation session configuration.

  - `id: string`

    Unique identifier for the session that looks like `sess_1234567890abcdef`.

  - `audio: object { input, output }`

    Configuration for translation input and output audio.

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        Optional input noise reduction.

        - `type: NoiseReductionType`

          Type of noise reduction. `near_field` is for close-talking microphones such as headphones, `far_field` is for far-field microphones such as laptop or conference room microphones.

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        Optional source-language transcription. When configured, the server emits
        `session.input_transcript.delta` events. Translation itself still runs from
        the input audio stream.

        - `model: string`

          The transcription model used for source transcript deltas.

    - `output: optional object { language }`

      - `language: optional string`

        Target language for translated output audio and transcript deltas.

  - `expires_at: number`

    Expiration timestamp for the session, in seconds since epoch.

  - `model: string`

    The Realtime translation model used for this session. This field is set at
    session creation and cannot be changed with `session.update`.

  - `type: "translation"`

    The session type. Always `translation` for Realtime translation sessions.

    - `"translation"`

- `type: "session.created"`

  The event type, must be `session.created`.

  - `"session.created"`

### Example

```json
{
  "type": "session.created",
  "event_id": "event_123",
  "session": {
    "id": "sess_123",
    "type": "translation",
    "model": "gpt-realtime-translate",
    "expires_at": 1714857600,
    "audio": {
      "input": {
        "transcription": {
          "model": "gpt-realtime-whisper",
          "language": "en"
        },
        "noise_reduction": {
          "type": "near_field"
        }
      },
      "output": {
        "language": "fr"
      }
    }
  }
}
```

<a id="session.updated"></a>

## session.updated

Returned when a translation session is updated with a `session.update` event,
unless there is an error.

### Schema

Schema name: `RealtimeTranslationServerEventSessionUpdated`

- `event_id: string`

  The unique ID of the server event.

- `session: RealtimeTranslationSession`

  The translation session configuration.

  - `id: string`

    Unique identifier for the session that looks like `sess_1234567890abcdef`.

  - `audio: object { input, output }`

    Configuration for translation input and output audio.

    - `input: optional object { noise_reduction, transcription }`

      - `noise_reduction: optional object { type }  or null`

        Optional input noise reduction.

        - `type: NoiseReductionType`

          Type of noise reduction. `near_field` is for close-talking microphones such as headphones, `far_field` is for far-field microphones such as laptop or conference room microphones.

          - `"near_field"`

          - `"far_field"`

      - `transcription: optional object { model }  or null`

        Optional source-language transcription. When configured, the server emits
        `session.input_transcript.delta` events. Translation itself still runs from
        the input audio stream.

        - `model: string`

          The transcription model used for source transcript deltas.

    - `output: optional object { language }`

      - `language: optional string`

        Target language for translated output audio and transcript deltas.

  - `expires_at: number`

    Expiration timestamp for the session, in seconds since epoch.

  - `model: string`

    The Realtime translation model used for this session. This field is set at
    session creation and cannot be changed with `session.update`.

  - `type: "translation"`

    The session type. Always `translation` for Realtime translation sessions.

    - `"translation"`

- `type: "session.updated"`

  The event type, must be `session.updated`.

  - `"session.updated"`

### Example

```json
{
  "type": "session.updated",
  "event_id": "event_124",
  "session": {
    "id": "sess_123",
    "type": "translation",
    "model": "gpt-realtime-translate",
    "expires_at": 1714857600,
    "audio": {
      "input": {
        "transcription": {
          "model": "gpt-realtime-whisper",
          "language": "en"
        },
        "noise_reduction": {
          "type": "near_field"
        }
      },
      "output": {
        "language": "es"
      }
    }
  }
}
```

<a id="session.closed"></a>

## session.closed

Returned when a realtime translation session is closed.

### Schema

Schema name: `RealtimeTranslationServerEventSessionClosed`

- `event_id: string`

  The unique ID of the server event.

- `type: "session.closed"`

  The event type, must be `session.closed`.

  - `"session.closed"`

### Example

```json
{
  "event_id": "event_987",
  "type": "session.closed"
}
```

<a id="session.input_transcript.delta"></a>

## session.input_transcript.delta

Returned when optional source-language transcript text is available. This event
is emitted only when `audio.input.transcription` is configured.

Transcript deltas are append-only text fragments. Clients should not insert
unconditional spaces between deltas.

### Schema

Schema name: `RealtimeTranslationServerEventSessionInputTranscriptDelta`

- `delta: string`

  Append-only source-language transcript text.

- `event_id: string`

  The unique ID of the server event.

- `type: "session.input_transcript.delta"`

  The event type, must be `session.input_transcript.delta`.

  - `"session.input_transcript.delta"`

- `elapsed_ms: optional number or null`

  Timing metadata for stream alignment, derived from the translation frame
  when available. It advances in 200 ms increments, but multiple transcript
  deltas may share the same `elapsed_ms`. Treat it as alignment metadata,
  not a unique transcript-delta identifier.

### Example

```json
{
  "event_id": "event_125",
  "type": "session.input_transcript.delta",
  "delta": " hear",
  "elapsed_ms": 1200
}
```

<a id="session.output_transcript.delta"></a>

## session.output_transcript.delta

Returned when translated transcript text is available.

Transcript deltas are append-only text fragments. Clients should not insert
unconditional spaces between deltas.

### Schema

Schema name: `RealtimeTranslationServerEventSessionOutputTranscriptDelta`

- `delta: string`

  Append-only transcript text for the translated output audio.

- `event_id: string`

  The unique ID of the server event.

- `type: "session.output_transcript.delta"`

  The event type, must be `session.output_transcript.delta`.

  - `"session.output_transcript.delta"`

- `elapsed_ms: optional number or null`

  Timing metadata for stream alignment, derived from the translation frame
  when available. It advances in 200 ms increments, but multiple transcript
  deltas may share the same `elapsed_ms`. Treat it as alignment metadata,
  not a unique transcript-delta identifier.

### Example

```json
{
  "event_id": "event_124",
  "type": "session.output_transcript.delta",
  "delta": " escuch",
  "elapsed_ms": 1200
}
```

<a id="session.output_audio.delta"></a>

## session.output_audio.delta

Returned when translated output audio is available. The `delta` contains a
PCM16 audio chunk whose length can vary. Clients should decode and queue the
complete delta instead of assuming a fixed byte or sample count.

### Schema

Schema name: `RealtimeTranslationServerEventSessionOutputAudioDelta`

- `delta: string`

  Base64-encoded translated audio data.

- `event_id: string`

  The unique ID of the server event.

- `type: "session.output_audio.delta"`

  The event type, must be `session.output_audio.delta`.

  - `"session.output_audio.delta"`

- `channels: optional number`

  Number of audio channels.

- `elapsed_ms: optional number or null`

  Timing metadata for stream alignment, derived from the translation frame
  when available. Treat `elapsed_ms` as alignment metadata, not a unique
  event identifier.

- `format: optional "pcm16"`

  Audio encoding for `delta`.

  - `"pcm16"`

- `sample_rate: optional number`

  Sample rate of the audio delta.

### Example

```json
{
  "event_id": "event_123",
  "type": "session.output_audio.delta",
  "delta": "Base64EncodedAudioDelta",
  "sample_rate": 24000,
  "channels": 1,
  "format": "pcm16",
  "elapsed_ms": 1200
}
```
