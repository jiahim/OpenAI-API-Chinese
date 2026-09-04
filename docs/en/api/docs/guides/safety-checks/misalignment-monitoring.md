# Misalignment monitoring

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Misalignment monitoring checks whether an agent is properly interpreting the user's instructions in consequential contexts, such as transferring sensitive data, accessing sensitive data, or making destructive changes. It reviews model reasoning and actions asynchronously and can stop a conversation when it identifies a potential issue.

A flag indicates that the agent's actions need review. It does not establish that the user violated a policy or that the agent acted contrary to instructions. Monitoring can miss issues or flag legitimate activity, so continue to use [application safeguards](https://developers.openai.com/api/docs/guides/safety-best-practices), including human approval for consequential actions.

For more context, see the [misalignment monitoring overview in the Help Center](https://help.openai.com/articles/20001509).

## Request coverage

For models covered by this system, monitoring and automatic stopping depend on the request's API and how it preserves conversation context:

| Requests                                                                           | Behavior                                                                                                        |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Responses API requests using persisted reasoning, WebSockets, or OpenAI compaction | Monitored. The system can identify continuations of a conversation and block further execution.                 |
| Responses API requests using none of those mechanisms                              | Monitored. Configured webhooks can receive alerts, but the system does not automatically stop the conversation. |
| Chat Completions API requests                                                      | Not covered by this monitoring system. Other safety checks still apply.                                         |

See [preserving reasoning across calls](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls), [WebSocket mode](https://developers.openai.com/api/docs/guides/websocket-mode), and [compaction](https://developers.openai.com/api/docs/guides/conversation-state#compaction) for conversation context guidance. Configuring an alert webhook does not enable automatic stopping.

## Handle a stopped request

When misalignment monitoring blocks a request before streaming begins, the API returns HTTP `403`, with error type `invalid_request_error` and code `misalignment_policy_violation`. Match the error code rather than the message text. Streaming integrations must also handle errors while consuming the stream, even after receiving output.

If your application receives this error:

1. Stop dispatching further actions for the affected conversation. Do not automatically retry the blocked workflow.
2. Preserve the relevant request and response IDs, tool calls, and application records according to your data handling policies.
3. Show the available error information to the user or operator responsible for the task. Have them compare the agent's actions with the intended work and review any changes already made.

The API does not provide a general way to resume a conversation stopped by misalignment monitoring.

Because monitoring is asynchronous, an action may already have completed before monitoring identifies a concern. A stopped request does not undo earlier actions.

## Receive project safety alerts

Subscribe to `safety.alert.created` to route monitoring alerts for an API project to a system your team operates. Receiving alerts does not replace handling errors on API requests.

Follow [Creating webhook endpoints](https://developers.openai.com/api/docs/guides/webhooks#creating-webhook-endpoints) for each project whose alerts you want to receive. Use the Webhooks guide for [signature verification](https://developers.openai.com/api/docs/guides/webhooks#verifying-webhook-signatures), [acknowledgments, retries, and duplicate deliveries](https://developers.openai.com/api/docs/guides/webhooks#handling-webhook-requests-on-a-server).

The webhook contains an alert ID, rather than the alert details:

```json
{
  "object": "event",
  "id": "evt_123",
  "type": "safety.alert.created",
  "created_at": 1787659200,
  "data": {
    "id": "alert_0123456789abcdef0123456789abcdef"
  }
}
```

After verifying and acknowledging the webhook, retrieve the alert in your background processing. Set `SAFETY_ALERT_ID` to `data.id`, not the event's `id`. Use an API key authorized for the same project with the `api.safety.alerts.read` permission:

```bash
curl "https://api.openai.com/v1/safety/alerts/${SAFETY_ALERT_ID}" \
  -H "Authorization: Bearer ${OPENAI_API_KEY}"
```

Retrieve a project safety alert

```javascript
import OpenAI from "openai";

const client = new OpenAI();
const alertId = process.env.SAFETY_ALERT_ID;
if (!alertId) throw new Error("Set SAFETY_ALERT_ID.");

const alert = await client.safety.alerts.retrieve(alertId);
console.log(alert.error_type, alert.reason, alert.response_id);
```

```python
import os

from openai import OpenAI

client = OpenAI()
alert = client.safety.alerts.retrieve(os.environ["SAFETY_ALERT_ID"])
print(alert.error_type, alert.reason)
```

```go
package main

import (
	"context"
	"fmt"
	"os"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	alert, err := client.Safety.Alerts.Get(context.Background(), os.Getenv("SAFETY_ALERT_ID"))
	if err != nil {
		panic(err)
	}
	fmt.Println(alert.ErrorType)
	fmt.Println(alert.Reason)
	fmt.Println(alert.RequestPaused)
}
```

```java
import com.openai.models.safety.alerts.SafetyAlert;

SafetyAlert alert = client.safety().alerts().retrieve(System.getenv("SAFETY_ALERT_ID"));
System.out.println(alert.errorType());
alert.reason().ifPresent(System.out::println);
System.out.println(alert.requestPaused());
```

```ruby
require "openai"

client = OpenAI::Client.new
alert = client.safety.alerts.retrieve(ENV.fetch("SAFETY_ALERT_ID"))
puts(alert.error_type)
puts(alert.reason)
puts(alert.request_paused)
```


Use the returned `request_id` and `response_id` to find the affected work in your application records. Treat the alert category as a concern to investigate. When `request_paused` is `true`, registering a safety block succeeded; this does not confirm that execution stopped or that earlier actions were reversed. Check your application's task state and tool records.

The alert's `reason` can be `null`, including for Zero Data Retention (ZDR) requests. A non-null `reason` is a category description, not a transcript or full investigation report. Keep the records you need under your organization's data policies. See [Your data](https://developers.openai.com/api/docs/guides/your-data) for API data controls.

If retrieval returns `404` with code `safety_alert_not_found`, check the alert ID and project credentials. Missing, inaccessible, or incomplete records can return this error. Alert delivery and retrieval do not provide a complete audit history.