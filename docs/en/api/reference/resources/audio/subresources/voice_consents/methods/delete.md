> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Delete voice consent

**delete** `/audio/voice_consents/{consent_id}`

Deletes a voice consent recording.

### Path Parameters

- `consent_id: string`

### Returns

- `id: string`

  The consent recording identifier.

- `deleted: boolean`

- `object: "audio.voice_consent"`

  - `"audio.voice_consent"`

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents/$CONSENT_ID \
    -X DELETE \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "cons_1234",
  "deleted": true,
  "object": "audio.voice_consent"
}
```

### Example

```http
curl https://api.openai.com/v1/audio/voice_consents/cons_1234 \
  -X DELETE \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```
