> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Create voice

**post** `/audio/voices`

Creates a voice from a text prompt or from a consent recording and an audio sample.

For prompt-based creation, send `type: "prompt"` with a `name` and `prompt` as JSON or multipart form data. Consent-based creation requires multipart form data and is the default when `type` is omitted.

Returns the saved voice's metadata. Use the voice ID in supported audio output endpoints. The response does not include preview audio.

### Body Parameters

- `name: string`

  The name of the new voice.

- `prompt: string`

  A description of the desired voice. Must not contain only whitespace.

- `type: "prompt"`

  Set to `prompt` to create a voice from a text description.

  - `"prompt"`

- `model: optional string or "auto" or "2026-10-01"`

  The voice creation model to use. Defaults to `auto`.

  - `string`

  - `"auto" or "2026-10-01"`

    The voice creation model to use. Defaults to `auto`.

    - `"auto"`

    - `"2026-10-01"`

- `script_hint: optional string`

  Optional text for the voice to speak during creation. If omitted, a script is generated from the prompt. Must not be blank after trimming whitespace; scripts that are too short are rejected.

### Returns

- `Voice object { id, created_at, name, object }`

  A custom voice that can be used for audio output.

  - `id: string`

    The voice identifier, which can be referenced in API endpoints.

  - `created_at: number`

    The Unix timestamp (in seconds) for when the voice was created.

  - `name: string`

    The name of the voice.

  - `object: "audio.voice"`

    The object type, which is always `audio.voice`.

    - `"audio.voice"`

### Example

```http
curl https://api.openai.com/v1/audio/voices \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "name": "x",
          "prompt": "x",
          "type": "prompt"
        }'
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "name": "name",
  "object": "audio.voice"
}
```

### Example

```http
curl https://api.openai.com/v1/audio/voices \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "prompt",
    "name": "Warm narrator",
    "prompt": "A warm, calm narrator with a clear, measured delivery.",
    "model": "auto"
  }'
```
