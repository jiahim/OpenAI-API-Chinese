# 安全执行通知

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 后附加 `.md` 即可获取文档页面的 Markdown 版本。

使用安全 webhooks 以及 Safety Case Read API，将 OpenAI 的执法通知接入你团队的工作流。例如，当收到警告时，你的应用可以获取该案件详情、识别受影响的用户，并创建一个内部审查工单。

## 何时使用

使用此集成可以：

- 将警告和停用通知路由至你的信任与安全团队或支持团队。
- 将案例信息添加到调查工单或支持工单中。
- 通过你应用的安全标识符映射，将通知与用户关联。

本指南中的步骤使用一个警告来说明工作流。你可以使用相同的集成来处理停用通知。

## 工作原理

[安全 Webhook](https://developers.openai.com/api/reference/resources/webhooks#safety.warning_issued) 通知你的应用已发出通知。

| Event                        | Notice                                                       |
| ---------------------------- | ------------------------------------------------------------ |
| `safety.warning_issued`      | 针对你组织中安全标识符的警告。      |
| `safety.deactivation_issued` | 针对你组织中安全标识符的停用通知。 |

每个事件都包含一个案件 ID。将其与 `GET /v1/safety/cases/{id}` 结合使用，以检索安全标识符、通知类型、案件创建时间戳以及可用的策略原因。

这些组织级别的通知与项目级别的 [失准预警](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring#receive-project-safety-alerts)。检索案件不会更改或撤销该强制措施。

## 与你的应用集成

首先配置一个组织级别的 webhook 和一个用于案件查询的密钥，然后将通知连接到你的审阅工作流。

### 配置你的 webhook 并接收事件

为每位用户使用一个稳定的 [safety identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) ，并在你的应用中维护从该标识符到用户的映射关系。避免在标识符中包含个人信息。

在你的 [组织 Webhook 设置](https://platform.openai.com/settings/organization/webhooks) 中创建一个组织级别的 Webhook 端点，并订阅 `safety.warning_issued` 以及 `safety.deactivation_issued`.

警告通知的结构如下：

```json
{
  "id": "evt_example",
  "object": "event",
  "created_at": 1787659200,
  "type": "safety.warning_issued",
  "data": {
    "id": "C-abc123"
  }
}
```

有关通用的 Webhook 最佳实践，请参阅 [Webhook 指南](https://developers.openai.com/api/docs/guides/webhooks).

事件的 `id` 用于标识该 Webhook 事件。其 `data.id` 用于标识要检索的安全事件。

### Retrieve the case

对于案件查询，请使用同一组织的 API 密钥进行配置，该密钥具有 **Restricted** 权限，并将 Safety **设置为** Read **权限。** (`api.safety.read`).

通过 Safety Case Read API 查询案件元数据：

```bash
curl "https://api.openai.com/v1/safety/cases/C-abc123" \
  -H "Authorization: Bearer ${OPENAI_API_KEY}"
```

成功查询返回 HTTP `200` 以及一个案件对象。例如：

```json
{
  "id": "C-abc123",
  "object": "safety.case",
  "created_at": 1787659100,
  "entity_identifier": "entity_identifier",
  "reason": "cyber_abuse",
  "notice": {
    "type": "warning"
  }
}
```

该 `entity_identifier` 代表受影响的安全标识符。案件创建时间戳可用于协助调查。请参阅 [Safety Case API 参考](https://developers.openai.com/api/reference/resources/safety/subresources/cases/methods/retrieve) 以了解字段定义。

### 连接到你的工作流

使用 webhooks 接收通知，然后使用 case metadata 以编程方式将这些通知路由到你现有的调查或支持系统中。

## 故障排查

| 症状                                   | 检查项                                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 签名验证失败              | 检查签名密钥,并按照 Webhooks 指南保留原始请求体。           |
| 查询返回 `401`                      | 检查 API 密钥是否存在且有效。                                                             |
| 查询返回 `403`                      | 检查密钥是否具有 `api.safety.read` 权限。                                                 |
| 查询返回 `404`                      | 使用 `data.id`,而不是事件 ID。检查该案件是否属于该密钥对应的组织。                  |
| 查询返回 `429` 或临时性 `5xx` | 使用退避策略和有限的重试策略进行重试。保留事件以便后续处理或调查。 |