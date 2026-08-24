> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

## Retrieve ChatKit thread

**get** `/chatkit/threads/{thread_id}`

Retrieve a ChatKit thread by its identifier.

### Path Parameters

- `thread_id: string`

### Returns

- `ChatKitThread object { id, created_at, object, 3 more }`

  Represents a ChatKit thread and its current status.

  - `id: string`

    Identifier of the thread.

  - `created_at: number`

    Unix timestamp (in seconds) for when the thread was created.

  - `object: "chatkit.thread"`

    Type discriminator that is always `chatkit.thread`.

    - `"chatkit.thread"`

  - `status: object { type }  or object { reason, type }  or object { reason, type }`

    Current status for the thread. Defaults to `active` for newly created threads.

    - `Active object { type }`

      Indicates that a thread is active.

      - `type: "active"`

        Status discriminator that is always `active`.

        - `"active"`

    - `Locked object { reason, type }`

      Indicates that a thread is locked and cannot accept new input.

      - `reason: string or null`

        Reason that the thread was locked. Defaults to null when no reason is recorded.

      - `type: "locked"`

        Status discriminator that is always `locked`.

        - `"locked"`

    - `Closed object { reason, type }`

      Indicates that a thread has been closed.

      - `reason: string or null`

        Reason that the thread was closed. Defaults to null when no reason is recorded.

      - `type: "closed"`

        Status discriminator that is always `closed`.

        - `"closed"`

  - `title: string or null`

    Optional human-readable title for the thread. Defaults to null when no title has been generated.

  - `user: string`

    Free-form string that identifies your end user who owns the thread.

### Example

```http
curl https://api.openai.com/v1/chatkit/threads/$THREAD_ID \
    -H 'OpenAI-Beta: chatkit_beta=v1' \
    -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "cthr_def456",
  "created_at": 1712345600,
  "object": "chatkit.thread",
  "status": {
    "type": "active"
  },
  "title": "Demo feedback",
  "user": "user_456"
}
```

### Example

```http
curl https://api.openai.com/v1/chatkit/threads/cthr_abc123 \
  -H "OpenAI-Beta: chatkit_beta=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

#### Response

```json
{
  "id": "cthr_abc123",
  "object": "chatkit.thread",
  "title": "Customer escalation",
  "items": {
    "data": [
      {
        "id": "cthi_user_001",
        "object": "chatkit.thread_item",
        "type": "user_message",
        "content": [
          {
            "type": "input_text",
            "text": "I need help debugging an onboarding issue."
          }
        ],
        "attachments": []
      },
      {
        "id": "cthi_assistant_002",
        "object": "chatkit.thread_item",
        "type": "assistant_message",
        "content": [
          {
            "type": "output_text",
            "text": "Let's start by confirming the workflow version you deployed."
          }
        ]
      }
    ],
    "has_more": false
  }
}
```
