# 沙箱生命周期

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 后追加 `.md` 来获取文档页面的 Markdown 版本。

一个智能体会话可以比其环境存活得更久。你的应用程序负责管理该环境所使用的计算资源和文件。 `self_hosted` 环境。






## 启动环境

你的应用可以在创建会话后开始计算。请使用你的 [提供商的 SDK 或 API](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#sandbox-providers)，然后 [将执行器连接](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 到该会话的环境 ID 和环境密钥。

请参阅 [应用管理的沙箱示例](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes) ，位于 OpenAI Cookbook 中。

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/application-managed-sandboxes-mobile.webp"
    width="680"
    height="1296"
  />
  <img src="https://developers.openai.com/images/api/agents-api/application-managed-sandboxes.webp"
    width="1400"
    height="788"
    alt="The application sends input, receives events, and controls provider compute. The sandbox executor connects outbound to the Agents API, then exchanges commands and results over the connection."
    loading="lazy"
  />
</picture>

使用一个组件来管理每个会话的环境。存储会话与提供商计算资源之间的映射关系。重复或并发的请求不得创建重复的环境。




### Start compute from webhooks

你也可以等到 input 需要环境连接。API 会发出 `agent.session.action_required` 用于 `required_action.type: "environment_connection"` 然后再等待执行器。你的 webhook 处理程序会启动或重连该环境。

请参阅 [webhook 管理的沙箱示例](https://github.com/openai/openai-cookbook/blob/main/examples/agents_api/sandboxes/webhook_managed.md) ，位于 OpenAI Cookbook 中。

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/webhook-managed-sandboxes-mobile.webp"
    width="680"
    height="1812"
  />
  <img src="https://developers.openai.com/images/api/agents-api/webhook-managed-sandboxes.webp"
    width="1400"
    height="1072"
    alt="The application exchanges input and events with the Agents API. A webhook controller verifies connection requests, checks the current session, and starts or reconnects a provider sandbox. Its executor connects outbound and exchanges commands and results."
    loading="lazy"
  />
</picture>




按照 [webhook 设置](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks#set-up-a-webhook) 注册你的处理程序，用于 `agent.session.action_required` 和 `agent.session.failed`。将其签名密钥与会话读取凭证与执行器的分开保管。 [environment key](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)。如果同一项目下有多个 provider 处理程序，请将事件路由到拥有该会话的处理程序。




处理程序与 worker 的职责相互独立：

1. **验证并排队。** 验证 webhook 签名。仅在 `data.required_action.type` 为 `environment_connection`。时排队连接请求。同时排队会话失败。仅在排队成功后才返回成功的 HTTP 响应。
2. **检查当前状态。** worker 取出该会话。忽略已删除的会话和已解决的动作。对于仍需连接的 self-hosted 会话，使用 `session.environment.id` 启动或重新连接其执行器，对于 `session.environment.remote_url`。仍处于失败状态的会话，释放其计算资源。

会话流报告相同的请求为 `agent.session.requires_action`。 `function_call` 必需操作需要的是函数结果，而不是环境启动。轮次创建和 `agent.session.in_progress` 事件到达得太晚，无法启动离线执行器。




部署处理程序后， [创建自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-a-session) 和 [发送输入](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input)。匹配处理程序中配置的工作目录以及任何智能体过滤器。如果执行器在截止时间之前连接，则原始提交将继续进行。




## 保持环境可用或停止环境

在轮次之间保持算力持续运行以便复用，或在轮次结束后允许一段宽限期再停止。与传入的请求协调关闭。当有连接请求或执行开始时，取消待执行的关闭。在停止算力前重新检查状态。

仅凭空闲事件本身并不是安全的关闭信号。它可能在连接请求被清除时、等待输入开始其轮次之前出现。如果你的应用无法与传入请求协调关闭，请保持环境持续运行。






## 断线后重连

连接事件报告状态。使用 `agent.session.environment.connected` 和 `agent.session.environment.disconnected` 来观察连接情况。设置过程也会发出 `agent.session.environment.pending` 或 `agent.session.environment.failed`。这些事件不会请求计算资源。请使用 `environment_connection` 必需动作来触发启动，并另行检查提供商健康状况。

轮次中发生断连时，即使该轮次已完成，工具调用仍可能失败。请检查工具结果以及该智能体的最终响应。断连不会自动通过 webhook 请求重连，也不会重新启动已被终止的命令。后续输入可以请求重新连接。

API 最多等待五分钟来建立输入时的连接。请相应地配置客户端和代理的超时时间。若超时，提交将失败。初始输入可能会异步失败，并使会话保持在 `failed`.

API 不保证在进程崩溃后恢复未处理的输入。请在重试前检查请求或会话的结果。原始请求仍在等待时，请勿重复提交。迟到的连接不会重放已超时的输入。

在替换的计算环境中复用环境 ID 并不会恢复其中的文件。请使用提供商存储或快照来保留它们。

## 清理

停止接受新输入。与任何已在进行的启动工作协调清理，以避免留下仍在运行的计算。

[删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止提供商计算。删除会话既不会停止其环境，也不会发出删除 webhook。