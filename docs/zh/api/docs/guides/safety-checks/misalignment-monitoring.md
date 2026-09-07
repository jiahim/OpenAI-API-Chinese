# Misalignment monitoring

> 完整文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 末尾附加 `.md` 来获取。

错位监控会检查智能体是否在关键场景中正确理解用户指令，例如传输敏感数据、访问敏感数据或执行破坏性更改。它会异步审查模型的推理和操作，并在发现潜在问题时停止对话。

某个标记表示智能体的操作需要审查。它并不证明用户违反了策略，也不证明智能体的行为违背了指令。监控可能会遗漏问题或将合法活动误标记，因此请继续使用 [应用安全防护措施](https://developers.openai.com/api/docs/guides/safety-best-practices)，包括对关键操作进行人工审批。

如需了解更多背景，请参阅 [帮助中心中的错位监控概述](https://help.openai.com/articles/20001509).

## Request coverage

对于本系统涵盖的模型，监控和自动停止取决于请求的API以及它如何保留对话上下文：

| 请求                                                                           | 行为                                                                                                        |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 使用持久化推理、WebSockets 或 Responses APIOpenAI 压缩的请求 | 受监控。系统可以识别对话的延续并阻止进一步执行。                 |
| 未使用上述任何机制的 Responses API 请求                              | 受监控。已配置的 webhook 可以接收告警，但系统不会自动停止对话。 |
| Chat Completions API 请求                                                      | 不在本监控系统的覆盖范围内。其他安全检查仍然适用。                                         |

参见 [跨调用保留推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls), [WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode)，以及 [压缩](https://developers.openai.com/api/docs/guides/conversation-state#compaction) 获取对话上下文相关指导。配置告警 webhook 并不会启用自动停止。

## 处理已停止的请求

当未对齐监测在流式输出开始前拦截请求时，API 返回 HTTP `403`，以及错误类型 `invalid_request_error` 和代码 `misalignment_policy_violation`。请以错误代码为准，而非消息文本。流式集成还必须在消费流的整个过程中处理错误，即使在接收到输出之后也是如此。

如果你的应用收到此错误：

1. 停止为受影响的会话派发后续动作。不要自动重试被阻止的工作流。
2. 根据你的数据处理策略，保留相关的请求与响应 ID、工具调用以及应用记录。
3. 向负责该任务的用户或操作人员展示可用的错误信息。让他们将智能体的操作与预期工作进行比对，并复核已经做出的任何更改。

API 没有提供通用的方式来恢复因对齐监测而停止的对话。

由于监测是异步的，在监测识别到问题之前，相关操作可能已经完成。停止请求并不会撤销之前已经执行的操作。

## 接收项目安全警报

订阅 `safety.alert.created` 以将某个 API 项目的监控告警路由到你团队运营的系统。接收告警并不能替代对 API 请求中的错误进行处理。

请按照 [创建 Webhook 端点](https://developers.openai.com/api/docs/guides/webhooks#creating-webhook-endpoints) 为每个希望接收告警的项目创建 webhook 端点。使用 Webhooks 指南了解 [签名验证](https://developers.openai.com/api/docs/guides/webhooks#verifying-webhook-signatures), [确认机制、重试以及重复投递](https://developers.openai.com/api/docs/guides/webhooks#handling-webhook-requests-on-a-server).

该 webhook 包含告警 ID，而不是告警详情：

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

在验证并确认 webhook 后，在你的后台处理中检索该告警。请将 `SAFETY_ALERT_ID` 设置为 `data.id`，而不是事件的 `id`。请使用为同一项目授权并具备 `api.safety.alerts.read` 权限的 API 密钥：

```bash
curl "https://api.openai.com/v1/safety/alerts/${SAFETY_ALERT_ID}" \
  -H "Authorization: Bearer ${OPENAI_API_KEY}"
```

检索项目安全告警

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


使用返回的 `request_id` 和 `response_id` 在你的应用记录中查找受影响的工作。请将告警类别视为需要调查的关注点。当 `request_paused` 为 `true`，时，表示注册安全阻止成功；但这并不确认执行已停止，也不确认先前的操作已撤销。请检查你应用的任务状态和工具记录。

告警的 `reason` 可以 `null`，包括零数据保留（ZDR）请求。非空 `reason` 是类别描述，不是转录或完整的调查报告。请根据你所在组织的数据策略保留所需的记录。参阅 [你的数据](https://developers.openai.com/api/docs/guides/your-data) ，了解 API 数据控制。

如果检索返回 `404` 并附带代码 `safety_alert_not_found`，请检查告警 ID 和项目凭据。缺失、无法访问或不完整的记录可能会返回此错误。告警的发送与检索不提供完整的审计历史记录。