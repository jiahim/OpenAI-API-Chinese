# Realtime API with SIP

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获得文档页面的 Markdown 版本。

[SIP](https://en.wikipedia.org/wiki/Session_Initiation_Protocol) 是一种
用于通过互联网拨打电话的协议。使用 SIP 和
Realtime API，你可以将来电转接到 API。

## 概述

如果要将电话号码接入 Realtime API，
可以使用 SIP 中继服务商（例如 Twilio）。该服务可以将你的电话通话转换为 IP 流量。
在你从 SIP 中继服务商处购买电话号码后，
请按照以下说明操作。

首先在 [webhook](https://developers.openai.com/api/docs/guides/webhooks) 中为来电创建一个 webhook，通过你的 **platform.openai.com** [设置](https://platform.openai.com/settings) > 项目 > **Webhooks**.
然后，使用你配置了 webhook 的项目 ID，将你的 SIP 中继指向 OpenAI SIP 端点，
例如。， `sip:$PROJECT_ID@sip.api.openai.com;transport=tls`.
如需使用欧洲数据驻留，请使用 `sip:$PROJECT_ID@sip-eu.api.openai.com;transport=tls` 。
要查找你的 `$PROJECT_ID`，请访问 [设置](https://platform.openai.com/settings) > 项目 > **常规**。该页面将显示项目 ID，该 ID
具有 `proj_` 前缀。

当 OpenAI 收到与你的项目关联的 SIP 流量时，
你的 Webhook 就会被触发。触发的事件将是
[`realtime.call.incoming`](https://developers.openai.com/api/reference/resources/webhooks) 事件，
如下例所示：

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

通过这个 Webhook，你可以使用 Webhook 中的 `call_id` 值来接听或拒接通话。
接听通话时，你需要为 Realtime API 会话提供所需的配置
（指令、语音等）。
会话建立后，你可以像往常一样设置 WebSocket 并监控该会话。用于接听、拒接、监控、转接和挂断通话的 API
将在下方文档中说明。

## Accept the call

使用 [Accept call 端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/accept) 来
批准来电并配置将应答该来电的实时会话。
发送与在
[`create client secret`](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create)
请求中相同的参数，即确保在将
通话桥接到模型之前设置好实时模型、语音、工具或指令。

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
，并且每个请求都需要上面所示的 `Authorization` 请求头。
端点会在 `200 OK` 返回一次，此时 SIP 线路正在响铃且实时会话
正在建立。

## 拒绝调用

使用 [Reject call endpoint](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/reject) 来
当你不想处理来电时可以拒绝邀请，（例如，来自
不受支持的国家代码）。提供 `call_id` 路径参数
以及一个可选的 SIP `status_code` （例如， `486` 用于表示“忙”）以 JSON 形式
body to control the response sent back to the carrier.

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/reject" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status_code": 486}'
```


If no status code is supplied the API uses `603 Decline` by default. A
successful request responds with `200 OK` after OpenAI delivers the SIP
response.

## 监控通话事件

在你接通通话后，向同一个会话打开一个 WebSocket 连接，以
流式传输事件并发出实时命令。请注意，当通过
参数连接到已有的 `call_id` 通话时，不会使用 `model` 参数（因为它已经通过
进行了配置 `accept` 端点）。

### WebSocket 请求

`GET wss://api.openai.com/v1/realtime?call_id={call_id}`

### 查询参数

| 参数 | 类型   | 描述                                           |
| --------- | ------ | ----------------------------------------------------- |
| `call_id` | string | 来自 `realtime.call.incoming` webhook 的标识符。 |

### Headers

- `Authorization: Bearer YOUR_API_KEY`

WebSocket 的行为与任何其他 Realtime API 连接完全一致。发送
[`response.create`](https://developers.openai.com/api/reference/resources/realtime/client-events#response.create),
以及其他客户端事件以控制通话，并监听服务端事件以
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
[Refer call endpoint](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/refer)。转移进行中的通话。请提供
`call_id` 以及应放入 SIP 中的 `target_uri` 应放入 SIP 中的内容 `Refer-To`
header（例如 `tel:+14155550123` 或 `sip:agent@example.com`).

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/refer" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"target_uri": "tel:+14155550123"}'
```


OpenAI 返回 `200 OK` 一旦 REFER 被转交给你的 SIP 提供商，下游
系统就会处理主叫方后续的呼叫流程。

## 挂断通话

使用 [挂断端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/hangup)
结束会话，当你的应用需要断开呼叫方时调用该端点。该端点可用于
终止 SIP 和 WebRTC 实时会话。

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/hangup" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


API 在开始拆除通话时返回 `200 OK` 。

<a id="dedicated-sip-ip-ranges"></a>

## SIP 信令与媒体 IP 范围

Realtime SIP calls use separate network paths for signaling and media. To ensure proper operation,
configure your network to allow signaling and media traffic as described below.

### SIP 信令

`sip.api.openai.com` 并且 `sip-eu.api.openai.com` 是 GeoIP 路由的端点。你的网络必须允许
通过端口 443 上的 DNS 返回的地址向外发起 TCP/TLS 流量 `5061`.

### SRTP media

API 在协商后的 SDP 中指定单独的媒体 IP 地址和 UDP 端口。你的网络必须
允许通过 UDP 与以下 CIDR 进行双向 SRTP 通信：

- `13.79.45.80/28`
- `23.98.140.64/28`
- `40.67.149.176/28`
- `40.83.204.240/28`

## Python 示例

下面是一个 `realtime.call.incoming` 处理函数的示例。它接受该调用,然后记录来自
Realtime API 的所有事件。



Python

    Python

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



## 后续步骤

既然你已经通过 SIP 建立了连接，可以使用左侧导航或点击这些页面来开始构建你的实时应用。

- [实时提示指南](https://developers.openai.com/api/docs/guides/realtime-models-prompting)
- [管理对话](https://developers.openai.com/api/docs/guides/realtime-conversations)
- [Webhook 与服务端控制](https://developers.openai.com/api/docs/guides/realtime-server-controls)
- [管理成本](https://developers.openai.com/api/docs/guides/realtime-costs)
- [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription)

### 其他资源

- [JavaScript 演示](https://hello-realtime.val.run/)
- [将 Realtime SIP 连接器接入 Twilio Elastic SIP Trunking](https://www.twilio.com/en-us/blog/developers/tutorials/product/openai-realtime-api-elastic-sip-trunking)