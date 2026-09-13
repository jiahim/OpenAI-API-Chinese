# Webhooks 事件

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

当 OpenAI 在使用过程中发生某些事件时，会向你指定的 URL 发送 HTTP 请求，这类请求称为 webhook。
事件发生在 API 使用过程中。

[了解有关 webhook 的更多信息](https://developers.openai.com/api/docs/guides/webhooks).

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

  事件数据载荷。

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

当后台响应被取消时发送。

### Schema

Schema name: `WebhookResponseCancelled`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  模型响应被取消时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据载荷。

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

当后台响应失败时触发。

### Schema

Schema name: `WebhookResponseFailed`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  模型响应失败时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据载荷。

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

当后台响应被中断时发送。

### Schema

Schema name: `WebhookResponseIncomplete`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  模型响应被中断时的 Unix 时间戳（单位为秒）。

- `data: object { id }`

  事件数据载荷。

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

当批处理 API 请求已完成时发送。

### Schema

Schema name: `WebhookBatchCompleted`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  该 batch API 请求完成时的 Unix 时间戳（单位为秒）。

- `data: object { id }`

  事件数据载荷。

  - `id: string`

    该 batch API 请求的唯一 ID。

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

当批处理 API 请求被取消时发送。

### Schema

Schema name: `WebhookBatchCancelled`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  批次 API 请求被取消时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据载荷。

  - `id: string`

    该 batch API 请求的唯一 ID。

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

当某个批处理 API 请求已过期时发送。

### Schema

Schema name: `WebhookBatchExpired`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  批处理 API 请求过期时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据载荷。

  - `id: string`

    该 batch API 请求的唯一 ID。

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

当批处理 API 请求失败时发送。

### Schema

Schema name: `WebhookBatchFailed`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  该批量 API 请求失败时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据载荷。

  - `id: string`

    该 batch API 请求的唯一 ID。

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

  事件数据载荷。

  - `id: string`

    该微调任务的唯一 ID。

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

当微调作业失败时发送。

### Schema

Schema name: `WebhookFineTuningJobFailed`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  微调任务失败时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据载荷。

  - `id: string`

    该微调任务的唯一 ID。

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

  微调任务被取消时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据载荷。

  - `id: string`

    该微调任务的唯一 ID。

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

当评测运行成功时发送。

### Schema

Schema name: `WebhookEvalRunSucceeded`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  评估运行成功时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据载荷。

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

在评估运行失败时发送。

### Schema

Schema name: `WebhookEvalRunFailed`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  评估运行失败时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据载荷。

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

  评估运行被取消时的 Unix 时间戳（以秒为单位）。

- `data: object { id }`

  事件数据载荷。

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
同一待处理会话还可以发出 `live.transport.incoming`；首次
成功的 Realtime 或 Live 接受端点将选择运行时表面。

### Schema

Schema name: `WebhookRealtimeCallIncoming`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  模型响应完成时的 Unix 时间戳（以秒为单位）。

- `data: object { call_id, sip_headers }`

  事件数据载荷。

  - `call_id: string`

    Transceiver `rtc_...` 待处理 SIP 会话的 ID。配对的
    `live.transport.incoming` 事件由对应的 Realtime 事件派生出， `session_id` 将事件名的
    `rtc_` 前缀替换为 `live_`。得到。请使用 Realtime 或 Live API 事件返回的 ID。
    对应的 Realtime 或 Live 接口。

  - `sip_headers: array of object { name, value }`

    SIP INVITE 中的请求头，不含 SIP 授权相关请求头。
    保留的字段名、值、重复条目及顺序均会原样保留。
    请将这些值视为不可信的通话元数据。

    - `name: string`

      SIP 请求头的名称。

    - `value: string`

      SIP 请求头的值。

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

已弃用：使用 `live.transport.incoming`。为已有订阅保留
在迁移期间保留；不允许为此事件创建新订阅。
当有传入的 API SIP 会话可供 Live 接受时发送。
同一待处理会话也会发出 `realtime.call.incoming`；首次
成功的 Realtime 或 Live 接受端点将选择运行时表面。

### Schema

Schema name: `WebhookLiveCallIncoming`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  事件创建时的 Unix 时间戳（以秒为单位）。

- `data: object { session_id, sip_headers }`

  事件数据载荷。

  - `session_id: string`

    该 `live_...` 待处理 SIP 会话的 ID。原样传递该值
    到 Live 通话控制和边带连接。对应的
    `realtime.call.incoming` 事件使用单独的 `rtc_...` 通话 ID。

  - `sip_headers: array of object { name, value }`

    SIP INVITE 中的请求头，不含 SIP 授权相关请求头。
    保留的字段名、值、重复条目及顺序均会原样保留。
    请将这些值视为不可信的通话元数据。

    - `name: string`

      SIP 请求头的名称。

    - `value: string`

      SIP 请求头的值。

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

当有传入的 API SIP 会话可供 Live 接受时发送。
同一待处理会话也会发出 `realtime.call.incoming`；首次
成功的 Realtime 或 Live 接受端点将选择运行时表面。

### Schema

Schema name: `WebhookLiveTransportIncoming`

- `id: string`

  事件的唯一 ID。

- `created_at: number`

  事件创建时的 Unix 时间戳（以秒为单位）。

- `data: object { session_id, sip_headers, type }`

  事件数据载荷。

  - `session_id: string`

    该 `live_...` 待处理 SIP 会话的 ID。通过 Live API 接听或拒绝通话时，请原样转发此值
    。

  - `sip_headers: array of object { name, value }`

    SIP INVITE 中的请求头，不含 SIP 授权相关请求头。
    保留的字段名、值、重复条目及顺序均会原样保留。
    请将这些值视为不可信的通话元数据。

    - `name: string`

      SIP 请求头的名称。

    - `value: string`

      SIP 请求头的值。

  - `type: "sip"`

    来电的传输类型。始终为 `sip`.

    - `"sip"`

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

当 API 项目存在已批准的安全警报时发送。

### Schema

Schema name: `WebhookSafetyAlertCreated`

- `id: string`

  该 Webhook 事件的唯一 ID。

- `created_at: number`

  事件创建时的 Unix 时间戳（秒）。

- `data: object { id }`

  - `id: string`

    传递给以下接口的安全告警 ID： `GET /v1/safety/alerts/{id}`.

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

当企业工作区有已批准的安全警报可用时发送。

### Schema

Schema name: `WebhookSafetyOrgAlertCreated`

- `id: string`

  该 Webhook 事件的唯一 ID。

- `created_at: number`

  事件创建时的 Unix 时间戳（秒）。

- `data: object { id }`

  - `id: string`

    传递给以下接口的安全告警 ID： `GET /v1/safety/alerts/{id}`.

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
