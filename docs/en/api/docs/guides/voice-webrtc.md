# WebRTC

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Choose the API your application uses. Each API has its own authentication, session creation, and event contract.



## Connect a browser to GPT-Live

Use WebRTC for browser voice applications. Microphone input and generated speech travel on negotiated media tracks. A data channel carries JSON events for transcripts, session updates, and delegated work.

Your browser creates a Session Description Protocol (SDP) offer. Your application server exchanges it for an answer with `POST /v1/live/sessions`, using the project API key. Keep the key and session configuration on your trusted server.

### Before you start

You need:

- A project API key with access to GPT-Live.
- A server runtime for your chosen SDK example. The Node.js example requires Node.js 22.6 or later.
- A browser with microphone permission, running on HTTPS or localhost.

The example uses Responses delegation with `gpt-5.6-terra` and hosted web search. For backend instructions and application tools, see [Delegation and tools](https://developers.openai.com/api/docs/guides/live-delegation). For voice and backend usage, see [Cost optimization](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live).

### Understand the connection sequence

1. Request microphone access from a user action and add its tracks to a peer connection.
2. Create the data channel and register event listeners before creating the SDP offer.
3. Set the local description, wait for ICE candidate gathering, and send the offer to your server.
4. Have your server post JSON containing `session` and `transport: { type: "webrtc", sdp: ... }` to OpenAI.
5. Apply the returned SDP answer as the remote description. Wait for `session.started` on the data channel before sending application commands.

The HTTP request starts the session. **Do not send `session.start` on the data channel.** The `oai-events` string in the example is the data-channel label.

Creating a WebRTC session with `POST /v1/live/sessions` bills 15 seconds of voice duration during initialization. That amount is credited against duration charges once the session starts running; it is not an extra 15 seconds added to the running session. See [WebRTC initialization charges](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live#webrtc-initialization-charges) for cost accounting.

### Create the application server

Save the server example in a new directory and set `OPENAI_API_KEY` in its environment. For Node.js, use `server.mjs` and install `openai` and `express` with `npm install openai express`. For Python, install `openai`. This example binds to `127.0.0.1`, accepts session requests from `http://localhost:3000`, and serves `index.html` from the directory where you run it.

Choose a server language below; each variant serves `index.html` and the same `/api/session` endpoint on port 3000. Use an SDK version with Live support. Run only one variant at a time.

```javascript
import express from "express";
import OpenAI from "openai";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const app = express();
const client = new OpenAI({ maxRetries: 0 });
const port = 3000;
const origin = `http://localhost:${port}`;
const indexPath = resolve("index.html");

app.use(express.json({ limit: "64kb" }));
app.get("/", async (_request, response) => {
  response.type("html").send(await readFile(indexPath, "utf8"));
});

// Local-only demo. Add your application's authentication and authorization
// before exposing session creation to other users.
app.post("/api/session", async (request, response) => {
  if (request.headers.origin !== origin) {
    response.status(403).json({ error: "Unexpected request origin" });
    return;
  }
  if (typeof request.body?.sdp !== "string" || !request.body.sdp.trim()) {
    response.status(400).json({ error: "An SDP offer is required" });
    return;
  }
  if (!process.env.OPENAI_API_KEY) {
    response.status(503).json({ error: "Set OPENAI_API_KEY on the server" });
    return;
  }

  try {
    const result = await client.live.create({
      session: {
        model: "gpt-live-1",
        instructions:
          "Be concise. Delegate requests needing current information to the backend, which can search the web.",
        delegation: {
          type: "responses",
          responses: {
            model: "gpt-5.6-terra",
            instructions:
              "Use web search when current facts are needed. Return concise, grounded results for a spoken conversation.",
            tools: [{ type: "web_search" }],
            tool_choice: "auto",
          },
        },
      },
      transport: {
        type: "webrtc",
        sdp: request.body.sdp,
      },
    });
    // Preserve the SDK's typed session ID and SDP answer.
    response.status(201).json(result);
  } catch (error) {
    if (!(error instanceof OpenAI.APIError)) throw error;
    console.error("Live session creation failed", error.status);
    response
      .status(error.status ?? 502)
      .json({ error: "Live session creation failed" });
  }
});

app.listen(port, "127.0.0.1", () => console.log(`Open ${origin}`));
```

```python
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from openai import APIError, OpenAI
from openai.types.live.media_session_config_param import MediaSessionConfigParam
from pydantic import BaseModel, Field, ValidationError

client = OpenAI(max_retries=0)
origin = "http://localhost:3000"


class SDPOffer(BaseModel):
    sdp: str = Field(min_length=1)


class SessionHandler(BaseHTTPRequestHandler):
    def reply(
        self, status: int, body: bytes, content_type: str = "application/json"
    ) -> None:
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if self.path != "/":
            self.reply(404, b"{}")
            return
        self.reply(200, Path("index.html").read_bytes(), "text/html")

    def do_POST(self) -> None:
        # Local-only demo: add application authentication before exposing it.
        if self.path != "/api/session":
            self.reply(404, b"{}")
            return
        if self.headers.get("Origin") != origin:
            self.reply(403, b'{"error":"Unexpected request origin"}')
            return
        length = int(self.headers.get("Content-Length", "0"))
        if not 0 < length <= 65536:
            self.reply(400, b'{"error":"An SDP offer is required"}')
            return
        try:
            offer = SDPOffer.model_validate_json(self.rfile.read(length))
            if not offer.sdp.strip():
                self.reply(400, b'{"error":"An SDP offer is required"}')
                return
        except ValidationError:
            self.reply(400, b'{"error":"An SDP offer is required"}')
            return
        session: MediaSessionConfigParam = {
            "model": "gpt-live-1",
            "instructions": "Be concise. Delegate requests needing current information to the backend, which can search the web.",
            "delegation": {
                "type": "responses",
                "responses": {
                    "model": "gpt-5.6-terra",
                    "instructions": "Use web search when current facts are needed. Return concise, grounded results for a spoken conversation.",
                    "tools": [{"type": "web_search"}],
                    "tool_choice": "auto",
                },
            },
        }
        try:
            result = client.live.create(
                session=session, transport={"type": "webrtc", "sdp": offer.sdp}
            )
        except APIError as error:
            self.reply(
                getattr(error, "status_code", 502),
                b'{"error":"Live session creation failed"}',
            )
            return
        # Return the SDK's typed session ID and SDP answer unchanged.
        self.reply(201, result.model_dump_json().encode())


if __name__ == "__main__":
    print(f"Open {origin}")
    ThreadingHTTPServer(("127.0.0.1", 3000), SessionHandler).serve_forever()
```


Before making the server accessible to other users, protect `/api/session` with your application's authentication, authorization, request limits, and HTTPS. The origin check in this local example does not authenticate users.

### Create the browser client

Create `index.html` in the directory where you run the server:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>GPT-Live connection</title>
  </head>
  <body>
    <script type="module">
      // Paste the browser code below here.
    </script>
  </body>
</html>
```

Paste the following code inside the module script. It adds start and end controls, connects the microphone and output audio, and handles session events. `/api/session` is a route on your application server.

```javascript
const start = document.createElement("button");
start.textContent = "Start conversation";
const stop = document.createElement("button");
stop.textContent = "End conversation";
stop.disabled = true;
const status = document.createElement("p");
const audio = new Audio();
audio.autoplay = true;
audio.controls = true;
document.body.append(start, stop, status, audio);

let peer;

let events;

let microphone;

let closeTimeout;
let ready = false;
let finalized = false;

function cleanup() {
  clearTimeout(closeTimeout);
  microphone?.getTracks().forEach((track) => track.stop());
  events?.close();
  peer?.close();
  audio.srcObject = null;
  ready = false;
  start.disabled = false;
  stop.disabled = true;
}

start.addEventListener("click", async () => {
  start.disabled = true;
  finalized = false;
  status.textContent = "Connecting…";
  try {
    const connection = new RTCPeerConnection();
    peer = connection;
    connection.addEventListener("track", (event) => {
      audio.srcObject = new MediaStream([event.track]);
      audio.play().catch(() => {
        status.textContent =
          "Select play on the audio controls to hear the assistant.";
      });
    });
    microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
    for (const track of microphone.getAudioTracks()) {
      connection.addTrack(track, microphone);
    }

    // Create the event channel before creating the SDP offer.
    events = connection.createDataChannel("oai-events");
    events.addEventListener("message", ({ data }) => {
      const event = JSON.parse(data);
      if (event.type === "session.started") {
        ready = true;
        stop.disabled = false;
        status.textContent = "Connected: " + event.session.id;
      } else if (event.type === "session.closed") {
        finalized = true;
        console.log("Final session usage", event.usage);
        status.textContent = "Conversation ended.";
        cleanup();
      } else {
        // Save transcript and nested Responses events as needed by your app.
        console.log(event);
      }
    });
    events.addEventListener("close", (event) => {
      if (event.target !== events) return;
      if (!finalized) {
        status.textContent = "Disconnected without final session usage.";
        cleanup();
      }
    });

    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    if (connection.iceGatheringState !== "complete") {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          connection.removeEventListener("icegatheringstatechange", onState);
          reject(new Error("Timed out while gathering ICE candidates"));
        }, 10_000);
        function onState() {
          if (connection.iceGatheringState !== "complete") return;
          clearTimeout(timeout);
          connection.removeEventListener("icegatheringstatechange", onState);
          resolve(undefined);
        }
        connection.addEventListener("icegatheringstatechange", onState);
        onState();
      });
    }

    const sdp = connection.localDescription?.sdp;
    if (!sdp) throw new Error("Missing local SDP offer");
    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sdp }),
    });
    if (!response.ok) throw new Error(await response.text());

    const result = await response.json();
    console.log("Created session", result.session.id);
    await connection.setRemoteDescription({
      type: "answer",
      sdp: result.transport.sdp,
    });
    // The HTTP request started this session. Do not send session.start here.
  } catch (error) {
    status.textContent =
      error instanceof Error ? error.message : String(error);
    cleanup();
  }
});

stop.addEventListener("click", () => {
  if (!ready || !events || events.readyState !== "open") return;
  stop.disabled = true;
  status.textContent = "Finishing the conversation…";
  // The session.closed handler is already registered. Keep media and events
  // alive while pending work drains; only clean up after the final event.
  events.send(JSON.stringify({ type: "session.close" }));
  closeTimeout = setTimeout(() => {
    status.textContent = "Incomplete finalization: no session.closed event.";
    cleanup();
  }, 15_000);
});
```


Run your chosen server (`node server.mjs` or `python server.py`), open `http://localhost:3000`, and select **Start conversation**. After the status changes to **Connected**, ask a question that needs current information to exercise hosted search. Use the audio controls if your browser blocks autoplay.

### Read the session response

A successful request returns HTTP 201 with JSON containing the session ID and SDP answer:

```json
{
  "session": { "id": "live_123" },
  "transport": { "type": "webrtc", "sdp": "<SDP answer>" }
}
```

Read `result.session.id` and pass `result.transport.sdp` to `setRemoteDescription`. Treat the session ID as opaque and preserve it unchanged, including its prefix.

### Handle media and events

Send microphone audio and receive generated speech through the media tracks. WebRTC negotiates the audio format through SDP, so omit `audio.format` from session configuration. Do not send `session.input_audio.append` or expect `session.output_audio.delta` on the data channel.

Use the data channel for transcript deltas, session commands, and nested `response.event` messages. See [Managing sessions](https://developers.openai.com/api/docs/guides/live-conversations) for transcript handling and lifecycle events, and [Server-side controls](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live) if your server needs its own event connection.

To end the conversation, send `session.close` and keep receiving until `session.closed` before closing the peer connection and microphone tracks. The example registers the final-event listener before sending the command. If the connection fails or times out first, final usage is unconfirmed. See [Usage and graceful close](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) for final usage handling.

  

  


[WebRTC](https://webrtc.org/) is a powerful set of standard interfaces for building real-time applications. The OpenAI Realtime API supports connecting to realtime models through a WebRTC peer connection.

For browser-based speech-to-speech voice applications, we recommend starting with [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents), which covers the Agents SDK's higher-level helpers and APIs for managing Realtime sessions. The WebRTC interface is powerful and flexible, but lower level than the Agents SDK.

When connecting to a Realtime model from the client (like a web browser or
  mobile device), we recommend using WebRTC rather than WebSockets for more
  consistent performance.

For more guidance on building user interfaces on top of WebRTC, [refer to the docs on MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API).

## Overview

The Realtime API supports two mechanisms for connecting to the Realtime API from the browser, either using ephemeral API keys ([generated via the OpenAI REST API](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets)), or via the new unified interface. Generally, using the unified interface is simpler, but puts your application server in the critical path for session initialization.

### Connecting using the unified interface

The process for initializing a WebRTC connection using the unified interface is as follows (assuming a web browser client):

1. The browser makes a request to a developer-controlled server using the SDP data from its WebRTC peer connection.
2. The server combines that SDP with its session configuration in a multipart form and sends that to the OpenAI Realtime API, authenticating it with its [standard API key](https://platform.openai.com/settings/organization/api-keys).

#### Creating a session via the unified interface

To create a realtime API session via the unified interface, you will need to build a small server-side application (or integrate with an existing one) to make a request to `/v1/realtime/calls`. You will use a [standard API key](https://platform.openai.com/settings/organization/api-keys) to authenticate this request on your backend server.

Below is an example of a simple Node.js [express](https://expressjs.com/) server which creates a realtime API session:

```javascript
import express from "express";

const app = express();

// Parse raw SDP payloads posted from the browser
app.use(express.text({ type: ["application/sdp", "text/plain"] }));

const sessionConfig = JSON.stringify({
  type: "realtime",
  model: "gpt-realtime-2.1",
  audio: { output: { voice: "marin" } },
});

// An endpoint which creates a Realtime API session.
app.post("/session", async (req, res) => {
  const fd = new FormData();
  fd.set("sdp", req.body);
  fd.set("session", sessionConfig);

  try {
    const r = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Safety-Identifier": "hashed-user-id",
      },
      body: fd,
    });
    // Send back the SDP we received from the OpenAI REST API
    const sdp = await r.text();
    res.send(sdp);
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.listen(3000);
```


If your application assigns a [safety identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
for each end user, include it as the `OpenAI-Safety-Identifier` header in this
server-side request. Use a stable, privacy-preserving value, such as a hashed
internal user ID. The header should be set by your trusted backend, not by the
browser.

#### Connecting to the server

In the browser, you can use standard WebRTC APIs to connect to the Realtime API via your application server. The client directly POSTs its SDP data to your server.

```javascript
// Create a peer connection
const pc = new RTCPeerConnection();

// Set up to play remote audio from the model
audioElement.current = document.createElement("audio");
audioElement.current.autoplay = true;
pc.ontrack = (e) => (audioElement.current.srcObject = e.streams[0]);

// Add local audio track for microphone input in the browser
const ms = await navigator.mediaDevices.getUserMedia({
  audio: true,
});
pc.addTrack(ms.getTracks()[0]);

// Set up data channel for sending and receiving events
const dc = pc.createDataChannel("oai-events");

// Start the session using the Session Description Protocol (SDP)
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

const sdpResponse = await fetch("/session", {
  method: "POST",
  body: offer.sdp,
  headers: {
    "Content-Type": "application/sdp",
  },
});

const answer = {
  type: "answer",
  sdp: await sdpResponse.text(),
};
await pc.setRemoteDescription(answer);
```


### Connecting using an ephemeral token

The process for initializing a WebRTC connection using an ephemeral API key is as follows (assuming a web browser client):

1. The browser makes a request to a developer-controlled server to mint an ephemeral API key.
1. The developer's server uses a [standard API key](https://platform.openai.com/settings/organization/api-keys) to request an ephemeral key from the [OpenAI REST API](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets), and returns that new key to the browser.
1. The browser uses the ephemeral key to authenticate a session directly with the OpenAI Realtime API as a [WebRTC peer connection](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection).

![connect to realtime via WebRTC](https://openaidevs.retool.com/api/file/55b47800-9aaf-48b9-90d5-793ab227ddd3)

#### Creating an ephemeral token

To create an ephemeral token to use on the client-side, you will need to build a small server-side application (or integrate with an existing one) to make an [OpenAI REST API](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets) request for an ephemeral key. You will use a [standard API key](https://platform.openai.com/settings/organization/api-keys) to authenticate this request on your backend server.

Below is an example of a simple Node.js [express](https://expressjs.com/) server which mints an ephemeral API key using the REST API:

```javascript
import express from "express";

const app = express();

const sessionConfig = JSON.stringify({
  session: {
    type: "realtime",
    model: "gpt-realtime-2.1",
    audio: {
      output: {
        voice: "marin",
      },
    },
  },
});

// An endpoint which would work with the client code above - it returns
// the contents of a REST API request to this protected endpoint
app.get("/token", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/client_secrets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "OpenAI-Safety-Identifier": "hashed-user-id",
        },
        body: sessionConfig,
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
});

app.listen(3000);
```


You can create a server endpoint like this one on any platform that can send and receive HTTP requests. Just ensure that **you only use standard OpenAI API keys on the server, not in the browser.**

When using ephemeral tokens, set `OpenAI-Safety-Identifier` on the server-side
request that creates the client secret. The Realtime API binds the identifier to
the resulting ephemeral token, so the browser does not need to send the safety
identifier when it later connects with that token.

#### Connecting to the server

In the browser, you can use standard WebRTC APIs to connect to the Realtime API with an ephemeral token. The client first fetches a token from your server endpoint, and then POSTs its SDP data (with the ephemeral token) to the Realtime API.

```javascript
// Get a session token for OpenAI Realtime API
const tokenResponse = await fetch("/token");
const data = await tokenResponse.json();
const EPHEMERAL_KEY = data.value;

// Create a peer connection
const pc = new RTCPeerConnection();

// Set up to play remote audio from the model
audioElement.current = document.createElement("audio");
audioElement.current.autoplay = true;
pc.ontrack = (e) => (audioElement.current.srcObject = e.streams[0]);

// Add local audio track for microphone input in the browser
const ms = await navigator.mediaDevices.getUserMedia({
  audio: true,
});
pc.addTrack(ms.getTracks()[0]);

// Set up data channel for sending and receiving events
const dc = pc.createDataChannel("oai-events");

// Start the session using the Session Description Protocol (SDP)
const offer = await pc.createOffer();
await pc.setLocalDescription(offer);

const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
  method: "POST",
  body: offer.sdp,
  headers: {
    Authorization: `Bearer ${EPHEMERAL_KEY}`,
    "Content-Type": "application/sdp",
  },
});

const answer = {
  type: "answer",
  sdp: await sdpResponse.text(),
};
await pc.setRemoteDescription(answer);
```


## Sending and receiving events

Realtime API sessions are managed using a combination of [client-sent events](https://developers.openai.com/api/reference/resources/realtime/client-events#session.update) emitted by you as the developer, and [server-sent events](https://developers.openai.com/api/reference/resources/realtime/server-events#error) created by the Realtime API to indicate session lifecycle events.

When connecting to a Realtime model via WebRTC, you don't have to handle audio events from the model in the same granular way you must with [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime). The WebRTC peer connection object, if configured as above, will do all that work for you.

To send and receive other client and server events, you can use the WebRTC peer connection's [data channel](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels).

```javascript
// This is the data channel set up in the browser code above...
const dc = pc.createDataChannel("oai-events");

// Listen for server events
dc.addEventListener("message", (e) => {
  const event = JSON.parse(e.data);
  console.log(event);
});

// Send client events
const event = {
  type: "conversation.item.create",
  item: {
    type: "message",
    role: "user",
    content: [
      {
        type: "input_text",
        text: "hello there!",
      },
    ],
  },
};
dc.send(JSON.stringify(event));
```


To learn more about managing Realtime conversations, refer to the [Realtime conversations guide](https://developers.openai.com/api/docs/guides/realtime-conversations).

[Realtime Console



      Check out the WebRTC Realtime API in this light weight example app.](https://github.com/openai/openai-realtime-console/)