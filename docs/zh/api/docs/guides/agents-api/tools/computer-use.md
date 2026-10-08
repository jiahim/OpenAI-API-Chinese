# Computer use

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获取文档页面的 Markdown 版本。

Computer use 让智能体能够浏览网站并与浏览器界面交互，
用于测试网站、收集信息，或通过应用的 UI 来使用它。

智能体 API 在 OpenAI 托管的环境中运行浏览器。你的应用
启动会话并跟踪其事件；智能体会根据它在
浏览器中观察到的情况来决定下一步该做什么。

要运行浏览器任务：

1. [创建浏览器会话](#configure-the-browser) 并保存会话 ID。
2. [追踪会话事件并向 智能体 发送任务](#run-a-browser-task).
3. [处理每次网站访问请求](#handle-origin-access)。如果任务需要账号， [处理登录](#handle-sign-in).
4. 等待主 智能体 完成当前轮次并验证其结果。如果连接断开， [恢复同一会话](#recover-approval-handling) 后再重试。
5. [查看已保存的浏览器活动](#follow-browser-activity)，然后 [删除会话](#continue-and-clean-up) 。

## 配置浏览器

按照 [智能体 API 快速入门先决条件](https://developers.openai.com/api/docs/guides/agents-api/quickstart#prerequisites)
创建一个 API 密钥并导出 `OPENAI_API_KEY`，然后安装
[OpenAI SDK 对应语言版本](https://developers.openai.com/api/docs/libraries)。对于 JavaScript 示例，
请安装 `openai` 和 `prompt-sync`。cURL 示例需要使用 Bash 和 `jq`.

若要启用浏览器访问：

- Add `{ "type": "computer_use" }` to `agent.tools`.
- Set `environment.type` to `openai_hosted` and `environment.desktop.enabled` to `true`.

下面的 JavaScript 示例构成一个完整的演练流程：创建一个会话，处理
网站审批，然后发送一个任务并打印结果。首先创建一个
启用了截图功能的浏览器会话。这一步不会启动任务。

创建一个浏览器会话

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


## 处理来源访问

浏览器需要用户批准后才能访问每个新网站
来源，包括公共网站。启用网络访问并不会批准
这些请求。

处理来源批准：

1. 开启 `agent.session.requires_action`，获取会话并检查其当前 `required_actions`.
2. 查找待处理 `computer_use_approval_request` 条目，其中嵌套 `request.type` 为 `browser_origin_access`.
3. 显示请求的 `origin` and `reason` （如果已提供），然后收集一个 `approve`, `deny`，或 `cancel` 决策。使用相同的 `request_id` 和一个嵌套 `response` 包含 `type: "browser_origin_access"` and `decision`，如下所示。

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

在任务代码之前定义此辅助函数。它负责处理来源授权并取消
登录请求，因为此任务仅读取公共页面。

响应来源访问请求

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


保持流打开并处理每个待处理的授权。使用 `request_id` 来
跟踪请求，并在请求不再处于该
会话 `required_actions`。中时移除授权控件。取消授权请求不会取消
任务。

一个 `202` 响应仅表示该决定已被接受，并不意味着导航已完成
。

## 运行浏览器任务

让智能体在公共开发者站点上查找智能体 API quickstart，并
报告其标题和 URL。

在发送任务之前打开事件流，以便你的应用接收到
首批进度事件。处理 [origin 审批](#handle-origin-access) 以让浏览器在它们
到达时继续运行。

发送任务并跟踪其结果

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


该示例会输出智能体的答复。请确认其中包含 quickstart 的标题和 URL
。

关闭事件流不会停止任务。若要停止任务，请取消该轮。
如遇到连接故障或结果不确定，请参阅
[恢复指南](#recover-approval-handling)。
[扩展版 cURL 示例](#request-handling-reference) 包含传输和错误
诊断信息。

## 跟踪浏览器活动

浏览器操作在会话输出中显示为 `computer_use_call` 条目。流式
活动和已保存的会话历史使用相同的条目格式。

| 字段     | 含义                                                |
| --------- | ------------------------------------------------------ |
| `id`      | 活动项的标识符。                        |
| `turn_id` | 产生该活动的轮次。                   |
| `title`   | 浏览器活动的描述，或 `null`.      |
| `status`  | `in_progress`, `completed`, `failed`，或 `incomplete`. |
| `output`  | 可用时的截图输出。                     |

使用 title 和 status 在你的应用中展示进度。浏览器活动
项描述了一个工具调用过程，它并不是智能体的最终回复，也不是
整个回合的完成状态。详见
[事件与项](https://developers.openai.com/api/docs/guides/agents-api/sessions/events) 中的会话事件模型。

### 包含屏幕截图

若要在你的应用中显示浏览器的进度，请设置 `include_screenshots`
来 `true` 位于 `computer_use` 工具上。截图默认会从 API 输出中排除
，但 智能体 仍然可以观察到它们。

每次浏览器操作都会在以下字段中返回其最近发出的截图 `output`，中（当
可用时）：

```json
{
  "type": "computer_screenshot",
  "image_url": "data:image/jpeg;base64,..."
}
```

使用 `image_url` 来渲染截图。某些操作会返回 `output: null`,
即使已启用截图，你的应用也需要处理没有图片的 activity 条目
。

截图可能包含敏感的页面或账户数据。仅向
  已授权的用户展示，并避免将其写入应用日志。

在回合结束后检索已保存的浏览器 activity。SDK 示例会将
最新的可用截图保存到 `browser-screenshot.jpg`.

读取浏览器 activity

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


SDK 示例不会覆盖现有文件。请在重新运行之前移动或删除
`browser-screenshot.jpg` 这些文件。

## 处理登录

读取私有 GitHub 仓库中的 issue 等任务需要经过
身份验证的浏览器。你的应用负责处理登录过程，这样用户就可以选择登录方式并在聊天窗口之外输入凭据。
登录方式并输入凭据。

登录过程可能涉及多个请求。例如，某个网站可能会要求用户
选择使用邮箱登录，输入邮箱地址，然后再输入验证码。
根据每个请求返回的登录方式和字段构建你的 UI。

只有主智能体可以请求浏览器身份验证；
  [子智能体](https://developers.openai.com/api/docs/guides/agents-api/multi-agent) 无法发起请求。该流程
  支持邮箱地址、密码和验证码，但不支持通行密钥
  或二维码登录。需要使用不支持的方式登录的网站无法通过此流程
  完成登录。

保持任务的事件流处于打开状态，并处理
[origin 审批](#handle-origin-access) 到达时。在
`agent.session.requires_action`，中，获取会话并查看其当前的
`required_actions` 中 `computer_use_approval_request` 条目，其中嵌套的
`request.type` 为 `browser_authentication`.

使用嵌套的 `request` 来渲染你的登录 UI：

| 字段               | 如何使用                                                                                               |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `reason`            | 说明为何需要输入（如果提供）。可以是 `null`.                                                    |
| `credential_origin` | 展示凭据的目标位置。可以是 `null`.                                                |
| `fields`            | 使用每个字段的 `id`, `label`, `type`，和 `required` 值来渲染输入。可以为空。                |
| `options`           | 展示可用的登录方式。每个选项都有一个 `id`, `label`，和 `field_ids` 来标识其输入。 |

如果请求提供登录方式，让用户选择其中一种并展示其
关联字段。否则，直接展示请求的字段。

仅要求用户为可验证的目标输入凭据。如果
  凭据来源缺失或不熟悉且用户无法独立验证，
  则取消该身份验证请求。

[提交用户的输入](#return-the-users-input) 使用外层操作的
`request_id`，或 [取消身份验证请求](#let-the-user-cancel) 如果用户
拒绝，则取消身份验证请求。继续处理到达的请求。提交响应并不
表示登录成功；需将任务跟进至完成，并
检查其结果。

### 示例：选择一种方法，然后输入代码

提供邮箱验证码和密码登录的网站可能首先让用户
选择一种方式，而不请求任何字段：

选择登录方式

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


如果用户选择邮箱验证码登录，请提交 `selected_option: "email_code"`
，并 `fields: []` 使用此请求的 `request_id`。然后，网站可在后续请求中分别要求提供
邮箱地址和验证码。使用各自的字段和 ID 渲染每个新请求，并仅在该请求
提供选项时包含 `selected_option` 。
提供选项。

### Return the user's input

当用户完成登录请求时，通过
[会话事件端点](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/events/methods/create).
设置 `action` 来 `submit` 并使用来自待处理请求和字段 ID 的
审批。例如，对一个电子邮件地址请求的响应如下所示
:

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

如果请求提供了登录方式，请在
`response.selected_option`。中包含所选方式的 ID。仅提交该方式的
`field_ids`，中列出的字段，每个必填字段都填写非空值。如果该方式没有
字段，则发送 `fields: []`.

如果未提供任何登录方式，则省略 `selected_option` 并直接提交请求的
字段。当请求列出字段时，即使全部为可选字段，也至少包含一个。
为可选。

仅通过此专用事件发送登录值。提交的值会保留在
  智能体 的模型输入之外，并从身份验证响应中省略
  会话历史记录中的条目。

将所有值（包括电子邮件地址）视为敏感信息。对输入的值进行掩码处理，
使其不进入日志、分析和保存的 UI 状态，并在提交后清除表单。
不要在普通消息或函数工具调用中发送凭据
结果。

从提交事件中省略 `turn_id` 。请参阅
[身份验证提交限制](#authentication-submission-limits) 字段的
和有效负载约束。

一个 `202` 响应（正文为空）确认提交已被接受，
并不代表登录成功。请继续监听会话事件，以获取后续
请求或恢复的任务。提交凭据时，请关闭自动的 HTTP 或 SDK 重试。
如果你不确定提交是否已被接受，
[刷新会话后再继续](#recover-approval-handling).

### 让用户取消

如果用户拒绝登录，请使用以下方式响应挂起的请求
`action: "cancel"`。使用其 `request_id` 并省略 `fields` 和 `selected_option`:

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

这会取消身份验证请求。若要停止任务本身，请取消该轮次。

### 运行已认证的浏览器任务

你的应用负责处理来源审批和登录请求，并遵循
会话事件。请在运行任务之前定义下面的辅助函数。它会显示
目标位置，隐藏输入内容后收集输入，并提交响应。
如果用户拒绝，它会取消登录请求。

处理浏览器审批与登录

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


下面的示例要求 智能体 从一个私有的 GitHub
仓库中读取 issue。请将 `https://github.com/acme/private-repo/issues` 替换为你能够访问的 issue
页面。

在发送任务前打开事件流，并在
会话需要输入时调用该辅助函数。

读取私有仓库的 issue

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


登录可能需要多次请求，因此请持续处理审批直到任务
完成。将 智能体 的结果与所请求的任务进行核对——对于本例而言，
请核对返回的 issue 标题和 URL。

### 查看登录历史

身份验证请求和已接受的响应会出现在会话历史和
`agent.session.turn.item.added` 事件中。请求项包含登录表单的
元数据；响应项记录已接受的操作，但不包含已提交的凭据
值。

使用此历史记录查看过去的交互。若要判断某个登录表单
still needs input, retrieve the session's current `required_actions`. A recorded
response does not establish that sign-in succeeded.

Origin approvals have no dedicated request or response history items. Handle
them through `required_actions`.

## 向用户提出一个问题

若要在任务过程中请求澄清或让用户做出选择，请在 智能体开发工具包 中定义一个
[函数工具](https://developers.openai.com/api/docs/guides/agents-api/tools/functions) 中定义 `agent.tools`.
例如，你可以定义 `request_user_response` 来呈现一个问题并
收集答案。你的应用提供该工具的名称、参数 schema，
和 UI。

当你收到 `agent.session.requires_action`，时，为你的工具找到待处理的
`function_call` 并使用其 `arguments` 来显示该问题。
通过 `agent.session.input.tool_result`，返回答案，使用该 action 的
`turn_id` 和 `call_id`。设置 `success: true` 并将答案放入 `output`,
中，将结构化答案序列化为 JSON 字符串。如果用户拒绝，返回
`success: false` 并附带一条 `error` 消息。

返回答案后，继续跟踪后续的会话事件。前面展示的浏览器
授权辅助函数会处理来源访问和登录；请扩展你的
用于处理问题工具的事件处理器。

函数工具结果对模型可见，并保存在会话历史记录中。
  通过 [浏览器
  身份验证](#handle-sign-in).

## 恢复审批处理

如果你的应用断开连接或审批响应失败，请检索相同的
会话并检查其当前 `required_actions` 然后再继续。仅针对仍处于待处理状态的请求重新构建
表单，并移除已不存在的请求的控件
。

对于已断开的事件流，请遵循
[流恢复](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#how-to-recover-a-disconnected-stream)
以继续接收事件。重新连接时不得自动重新发送任务
或审批响应。

使用响应状态决定下一步操作：

| 结果                                 | 你的应用应该执行的操作                                                                                                                                 |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `202`                                  | 清除已提交的值，并按会话事件获取最终结果。                                                                                               |
| `400`                                  | 将响应类型、所选选项、字段 ID 与必填值与待处理请求进行核对。取消响应和来源访问响应需省略字段。 |
| `404`                                  | 检查会话 ID、请求 ID 和响应类型。重新获取该会话；请求可能已不可用。                                        |
| `409`                                  | 刷新会话。请求可能已过期、其轮次可能已结束，或者已有不同的响应被接受。                             |
| 确认前连接中断 | 将接受状态视为未知。重新连接并获取会话，再决定是否重试。                                                               |

身份验证请求会在五分钟后失效，其所属回合可能会在用户输入时结束
。请在恢复登录前刷新会话
表单。

如果要重试提交身份验证信息，请使用相同的 `request_id`，所选
选项以及字段-值映射。相同的重试不会再次填充浏览器表单
。提交被接受后再更改值将返回 `409`；一次新的
登录尝试需要来自智能体的新请求。

对于来源审批，如果投递失败，请重试相同的决策。更改已接受的决策会返回
。 `409`。来源请求在其所属的
轮次内保持待处理状态，并且没有五分钟的认证超时。

## 控制网络访问

使用托管环境的 `network` 配置来控制出站访问
，包括浏览器和在环境中运行的代码。允许目标
网站以及页面资源或重定向所需的任何域。

来源批准是一项独立的用户决定，不会覆盖网络
策略。参见
[网络访问设置](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted#control-network-access)
来配置环境。

## 继续并清理

对于需要复用其浏览器状态的后续任务，重复使用同一个会话。登录
Cookie 可能会过期，回收环境会清除浏览器状态。

完成后，检索你需要的结果并
[删除会话](https://developers.openai.com/api/docs/guides/agents-api/quickstart#4-clean-up) 以请求
环境清理：

删除浏览器会话

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


参见 [OpenAI-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/openai-hosted)
了解环境生命周期和删除行为。

## 请求处理参考

### 身份验证提交限制

每次提交最多可包含六个字段值，每个字段包含
一次。每个值最多可包含 16,384 个字符；序列化后的字段
值和选定选项必须控制在 120 KiB 以内。

使用待批准项中的请求 ID 和字段 ID，并为每个必填字段提供非空
值。有关请求模式，请参阅
[会话事件 API 参考](https://developers.openai.com/api/reference/resources/beta/subresources/agents/subresources/sessions/subresources/events/methods/create)
文档。

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