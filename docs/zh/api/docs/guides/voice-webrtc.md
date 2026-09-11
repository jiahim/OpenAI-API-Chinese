# WebRTC

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

选择你的应用程序所使用的 API。每个 API 都有各自的身份验证、会话创建和事件契约。



## 将浏览器连接到 GPT-Live

在浏览器语音应用中使用 WebRTC。麦克风输入和生成的语音通过协商好的媒体轨道传输。数据通道承载 JSON 事件，用于转录、会话更新和委派任务。

你的浏览器创建一个会话描述协议 (SDP) offer。你的应用服务器使用 `POST /v1/live/sessions`，与对方交换以获取 answer，并使用项目的 API key。请将 key 和会话配置保存在你的受信服务器上。

### 准备工作

你需要：

- 一个具备 GPT-Live 访问权限的 API 密钥。
- 一个用于你所选 SDK 示例的服务端运行时。Node.js 示例需要 Node.js 22.6 或更高版本。
- 一个已授予麦克风权限的浏览器，运行于 HTTPS 或 localhost。

该示例使用 响应接口 的委托（delegation）功能，配合 `gpt-5.6-terra` 以及托管网页搜索。有关后端指令和应用工具，请参阅 [委托与工具](https://developers.openai.com/api/docs/guides/live-delegation)。有关语音和后端使用，请参阅 [成本优化](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live).

### 理解连接序列

1. 通过用户操作请求麦克风访问权限，并将其轨道添加到对等连接中。
2. 在创建 SDP offer 之前创建数据通道并注册事件监听器。
3. 设置本地描述，等待 ICE 候选收集完成，然后将 offer 发送到你的服务器。
4. 让你的服务器发布包含以下内容的 JSON： `session` 并 `transport: { type: "webrtc", sdp: ... }` 发送到 OpenAI。
5. 将返回的 SDP 应答设置为远端描述。等待 `session.started` 数据通道上的该事件，再发送应用命令。

HTTP 请求会启动会话。 **请勿发送 `session.start` 在数据通道上。** 该 `oai-events` 示例中的 string 是数据通道的标签。

使用以下方式创建 WebRTC 会话 `POST /v1/live/sessions` 会在初始化阶段计入 15 秒的语音时长。该时长会在会话开始运行后抵扣实际产生的时长费用，并不会在会话运行时额外增加 15 秒。详见 [WebRTC 初始化计费](https://developers.openai.com/api/docs/guides/voice-latency-cost?api=live#webrtc-initialization-charges) 以了解费用核算。

### 创建应用服务器

将服务器示例保存到新目录中，并设置 `OPENAI_API_KEY` 到其环境中。对于 Node.js，使用 `server.mjs` 并安装 `openai` 以及 `express` 配合 `npm install openai express`。请为其他语言变体安装相应的 OpenAI SDK；Ruby 示例还使用 `webrick`。此示例绑定到 `127.0.0.1`，接受来自 `http://localhost:3000`，的会话请求，并提供 `index.html` ，目录为你运行该命令时所在的目录。

请在下方选择服务器语言；每个变体都提供 `index.html` 以及相同的 `/api/session` 端点（端口 3000）。请使用支持 Live 的 SDK 版本。每次只运行一种变体。

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

```go
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/live"
	"github.com/openai/openai-go/v3/option"
)

func main() {
	client := openai.NewClient(option.WithMaxRetries(0))
	const origin = "http://localhost:3000"
	mux := http.NewServeMux()
	mux.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
		page, err := os.ReadFile("index.html")
		if err != nil {
			http.Error(w, "index.html unavailable", 500)
			return
		}
		w.Header().Set("Content-Type", "text/html")
		w.Write(page)
	})
	mux.HandleFunc("POST /api/session", func(w http.ResponseWriter, r *http.Request) {
		// Local-only demo: add application authentication before exposing it.
		if r.Header.Get("Origin") != origin {
			http.Error(w, "Unexpected request origin", 403)
			return
		}
		var offer struct {
			SDP string `json:"sdp"`
		}
		r.Body = http.MaxBytesReader(w, r.Body, 65536)
		if err := json.NewDecoder(r.Body).Decode(&offer); err != nil || strings.TrimSpace(offer.SDP) == "" {
			http.Error(w, "An SDP offer is required", 400)
			return
		}
		result, err := client.Live.New(r.Context(), live.LiveNewParams{
			Session: live.MediaSessionConfigParam{
				Model:        "gpt-live-1",
				Instructions: openai.String("Be concise. Delegate requests needing current information to the backend, which can search the web."),
				Delegation: live.MediaSessionConfigDelegationUnionParam{
					OfResponses: &live.MediaSessionConfigDelegationResponsesParam{
						Responses: live.ResponsesDelegationConfigParam{
							Model:        "gpt-5.6-terra",
							Instructions: openai.String("Use web search when current facts are needed. Return concise, grounded results for a spoken conversation."),
							Tools: []live.ResponsesDelegationConfigToolUnionParam{{
								OfWebSearch: &live.ResponsesDelegationConfigToolWebSearchParam{},
							}},
							ToolChoice: live.ResponsesDelegationConfigToolChoiceUnionParam{OfLiveToolChoiceEnum: openai.String("auto")},
						},
					},
				},
			},
			Transport: live.LiveNewParamsTransport{Sdp: offer.SDP},
		})
		if err != nil {
			log.Print(err)
			http.Error(w, "Live session creation failed", 502)
			return
		}
		// Return the SDK's typed session ID and SDP answer unchanged.
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(result)
	})
	log.Printf("Open %s", origin)
	log.Fatal(http.ListenAndServe("127.0.0.1:3000", mux))
}
```

```java
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.ObjectMappers;
import com.openai.models.live.LiveCreateParams;
import com.openai.models.live.LiveCreateResponse;
import com.openai.models.live.MediaSessionConfig;
import com.openai.models.live.ResponsesDelegationConfig;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class LiveConnectionWebrtcExample {
  record SDPOffer(String sdp) {}

  static void reply(HttpExchange exchange, int status, byte[] body, String contentType)
      throws IOException {
    exchange.getResponseHeaders().set("Content-Type", contentType);
    exchange.sendResponseHeaders(status, body.length);
    try (var output = exchange.getResponseBody()) {
      output.write(body);
    }
  }

  public static void main(String[] args) throws IOException {
    OpenAIClient client = OpenAIOkHttpClient.builder().fromEnv().maxRetries(0).build();
    JsonMapper json = ObjectMappers.jsonMapper();
    String origin = "http://localhost:3000";
    HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 3000), 0);
    server.createContext(
        "/",
        exchange -> {
          String path = exchange.getRequestURI().getPath();
          if (path.equals("/") && exchange.getRequestMethod().equals("GET")) {
            reply(exchange, 200, Files.readAllBytes(Path.of("index.html")), "text/html");
            return;
          }
          if (!path.equals("/api/session") || !exchange.getRequestMethod().equals("POST")) {
            reply(exchange, 404, new byte[0], "text/plain");
            return;
          }
          // Local-only demo: add application authentication before exposing it.
          if (!origin.equals(exchange.getRequestHeaders().getFirst("Origin"))) {
            reply(exchange, 403, new byte[0], "text/plain");
            return;
          }
          SDPOffer offer;
          try {
            byte[] body = exchange.getRequestBody().readNBytes(65537);
            if (body.length > 65536) throw new IOException("SDP offer too large");
            offer = json.readValue(body, SDPOffer.class);
            if (offer.sdp() == null || offer.sdp().isBlank())
              throw new IOException("Missing SDP offer");
          } catch (IOException error) {
            reply(
                exchange,
                400,
                "An SDP offer is required".getBytes(StandardCharsets.UTF_8),
                "text/plain");
            return;
          }
          try {
            LiveCreateResponse result =
                client
                    .live()
                    .create(
                        LiveCreateParams.builder()
                            .session(
                                MediaSessionConfig.builder()
                                    .model("gpt-live-1")
                                    .instructions(
                                        "Be concise. Delegate requests needing current information to the backend, which can search the web.")
                                    .responsesDelegation(
                                        ResponsesDelegationConfig.builder()
                                            .model("gpt-5.6-terra")
                                            .instructions(
                                                "Use web search when current facts are needed. Return concise, grounded results for a spoken conversation.")
                                            .addToolWebSearch()
                                            .toolChoice(
                                                ResponsesDelegationConfig.ToolChoice
                                                    .LiveToolChoiceEnum.AUTO)
                                            .build())
                                    .build())
                            .transport(
                                LiveCreateParams.Transport.builder().sdp(offer.sdp()).build())
                            .build());
            // Return the SDK's typed session ID and SDP answer unchanged.
            reply(exchange, 201, json.writeValueAsBytes(result), "application/json");
          } catch (com.openai.errors.OpenAIException error) {
            System.err.println(error.getMessage());
            reply(
                exchange,
                502,
                "Live session creation failed".getBytes(StandardCharsets.UTF_8),
                "text/plain");
          }
        });
    System.out.println("Open " + origin);
    server.start();
  }
}
```

```ruby
require "json"
require "openai"
require "webrick"

client = OpenAI::Client.new(max_retries: 0)
origin = "http://localhost:3000"
server = WEBrick::HTTPServer.new(Port: 3000, BindAddress: "127.0.0.1")
server.mount_proc("/") do |request, response|
  if request.path == "/" && request.request_method == "GET"
    response["Content-Type"] = "text/html"
    response.body = File.read("index.html")
    next
  end
  unless request.path == "/api/session" && request.request_method == "POST"
    response.status = 404
    next
  end
  # Local-only demo: add application authentication before exposing it.
  unless request["Origin"] == origin
    response.status = 403
    next
  end
  begin
    raise ArgumentError if request.body.to_s.bytesize > 65_536

    offer = JSON.parse(request.body.to_s)
    sdp = offer.fetch("sdp")
    raise ArgumentError unless sdp.is_a?(String) && !sdp.strip.empty?
  rescue JSON::ParserError, KeyError, ArgumentError
    response.status = 400
    response.body = "An SDP offer is required"
    next
  end
  session = OpenAI::Models::Live::MediaSessionConfig.new(
    model: "gpt-live-1",
    instructions: "Be concise. Delegate requests needing current information to the backend, which can search the web.",
    delegation: OpenAI::Models::Live::MediaSessionConfig::Delegation::Responses.new(
      responses: OpenAI::Models::Live::ResponsesDelegationConfig.new(
        model: "gpt-5.6-terra",
        instructions: "Use web search when current facts are needed. Return concise, grounded results for a spoken conversation.",
        tools: [OpenAI::Models::Live::ResponsesDelegationConfig::Tool::WebSearch.new],
        tool_choice: :auto
      )
    )
  )
  begin
    result = client.live.create(
      session: session,
      transport: OpenAI::Models::Live::LiveCreateParams::Transport.new(sdp: sdp)
    )
    # Return the SDK's typed session ID and SDP answer unchanged.
    response.status = 201
    response["Content-Type"] = "application/json"
    response.body = result.to_json
  rescue OpenAI::Errors::APIError => error
    warn(error.message)
    response.status = 502
    response.body = "Live session creation failed"
  end
end
trap("INT") { server.shutdown }
puts "Open #{origin}"
server.start
```


在将服务器开放给其他用户之前，请使用你应用的认证、授权、请求限制和 HTTPS 来保护 `/api/session` 。此本地示例中的来源检查不会对用户进行身份验证。

### 创建浏览器客户端

Create `index.html` 在运行服务器的目录中：

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

将以下代码粘贴到 module 脚本中。它会添加开始和结束控件，连接麦克风和输出音频，并处理会话事件。 `/api/session` 是你应用服务器上的一个路由。

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

/** @type {RTCPeerConnection | undefined} */
let peer;
/** @type {RTCDataChannel | undefined} */
let events;
/** @type {MediaStream | undefined} */
let microphone;
/** @type {ReturnType<typeof setTimeout> | undefined} */
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
      /** @type {import("openai/resources/live/live").ServerEvent} */
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
    /** @type {import("openai/resources/live/live").LiveCreateResponse} */
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


运行你选择的服务器（`node server.mjs`, `python server.py`, `go run main.go`, `ruby server.rb`，或 Java 的 `LiveConnectionWebrtcExample` 类），打开 `http://localhost:3000`，并选择 **Start conversation**。状态变为 **Connected**，后，提出一个需要最新信息的问题以测试托管搜索。如果浏览器阻止自动播放，请使用音频控件。

### 阅读会话响应

成功的请求会返回 HTTP 201，并附带包含会话 ID 和 SDP answer 的 JSON：

```json
{
  "session": { "id": "live_123" },
  "transport": { "type": "webrtc", "sdp": "<SDP answer>" }
}
```

读取 `result.session.id` 并传递 `result.transport.sdp` 到 `setRemoteDescription`。将会话 ID 视为不透明字符串，并原样保留，包括其前缀。

### 处理媒体和事件

通过媒体轨道发送麦克风音频并接收生成的语音。WebRTC 通过 SDP 协商音频格式，因此请省略 `audio.format` 会话配置中的相应字段。请勿发送 `session.input_audio.append` ，也不必接收 `session.output_audio.delta` 在数据通道上。

使用数据通道传输转录增量、会话命令以及嵌套的 `response.event` 消息。参见 [管理会话](https://developers.openai.com/api/docs/guides/live-conversations) 了解转录处理与生命周期事件，参见 [服务端控制](https://developers.openai.com/api/docs/guides/voice-server-controls?api=live) 了解你的服务端如何建立自己的事件连接。

如需结束对话，请发送 `session.close` 并持续接收直到 `session.closed` 事件，再关闭对等连接和麦克风轨道。示例在发送该命令前注册了最终事件监听器。如果连接先失败或超时，则无法确认最终用量。参见 [用量与优雅关闭](https://developers.openai.com/api/docs/guides/live-conversations#usage-and-graceful-close) 了解最终用量的处理方式。

  

  


[WebRTC](https://webrtc.org/) 是一组用于构建实时应用的强大标准接口。OpenAI Realtime API 支持通过 WebRTC 对等连接接入实时模型。

对于基于浏览器的语音到语音应用，建议从 [语音智能体](https://developers.openai.com/api/docs/guides/voice-agents)，入手，它涵盖了 Agents SDK 提供的更高级辅助工具以及用于管理 Realtime 会话的 API。WebRTC 接口强大且灵活，但比 Agents SDK 更底层。

当从客户端（例如网页浏览器或
  移动设备），我们建议使用 WebRTC 而非 WebSockets，以获得更
  稳定的性能。

有关在 WebRTC 之上构建用户界面的更多指南， [请参阅 MDN 上的文档](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API).

## 概述

Realtime API 支持两种从浏览器连接 Realtime API 的机制：使用临时 API 密钥（[通过 OpenAI REST API 生成](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets)），或者使用新的统一接口。通常，使用统一接口更简单，但会让你的应用服务器成为会话初始化关键路径的一部分。

### 使用统一接口连接

使用统一接口初始化 WebRTC 连接的过程如下（假设客户端为网页浏览器）：

1. 浏览器使用其 WebRTC 对等连接中的 SDP 数据向开发者控制的服务器发起请求。
2. 服务器将该 SDP 与其会话配置组合在一个多部分表单中，并将其发送给 OpenAI Realtime API，使用其 [标准 API 密钥](https://platform.openai.com/settings/organization/api-keys).

#### 通过统一接口创建会话

若要通过统一接口创建实时 API 会话，你需要在 服务端 构建一个小型的应用（或与现有应用集成）来发起对 `/v1/realtime/calls`。的请求。你将使用 [标准 API 密钥](https://platform.openai.com/settings/organization/api-keys) 在后端服务器上对该请求进行身份验证。

下面是一个使用 Node.js [express](https://expressjs.com/) 服务器创建实时 API 会话的示例：

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


如果你的应用为每个最终用户分配一个 [安全标识符](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers)
，请将其作为本次 `OpenAI-Safety-Identifier` 请求中的请求头传入。
服务端 请求。请使用稳定且保护隐私的值，例如经过哈希处理的
内部用户 ID。该请求头应由你受信的后端设置，而不是由
浏览器设置。

#### 连接到服务器

在浏览器中，你可以使用标准的 WebRTC API 通过你的应用服务器连接到 Realtime API。客户端会直接将其 SDP 数据 POST 到你的服务器。

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


### 使用临时令牌进行连接

使用临时 API 密钥初始化 WebRTC 连接的过程如下（假设使用 Web 浏览器客户端）：

1. 浏览器向开发者控制的服务器发送请求，以生成一个临时 API 密钥。
1. 开发者的服务器使用 [标准 API 密钥](https://platform.openai.com/settings/organization/api-keys) 向以下服务请求一个临时密钥 [OpenAI REST API](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets)，并将这个新密钥返回给浏览器。
1. 浏览器使用临时密钥直接通过 OpenAI Realtime API 对会话进行身份验证 [WebRTC 对等连接](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection).

![通过 WebRTC 连接到实时接口](https://openaidevs.retool.com/api/file/55b47800-9aaf-48b9-90d5-793ab227ddd3)

#### 创建临时令牌

要创建在客户端使用的临时令牌，你需要构建一个小型服务端应用（或与现有应用集成）来调用 [OpenAI REST API](https://developers.openai.com/api/reference/resources/realtime/subresources/client_secrets) 请求以获取一个临时密钥。你将使用一个 [标准 API 密钥](https://platform.openai.com/settings/organization/api-keys) 在后端服务器上对该请求进行身份验证。

下面是一个使用 Node.js [express](https://expressjs.com/) 使用该 REST API 颁发临时 API 密钥的服务器：

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


你可以在任何能够收发 HTTP 请求的平台上创建类似这样的服务端端点。只需确保 **仅在服务端使用标准的 OpenAI API 密钥，而不要在浏览器中使用。**

使用临时令牌时，请在 `OpenAI-Safety-Identifier` 创建客户端密钥的服务端
请求中设置该标识符。Realtime API 会将该标识符绑定到
由此生成的临时令牌，因此浏览器在稍后使用该令牌连接时无需再发送安全
标识符。

#### 连接到服务器

在浏览器中，你可以使用标准的 WebRTC API 通过临时令牌连接到 Realtime API。客户端首先从你的服务端端点获取一个令牌，然后将其 SDP 数据（连同临时令牌）POST 到 Realtime API。

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


## 发送和接收事件

Realtime API 会话通过结合使用 [客户端发送的事件](https://developers.openai.com/api/reference/resources/realtime/client-events#session.update) 由你作为开发者发送，以及 [服务器发送的事件](https://developers.openai.com/api/reference/resources/realtime/server-events#error) 由 Realtime API 生成以指示会话生命周期事件。

通过 WebRTC 连接到 Realtime 模型时，你不必像使用 [WebSockets](https://developers.openai.com/api/docs/guides/voice-websockets?api=realtime)。那样以同等粒度处理来自模型的音频事件。如果按上述配置，WebRTC 对等连接对象会为你完成所有这些工作。

若要发送和接收其他客户端与服务器事件，你可以使用 WebRTC 对等连接的 [data channel](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_data_channels).

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


若要详细了解如何管理 Realtime 会话，请参阅 [Realtime conversations guide](https://developers.openai.com/api/docs/guides/realtime-conversations).

[Realtime Console



      Check out the WebRTC Realtime API in this light weight example app.](https://github.com/openai/openai-realtime-console/)