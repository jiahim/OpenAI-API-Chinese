> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Update voice consent

**post** `/audio/voice_consents/{consent_id}`

Updates a voice consent recording (metadata only).

### Path Parameters

- `consent_id: string`

### Body Parameters

- `name: string`

  The updated label for this consent recording.

### Returns

- `id: string`

  The consent recording identifier.

- `created_at: number`

  The Unix timestamp (in seconds) for when the consent recording was created.

- `language: string`

  The BCP 47 language tag for the consent phrase (for example, `en-US`).

- `name: string`

  The label provided when the consent recording was uploaded.

- `object: "audio.voice_consent"`

  The object type, which is always `audio.voice_consent`.

  - `"audio.voice_consent"`

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents/$CONSENT_ID \
    -H 'Content-Type: application/json' \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d '{
          "name": "name"
        }'
```

#### Response

```json
{
  "id": "cons_1234",
  "created_at": 0,
  "language": "language",
  "name": "name",
  "object": "audio.voice_consent"
}
```

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents/cons_1234 \
  -X POST \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe"
  }'
```
