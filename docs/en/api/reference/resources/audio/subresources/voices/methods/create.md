> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Create voice

**post** `/audio/voices`

Create a custom voice you can use for audio output (for example, in Text-to-Speech and the Realtime API). This requires an audio sample and a previously uploaded consent recording.

Send `name`, `audio_sample`, and the `consent` recording ID as multipart form data. The optional `type` defaults to `audio_sample`.

Returns the saved voice's metadata. See the [custom voices guide](/api/docs/guides/text-to-speech#custom-voices) for requirements and best practices. Custom voices are limited to eligible customers.

### Returns

- `Voice object { id, created_at, name, 2 more }`

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

  - `type: "audio_sample"`

    How the voice was created.

    - `"audio_sample"`

### Example

```http
curl https://api.openai.com/v1/audio/voices \
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'audio_sample=@/path/to/audio_sample' \
    -F consent=consent \
    -F name=x
```

#### Response

```json
{
  "id": "id",
  "created_at": 0,
  "name": "name",
  "object": "audio.voice",
  "type": "audio_sample"
}
```

### Example

```http
curl https://api.openai.com/v1/audio/voices \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -F "name=My new voice" \
  -F "consent=cons_1234" \
  -F "audio_sample=@audio_sample.wav;type=audio/x-wav"
```
