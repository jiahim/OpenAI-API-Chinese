# Telephony and SIP

> 完整文档索引请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

选择你的 API 以查看其连接步骤和会话事件。



## 选择电话连接

可以通过 SIP 中继，或通过转发音频的应用程序，来与 GPT-Live 通话。选择与现有电话系统相匹配、并能让你在需要时由应用程序处理音频的路径。

| Connection          | 音频和应用职责                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Direct SIP          | 提供商与 OpenAI 交换通话音频。你的应用负责处理 webhook、会话配置、通话决策和业务逻辑。             |
| Server audio bridge | 你的应用通过 WebSocket 将提供商或房间音频中继到 GPT-Live，并管理两侧连接、事件转换、播放和通话生命周期。 |

服务商的连接与你的应用之间的连接，以及你的应用与 OpenAI 之间的连接是相互独立的。例如，呼叫方可以通过 SIP 加入房间，而该房间内的 智能体 则通过 WebSocket 连接到 GPT-Live。

正在使用 Twilio、Telnyx、LiveKit 或 Daily/Pipecat？请参阅 [GPT-Live 合作伙伴集成](https://developers.openai.com/api/docs/guides/live-partner-integrations) ，查看针对各服务商的指南。

### Direct SIP

Direct SIP 会将通话音频保留在提供商到 OpenAI 的媒体路径上。SIP 信令使用 TLS，GPT-Live 要求通话音频使用 SRTP。你的后端仍然负责来电决策、会话配置、授权以及业务逻辑。

当需要时，请使用 [边带连接](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live) ，以便你的后端接收会话事件或发送命令。它会附加到现有会话上，而音频由 SIP 传输。为每个操作分配一个处理程序，避免重复的 webhook 投递或在多个连接上观察到的事件导致工具被重复执行。

### 处理来电

确认你的项目已启用 GPT-Live SIP 支持，并确认你的运营商 SIP 中继已路由到该项目，然后再使用此流程。
  在使用此流程之前，请确保运营商的 SIP 中继已正确路由到该项目。

#### 接收来电

为你项目的 [webhook 端点](https://developers.openai.com/api/docs/guides/webhooks) 用于 `live.transport.incoming`。验证 webhook 签名并对投递进行去重，然后接受或拒绝该通话。

webhook 通过 `data.type: "sip"` 标识一次 SIP 通话，并提供 `data.session_id`。在每次 Live 通话操作中保持该会话 ID 不变。将 `data.sip_headers` 视为不可信的来电方元数据，而非授权依据。

已有的集成可能仍会收到已弃用的 `live.call.incoming` 事件，该事件不包含 `data.type`。迁移期间，需同时处理两个名称，并保留旧订阅，直至历史投递和重试全部排空。同一个待处理通话也可能触发 Realtime webhook；请将接受/拒绝决策交给同一个处理器，而不是同时通过两个 API 接受。

#### 接受或拒绝通话

应用你的应用的授权和路由规则。要 [接听来电](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/accept)，请发送一个经过身份验证的 `POST /v1/live/sessions/{session_id}/accept` 请求，并在顶层包含一个 `session` 对象：

```json
{
  "session": {
    "type": "live",
    "model": "gpt-live-1",
    "instructions": "You are answering an inbound support call.",
    "audio": { "output": { "voice": "marin" } },
    "delegation": { "type": "client" }
  }
}
```

使用 `Authorization: Bearer $OPENAI_API_KEY` 从你信任的后端发起通话控制请求。在接听时选择语音和委托模式。SIP 会协商音频格式，因此省略 `audio.format`。该示例选择了客户端委托；你的后端必须处理被委托的工作。参阅 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation) 了解客户端与 Responses 的配置。

成功的接听会返回 `200 OK` ，并在会话初始化后返回空响应体。在将通话视为已接听之前，请先处理 HTTP 错误。

要 [拒接来电](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/reject)，请发送 `POST /v1/live/sessions/{session_id}/reject` 并附带 SIP 状态码，例如 `{ "status_code": 486 }` 表示忙线。状态码必须是 300 到 699 之间的整数。第一次接听或拒接决定生效；之后冲突的决定会返回 `decision_already_made`.

#### 接入你的后端

接受后，连接一个 [边带 WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live) 在 `wss://api.openai.com/v1/live/sessions/{session_id}/attach`. 使用已接受的会话 ID 以及相同的项目认证和连接头。不要发送 `session.start` 再次发送。

SIP 承载通话音频。使用边带传输转写、委派、工具、命令和回传音频。为每个副作用选择一个所有者，即使有多个连接观察到同一事件也是如此。

#### 观察键盘事件

边带接收 `transport.dtmf.received` 当调用方按键时，以及 `transport.dtmf.send` 在 托管工具 成功发送一个音调之后。两者都仅为通知。 `event` 字段包含以下值之一 `0`–`9`, `*`, `#`，或 `A`–`D`.

#### 转移或结束通话

要 [transfer the call](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/refer)，请发送 `POST /v1/live/sessions/{session_id}/refer` 使用 `{ "target_uri": "sip:agent@example.com" }` 。若要 [hang up](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/hangup)，请发送 `POST /v1/live/sessions/{session_id}/hangup` ，请求体为空。两者都会返回 `200 OK` ，在成功时响应体为空。

请保持侧信道开放，直到 `session.closed` 返回最终的用量信息后再释放应用资源。如果连接先断开，请记录终结未完成。参见 [用量与优雅关闭](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) 了解终结及关闭原因。

### 发起外呼电话

通过你的 SIP 提供商拨打电话，使用 [创建会话](https://developers.openai.com/api/reference/resources/live/methods/create)。提供商负责电话网络连接，而 GPT-Live 负责承载对话。

必须为你的组织启用出站 SIP 呼叫功能。该功能可通过
  Live API 使用，但不可通过 Realtime API 的呼叫创建端点使用。

#### 配置你的主干

使用支持 TLS 信令、Opus 音频和 SDES-SRTP 媒体的中继。在发起呼叫之前，在你的服务提供商设置中启用 Opus 和 SRTP。

在每个请求中提供中继配置：

| 字段                           | 值                                                                                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `transport.destination`         | 要呼叫的电话号码，采用 E.164 格式，例如 `+14155550123`。不支持 SIP URI 目的地。          |
| `transport.trunk.provider_url`  | 提供商端点，例如 `sips:sip.example.com:5061`。默认端口为 `5061`; `;transport=tcp` 可选。 |
| `transport.trunk.auth.type`     | `digest` 用于 SIP Digest 身份验证。                                                                            |
| `transport.trunk.auth.username` | 你的提供商的 SIP 用户名。                                                                                      |
| `transport.trunk.auth.password` | 你的提供商的 SIP 密码。                                                                                      |
| `transport.trunk.caller_number` | 发送给提供商的呼叫方电话号码，采用 E.164 格式。                                                 |

提供商端点必须使用 `sips:` 进行 TLS 信令。不要在 URL 中包含凭据、路径、URI 标头或其他 URI 参数。本地主机名和字面私有或本地 IP 地址将被拒绝。请将你的 OpenAI API 密钥和 SIP 凭据保存在你的服务器上。

#### 创建会话

发送 `POST /v1/live/sessions` 并附带你的会话配置， `transport.type: "sip"`。在创建会话时选择语音和委托模式。省略 `audio.format` ，因为 SIP 会协商音频格式。

本示例使用 `curl` 和 `jq`。设置 `OPENAI_API_KEY`, `SIP_USERNAME`，以及 `SIP_PASSWORD` 到你的服务器环境中，并将示例提供商的端点和电话号码替换为你自己的值。该示例选择客户端委托；你的后端必须处理 [委托工作](https://developers.openai.com/api/docs/guides/live-delegation).

```bash
jq -n \
  --arg username "$SIP_USERNAME" \
  --arg password "$SIP_PASSWORD" \
  '{
    "session": {
      "model": "gpt-live-1",
      "instructions": "Help the user schedule an appointment.",
      "audio": { "output": { "voice": "marin" } },
      "delegation": { "type": "client" }
    },
    "transport": {
      "type": "sip",
      "destination": "+14155550123",
      "trunk": {
        "provider_url": "sips:sip.example.com:5061",
        "auth": {
          "type": "digest",
          "username": $username,
          "password": $password
        },
        "caller_number": "+14155550100"
      }
    }
  }' | curl https://api.openai.com/v1/live/sessions \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

请求在会话初始化后返回 `200 OK` ，内容如下：

```json
{
  "session": { "id": "live_123" },
  "transport": { "type": "sip" }
}
```

此响应并不意味着呼叫已被接听。它不包含 SDP 或中继凭据。保留 `session.id` 不变，以用于边带连接和呼叫控制。对于外呼呼叫，你不需要来电 webhook 或接听请求。

#### 监听并结束通话

将你的后端接入 `wss://api.openai.com/v1/live/sessions/{session_id}/attach` 时使用你的 OpenAI API 密钥。请勿重复发送 `session.start` 。 [边带连接](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live) 承载会话事件、委派任务和通话进度，音频则由 SIP 承载。

| Event                | 含义                                                                                   |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `transport.ringing`  | 提供商报告响铃或早期媒体。                                              |
| `transport.answered` | 呼叫已应答并建立媒体连接。                                      |
| `transport.failed`   | 会话初始化后呼叫建立失败。请检查 `error.code` 和 `error.message`. |

每个通话进展事件都包含 `event_id` 和 `session_id`。在创建后立即附加：副带只会重放最近 3 秒内的事件，因此稍后才附加可能会错过更早的通话进展。重放的事件保留其原始事件 ID。请根据 `event_id`.

使用与 [转接](#transfer-or-end-the-call) 和 [挂断](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/hangup) 时所使用的相同的动作操作。让副带保持开启状态以接收 `session.closed` 和最终使用情况，如 [用量与优雅关闭](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close).

#### 处理限制与错误

呼出 SIP 请求的 body 上限为 1 MiB。振铃时间最长 3 分钟，已接通通话最长 2 小时。这些限制在创建请求中不可配置。

一个 `403` 响应以及 `outbound_sip_not_enabled` 表示你的组织未启用呼出通话功能。创建请求会返回会话配置无效。传输建立失败可能返回 `502`，而初始化超时则返回 `504`。创建成功后，可监控 `transport.failed` 以发现异步建立失败。

每次创建请求都会发起一通新的通话。 `X-Client-Request-Id` 不会
  对请求进行去重。在出现不明确超时或
  连接失败时，请勿自动重试：重试可能会再发起一通通话。

### 服务端音频桥接

使用 [GPT-Live WebSocket connection](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) 当你的应用从电话服务商或智能体框架接收音频流时。应用对两条连接进行身份验证，转换它们的事件封装，并在两个方向上中继音频。

GPT-Live 支持在 WebSocket 上以 8 kHz 传输原始 G.711 μ-law 和 A-law 音频。当服务商流使用相同的编解码器、采样率和声道数时，你的应用可以转发原始音频字节，无需将其转换为 PCM。请保持音频顺序，并按每条连接所需的消息格式封装音频字节。

让你的桥接管理排队的音频、用户打断和通话结束。在处理播放时，请考虑服务商缓冲的音频。参见 [Managing sessions](https://developers.openai.com/api/docs/guides/live-conversations) 了解 Live 会话的生命周期，以及 [Migrate to GPT-Live](https://developers.openai.com/api/docs/guides/live-migration) 中关于轮次切换和播放控制的变更。

将服务商的通话或房间标识符与 OpenAI 会话 ID 保存在一起，以便在两个系统间追踪会话。

## GPT-Live 后续步骤

- [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)：将服务端音频流连接到 GPT-Live。
- [Webhook 与服务端控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live)：在你的后端管理会话。
- [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation)：将语音连接到你的推理和工具后端。
- [管理会话](https://developers.openai.com/api/docs/guides/live-conversations)：处理转录、会话状态和关闭。






[SIP](https://en.wikipedia.org/wiki/Session_Initiation_Protocol) 是一种
用于通过互联网拨打电话的协议。借助 SIP 和
Realtime API，你可以将来电转接到该 API。

## 概述

如果你想将一个电话号码接入 Realtime API，
可以使用 SIP 中继提供商（例如 Twilio）。该服务能够将你的电话通话转换为 IP 流量。从 SIP 中继
提供商那里购买到电话号码后，请按照以下说明进行操作。
请按照以下说明操作。

首先创建一个 [webhook](https://developers.openai.com/api/docs/guides/webhooks) 用于接听来电，访问你的 **platform.openai.com** [settings](https://platform.openai.com/settings) > 项目 > **Webhooks**.
然后，将你的 SIP 中继指向 OpenAI SIP 端点，并使用配置了 webhook 的项目 ID
例如： `sip:$PROJECT_ID@sip.api.openai.com;transport=tls`.
如需欧洲数据驻留，请使用 `sip:$PROJECT_ID@sip-eu.api.openai.com;transport=tls` 。
要查找你的 `$PROJECT_ID`，请访问 [settings](https://platform.openai.com/settings) > 项目 > **常规**。该页面会显示项目 ID，其中
将以 `proj_` 前缀。

当 OpenAI 收到与你的项目关联的 SIP 流量时，
你的 Webhook 会被触发。触发的事件为
[`realtime.call.incoming`](https://developers.openai.com/api/reference/resources/webhooks) 事件，
示例如下：

```
POST https://my_website.com/webhook_endpoint
user-agent: OpenAI/1.0 (+https://platform.openai.com/docs/webhooks)
content-type: application/json
webhook-id: wh_685342e6c53c8190a1be43f081506c52 # unique id for idempotency
webhook-timestamp: 1750287078 # timestamp of delivery attempt
webhook-signature: v1,K5oZfzN95Z9UVu1EsfQmfVNQhnkZ2pj9o9NDN/H/pI4= # signature to verify authenticity from OpenAI

{
  "object": "event",
  "id": "evt_685343a1381c819085d44c354e1b330e",
  "type": "realtime.call.incoming",
  "created_at": 1750287018, // Unix timestamp
  "data": {
    "call_id": "some_unique_id",
    "sip_headers": [
      { "name": "From", "value": "sip:+142555512112@sip.example.com" },
      { "name": "To", "value": "sip:+18005551212@sip.example.com" },
      { "name": "Call-ID", "value": "03782086-4ce9-44bf-8b0d-4e303d2cc590"}
    ]
  }
}
```

通过此 Webhook，你可以使用 `call_id` 来自 webhook 的值。
在接受呼叫时，你需要为 Realtime API 会话提供所需的配置
（指令、语音等）。
建立连接后，你可以设置 WebSocket 并照常监听会话。用于接受、拒绝、监听、转接和挂断通话的 API
接口在下方文档中说明。

## 接受呼叫

使用 [Accept call endpoint](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/accept) 以
批准来电并配置将应答该来电的实时会话。
请发送与你在
[`create client secret`](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create)
请求中相同的参数，也就是说，在将
桥接到模型之前，请确保已设置实时模型、语音、工具或指令。

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/accept" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "type": "realtime",
        "model": "gpt-realtime-2.1",
        "instructions": "You are Alex, a friendly concierge for Example Corp."
      }'
```


请求路径必须包含来自 `call_id` webhook
[`realtime.call.incoming`](https://developers.openai.com/api/reference/resources/webhooks)
的该参数，且每个请求都需要上文所示的 `Authorization` 标头。该
端点在 SIP 通话振铃且实时会话 `200 OK` 正在建立时返回
。

## 拒绝该调用

使用 [拒绝来电端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/reject) 以
当你不想处理来电时拒绝邀请（例如，来自
不支持的国家代码）。提供 `call_id` 路径参数
以及一个可选的 SIP `status_code` （例如， `486` 以表示“忙”）在 JSON
请求体中以控制回传给运营商的响应。

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/reject" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status_code": 486}'
```


如果未提供状态码，API 默认使用 `603 Decline` 。一次
成功的请求会在 OpenAI 发送 SIP `200 OK` 响应后返回
。

## 监控通话事件

在你接通通话后，向同一会话打开一个 WebSocket 连接以
流式传输事件并发出实时命令。请注意，当使用
参数连接到现有 `call_id` 参数时， `model` 参数未被使用（因为它已经通过
端点进行了配置 `accept` ）。

### WebSocket 请求

`GET wss://api.openai.com/v1/realtime?call_id={call_id}`

### 查询参数

| 参数 | 类型   | 说明                                           |
| --------- | ------ | ----------------------------------------------------- |
| `call_id` | string | 来自 webhook 的标识符 `realtime.call.incoming` webhook。 |

### 标头

- `Authorization: Bearer YOUR_API_KEY`

该 WebSocket 的行为与任何其他 Realtime API 连接完全一致。发送
[`response.create`](https://developers.openai.com/api/reference/resources/realtime/client-events#response.create),
以及其他客户端事件来控制通话，并监听服务端事件以
跟踪进度。参阅 [Webhooks 和 服务端 控件](https://developers.openai.com/api/docs/guides/voice-server-controls?api=realtime)
了解更多信息。

```javascript
import WebSocket from "ws";

const callId = "rtc_u1_9c6574da8b8a41a18da9308f4ad974ce";
const ws = new WebSocket(`wss://api.openai.com/v1/realtime?call_id=rtc_u1_9c6574da8b8a41a18da9308f4ad974ce`, {
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
});

ws.on("open", () => {
  ws.send(
    JSON.stringify({
      type: "response.create",
    })
  );
});
```


## 重定向该调用

使用
[Refer call endpoint](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/refer)。转移正在进行的通话。提供
`call_id` ，以及应放入 SIP `target_uri` 标头中的 `Refer-To`
标头（例如 `tel:+14155550123` 或 `sip:agent@example.com`).

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/refer" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"target_uri": "tel:+14155550123"}'
```


OpenAI 返回 `200 OK` 。一旦 REFER 被转发至你的 SIP 提供商，下游系统将负责处理主叫方的其余通话流程。
下游系统将负责处理主叫方的其余通话流程。

## 挂断通话

使用 [挂断端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/hangup)
在你的应用程序应断开主叫方时结束会话。该端点可用于
终止 SIP 和 WebRTC 实时会话。

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/hangup" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


API 在开始拆除通话时会响应 `200 OK` 。

<a id="dedicated-sip-ip-ranges"></a>

## SIP 信令与媒体 IP 范围

Realtime SIP 调用使用独立的网络路径传输信令和媒体。为确保正常运行，
请按下方说明配置你的网络以放行信令和媒体流量。

### SIP signaling

`sip.api.openai.com` 和 `sip-eu.api.openai.com` 是基于 GeoIP 路由的端点。你的网络必须允许
通过 DNS 在该端口解析到的地址发起出站 TCP/TLS 流量 `5061`.

### SRTP media

API 在协商的 SDP 中指定一个独立的媒体 IP 地址和 UDP 端口。你的网络必须
允许通过 UDP 与以下 CIDR 进行双向 SRTP 流量传输：

- `13.79.45.80/28`
- `23.98.140.64/28`
- `40.67.149.176/28`
- `40.83.204.240/28`

## 服务端示例

以下是一个示例的 `realtime.call.incoming` handler。它接受该调用,然后记录来自
Realtime API 的所有事件。

对于 Ruby 示例,请设置 `OPENAI_API_KEY` 和 `OPENAI_WEBHOOK_SECRET`
环境变量,然后使用以下命令安装所需的依赖项
`gem install openai webrick async-websocket`.

处理来电 SIP 呼叫

```python
from flask import Flask, request, Response, jsonify, make_response
from openai import OpenAI, InvalidWebhookSignatureError
import asyncio
import json
import os
import requests
import time
import threading
import websockets

app = Flask(__name__)
client = OpenAI(webhook_secret=os.environ["OPENAI_WEBHOOK_SECRET"])

AUTH_HEADER = {"Authorization": "Bearer " + os.environ["OPENAI_API_KEY"]}

call_accept = {
    "type": "realtime",
    "instructions": "You are a support agent.",
    "model": "gpt-realtime-2.1",
}

response_create = {
    "type": "response.create",
    "response": {
        "instructions": ("Say to the user 'Thank you for calling, how can I help you'")
    },
}


async def websocket_task(call_id):
    try:
        async with websockets.connect(
            "wss://api.openai.com/v1/realtime?call_id=" + call_id,
            additional_headers=AUTH_HEADER,
        ) as websocket:
            await websocket.send(json.dumps(response_create))

            while True:
                response = await websocket.recv()
                print(f"Received from WebSocket: {response}")
    except Exception as e:
        print(f"WebSocket error: {e}")


@app.route("/", methods=["POST"])
def webhook():
    try:
        event = client.webhooks.unwrap(request.data, request.headers)

        if event.type == "realtime.call.incoming":
            requests.post(
                "https://api.openai.com/v1/realtime/calls/"
                + event.data.call_id
                + "/accept",
                headers={**AUTH_HEADER, "Content-Type": "application/json"},
                json=call_accept,
            )
            threading.Thread(
                target=lambda: asyncio.run(websocket_task(event.data.call_id)),
                daemon=True,
            ).start()
            return Response(status=200)
    except InvalidWebhookSignatureError as e:
        print("Invalid signature", e)
        return Response("Invalid signature", status=400)


if __name__ == "__main__":
    app.run(port=8000)
```

```ruby
require "openai"
require "webrick"

client = OpenAI::Client.new(webhook_secret: ENV.fetch("OPENAI_WEBHOOK_SECRET"))
server = WEBrick::HTTPServer.new(
  BindAddress: "127.0.0.1",
  Port: Integer(ENV.fetch("OPENAI_WEBHOOK_PORT", "8000")),
  Logger: WEBrick::Log.new($stderr, WEBrick::BasicLog::WARN),
  AccessLog: []
)
sideband_workers = []

server.mount_proc("/webhook") do |request, response|
  if request.request_method != "POST"
    response.status = 405
    next
  end

  headers = request.header.transform_values(&:first)
  event = client.webhooks.unwrap(request.body, headers)

  if event.is_a?(OpenAI::Models::Webhooks::RealtimeCallIncomingWebhookEvent)
    call_id = event.data.call_id
    sideband_workers.select!(&:alive?)
    sideband_workers << Thread.new(call_id) do |active_call_id|
      client.realtime.calls.accept(
        active_call_id,
        type: :realtime,
        model: "gpt-realtime-2.1",
        instructions: "You are a helpful support agent."
      )

      client.realtime.connect_to_call(call_id: active_call_id) do |connection|
        connection.response.create(
          instructions: "Thank the caller and ask how you can help."
        )
        connection.each do |server_event|
          puts "Realtime event: #{server_event.type}"
        end
      end
    end
  end

  response.status = 200
  response.body = "ok"
rescue OpenAI::Errors::InvalidWebhookSignatureError, ArgumentError
  response.status = 400
  response.body = "Invalid signature"
ensure
  server.shutdown if ENV["OPENAI_WEBHOOK_EXIT_AFTER_REQUEST"] == "1"
end

Signal.trap("INT") do
  sideband_workers.each(&:kill)
  server.shutdown
end
port = server.listeners.first.addr[1]
puts "Webhook server listening on http://127.0.0.1:#{port}/webhook"
$stdout.flush
server.start
sideband_workers.each(&:join)
```


## Next steps

既然你已经通过 SIP 完成连接，可以使用左侧导航或点击这些页面来开始构建你的实时应用。

- [Realtime prompting guide](https://developers.openai.com/api/docs/guides/voice-prompting)
- [管理对话](https://developers.openai.com/api/docs/guides/realtime-conversations)
- [Webhooks 和服务端 控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=realtime)
- [管理成本](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=realtime)
- [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription)

### 其他资源

- [JavaScript demo](https://hello-realtime.val.run/)
- [将 Realtime SIP 连接器连接到 Twilio Elastic SIP Trunking](https://www.twilio.com/en-us/blog/developers/tutorials/product/openai-realtime-api-elastic-sip-trunking)