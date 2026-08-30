# 关于 GPT Actions 的生产环境注意事项

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。可通过在页面 URL 末尾附加 `.md` 来获取文档页面的 Markdown 版本。

## Rate limits

考虑在你暴露的 API 端点上实施速率限制。ChatGPT 会遵循 429 响应码，并在短时间内收到一定数量的 429 或 500 响应后动态降低向你 action 发送请求的频率。

## 超时

在 actions 体验过程中进行 API 调用时，如果超过以下阈值，将会发生超时：

- API 调用往返耗时 45 秒

## 使用 TLS 和 HTTPS

发往你 action 的所有流量必须在 443 端口上使用 TLS 1.2 或更高版本，并附带有效的公共证书。

## IP egress ranges

ChatGPT 将从其中一个 [已发布的 IP 段](https://developers.openai.com/api/docs/guides/ip-addresses)。调用你的 action。你可能希望显式地将这些 IP 地址加入白名单。

## 多种身份验证模式

在定义 action 时，你可以将单一认证类型（OAuth 或 API key）与不需要认证的 endpoints 混合使用。

你可以在我们的 [actions 认证页面](https://developers.openai.com/api/docs/actions/authentication).

## Open API 规范限制

请牢记你的 OpenAPI 规范中存在以下限制，且这些限制可能随时变更：

- API 规范中每个 API 端点描述/摘要字段最多 300 个字符
- API 规范中每个 API 参数描述字段最多 700 个字符

## 其他限制

在使用操作构建时，需要注意以下几个限制：

- 不支持自定义请求头
- 除 Google、Microsoft 和 Adobe 的 OAuth 域名外，OAuth 流程中使用的所有域名都必须与主端点所使用的域名一致
- 请求和响应负载每个不得超过 100,000 个字符
- 请求在 45 秒后超时
- 请求和响应只能包含文本（不能包含图片或视频）

## Consequential flag

在 OpenAPI 规范中，你现可将某些端点设置为 "consequential"，如下所示：

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

一个典型的“重要操作”示例是代用户预订酒店房间并完成支付。

- 如果该 `x-openai-isConsequential` 字段为 `true`，ChatGPT 会将该操作视为“运行前必须始终提示用户确认”，并且不显示“始终允许”按钮（这两项功能是 GPT 设计的，旨在让开发者和用户对操作有更多控制权）。
- 如果该 `x-openai-isConsequential` 字段为 `false`，ChatGPT 会显示“始终允许”按钮。
- 如果该字段不存在，ChatGPT 会将所有 GET 操作默认为 `false` ，将其余所有操作默认为 `true`

## 提供示例的最佳实践

以下是编写 schema 中的 GPT 指令和描述，以及设计你的 API 响应时可以遵循的一些最佳实践：

1. 你的描述不应在用户未请求该动作所属服务类别时，鼓励 GPT 使用该动作。

   _错误示例_:

   > 每当用户提到任何类型的任务时，询问他们是否希望使用 TODO 动作向其待办列表中添加内容。

   _正确示例_:

   > TODO 列表可以添加、删除和查看用户的 TODO。

2. 你的描述不应为 GPT 规定使用该动作的具体触发条件。ChatGPT 旨在在适当时自动使用你的动作。

   _错误示例_:

   > 当用户提到某项任务时，回复"是否需要我将其添加到你的 TODO 列表中？回复'是'以继续。"

   _正确示例_:

   > [无需提供说明]

3. API 的动作响应应返回原始数据，而非自然语言回复，除非确有需要。GPT 会使用返回的数据自行生成自然语言回复。

   _错误示例_:

   > 我已找到你的待办列表！你有 2 项待办：买菜和遛狗。如果需要，我可以为你添加更多待办！

   _正确示例_:

   > \{ "todos": [ "get groceries", "walk the dog" ] }

## GPT Action 数据的使用方式

GPT Actions 可将 ChatGPT 连接到外部应用。如果用户使用了某个 GPT 的自定义 Action，ChatGPT 可能会将其对话中的部分内容发送到该 Action 的端点。

如果你有疑问或遇到其他限制，可以在 [OpenAI 开发者论坛](https://community.openai.com).