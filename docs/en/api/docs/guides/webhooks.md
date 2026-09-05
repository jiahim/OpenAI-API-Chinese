# Webhooks

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

OpenAI [webhooks](http://chatgpt.com/?q=eli5+what+is+a+webhook?) allow you to receive real-time notifications about events in the API, such as when a batch completes, a background response is generated, or a fine-tuning job finishes. Webhooks are delivered to an HTTP endpoint you control, following the [Standard Webhooks specification](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md). The full list of webhook events can be found in the [API reference](https://developers.openai.com/api/reference/resources/webhooks).

To receive misalignment monitoring notifications for an API project, see [Receive project safety alerts](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring#receive-project-safety-alerts).

[API reference for webhook events



      View the full list of webhook events.](https://developers.openai.com/api/reference/resources/webhooks)

Below are examples of simple servers capable of ingesting webhooks from OpenAI, specifically for the [`response.completed`](https://developers.openai.com/api/reference/resources/webhooks) event.

For the Ruby examples, install the required dependencies with
`gem install openai webrick`, then set `OPENAI_API_KEY` and
`OPENAI_WEBHOOK_SECRET`.

Webhooks server

```javascript
import OpenAI from "openai";
import express from "express";

const app = express();
const client = new OpenAI({ webhookSecret: process.env.OPENAI_WEBHOOK_SECRET });

// Don't use express.json() because signature verification needs the raw text body
app.use(express.text({ type: "application/json" }));

app.post("/webhook", async (req, res) => {
  try {
    const event = await client.webhooks.unwrap(req.body, req.headers);

    if (event.type === "response.completed") {
      const response_id = event.data.id;
      const response = await client.responses.retrieve(response_id);
      const output_text = response.output
        .filter((item) => item.type === "message")
        .flatMap((item) => item.content)
        .filter((contentItem) => contentItem.type === "output_text")
        .map((contentItem) => contentItem.text)
        .join("");

      console.log("Response output:", output_text);
    }
    res.status(200).send();
  } catch (error) {
    if (error instanceof OpenAI.InvalidWebhookSignatureError) {
      console.error("Invalid signature", error);
      res.status(400).send("Invalid signature");
    } else {
      throw error;
    }
  }
});

app.listen(8000, () => {
  console.log("Webhook server is running on port 8000");
});
```

```python
import os
from openai import OpenAI, InvalidWebhookSignatureError
from flask import Flask, request, Response

app = Flask(__name__)
client = OpenAI(webhook_secret=os.environ["OPENAI_WEBHOOK_SECRET"])


@app.route("/webhook", methods=["POST"])
def webhook():
    try:
        # with webhook_secret set above, unwrap will raise an error if the signature is invalid
        event = client.webhooks.unwrap(request.data, request.headers)

        if event.type == "response.completed":
            response_id = event.data.id
            response = client.responses.retrieve(response_id)
            print("Response output:", response.output_text)

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

client = OpenAI::Client.new(
  webhook_secret: ENV.fetch("OPENAI_WEBHOOK_SECRET")
)

server = WEBrick::HTTPServer.new(
  BindAddress: "127.0.0.1",
  Port: Integer(ENV.fetch("OPENAI_WEBHOOK_PORT", "8000")),
  Logger: WEBrick::Log.new($stderr, WEBrick::BasicLog::WARN),
  AccessLog: []
)
response_workers = []

server.mount_proc("/webhook") do |request, response|
  if request.request_method != "POST"
    response.status = 405
    next
  end

  headers = request.header.transform_values(&:first)
  event = client.webhooks.unwrap(request.body, headers)

  if event.is_a?(OpenAI::Models::Webhooks::ResponseCompletedWebhookEvent)
    response_workers.select!(&:alive?)
    response_workers << Thread.new(event.data.id) do |response_id|
      completed_response = client.responses.retrieve(response_id)
      puts "Response output: #{completed_response.output_text}"
    end
  end

  response.status = 200
  response.body = "ok"
rescue OpenAI::Errors::InvalidWebhookSignatureError, ArgumentError => error
  warn "Invalid signature: #{error.message}"
  response.status = 400
  response.body = "Invalid signature"
ensure
  server.shutdown if ENV["OPENAI_WEBHOOK_EXIT_AFTER_REQUEST"] == "1"
end

Signal.trap("INT") { server.shutdown }
port = server.listeners.first.addr[1]
puts "Webhook server listening on http://127.0.0.1:#{port}/webhook"
$stdout.flush
server.start
response_workers.each(&:join)
```


To see a webhook like this one in action, you can set up a webhook endpoint in the OpenAI dashboard subscribed to `response.completed`, and then make an API request to [generate a response in background mode](https://developers.openai.com/api/docs/guides/background).

You can also trigger test events with sample data from the [webhook settings page](https://platform.openai.com/settings/project/webhooks).

Generate a background response

```bash
curl https://api.openai.com/v1/responses \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $OPENAI_API_KEY" \
-d '{
  "model": "gpt-6-astra",
  "input": "Write a very long novel about otters in space.",
  "background": true
}'
```

```javascript
import OpenAI from "openai";
const client = new OpenAI();

const resp = await client.responses.create({
  model: "gpt-6-astra",
  input: "Write a very long novel about otters in space.",
  background: true,
});

console.log(resp.status);
```

```python
from openai import OpenAI

client = OpenAI()

resp = client.responses.create(
    model="gpt-6-astra",
    input="Write a very long novel about otters in space.",
    background=True,
)

print(resp.status)
```

```go
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/responses"
)

func main() {
	client := openai.NewClient()

	response, err := client.Responses.New(context.Background(), responses.ResponseNewParams{
		Model:      "gpt-6-astra",
		Background: openai.Bool(true),
		Input: responses.ResponseNewParamsInputUnion{
			OfString: openai.String("Write a very long novel about otters in space."),
		},
	})
	if err != nil {
		panic(err)
	}

	fmt.Println(response.Status)
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.ResponseCreateParams;

ResponseCreateParams params =
    ResponseCreateParams.builder()
        .model("gpt-6-astra")
        .input("Write a detailed market analysis.")
        .background(true)
        .build();

var response = client.responses().create(params);
System.out.println(response.status().orElseThrow());
```

```csharp
using OpenAI.Responses;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
ResponsesClient client = new(key);

CreateResponseOptions options = new()
{
    Model = "gpt-6-astra",
    BackgroundModeEnabled = true,
};
options.InputItems.Add(
    ResponseItem.CreateUserMessageItem("Write a very long novel about otters in space.")
);

ResponseResult response = await client.CreateResponseAsync(options);
Console.WriteLine(response.Status);
```

```ruby
require "openai"

client = OpenAI::Client.new
response = client.responses.create(
  model: "gpt-6-astra",
  input: "Write a detailed market analysis.",
  background: true
)

puts(response.status)
```


In this guide, you will learn how to create webhook endpoints in the dashboard, set up server-side code to handle them, and verify that inbound requests originated from OpenAI.

## Creating webhook endpoints

To start receiving webhook requests on your server, log in to the dashboard and [open the webhook settings page](https://platform.openai.com/settings/project/webhooks). Webhooks are configured per-project.

Click the "Create" button to create a new webhook endpoint. You will configure three things:

- A name for the endpoint (just for your reference).
- A public URL to a server you control.
- One or more event types to subscribe to. When they occur, OpenAI will send an HTTP POST request to the URL specified.

<img src="https://cdn.openai.com/API/images/webhook_config.png"
  alt="webhook endpoint edit dialog"
  width="450"
  style={{ margin: "16px 0" }}
/>

After creating a new webhook, you'll receive a signing secret to use for server-side verification of incoming webhook requests. Save this value for later, since you won't be able to view it again.

With your webhook endpoint created, you'll next set up a server-side endpoint to handle those incoming event payloads.

## Handling webhook requests on a server

When an event happens that you're subscribed to, your webhook URL will receive an HTTP POST request like this:

```
POST https://yourserver.com/webhook
user-agent: OpenAI/1.0 (+https://platform.openai.com/docs/webhooks)
content-type: application/json
webhook-id: wh_685342e6c53c8190a1be43f081506c52
webhook-timestamp: 1750287078
webhook-signature: v1,K5oZfzN95Z9UVu1EsfQmfVNQhnkZ2pj9o9NDN/H/pI4=
{
  "object": "event",
  "id": "evt_685343a1381c819085d44c354e1b330e",
  "type": "response.completed",
  "created_at": 1750287018,
  "data": { "id": "resp_abc123" }
}
```

Your endpoint should respond quickly to these incoming HTTP requests with a successful (`2xx`) status code, indicating successful receipt. To avoid timeouts, we recommend offloading any non-trivial processing to a background worker so that the endpoint can respond immediately.
If the endpoint doesn't return a successful (`2xx`) status code, or doesn't respond within a few seconds, the webhook request will be retried. OpenAI will continue to attempt delivery for up to 72 hours with exponential backoff. Note that `3xx` redirects will not be followed; they are treated as failures and your endpoint should be updated to use the final destination URL.

In rare cases, due to internal system issues, OpenAI may deliver duplicate copies of the same webhook event. You can use the `webhook-id` header as an idempotency key to deduplicate.

### Testing webhooks locally

Testing webhooks requires a URL that is available on the public Internet. This can make development tricky, since your local development environment likely isn't open to the public. A few options that may help:

- [ngrok](https://ngrok.com/) which can expose your localhost server on a public URL
- Cloud development environments like [Replit](https://replit.com/), [GitHub Codespaces](https://github.com/features/codespaces), [Cloudflare Workers](https://workers.cloudflare.com/), or [v0 from Vercel](https://v0.dev/).

## Verifying webhook signatures

While you can receive webhook events from OpenAI and process the results without any verification, you should verify that incoming requests are coming from OpenAI, especially if your webhook will take any kind of action on the backend. The headers sent along with webhook requests contain information that can be used in combination with a webhook secret key to verify that the webhook originated from OpenAI.

When you create a webhook endpoint in the OpenAI dashboard, you'll be given a signing secret that you should make available on your server as an environment variable:

```
export OPENAI_WEBHOOK_SECRET="<your secret here>"
```

The simplest way to verify webhook signatures is by using the `unwrap()` method of the official OpenAI SDK helpers:

Signature verification with the OpenAI SDK

```javascript
const client = new OpenAI();
const webhook_secret = process.env.OPENAI_WEBHOOK_SECRET;
if (!webhook_secret) throw new Error("Set OPENAI_WEBHOOK_SECRET.");

// will throw if the signature is invalid
const event = await client.webhooks.unwrap(
  req.body,
  req.headers,
  webhook_secret
);
```

```python
import os

from flask import request
from openai import OpenAI

client = OpenAI()
webhook_secret = os.environ["OPENAI_WEBHOOK_SECRET"]

# will raise if the signature is invalid
event = client.webhooks.unwrap(
    request.data,
    request.headers,
    secret=webhook_secret,
)
```

```ruby
require "openai"
require "webrick"

client = OpenAI::Client.new(
  api_key: ENV.fetch("OPENAI_API_KEY"),
  webhook_secret: ENV.fetch("OPENAI_WEBHOOK_SECRET")
)
server = WEBrick::HTTPServer.new(
  BindAddress: "127.0.0.1",
  Port: Integer(ENV.fetch("OPENAI_WEBHOOK_PORT", "8000")),
  Logger: WEBrick::Log.new($stderr, WEBrick::BasicLog::WARN),
  AccessLog: []
)

server.mount_proc("/webhook") do |request, response|
  if request.request_method != "POST"
    response.status = 405
    next
  end

  headers = request.header.transform_values(&:first)
  event = client.webhooks.unwrap(request.body, headers)
  puts "Verified webhook event: #{event.type}"

  response.status = 200
  response.body = "ok"
rescue OpenAI::Errors::InvalidWebhookSignatureError, ArgumentError
  response.status = 400
  response.body = "Invalid signature"
ensure
  server.shutdown if ENV["OPENAI_WEBHOOK_EXIT_AFTER_REQUEST"] == "1"
end

Signal.trap("INT") { server.shutdown }
port = server.listeners.first.addr[1]
puts "Webhook server listening on http://127.0.0.1:#{port}/webhook"
$stdout.flush
server.start
```


Signatures can also be verified with the [Standard Webhooks libraries](https://github.com/standard-webhooks/standard-webhooks/tree/main?tab=readme-ov-file#reference-implementations):

Signature verification with Standard Webhooks libraries

```rust
use standardwebhooks::Webhook;

let webhook_secret = std::env::var("OPENAI_WEBHOOK_SECRET").expect("OPENAI_WEBHOOK_SECRET not set");
let wh = Webhook::new(webhook_secret);
wh.verify(webhook_payload, webhook_headers).expect("Webhook verification failed");
```

```php
$webhook_secret = getenv("OPENAI_WEBHOOK_SECRET");
$wh = new \StandardWebhooks\Webhook($webhook_secret);
$wh->verify($webhook_payload, $webhook_headers);
```


Alternatively, if needed, you can implement your own signature verification [as described in the Standard Webhooks spec](https://github.com/standard-webhooks/standard-webhooks/blob/main/spec/standard-webhooks.md#verifying-webhook-authenticity)

If you misplace or accidentally expose your signing secret, you can generate a new one by [rotating the signing secret](https://platform.openai.com/settings/project/webhooks).