# 电话与 SIP

> 完整的文档索引请参见 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，请在页面 URL 后追加 `.md` 即可。

选择你的API 以查看其连接步骤和会话事件。



## 选择电话连接

可以通过 SIP 中继或转发音频的应用程序与 GPT-Live 建立通话。请根据现有电话系统以及应用需要处理音频的位置来选择合适的路径。

| 连接          | 音频与应用职责                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 直接 SIP          | 提供商与OpenAI交换通话音频。你的应用负责处理 webhook、会话配置、通话决策与业务逻辑。             |
| 服务端音频桥接 | 你的应用通过 WebSocket 将提供商或房间的音频中继给 GPT-Live，并同时管理两端连接、事件转换、音频播放和通话生命周期。 |

提供商到应用的连接与应用到 OpenAI 的连接是相互独立的。例如，呼叫方可以通过 SIP 加入房间，而该房间中的智能体则通过 WebSocket 连接到 GPT-Live。

使用 Twilio、Telnyx、LiveKit 或 Daily/Pipecat？请参阅 [GPT-Live 合作伙伴集成](https://developers.openai.com/api/docs/guides/live-partner-integrations) 获取针对各提供商的指南。

### Direct SIP

Direct SIP 将通话音频保留在提供商到 OpenAI 的媒体路径上。SIP 信令使用 TLS，且 GPT-Live 要求通话音频使用 SRTP。你的后端仍然负责来电决策、会话配置、鉴权和业务逻辑。

当你的后端需要接收会话事件或发送命令时，请使用 [旁带连接](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live) 。它在 SIP 传输音频的同时挂载到已有会话上。为每个动作分配一个处理程序，以避免重复的 webhook 投递或在多个连接上观察到的事件重复执行工具。

### 处理调用生命周期

确认你的项目已启用 GPT-Live SIP 支持，并确认
  服务商的 SIP 中继已路由到该项目，然后再使用此流程。

#### 接收来电

配置你项目的 [webhook 端点](https://developers.openai.com/api/docs/guides/webhooks) 用于 `live.transport.incoming`。验证 webhook 签名并对投递去重，然后接受或拒绝该通话。

该 webhook 使用以下字段标识一次 SIP 通话： `data.type: "sip"` 并提供 `data.session_id`。对每次 Live 通话操作，原封不动地使用该会话 ID。将 `data.sip_headers` 视为不可信的来电方元数据，而非授权依据。

现有集成可能仍会收到已弃用的 `live.call.incoming` 事件，该事件没有 `data.type`。迁移期间，需同时处理这两个名称，并保留旧订阅直至历史投递和重试全部排空。同一个待处理的通话还可能发出 Realtime webhook；请指派一个处理程序负责接受/拒绝决策，而不是同时通过两套 API 进行接受。

#### 接受或拒绝该调用

应用你应用的授权和路由规则。若要 [接听呼叫](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/accept)，请发送经过身份验证的 `POST /v1/live/sessions/{session_id}/accept` 请求，并在顶层包含一个 `session` 对象：

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

使用 `Authorization: Bearer $OPENAI_API_KEY` 从你信任的后端发起呼叫控制请求。在接听时选择语音和委托模式。SIP 会协商音频格式，因此请省略 `audio.format`。该示例选择了客户端委托模式；你的后端必须处理委托的任务。参见 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation) 以了解客户端和 Responses 配置。

成功接听后会在会话初始化后返回 `200 OK` ，响应体为空。在将呼叫视为已接听之前，请先处理 HTTP 错误。

若要 [拒绝呼叫](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/reject)，请发送 `POST /v1/live/sessions/{session_id}/reject` ，并附带一个 SIP 状态码，例如 `{ "status_code": 486 }` 表示忙线。状态码必须是 300 到 699 之间的整数。首次接听或拒绝的决定生效；后续冲突的决定会返回 `decision_already_made`.

#### 接入你的后端

接受后，连接一个 [sideband WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live) 到 `wss://api.openai.com/v1/live/sessions/{session_id}/attach`。使用已接受的会话 ID 以及相同的项目身份验证和连接标头。请勿再次发送 `session.start` 。

SIP 承载通话音频。sideband 用于转写、委派、工具、命令和回传音频。为每个副作用选择一个所有者，即使有多个连接观察到同一事件也是如此。

#### 观察键盘事件

边带接收 `transport.dtmf.received` 当主叫方按键时，以及 `transport.dtmf.send` 在 托管工具 成功发送音调之后。两者仅为通知。 `event` 字段包含以下之一 `0`–`9`, `*`, `#`，或 `A`–`D`.

#### 转接或结束通话

若要 [转移通话](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/refer)，请发送 `POST /v1/live/sessions/{session_id}/refer` 使用 `{ "target_uri": "sip:agent@example.com" }` 到目标。如要 [挂断](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/hangup)，请发送 `POST /v1/live/sessions/{session_id}/hangup` 且不携带请求体。两者都返回 `200 OK` ，成功时响应体为空。

保持侧带通道打开，直到 `session.closed` 提供最终的用量信息，然后释放应用资源。如果连接先断开，请将此次终结记录为未完成。参见 [用量与优雅关闭](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) 了解终结与关闭原因。

此流程接受来电。通过 `POST /v1/live/sessions` 发起外拨 SIP 通话不受支持；请改用对应的 [合作伙伴集成](https://developers.openai.com/api/docs/guides/live-partner-integrations) 以进行由服务商负责的外呼。

### 服务端音频桥接

使用 [GPT-Live WebSocket 连接](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) 当你的应用从电话提供商或智能体框架接收音频流时使用该连接。应用会对两端连接进行鉴权，转换它们的事件封装，并在两个方向上转发音频。

GPT-Live 通过 WebSocket 支持 8 kHz 原始 G.711 μ-law 和 A-law 音频。当提供商流使用相同的编解码器、采样率和声道数时，你的应用可以直接转发原始音频字节，无需转换为 PCM。请保持音频顺序，并按各连接所需的消息格式封装音频字节。

让你的桥接程序管理排队音频、中断和通话终止。在处理回放时，需考虑提供商缓冲的音频。参见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations) 了解 Live 会话生命周期，以及 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration) 了解轮换发言与回放控制的变更。

