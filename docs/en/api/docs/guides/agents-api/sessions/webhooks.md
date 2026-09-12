# Session webhooks

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use webhooks to respond to session state changes without keeping an event stream open. A webhook handler can [start or reconnect sandbox compute](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#set-up-webhook-managed-sandboxes), update your application, or trigger a workflow.

## Supported events

| Event                           | When it fires                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------- |
| `agent.session.created`         | A session is created.                                                                 |
| `agent.session.action_required` | The session needs a function result, initial environment connection, or reconnection. |
| `agent.session.in_progress`     | The session starts processing a turn.                                                 |
| `agent.session.idle`            | The session is idle and ready for more input.                                         |
| `agent.session.failed`          | The session enters a failed state.                                                    |

An `agent.session.action_required` event includes the session ID and a
`required_action.type` of `function_call` or `environment_connection`.

```json
{
  "type": "agent.session.action_required",
  "data": {
    "id": "sess_abc123",
    "required_action": { "type": "function_call" }
  }
}
```

Retrieve the session and inspect `required_actions` for call IDs, arguments, or
environment IDs. The webhook does not include those details.

## Set up a webhook

Follow the shared [webhook setup guide](https://developers.openai.com/api/docs/guides/webhooks#creating-webhook-endpoints) to create an endpoint and select Agents API events. Store the endpoint's signing secret for [signature verification](https://developers.openai.com/api/docs/guides/webhooks#verifying-webhook-signatures).

## Receive events

OpenAI sends a signed HTTP POST request whenever a subscribed event occurs:

```json
{
  "id": "evt_123",
  "object": "event",
  "created_at": 1750287018,
  "type": "agent.session.created",
  "data": {
    "id": "sess_abc123",
    "environment_id": "ccarenv_abc123",
    "environment_type": "self_hosted",
    "connect": {
      "remote_url": "https://api.openai.com/v1/agents/api"
    }
  }
}
```




Retrieve the session's current state before provisioning a sandbox. See [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#handle-lifecycle-webhooks).

### Start the executor

For self-hosted sessions, `agent.session.created` includes the environment ID and connection URL needed to start an executor. Set `ENVIRONMENT_ID` to `data.environment_id` and `REMOTE_URL` to `data.connect.remote_url`. This is the same URL returned as `environment.remote_url` on the session. Save both values and reuse them on reconnect:

```bash
CODEX_API_KEY="$OPENAI_ENVIRONMENT_KEY" \
codex exec-server \
  --remote "$REMOTE_URL" \
  --environment-id "$ENVIRONMENT_ID"
```

Use an [environment key](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) as `CODEX_API_KEY`. Keep your application API key outside the environment.

## Verify and process events

Set `OPENAI_API_KEY` and `OPENAI_WEBHOOK_SECRET`. For Python, install `fastapi`, `uvicorn`, and `openai`. For JavaScript, install `express` and `openai`.

The handlers verify signatures and listen on port 8000. Set `PORT` to change the port. In production, [queue slower work](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#handle-lifecycle-webhooks).

Webhook handler

```javascript
import express from "express";
import OpenAI from "openai";

const app = express();
const webhooks = new OpenAI({
  webhookSecret: process.env.OPENAI_WEBHOOK_SECRET,
});

app.post(
  "/webhooks/openai",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const payload = request.body.toString("utf8");
    try {
      await webhooks.webhooks.verifySignature(payload, request.headers);
    } catch {
      response.status(400).send("Invalid signature");
      return;
    }
    const event = JSON.parse(payload);
    if (event.type === "agent.session.idle") {
      const session = await webhooks.beta.agents.sessions.retrieve(
        event.data.id
      );
      console.log("session idle event:", session.id);
    } else {
      console.log("session event:", event.type, event.data.id);
    }
    response.sendStatus(200);
  }
);

app.listen(Number(process.env.PORT ?? 8000));
```

```python
import json
import os

import uvicorn
from fastapi import FastAPI, Request, Response
from openai import AsyncOpenAI, InvalidWebhookSignatureError

app = FastAPI()
webhooks = AsyncOpenAI(webhook_secret=os.environ["OPENAI_WEBHOOK_SECRET"])


@app.post("/webhooks/openai")
async def handle_webhook(request: Request):
    payload = await request.body()
    try:
        webhooks.webhooks.verify_signature(payload=payload, headers=request.headers)
    except (InvalidWebhookSignatureError, ValueError):
        return Response("Invalid signature", status_code=400)

    event = json.loads(payload)
    if event["type"] == "agent.session.idle":
        session_id = event["data"]["id"]
        session = await webhooks.beta.agents.sessions.retrieve(session_id, timeout=10)
        print("session idle event:", session.id)
    else:
        print("session event:", event["type"], event["data"]["id"])
    return Response(status_code=200)


if __name__ == "__main__":
    uvicorn.run(app, port=int(os.environ.get("PORT", "8000")))
```

```go
import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/openai/openai-go/v3"
)

client := openai.NewClient()
http.HandleFunc("/webhooks/openai", func(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Invalid body", http.StatusBadRequest)
		return
	}
	if err := client.Webhooks.VerifySignature(body, r.Header); err != nil {
		http.Error(w, "Invalid signature", http.StatusBadRequest)
		return
	}
	var event struct {
		Type string `json:"type"`
		Data struct {
			ID string `json:"id"`
		} `json:"data"`
	}
	if err := json.Unmarshal(body, &event); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}
	if event.Type == "agent.session.idle" {
		session, err := client.Beta.Agents.Sessions.Get(r.Context(), event.Data.ID)
		if err != nil {
			http.Error(w, "Could not retrieve session", http.StatusInternalServerError)
			return
		}
		fmt.Println("session idle event:", session.ID)
	} else {
		fmt.Println("session event:", event.Type, event.Data.ID)
	}
	w.WriteHeader(http.StatusOK)
})
port := os.Getenv("PORT")
if port == "" {
	port = "8000"
}
if err := http.ListenAndServe(":"+port, nil); err != nil {
	panic(err)
}
```

```java
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.core.http.Headers;
import com.openai.errors.InvalidWebhookSignatureException;
import com.openai.models.webhooks.WebhookVerificationParams;
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

OpenAIClient client = OpenAIOkHttpClient.fromEnv();
var json = new JsonMapper();
int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8000"));
var server = HttpServer.create(new InetSocketAddress(port), 0);
server.createContext(
    "/webhooks/openai",
    exchange -> {
      try (exchange) {
        if (!exchange.getRequestMethod().equals("POST")) {
          exchange.sendResponseHeaders(405, -1);
          return;
        }
        String payload =
            new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
        try {
          client
              .webhooks()
              .verifySignature(
                  WebhookVerificationParams.builder()
                      .payload(payload)
                      .headers(Headers.builder().putAll(exchange.getRequestHeaders()).build())
                      .build());
        } catch (InvalidWebhookSignatureException e) {
          exchange.sendResponseHeaders(400, -1);
          return;
        }
        var event = json.readTree(payload);
        if (event.path("type").asText().equals("agent.session.idle")) {
          var session =
              client
                  .beta()
                  .agents()
                  .sessions()
                  .retrieve(event.path("data").path("id").asText());
          System.out.println("session idle event: " + session.id());
        } else {
          System.out.println(
              "session event: "
                  + event.path("type").asText()
                  + " "
                  + event.path("data").path("id").asText());
        }
        exchange.sendResponseHeaders(200, -1);
      }
    });
server.start();
```

```ruby
require "openai"
require "webrick"
require "json"

client = OpenAI::Client.new
server = WEBrick::HTTPServer.new(Port: Integer(ENV.fetch("PORT", "8000")))
server.mount_proc "/webhooks/openai" do |request, response|
  if request.request_method != "POST"
    response.status = 405
    next
  end
  payload = request.body
  begin
    client.webhooks.verify_signature(payload, request.header.transform_values(&:first))
  rescue OpenAI::Errors::InvalidWebhookSignatureError
    response.status = 400
    response.body = "Invalid signature"
    next
  end
  event = JSON.parse(payload)
  if event["type"] == "agent.session.idle"
    session = client.beta.agents.sessions.retrieve(event.fetch("data").fetch("id"))
    puts "session idle event: #{session.id}"
  else
    puts "session event: #{event["type"]} #{event.dig("data", "id")}"
  end
  response.status = 200
end
trap("INT") { server.shutdown }
server.start
```


## Environment connection events

When initial or follow-up input needs a disconnected self-hosted executor, the API adds an `environment_connection` required action. It emits `agent.session.action_required` **before waiting** for the connection.

Retrieve the session and confirm that `required_actions` still requests a connection. Start the executor with `session.environment.id` and `session.environment.remote_url`. This webhook does not include `connect.remote_url`. If the executor connects before the wait expires, the API clears the required action and resumes the submission without client resubmission.

The API waits up to five minutes for the connection. A follow-up input request can remain open during this wait. Configure client and proxy timeouts accordingly. `agent.session.in_progress` confirms execution has started, not that the API is waiting for a connection.

If the wait expires, the submission fails. Initial input can fail asynchronously and leave the session in `failed`. The connection wait does not provide a durable input queue. A process crash or client disconnect may require retries.

## Session and turn outcomes

`agent.session.idle` means the session is ready for more input, not that its last turn succeeded. Inspect that turn's status or observe `agent.session.turn.completed`, `agent.session.turn.failed`, or `agent.session.turn.cancelled` on the session stream. A completed turn can still contain failed tool calls. Check tool results and the agent's final response.

`agent.session.failed` reports a failed session, not every failed turn. Session deletion has no corresponding webhook and does not stop provider compute.