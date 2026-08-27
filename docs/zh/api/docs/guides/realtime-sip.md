# 支持 SIP 的 Realtime API

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

[SIP](https://en.wikipedia.org/wiki/Session_Initiation_Protocol) 是一种
用于通过互联网拨打语音电话的协议。借助 SIP 和
Realtime API，你可以将来电直接转接至 API。

## 概述

如果你想把电话号码连接到 Realtime API，
请使用 SIP 中继提供商（例如 Twilio）。这是一种将你的电话呼叫转换
为 IP 流量的服务。在你从 SIP 中继提供商处购买电话号码后，
按照以下说明进行操作。

首先，在你的 [webhook](https://developers.openai.com/api/docs/guides/webhooks) 中为来电创建一个 **platform.openai.com** [设置](https://platform.openai.com/settings) > 项目 > **Webhooks**.
然后，将你的 SIP 中继指向 OpenAI SIP 端点，使用你配置 webhook 的项目 ID，
例如： `sip:$PROJECT_ID@sip.api.openai.com;transport=tls`.
对于欧洲数据驻留，请使用 `sip:$PROJECT_ID@sip-eu.api.openai.com;transport=tls` 替代。
要找到你的 `$PROJECT_ID`，请访问 [设置](https://platform.openai.com/settings) > 项目 > **常规**。该页面将显示项目 ID，它
将带有 `proj_` 前缀。

当 OpenAI 收到与你的项目关联的 SIP 流量时，
你的 webhook 将被触发。触发的事件将是
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

通过此 webhook，你可以接受或拒绝呼叫，使用 webhook 中的 `call_id` 值。
接受呼叫时，你将提供所需的配置
（指令、语音等）用于 Realtime API 会话。
一旦建立，你可以像往常一样设置 WebSocket 并监控会话。用于
接受、拒绝、监控、转接和挂断呼叫的 API 将在下文记录。

## 接受调用

使用 [Accept call 端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/accept) 来
批准入站呼叫并配置将接听该呼叫的实时会话。
发送你会在
[`create client secret`](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create)
请求中发送的相同参数，即在桥接
呼叫到模型之前，确保实时模型、语音、工具或指令已设置。

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


请求路径必须包含 `call_id` 中的
[`realtime.call.incoming`](https://developers.openai.com/api/reference/resources/webhooks)
webhook，并且每个请求都需要 `Authorization` 上面显示的标头。
端点会在 `200 OK` SIP 分机响铃且实时会话
正在建立时返回。

## 拒绝该调用

使用 [Reject call 端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/reject) 来
在你不想处理来电时拒绝邀请（例如，来自
不支持的国家代码）。提供 `call_id` 路径参数
以及可选的 SIP `status_code` （例如， `486` 以表示“忙”）在 JSON
请求体中，以控制返回给运营商（carrier）的响应。

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/reject" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"status_code": 486}'
```


如果未提供状态码，API 默认使用 `603 Decline` 。成功
的请求会以 `200 OK` 响应，在 OpenAI 传递 SIP
之后。

## 监控调用事件

在接受通话后，打开一个 WebSocket 连接到同一会话，以
流式传输事件并发出实时命令。请注意，当连接到现有
使用 `call_id` 参数进行通话时， `model` 参数不会被使用（因为它已经通过
配置好了 `accept` 端点）。

### WebSocket 请求

`GET wss://api.openai.com/v1/realtime?call_id={call_id}`

### 查询参数

| 参数 | 类型   | 描述                                           |
| --------- | ------ | ----------------------------------------------------- |
| `call_id` | 字符串 | 来自 `realtime.call.incoming` webhook 的标识符。 |

### 标头

- `Authorization: Bearer YOUR_API_KEY`

WebSocket 的行为与任何其他 Realtime API 连接完全相同。发送
[`response.create`](https://developers.openai.com/api/reference/resources/realtime/client-events#response.create),
其他客户端事件来控制通话，并监听服务器事件以
跟踪进度。参阅 [Webhooks 和 服务端 控制](https://developers.openai.com/api/docs/guides/realtime-server-controls)
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


## Redirect the call

使用
[Refer call 端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/refer)。转移活动通话。提供
`call_id` 以及 `target_uri` 应放置在 SIP `Refer-To`
头中的内容（例如 `tel:+14155550123` 或 `sip:agent@example.com`).

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/refer" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"target_uri": "tel:+14155550123"}'
```


OpenAI 返回 `200 OK` 一旦 REFER 被中继到你的 SIP 提供商。下游系统
处理呼叫者的其余通话流程。

## 挂断通话

通过 [挂断端点](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/hangup)
结束会话，当你的应用应断开呼叫者时。此端点可用于
终止 SIP 和 WebRTC 实时会话。

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/hangup" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


API 会响应 `200 OK` 当它开始拆除通话时。

<a id="dedicated-sip-ip-ranges"></a>

## SIP 信令与媒体 IP 范围

Realtime SIP 呼叫的 signaling 和 media 使用独立的网络路径。为确保正常运行，
请按照下面的说明配置你的网络，以允许 signaling 和 media 流量通过。

### SIP 信令

`sip.api.openai.com` 以及 `sip-eu.api.openai.com` 是基于 GeoIP 路由的端点。你的网络必须允许
通过 DNS 返回的地址上的端口 `5061`.

### SRTP 媒体

API指定在协商的SDP中提供独立的媒体IP地址和UDP端口。你的网络必须
允许UDP上的双向SRTP流量往返于以下CIDR范围：

- `13.79.45.80/28`
- `23.98.140.64/28`
- `40.67.149.176/28`
- `40.83.204.240/28`

## Python 示例

以下是一个 `realtime.call.incoming` handler 的示例。它接受调用，然后记录来自
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

现在你已经通过 SIP 建立了连接，请使用左侧导航或点击这些页面开始构建你的实时应用。

- [实时提示指南](https://developers.openai.com/api/docs/guides/realtime-models-prompting)
- [管理对话](https://developers.openai.com/api/docs/guides/realtime-conversations)
- [Webhooks 和服务端控制](https://developers.openai.com/api/docs/guides/realtime-server-controls)
- [管理成本](https://developers.openai.com/api/docs/guides/realtime-costs)
- [实时转录](https://developers.openai.com/api/docs/guides/realtime-transcription)

### 更多资源

- [JavaScript 演示](https://hello-realtime.val.run/)
- [将 Realtime SIP 连接器连接到 Twilio Elastic SIP Trunking](https://www.twilio.com/en-us/blog/developers/tutorials/product/openai-realtime-api-elastic-sip-trunking)