将提供商的通话或房间标识符与 OpenAI 会话 ID 一起保存，以便你可以跨两个系统追踪会话。

## GPT-Live 的后续步骤

- [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live): 将服务器音频流连接到 GPT-Live。
- [Webhooks 和 服务端 控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live): 从你的后端管理会话。
- [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation): 将语音连接到你的推理与工具后端。
- [管理会话](https://developers.openai.com/api/docs/guides/live-conversations): 处理转录文本、会话状态以及关闭会话。






[SIP](https://en.wikipedia.org/wiki/Session_Initiation_Protocol) 是
用于通过互联网拨打电话的协议。通过 SIP 和
Realtime API 你可以将来电转接到 API。

## 概述

如果要将电话号码接入 Realtime API，
请使用 SIP 中继服务提供商（例如 Twilio）。该服务会将你的电话通话
转换为 IP 流量。从你的 SIP 中继服务提供商购买电话号码后，
请按照下面的说明操作。

首先在 [webhook](https://developers.openai.com/api/docs/guides/webhooks) 为来电创建一个 webhook，通过你的 **platform.openai.com** [设置](https://platform.openai.com/settings) > 项目 > **Webhooks**.
然后，将你的 SIP 中继指向 OpenAI SIP 端点，使用配置该 webhook 的项目 ID，
例如， `sip:$PROJECT_ID@sip.api.openai.com;transport=tls`.
若使用欧洲数据驻留，请使用 `sip:$PROJECT_ID@sip-eu.api.openai.com;transport=tls` 。
要查找你的 `$PROJECT_ID`，请访问 [设置](https://platform.openai.com/settings) > 项目 > **常规**。该页面会显示项目 ID，其格式为
开头为 `proj_` prefix。

当 OpenAI 收到与你的项目关联的 SIP 流量时，
你的 Webhook 将被触发。触发的事件是
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

通过此 Webhook，你可以使用来自 Webhook 的 `call_id` 值来接听或拒接来电。
接听来电时，你需要为 Realtime API 会话提供所需的配置
（指令、语音等）。
建立会话后，你可以像往常一样设置 WebSocket 并监听会话。用于接听、拒接、监听、转接和挂断电话的 API
见下文文档。

## 接受通话

使用 [接受呼叫端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/accept) 以
批准来电并配置将应答该来电的实时会话。
发送与
[`create client secret`](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create)
请求中相同的参数，即确保在将
桥接到模型之前已设置实时模型、语音、工具或指令。

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


请求路径必须包含来自 `call_id` 中的
[`realtime.call.incoming`](https://developers.openai.com/api/reference/resources/webhooks)
webhook，并且每个请求都需要上文所示的 `Authorization` 标头。该
端点返回 `200 OK` 一旦 SIP 支路振铃且实时会话
正在建立。

## Reject the call

使用 [拒接通话端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/reject) 以
当你不希望处理来电（例如来自
不支持的国家代码）时拒绝邀请，请提供 `call_id` 路径参数
以及一个可选的 SIP `status_code` （例如， `486` 用于表示“忙”）的 JSON
请求体，以控制回传给运营商的响应。

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/reject" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status_code": 486}'
```


如果未提供状态码，API 默认使用 `603 Decline` 。成功的请求会在 OpenAI 发送 SIP
响应后返回 `200 OK` 响应后返回
响应。

## 监听通话事件

接受通话后，向同一会话建立 WebSocket 连接以
流式传输事件并发出实时命令。请注意，当使用以下方式连接到现有
参数进行呼叫连接时， `call_id` 参数（ `model` 参数将不会被使用（因为它已经通过
端点配置过 `accept` ）。

### WebSocket 请求

`GET wss://api.openai.com/v1/realtime?call_id={call_id}`

### 查询参数

| 参数 | 类型   | 说明                                           |
| --------- | ------ | ----------------------------------------------------- |
| `call_id` | string | 来自 `realtime.call.incoming` webhook。 |

### Headers

- `Authorization: Bearer YOUR_API_KEY`

WebSocket 的行为与任何其他 Realtime API 连接完全一致。发送
[`response.create`](https://developers.openai.com/api/reference/resources/realtime/client-events#response.create),
以及其他客户端事件来控制通话，并监听服务端事件以
跟踪进度。参阅 [Webhooks 和 服务端 controls](https://developers.openai.com/api/docs/guides/voice-server-controls?api=realtime)
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


## 重定向调用

使用以下接口转接正在进行的通话：
[Refer call 端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/refer)。请提供
`call_id` 以及应放入 SIP `target_uri` 头部的 `Refer-To`
（例如 `tel:+14155550123` 或 `sip:agent@example.com`).

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/refer" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"target_uri": "tel:+14155550123"}'
```


OpenAI 在 REFER 被中继到你的 SIP 提供商后返回 `200 OK` 。后续系统会处理主叫方剩余的通话流程。
downstream system handles the rest of the call flow for the caller.

## 挂断通话

通过 [挂断端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/hangup)
结束会话，适用于你的应用应当断开主叫方连接的场景。该端点可用于
同时终止 SIP 和 WebRTC 实时会话。

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/hangup" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


API 会在开始拆除通话时返回 `200 OK` 响应。

<a id="dedicated-sip-ip-ranges"></a>

## SIP 信令与媒体 IP 范围

Realtime SIP calls use separate network paths for signaling and media. To ensure proper operation,
请按照下文所述配置你的网络，以允许信令和媒体流量通过。

### SIP 信令

`sip.api.openai.com` 且 `sip-eu.api.openai.com` 是 GeoIP 路由的端点。你的网络必须允许
在端口上通过 DNS 返回的地址发起出站 TCP/TLS 流量 `5061`.

### SRTP 媒体

API 在协商的 SDP 中指定单独的媒体 IP 地址和 UDP 端口。你的网络必须
允许通过 UDP 与以下 CIDR 之间的双向 SRTP 流量：

- `13.79.45.80/28`
- `23.98.140.64/28`
- `40.67.149.176/28`
- `40.83.204.240/28`

## 服务端示例

以下是 `realtime.call.incoming` 处理程序的示例。它接受呼叫，然后记录来自
Realtime API 的所有事件。

对于 Ruby 示例，请设置 `OPENAI_API_KEY` 且 `OPENAI_WEBHOOK_SECRET`
环境变量，然后使用以下命令安装所需的依赖项
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


## 下一步

既然你已经通过 SIP 完成了连接，可以使用左侧导航栏或点击这些页面来开始构建你的实时应用。

- [Realtime 提示指南](https://developers.openai.com/api/docs/guides/voice-prompting)
- [管理对话](https://developers.openai.com/api/docs/guides/realtime-conversations)
- [Webhook 与服务端控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=realtime)
- [管理成本](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=realtime)
- [Realtime 转录](https://developers.openai.com/api/docs/guides/realtime-transcription)

### 其他资源

- [JavaScript 演示](https://hello-realtime.val.run/)
- [将 Realtime SIP 连接器连接到 Twilio Elastic SIP Trunking](https://www.twilio.com/en-us/blog/developers/tutorials/product/openai-realtime-api-elastic-sip-trunking)