# Webhooks events

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Webhooks are HTTP requests sent by OpenAI to a URL you specify when certain
events happen during the course of API usage.

[Learn more about webhooks](https://developers.openai.com/api/docs/guides/webhooks).

<a id="response.completed"></a>

## response.completed

Sent when a background response has been completed.

### Schema

Schema name: `WebhookResponseCompleted`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the model response was completed.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the model response.

- `type: "response.completed"`

  The type of the event. Always `response.completed`.

  - `"response.completed"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "response.completed",
  "created_at": 1719168000,
  "data": {
    "id": "resp_abc123"
  }
}
```

<a id="response.cancelled"></a>

## response.cancelled

Sent when a background response has been cancelled.

### Schema

Schema name: `WebhookResponseCancelled`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the model response was cancelled.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the model response.

- `type: "response.cancelled"`

  The type of the event. Always `response.cancelled`.

  - `"response.cancelled"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "response.cancelled",
  "created_at": 1719168000,
  "data": {
    "id": "resp_abc123"
  }
}
```

<a id="response.failed"></a>

## response.failed

Sent when a background response has failed.

### Schema

Schema name: `WebhookResponseFailed`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the model response failed.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the model response.

- `type: "response.failed"`

  The type of the event. Always `response.failed`.

  - `"response.failed"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "response.failed",
  "created_at": 1719168000,
  "data": {
    "id": "resp_abc123"
  }
}
```

<a id="response.incomplete"></a>

## response.incomplete

Sent when a background response has been interrupted.

### Schema

Schema name: `WebhookResponseIncomplete`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the model response was interrupted.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the model response.

- `type: "response.incomplete"`

  The type of the event. Always `response.incomplete`.

  - `"response.incomplete"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "response.incomplete",
  "created_at": 1719168000,
  "data": {
    "id": "resp_abc123"
  }
}
```

<a id="batch.completed"></a>

## batch.completed

Sent when a batch API request has been completed.

### Schema

Schema name: `WebhookBatchCompleted`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the batch API request was completed.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the batch API request.

- `type: "batch.completed"`

  The type of the event. Always `batch.completed`.

  - `"batch.completed"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "batch.completed",
  "created_at": 1719168000,
  "data": {
    "id": "batch_abc123"
  }
}
```

<a id="batch.cancelled"></a>

## batch.cancelled

Sent when a batch API request has been cancelled.

### Schema

Schema name: `WebhookBatchCancelled`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the batch API request was cancelled.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the batch API request.

- `type: "batch.cancelled"`

  The type of the event. Always `batch.cancelled`.

  - `"batch.cancelled"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "batch.cancelled",
  "created_at": 1719168000,
  "data": {
    "id": "batch_abc123"
  }
}
```

<a id="batch.expired"></a>

## batch.expired

Sent when a batch API request has expired.

### Schema

Schema name: `WebhookBatchExpired`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the batch API request expired.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the batch API request.

- `type: "batch.expired"`

  The type of the event. Always `batch.expired`.

  - `"batch.expired"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "batch.expired",
  "created_at": 1719168000,
  "data": {
    "id": "batch_abc123"
  }
}
```

<a id="batch.failed"></a>

## batch.failed

Sent when a batch API request has failed.

### Schema

Schema name: `WebhookBatchFailed`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the batch API request failed.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the batch API request.

- `type: "batch.failed"`

  The type of the event. Always `batch.failed`.

  - `"batch.failed"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "batch.failed",
  "created_at": 1719168000,
  "data": {
    "id": "batch_abc123"
  }
}
```

<a id="fine_tuning.job.succeeded"></a>

## fine_tuning.job.succeeded

Sent when a fine-tuning job has succeeded.

### Schema

Schema name: `WebhookFineTuningJobSucceeded`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the fine-tuning job succeeded.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the fine-tuning job.

- `type: "fine_tuning.job.succeeded"`

  The type of the event. Always `fine_tuning.job.succeeded`.

  - `"fine_tuning.job.succeeded"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "fine_tuning.job.succeeded",
  "created_at": 1719168000,
  "data": {
    "id": "ftjob_abc123"
  }
}
```

<a id="fine_tuning.job.failed"></a>

## fine_tuning.job.failed

Sent when a fine-tuning job has failed.

### Schema

Schema name: `WebhookFineTuningJobFailed`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the fine-tuning job failed.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the fine-tuning job.

- `type: "fine_tuning.job.failed"`

  The type of the event. Always `fine_tuning.job.failed`.

  - `"fine_tuning.job.failed"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "fine_tuning.job.failed",
  "created_at": 1719168000,
  "data": {
    "id": "ftjob_abc123"
  }
}
```

<a id="fine_tuning.job.cancelled"></a>

## fine_tuning.job.cancelled

Sent when a fine-tuning job has been cancelled.

### Schema

Schema name: `WebhookFineTuningJobCancelled`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the fine-tuning job was cancelled.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the fine-tuning job.

- `type: "fine_tuning.job.cancelled"`

  The type of the event. Always `fine_tuning.job.cancelled`.

  - `"fine_tuning.job.cancelled"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "fine_tuning.job.cancelled",
  "created_at": 1719168000,
  "data": {
    "id": "ftjob_abc123"
  }
}
```

<a id="eval.run.succeeded"></a>

## eval.run.succeeded

Sent when an eval run has succeeded.

### Schema

Schema name: `WebhookEvalRunSucceeded`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the eval run succeeded.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the eval run.

- `type: "eval.run.succeeded"`

  The type of the event. Always `eval.run.succeeded`.

  - `"eval.run.succeeded"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "eval.run.succeeded",
  "created_at": 1719168000,
  "data": {
    "id": "evalrun_abc123"
  }
}
```

<a id="eval.run.failed"></a>

## eval.run.failed

Sent when an eval run has failed.

### Schema

Schema name: `WebhookEvalRunFailed`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the eval run failed.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the eval run.

- `type: "eval.run.failed"`

  The type of the event. Always `eval.run.failed`.

  - `"eval.run.failed"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "eval.run.failed",
  "created_at": 1719168000,
  "data": {
    "id": "evalrun_abc123"
  }
}
```

<a id="eval.run.canceled"></a>

## eval.run.canceled

Sent when an eval run has been canceled.

### Schema

Schema name: `WebhookEvalRunCanceled`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the eval run was canceled.

- `data: object { id }`

  Event data payload.

  - `id: string`

    The unique ID of the eval run.

- `type: "eval.run.canceled"`

  The type of the event. Always `eval.run.canceled`.

  - `"eval.run.canceled"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "eval.run.canceled",
  "created_at": 1719168000,
  "data": {
    "id": "evalrun_abc123"
  }
}
```

<a id="realtime.call.incoming"></a>

## realtime.call.incoming

Sent when an incoming API SIP session is available for Realtime acceptance.
The same pending session can also emit `live.transport.incoming`; the first
successful Realtime or Live accept endpoint selects the runtime surface.

### Schema

Schema name: `WebhookRealtimeCallIncoming`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the model response was completed.

- `data: object { call_id, sip_headers }`

  Event data payload.

  - `call_id: string`

    The Transceiver `rtc_...` ID of the pending SIP session. The paired
    `live.transport.incoming` event derives its `session_id` by replacing the
    `rtc_` prefix with `live_`. Use the ID returned by the event with the
    corresponding Realtime or Live API.

  - `sip_headers: array of object { name, value }`

    Headers from the SIP INVITE, excluding SIP authorization headers.
    Retained names, values, repeated entries, and order are preserved.
    Treat these values as untrusted call metadata.

    - `name: string`

      Name of the SIP Header.

    - `value: string`

      Value of the SIP Header.

- `type: "realtime.call.incoming"`

  The type of the event. Always `realtime.call.incoming`.

  - `"realtime.call.incoming"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "realtime.call.incoming",
  "created_at": 1719168000,
  "data": {
    "call_id": "rtc_479a275623b54bdb9b6fbae2f7cbd408",
    "sip_headers": [
      {"name": "Max-Forwards", "value": "63"},
      {"name": "CSeq", "value": "851287 INVITE"},
      {"name": "Content-Type", "value": "application/sdp"}
    ]
  }
}
```

<a id="live.call.incoming"></a>

## live.call.incoming

Deprecated: use `live.transport.incoming`. Retained for existing subscriptions
during migration; new subscriptions to this event are not allowed.
Sent when an incoming API SIP session is available for Live acceptance. The
same pending session can also emit `realtime.call.incoming`; the first
successful Realtime or Live accept endpoint selects the runtime surface.

### Schema

Schema name: `WebhookLiveCallIncoming`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the event was created.

- `data: object { session_id, sip_headers }`

  Event data payload.

  - `session_id: string`

    The `live_...` ID of the pending SIP session. Pass this value unchanged
    to Live call controls and sideband connections. The corresponding
    `realtime.call.incoming` event uses a separate `rtc_...` call ID.

  - `sip_headers: array of object { name, value }`

    Headers from the SIP INVITE, excluding SIP authorization headers.
    Retained names, values, repeated entries, and order are preserved.
    Treat these values as untrusted call metadata.

    - `name: string`

      Name of the SIP Header.

    - `value: string`

      Value of the SIP Header.

- `type: "live.call.incoming"`

  The type of the event. Always `live.call.incoming`.

  - `"live.call.incoming"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "live.call.incoming",
  "created_at": 1719168000,
  "data": {
    "session_id": "live_u0_479a275623b54bdb9b6fbae2f7cbd408",
    "sip_headers": [
      {"name": "From", "value": "<sip:alice@example.com>;tag=abc123"},
      {"name": "To", "value": "<sip:recipient@example.com>"},
      {"name": "Call-ID", "value": "call-123@example.com"}
    ]
  }
}
```

<a id="live.transport.incoming"></a>

## live.transport.incoming

Sent when an incoming API SIP session is available for Live acceptance. The
same pending session can also emit `realtime.call.incoming`; the first
successful Realtime or Live accept endpoint selects the runtime surface.

### Schema

Schema name: `WebhookLiveTransportIncoming`

- `id: string`

  The unique ID of the event.

- `created_at: number`

  The Unix timestamp (in seconds) of when the event was created.

- `data: object { session_id, sip_headers, type }`

  Event data payload.

  - `session_id: string`

    The `live_...` ID of the pending SIP session. Forward this value
    unchanged when accepting or rejecting the call through the Live API.

  - `sip_headers: array of object { name, value }`

    Headers from the SIP INVITE, excluding SIP authorization headers.
    Retained names, values, repeated entries, and order are preserved.
    Treat these values as untrusted call metadata.

    - `name: string`

      Name of the SIP Header.

    - `value: string`

      Value of the SIP Header.

  - `type: "sip"`

    The incoming transport type. Always `sip`.

    - `"sip"`

- `type: "live.transport.incoming"`

  The type of the event. Always `live.transport.incoming`.

  - `"live.transport.incoming"`

- `object: optional "event"`

  The object of the event. Always `event`.

  - `"event"`

### Example

```json
{
  "id": "evt_abc123",
  "type": "live.transport.incoming",
  "created_at": 1719168000,
  "data": {
    "type": "sip",
    "session_id": "live_u0_479a275623b54bdb9b6fbae2f7cbd408",
    "sip_headers": [
      {"name": "From", "value": "<sip:alice@example.com>;tag=abc123"},
      {"name": "To", "value": "<sip:recipient@example.com>"},
      {"name": "Call-ID", "value": "call-123@example.com"}
    ]
  }
}
```

<a id="safety.alert.created"></a>

## safety.alert.created

Sent when an approved safety alert is available for an API project.

### Schema

Schema name: `WebhookSafetyAlertCreated`

- `id: string`

  The unique ID of the webhook event.

- `created_at: number`

  The Unix timestamp in seconds when the event was created.

- `data: object { id }`

  - `id: string`

    The safety alert ID to pass to `GET /v1/safety/alerts/{id}`.

- `object: "event"`

  Always `event`.

  - `"event"`

- `type: "safety.alert.created"`

  Always `safety.alert.created`.

  - `"safety.alert.created"`

### Example

```json
{
  "id": "evt_123",
  "object": "event",
  "created_at": 1787659200,
  "type": "safety.alert.created",
  "data": {"id": "alert_0123456789abcdef0123456789abcdef"}
}
```

<a id="safety.org_alert.created"></a>

## safety.org_alert.created

Sent when an approved safety alert is available for an enterprise workspace.

### Schema

Schema name: `WebhookSafetyOrgAlertCreated`

- `id: string`

  The unique ID of the webhook event.

- `created_at: number`

  The Unix timestamp in seconds when the event was created.

- `data: object { id }`

  - `id: string`

    The safety alert ID to pass to `GET /v1/safety/alerts/{id}`.

- `object: "event"`

  Always `event`.

  - `"event"`

- `type: "safety.org_alert.created"`

  Always `safety.org_alert.created`.

  - `"safety.org_alert.created"`

### Example

```json
{
  "id": "evt_123",
  "object": "event",
  "created_at": 1787659200,
  "type": "safety.org_alert.created",
  "data": {"id": "alert_0123456789abcdef0123456789abcdef"}
}
```
