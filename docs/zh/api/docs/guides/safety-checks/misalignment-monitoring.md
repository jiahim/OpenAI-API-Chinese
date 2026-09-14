# 失配监控

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

错位监控会检查智能体在重要场景中是否正确解读了用户指令，例如传输敏感数据、访问敏感数据或进行破坏性更改。它会异步审视模型的推理与行为，并在发现潜在问题时中止对话。

一个标记表明该智能体的行为需要审核。它并不能确认用户违反了策略，也不能确认该智能体违背了指令运行。监控可能会遗漏问题或将正常活动标记为可疑，因此请继续使用 [应用安全防护](https://developers.openai.com/api/docs/guides/safety-best-practices)，包括对重要操作进行人工审批。

如需了解更多背景，请参阅 [帮助中心中的错位监控概述](https://help.openai.com/articles/20001509).

## 请求覆盖范围

对于受该系统约束的模型，监控和自动停止取决于请求的 API 及其保留对话上下文的方式：

| 请求                                                                           | 行为                                                                                                        |
| ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 使用持久化推理、WebSocket 或 Responses APIOpenAI 压缩的请求 | 受监控。系统可以识别对话的延续并阻止进一步执行。                 |
| 未使用上述任何机制的 Responses API 请求                              | 受监控。已配置的网络钩子可以接收告警，但系统不会自动停止对话。 |
| Chat Completions API 请求                                                      | 不受此监控系统覆盖。其他安全检查仍然适用。                                         |

请参阅 [跨调用保留推理](https://developers.openai.com/api/docs/guides/reasoning#preserve-reasoning-across-calls), [WebSocket 模式](https://developers.openai.com/api/docs/guides/websocket-mode)，以及 [压缩](https://developers.openai.com/api/docs/guides/conversation-state#compaction) 获取对话上下文相关指引。配置告警 webhook 并不会启用自动停止。

## 处理已停止的请求

当对齐监控在流式输出开始前拦截某个请求时，API 返回 HTTP `403`，并附带错误类型 `invalid_request_error` 和错误码 `misalignment_policy_violation`。请匹配错误码而非消息文本。即使在接收到输出后，流式集成也必须在消费流的过程中处理错误。

如果你的应用收到此错误：

1. 停止为受影响的对话调度后续动作。不要自动重试被阻止的 工作流。
2. 根据你的数据处理策略，保留相关的请求和响应 ID、工具调用以及应用记录。
3. 将可用的错误信息展示给负责该任务的用户或操作员，让他们把 智能体 的动作与预期工作进行核对，并复核已经做出的任何更改。

API 没有提供通用方式来恢复被偏离监控（misalignment monitoring）停止的对话。

由于监控是异步的，因此在监控识别出问题之前，相关操作可能已经完成。停止一个请求并不会撤销之前已完成的操作。

## 接收项目安全警报

订阅 `safety.alert.created` ，以便将 API 项目的监控告警路由到你团队运维的系统中。接收告警并不能替代对 API 请求中的错误进行处理。

按照 [创建 Webhook 端点](https://developers.openai.com/api/docs/guides/webhooks#creating-webhook-endpoints) 为每个需要接收告警的项目创建 Webhook 端点。关于 [签名验证](https://developers.openai.com/api/docs/guides/webhooks#verifying-webhook-signatures), [确认、重试和重复发送](https://developers.openai.com/api/docs/guides/webhooks#handling-webhook-requests-on-a-server).

Webhook 包含的是告警 ID，而不是告警详情：

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

在验证并确认 Webhook 之后，在后台处理中获取该告警。将示例性的 `salert_123` 值替换为来自 `data.id` Webhook 的值。事件的 `id` 标识的是 Webhook 事件本身，而非告警。请使用对同一项目具有 `api.safety.alerts.read` 权限的 API 密钥：

```bash
curl "https://api.openai.com/v1/safety/alerts/salert_123" \
  -H "Authorization: Bearer ${OPENAI_API_KEY}"
```

获取项目安全告警

```javascript
// Replace the illustrative IDs and URLs below with your own resource values.
import OpenAI from "openai";

const client = new OpenAI();
const alertId = "salert_123";

const alert = await client.safety.alerts.retrieve(alertId);
console.log(alert.error_type, alert.reason, alert.response_id);
```

```python
# Replace the illustrative IDs and URLs below with your own resource values.

from openai import OpenAI

client = OpenAI()
alert = client.safety.alerts.retrieve("salert_123")
print(alert.error_type, alert.reason)
```

```go
// Replace the illustrative IDs and URLs below with your own resource values.
package main

import (
	"context"
	"fmt"

	"github.com/openai/openai-go/v3"
)

func main() {
	client := openai.NewClient()
	alert, err := client.Safety.Alerts.Get(context.Background(), "salert_123")
	if err != nil {
		panic(err)
	}
	fmt.Println(alert.ErrorType)
	fmt.Println(alert.Reason)
	fmt.Println(alert.RequestPaused)
}
```

```java
// Replace the illustrative IDs and URLs below with your own resource values.
import com.openai.models.safety.alerts.SafetyAlert;

SafetyAlert alert = client.safety().alerts().retrieve("salert_123");
System.out.println(alert.errorType());
alert.reason().ifPresent(System.out::println);
System.out.println(alert.requestPaused());
```

```ruby
# Replace the illustrative IDs and URLs below with your own resource values.
require "openai"

client = OpenAI::Client.new
alert = client.safety.alerts.retrieve("salert_123")
puts(alert.error_type)
puts(alert.reason)
puts(alert.request_paused)
```


使用返回的 `request_id` 和 `response_id` 在你的应用记录中定位受影响的工作。将告警类别视为需要调查的问题。当 `request_paused` 为 `true`，时，表示注册安全阻止成功；这并不能确认执行已停止，也不能确认先前的操作已被撤销。请检查你应用的任务状态和工具记录。

告警的 `reason` 可以 `null`，包括针对零数据保留 (ZDR) 请求的调用。非空的 `reason` 属于类别描述，而非转录文本或完整的调查报告。请根据你所在组织的数据策略保留所需记录。请参阅 [你的数据](https://developers.openai.com/api/docs/guides/your-data) ，了解 API 数据控制相关信息。

如果检索返回 `404` 并附带代码 `safety_alert_not_found`，请检查告警 ID 和项目凭证。缺失、无法访问或不完整的记录都可能返回此错误。告警的投递与检索并不提供完整的审计历史。