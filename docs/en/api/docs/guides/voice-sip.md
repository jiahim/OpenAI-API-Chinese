# Telephony and SIP

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Choose the API your application uses. Each API has its own authentication, session creation, and event contract.



## Choose a telephony connection

A phone call can reach GPT-Live through a SIP trunk or through an application that relays audio. Choose the path that fits your existing phone system and where your application needs to process audio.

| Connection          | Audio and application responsibilities                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Direct SIP          | The provider exchanges call audio with OpenAI. Your application handles webhooks, session configuration, call decisions, and business logic.             |
| Server audio bridge | Your application relays provider or room audio to GPT-Live over WebSocket. It manages both connections, event translation, playback, and call lifecycle. |

A provider's connection to your application and your application's connection to OpenAI are separate. For example, a caller can join a room through SIP while an agent in that room connects to GPT-Live over WebSocket.

Using Twilio, Telnyx, LiveKit, or Daily/Pipecat? See [GPT-Live partner integrations](https://developers.openai.com/api/docs/guides/live-partner-integrations) for provider-specific guides.

### Direct SIP

Direct SIP keeps call audio on the provider-to-OpenAI media path. SIP signaling uses TLS, and GPT-Live requires SRTP for call audio. Your backend still owns the incoming-call decision, session configuration, authorization, and business logic.

Use a [sideband connection](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live) when your backend needs to receive session events or send commands. It attaches to the existing conversation while SIP carries the audio. Assign one handler to each action so that duplicate webhook deliveries or events observed on multiple connections don't execute tools twice.

Keep SIP routing and provider configuration together with the integration that uses them. Realtime webhook events, call identifiers, and acceptance payloads belong to the Realtime API; use the GPT-Live contract for a Live session.

### Handle the call lifecycle

Confirm that GPT-Live SIP support is enabled for your project and that your
  provider's SIP trunk is routed to that project before using this flow. The
  Realtime webhook and acceptance payloads in the other tab are a different API
  contract.

#### Receive the incoming call

Configure your project's [webhook endpoint](https://developers.openai.com/api/docs/guides/webhooks) for `live.transport.incoming`. Verify the webhook signature and deduplicate deliveries before making a call decision. A delivery acknowledgment does not accept the call.

The webhook identifies a SIP call with `data.type: "sip"` and provides `data.session_id`. Use that session ID unchanged for every Live call action. Treat `data.sip_headers` as untrusted caller metadata, not authorization.

Existing integrations may still receive the deprecated `live.call.incoming` event, which has no `data.type`. During migration, handle both names and retain the old subscription until legacy deliveries and retries have drained. The same pending call can also emit a Realtime webhook; assign one handler to the accept/reject decision rather than accepting through both APIs.

#### Accept or reject the call

Apply your application's authorization and routing rules. To [accept the call](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/accept), send an authenticated `POST /v1/live/sessions/{session_id}/accept` request with a top-level `session` object:

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

Use `Authorization: Bearer $OPENAI_API_KEY` from your trusted backend for call-control requests. Choose the voice and delegation mode at acceptance. SIP negotiates the audio format, so omit `audio.format`. The example selects client delegation; your backend must handle delegated work. See [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation) for client and Responses configurations.

A successful acceptance returns `200 OK` with an empty body after session initialization. Handle HTTP errors before treating the call as accepted.

To [reject the call](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/reject), send `POST /v1/live/sessions/{session_id}/reject` with a SIP status, such as `{ "status_code": 486 }` for busy. The status must be an integer from 300 through 699. The first accept or reject decision wins; a later competing decision returns `decision_already_made`.

#### Attach your backend

After acceptance, connect a [sideband WebSocket](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live) at `wss://api.openai.com/v1/live/sessions/{session_id}/attach`. Use the accepted session ID and the same project authentication and connection headers. Do not send `session.start` again.

SIP carries the call audio. Use the sideband for transcripts, delegation, tools, commands, and reflected audio. Choose one owner for each side effect, even if multiple connections observe an event.

#### Observe keypad events

The sideband receives `transport.dtmf.received` when the caller presses a key and `transport.dtmf.send` after a hosted tool successfully sends a tone. The event's `event` field contains one of `0`–`9`, `*`, `#`, or `A`–`D`.

These are observer notifications, not client commands. Do not send `transport.dtmf.send` to request a tone, or assume the browser data channel receives keypad events.

#### Transfer or end the call

To [transfer the call](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/refer), send `POST /v1/live/sessions/{session_id}/refer` with `{ "target_uri": "sip:agent@example.com" }` for your destination. To [hang up](https://developers.openai.com/api/reference/resources/live/subresources/sessions/methods/hangup), send `POST /v1/live/sessions/{session_id}/hangup` with no request body. Both return `200 OK` with an empty body on success.

Keep your sideband open for final events and usage before releasing application resources. A successful hangup request or an unexpected disconnect is not a substitute for `session.closed`. See [Usage and graceful close](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) for finalization and close reasons.

This flow accepts inbound calls. Creating an outbound SIP call through `POST /v1/live/sessions` is not supported; use the relevant [partner integration](https://developers.openai.com/api/docs/guides/live-partner-integrations) for provider-owned outbound calling.

### Server audio bridges

Use the [GPT-Live WebSocket connection](https://developers.openai.com/api/docs/guides/voice-websockets?api=live) when your application receives an audio stream from a phone provider or an agent framework. The application authenticates both connections, translates their event envelopes, and relays audio in both directions.

GPT-Live supports raw G.711 μ-law and A-law audio at 8 kHz over WebSocket. When the provider stream uses the same codec, sample rate, and channel count, your application can forward the raw audio bytes without converting them to PCM. Preserve audio order and use the message format required by each connection. Matching audio formats don't make the two event protocols interchangeable.

The bridge also owns any audio it queues for playback. Include provider buffering, interruptions, and ending the call in your application design. See [Managing sessions](https://developers.openai.com/api/docs/guides/live-conversations) for the Live session lifecycle and [Migrate to GPT-Live](https://developers.openai.com/api/docs/guides/live-migration) for changes to turn-taking and playback control.

Keep the provider's call or room identifier alongside the OpenAI session ID so you can trace a conversation across both systems.

## Next steps with GPT-Live

- [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=live): connect a server audio stream to GPT-Live.
- [Webhooks and server-side controls](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live): manage a session from your backend.
- [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation): connect speech to your reasoning and tool backend.
- [Managing sessions](https://developers.openai.com/api/docs/guides/live-conversations): handle transcripts, session state, and close.






[SIP](https://en.wikipedia.org/wiki/Session_Initiation_Protocol) is a
protocol used to make phone calls over the internet. With SIP and the
Realtime API you can direct incoming phone calls to the API.

## Overview

If you want to connect a phone number to the Realtime API,
use a SIP trunking provider (e.g., Twilio). This is a service that converts your phone call
to IP traffic. After you purchase a phone number from your SIP trunking
provider, follow the instructions below.

Start by creating a [webhook](https://developers.openai.com/api/docs/guides/webhooks) for incoming calls, through your **platform.openai.com** [settings](https://platform.openai.com/settings) > Project > **Webhooks**.
Then, point your SIP trunk at the OpenAI SIP endpoint, using the project ID
for which you configured the webhook, e.g., `sip:$PROJECT_ID@sip.api.openai.com;transport=tls`.
For European data residency, use `sip:$PROJECT_ID@sip-eu.api.openai.com;transport=tls` instead.
To find your `$PROJECT_ID`, visit [settings](https://platform.openai.com/settings) > Project > **General**. That page will display the project ID, which
will have a `proj_` prefix.

When OpenAI receives SIP traffic associated with your project,
your webhook will be fired. The event fired will be a
[`realtime.call.incoming`](https://developers.openai.com/api/reference/resources/webhooks) event,
like the example below:

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

From this webhook, you can accept or reject the call, using the `call_id` value from the webhook.
When accepting the call, you'll provide the needed configuration
(instructions, voice, etc) for the Realtime API session.
Once established, you can set up a WebSocket and monitor the session as usual. The APIs to
accept, reject, monitor, refer, and hangup the call are documented below.

## Accept the call

Use the [Accept call endpoint](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/accept) to
approve the inbound call and configure the realtime session that will answer it.
Send the same parameters you would send in a
[`create client secret`](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets/methods/create)
request, i.e., ensure the realtime model, voice, tools, or instructions are set before bridging the
call to the model.

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


The request path must include the `call_id` from the
[`realtime.call.incoming`](https://developers.openai.com/api/reference/resources/webhooks)
webhook, and every request requires the `Authorization` header shown above. The
endpoint returns `200 OK` once the SIP leg is ringing and the realtime session
is being established.

## Reject the call

Use the [Reject call endpoint](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/reject) to
decline an invite when you do not want to handle the incoming call, (e.g., from
an unsupported country code.) Supply the `call_id` path parameter
and an optional SIP `status_code` (e.g., `486` to indicate "busy") in the JSON
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

## Monitor call events

After you accept a call, open a WebSocket connection to the same session to
stream events and issue realtime commands. Note that when connecting to an existing
call using the `call_id` parameter, the `model` argument is not used (as it has already been configured
via the `accept` endpoint).

### WebSocket request

`GET wss://api.openai.com/v1/realtime?call_id={call_id}`

### Query parameters

| Parameter | Type   | Description                                           |
| --------- | ------ | ----------------------------------------------------- |
| `call_id` | string | Identifier from the `realtime.call.incoming` webhook. |

### Headers

- `Authorization: Bearer YOUR_API_KEY`

The WebSocket behaves exactly like any other Realtime API connection. Send
[`response.create`](https://developers.openai.com/api/reference/resources/realtime/client-events#response.create),
and other client events to control the call, and listen for server events to
track progress. See [Webhooks and server-side controls](https://developers.openai.com/api/docs/guides/voice-server-controls?api=realtime)
for more information.

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

Transfer an active call using the
[Refer call endpoint](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/refer). Provide the
`call_id` as well as the `target_uri` that should be placed in the SIP `Refer-To`
header (for example `tel:+14155550123` or `sip:agent@example.com`).

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/refer" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"target_uri": "tel:+14155550123"}'
```


OpenAI returns `200 OK` once the REFER is relayed to your SIP provider. The
downstream system handles the rest of the call flow for the caller.

## Hang up the call

End the session with the [Hang up endpoint](https://developers.openai.com/api/reference/resources/realtime/subresources/calls/methods/hangup)
when your application should disconnect the caller. This endpoint can be used to
terminate both SIP and WebRTC realtime sessions.

```bash
curl -X POST "https://api.openai.com/v1/realtime/calls/$CALL_ID/hangup" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```


The API responds with `200 OK` when it starts tearing down the call.

<a id="dedicated-sip-ip-ranges"></a>

## SIP signaling and media IP ranges

Realtime SIP calls use separate network paths for signaling and media. To ensure proper operation,
configure your network to allow signaling and media traffic as described below.

### SIP signaling

`sip.api.openai.com` and `sip-eu.api.openai.com` are GeoIP-routed endpoints. Your network must allow
outbound TCP/TLS traffic to the addresses returned by DNS on port `5061`.

### SRTP media

The API specifies a separate media IP address and UDP port in the negotiated SDP. Your network must
allow bidirectional SRTP traffic over UDP to and from the following CIDRs:

- `13.79.45.80/28`
- `23.98.140.64/28`
- `40.67.149.176/28`
- `40.83.204.240/28`

## Server examples

The following is an example of a `realtime.call.incoming` handler. It accepts the call and then logs all the events from
the Realtime API.

For the Ruby example, set the `OPENAI_API_KEY` and `OPENAI_WEBHOOK_SECRET`
environment variables, then install the required dependencies with
`gem install openai webrick async-websocket`.

Handle an incoming SIP call

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

Now that you've connected over SIP, use the left navigation or click into these pages to start building your realtime application.

- [Realtime prompting guide](https://developers.openai.com/api/docs/guides/voice-prompting)
- [Managing conversations](https://developers.openai.com/api/docs/guides/realtime-conversations)
- [Webhooks and server-side controls](https://developers.openai.com/api/docs/guides/voice-server-controls?api=realtime)
- [Managing costs](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=realtime)
- [Realtime transcription](https://developers.openai.com/api/docs/guides/realtime-transcription)

### Additional Resources

- [JavaScript demo](https://hello-realtime.val.run/)
- [Connect the Realtime SIP Connector to Twilio Elastic SIP Trunking](https://www.twilio.com/en-us/blog/developers/tutorials/product/openai-realtime-api-elastic-sip-trunking)