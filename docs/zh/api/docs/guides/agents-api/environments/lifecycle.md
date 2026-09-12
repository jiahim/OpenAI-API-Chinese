# 沙箱生命周期

> 完整文档索引请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

一个智能体会话可以比其环境存在更长时间。你的应用程序管理由某个环境使用的算力和文件。 `self_hosted` 环境。






## Start an environment

你的应用可以在创建会话后开始计算。请使用你 [提供商的 SDK 或 API](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#sandbox-providers)，然后 [连接执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) ，传入会话的环境 ID 和环境密钥。

请参阅 [应用管理的沙箱示例](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/application_managed) ，见 OpenAI Cookbook。

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




### 从 webhook 启动计算

你也可以等待输入需要环境连接。API 会发出 `agent.session.action_required` 事件 `required_action.type: "environment_connection"` ，然后再等待执行器。你的 webhook 处理程序启动或重新连接环境。

请参阅 [webhook 管理的沙箱示例](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/webhook_managed) ，见 OpenAI Cookbook。

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




按照 [webhook 设置](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks#set-up-a-webhook) 注册你的处理程序以监听 `agent.session.action_required` 和 `agent.session.failed`。将其签名密钥和会话读取凭据与执行器的环境密钥分开保存。 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)。如果多个提供商处理程序共享一个项目，请将事件路由到拥有该会话的处理程序。




处理程序和工作进程各自的职责不同：

1. **验证并排队。** 验证 webhook 签名。仅当 `data.required_action.type` 为 `environment_connection`。时排队连接请求。同时对会话失败进行排队。仅在排队成功后才返回成功的 HTTP 响应。
2. **检查当前状态。** 工作进程检索会话。忽略已删除的会话和已解决的操作。对于仍需要连接的自行托管会话，使用 `session.environment.id` 和 `session.environment.remote_url`。启动或重连其执行器。对于仍处于失败状态的会话，释放其计算资源。

会话流将同一请求上报为 `agent.session.requires_action`。所需 `function_call` 操作需要函数结果，而非环境启动。回合创建和 `agent.session.in_progress` 事件到达得太晚，无法启动离线执行器。




部署处理程序后， [创建自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-a-session) 和 [发送输入](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input)。匹配处理程序中配置的工作目录和任何 智能体 过滤器。如果执行器在截止时间前连接，原始提交将继续进行。




## 保持环境可用或停止它

在多轮之间保持算力运行以便复用，或在轮次结束后提供一段宽限期再停止。与传入的工作协调关闭。当有连接请求或执行开始时，取消待执行的关闭。停止算力前重新检查状态。

单凭空闲事件不足以作为安全的关闭信号。它可能在连接请求被清理后、等待输入开始其轮次之前到达。如果你的应用无法与传入的工作协调关闭，请保持环境运行。






## 在断开连接后重新连接

连接事件用于报告状态。可使用 `agent.session.environment.connected` 和 `agent.session.environment.disconnected` 来观察连接情况。设置过程中也可能发出 `agent.session.environment.pending` 或 `agent.session.environment.failed`。这些事件不请求计算资源。可使用 `environment_connection` 必需操作来触发启动，并单独检查提供方的健康状况。

轮次中途断开连接可能导致工具调用失败，即使该轮次最终完成。请检查工具结果以及该 智能体 的最终响应。断开连接不会自动通过 webhook 请求重连，也不会重新启动已被终止的命令。后续的输入可以请求重连。

API 最多等待五分钟以建立输入时的连接。请相应配置客户端和代理的超时时间。如果超时，提交将失败。初始输入可能异步失败，并使会话停留在 `failed`.

API 不保证在进程崩溃后恢复等待中的输入。在重试之前，请检查请求或会话的结果。在原始请求仍在等待时，请勿重新提交。迟到的连接不会重放已超时的输入。

在替换计算资源中重复使用环境 ID 不会恢复其中的文件。请使用提供方存储或快照来保留文件。

## 清理

停止接受新输入。与已在进行的启动工作协调清理，以避免让计算资源继续运行。

[删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止 provider 的计算资源。删除会话既不会停止其环境，也不会发出删除 webhook。