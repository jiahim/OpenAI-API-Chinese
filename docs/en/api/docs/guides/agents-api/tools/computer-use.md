# Computer use

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Computer use lets an agent navigate websites and interact with browser interfaces
to test a website, collect information, or use an application through its UI.

The Agents API runs the browser in an OpenAI-hosted environment. Your application
starts the session and follows its events; the agent uses what it observes in
the browser to decide what to do next.

To run a browser task:

1. [Create a browser session](#configure-the-browser) and save the session ID.
2. [Follow session events and send the agent a task](#run-a-browser-task).
3. [Handle each website access request](#handle-origin-access). If the task needs an account, [handle sign-in](#handle-sign-in).
4. Wait for the main agent's turn to finish and verify its result. If the connection drops, [recover the same session](#recover-approval-handling) before retrying.
5. [Review saved browser activity](#follow-browser-activity), then [delete the session](#continue-and-clean-up) when you're finished.

## Configure the browser

Follow the [Agents API quickstart prerequisites](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites)
to create an API key and export `OPENAI_API_KEY`, then install the
[OpenAI SDK for your language](https://developers.openai.com/api/docs/libraries). For the JavaScript examples,
install `openai` and `prompt-sync`. The cURL examples require Bash and `jq`.

To enable browser access:

- Add `{ "type": "computer_use" }` to `agent.tools`.
- Set `environment.type` to `openai_hosted` and `environment.desktop.enabled` to `true`.

The JavaScript examples below form one walkthrough: create a session, handle
website approvals, then send a task and print the answer. Start by creating a
browser session with screenshots enabled. This does not start a task.

Create a browser session

```bash
# Requires Bash and jq. Keep the session ID for follow-up requests.
set -o pipefail
if ! session_id=$(curl --silent --show-error --fail https://api.openai.com/v1/agents/sessions \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": {
      "model": "gpt-6-astra",
      "instructions": "Read public documentation in the browser. Do not sign in or change any website data. Report the page title and URL you find.",
      "tools": [{ "type": "computer_use", "include_screenshots": true }]
    },
    "environment": {
      "type": "openai_hosted",
      "desktop": { "enabled": true },
      "network": { "access": "enabled" }
    }
  }' | jq --exit-status --raw-output '.id // empty'); then
  echo "Session creation failed or its outcome is unknown. Do not retry automatically." >&2
  exit 1
fi
printf 'Session ID: %s\n' "$session_id"
```

```javascript
import OpenAI from "openai";
import { open } from "node:fs/promises";

const client = new OpenAI();
const session = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions:
      "Read public documentation in the browser. Do not sign in or change any website data. Report the page title and URL you find.",
    tools: [{ type: "computer_use", include_screenshots: true }],
  },
  environment: {
    type: "openai_hosted",
    desktop: { enabled: true },
    network: { access: "enabled" },
  },
});
console.log("Session ID:", session.id);
```

```python
import base64
import os
from pathlib import Path

from openai import OpenAI

client = OpenAI()
session = client.beta.agents.sessions.create(
    agent={
        "model": "gpt-6-astra",
        "instructions": "Read public documentation in the browser. Do not sign in or change any website data. Report the page title and URL you find.",
        "tools": [{"type": "computer_use", "include_screenshots": True}],
    },
    environment={
        "type": "openai_hosted",
        "desktop": {"enabled": True},
        "network": {"access": "enabled"},
    },
)
print("Session ID:", session.id, flush=True)
ready_to_delete = False
```

```go
import (
	"bufio"
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
)

ctx := context.Background()
client := openai.NewClient()
session, err := client.Beta.Agents.Sessions.New(ctx, openai.BetaAgentSessionNewParams{
	Agent: openai.BetaAgentSessionNewParamsAgent{
		Model:        openai.String("gpt-6-astra"),
		Instructions: openai.String("Read public documentation in the browser. Do not sign in or change any website data. Report the page title and URL you find."),
		Tools: []openai.AgentToolParamUnion{{
			OfParamComputerUse: &openai.AgentToolParamComputerUse{IncludeScreenshots: openai.Bool(true)},
		}},
	},
	Environment: openai.EnvironmentParamUnion{OfParamOpenAIHosted: &openai.EnvironmentParamOpenAIHosted{
		Desktop: openai.EnvironmentParamOpenAIHostedDesktop{Enabled: true},
		Network: openai.EnvironmentParamOpenAIHostedNetwork{Access: "enabled"},
	}},
})
if err != nil {
	return err
}
fmt.Println("Session ID:", session.ID)
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.AgentSession;
import com.openai.models.beta.agents.AgentSessionInputMessageParam;
import com.openai.models.beta.agents.AgentSessionInputParam;
import com.openai.models.beta.agents.AgentSessionInputParam.AgentSessionInputComputerUseApprovalRequestResult;
import com.openai.models.beta.agents.AgentSessionInputParam.AgentSessionInputComputerUseApprovalRequestResult.Response;
import com.openai.models.beta.agents.AgentToolParam;
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;
import com.openai.models.beta.agents.sessions.events.EventCreateParams;
import com.openai.models.beta.agents.sessions.items.ItemListParams;
import java.nio.file.Files;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;

var client = OpenAIOkHttpClient.fromEnv();
var session =
    client
        .beta()
        .agents()
        .sessions()
        .create(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .instructions(
                            "Read public documentation in the browser. Do not sign in or change"
                                + " any website data. Report the page title and URL you find.")
                        .addTool(
                            AgentToolParam.ComputerUse.builder()
                                .includeScreenshots(true)
                                .build())
                        .build())
                .environment(
                    EnvironmentParam.OpenAIHosted.builder()
                        .desktop(
                            EnvironmentParam.OpenAIHosted.Desktop.builder()
                                .enabled(true)
                                .build())
                        .network(
                            EnvironmentParam.OpenAIHosted.Network.builder()
                                .access(EnvironmentParam.OpenAIHosted.Network.Access.ENABLED)
                                .build())
                        .build())
                .build());
System.out.println("Session ID: " + session.id());
```

```csharp
using System.ClientModel;
using System.ClientModel.Primitives;
using System.Text.Json;
using OpenAI;
using OpenAI.Agents;
#pragma warning disable OPENAI001

string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
OpenAIClientOptions options = new() { RetryPolicy = new ClientRetryPolicy(maxRetries: 0) };
AgentClient client = new OpenAIClient(new ApiKeyCredential(key), options).GetAgentClient();
AgentSession session = await client.CreateAgentSessionAsync(
    new AgentSessionCreationOptions
    {
        Agent = new SessionAgentConfigParam
        {
            Model = "gpt-6-astra",
            Instructions = "Read public documentation in the browser. Do not sign in or change any website data. Report the page title and URL you find.",
            Tools = [new AgentToolConfigParamComputerUse { IncludeScreenshots = true }],
        },
        Environment = new EnvironmentParamOpenaiHosted
        {
            Desktop = new DesktopParam(true),
            Network = new NetworkPolicyParam(NetworkAccessParam.Enabled),
        },
    }
);
Console.WriteLine($"Session ID: {session.Id}");
```

```ruby
require "base64"
require "openai"

client = OpenAI::Client.new
session = client.beta.agents.sessions.create(
  agent: {
    model: "gpt-6-astra",
    instructions: "Read public documentation in the browser. Do not sign in or change any website data. Report the page title and URL you find.",
    tools: [
      {
        type: "computer_use",
        include_screenshots: true
      }
    ]
  },
  environment: {
    type: "openai_hosted",
    desktop: { enabled: true },
    network: { access: "enabled" }
  }
)
puts "Session ID: #{session.id}"
```


## Handle origin access

The browser requires the user's approval before accessing each new website
origin, including public websites. Enabling network access does not approve
these requests.

To handle an origin approval:

1. On `agent.session.requires_action`, retrieve the session and inspect its current `required_actions`.
2. Find pending `computer_use_approval_request` entries whose nested `request.type` is `browser_origin_access`.
3. Show the requested `origin` and `reason` (if provided), then collect an `approve`, `deny`, or `cancel` decision. Submit it through the session events endpoint using the same `request_id` and a nested `response` containing `type: "browser_origin_access"` and `decision`, as shown below.

<details>
<summary>**Origin approval does not enforce confirmation before individual actions**</summary>

If your application must guarantee confirmation before purchases, destructive
changes, or other consequential actions, restrict the hosted browser to
resources that cannot perform them, or use a browser runtime you control.
Asking for confirmation through a function tool relies on the agent calling
that function.

Treat website content as untrusted. It cannot grant permission or override the
user's instructions. See the [confirmation and consent guidance for a runtime you control](https://developers.openai.com/api/docs/guides/tools-computer-use-integration#handle-user-confirmation-and-consent).

</details>

Define this helper before the task code. It handles origin approvals and cancels
sign-in requests because this task only reads public pages.

Respond to origin access requests

```bash
# Run in terminal 2 after the task reports agent.session.requires_action.
# Reuse the task's session_id and OPENAI_API_KEY.
curl --silent --show-error --fail-with-body "https://api.openai.com/v1/agents/sessions/$session_id" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  | jq '.required_actions[] | select(.type == "computer_use_approval_request")'

# Read request.origin and request.reason before deciding.
# Only use this response for request.type == "browser_origin_access".
# Replace REQUEST_ID and choose approve, deny, or cancel.
curl --fail-with-body "https://api.openai.com/v1/agents/sessions/$session_id/events" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [{
      "type": "agent.session.input.computer_use_approval_request_result",
      "request_id": "REQUEST_ID",
      "response": { "type": "browser_origin_access", "decision": "approve" }
    }]
  }'
```

```javascript
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

/** @param {OpenAI} client */
async function respondToOriginApproval(client, sessionId, approval) {
  const request = approval.request;
  if (request.type === "browser_origin_access") {
    console.log("Requested origin:", request.origin);
    console.log(request.reason ?? "The browser needs access to this origin.");
    let input;
    do {
      input =
        prompt("Allow access? [approve/deny/cancel, default deny] ")
          .trim()
          .toLowerCase() || "deny";
    } while (!["approve", "deny", "cancel"].includes(input));
    const decision =
      input === "approve" ? "approve" : input === "cancel" ? "cancel" : "deny";
    await client.beta.agents.sessions.events.create(sessionId, {
      events: [
        {
          type: "agent.session.input.computer_use_approval_request_result",
          request_id: approval.request_id,
          response: { type: "browser_origin_access", decision },
        },
      ],
    });
  } else if (request.type === "browser_authentication") {
    // This public-page task must not sign in.
    await client.beta.agents.sessions.events.create(sessionId, {
      events: [
        {
          type: "agent.session.input.computer_use_approval_request_result",
          request_id: approval.request_id,
          response: { type: "browser_authentication", action: "cancel" },
        },
      ],
    });
  } else {
    throw new Error(`Unsupported approval request: ${request.type}`);
  }
}
```

```python
def respond_to_origin_approval(client, session_id, approval):
    request = approval.request
    if request.type == "browser_origin_access":
        print(request.reason or "The browser needs access to an origin.")
        print("Origin:", request.origin)
        while True:
            decision = (
                input("Allow this origin? [approve/deny/cancel; default: deny] ")
                .strip()
                .lower()
                or "deny"
            )
            if decision in {"approve", "deny", "cancel"}:
                break
            print("Enter approve, deny, or cancel.")
        response = {"type": "browser_origin_access", "decision": decision}
    elif request.type == "browser_authentication":
        print("This public-page task does not sign in; cancelling the request.")
        response = {"type": "browser_authentication", "action": "cancel"}
    else:
        raise RuntimeError(f"Unsupported computer-use approval: {request.type}")

    client.beta.agents.sessions.events.create(
        session_id,
        events=[
            {
                "type": "agent.session.input.computer_use_approval_request_result",
                "request_id": approval.request_id,
                "response": response,
            }
        ],
    )
```

```go
func respondToOriginApproval(ctx context.Context, client *openai.Client, sessionID string, approval openai.AgentSessionRequiredActionComputerUseApprovalRequest) error {
	response := openai.AgentSessionInputParamAgentSessionInputComputerUseApprovalRequestResultResponseUnion{}
	switch approval.Request.Type {
	case "browser_origin_access":
		request := approval.Request.AsBrowserOriginAccess()
		fmt.Println("Requested origin:", request.Origin)
		if request.Reason != "" {
			fmt.Println(request.Reason)
		}
		originResponse := openai.AgentBrowserOriginAccessParam{Decision: "deny"}
		reader := bufio.NewReader(os.Stdin)
		for {
			fmt.Print("Allow this origin? [approve/deny/cancel; default: deny] ")
			choice, err := reader.ReadString('\n')
			if err != nil {
				return err
			}
			switch strings.ToLower(strings.TrimSpace(choice)) {
			case "approve":
				originResponse.Decision = "approve"
			case "", "deny":
				originResponse.Decision = "deny"
			case "cancel":
				originResponse.Decision = "cancel"
			default:
				fmt.Println("Enter approve, deny, or cancel.")
				continue
			}
			break
		}
		response.OfBrowserOriginAccess = &originResponse
	case "browser_authentication":
		fmt.Println("This public-page task does not sign in; cancelling the sign-in request.")
		response.OfBrowserAuthenticationCancel = &openai.AgentBrowserAuthenticationCancelParam{}
	default:
		return fmt.Errorf("unsupported computer-use approval: %s", approval.Request.Type)
	}
	return client.Beta.Agents.Sessions.Events.New(ctx, sessionID, openai.BetaAgentSessionEventNewParams{
		Events: []openai.AgentSessionInputParamUnion{{
			OfParamAgentSessionInputComputerUseApprovalRequestResult: &openai.AgentSessionInputParamAgentSessionInputComputerUseApprovalRequestResult{
				RequestID: approval.RequestID,
				Response:  response,
			},
		}},
	}, option.WithMaxRetries(0))
}
```

```java
static void respondToOriginApproval(
    OpenAIClient client,
    String sessionId,
    AgentSession.RequiredAction.ComputerUseApprovalRequest approval) {
  var console = System.console();
  if (console == null)
    throw new IllegalStateException("Run this example in an interactive terminal.");
  var result =
      AgentSessionInputComputerUseApprovalRequestResult.builder().requestId(approval.requestId());
  if (approval.request().browserOriginAccess().isPresent()) {
    var request = approval.request().browserOriginAccess().get();
    console.printf("Origin: %s%n", request.origin());
    console.printf("Reason: %s%n", request.reason().orElse("Not supplied"));
    String decision;
    while (true) {
      String input =
          console.readLine("Allow browser access? [approve/deny/cancel; default deny] ");
      if (input == null) throw new IllegalStateException("Approval input closed.");
      decision = input.strip().toLowerCase(java.util.Locale.ROOT);
      if (decision.isEmpty()) decision = "deny";
      if (List.of("approve", "deny", "cancel").contains(decision)) break;
      console.printf("Enter approve, deny, or cancel.%n");
    }
    result.response(
        Response.BrowserOriginAccess.builder()
            .decision(Response.BrowserOriginAccess.Decision.of(decision))
            .build());
  } else if (approval.request().browserAuthentication().isPresent()) {
    console.printf("Sign-in is outside this public-page task; cancelling the request.%n");
    result.response(
        Response.BrowserAuthentication.ofCancel(
            Response.BrowserAuthentication.Cancel.builder().build()));
  } else {
    throw new IllegalStateException("Unsupported computer-use approval request.");
  }
  client
      .withOptions(options -> options.maxRetries(0))
      .beta()
      .agents()
      .sessions()
      .events()
      .create(EventCreateParams.builder().sessionId(sessionId).addEvent(result.build()).build());
}
```

```csharp
static async Task RespondToOriginApprovalAsync(
    AgentClient client, string sessionId,
    SessionRequiredActionResourceComputerUseApprovalRequest approval)
{
    if (Console.IsInputRedirected)
    {
        throw new InvalidOperationException("Run this example in an interactive terminal.");
    }
    ComputerUseApprovalResponseParam response;
    if (approval.Request is ComputerUseApprovalRequestKindResourceBrowserOriginAccess origin)
    {
        Console.WriteLine($"Origin: {origin.Origin}");
        Console.WriteLine($"Reason: {origin.Reason ?? "Not supplied"}");
        string choice;
        while (true)
        {
            Console.Write("Allow browser access? [approve/deny/cancel; default deny] ");
            choice = (Console.ReadLine() ?? throw new EndOfStreamException("Approval input closed.")).Trim().ToLowerInvariant();
            if (choice.Length == 0) choice = "deny";
            if (choice is "approve" or "deny" or "cancel") break;
            Console.WriteLine("Enter approve, deny, or cancel.");
        }
        BrowserOriginAccessDecisionParam decision = choice switch
        {
            "approve" => BrowserOriginAccessDecisionParam.Approve,
            "cancel" => BrowserOriginAccessDecisionParam.Cancel,
            _ => BrowserOriginAccessDecisionParam.Deny,
        };
        response = new ComputerUseApprovalResponseParamBrowserOriginAccess(decision);
    }
    else if (approval.Request is ComputerUseApprovalRequestKindResourceBrowserAuthentication)
    {
        Console.WriteLine("Sign-in is outside this public-page task; cancelling the request.");
        response = new ComputerUseApprovalResponseParamBrowserAuthenticationCancel();
    }
    else
    {
        throw new InvalidOperationException("Unsupported computer-use approval request.");
    }
    await client.CreateAgentSessionEventsAsync(
        sessionId,
        new CreateSessionEventsParams(
            [new SessionInputParamAgentSessionInputComputerUseApprovalRequestResult(approval.RequestId, response)]
        )
    );
}
```

```ruby
def respond_to_origin_approval(client, session_id, approval)
  request = approval.request
  case request.type.to_s
  when "browser_origin_access"
    puts request.reason || "The browser needs access to an origin."
    puts "Origin: #{request.origin}"
    decision = loop do
      print "Allow this origin? [approve/deny/cancel; default: deny] "
      input = $stdin.gets || raise(EOFError, "Input closed before an origin decision.")
      choice = input.strip.downcase
      choice = "deny" if choice.empty?
      break choice if ["approve", "deny", "cancel"].include?(choice)

      puts "Enter approve, deny, or cancel."
    end
    response = {
      type: "browser_origin_access",
      decision: decision
    }
  when "browser_authentication"
    puts "This public-page task does not sign in; cancelling the request."
    response = {
      type: "browser_authentication",
      action: "cancel"
    }
  else
    raise "Unsupported computer-use approval: #{request.type}"
  end
  client.beta.agents.sessions.events.create(
    session_id,
    events: [
      {
        type: "agent.session.input.computer_use_approval_request_result",
        request_id: approval.request_id,
        response: response
      }
    ],
    request_options: { max_retries: 0 }
  )
end
```


Keep the stream open and handle every pending approval. Use `request_id` to
track requests, and remove approval controls when a request is no longer in the
session's `required_actions`. Cancelling an approval request does not cancel
the task.

A `202` response means the decision was accepted, not that navigation has
completed.

## Run a browser task

Ask the agent to find the Agents API quickstart on the public developer site and
report its title and URL.

Open the event stream before sending the task so your application receives the
first progress events. Handle [origin approvals](#handle-origin-access) as they
arrive to let the browser continue.

Send the task and follow its result

```bash
# Terminal 1: use session_id from the creation request.
# Keep this stream open. Wait for HTTP 200 before sending input.
set -o pipefail
curl --silent --show-error --fail --no-buffer --dump-header - \
  --suppress-connect-headers \
  "https://api.openai.com/v1/agents/sessions/$session_id/events" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Accept: text/event-stream" \
  | jq --raw-input --unbuffered '
      if startswith("HTTP/") then .
      elif startswith("data:") then
        (ltrimstr("data:") | fromjson?) |
        if .type == "agent.session.turn.output_text.done" then {type, text}
        elif .type == "agent.session.requires_action"
          or .type == "error"
          or .type == "agent.session.failed"
          or .type == "agent.session.environment.failed"
          or (.type | test("^agent.session.turn.(completed|failed|cancelled)$"))
        then {type, turn_id: .turn.id, subagent_id: .turn.subagent_id}
        else empty end
      else empty end'

# Terminal 2: replace sess_123 with the ID printed in terminal 1.
# Export OPENAI_API_KEY in this terminal too.
session_id="sess_123"
curl --fail-with-body "https://api.openai.com/v1/agents/sessions/$session_id/events" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [{
      "type": "agent.session.input.message",
      "input": [{
        "role": "user",
        "content": [{
          "type": "input_text",
          "text": "Open https://developers.openai.com in the browser. Find the Agents API quickstart, then report its page title and URL."
        }]
      }]
    }]
  }'
```

```javascript
const events = await client.beta.agents.sessions.events.stream(session.id);
const handledRequests = new Set();
let completed = false;
try {
  await client.beta.agents.sessions.events.create(session.id, {
    events: [
      {
        type: "agent.session.input.message",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: "Open https://developers.openai.com in the browser. Find the Agents API quickstart, then report its page title and URL.",
              },
            ],
          },
        ],
      },
    ],
  });
  for await (const event of events) {
    switch (event.type) {
      case "agent.session.requires_action": {
        const current = await client.beta.agents.sessions.retrieve(
          session.id
        );
        for (const approval of current.required_actions) {
          if (
            approval.type === "computer_use_approval_request" &&
            !handledRequests.has(approval.request_id)
          ) {
            await respondToOriginApproval(client, session.id, approval);
            handledRequests.add(approval.request_id);
          }
        }
        break;
      }
      case "agent.session.turn.output_text.done":
        console.log(event.text);
        break;
      case "error":
        throw new Error(event.error.message);
      case "agent.session.failed":
      case "agent.session.environment.failed":
        throw new Error(`Agent lifecycle failure: ${event.type}`);
      case "agent.session.turn.failed":
        if (event.turn.subagent_id === null) {
          throw new Error(event.turn.error?.message ?? "Browser task failed");
        }
        break;
      case "agent.session.turn.cancelled":
        if (event.turn.subagent_id === null) {
          throw new Error("Browser task was cancelled");
        }
        break;
      case "agent.session.turn.completed":
        if (event.turn.subagent_id === null) completed = true;
        break;
    }
    if (completed) break;
  }
  if (!completed) {
    throw new Error("Stream closed before the browser task finished");
  }
  console.log();
} finally {
  events.controller.abort();
}
```

```python
handled_requests = set()
completed = False
with client.beta.agents.sessions.events.stream(session.id) as events:
    client.beta.agents.sessions.events.create(
        session.id,
        events=[
            {
                "type": "agent.session.input.message",
                "input": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "input_text",
                                "text": "Open https://developers.openai.com in the browser. Find the Agents API quickstart, then report its page title and URL.",
                            }
                        ],
                    }
                ],
            }
        ],
    )
    for event in events:
        if event.type == "agent.session.requires_action":
            current = client.beta.agents.sessions.retrieve(session.id)
            for approval in current.required_actions:
                if (
                    approval.type == "computer_use_approval_request"
                    and approval.request_id not in handled_requests
                ):
                    respond_to_origin_approval(client, session.id, approval)
                    handled_requests.add(approval.request_id)
        elif event.type == "agent.session.turn.output_text.done":
            print(event.text, flush=True)
        elif event.type == "agent.session.turn.completed":
            if event.turn.subagent_id is None:
                completed = True
                print()
                break
        elif event.type in {
            "agent.session.turn.failed",
            "agent.session.turn.cancelled",
        }:
            if event.turn.subagent_id is None:
                raise RuntimeError(f"Browser task ended: {event.type}")
        elif event.type == "error":
            raise RuntimeError(event.error.message)
        elif event.type in {
            "agent.session.failed",
            "agent.session.environment.failed",
        }:
            raise RuntimeError(f"Session failed: {event.type}")
    else:
        raise RuntimeError("Stream closed before the browser task finished.")
```

```go
handledRequests := map[string]bool{}
	events := client.Beta.Agents.Sessions.Events.StreamStreaming(ctx, session.ID)
	defer events.Close()
	if err := events.Err(); err != nil {
		return err
	}
	err = client.Beta.Agents.Sessions.Events.New(ctx, session.ID, openai.BetaAgentSessionEventNewParams{
		Events: []openai.AgentSessionInputParamUnion{{
			OfParamAgentSessionInputMessage: &openai.AgentSessionInputParamAgentSessionInputMessage{
				Input: []openai.AgentSessionInputMessageParam{{
					Role: "user",
					Content: []openai.InputContentParamUnion{{
						OfParamInputText: &openai.InputContentParamInputText{
							Text: "Open https://developers.openai.com in the browser. Find the Agents API quickstart, then report its page title and URL.",
						},
					}},
				}},
			},
		}},
	})
	if err != nil {
		return err
	}
	completed := false
eventLoop:
	for events.Next() {
		event := events.Current()
		switch event.Type {
		case "agent.session.requires_action":
			current, err := client.Beta.Agents.Sessions.Get(ctx, session.ID)
			if err != nil {
				return err
			}
			for _, action := range current.RequiredActions {
				if action.Type != "computer_use_approval_request" {
					continue
				}
				approval := action.AsComputerUseApprovalRequest()
				if handledRequests[approval.RequestID] {
					continue
				}
				if err := respondToOriginApproval(ctx, &client, session.ID, approval); err != nil {
					return err
				}
				handledRequests[approval.RequestID] = true
			}
		case "agent.session.turn.output_text.done":
			fmt.Println(event.Text)
		case "agent.session.turn.completed":
			if event.Turn.SubagentID == "" {
				completed = true
				break eventLoop
			}
		case "agent.session.turn.failed", "agent.session.turn.cancelled":
			if event.Turn.SubagentID == "" {
				return fmt.Errorf("browser task ended: %s", event.Type)
			}
		case "error":
			return fmt.Errorf("agent error: %s", event.Error.Message)
		case "agent.session.failed", "agent.session.environment.failed":
			return fmt.Errorf("session failed: %s", event.Type)
		}
	}
	if err := events.Err(); err != nil {
		return err
	}
	if !completed {
		return fmt.Errorf("stream closed before the browser task finished")
	}
```

```java
var handledRequests = new HashSet<String>();
try (var events = client.beta().agents().sessions().events().streamStreaming(session.id())) {
  client
      .beta()
      .agents()
      .sessions()
      .events()
      .create(
          EventCreateParams.builder()
              .sessionId(session.id())
              .addEvent(
                  AgentSessionInputParam.AgentSessionInputMessage.builder()
                      .addInput(
                          AgentSessionInputMessageParam.builder()
                              .addInputTextContent(
                                  "Open https://developers.openai.com in the browser. Find"
                                      + " the Agents API quickstart, then report its page"
                                      + " title and URL.")
                              .build())
                      .build())
              .build());
  boolean completed = false;
  var iterator = events.stream().iterator();
  while (iterator.hasNext()) {
    var event = iterator.next();
    if (event.requiresAction().isPresent()) {
      var current = client.beta().agents().sessions().retrieve(session.id());
      for (var action : current.requiredActions()) {
        if (action.computerUseApprovalRequest().isEmpty()) continue;
        var approval = action.computerUseApprovalRequest().get();
        if (!handledRequests.contains(approval.requestId())) {
          respondToOriginApproval(client, session.id(), approval);
          handledRequests.add(approval.requestId());
        }
      }
    }
    event.turnOutputTextDone().ifPresent(text -> System.out.println(text.text()));
    if (event.turnCompleted().filter(e -> e.turn().subagentId().isEmpty()).isPresent()) {
      completed = true;
      break;
    }
    if (event.turnFailed().filter(e -> e.turn().subagentId().isEmpty()).isPresent()
        || event.turnCancelled().filter(e -> e.turn().subagentId().isEmpty()).isPresent()) {
      throw new IllegalStateException("Browser task failed or was cancelled.");
    }
    if (event.error().isPresent()) {
      throw new IllegalStateException(event.error().get().error().message());
    }
    if (event.failed().isPresent() || event.environmentFailed().isPresent()) {
      throw new IllegalStateException("The browser session failed.");
    }
  }
  if (!completed) {
    throw new IllegalStateException("Stream closed before the browser task finished.");
  }
}
```

```csharp
HashSet<string> handledRequests = new(StringComparer.Ordinal);
await using var events = await client.GetAgentSessionEventsAsync(session.Id);
await client.CreateAgentSessionEventsAsync(
    session.Id,
    new CreateSessionEventsParams(
        [
            new SessionInputParamAgentSessionInputMessage(
                [
                    new InputMessageParam(
                        [new InputContentParamInputText("Open https://developers.openai.com in the browser. Find the Agents API quickstart, then report its page title and URL.")]
                    ),
                ]
            ),
        ]
    )
);
bool completed = false;
await foreach (var message in events)
{
    using JsonDocument document = JsonDocument.Parse(message.Data.ToMemory());
    JsonElement current = document.RootElement;
    string? type = current.GetProperty("type").GetString();
    if (type == "agent.session.requires_action")
    {
        AgentSession latest = await client.RetrieveAgentSessionAsync(session.Id);
        foreach (SessionRequiredActionResource action in latest.RequiredActions)
        {
            if (action is SessionRequiredActionResourceComputerUseApprovalRequest approval
                && !handledRequests.Contains(approval.RequestId))
            {
                await RespondToOriginApprovalAsync(client, session.Id, approval);
                handledRequests.Add(approval.RequestId);
            }
        }
    }
    else if (type == "agent.session.turn.output_text.done")
    {
        Console.WriteLine(current.GetProperty("text").GetString());
    }
    else if (type is "agent.session.turn.completed" or "agent.session.turn.failed" or "agent.session.turn.cancelled")
    {
        JsonElement turn = current.GetProperty("turn");
        if (turn.TryGetProperty("subagent_id", out JsonElement subagent)
            && subagent.ValueKind != JsonValueKind.Null)
        {
            continue;
        }
        if (type != "agent.session.turn.completed")
        {
            throw new InvalidOperationException($"Browser task ended: {type}");
        }
        completed = true;
        break;
    }
    else if (type == "error")
    {
        throw new InvalidOperationException(current.GetProperty("error").GetProperty("message").GetString());
    }
    else if (type is "agent.session.failed" or "agent.session.environment.failed")
    {
        throw new InvalidOperationException($"Session failed: {type}");
    }
}
if (!completed)
{
    throw new InvalidOperationException("Stream closed before the browser task finished.");
}
```

```ruby
handled_requests = Set.new
events = client.beta.agents.sessions.events.stream_streaming(session.id)
begin
  client.beta.agents.sessions.events.create(
    session.id,
    events: [
      {
        type: "agent.session.input.message",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: "Open https://developers.openai.com in the browser. Find the Agents API quickstart, then report its page title and URL."
              }
            ]
          }
        ]
      }
    ]
  )
  completed = events.any? do |event|
    case event
    when OpenAI::Beta::AgentSessionRequiresActionEvent
      current = client.beta.agents.sessions.retrieve(session.id)
      current.required_actions.each do |approval|
        next unless approval.is_a?(OpenAI::Beta::AgentSession::RequiredAction::ComputerUseApprovalRequest)
        next if handled_requests.include?(approval.request_id)

        respond_to_origin_approval(client, session.id, approval)
        handled_requests.add(approval.request_id)
      end
      false
    when OpenAI::Beta::AgentSessionTurnOutputTextDoneEvent
      puts event.text
    when OpenAI::Beta::AgentSessionTurnCompletedEvent
      event.turn.subagent_id.nil?
    when OpenAI::Beta::AgentSessionTurnFailedEvent, OpenAI::Beta::AgentSessionTurnCancelledEvent
      raise "Browser task ended: #{event.type}" if event.turn.subagent_id.nil?
    when OpenAI::Beta::AgentSessionErrorEvent
      raise event.error.message
    when OpenAI::Beta::AgentSessionFailedEvent, OpenAI::Beta::AgentSessionEnvironmentFailedEvent
      raise "Session failed: #{event.type}"
    else
      false
    end
  end
  raise "Stream closed before the browser task finished." unless completed
ensure
  events.close
end
```


The example prints the agent's answer. Check that it includes the title and URL
of the quickstart.

Closing the event stream does not stop the task. To stop it, cancel the turn.
For connection failures or uncertain outcomes, follow
[recovery guidance](#recover-approval-handling). The
[expanded cURL example](#request-handling-reference) includes transport and error
diagnostics.

## Follow browser activity

Browser operations appear as `computer_use_call` items in session output. Streamed
activity and saved session history use the same item shape.

| Field     | Meaning                                                |
| --------- | ------------------------------------------------------ |
| `id`      | The activity item's identifier.                        |
| `turn_id` | The turn that produced the activity.                   |
| `title`   | A description of the browser activity, or `null`.      |
| `status`  | `in_progress`, `completed`, `failed`, or `incomplete`. |
| `output`  | Screenshot output, when available.                     |

Use the title and status to show progress in your application. A browser activity
item describes a tool operation; it's not the agent's final answer or the
completion status of the whole turn. See
[Events and items](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) for the session event model.

### Include screenshots

To display the browser's progress in your application, set `include_screenshots`
to `true` on the `computer_use` tool. Screenshots are excluded from API output
by default; the agent can still observe them.

Each browser operation returns its last emitted screenshot in `output`, when
available:

```json
{
  "type": "computer_screenshot",
  "image_url": "data:image/jpeg;base64,..."
}
```

Use `image_url` to render the screenshot. Some operations return `output: null`,
even with screenshots enabled, so your application should handle activity items
without an image.

Screenshots can contain sensitive page or account data. Show them only to
  authorized users and keep them out of application logs.

Retrieve saved browser activity after the turn completes. The SDK examples save
the latest available screenshot to `browser-screenshot.jpg`.

Read browser activity

```bash
# Save the first page privately; image data stays out of terminal output.
activity_file=$(mktemp)
curl --silent --show-error --fail-with-body --get \
  "https://api.openai.com/v1/agents/sessions/$session_id/items" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  --data-urlencode "order=asc" --data-urlencode "limit=100" \
  --output "$activity_file"

jq '.data[] | select(.type == "computer_use_call") |
  {id, title: (.title // "Browser activity"), status,
   has_screenshot: (.output != null)}' "$activity_file"
jq '{has_more, last_id}' "$activity_file"
printf 'Saved activity JSON: %s\n' "$activity_file"

# If has_more is true, repeat the GET with --data-urlencode "after=LAST_ID".
# Use the returned last_id and keep order=asc on every page.
```

```javascript
let screenshot;
for await (const item of client.beta.agents.sessions.items.list(session.id, {
  order: "asc",
  limit: 100,
})) {
  if (item.type !== "computer_use_call") continue;
  console.log(item.title ?? "Browser activity", item.status);
  const output = item.output;
  if (
    output?.type === "computer_screenshot" &&
    output.image_url.startsWith("data:image/jpeg;base64,")
  ) {
    screenshot = Buffer.from(output.image_url.split(",", 2)[1], "base64");
  }
}
if (screenshot) {
  const file = await open("browser-screenshot.jpg", "wx", 0o600);
  try {
    await file.writeFile(screenshot);
  } finally {
    await file.close();
  }
  console.log("Saved browser-screenshot.jpg");
} else {
  console.log("No browser screenshot was returned.");
}
```

```python
last_screenshot = None
for item in client.beta.agents.sessions.items.list(
    session.id, order="asc", limit=100
):
    if item.type != "computer_use_call":
        continue
    print(item.title or "Browser activity", item.status)
    output = getattr(item, "output", None)
    if output is not None and output.type == "computer_screenshot":
        prefix = "data:image/jpeg;base64,"
        if output.image_url.startswith(prefix):
            last_screenshot = base64.b64decode(
                output.image_url[len(prefix) :], validate=True
            )

if last_screenshot is not None:
    screenshot_path = Path("browser-screenshot.jpg")
    descriptor = os.open(
        screenshot_path, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600
    )
    with os.fdopen(descriptor, "wb") as screenshot_file:
        screenshot_file.write(last_screenshot)
    print("Saved screenshot:", screenshot_path)
else:
    print("No screenshot was returned.")
ready_to_delete = completed
```

```go
var lastScreenshot []byte
items := client.Beta.Agents.Sessions.Items.ListAutoPaging(ctx, session.ID, openai.BetaAgentSessionItemListParams{
	Order: "asc", Limit: openai.Int(100),
})
for items.Next() {
	item := items.Current()
	if item.Type != "computer_use_call" {
		continue
	}
	activity := item.AsComputerUseCall()
	title := activity.Title
	if title == "" {
		title = "Browser activity"
	}
	fmt.Println(title, activity.Status)
	if !activity.JSON.Output.Valid() || activity.Output.Type != "computer_screenshot" {
		continue
	}
	const prefix = "data:image/jpeg;base64,"
	if strings.HasPrefix(activity.Output.ImageURL, prefix) {
		lastScreenshot, err = base64.StdEncoding.DecodeString(strings.TrimPrefix(activity.Output.ImageURL, prefix))
		if err != nil {
			return err
		}
	}
}
if err := items.Err(); err != nil {
	return err
}
if lastScreenshot != nil {
	file, err := os.OpenFile("browser-screenshot.jpg", os.O_CREATE|os.O_WRONLY|os.O_EXCL, 0o600)
	if err != nil {
		return err
	}
	defer file.Close()
	if err := file.Chmod(0o600); err != nil {
		return err
	}
	if _, err := file.Write(lastScreenshot); err != nil {
		return err
	}
	fmt.Println("Saved screenshot: browser-screenshot.jpg")
} else {
	fmt.Println("No screenshot was returned.")
}
readyToDelete = true
```

```java
byte[] lastScreenshot = null;
var items =
    client
        .beta()
        .agents()
        .sessions()
        .items()
        .list(
            ItemListParams.builder()
                .sessionId(session.id())
                .order(ItemListParams.Order.ASC)
                .limit(100L)
                .build());
for (var item : items.autoPager()) {
  if (item.computerUseCall().isEmpty()) continue;
  var activity = item.computerUseCall().get();
  System.out.println(activity.title().orElse("Browser activity") + " " + activity.status());
  var output = activity.output();
  if (output.isPresent()) {
    String imageUrl = output.get().imageUrl();
    String prefix = "data:image/jpeg;base64,";
    if (imageUrl.startsWith(prefix)) {
      lastScreenshot = Base64.getDecoder().decode(imageUrl.substring(prefix.length()));
    }
  }
}
if (lastScreenshot != null) {
  var screenshotPath = Files.createTempFile("browser-screenshot-", ".jpg");
  Files.write(screenshotPath, lastScreenshot);
  System.out.println("Saved screenshot: " + screenshotPath);
} else {
  System.out.println("No screenshot was returned.");
}
```

```csharp
byte[]? lastScreenshot = null;
await foreach (AgentSessionItem item in client.GetAgentSessionItemsAsync(
    session.Id, limit: 100, order: AgentSessionItemCollectionOrder.Ascending))
{
    if (item is not ComputerUseCallItemResource activity)
    {
        continue;
    }
    Console.WriteLine($"{activity.Title ?? "Browser activity"}: {activity.Status}");
    if (activity.Output is ComputerUseOutputResourceComputerScreenshot screenshot)
    {
        const string prefix = "data:image/jpeg;base64,";
        if (screenshot.ImageUrl.StartsWith(prefix, StringComparison.Ordinal))
        {
            lastScreenshot = Convert.FromBase64String(screenshot.ImageUrl[prefix.Length..]);
        }
    }
}
if (lastScreenshot is not null)
{
    FileStreamOptions fileOptions = new()
    {
        Mode = FileMode.CreateNew,
        Access = FileAccess.Write,
        Share = FileShare.None,
    };
    if (!OperatingSystem.IsWindows())
    {
        fileOptions.UnixCreateMode = UnixFileMode.UserRead | UnixFileMode.UserWrite;
    }
    await using FileStream file = new("browser-screenshot.jpg", fileOptions);
    if (!OperatingSystem.IsWindows())
    {
        File.SetUnixFileMode(file.SafeFileHandle, UnixFileMode.UserRead | UnixFileMode.UserWrite);
    }
    await file.WriteAsync(lastScreenshot);
    Console.WriteLine("Saved screenshot: browser-screenshot.jpg");
}
else
{
    Console.WriteLine("No screenshot was returned.");
}
```

```ruby
last_screenshot = String.new(encoding: Encoding::BINARY)
items = client.beta.agents.sessions.items.list(
  session.id,
  order: "asc",
  limit: 100
)
items.auto_paging_each do |item|
  next unless item.is_a?(OpenAI::Beta::AgentComputerUseCallItem)

  puts "#{item.title || "Browser activity"}: #{item.status}"
  output = item.output
  if output&.type.to_s == "computer_screenshot"
    prefix = "data:image/jpeg;base64,"
    if output.image_url.start_with?(prefix)
      last_screenshot.replace(Base64.strict_decode64(output.image_url.delete_prefix(prefix)))
    end
  end
end

if last_screenshot.empty?
  puts "No screenshot was returned."
else
  screenshot_path = "browser-screenshot.jpg"
  File.open(screenshot_path, File::WRONLY | File::CREAT | File::EXCL, 0o600) do |file|
    file.chmod(0o600)
    file.binmode
    file.write(last_screenshot)
  end
  puts "Saved screenshot: #{screenshot_path}"
end
```


The SDK examples do not overwrite existing files. Move or remove
`browser-screenshot.jpg` before running them again.

## Handle sign-in

Tasks such as reading issues in a private GitHub repository require an
authenticated browser. Your application handles sign-in so users can choose a
login method and enter credentials outside the chat.

Sign-in can involve several requests. For example, a site might ask the user to
choose email sign-in, enter an email address, and then enter a verification code.
Build your UI from each request's login methods and fields.

Only the main agent can request browser authentication;
  [subagents](https://developers.openai.com/api/docs/guides/agents-api/multi-agent) cannot. This flow
  supports email addresses, passwords, and verification codes, but not passkeys
  or QR-code sign-in. Sites that require an unsupported method cannot complete
  sign-in through this flow.

Keep the task's event stream open and handle
[origin approvals](#handle-origin-access) as they arrive. On
`agent.session.requires_action`, retrieve the session and look in its current
`required_actions` for `computer_use_approval_request` entries whose nested
`request.type` is `browser_authentication`.

Use the nested `request` to render your sign-in UI:

| Field               | How to use it                                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `reason`            | Explain why input is needed, if provided. Can be `null`.                                                    |
| `credential_origin` | Show the destination the credentials are for. Can be `null`.                                                |
| `fields`            | Render inputs using each field's `id`, `label`, `type`, and `required` values. Can be empty.                |
| `options`           | Show the available login methods. Each option has an `id`, `label`, and `field_ids` identifying its inputs. |

If the request offers login methods, let the user choose one and show its
associated fields. Otherwise, show the request's fields directly.

Ask users to enter credentials only for a destination they can verify. If the
  credential origin is missing or unfamiliar and they cannot verify it
  independently, cancel the authentication request.

[Submit the user's input](#return-the-users-input) using the outer action's
`request_id`, or [cancel the authentication request](#let-the-user-cancel) if they
decline. Continue handling requests as they arrive. Submitting a response does
not establish that sign-in succeeded; follow the task through completion and
check its result.

### Example: Choose a method, then enter a code

A site offering email-code and password sign-in might first ask the user to
choose a method, without requesting any fields:

Choose a sign-in method

```json
{
  "type": "computer_use_approval_request",
  "turn_id": "turn_example",
  "request_id": "request_choose_method",
  "request": {
    "type": "browser_authentication",
    "reason": "Choose how to sign in to the issue tracker",
    "credential_origin": "https://issues.example.com",
    "fields": [],
    "options": [
      { "id": "email_code", "label": "Email me a code", "field_ids": [] },
      { "id": "password", "label": "Use a password", "field_ids": [] }
    ]
  }
}
```


If the user chooses email-code sign-in, submit `selected_option: "email_code"`
with `fields: []` using this request's `request_id`. The site may then request an
email address and verification code in separate requests. Render each new request
using its own fields and IDs, and include `selected_option` only when that request
offers options.

### Return the user's input

When the user completes a sign-in request, send their response through the
[session events endpoint](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/events/methods/create).
Set `action` to `submit` and use the request and field IDs from the pending
approval. For example, a response to a request for an email address looks like
this:

```json
{
  "events": [
    {
      "type": "agent.session.input.computer_use_approval_request_result",
      "request_id": "REQUEST_ID",
      "response": {
        "type": "browser_authentication",
        "action": "submit",
        "fields": [{ "field_id": "email", "value": "USER_ENTERED_VALUE" }]
      }
    }
  ]
}
```

If the request offers login methods, include the chosen method's ID in
`response.selected_option`. Submit only the fields listed in that method's
`field_ids`, with a nonempty value for each required field. If the method has no
fields, send `fields: []`.

If no login methods are offered, omit `selected_option` and submit the request's
fields directly. When the request lists fields, include at least one, even if all
are optional.

Send sign-in values only through this dedicated event. Submitted values stay
  outside the agent's model input and are omitted from authentication response
  items in session history.

Treat every value, including email addresses, as sensitive. Mask entered values,
keep them out of logs, analytics, and saved UI state, and clear the form after
submission. Do not send credentials in ordinary messages or function-tool
results.

Omit `turn_id` from the submission event. See
[authentication submission limits](#authentication-submission-limits) for field
and payload constraints.

A `202` response with an empty body confirms that the submission was accepted,
not that sign-in succeeded. Continue following session events for further
requests or resumed work. Disable automatic HTTP or SDK retries for credential
submissions. If you're unsure whether a submission was accepted,
[refresh the session before continuing](#recover-approval-handling).

### Let the user cancel

If the user declines to sign in, respond to the pending request with
`action: "cancel"`. Use its `request_id` and omit `fields` and `selected_option`:

```json
{
  "events": [
    {
      "type": "agent.session.input.computer_use_approval_request_result",
      "request_id": "REQUEST_ID",
      "response": { "type": "browser_authentication", "action": "cancel" }
    }
  ]
}
```

This cancels the authentication request. To stop the task itself, cancel the turn.

### Run an authenticated browser task

Your application handles origin approvals and sign-in requests while following
session events. Define the helper below before running the task. It shows the
destination, collects input with entered values hidden, and submits the response.
If the user declines, it cancels the sign-in request.

Handle browser approvals and sign-in

```bash
# Run in a second terminal when the private task requires input.
# Set session_id to that task's actual session ID first.
curl --silent --show-error --fail-with-body "https://api.openai.com/v1/agents/sessions/$session_id" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  | jq '.required_actions[] | select(.type == "computer_use_approval_request")'

# Save a submission or cancellation payload from the preceding sections
# to browser-auth-response.json using the pending request and field IDs.
# Restrict file access to your user; remove it after submission.
curl --fail-with-body --retry 0 "https://api.openai.com/v1/agents/sessions/$session_id/events" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @browser-auth-response.json
```

```javascript
import promptSync from "prompt-sync";

const prompt = promptSync({ sigint: true });

/** @param {OpenAI} client */
async function respondToComputerUseApproval(client, sessionId, approval) {
  const request = approval.request;
  if (request.type === "browser_origin_access") {
    console.log("Requested origin:", request.origin);
    console.log(request.reason ?? "The browser needs access to this origin.");
    let input;
    do {
      input =
        prompt("Allow access? [approve/deny/cancel, default deny] ")
          .trim()
          .toLowerCase() || "deny";
    } while (!["approve", "deny", "cancel"].includes(input));
    const decision =
      input === "approve" ? "approve" : input === "cancel" ? "cancel" : "deny";
    await client.beta.agents.sessions.events.create(sessionId, {
      events: [
        {
          type: "agent.session.input.computer_use_approval_request_result",
          request_id: approval.request_id,
          response: { type: "browser_origin_access", decision },
        },
      ],
    });
    return;
  }
  if (request.type !== "browser_authentication") {
    throw new Error(`Unsupported approval request: ${request.type}`);
  }
  async function cancelSignIn() {
    await client.beta.agents.sessions.events.create(
      sessionId,
      {
        events: [
          {
            type: "agent.session.input.computer_use_approval_request_result",
            request_id: approval.request_id,
            response: { type: "browser_authentication", action: "cancel" },
          },
        ],
      },
      { maxRetries: 0 }
    );
  }
  console.log(request.reason ?? "Sign in to continue");
  console.log(
    "Credential origin:",
    request.credential_origin ?? "Not supplied"
  );
  const consent = prompt("Have you verified the sign-in destination? [y/N] ")
    .trim()
    .toLowerCase();
  if (!["y", "yes"].includes(consent)) {
    await cancelSignIn();
    return;
  }

  let selectedOption;
  let activeFields = request.fields;
  if (request.options.length > 0) {
    request.options.forEach((option, index) => {
      console.log(`${index + 1}. ${option.label}`);
    });
    let choice;
    do {
      const input = prompt("Choose a sign-in method, or enter cancel: ")
        .trim()
        .toLowerCase();
      if (input === "cancel") {
        await cancelSignIn();
        return;
      }
      choice = Number(input);
    } while (
      !Number.isInteger(choice) ||
      choice < 1 ||
      choice > request.options.length
    );
    selectedOption = request.options[choice - 1];
    activeFields = request.fields.filter((field) =>
      selectedOption.field_ids.includes(field.id)
    );
  }

  const fields = [];
  do {
    for (const field of activeFields) {
      while (true) {
        const value = prompt.hide(
          `${field.label}${field.required ? "" : " (optional)"} (leave blank for options): `
        );
        if (value.length > 0) {
          fields.push({ field_id: field.id, value });
          break;
        }
        let action;
        do {
          action = prompt(
            field.required
              ? "Enter a value or cancel sign-in? [enter/cancel, default enter] "
              : "Skip this field, enter a value, or cancel sign-in? [skip/enter/cancel, default skip] "
          )
            .trim()
            .toLowerCase();
        } while (
          ![
            "",
            "enter",
            "cancel",
            ...(field.required ? [] : ["skip"]),
          ].includes(action)
        );
        if (action === "cancel") {
          await cancelSignIn();
          return;
        }
        if (!field.required && (action === "" || action === "skip")) break;
      }
    }
    if (!selectedOption && activeFields.length > 0 && fields.length === 0) {
      console.log(
        "This form requires at least one field. Enter a value or cancel sign-in."
      );
    }
  } while (!selectedOption && activeFields.length > 0 && fields.length === 0);
  await client.beta.agents.sessions.events.create(
    sessionId,
    {
      events: [
        {
          type: "agent.session.input.computer_use_approval_request_result",
          request_id: approval.request_id,
          response: {
            type: "browser_authentication",
            action: "submit",
            fields,
            ...(selectedOption ? { selected_option: selectedOption.id } : {}),
          },
        },
      ],
    },
    { maxRetries: 0 }
  );
}
```

```python
from getpass import getpass


def read_authentication_response(request):
    cancel = {"type": "browser_authentication", "action": "cancel"}
    print(request.reason or "The agent needs you to sign in.")
    print("Credential origin:", request.credential_origin or "Not supplied")
    consent = input("Have you verified the sign-in destination? [y/N] ")
    if consent.strip().lower() not in {"y", "yes"}:
        return cancel

    selected_option = None
    active_fields = request.fields
    if request.options:
        for index, option in enumerate(request.options, start=1):
            print(f"{index}. {option.label}")
        while True:
            choice = input("Choose a sign-in method, or enter cancel: ").strip().lower()
            if choice == "cancel":
                return cancel
            if choice.isdigit() and 1 <= int(choice) <= len(request.options):
                option = request.options[int(choice) - 1]
                break
            print("Enter a method number from the list, or cancel.")
        selected_option = option.id
        fields_by_id = {field.id: field for field in request.fields}
        active_fields = [fields_by_id[field_id] for field_id in option.field_ids]

    values = []
    while True:
        for field in active_fields:
            while True:
                label = field.label if field.required else f"{field.label} (optional)"
                value = getpass(f"{label} (leave blank for options): ")
                if value:
                    values.append({"field_id": field.id, "value": value})
                    break
                choices = {"", "enter", "cancel"}
                if field.required:
                    question = "Enter a value or cancel sign-in? [enter/cancel, default enter] "
                else:
                    choices.add("skip")
                    question = "Skip this field, enter a value, or cancel sign-in? [skip/enter/cancel, default skip] "
                while True:
                    action = input(question).strip().lower()
                    if action in choices:
                        break
                if action == "cancel":
                    return cancel
                if not field.required and action in {"", "skip"}:
                    break
        if selected_option is not None or not active_fields or values:
            break
        print("This form requires at least one field. Enter a value or cancel sign-in.")

    response = {
        "type": "browser_authentication",
        "action": "submit",
        "fields": values,
    }
    if selected_option is not None:
        response["selected_option"] = selected_option
    return response


def respond_to_computer_use_approval(client, session_id, approval):
    request = approval.request
    approval_client = client
    if request.type == "browser_origin_access":
        print(request.reason or "The browser needs access to an origin.")
        print("Origin:", request.origin)
        while True:
            decision = (
                input("Allow this origin? [approve/deny/cancel; default: deny] ")
                .strip()
                .lower()
                or "deny"
            )
            if decision in {"approve", "deny", "cancel"}:
                break
            print("Enter approve, deny, or cancel.")
        response = {"type": "browser_origin_access", "decision": decision}
    elif request.type == "browser_authentication":
        response = read_authentication_response(request)
        approval_client = client.with_options(max_retries=0)
    else:
        raise RuntimeError(f"Unsupported computer-use approval: {request.type}")

    approval_client.beta.agents.sessions.events.create(
        session_id,
        events=[
            {
                "type": "agent.session.input.computer_use_approval_request_result",
                "request_id": approval.request_id,
                "response": response,
            }
        ],
    )
    # Admission does not establish sign-in or navigation success; keep reading events.
```

```go
import (
	"context"
	"fmt"
	"io"
	"os"
	"strconv"
	"strings"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
	"golang.org/x/term"
)

func respondToComputerUseApproval(ctx context.Context, client *openai.Client, sessionID string, approval openai.AgentSessionRequiredActionComputerUseApprovalRequest) error {
	send := func(response openai.AgentSessionInputParamAgentSessionInputComputerUseApprovalRequestResultResponseUnion) error {
		return client.Beta.Agents.Sessions.Events.New(ctx, sessionID, openai.BetaAgentSessionEventNewParams{
			Events: []openai.AgentSessionInputParamUnion{{
				OfParamAgentSessionInputComputerUseApprovalRequestResult: &openai.AgentSessionInputParamAgentSessionInputComputerUseApprovalRequestResult{
					RequestID: approval.RequestID,
					Response:  response,
				},
			}},
		}, option.WithMaxRetries(0))
	}
	readLine := func(prompt string) (string, error) {
		fmt.Print(prompt)
		var value strings.Builder
		var input [1]byte
		for {
			if _, err := io.ReadFull(os.Stdin, input[:]); err != nil {
				return "", err
			}
			if input[0] == '\n' {
				return strings.TrimSpace(value.String()), nil
			}
			value.WriteByte(input[0])
		}
	}
	cancelAuthentication := func() error {
		return send(openai.AgentSessionInputParamAgentSessionInputComputerUseApprovalRequestResultResponseUnion{
			OfBrowserAuthenticationCancel: &openai.AgentBrowserAuthenticationCancelParam{},
		})
	}
	switch approval.Request.Type {
	case "browser_origin_access":
		request := approval.Request.AsBrowserOriginAccess()
		fmt.Println("Requested origin:", request.Origin)
		if request.Reason != "" {
			fmt.Println(request.Reason)
		}
		response := openai.AgentBrowserOriginAccessParam{Decision: "deny"}
		for {
			choice, err := readLine("Allow this origin? [approve/deny/cancel; default: deny] ")
			if err != nil {
				return err
			}
			switch strings.ToLower(choice) {
			case "approve":
				response.Decision = "approve"
			case "", "deny":
				response.Decision = "deny"
			case "cancel":
				response.Decision = "cancel"
			default:
				fmt.Println("Enter approve, deny, or cancel.")
				continue
			}
			break
		}
		return send(openai.AgentSessionInputParamAgentSessionInputComputerUseApprovalRequestResultResponseUnion{OfBrowserOriginAccess: &response})
	case "browser_authentication":
		// Collect credentials only for an authentication request.
	default:
		return fmt.Errorf("unsupported computer-use approval: %s", approval.Request.Type)
	}
	challenge := approval.Request.AsBrowserAuthentication()
	reason := challenge.Reason
	if reason == "" {
		reason = "The agent needs you to sign in."
	}
	origin := challenge.CredentialOrigin
	if origin == "" {
		origin = "Not supplied"
	}
	fmt.Println(reason)
	fmt.Println("Credential origin:", origin)
	consent, err := readLine("Have you verified the sign-in destination? [y/N] ")
	if err != nil {
		return err
	}
	if strings.ToLower(consent) != "y" && strings.ToLower(consent) != "yes" {
		return cancelAuthentication()
	}

	response := openai.AgentBrowserAuthenticationSubmitParam{
		Action: "submit",
		Fields: []openai.AgentBrowserAuthenticationSubmitParamField{},
	}
	activeFields := challenge.Fields
	if len(challenge.Options) > 0 {
		for index, option := range challenge.Options {
			fmt.Printf("%d. %s\n", index+1, option.Label)
		}
		for {
			choice, err := readLine("Choose a sign-in method [number/cancel]: ")
			if err != nil {
				return err
			}
			if strings.EqualFold(choice, "cancel") {
				return cancelAuthentication()
			}
			index, err := strconv.Atoi(choice)
			if err != nil || index < 1 || index > len(challenge.Options) {
				fmt.Println("Enter a method number from the list, or enter cancel.")
				continue
			}
			option := challenge.Options[index-1]
			response.SelectedOption = openai.String(option.ID)
			activeFields = nil
			for _, fieldID := range option.FieldIDs {
				found := false
				for _, field := range challenge.Fields {
					if field.ID == fieldID {
						activeFields = append(activeFields, field)
						found = true
						break
					}
				}
				if !found {
					return fmt.Errorf("sign-in method references an unknown field: %s", fieldID)
				}
			}
			break
		}
	}

collectFields:
	for {
		response.Fields = response.Fields[:0]
		for _, field := range activeFields {
		fieldInput:
			for {
				choices := "enter/cancel; default: enter"
				if !field.Required {
					choices = "enter/skip/cancel; default: enter"
				}
				choice, err := readLine(fmt.Sprintf("%s [%s]: ", field.Label, choices))
				if err != nil {
					return err
				}
				switch strings.ToLower(choice) {
				case "cancel":
					return cancelAuthentication()
				case "skip":
					if field.Required {
						fmt.Println("This field is required. Enter a value or cancel sign-in.")
						continue
					}
					break fieldInput
				case "", "enter":
					fmt.Printf("%s (hidden): ", field.Label)
					value, err := term.ReadPassword(int(os.Stdin.Fd()))
					fmt.Println()
					if err != nil {
						return err
					}
					if len(value) == 0 {
						fmt.Println("No value entered. Choose an action for this field.")
						continue
					}
					response.Fields = append(response.Fields, openai.AgentBrowserAuthenticationSubmitParamField{
						FieldID: field.ID, Value: string(value),
					})
					clear(value)
					break fieldInput
				default:
					fmt.Println("Choose one of the listed actions.")
				}
			}
		}
		if len(challenge.Options) > 0 || len(challenge.Fields) == 0 || len(response.Fields) > 0 {
			break
		}
		for {
			choice, err := readLine("Enter at least one field or cancel sign-in [retry/cancel; default: cancel]: ")
			if err != nil {
				return err
			}
			switch strings.ToLower(choice) {
			case "retry":
				continue collectFields
			case "", "cancel":
				return cancelAuthentication()
			default:
				fmt.Println("Enter retry or cancel.")
			}
		}
	}
	// Admission does not establish login success; keep following the session.
	return send(openai.AgentSessionInputParamAgentSessionInputComputerUseApprovalRequestResultResponseUnion{
		OfBrowserAuthenticationSubmit: &response,
	})
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.beta.agents.AgentSession;
import com.openai.models.beta.agents.AgentSessionInputMessageParam;
import com.openai.models.beta.agents.AgentSessionInputParam;
import com.openai.models.beta.agents.AgentSessionInputParam.AgentSessionInputComputerUseApprovalRequestResult;
import com.openai.models.beta.agents.AgentSessionInputParam.AgentSessionInputComputerUseApprovalRequestResult.Response;
import com.openai.models.beta.agents.AgentToolParam;
import com.openai.models.beta.agents.EnvironmentParam;
import com.openai.models.beta.agents.sessions.SessionCreateParams;
import com.openai.models.beta.agents.sessions.events.EventCreateParams;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

static void cancelAuthentication(OpenAIClient client, String sessionId, String requestId) {
  var cancellation =
      AgentSessionInputComputerUseApprovalRequestResult.builder()
          .requestId(requestId)
          .response(
              Response.BrowserAuthentication.ofCancel(
                  Response.BrowserAuthentication.Cancel.builder().build()))
          .build();
  client
      .withOptions(options -> options.maxRetries(0))
      .beta()
      .agents()
      .sessions()
      .events()
      .create(EventCreateParams.builder().sessionId(sessionId).addEvent(cancellation).build());
}

static void respondToComputerUseApproval(
    OpenAIClient client,
    String sessionId,
    AgentSession.RequiredAction.ComputerUseApprovalRequest approval) {
  var console = System.console();
  if (console == null)
    throw new IllegalStateException("Run this example in an interactive terminal.");
  var result =
      AgentSessionInputComputerUseApprovalRequestResult.builder().requestId(approval.requestId());
  if (approval.request().browserOriginAccess().isPresent()) {
    var request = approval.request().browserOriginAccess().get();
    console.printf("Origin: %s%n", request.origin());
    console.printf("Reason: %s%n", request.reason().orElse("Not supplied"));
    String decision;
    while (true) {
      String input =
          console.readLine("Allow browser access? [approve/deny/cancel; default deny] ");
      if (input == null) throw new IllegalStateException("Approval input closed.");
      decision = input.strip().toLowerCase(java.util.Locale.ROOT);
      if (decision.isEmpty()) decision = "deny";
      if (List.of("approve", "deny", "cancel").contains(decision)) break;
      console.printf("Enter approve, deny, or cancel.%n");
    }
    result.response(
        Response.BrowserOriginAccess.builder()
            .decision(Response.BrowserOriginAccess.Decision.of(decision))
            .build());
  } else if (approval.request().browserAuthentication().isPresent()) {
    var challenge = approval.request().browserAuthentication().get();
    console.printf("%s%n", challenge.reason().orElse("The agent needs you to sign in."));
    console.printf(
        "Credential origin: %s%n", challenge.credentialOrigin().orElse("Not supplied"));
    String consent = console.readLine("Have you verified the sign-in destination? [y/N] ");
    if (consent == null
        || !List.of("y", "yes").contains(consent.strip().toLowerCase(java.util.Locale.ROOT))) {
      cancelAuthentication(client, sessionId, approval.requestId());
      return;
    }
    var response = Response.BrowserAuthentication.Submit.builder().fields(List.of());
    var activeFields = challenge.fields();
    if (!challenge.options().isEmpty()) {
      for (int i = 0; i < challenge.options().size(); i++) {
        console.printf("%d. %s%n", i + 1, challenge.options().get(i).label());
      }
      while (true) {
        String choice = console.readLine("Choose a sign-in method, or enter cancel: ");
        if (choice == null || choice.strip().equalsIgnoreCase("cancel")) {
          cancelAuthentication(client, sessionId, approval.requestId());
          return;
        }
        int index;
        try {
          index = Integer.parseInt(choice.strip()) - 1;
        } catch (NumberFormatException e) {
          console.printf("Enter a method number from the list, or cancel.%n");
          continue;
        }
        if (index < 0 || index >= challenge.options().size()) {
          console.printf("Enter a method number from the list, or cancel.%n");
          continue;
        }
        var option = challenge.options().get(index);
        response.selectedOption(option.id());
        activeFields =
            challenge.fields().stream()
                .filter(field -> option.fieldIds().contains(field.id()))
                .toList();
        break;
      }
    }
    while (true) {
      int fieldsSubmitted = 0;
      for (var field : activeFields) {
        while (true) {
          String choice =
              console.readLine(
                  field.required()
                      ? "%s [enter/cancel; default enter]: "
                      : "%s [enter/skip/cancel; default skip]: ",
                  field.label());
          if (choice == null || choice.strip().equalsIgnoreCase("cancel")) {
            cancelAuthentication(client, sessionId, approval.requestId());
            return;
          }
          choice = choice.strip().toLowerCase(java.util.Locale.ROOT);
          if (choice.isEmpty()) choice = field.required() ? "enter" : "skip";
          if (choice.equals("skip") && !field.required()) break;
          if (!choice.equals("enter")) {
            console.printf("Choose one of the displayed options.%n");
            continue;
          }
          char[] characters = console.readPassword("%s: ", field.label());
          if (characters == null) {
            cancelAuthentication(client, sessionId, approval.requestId());
            return;
          }
          String value = new String(characters);
          Arrays.fill(characters, '\0');
          if (value.isEmpty()) {
            if (!field.required()) break;
            console.printf("This field is required.%n");
            continue;
          }
          response.addField(
              Response.BrowserAuthentication.Submit.Field.builder()
                  .fieldId(field.id())
                  .value(value)
                  .build());
          fieldsSubmitted++;
          break;
        }
      }
      if (!challenge.options().isEmpty() || activeFields.isEmpty() || fieldsSubmitted > 0) break;
      console.printf("Enter at least one field to submit this form, or cancel.%n");
    }
    result.response(Response.BrowserAuthentication.ofSubmit(response.build()));
  } else {
    throw new IllegalStateException("Unsupported computer-use approval request.");
  }
  // An uncertain approval must not resend credentials automatically.
  client
      .withOptions(options -> options.maxRetries(0))
      .beta()
      .agents()
      .sessions()
      .events()
      .create(EventCreateParams.builder().sessionId(sessionId).addEvent(result.build()).build());
  // Admission does not establish sign-in or navigation success; keep following the session.
}
```

```csharp
using System.ClientModel;
using System.ClientModel.Primitives;
using System.Globalization;
using System.Text;
using System.Text.Json;
using OpenAI;
using OpenAI.Agents;
#pragma warning disable OPENAI001

static string ReadLine(string prompt)
{
    Console.Write(prompt);
    return Console.ReadLine() ?? "cancel";
}

static string ReadHidden(string prompt)
{
    if (Console.IsInputRedirected)
    {
        throw new InvalidOperationException("Run this sign-in example in a terminal.");
    }
    Console.Write(prompt);
    StringBuilder value = new();
    while (true)
    {
        ConsoleKeyInfo key = Console.ReadKey(intercept: true);
        if (key.Key == ConsoleKey.Enter)
        {
            Console.WriteLine();
            return value.ToString();
        }
        if (key.Key == ConsoleKey.Backspace)
        {
            if (value.Length > 0)
            {
                value.Length--;
            }
        }
        else if (!char.IsControl(key.KeyChar))
        {
            value.Append(key.KeyChar);
        }
    }
}

static async Task RespondToComputerUseApprovalAsync(
    AgentClient client, string sessionId,
    SessionRequiredActionResourceComputerUseApprovalRequest approval)
{
    if (Console.IsInputRedirected)
    {
        throw new InvalidOperationException("Run this example in an interactive terminal.");
    }
    ComputerUseApprovalResponseParam response;
    if (approval.Request is ComputerUseApprovalRequestKindResourceBrowserOriginAccess origin)
    {
        Console.WriteLine($"Origin: {origin.Origin}");
        Console.WriteLine($"Reason: {origin.Reason ?? "Not supplied"}");
        string choice;
        while (true)
        {
            Console.Write("Allow browser access? [approve/deny/cancel; default deny] ");
            choice = (Console.ReadLine() ?? throw new EndOfStreamException("Approval input closed.")).Trim().ToLowerInvariant();
            if (choice.Length == 0) choice = "deny";
            if (choice is "approve" or "deny" or "cancel") break;
            Console.WriteLine("Enter approve, deny, or cancel.");
        }
        BrowserOriginAccessDecisionParam decision = choice switch
        {
            "approve" => BrowserOriginAccessDecisionParam.Approve,
            "cancel" => BrowserOriginAccessDecisionParam.Cancel,
            _ => BrowserOriginAccessDecisionParam.Deny,
        };
        response = new ComputerUseApprovalResponseParamBrowserOriginAccess(decision);
    }
    else if (approval.Request is ComputerUseApprovalRequestKindResourceBrowserAuthentication challenge)
    {
        async Task CancelAuthenticationAsync()
        {
            await client.CreateAgentSessionEventsAsync(
                sessionId,
                new CreateSessionEventsParams(
                    [new SessionInputParamAgentSessionInputComputerUseApprovalRequestResult(
                        approval.RequestId, new ComputerUseApprovalResponseParamBrowserAuthenticationCancel())]
                )
            );
        }

        Console.WriteLine(challenge.Reason ?? "The agent needs you to sign in.");
        Console.WriteLine($"Credential origin: {challenge.CredentialOrigin ?? "Not supplied"}");
        string consent = ReadLine("Have you verified the sign-in destination? [y/N] ").Trim();
        if (!consent.Equals("y", StringComparison.OrdinalIgnoreCase)
            && !consent.Equals("yes", StringComparison.OrdinalIgnoreCase))
        {
            await CancelAuthenticationAsync();
            return;
        }

        ComputerUseApprovalResponseParamBrowserAuthenticationSubmit submission = new([]);
        var activeFields = challenge.Fields.ToList();
        if (challenge.Options.Count > 0)
        {
            for (int index = 0; index < challenge.Options.Count; index++)
            {
                Console.WriteLine($"{index + 1}. {challenge.Options[index].Label}");
            }
            while (true)
            {
                string choice = ReadLine("Choose a sign-in method, or enter cancel: ").Trim();
                if (choice.Equals("cancel", StringComparison.OrdinalIgnoreCase))
                {
                    await CancelAuthenticationAsync();
                    return;
                }
                if (!int.TryParse(choice, NumberStyles.None, CultureInfo.InvariantCulture, out int index)
                    || index < 1 || index > challenge.Options.Count)
                {
                    Console.WriteLine("Enter a method number from the list, or cancel.");
                    continue;
                }
                var option = challenge.Options[index - 1];
                submission.SelectedOption = option.Id;
                var fieldsById = challenge.Fields.ToDictionary(field => field.Id, StringComparer.Ordinal);
                activeFields = option.FieldIds.Select(id => fieldsById[id]).ToList();
                break;
            }
        }
        while (true)
        {
            foreach (var field in activeFields)
            {
                while (true)
                {
                    string choices = field.Required
                        ? "enter/cancel; default enter" : "enter/skip/cancel; default skip";
                    string choice = ReadLine($"{field.Label} [{choices}]: ").Trim().ToLowerInvariant();
                    if (choice == "cancel")
                    {
                        await CancelAuthenticationAsync();
                        return;
                    }
                    if (choice.Length == 0) choice = field.Required ? "enter" : "skip";
                    if (choice == "skip" && !field.Required) break;
                    if (choice != "enter")
                    {
                        Console.WriteLine("Choose one of the displayed options.");
                        continue;
                    }
                    string value = ReadHidden($"{field.Label}: ");
                    if (value.Length == 0)
                    {
                        if (!field.Required) break;
                        Console.WriteLine("This field is required.");
                        continue;
                    }
                    submission.Fields.Add(new BrowserAuthenticationFieldValueParam(field.Id, value));
                    break;
                }
            }
            if (challenge.Options.Count > 0 || activeFields.Count == 0 || submission.Fields.Count > 0) break;
            Console.WriteLine("Enter at least one field to submit this form, or cancel.");
        }
        response = submission;
    }
    else
    {
        throw new InvalidOperationException("Unsupported computer-use approval request.");
    }
    await client.CreateAgentSessionEventsAsync(
        sessionId,
        new CreateSessionEventsParams(
            [new SessionInputParamAgentSessionInputComputerUseApprovalRequestResult(approval.RequestId, response)]
        )
    );
    // Admission does not establish sign-in or navigation success; keep following the session.
}
```

```ruby
require "io/console"

def computer_use_sign_in_choice(prompt)
  print prompt
  input = $stdin.gets || raise(EOFError, "Input closed before a sign-in choice.")
  input.strip.downcase
end

def computer_use_authentication_response(request)
  cancel = {
    type: "browser_authentication",
    action: "cancel"
  }
  puts request.reason || "The agent needs you to sign in."
  puts "Credential origin: #{request.credential_origin || "Not supplied"}"
  consent = computer_use_sign_in_choice("Have you verified the sign-in destination? [y/N] ")
  return cancel unless ["y", "yes"].include?(consent)

  selected_option = nil
  active_fields = request.fields
  unless request.options.empty?
    request.options.each_with_index do |option, index|
      puts "#{index + 1}. #{option.label}"
    end
    option = loop do
      choice = computer_use_sign_in_choice("Choose a sign-in method [number/cancel]: ")
      return cancel if choice == "cancel"
      if choice.match?(/\A\d+\z/) && choice.to_i.between?(1, request.options.length)
        break request.options[choice.to_i - 1]
      end

      puts "Enter a method number from the list, or enter cancel."
    end
    selected_option = option.id
    fields_by_id = request.fields.to_h { |field| [field.id, field] }
    active_fields = option.field_ids.map { |field_id| fields_by_id.fetch(field_id) }
  end

  values = []
  loop do
    values.clear
    active_fields.each do |field|
      loop do
        choices = field.required ? "enter/cancel; default: enter" : "enter/skip/cancel; default: enter"
        choice = computer_use_sign_in_choice("#{field.label} [#{choices}]: ")
        case choice
        when "cancel"
          return cancel
        when "skip"
          break unless field.required

          puts "This field is required. Enter a value or cancel sign-in."
        when "", "enter"
          value = $stdin.getpass("#{field.label} (hidden): ")
          if value.empty?
            puts "No value entered. Choose an action for this field."
            next
          end
          values << {
            field_id: field.id,
            value: value
          }
          break
        else
          puts "Choose one of the listed actions."
        end
      end
    end
    break unless request.options.empty? && !request.fields.empty? && values.empty?

    loop do
      choice = computer_use_sign_in_choice("Enter at least one field or cancel sign-in [retry/cancel; default: cancel]: ")
      return cancel if ["", "cancel"].include?(choice)
      break if choice == "retry"

      puts "Enter retry or cancel."
    end
  end

  response = {
    type: "browser_authentication",
    action: "submit",
    fields: values
  }
  response[:selected_option] = selected_option unless selected_option.nil?
  response
end

def respond_to_computer_use_approval(client, session_id, approval)
  request = approval.request
  case request.type.to_s
  when "browser_origin_access"
    puts request.reason || "The browser needs access to an origin."
    puts "Origin: #{request.origin}"
    decision = loop do
      print "Allow this origin? [approve/deny/cancel; default: deny] "
      input = $stdin.gets || raise(EOFError, "Input closed before an origin decision.")
      choice = input.strip.downcase
      choice = "deny" if choice.empty?
      break choice if ["approve", "deny", "cancel"].include?(choice)

      puts "Enter approve, deny, or cancel."
    end
    response = {
      type: "browser_origin_access",
      decision: decision
    }
  when "browser_authentication"
    response = computer_use_authentication_response(request)
  else
    raise "Unsupported computer-use approval: #{request.type}"
  end
  client.beta.agents.sessions.events.create(
    session_id,
    events: [
      {
        type: "agent.session.input.computer_use_approval_request_result",
        request_id: approval.request_id,
        response: response
      }
    ],
    request_options: { max_retries: 0 }
  )
  # Admission does not establish sign-in or navigation success; keep reading events.
end
```


The following example asks the agent to read issues from a private GitHub
repository. Replace `https://github.com/acme/private-repo/issues` with an issue
page you can access.

Open the event stream before sending the task, and call the helper whenever the
session requires input.

Read private repository issues

```bash
# Terminal 1: create a new session and stream its first task.
# Replace the illustrative repository URL with one you can access.
curl --no-buffer --fail-with-body https://api.openai.com/v1/agents/sessions \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "agent": {
      "model": "gpt-6-astra",
      "instructions": "Read the requested GitHub issue list in the browser. Request sign-in when needed. Do not create, edit, comment on, or close issues.",
      "tools": [{ "type": "computer_use", "include_screenshots": false }]
    },
    "environment": {
      "type": "openai_hosted",
      "desktop": { "enabled": true },
      "network": { "access": "enabled" }
    },
    "input": "Open https://github.com/acme/private-repo/issues in the browser. Sign in if needed, then report the title and URL of the most recently updated open issue. Do not make changes.",
    "stream": true
  }'

# Copy session.id from agent.session.created into terminal 2.
# Keep this stream open while responding to origin and sign-in approvals there.
```

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const session = await client.beta.agents.sessions.create({
  agent: {
    model: "gpt-6-astra",
    instructions:
      "Read the requested GitHub issue list in the browser. Request sign-in when needed. Do not create, edit, comment on, or close issues.",
    tools: [{ type: "computer_use", include_screenshots: false }],
  },
  environment: {
    type: "openai_hosted",
    desktop: { enabled: true },
    network: { access: "enabled" },
  },
});
console.log("Session ID:", session.id);

let completed = false;
let readyToDelete = false;
try {
  const events = await client.beta.agents.sessions.events.stream(session.id);
  const handledRequests = new Set();
  try {
    await client.beta.agents.sessions.events.create(session.id, {
      events: [
        {
          type: "agent.session.input.message",
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  // Replace this illustrative URL with your private repository.
                  text: "Open https://github.com/acme/private-repo/issues in the browser. Sign in if needed, then report the title and URL of the most recently updated open issue. Do not make changes.",
                },
              ],
            },
          ],
        },
      ],
    });
    for await (const event of events) {
      switch (event.type) {
        case "agent.session.requires_action": {
          const current = await client.beta.agents.sessions.retrieve(
            session.id
          );
          for (const approval of current.required_actions) {
            if (
              approval.type === "computer_use_approval_request" &&
              !handledRequests.has(approval.request_id)
            ) {
              await respondToComputerUseApproval(client, session.id, approval);
              handledRequests.add(approval.request_id);
            }
          }
          break;
        }
        case "agent.session.turn.output_text.done":
          console.log(event.text);
          break;
        case "error":
          throw new Error(event.error.message);
        case "agent.session.failed":
        case "agent.session.environment.failed":
          throw new Error(`Agent lifecycle failure: ${event.type}`);
        case "agent.session.turn.failed":
          if (event.turn.subagent_id === null) {
            throw new Error(event.turn.error?.message ?? "Browser task failed");
          }
          break;
        case "agent.session.turn.cancelled":
          if (event.turn.subagent_id === null) {
            throw new Error("Browser task was cancelled");
          }
          break;
        case "agent.session.turn.completed":
          if (event.turn.subagent_id === null) completed = true;
          break;
      }
      if (completed) break;
    }
    if (!completed) {
      throw new Error("Stream closed before the browser task finished");
    }
    console.log();
  } finally {
    events.controller.abort();
  }
  readyToDelete = completed;
} catch (error) {
  console.error(
    `Session ${session.id} was kept. Use the same ID to check its status before trying again.`
  );
  throw error;
} finally {
  if (readyToDelete) await client.beta.agents.sessions.delete(session.id);
}
```

```python
from openai import OpenAI

client = OpenAI()
session = client.beta.agents.sessions.create(
    agent={
        "model": "gpt-6-astra",
        "instructions": "Read the requested GitHub issue list in the browser. Request sign-in when needed. Do not create, edit, comment on, or close issues.",
        "tools": [{"type": "computer_use", "include_screenshots": False}],
    },
    environment={
        "type": "openai_hosted",
        "desktop": {"enabled": True},
        "network": {"access": "enabled"},
    },
)
print("Session ID:", session.id, flush=True)
handled_requests = set()
completed = False
ready_to_delete = False

try:
    with client.beta.agents.sessions.events.stream(session.id) as events:
        client.beta.agents.sessions.events.create(
            session.id,
            events=[
                {
                    "type": "agent.session.input.message",
                    "input": [
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "input_text",
                                    # Replace this illustrative URL with your private repository.
                                    "text": "Open https://github.com/acme/private-repo/issues in the browser. Sign in if needed, then report the title and URL of the most recently updated open issue. Do not make changes.",
                                }
                            ],
                        }
                    ],
                }
            ],
        )
        for event in events:
            if event.type == "agent.session.requires_action":
                current = client.beta.agents.sessions.retrieve(session.id)
                for approval in current.required_actions:
                    if (
                        approval.type == "computer_use_approval_request"
                        and approval.request_id not in handled_requests
                    ):
                        respond_to_computer_use_approval(client, session.id, approval)
                        handled_requests.add(approval.request_id)
            elif event.type == "agent.session.turn.output_text.done":
                print(event.text, flush=True)
            elif event.type == "agent.session.turn.completed":
                if event.turn.subagent_id is None:
                    completed = True
                    print()
                    break
            elif event.type in {
                "agent.session.turn.failed",
                "agent.session.turn.cancelled",
            }:
                if event.turn.subagent_id is None:
                    raise RuntimeError(f"Browser task ended: {event.type}")
            elif event.type == "error":
                raise RuntimeError(event.error.message)
            elif event.type in {
                "agent.session.failed",
                "agent.session.environment.failed",
            }:
                raise RuntimeError(f"Session failed: {event.type}")
        else:
            raise RuntimeError("Stream closed before the browser task finished.")
    ready_to_delete = completed
except (Exception, KeyboardInterrupt):
    print(
        f"Session {session.id} was kept. Use the same ID to check its status before trying again.",
        flush=True,
    )
    raise
finally:
    if ready_to_delete:
        client.beta.agents.sessions.delete(session.id)
    client.close()
```

```go
ctx := context.Background()
client := openai.NewClient()
session, err := client.Beta.Agents.Sessions.New(ctx, openai.BetaAgentSessionNewParams{
	Agent: openai.BetaAgentSessionNewParamsAgent{
		Model:        openai.String("gpt-6-astra"),
		Instructions: openai.String("Read the requested GitHub issue list in the browser. Request sign-in when needed. Do not create, edit, comment on, or close issues."),
		Tools: []openai.AgentToolParamUnion{{
			OfParamComputerUse: &openai.AgentToolParamComputerUse{IncludeScreenshots: openai.Bool(false)},
		}},
	},
	Environment: openai.EnvironmentParamUnion{OfParamOpenAIHosted: &openai.EnvironmentParamOpenAIHosted{
		Desktop: openai.EnvironmentParamOpenAIHostedDesktop{Enabled: true},
		Network: openai.EnvironmentParamOpenAIHostedNetwork{Access: "enabled"},
	}},
})
if err != nil {
	return err
}
fmt.Println("Session ID:", session.ID)
completed := false
defer func() {
	if !completed {
		fmt.Fprintf(os.Stderr, "Session %s was not deleted. Retrieve it and check required_actions before attempting recovery.\n", session.ID)
		return
	}
	if _, err := client.Beta.Agents.Sessions.Delete(ctx, session.ID); err != nil {
		fmt.Fprintf(os.Stderr, "Could not delete completed session %s: %v\n", session.ID, err)
	}
}()
handledRequests := map[string]bool{}
events := client.Beta.Agents.Sessions.Events.StreamStreaming(ctx, session.ID)
defer events.Close()
if err := events.Err(); err != nil {
	return err
}
err = client.Beta.Agents.Sessions.Events.New(ctx, session.ID, openai.BetaAgentSessionEventNewParams{
	Events: []openai.AgentSessionInputParamUnion{{
		OfParamAgentSessionInputMessage: &openai.AgentSessionInputParamAgentSessionInputMessage{
			Input: []openai.AgentSessionInputMessageParam{{
				Role: "user",
				Content: []openai.InputContentParamUnion{{
					OfParamInputText: &openai.InputContentParamInputText{
						// Replace this illustrative URL with your private repository.
						Text: "Open https://github.com/acme/private-repo/issues in the browser. Sign in if needed, then report the title and URL of the most recently updated open issue. Do not make changes.",
					},
				}},
			}},
		},
	}},
})
if err != nil {
	return err
}
for events.Next() {
	event := events.Current()
	switch event.Type {
	case "agent.session.requires_action":
		current, err := client.Beta.Agents.Sessions.Get(ctx, session.ID)
		if err != nil {
			return err
		}
		for _, action := range current.RequiredActions {
			if action.Type != "computer_use_approval_request" {
				continue
			}
			approval := action.AsComputerUseApprovalRequest()
			if handledRequests[approval.RequestID] {
				continue
			}
			if err := respondToComputerUseApproval(ctx, &client, session.ID, approval); err != nil {
				return err
			}
			handledRequests[approval.RequestID] = true
		}
	case "agent.session.turn.output_text.done":
		fmt.Println(event.Text)
	case "agent.session.turn.completed":
		if event.Turn.SubagentID == "" {
			completed = true
			return nil
		}
	case "agent.session.turn.failed", "agent.session.turn.cancelled":
		if event.Turn.SubagentID == "" {
			return fmt.Errorf("browser task ended: %s", event.Type)
		}
	case "error":
		return fmt.Errorf("agent error: %s", event.Error.Message)
	case "agent.session.failed", "agent.session.environment.failed":
		return fmt.Errorf("session failed: %s", event.Type)
	}
}
if err := events.Err(); err != nil {
	return err
}
return fmt.Errorf("stream closed before the browser task finished")
```

```java
var client = OpenAIOkHttpClient.fromEnv();
var session =
    client
        .beta()
        .agents()
        .sessions()
        .create(
            SessionCreateParams.builder()
                .agent(
                    SessionCreateParams.Agent.builder()
                        .model("gpt-6-astra")
                        .instructions(
                            "Read the requested GitHub issue list in the browser. Request"
                                + " sign-in when needed. Do not create, edit, comment on, or"
                                + " close issues.")
                        .addTool(
                            AgentToolParam.ComputerUse.builder()
                                .includeScreenshots(false)
                                .build())
                        .build())
                .environment(
                    EnvironmentParam.OpenAIHosted.builder()
                        .desktop(
                            EnvironmentParam.OpenAIHosted.Desktop.builder()
                                .enabled(true)
                                .build())
                        .network(
                            EnvironmentParam.OpenAIHosted.Network.builder()
                                .access(EnvironmentParam.OpenAIHosted.Network.Access.ENABLED)
                                .build())
                        .build())
                .build());
System.out.println("Session ID: " + session.id());
var handledRequests = new HashSet<String>();
try {
  try (var events = client.beta().agents().sessions().events().streamStreaming(session.id())) {
    client
        .beta()
        .agents()
        .sessions()
        .events()
        .create(
            EventCreateParams.builder()
                .sessionId(session.id())
                .addEvent(
                    AgentSessionInputParam.AgentSessionInputMessage.builder()
                        .addInput(
                            AgentSessionInputMessageParam.builder()
                                // Replace this illustrative URL with your private repository.
                                .addInputTextContent(
                                    "Open https://github.com/acme/private-repo/issues in the"
                                        + " browser. Sign in if needed, then report the title"
                                        + " and URL of the most recently updated open issue. Do"
                                        + " not make changes.")
                                .build())
                        .build())
                .build());
    boolean completed = false;
    var iterator = events.stream().iterator();
    while (iterator.hasNext()) {
      var event = iterator.next();
      if (event.requiresAction().isPresent()) {
        var current = client.beta().agents().sessions().retrieve(session.id());
        for (var action : current.requiredActions()) {
          if (action.computerUseApprovalRequest().isEmpty()) continue;
          var approval = action.computerUseApprovalRequest().get();
          if (!handledRequests.contains(approval.requestId())) {
            respondToComputerUseApproval(client, session.id(), approval);
            handledRequests.add(approval.requestId());
          }
        }
      }
      event.turnOutputTextDone().ifPresent(text -> System.out.println(text.text()));
      if (event.turnCompleted().filter(e -> e.turn().subagentId().isEmpty()).isPresent()) {
        completed = true;
        break;
      }
      if (event.turnFailed().filter(e -> e.turn().subagentId().isEmpty()).isPresent()
          || event.turnCancelled().filter(e -> e.turn().subagentId().isEmpty()).isPresent()) {
        throw new IllegalStateException("Browser task failed or was cancelled.");
      }
      if (event.error().isPresent()) {
        throw new IllegalStateException(event.error().get().error().message());
      }
      if (event.failed().isPresent() || event.environmentFailed().isPresent()) {
        throw new IllegalStateException("The browser session failed.");
      }
    }
    if (!completed) {
      throw new IllegalStateException("Stream closed before the browser task finished.");
    }
  } catch (Exception error) {
    System.err.printf(
        "Session %s was kept. Retrieve it and check pending actions before sending anything"
            + " again.%n",
        session.id());
    throw error;
  }
  client.beta().agents().sessions().delete(session.id());
} finally {
  client.close();
}
```

```csharp
string key = Environment.GetEnvironmentVariable("OPENAI_API_KEY")!;
// An uncertain approval must not resend credentials automatically.
OpenAIClientOptions options = new() { RetryPolicy = new ClientRetryPolicy(maxRetries: 0) };
AgentClient client = new OpenAIClient(new ApiKeyCredential(key), options).GetAgentClient();
AgentSession session = await client.CreateAgentSessionAsync(
    new AgentSessionCreationOptions
    {
        Agent = new SessionAgentConfigParam
        {
            Model = "gpt-6-astra",
            Instructions = "Read the requested GitHub issue list in the browser. Request sign-in when needed. Do not create, edit, comment on, or close issues.",
            Tools = [new AgentToolConfigParamComputerUse { IncludeScreenshots = false }],
        },
        Environment = new EnvironmentParamOpenaiHosted
        {
            Desktop = new DesktopParam(true),
            Network = new NetworkPolicyParam(NetworkAccessParam.Enabled),
        },
    }
);
Console.WriteLine($"Session ID: {session.Id}");
HashSet<string> handledRequests = new(StringComparer.Ordinal);
try
{
    await using var events = await client.GetAgentSessionEventsAsync(session.Id);
    await client.CreateAgentSessionEventsAsync(
        session.Id,
        new CreateSessionEventsParams(
            [
                new SessionInputParamAgentSessionInputMessage(
                    [
                        new InputMessageParam(
                            // Replace this illustrative URL with your private repository.
                            [new InputContentParamInputText("Open https://github.com/acme/private-repo/issues in the browser. Sign in if needed, then report the title and URL of the most recently updated open issue. Do not make changes.")]
                        ),
                    ]
                ),
            ]
        )
    );
    bool completed = false;
    await foreach (var message in events)
    {
        using JsonDocument document = JsonDocument.Parse(message.Data.ToMemory());
        JsonElement current = document.RootElement;
        string? type = current.GetProperty("type").GetString();
        if (type == "agent.session.requires_action")
        {
            AgentSession latest = await client.RetrieveAgentSessionAsync(session.Id);
            foreach (SessionRequiredActionResource action in latest.RequiredActions)
            {
                if (action is SessionRequiredActionResourceComputerUseApprovalRequest approval
                    && !handledRequests.Contains(approval.RequestId))
                {
                    await RespondToComputerUseApprovalAsync(client, session.Id, approval);
                    handledRequests.Add(approval.RequestId);
                }
            }
        }
        else if (type == "agent.session.turn.output_text.done")
        {
            Console.WriteLine(current.GetProperty("text").GetString());
        }
        else if (type is "agent.session.turn.completed" or "agent.session.turn.failed" or "agent.session.turn.cancelled")
        {
            JsonElement turn = current.GetProperty("turn");
            if (turn.TryGetProperty("subagent_id", out JsonElement subagent)
                && subagent.ValueKind != JsonValueKind.Null)
            {
                continue;
            }
            if (type != "agent.session.turn.completed")
            {
                throw new InvalidOperationException($"Browser task ended: {type}");
            }
            completed = true;
            break;
        }
        else if (type == "error")
        {
            throw new InvalidOperationException(current.GetProperty("error").GetProperty("message").GetString());
        }
        else if (type is "agent.session.failed" or "agent.session.environment.failed")
        {
            throw new InvalidOperationException($"Session failed: {type}");
        }
    }
    if (!completed)
    {
        throw new InvalidOperationException("Stream closed before the browser task finished.");
    }
}
catch
{
    Console.Error.WriteLine($"Session {session.Id} was kept. Retrieve it and check pending actions before sending anything again.");
    throw;
}
await client.DeleteAgentSessionAsync(session.Id);
```

```ruby
require "openai"

client = OpenAI::Client.new
session = client.beta.agents.sessions.create(
  agent: {
    model: "gpt-6-astra",
    instructions: "Read the requested GitHub issue list in the browser. Request sign-in when needed. Do not create, edit, comment on, or close issues.",
    tools: [
      {
        type: "computer_use",
        include_screenshots: false
      }
    ]
  },
  environment: {
    type: "openai_hosted",
    desktop: { enabled: true },
    network: { access: "enabled" }
  }
)
puts "Session ID: #{session.id}"
handled_requests = Set.new

begin
  events = client.beta.agents.sessions.events.stream_streaming(session.id)
  begin
    client.beta.agents.sessions.events.create(
      session.id,
      events: [
        {
          type: "agent.session.input.message",
          input: [
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  # Replace this illustrative URL with your private repository.
                  text: "Open https://github.com/acme/private-repo/issues in the browser. Sign in if needed, then report the title and URL of the most recently updated open issue. Do not make changes."
                }
              ]
            }
          ]
        }
      ]
    )
    completed = events.any? do |event|
      case event
      when OpenAI::Beta::AgentSessionRequiresActionEvent
        current = client.beta.agents.sessions.retrieve(session.id)
        current.required_actions.each do |approval|
          next unless approval.is_a?(OpenAI::Beta::AgentSession::RequiredAction::ComputerUseApprovalRequest)
          next if handled_requests.include?(approval.request_id)

          respond_to_computer_use_approval(client, session.id, approval)
          handled_requests.add(approval.request_id)
        end
        false
      when OpenAI::Beta::AgentSessionTurnOutputTextDoneEvent
        puts event.text
      when OpenAI::Beta::AgentSessionTurnCompletedEvent
        event.turn.subagent_id.nil?
      when OpenAI::Beta::AgentSessionTurnFailedEvent, OpenAI::Beta::AgentSessionTurnCancelledEvent
        raise "Browser task ended: #{event.type}" if event.turn.subagent_id.nil?
      when OpenAI::Beta::AgentSessionErrorEvent
        raise event.error.message
      when OpenAI::Beta::AgentSessionFailedEvent, OpenAI::Beta::AgentSessionEnvironmentFailedEvent
        raise "Session failed: #{event.type}"
      else
        false
      end
    end
    raise "Stream closed before the browser task finished." unless completed
  ensure
    events.close
  end
rescue StandardError, Interrupt
  warn "Session #{session.id} was not deleted. Retrieve it and check required_actions before attempting recovery."
  raise
else
  begin
    client.beta.agents.sessions.delete(session.id)
  rescue => error
    warn "Could not delete completed session #{session.id}: #{error.message}"
    raise
  end
end
```


Sign-in may require several requests, so keep handling approvals until the task
finishes. Check the agent's result against the requested task—for this example,
verify the reported issue title and URL.

### Read sign-in history

Authentication requests and accepted responses appear in session history and in
`agent.session.turn.item.added` events. Request items contain the sign-in form
metadata; response items record the accepted action without submitted credential
values.

Use this history to review past interactions. To determine whether a sign-in form
still needs input, retrieve the session's current `required_actions`. A recorded
response does not establish that sign-in succeeded.

Origin approvals have no dedicated request or response history items. Handle
them through `required_actions`.

## Ask the user a question

To ask for clarification or let the user make a choice during a task, define a
[function tool](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) in `agent.tools`.
For example, you could define `request_user_response` to present a question and
collect an answer. Your application supplies the tool's name, argument schema,
and UI.

When you receive `agent.session.requires_action`, find the pending
`function_call` for your tool and use its `arguments` to display the question.
Return the answer through `agent.session.input.tool_result`, using the action's
`turn_id` and `call_id`. Set `success: true` and put the answer in `output`,
serializing structured answers as a JSON string. If the user declines, return
`success: false` with an `error` message.

Continue following session events after returning the answer. The browser
approval helpers shown earlier handle origin access and sign-in; extend your
event handler to handle your question tool as well.

Function-tool results are visible to the model and saved in session history.
  Collect passwords and verification codes through [browser
  authentication](#handle-sign-in).

## Recover approval handling

If your application disconnects or an approval response fails, retrieve the same
session and inspect its current `required_actions` before continuing. Rebuild
forms only for requests that are still pending, and remove controls for requests
that are no longer present.

For a disconnected event stream, follow
[stream recovery](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#how-to-recover-a-disconnected-stream)
to resume receiving events. Reconnecting must not automatically resend the task
or an approval response.

Use the response status to decide what to do next:

| Result                                 | What your application should do                                                                                                                                 |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `202`                                  | Clear submitted values and follow session events for the outcome.                                                                                               |
| `400`                                  | Check the response type, selected option, field IDs, and required values against the pending request. Omit fields for cancellation and origin-access responses. |
| `404`                                  | Check the session ID, request ID, and response type. Retrieve the session again; the request may no longer be available.                                        |
| `409`                                  | Refresh the session. The request may have expired, its turn may have ended, or a different response may already have been accepted.                             |
| Connection lost before acknowledgement | Treat acceptance as unknown. Reconnect and retrieve the session before deciding whether to retry.                                                               |

Authentication requests expire after five minutes, and their owning turn can end
while the user is entering input. Refresh the session before restoring a sign-in
form.

If you retry an authentication submission, use the same `request_id`, selected
option, and field-value mapping. An identical retry does not fill the browser form
again. Changing values after a submission has been accepted returns `409`; a new
sign-in attempt requires a new request from the agent.

For origin approvals, retry the same decision if delivery fails. Changing an
accepted decision returns `409`. Origin requests remain pending for their owning
turn and do not have the five-minute authentication timeout.

## Control network access

Use the hosted environment's `network` configuration to control outbound access
for both the browser and code running in the environment. Allow the destination
website and any domains needed for page resources or redirects.

Origin approval is a separate user decision and does not override the network
policy. See
[network access settings](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted#control-network-access)
to configure the environment.

## Continue and clean up

Reuse the same session for follow-up tasks that need its browser state. Login
cookies can expire, and recycling the environment clears the browser state.

When you're finished, retrieve any results you need and
[delete the session](https://developers.openai.com/api/docs/guides/agents-api/quickstart#4-clean-up) to request
environment cleanup:

Delete the browser session

```bash
# Run after the root turn completes, fails, or is cancelled.
curl --fail-with-body -X DELETE "https://api.openai.com/v1/agents/sessions/$session_id" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

```javascript
await client.beta.agents.sessions.delete(session.id);
```

```python
if ready_to_delete:
    client.beta.agents.sessions.delete(session.id)
```

```go
readyToDelete := false
defer func() {
	if !readyToDelete {
		fmt.Fprintf(os.Stderr, "Session %s was not deleted. Retrieve it and check required_actions before attempting recovery.\n", session.ID)
		return
	}
	if _, err := client.Beta.Agents.Sessions.Delete(ctx, session.ID); err != nil {
		fmt.Fprintf(os.Stderr, "Could not delete completed session %s: %v\n", session.ID, err)
	}
}()
```

```java
client.beta().agents().sessions().delete(session.id());
```

```csharp
await client.DeleteAgentSessionAsync(session.Id);
```

```ruby
begin
  client.beta.agents.sessions.delete(session.id) if completed
rescue => error
  warn "Could not delete completed session #{session.id}: #{error.message}"
  raise
end
```


See [OpenAI-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted)
for environment lifetime and deletion behavior.

## Request handling reference

### Authentication submission limits

Each submission can include up to six field values, with each field included
once. Values can contain up to 16,384 characters each; the serialized field
values and selected option must fit within 120 KiB.

Use the request and field IDs from the pending approval and provide a nonempty
value for each required field. See the
[session events API reference](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/events/methods/create)
for the request schema.

<details>
<summary>Expanded cURL request and stream handling</summary>

Use this version when you need to distinguish transport failures, HTTP errors,
and invalid session-creation responses. It also filters streamed output and
reports error types and codes. It follows the same two-terminal workflow as the
first example; handle approvals in the second terminal as they arrive.

Create a session and inspect stream failures

```bash
create_browser_session() {
  unset session_id
  local result http_status body curl_status
  if result=$(curl --silent --fail-with-body --write-out '\n%{http_code}' \
    https://api.openai.com/v1/agents/sessions \
    -H "OpenAI-Beta: agents=v1" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "agent": {
        "model": "gpt-6-astra",
        "instructions": "Read public documentation in the browser. Do not sign in or change any website data. Report the page title and URL you find.",
        "tools": [{ "type": "computer_use", "include_screenshots": true }]
      },
      "environment": {
        "type": "openai_hosted",
        "desktop": { "enabled": true },
        "network": { "access": "enabled" }
      }
    }'); then curl_status=0; else curl_status=$?; fi
  http_status=$(printf '%s\n' "$result" | tail -n 1)
  body=$(printf '%s\n' "$result" | sed '$d')
  [[ "$http_status" =~ ^[0-9]{3}$ ]] || http_status=000

  if [ "$curl_status" -ne 0 ] || [[ ! "$http_status" =~ ^2[0-9][0-9]$ ]]; then
    printf '%s' "$body" | jq --raw-input --slurp --compact-output \
      --arg status "$http_status" --arg curl_status "$curl_status" '
        def identifier:
          if type == "string" and test("^[A-Za-z][A-Za-z0-9_]{0,79}$") then . else null end;
        (try fromjson catch {}) as $response
        | (if ($response | type) == "object" then $response.error // $response else {} end) as $error
        | if $curl_status != "0" and $curl_status != "22" then
            {status: $status, type: "transport_error", code: ("curl_" + $curl_status)}
          else
            {status: $status, type: ((try ($error.type | identifier) catch null) // "http_error"),
             code: (try ($error.code | identifier) catch null)}
          end' >&2
    return 1
  fi
  if ! session_id=$(printf '%s' "$body" | jq --exit-status --raw-output \
    'select(type == "object") | .id | select(type == "string" and length > 0)' 2>/dev/null); then
    unset session_id
    printf '{"status":"%s","type":"invalid_response","code":"missing_session_id"}\n' "$http_status" >&2
    return 1
  fi
  printf 'Session ID: %s\n' "$session_id"
}
create_browser_session

# Terminal 1: use session_id from the creation request.
# Keep this stream open. Wait for HTTP 200 before sending input.
set -o pipefail
curl --silent --show-error --dump-header - --suppress-connect-headers \
  --no-buffer --fail-with-body \
  "https://api.openai.com/v1/agents/sessions/$session_id/events" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Accept: text/event-stream" \
  | jq --null-input --raw-input --compact-output --unbuffered '
      def identifier:
        if type == "string" and test("^[A-Za-z][A-Za-z0-9_]{0,79}$") then . else null end;
      def safe_error:
        if type == "object" then {type: (.type | identifier), code: (.code | identifier)} else null end;
      def public_event:
        if .type == "agent.session.turn.output_text.done" then {type, text}
        elif .type == "agent.session.turn.completed" or .type == "agent.session.turn.failed" or .type == "agent.session.turn.cancelled" then
          {type, turn_id: .turn.id, subagent_id: .turn.subagent_id, error: (.turn.error | safe_error)}
        elif .type == "error" or .type == "agent.session.failed" or .type == "agent.session.environment.failed" then
          {type, error: ((.error // .session.error // .environment.error) | safe_error)}
        elif .type == "agent.session.requires_action" then {type}
        else empty end;
      foreach inputs as $raw (
        {body: "", headers: false, failed: false, output: []};
        .output = []
        | ($raw | rtrimstr([13] | implode)) as $line
        | if ($line | startswith("HTTP/")) then
            (try ($line | capture("^(?<protocol>HTTP/[0-9.]+) (?<status>[0-9]{3})(?: |$)")) catch null) as $http
            | if $http == null then . else
                .body = "" | .headers = true | .status = $http.status
                | .failed = (($http.status | tonumber) >= 300)
                | .output = [$http.protocol + " " + $http.status]
              end
          elif .headers then
            if $line == "" then .headers = false else . end
          elif ($line | startswith("data:")) then
            (try ($line | ltrimstr("data:") | fromjson) catch null) as $event
            | .output = [$event | select(type == "object") | public_event]
          elif .failed and .body != null then
            .body += ($line + "\n")
            | (try (.body | fromjson) catch null) as $body
            | if ($body | type) == "object" then
                (($body.error // $body) | safe_error) as $error
                | .output = [{status: .status, type: ($error.type // "http_error"), code: $error.code}]
                | .body = null
              else . end
          else . end;
        .output[])'

# Terminal 2: replace sess_123 with the ID printed in terminal 1.
# Export OPENAI_API_KEY in this terminal too.
session_id="sess_123"
curl --fail-with-body "https://api.openai.com/v1/agents/sessions/$session_id/events" \
  -H "OpenAI-Beta: agents=v1" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [{
      "type": "agent.session.input.message",
      "input": [{
        "role": "user",
        "content": [{
          "type": "input_text",
          "text": "Open https://developers.openai.com in the browser. Find the Agents API quickstart, then report its page title and URL."
        }]
      }]
    }]
  }'
```


</details>