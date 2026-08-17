> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Create voice

**post** `/audio/voices`

Creates a custom voice.

### Returns

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
    -H 'Content-Type: multipart/form-data' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F 'audio_sample=@/path/to/audio_sample' \
    -F consent=consent \
    -F name=name
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
  -F "name=My new voice" \
  -F "consent=cons_1234" \
  -F "audio_sample=@$HOME/audio_sample.wav;type=audio/x-wav"
```
