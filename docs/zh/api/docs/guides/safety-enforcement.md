# 安全执行通知

> 完整文档索引请参见 [llms.txt](/llms.txt)。可在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

使用安全 Webhook 和 Safety Case Read API，将 OpenAI 的执法通知接入你团队的工作流。例如，当收到警告时，你的应用可以获取对应的案件详情、识别受影响的用户，并创建内部审核工单。

## 何时使用

使用此集成来：

- 将警告和停用通知路由至你的信任与安全、安全或支持团队。
- 将案件详情添加到调查工单或支持工单中。
- 通过你应用程序的安全-identifier 映射，将通知与用户关联。

本指南中的步骤使用警告来说明工作流。你可以使用相同的集成为停用通知。

## 工作原理

Safety webhook 会通知你的应用有通知被发出。Safety Case Read API 会提供该通知的详细信息。

| Event                        | Notice                                                       |
| ---------------------------- | ------------------------------------------------------------ |
| `safety.warning_issued`      | 针对你组织中安全标识符的警告。      |
| `safety.deactivation_issued` | 针对你组织中安全标识符的停用。 |

每个事件都包含一个案件 ID。请将其与 `GET /v1/safety/cases/{id}` 结合使用，以检索安全标识符、通知类型、案件创建时间戳以及可用的策略原因。

这些组织级别的通知与项目级别的 [misalignment 警报](https://developers.openai.com/api/docs/guides/safety-checks/misalignment-monitoring#receive-project-safety-alerts)。是分开的。检索案件不会更改或撤销相应的强制措施。API 返回的是案件元数据，而不是底层对话或完整的调查报告。

## 与你的应用集成

首先配置一个组织级 webhook 和一个用于案件查询的密钥。然后将通知连接到你的审核工作流。

### 1. 配置你的 webhook 和 API 密钥

为每位用户使用一个稳定的 [safety identifier](https://developers.openai.com/api/docs/guides/safety-best-practices#implement-safety-identifiers) ，并在你的应用中维护从该标识符到用户的映射关系。避免在标识符中包含个人信息。

打开你的 [organization webhook settings](https://platform.openai.com/settings/organization/webhooks) ，然后选择 **Create**。输入接收方的 HTTPS URL，并订阅 `safety.warning_issued` 和 `safety.deactivation_issued`。请妥善保存签名密钥，以便接收方能够验证传入事件。这些事件使用组织级端点，而非项目级端点。

你的账户需要 `api.webhooks.read` 和 `organization.read` 权限才能查看组织级 webhook，并需要 `api.webhooks.write` 和 `organization.write` 权限才能创建它们。详情请参见 [Permissions](https://developers.openai.com/api/docs/guides/rbac) 中的角色配置说明。

若要进行案件查询，请为同一组织配置一个带有 **Restricted** 权限的 API 密钥，并将 **Safety** 设置为 **阅读** (`api.safety.read`）。API 密钥用于大小写查找的身份验证；它与 webhook 签名密钥是分开的。

### 2. 接收并验证事件

警告通知具有以下结构。其中的 ID 为示例：

```json
{
  "id": "evt_example",
  "object": "event",
  "created_at": 1787659200,
  "type": "safety.warning_issued",
  "data": {
    "id": "C-example"
  }
}
```

在处理事件之前验证签名。保存已验证的事件以供处理，立即返回成功 `2xx` 响应，并在后台工作进程中获取该案件。有关 [签名验证](https://developers.openai.com/api/docs/guides/webhooks#verifying-webhook-signatures) 和 [确认、重试和重复投递](https://developers.openai.com/api/docs/guides/webhooks#handling-webhook-requests-on-a-server).

事件的 `id` 标识了 webhook 事件。其 `data.id` 标识了要获取的安全案件。

### 3. 获取案例

Set `OPENAI_API_KEY` to your API key. Replace `C-example` with `data.id` from the verified event:

```bash
curl "https://api.openai.com/v1/safety/cases/C-example" \
  -H "Authorization: Bearer ${OPENAI_API_KEY}"
```

A successful lookup returns HTTP `200` and a case object. For example:

```json
{
  "id": "C-example",
  "object": "safety.case",
  "created_at": 1787659100,
  "entity_identifier": "safety-id-example",
  "reason": "cyber_abuse",
  "notice": {
    "type": "warning"
  }
}
```

Use `entity_identifier` to find the affected user in your application. The `reason` can be `null`; continue processing the notice when no reason is available.

The case creation timestamp is not necessarily the event timestamp or the time of an individual request. See the [Safety Case API reference](https://developers.openai.com/api/reference/resources/safety/subresources/cases/methods/retrieve) for field definitions.

### 4. 创建审核工单

将案件 ID、通知类型、安全标识符、案件创建时间戳以及可用的策略原因添加到内部工单中。关联匹配的用户记录，以便你的团队能够借助其自有应用记录进行调查。如果找不到匹配的用户，请保留案件详情，并标记缺失的映射关系以供审核。

保证工单创建操作可安全重试。请遵循 [webhook 去重指南](https://developers.openai.com/api/docs/guides/webhooks#handling-webhook-requests-on-a-server) ，以确保重复送达不会产生重复工单。你自身后台处理的重试也应复用现有工单。

如果 智能体 协助进行分诊，应仅授予其访问所需记录的权限，并确保面向客户的操作仍遵循你现有的审批控制。

## 确认它正在工作

对于组织中真实的事件和可访问的用例，请检查以下内容：

1. 你的接收方验证签名并返回成功的确认响应。
2. 查询返回 HTTP `200`，并附带一个 case `id` ，与事件的 `data.id`.
3. 你的应用识别出预期用户，或标记缺失的映射。
4. 一张审核工单包含可用的案件详情。重新处理该事件不会创建额外的工单。

在实际收到通知之前，使用本地示例事件和模拟的 case 响应来测试你的处理逻辑。覆盖两种通知类型、各 `null` 种 reason、缺失的 user 映射以及重复投递。单独测试签名验证，包括对无效签名的拒绝；并在你的生产接收端保持启用签名验证。

本页中的示例 ID 不可用于检索真实 case。模拟测试仅用于验证你的处理逻辑，而非实际投递或 API 权限。请勿触发实际的 enforcement 来测试你的集成。仅未收到 enforcement 通知本身并不能说明集成已损坏。

## 故障排查

| 症状                                   | 排查项                                                                                            |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 签名验证失败              | 检查签名密钥，并按 Webhooks 指南中的说明保留原始请求体。           |
| 查询返回结果 `401`                      | 检查 API 密钥是否存在且有效。                                                             |
| 查询返回结果 `403`                      | 检查密钥是否具有 `api.safety.read` 权限。                                                 |
| 查询返回结果 `404`                      | 使用 `data.id`，而不是事件 ID。确认该案件属于该密钥所属的组织。                  |
| 查询返回 `429` 或临时性 `5xx` | 按退避策略和有限的重试策略进行重试。保留事件以便后续处理或调查。 |
| 工单被重复创建        | 确认工单创建在重复投递和 worker 重试时仍然安全。                   |

当已验证通知的案例查找失败时，不得静默丢弃该通知。应保留该通知以供重试或调查。