# 电话与 SIP

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。如需获取页面的 Markdown 版本，可在页面 URL 末尾附加 `.md` 。

选择你的应用程序所使用的 API。每个 API 都有各自的认证、会话创建和事件契约。



## 选择电话通信连接

可以通过 SIP 中继或通过转发音频的应用来联系 GPT-Live。选择适合你现有电话系统以及应用需要处理音频位置的路径。

| 连接          | 音频和应用职责                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Direct SIP          | 提供商与OpenAI交换通话音频。你的应用负责处理 webhook、会话配置、通话决策和业务逻辑。             |
| 服务端音频桥接 | 你的应用通过 WebSocket 将提供商或房间的音频中继到 GPT-Live。它同时管理两条连接、事件转换、音频播放和通话生命周期。 |

提供商与你应用的连接，以及你应用与 OpenAI 的连接是相互独立的。例如，呼叫方可以通过 SIP 加入房间，而该房间中的智能体通过 WebSocket 连接到 GPT-Live。

使用 Twilio、Telnyx、LiveKit 或 Daily/Pipecat？请参阅 [GPT-Live 合作伙伴集成](https://developers.openai.com/api/docs/guides/live-partner-integrations) 查看针对各提供商的指南。

### Direct SIP

Direct SIP 将通话音频保留在提供商到 OpenAI 的媒体路径上。SIP 信令使用 TLS，GPT-Live 要求通话音频使用 SRTP。你的后端仍然负责来电决策、会话配置、授权和业务逻辑。

使用 [旁路连接](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live) 当你的后端需要接收会话事件或发送命令时使用。它在 SIP 传输音频的同时挂接到已有的会话上。为每个 action 指派一个处理程序，以避免重复的 webhook 投递或在多个连接上观察到的事件导致工具被重复执行。

将 SIP 路由和提供商配置与使用它们的集成放在一起管理。Realtime webhook 事件、通话标识符和接受负载属于 Realtime API；针对 Live 会话使用 GPT-Live 契约。

### 处理调用的生命周期

在使用此流程之前，请确认你的项目已启用 GPT-Live SIP 支持，并且你的
  提供商的 SIP 中继已路由到该项目。
  另一个标签页中的 Realtime webhook 和 acceptance payloads 属于另一类 API 契约
  契约。

#### 接听来电

配置你项目的 [webhook 端点](https://developers.openai.com/api/docs/guides/webhooks) 以接收 SIP 来电 `live.transport.incoming`。在做出呼叫决定前，请验证 webhook 签名并对投递进行去重。确认收到投递并不代表接受呼叫。

该 webhook 通过 `data.type: "sip"` 来标识一次 SIP 呼叫，并提供 `data.session_id`. 对每次 Live call action 使用该 session ID 且保持不变。将后续会话视为 `data.sip_headers` 视为不可信的调用方元数据，而不是授权。

现有集成可能仍会收到已弃用的 `live.call.incoming` 事件，该事件没有 `data.type`。在迁移期间，需要同时处理这两个名称，并保留旧订阅，直到遗留投递和重试全部排空。同一个待处理呼叫也可能发出 Realtime webhook；将一个 handler 用于 accept/reject 决策，而不是同时通过 API 接受。

#### 接受或拒绝该调用

应用你应用的授权和路由规则。要 [接听通话](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/accept)，发送一个经过身份验证的 `POST /v1/live/sessions/{session_id}/accept` 请求，其中包含顶层 `session` 对象：

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

使用 `Authorization: Bearer $OPENAI_API_KEY` 从你信任的后端发起通话控制请求。在接听时选择语音和委托模式。SIP 会协商音频格式，因此省略 `audio.format`。该示例选择客户端委托；你的后端必须处理被委托的工作。参见 [委托和工具](https://developers.openai.com/api/docs/guides/live-delegation) 了解客户端和 Responses 配置。

成功接听会在会话初始化后返回 `200 OK` ，其 body 为空。在将通话视为已接听之前，请处理 HTTP 错误。

要 [拒绝通话](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/reject)，请发送 `POST /v1/live/sessions/{session_id}/reject` ，并附带 SIP 状态码，例如 `{ "status_code": 486 }` 表示忙线。该状态码必须是 300 到 699 之间的整数。首次接听或拒绝的决定生效；后续冲突的决定会返回 `decision_already_made`.

#### 附加你的后端

通过审核后，请连接一个 [旁带 WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live) ，位于 `wss://api.openai.com/v1/live/sessions/{session_id}/attach`。请使用已接受的会话 ID 以及相同的项目身份验证和连接头部。请勿重复发送 `session.start` 。

SIP 传输通话音频。请使用旁带传输转写、委派、工具、命令和回传音频。即使多个连接同时观察到同一事件，也请为每个副作用选择唯一的执行方。

#### 观察键盘事件

边带会接收 `transport.dtmf.received` 当呼叫方按下按键时，以及 `transport.dtmf.send` 在 托管工具 成功发送音之后。事件的 `event` 字段包含以下之一 `0`–`9`, `*`, `#`，或 `A`–`D`.

这些是观察者通知，而不是客户端命令。请勿发送 `transport.dtmf.send` 来请求音，或假定浏览器数据通道会接收键盘事件。

#### 转接或结束通话

要 [转移通话](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/refer)，请发送 `POST /v1/live/sessions/{session_id}/refer` 使用 `{ "target_uri": "sip:agent@example.com" }` 连接到你的目标。若要 [挂断](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/hangup)，请发送 `POST /v1/live/sessions/{session_id}/hangup` 且不带请求体。两者都会返回 `200 OK` ，成功时响应体为空。

在释放应用资源之前，请保持你的 sideband 开启以接收最终事件和使用情况。成功的挂断请求或意外断开并不能替代 `session.closed`。请参阅 [使用情况与优雅关闭](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) ，了解终结化和关闭原因。

此流程接受来电。通过 `POST /v1/live/sessions` 创建外拨 SIP 通话不受支持；请使用相应的 [合作伙伴集成](https://developers.openai.com/api/docs/guides/live-partner-integrations) 进行由提供商拥有的外拨通话。

### 服务端音频桥接

使用 [GPT-Live WebSocket 连接](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) 当你的应用从电话服务商或智能体 框架接收音频流时使用。应用会对两个连接进行身份验证，转换它们的事件封装，并在两个方向上转发音频。

GPT-Live 在 WebSocket 上支持 8 kHz 的原始 G.711 μ-law 和 A-law 音频。当服务商流使用相同的编解码器、采样率和声道数时，你的应用可以在不转换为 PCM 的情况下转发原始音频字节。保留音频顺序，并使用每个连接所需的消息格式。匹配的音频格式并不会让两个事件协议可以互换使用。

桥接应用同样负责管理它为播放而排队的任何音频。在你的应用设计中要包含服务商缓冲、中断处理以及通话结束。参见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations) 了解 Live 会话生命周期，以及 [迁移到 GPT-Live](https://developers.openai.com/api/docs/guides/live-migration) 了解轮次接管和播放控制的变化。

将服务商的通话或房间标识符与 OpenAI 会话 ID 保存在一起，以便你可以追踪跨这两个系统的会话。

## GPT-Live 的后续步骤

- [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live)：将服务器音频流连接到 GPT-Live。
- [Webhooks 和服务端控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live)：从你的后端管理会话。
- [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation)：将语音连接到你的推理和工具后端。
- [管理会话](https://developers.openai.com/api/docs/guides/live-conversations)：处理转录、会话状态以及关闭。






[SIP](https://en.wikipedia.org/wiki/Session_Initiation_Protocol) 是一种
用于通过互联网拨打电话的协议。使用 SIP 和
Realtime API，你可以将来电转接到该 API。

## 概述

如果要将电话号码接入 Realtime API，
请使用 SIP 中继服务提供商（例如 Twilio）。该服务可将你的电话通话
转换为 IP 流量。从 SIP 中继服务提供商处购买电话号码后，
请按照以下说明操作。

首先创建一个 [webhook](https://developers.openai.com/api/docs/guides/webhooks) 用于接收通话的，通过你的 **platform.openai.com** [设置](https://platform.openai.com/settings) > 项目 > **Webhooks**.
然后，将你的 SIP 中继指向 OpenAI SIP 端点，使用配置 webhook 时所用的项目 ID
，例如， `sip:$PROJECT_ID@sip.api.openai.com;transport=tls`.
如需欧洲数据驻留，请使用 `sip:$PROJECT_ID@sip-eu.api.openai.com;transport=tls` 。
要查找你的 `$PROJECT_ID`，请访问 [设置](https://platform.openai.com/settings) > 项目 > **常规**。该页面会显示项目 ID，该 ID
将带有 `proj_` prefix.

当 OpenAI 收到与你项目关联的 SIP 流量时，
你的 webhook 将被触发。触发的事件将是
[`realtime.call.incoming`](https://developers.openai.com/api/reference/resources/webhooks) 事件，
类似下面的示例：

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

通过此 webhook，你可以使用 webhook 中的 `call_id` 值来接受或拒绝呼叫。
接受呼叫时，你需要为 Realtime API 会话提供所需的配置
（指令、语音等）。
会话建立后，你可以设置 WebSocket 并照常监控该会话。用于接受、拒绝、
监控、转接和挂断呼叫的 API 在下文有详细说明。

## 接受调用

使用 [接听呼叫端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/accept) 以
批准入站呼叫并配置将接听该呼叫的实时会话。
发送与你在
[`create client secret`](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create)
请求中相同的参数，即确保在桥接
通话到模型之前，实时模型、语音、工具或指令已设置好。

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


请求路径必须包含 `call_id` 来自
[`realtime.call.incoming`](https://developers.openai.com/api/reference/resources/webhooks)
webhook，并且每个请求都需要上文所示的 `Authorization` 请求头。该
端点在 SIP 通道振铃且实时会话 `200 OK` 正在建立时返回
。

## 拒绝调用

使用 [Reject call endpoint](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/reject) 以
在你不想处理来电时拒绝邀请（例如，来自
不受支持的国家代码）。提供 `call_id` 路径参数
以及一个可选的 SIP `status_code` （例如， `486` 表示“忙”）在 JSON
请求体中，以控制发送回运营商的响应。

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/reject" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status_code": 486}'
```


如果未提供状态码，API 默认使用 `603 Decline` 。一个
成功的请求会在 OpenAI 发送 SIP `200 OK` 响应后响应
。

## 监控调用事件

在你接受呼叫后，向同一会话打开一个 WebSocket 连接以
流式传输事件并发出实时命令。请注意，当使用以下方式连接到现有的
参数连接到 `call_id` 参数时，该 `model` 参数不会被使用（因为它已经通过
端点进行 `accept` 配置了）。

### WebSocket 请求

`GET wss://api.openai.com/v1/realtime?call_id={call_id}`

### 查询参数

| 参数 | 类型   | 说明                                           |
| --------- | ------ | ----------------------------------------------------- |
| `call_id` | string | 来自 `realtime.call.incoming` webhook 的标识符。 |

### Headers

- `Authorization: Bearer YOUR_API_KEY`

WebSocket 的行为与任何其他 Realtime API 连接完全一致。发送
[`response.create`](https://developers.openai.com/api/reference/resources/realtime/client-events#response.create),
以及其他客户端事件以控制通话，并监听服务端事件以
追踪进度。参阅 [Webhooks 与 服务端 控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=realtime)
以获取更多信息。

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
[Refer call 端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/refer)。转移正在进行的通话。提供
`call_id` 以及要放入 SIP `target_uri` 头中的 `Refer-To`
头（例如 `tel:+14155550123` 或 `sip:agent@example.com`).

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/refer" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"target_uri": "tel:+14155550123"}'
```


OpenAI 在 REFER 被转发到你的 SIP 提供商后返回 `200 OK` 。
下游系统负责处理主叫方后续的通话流程。

## 挂断通话

使用 [挂断端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/hangup)
结束会话，以在应用需要断开来电方时使用。该端点可用于
同时终止 SIP 和 WebRTC 实时会话。

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/hangup" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


该 API 会响应 `200 OK` 以表明开始拆除通话。

<a id="dedicated-sip-ip-ranges"></a>

## SIP 信令与媒体 IP 范围

实时 SIP 通话使用独立的网络路径传输信令和媒体。为确保正常运行，
请按下方所述配置你的网络，以放行信令和媒体流量。

### SIP 信令

`sip.api.openai.com` 并且 `sip-eu.api.openai.com` 是基于 GeoIP 路由的端点。你的网络必须允许
通过 DNS 在端口上返回的地址发起出站 TCP/TLS 流量 `5061`.

### SRTP media

API 在协商的 SDP 中指定单独的媒体 IP 地址和 UDP 端口。你的网络必须
允许通过 UDP 与以下 CIDRs 进行双向 SRTP 流量传输：

- `13.79.45.80/28`
- `23.98.140.64/28`
- `40.67.149.176/28`
- `40.83.204.240/28`

## 服务端示例

以下是 `realtime.call.incoming` handler 的示例。它接受调用，然后记录来自
Realtime API 的所有事件。

对于 Ruby 示例，请设置 `OPENAI_API_KEY` 并且 `OPENAI_WEBHOOK_SECRET`
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


## Next steps

既然你已经通过 SIP 完成连接，可以使用左侧导航或点击以下页面，开始构建你的实时应用。

- [实时提示指南](https://developers.openai.com/api/docs/guides/voice-prompting)
- [管理会话](https://developers.openai.com/api/docs/guides/realtime-conversations)
- [Webhooks 和服务端控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=realtime)
- [管理成本](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=realtime)
- [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription)

### 其他资源

- [JavaScript 演示](https://hello-realtime.val.run/)
- [将 Realtime SIP 连接器连接到 Twilio Elastic SIP Trunking](https://www.twilio.com/en-us/blog/developers/tutorials/product/openai-realtime-api-elastic-sip-trunking)