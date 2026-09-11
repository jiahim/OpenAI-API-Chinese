# Sandbox lifecycle

> 完整文档索引请参阅 [llms.txt](/llms.txt)。各文档页面的 Markdown 版本可通过在页面 URL 末尾追加 `.md` 获取。

智能体会话可以比其环境存活得更久。你的应用程序管理 a 所使用的计算资源和文件 `self_hosted` environment。






## Start an environment

你的应用可以在创建会话后开始计算。使用你的 [提供方的 SDK 或 API](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#sandbox-providers)，然后 [连接执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) ，并使用该会话的环境 ID 和环境密钥。

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

使用一个组件来管理每个会话的环境。存储会话与提供方计算资源之间的映射关系。重复或并发的请求不得创建重复的环境。




### 从 webhook 启动计算

你也可以等到输入需要环境连接时再处理。API 会发出 `agent.session.action_required` ， `required_action.type: "environment_connection"` 然后再等待执行器。你的 webhook 处理程序负责启动或重新连接该环境。

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




按照 [webhook 设置](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks#set-up-a-webhook) 为 `agent.session.action_required` 注册你的处理程序，并 `agent.session.failed`。保持其签名密钥与会话读取凭据与执行器的 [环境密钥](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication)。分离。如果多个 provider 处理程序共享一个项目，请将事件路由到拥有该会话的处理程序。




处理程序与 worker 的职责是分开的：

1. **校验并加入队列。** 校验 webhook 签名。仅当 `data.required_action.type` 为 `environment_connection`。时，才将连接请求加入队列。同时将会话失败也加入队列。仅在加入队列成功后再返回成功的 HTTP 响应。
2. **检查当前状态。** Worker 检索会话。忽略已删除的会话和已处理的操作。对于仍需要连接的自行托管会话，使用 `session.environment.id` 启动或重新连接其执行器。对于 `session.environment.remote_url`。仍处于失败状态的会话，释放其算力。

会话流上报的是同一个请求，即 `agent.session.requires_action`。所需的 `function_call` 动作需要的是函数结果，而不是环境启动。回合创建和 `agent.session.in_progress` 事件来得太晚，无法启动离线执行器。




部署完该 handler 后， [创建一个自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-a-session) 注册你的处理程序，并 [发送输入](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input)。匹配你的 handler 中配置的工作目录以及任何 智能体 过滤器。如果执行器在截止时间前连接，原始提交会继续。




## 保持环境可用或停止环境

在多个回合之间保持计算资源运行以便复用，或在回合结束后留出宽限期再停止。与传入的工作协调关闭。当有连接请求或执行开始时，取消待处理的关闭。在停止计算资源之前重新检查状态。

仅凭空闲事件并不能作为安全的关闭信号。它可能出现在连接请求被清除时，在等待输入开始其回合之前。如果你的应用无法与传入工作协调关闭，请保持环境运行。






## 在断开连接后重新连接

连接事件用于报告状态。使用 `agent.session.environment.connected` 注册你的处理程序，并 `agent.session.environment.disconnected` 来观察连接。设置过程还可能发出 `agent.session.environment.pending` 或 `agent.session.environment.failed`。这些事件不会请求计算资源。请使用 `environment_connection` 必需操作来触发启动，并单独检查提供商健康状况。

轮次中途断开连接可能导致工具失败，即使该轮次最终完成。请检查工具结果和智能体的最终响应。断开连接不会通过 webhook 自动请求重新连接，也不会重新启动被终止的命令。后续输入可以请求重新连接。

API 会在输入时等待连接，最长可达五分钟。请为此等待配置客户端和代理的超时时间。如果超时，则提交失败。初始输入可能会异步失败并使会话处于 `failed`.

API 不会保证在进程崩溃后恢复挂起的输入。重启试前请检查请求或会话的结果。在原始请求仍在等待时不要重新提交。迟到的连接不会重放已超时的输入。

在替换计算环境中复用环境 ID 不会恢复文件。请使用提供商存储或快照来保留它们。

## 清理

停止接受新输入。与已在进行中的任何启动工作协调清理，避免留下仍在运行的计算资源。

[删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 并单独停止提供商的计算资源。删除会话既不会停止其环境，也不会发出删除 webhook。