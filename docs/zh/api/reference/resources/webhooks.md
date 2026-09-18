# Webhook 事件

> 完整文档索引请参阅 [llms.txt](/llms.txt)。你可以在页面 URL 末尾追加 `.md` 来获取该页面的 Markdown 版本。

Webhook 是由 OpenAI 在某些事件发生时向你指定的 URL 发出的 HTTP 请求。
这些事件会在使用 API 的过程中发生。

[详细了解 webhook](https://developers.openai.com/api/docs/guides/webhooks).

<a id="response.completed"></a>

## response.completed

当后台响应已完成时发送。

### Schema

Schema name: `WebhookResponseCompleted`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  模型响应完成时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    模型响应的唯一 ID。

- `type: "response.completed"`

  事件的类型。始终为 `response.completed`.

  - `"response.completed"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

在后台响应被取消时发送。

### Schema

Schema name: `WebhookResponseCancelled`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  模型响应被取消时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    模型响应的唯一 ID。

- `type: "response.cancelled"`

  事件的类型。始终为 `response.cancelled`.

  - `"response.cancelled"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

当后台响应失败时发送。

### Schema

Schema name: `WebhookResponseFailed`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  模型响应失败时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    模型响应的唯一 ID。

- `type: "response.failed"`

  事件的类型。始终为 `response.failed`.

  - `"response.failed"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

在后台响应被中断时发送。

### Schema

Schema name: `WebhookResponseIncomplete`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  模型响应被中断时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    模型响应的唯一 ID。

- `type: "response.incomplete"`

  事件的类型。始终为 `response.incomplete`.

  - `"response.incomplete"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

在批量 API 请求完成时发送。

### Schema

Schema name: `WebhookBatchCompleted`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  批量 API 请求完成时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    批量 API 请求的唯一 ID。

- `type: "batch.completed"`

  事件的类型。始终为 `batch.completed`.

  - `"batch.completed"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

在批量API请求被取消时发送。

### Schema

Schema name: `WebhookBatchCancelled`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  取消API批量请求时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    批量 API 请求的唯一 ID。

- `type: "batch.cancelled"`

  事件的类型。始终为 `batch.cancelled`.

  - `"batch.cancelled"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

在批量 API 请求已过期时发送。

### Schema

Schema name: `WebhookBatchExpired`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  该批次 API 请求过期时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    批量 API 请求的唯一 ID。

- `type: "batch.expired"`

  事件的类型。始终为 `batch.expired`.

  - `"batch.expired"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

当某个批量 API 请求失败时发送。

### Schema

Schema name: `WebhookBatchFailed`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  批处理 API 请求失败时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    批量 API 请求的唯一 ID。

- `type: "batch.failed"`

  事件的类型。始终为 `batch.failed`.

  - `"batch.failed"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

当微调任务成功时发送。

### Schema

Schema name: `WebhookFineTuningJobSucceeded`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  微调任务成功时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    微调任务的唯一 ID。

- `type: "fine_tuning.job.succeeded"`

  事件的类型。始终为 `fine_tuning.job.succeeded`.

  - `"fine_tuning.job.succeeded"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

当微调任务失败时发送。

### Schema

Schema name: `WebhookFineTuningJobFailed`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  微调任务失败时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    微调任务的唯一 ID。

- `type: "fine_tuning.job.failed"`

  事件的类型。始终为 `fine_tuning.job.failed`.

  - `"fine_tuning.job.failed"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

当微调任务被取消时发送。

### Schema

Schema name: `WebhookFineTuningJobCancelled`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  微调作业被取消时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    微调任务的唯一 ID。

- `type: "fine_tuning.job.cancelled"`

  事件的类型。始终为 `fine_tuning.job.cancelled`.

  - `"fine_tuning.job.cancelled"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

在评估运行成功时发送。

### Schema

Schema name: `WebhookEvalRunSucceeded`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  评估运行成功时的 Unix 时间戳（秒）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    评估运行的唯一 ID。

- `type: "eval.run.succeeded"`

  事件的类型。始终为 `eval.run.succeeded`.

  - `"eval.run.succeeded"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

当评测运行失败时发送。

### Schema

Schema name: `WebhookEvalRunFailed`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  评估运行失败时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    评估运行的唯一 ID。

- `type: "eval.run.failed"`

  事件的类型。始终为 `eval.run.failed`.

  - `"eval.run.failed"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

在评估运行被取消时发送。

### Schema

Schema name: `WebhookEvalRunCanceled`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  评估运行被取消时的 Unix 时间戳（单位：秒）。

- `data: object { id }`

  事件数据负载。

  - `id: string`

    评估运行的唯一 ID。

- `type: "eval.run.canceled"`

  事件的类型。始终为 `eval.run.canceled`.

  - `"eval.run.canceled"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

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

当有传入的 API SIP 会话可供 Realtime 接受时发送。
同一挂起会话还可以发出 `live.transport.incoming`; 首个
成功的 Realtime 或 Live accept 端点会选择运行时表面。

### Schema

Schema name: `WebhookRealtimeCallIncoming`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  模型响应完成时的 Unix 时间戳（以秒为单位）。

- `data: object { call_id, sip_headers, sip_media_security }`

  事件数据负载。

  - `call_id: string`

    待处理 SIP 调用的 ID。通过 Realtime
    API 接听或拒接该调用时，请原样传入此值。对于 Live
    API，请改用 `session_id` from 字段 `live.transport.incoming` 。

  - `sip_headers: array of object { name, value }`

    来自 SIP INVITE 的请求头，不含 SIP 鉴权请求头。
    保留的名称、值、重复条目及其顺序均会保留。
    请将这些值视为不可信的调用元数据。

    - `name: string`

      SIP 请求头的名称。

    - `value: string`

      SIP 请求头的值。

  - `sip_media_security: optional "rtp" or "srtp" or string`

    在 SDP 协商过程中为该 SIP 链路选择的媒体保护方式。 `srtp`
    表示 SRTP； `rtp` 表示未加密的 RTP。未知时省略。
    这并不描述 SIP 信令安全性，也
    不能确认媒体是否已经传输。客户端应将无法识别的值视为未知。

    - `"rtp" or "srtp"`

      在 SDP 协商过程中为该 SIP 链路选择的媒体保护方式。 `srtp`
      表示 SRTP； `rtp` 表示未加密的 RTP。未知时省略。
      这并不描述 SIP 信令安全性，也
      不能确认媒体是否已经传输。客户端应将无法识别的值视为未知。

      - `"rtp"`

      - `"srtp"`

    - `string`

- `type: "realtime.call.incoming"`

  事件的类型。始终为 `realtime.call.incoming`.

  - `"realtime.call.incoming"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

```json
{
  "id": "evt_abc123",
  "type": "realtime.call.incoming",
  "created_at": 1719168000,
  "data": {
    "call_id": "rtc_u0_479a275623b54bdb9b6fbae2f7cbd408",
    "sip_media_security": "srtp",
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

已弃用：请使用 `live.transport.incoming`。仅为现有订阅保留
迁移期间；不允许将此事件用于新订阅。
当有传入的 API SIP 会话可供 Live 接受时发送。该
同一挂起会话也可以发出 `realtime.call.incoming`; 首个
成功的 Realtime 或 Live accept 端点会选择运行时表面。

### Schema

Schema name: `WebhookLiveCallIncoming`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  事件创建时的 Unix 时间戳（以秒为单位）。

- `data: object { session_id, sip_headers, sip_media_security }`

  事件数据负载。

  - `session_id: string`

    该 `live_...` 待处理 SIP 会话的 ID。将此值原样传递给
    实时通话控制和边带连接。相应的
    `realtime.call.incoming` 事件使用另一个 `rtc_...` 通话 ID。

  - `sip_headers: array of object { name, value }`

    来自 SIP INVITE 的请求头，不含 SIP 鉴权请求头。
    保留的名称、值、重复条目及其顺序均会保留。
    请将这些值视为不可信的调用元数据。

    - `name: string`

      SIP 请求头的名称。

    - `value: string`

      SIP 请求头的值。

  - `sip_media_security: optional "rtp" or "srtp" or string`

    在 SDP 协商过程中为该 SIP 链路选择的媒体保护方式。 `srtp`
    表示 SRTP； `rtp` 表示未加密的 RTP。未知时省略。
    这并不描述 SIP 信令安全性，也
    不能确认媒体是否已经传输。客户端应将无法识别的值视为未知。

    - `"rtp" or "srtp"`

      在 SDP 协商过程中为该 SIP 链路选择的媒体保护方式。 `srtp`
      表示 SRTP； `rtp` 表示未加密的 RTP。未知时省略。
      这并不描述 SIP 信令安全性，也
      不能确认媒体是否已经传输。客户端应将无法识别的值视为未知。

      - `"rtp"`

      - `"srtp"`

    - `string`

- `type: "live.call.incoming"`

  事件的类型。始终为 `live.call.incoming`.

  - `"live.call.incoming"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

```json
{
  "id": "evt_abc123",
  "type": "live.call.incoming",
  "created_at": 1719168000,
  "data": {
    "session_id": "live_u0_479a275623b54bdb9b6fbae2f7cbd408",
    "sip_media_security": "srtp",
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

当有传入的 API SIP 会话可供 Live 接受时发送。该
同一挂起会话也可以发出 `realtime.call.incoming`; 首个
成功的 Realtime 或 Live accept 端点会选择运行时表面。

### Schema

Schema name: `WebhookLiveTransportIncoming`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  事件创建时的 Unix 时间戳（以秒为单位）。

- `data: object { session_id, sip_headers, type, sip_media_security }`

  事件数据负载。

  - `session_id: string`

    该 `live_...` 待处理 SIP 会话的 ID。在通过 Live API 接听或拒接来电时，原样转发此值
    。

  - `sip_headers: array of object { name, value }`

    来自 SIP INVITE 的请求头，不含 SIP 鉴权请求头。
    保留的名称、值、重复条目及其顺序均会保留。
    请将这些值视为不可信的调用元数据。

    - `name: string`

      SIP 请求头的名称。

    - `value: string`

      SIP 请求头的值。

  - `type: "sip"`

    来电的传输类型。始终为 `sip`.

    - `"sip"`

  - `sip_media_security: optional "rtp" or "srtp" or string`

    在 SDP 协商过程中为该 SIP 链路选择的媒体保护方式。 `srtp`
    表示 SRTP； `rtp` 表示未加密的 RTP。未知时省略。
    这并不描述 SIP 信令安全性，也
    不能确认媒体是否已经传输。客户端应将无法识别的值视为未知。

    - `"rtp" or "srtp"`

      在 SDP 协商过程中为该 SIP 链路选择的媒体保护方式。 `srtp`
      表示 SRTP； `rtp` 表示未加密的 RTP。未知时省略。
      这并不描述 SIP 信令安全性，也
      不能确认媒体是否已经传输。客户端应将无法识别的值视为未知。

      - `"rtp"`

      - `"srtp"`

    - `string`

- `type: "live.transport.incoming"`

  事件的类型。始终为 `live.transport.incoming`.

  - `"live.transport.incoming"`

- `object: optional "event"`

  事件的对象。始终为 `event`.

  - `"event"`

### 示例

```json
{
  "id": "evt_abc123",
  "type": "live.transport.incoming",
  "created_at": 1719168000,
  "data": {
    "type": "sip",
    "session_id": "live_u0_479a275623b54bdb9b6fbae2f7cbd408",
    "sip_media_security": "srtp",
    "sip_headers": [
      {"name": "From", "value": "<sip:alice@example.com>;tag=abc123"},
      {"name": "To", "value": "<sip:recipient@example.com>"},
      {"name": "Call-ID", "value": "call-123@example.com"}
    ]
  }
}
```

<a id="safety.warning_issued"></a>

## safety.warning_issued

当你的组织中的安全标识符发出警告时发送。

### Schema

Schema name: `WebhookSafetyWarningIssued`

- `id: string`

  该 webhook 事件的唯一 ID。

- `created_at: number`

  事件创建时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  - `id: string`

    要传递给的安全用例 ID `GET /v1/safety/cases/{id}`.

- `object: "event"`

  始终为 `event`.

  - `"event"`

- `type: "safety.warning_issued"`

  始终为 `safety.warning_issued`.

  - `"safety.warning_issued"`

### 示例

```json
{
  "id": "evt_123",
  "object": "event",
  "created_at": 1787659200,
  "type": "safety.warning_issued",
  "data": {"id": "C-abc123"}
}
```

<a id="safety.deactivation_issued"></a>

## safety.deactivation_issued

当你的组织中某个安全标识符被停用时发送。

### Schema

Schema name: `WebhookSafetyDeactivationIssued`

- `id: string`

  该 webhook 事件的唯一 ID。

- `created_at: number`

  事件创建时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  - `id: string`

    要传递给的安全用例 ID `GET /v1/safety/cases/{id}`.

- `object: "event"`

  始终为 `event`.

  - `"event"`

- `type: "safety.deactivation_issued"`

  始终为 `safety.deactivation_issued`.

  - `"safety.deactivation_issued"`

### 示例

```json
{
  "id": "evt_123",
  "object": "event",
  "created_at": 1787659200,
  "type": "safety.deactivation_issued",
  "data": {"id": "C-abc123"}
}
```

<a id="safety.alert.created"></a>

## safety.alert.created

在有已批准的安全警报可用于 API 项目时发送。

### Schema

Schema name: `WebhookSafetyAlertCreated`

- `id: string`

  该 webhook 事件的唯一 ID。

- `created_at: number`

  事件创建时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  - `id: string`

    要传递的安全提醒 ID `GET /v1/safety/alerts/{id}`.

- `object: "event"`

  始终为 `event`.

  - `"event"`

- `type: "safety.alert.created"`

  始终为 `safety.alert.created`.

  - `"safety.alert.created"`

### 示例

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

当企业工作区有已批准的安全提醒时发送。

### Schema

Schema name: `WebhookSafetyOrgAlertCreated`

- `id: string`

  该 webhook 事件的唯一 ID。

- `created_at: number`

  事件创建时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  - `id: string`

    要传递的安全提醒 ID `GET /v1/safety/alerts/{id}`.

- `object: "event"`

  始终为 `event`.

  - `"event"`

- `type: "safety.org_alert.created"`

  始终为 `safety.org_alert.created`.

  - `"safety.org_alert.created"`

### 示例

```json
{
  "id": "evt_123",
  "object": "event",
  "created_at": 1787659200,
  "type": "safety.org_alert.created",
  "data": {"id": "alert_0123456789abcdef0123456789abcdef"}
}
```
