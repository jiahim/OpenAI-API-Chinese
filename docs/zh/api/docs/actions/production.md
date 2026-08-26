# GPT Actions 生产注意事项

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

## 速率限制

考虑对你公开的 API 端点实现速率限制。ChatGPT 会遵循 429 响应码，并在短时间内收到一定数量的 429 或 500 后，动态地退避对你的操作发送请求。

## 超时

在操作体验期间进行API调用时，如果超出以下阈值，将发生超时：

- API 调用的 45 秒往返时间

## 使用 TLS 和 HTTPS

指向你的 action 的所有流量都必须使用 TLS 1.2 或更高版本，并通过端口 443 携带有效的公共证书。

## IP 出口范围

ChatGPT 将从以下 [已发布的 IP 范围](https://developers.openai.com/api/docs/guides/ip-addresses)。中调用你的操作。你可能希望明确将这些 IP 地址加入白名单。

## 多种身份验证方案

定义操作时，你可以混合使用单一认证类型（OAuth 或 API 密钥）以及不需要认证的端点。

你可以在我们的 [操作认证页面](https://developers.openai.com/api/docs/actions/authentication).

## Open API 规范限制

在你的 OpenAPI 规范中请记住以下限制，这些限制可能会发生变化：

- API 规范中每个 API 端点描述/摘要字段最多 300 个字符
- API 规范中每个 API 参数描述字段最多 700 个字符

## 其他限制

使用操作构建时，有几个限制需要注意：

- 不支持自定义标头
- 除 Google、Microsoft 和 Adobe 的 OAuth 域外，OAuth 流程中使用的所有域必须与主要端点使用的域相同
- 请求和响应负载各自必须少于 100,000 个字符
- 请求在 45 秒后超时
- 请求和响应只能包含文本（不支持图像或视频）

## 后果标志

在 OpenAPI 规范中，你现在可以将某些端点设置为“有后果的”，如下所示：

```yaml
paths:
  /todo:
    get:
      operationId: getTODOs
      description: Fetches items in a TODO list from the API.
      security: []
    post:
      operationId: updateTODOs
      description: Mutates the TODO list.
      x-openai-isConsequential: true
```

一个有后果的操作的好例子是代表用户预订酒店房间并为其付费。

- 如果 `x-openai-isConsequential` 字段为 `true`，ChatGPT 会将操作视为“运行前必须始终提示用户确认”，并且不显示“始终允许”按钮（这两者都是 GPT 的设计特性，旨在让构建者和用户对操作有更多控制）。
- 如果 `x-openai-isConsequential` 字段为 `false`，ChatGPT 会显示“始终允许”按钮。
- 如果该字段不存在，ChatGPT 默认所有 GET 操作为 `false` ，所有其他操作为 `true`

## 提供示例的最佳实践

在编写 GPT 指令和 schema 中的描述，以及设计你的 API 响应时，请遵循以下最佳实践：

1. 你的描述不应鼓励 GPT 在用户未请求你所提供服务的特定类别时使用该操作。

   _不佳示例_:

   > 每当用户提到任何类型的任务时，询问他们是否想使用 TODO 操作向待办列表添加内容。

   _良好示例_:

   > TODO 列表可以添加、删除和查看用户的待办事项。

2. 你的描述不应为 GPT 使用操作规定特定触发条件。ChatGPT 被设计为在适当时自动使用你的操作。

   _不佳示例_:

   > 当用户提到任务时，回复“您希望我将其添加到您的 TODO 列表中吗？请回复‘yes’以继续。”

   _良好示例_:

   > [此处无需说明]

3. 除非必要，否则来自 API 的操作响应应返回原始数据，而不是自然语言响应。GPT 将使用返回的数据提供自己的自然语言响应。

   _不佳示例_:

   > 我找到了你的待办列表！你有 2 个待办事项：购买杂货和遛狗。如果你愿意，我可以添加更多待办事项！

   _良好示例_:

   > \{ "todos": [ "get groceries", "walk the dog" ] }

## GPT 操作数据的使用方式

GPT 操作将 ChatGPT 连接到外部应用。如果用户与 GPT 的自定义操作交互，ChatGPT 可能会将对话的某些部分发送到该操作的端点。

如果你有疑问或遇到其他限制，可以加入 [OpenAI 开发者论坛](https://community.openai.com).