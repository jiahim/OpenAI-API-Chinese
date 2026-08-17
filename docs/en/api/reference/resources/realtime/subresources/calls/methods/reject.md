> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Reject call

**post** `/realtime/calls/{call_id}/reject`

Decline an incoming SIP call by returning a SIP status code to the caller.

### Path Parameters

- `call_id: string`

### Body Parameters

- `status_code: optional number`

  SIP response code to send back to the caller. Defaults to `603` (Decline)
  when omitted.

### Example

```http
curl https://api.openai.com/v1/realtime/calls/$CALL_ID/reject \
    -X POST \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Example

```http
curl -X POST https://api.openai.com/v1/realtime/calls/$CALL_ID/reject \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status_code": 486}'
```
