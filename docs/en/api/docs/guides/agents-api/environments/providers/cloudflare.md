# Cloudflare

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

This guide uses **webhook-managed provisioning** with Cloudflare's reference Worker.

See the [application-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed/cloudflare) and [webhook-managed](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed/cloudflare) examples in the OpenAI Cookbook.

## How it works

1. Your application creates an Agents API session and sends input.
2. OpenAI sends session webhooks to a Worker in your Cloudflare account.
3. The Worker starts or reconnects a session-specific Container running `codex exec-server`. The executor connects outbound to OpenAI so the agent can run commands and work with files.

Your application uses the Agents API; the reference Worker manages sandbox provisioning. See [Sandbox lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle) for connection and recovery behavior.

## Before you begin

You need a Cloudflare account with Containers access, an OpenAI application API key, and a separate restricted executor key. Follow [executor authentication](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) to configure the keys. Keep the application key outside the Container.

[Create an agent](https://developers.openai.com/api/docs/guides/agents-api/configuration#reuse-an-agent-across-sessions) and save its ID as `OPENAI_AGENT_ID`. Use the same agent ID in your application and the reference Worker.

## Deploy the reference Worker

Cloudflare's [reference Worker](https://github.com/cloudflare/sandbox-sdk/tree/main/openai/agents-api) includes the webhook handler, Container image, deployment configuration, and cleanup endpoint.

Generate a secret for the cleanup endpoint and save it as `EXECUTOR_CLIENT_SECRET`:

```bash
openssl rand -hex 32
```

Deploy the Worker in your Cloudflare account:



Deploy to Cloudflare



Enter these values when prompted:

| Variable                  | Value                                                   |
| ------------------------- | ------------------------------------------------------- |
| `OPENAI_API_KEY`          | Key used by the Worker to retrieve session state        |
| `OPENAI_EXECUTOR_API_KEY` | Restricted key passed to `codex exec-server`            |
| `OPENAI_AGENT_ID`         | Agent ID served by this Worker                          |
| `OPENAI_WEBHOOK_SECRET`   | `pending-webhook-registration` for the first deployment |
| `EXECUTOR_CLIENT_SECRET`  | Secret generated for cleanup                            |

Save the deployed Worker URL as `WORKER_URL`.

### Register the webhook

Follow [webhook setup](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks#set-up-a-webhook) to register `$WORKER_URL/webhook` in your OpenAI project. Enable the events listed by Cloudflare's reference integration:

- `agent.session.created`
- `agent.session.action_required`
- `agent.session.in_progress`
- `agent.session.idle`
- `agent.session.failed`

Replace `OPENAI_WEBHOOK_SECRET` with the signing secret returned by OpenAI, then deploy the new Worker version. Check its configuration. These examples use standard HTTP clients to call the Worker:

Check Worker health

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.

const response = await fetch(
  "https://worker.example.com".replace(/\/+$/, "") + "/health",
  { method: "GET" }
);
if (!response.ok) throw new Error(`Request failed: ${response.status}`);
console.log(await response.text());
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.
import urllib.request

url = "https://worker.example.com".rstrip("/") + "/health"
request = urllib.request.Request(url, method="GET")
with urllib.request.urlopen(request) as response:
    print(response.read().decode())
```

```go
// Replace the illustrative IDs and URLs below with your own resource values.
import (
	"io"
	"net/http"
	"os"
	"strings"
)

endpoint := strings.TrimRight("https://worker.example.com", "/") + "/health"
request, err := http.NewRequest("GET", endpoint, nil)
if err != nil {
	panic(err)
}
response, err := http.DefaultClient.Do(request)
if err != nil {
	panic(err)
}
defer response.Body.Close()
if response.StatusCode/100 != 2 {
	panic(response.Status)
}
if _, err := io.Copy(os.Stdout, response.Body); err != nil {
	panic(err)
}
```

```java
// Replace the illustrative IDs and URLs below with your own resource values.
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

String endpoint = "https://worker.example.com".replaceAll("/+$", "") + "/health";
var request =
    HttpRequest.newBuilder(URI.create(endpoint))
        .method("GET", HttpRequest.BodyPublishers.noBody())
        .build();
var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
if (response.statusCode() / 100 != 2)
  throw new IllegalStateException("Request failed: " + response.statusCode());
System.out.println(response.body());
```

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
require "uri"
require "net/http"

uri = URI("https://worker.example.com".sub(%r{/+\z}, "") + "/health")
request = Net::HTTP::Get.new(uri)
response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") { |http| http.request(request) }
raise "Request failed: #{response.code}" unless response.is_a?(Net::HTTPSuccess)

puts response.body
```

```bash
curl --fail-with-body "$WORKER_URL/health"
```


The response should contain both `"configured": true` and `"webhook_configured": true`.

An `environment_connection` required action is the signal to reconnect an offline executor. An idle event alone isn't a safe shutdown signal; see [lifecycle behavior](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#lifecycle-behavior).

## Run a session

Follow the [session steps](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#run-a-session) with your application's `OPENAI_API_KEY` and the same `OPENAI_AGENT_ID` configured in the Worker. Create a self-hosted session and ask the agent to write and read `/workspace/hello.txt`.

The Worker receives the session webhooks and connects the sandbox executor. Your application streams the agent's output through the Agents API.

Save the session ID as `SESSION_ID`. To continue the conversation, open the session event stream before sending follow-up input. If the executor is offline, the new input requests an environment connection and waits for the Worker to reconnect it. Reconnection does not by itself restore files from a previous Container.

### Run your application in a Worker

Cloudflare's [basic Worker application](https://github.com/cloudflare/sandbox-sdk/tree/main/openai/agents-api/basic) uses the `@openai/agents-api` TypeScript SDK to create sessions, send initial and follow-up input, and clean up resources. Its `POST /demo` endpoint runs the workflow.

This application also uses webhook-managed provisioning. Running your application in a Worker doesn't mean it must provision the sandbox directly.

## Cleanup

When the application no longer needs the sandbox, call the reference Worker's authenticated cleanup endpoint:

Clean up the Worker sandbox

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.

const response = await fetch("https://worker.example.com/executors/sess_123", {
  method: "DELETE",
  headers: { Authorization: `Bearer ${process.env.EXECUTOR_CLIENT_SECRET}` },
});
if (!response.ok) throw new Error(`Request failed: ${response.status}`);
console.log(await response.text());
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.
import os
from urllib.parse import quote
import urllib.request

url = (
    "https://worker.example.com".rstrip("/")
    + "/executors/"
    + quote("sess_123", safe="")
)
request = urllib.request.Request(
    url,
    method="DELETE",
    headers={"Authorization": "Bearer " + os.environ["EXECUTOR_CLIENT_SECRET"]},
)
with urllib.request.urlopen(request) as response:
    print(response.read().decode())
```

```go
// Replace the illustrative IDs and URLs below with your own resource values.
import (
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
)

endpoint := strings.TrimRight("https://worker.example.com", "/") + "/executors/" + url.PathEscape("sess_123")
request, err := http.NewRequest("DELETE", endpoint, nil)
if err != nil {
	panic(err)
}
request.Header.Set("Authorization", "Bearer "+os.Getenv("EXECUTOR_CLIENT_SECRET"))
response, err := http.DefaultClient.Do(request)
if err != nil {
	panic(err)
}
defer response.Body.Close()
if response.StatusCode/100 != 2 {
	panic(response.Status)
}
if _, err := io.Copy(os.Stdout, response.Body); err != nil {
	panic(err)
}
```

```java
// Replace the illustrative IDs and URLs below with your own resource values.
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

String endpoint =
    "https://worker.example.com".replaceAll("/+$", "")
        + "/executors/"
        + URLEncoder.encode("sess_123", StandardCharsets.UTF_8).replace("+", "%20");
var request =
    HttpRequest.newBuilder(URI.create(endpoint))
        .header("Authorization", "Bearer " + System.getenv("EXECUTOR_CLIENT_SECRET"))
        .method("DELETE", HttpRequest.BodyPublishers.noBody())
        .build();
var response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
if (response.statusCode() / 100 != 2)
  throw new IllegalStateException("Request failed: " + response.statusCode());
System.out.println(response.body());
```

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
require "uri"
require "net/http"

uri = URI("https://worker.example.com".sub(%r{/+\z}, "") + "/executors/" + URI.encode_www_form_component("sess_123").gsub("+", "%20"))
request = Net::HTTP::Delete.new(uri)
request["Authorization"] = "Bearer #{ENV.fetch("EXECUTOR_CLIENT_SECRET")}"
response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") { |http| http.request(request) }
raise "Request failed: #{response.code}" unless response.is_a?(Net::HTTPSuccess)

puts response.body
```

```bash
curl --fail-with-body \
  --request DELETE \
  --header "Authorization: Bearer $EXECUTOR_CLIENT_SECRET" \
  "$WORKER_URL/executors/$SESSION_ID"
```


[Delete the Agents API session](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) separately. Session deletion does not emit a webhook, so perform both operations for immediate cleanup. Retrieve files you need before releasing the Container.

## Advanced: Application-managed provisioning

For direct control of sandbox provisioning, use the Cloudflare Sandbox SDK with the [application-managed lifecycle](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#manage-sandboxes-from-your-application) and [executor connection instructions](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted). Use one provisioning controller per session.

## References

- Read [Use Cloudflare Containers with OpenAI Agents API](https://developers.cloudflare.com/sandbox/guides/openai-agents-api/) for configuration, lifecycle behavior, snapshots, and image customization.
- Read [Cloudflare Sandbox documentation](https://developers.cloudflare.com/sandbox/).
- Read [Cloudflare Sandbox TypeScript SDK reference](https://developers.cloudflare.com/sandbox/api/).