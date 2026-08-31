# 使用 SIP 的 Realtime API

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

[SIP](https://en.wikipedia.org/wiki/Session_Initiation_Protocol) 是一种
用于通过互联网拨打电话的协议。通过 SIP 和
Realtime API，你可以将来电转接到 API。

## 概述

如果要将电话号码接入 Realtime API，
可以使用 SIP 中继服务商（例如 Twilio）。该服务会将你的电话通话
转换为 IP 流量。从 SIP 中继服务商处购买电话号码后，
请按照以下说明操作。

首先创建一个用于 [来电接入的 webhook](https://developers.openai.com/api/docs/guides/webhooks) ，通过你的 **platform.openai.com** [settings](https://platform.openai.com/settings) > 项目 > **Webhooks**.
进行配置。然后，将你的 SIP 中继指向 OpenAI SIP 接入点，使用配置 webhook 时所用的项目 ID，
例如： `sip:$PROJECT_ID@sip.api.openai.com;transport=tls`.
如需欧洲数据驻留，请使用 `sip:$PROJECT_ID@sip-eu.api.openai.com;transport=tls` 。要查找你的。
，请访问 `$PROJECT_ID`，访问 [settings](https://platform.openai.com/settings) > 项目 > **常规**。该页面会显示项目 ID，其
格式为 `proj_` 前缀。

当 OpenAI 接收到与你的项目关联的 SIP 流量时，
你的 webhook 将被触发。触发的事件将是
[`realtime.call.incoming`](https://developers.openai.com/api/reference/resources/webhooks) 事件，
如下示例所示：

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

通过该 webhook，你可以使用 webhook 中的 `call_id` 值来接受或拒接通话。
在接受通话时，你需要为 Realtime API 会话提供所需的配置
（指令、语音等）。
会话建立后，你可以像往常一样设置 WebSocket 并监控该会话。用于
接受、拒接、监控、转接和挂断通话的 API 如下文档所述。

## 接受调用

使用 [Accept call endpoint](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/accept) 以
批准来电并配置将用于应答该来电的实时会话。
发送你在
[`create client secret`](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create)
请求中原本会发送的相同参数，即确保在将
通话桥接到模型之前，实时模型、语音、工具或指令已设置好。

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


请求路径必须包含来自 `call_id` webhook 的
[`realtime.call.incoming`](https://developers.openai.com/api/reference/resources/webhooks)
，并且每个请求都需要上文所示的 `Authorization` 请求头。
端点会在 `200 OK` 返回，前提是 SIP 通道正在响铃并且实时会话
正在建立中。

## 拒绝调用

使用 [拒绝来电端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/reject) 以
当你不希望处理来电时拒绝邀请（例如，来自
不支持的国家代码）。提供 `call_id` 路径参数
和可选的 SIP `status_code` （例如， `486` 以表示“忙”）在请求体中，以控制发送回运营商的响应。
在 JSON 请求体中，以控制发送回运营商的响应。

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/reject" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status_code": 486}'
```


如果未提供状态码，API 默认使用 `603 Decline` 。一个
成功的请求会返回 `200 OK` ，在 OpenAI 交付 SIP 响应之后
。

## 监控调用事件

在你接受通话后，向同一会话打开一个 WebSocket 连接以
流式传输事件并发出实时命令。请注意，当通过现有的
通话使用 `call_id` 参数连接时， `model` 参数不会被使用（因为它已经通过
端点配置过了 `accept` ）。

### WebSocket request

`GET wss://api.openai.com/v1/realtime?call_id={call_id}`

### Query parameters

| 参数 | 类型   | 说明                                           |
| --------- | ------ | ----------------------------------------------------- |
| `call_id` | string | 来自 webhook 的 `realtime.call.incoming` webhook。 |

### Headers

- `Authorization: Bearer YOUR_API_KEY`

WebSocket 的行为与任何其他 Realtime API 连接完全一致。发送
[`response.create`](https://developers.openai.com/api/reference/resources/realtime/client-events#response.create),
以及其他客户端事件来控制通话，并监听服务端事件来
跟踪进度。请参阅 [Webhooks 和 服务端 控件](https://developers.openai.com/api/docs/guides/realtime-server-controls)
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

使用
[Refer call 端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/refer)。转接正在进行的通话。提供
`call_id` 以及 `target_uri` ，该号码应放入 SIP `Refer-To`
header（例如 `tel:+14155550123` 或 `sip:agent@example.com`).

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/refer" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"target_uri": "tel:+14155550123"}'
```


OpenAI 返回 `200 OK` REFER 被转发给你的 SIP 提供商后。下游系统负责处理后续的呼叫流程，
包括主叫方的剩余呼叫流程。

## 挂断通话

通过以下方式结束会话： [挂断端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/hangup)
在你的应用需要断开来电方时调用。该端点可用于
同时终止 SIP 和 WebRTC 实时会话。

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/hangup" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


该 API 在开始拆除通话时返回响应 `200 OK` 。

<a id="dedicated-sip-ip-ranges"></a>

## SIP 信令与媒体 IP 范围

实时 SIP 呼叫的信令与媒体使用不同的网络路径。为确保正常运行，
请按照下文所述配置你的网络，以允许信令和媒体流量通过。

### SIP signaling

`sip.api.openai.com` 并且 `sip-eu.api.openai.com` 是按 GeoIP 路由的端点。你的网络必须允许
对 DNS 在端口上返回的地址发起出站 TCP/TLS 流量 `5061`.

### SRTP media

API 在协商的 SDP 中指定了一个独立的媒体 IP 地址和 UDP 端口。你的网络必须
允许通过 UDP 与以下 CIDR 进行双向 SRTP 通信：

- `13.79.45.80/28`
- `23.98.140.64/28`
- `40.67.149.176/28`
- `40.83.204.240/28`

## 服务端示例

以下是 `realtime.call.incoming` 处理程序示例。它接收呼叫,然后记录来自
Realtime API 的所有事件。

对于 Ruby 示例,请设置 `OPENAI_API_KEY` 并且 `OPENAI_WEBHOOK_SECRET`
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


## 下一步

既然你已经通过 SIP 完成连接，现在可以使用左侧导航或点击以下页面，开始构建你的实时应用。

- [Realtime 提示指南](https://developers.openai.com/api/docs/guides/realtime-models-prompting)
- [管理对话](https://developers.openai.com/api/docs/guides/realtime-conversations)
- [Webhooks 和服务端控制](https://developers.openai.com/api/docs/guides/realtime-server-controls)
- [管理成本](https://developers.openai.com/api/docs/guides/realtime-costs)
- [Realtime 转录](https://developers.openai.com/api/docs/guides/realtime-transcription)

### 其他资源

- [JavaScript 演示](https://hello-realtime.val.run/)
- [将 Realtime SIP Connector 连接到 Twilio Elastic SIP Trunking](https://www.twilio.com/en-us/blog/developers/tutorials/product/openai-realtime-api-elastic-sip-trunking)