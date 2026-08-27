# 管理员 APIs

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获得。

管理员API可让你自动化组织管理工作流，例如用户邀请、审计日志审查、项目管理、API密钥管理、支出限额和警报、数据保留以及速率限制操作。可将它们用于后台自动化、安全工作流以及在仪表盘之外运行的操作工具。

有关端点详细信息，请参阅 [管理员API参考](https://developers.openai.com/api/reference/administration/overview)，包括 [管理员API密钥](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys), [邀请](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites), [用户](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/users), [项目](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects), [支出限额](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/spend_limit)，以及 [审计日志](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/audit_logs).

## 使用具有 API 密钥的管理员权限，配合 SDK

要访问这些端点， [创建一个管理员 API 密钥](https://platform.openai.com/settings/organization/admin-keys)。管理员 API 密钥不能用于非管理端点。

这些 API 版本中添加了对管理员 SDK 的支持，这可能需要更新你的 SDK 版本：

- Node： `6.36.0`
- Python： `2.34.0`
- Go： `3.34.0`
- Ruby： `0.61.0`
- Java： `4.34.0`

设置 `OPENAI_ADMIN_KEY`，然后为你的语言初始化 SDK。

使用管理 API 密钥配置 SDK

```javascript
import OpenAI from "openai";

const client = new OpenAI({
  adminAPIKey: process.env.OPENAI_ADMIN_KEY,
});
```

```python
import os
from openai import OpenAI

client = OpenAI(
    admin_api_key=os.environ["OPENAI_ADMIN_KEY"],
)
```

```go
package main

import (
	"os"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
)

func main() {
	client := openai.NewClient(
		option.WithAdminAPIKey(os.Getenv("OPENAI_ADMIN_KEY")),
	)

	_ = client
}
```

```java
import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;

OpenAIClient client =
    OpenAIOkHttpClient.builder().adminApiKey(System.getenv("OPENAI_ADMIN_KEY")).build();
```

```ruby
require "openai"

openai = OpenAI::Client.new(
  admin_api_key: ENV.fetch("OPENAI_ADMIN_KEY")
)
```


## 限制项目的模型访问权限

使用项目模型权限为项目设置允许列表或拒绝列表。设置 `mode` 为 `allow_list` 以仅允许列出的模型，或设置 `mode` 为 `deny_list` 以阻止列出的模型，同时允许其他可用模型。模型 ID 必须对组织可见，包括可见的微调模型快照。

设置项目模型允许列表/拒绝列表

```javascript
const modelPermissions =
  await client.admin.organization.projects.modelPermissions.update("proj_abc", {
    mode: "allow_list",
    model_ids: ["gpt-4.1", "o3"],
  });

console.log(modelPermissions.mode);
```

```python
model_permissions = client.admin.organization.projects.model_permissions.update(
    "proj_abc",
    mode="allow_list",
    model_ids=["gpt-4.1", "o3"],
)

print(model_permissions.mode)
```

```go
ctx := context.Background()

modelPermissions, err := client.Admin.Organization.Projects.ModelPermissions.Update(
	ctx,
	"proj_abc",
	openai.AdminOrganizationProjectModelPermissionUpdateParams{
		Mode:     openai.AdminOrganizationProjectModelPermissionUpdateParamsModeAllowList,
		ModelIDs: []string{"gpt-4.1", "o3"},
	},
)
if err != nil {
	panic(err)
}

println(modelPermissions.Mode)
```

```java
import com.openai.models.admin.organization.projects.modelpermissions.ModelPermissionUpdateParams;
import com.openai.models.admin.organization.projects.modelpermissions.ProjectModelPermissions;
import java.util.List;

ProjectModelPermissions modelPermissions =
    client
        .admin()
        .organization()
        .projects()
        .modelPermissions()
        .update(
            "proj_abc",
            ModelPermissionUpdateParams.builder()
                .mode(ModelPermissionUpdateParams.Mode.ALLOW_LIST)
                .modelIds(List.of("gpt-4.1", "o3"))
                .build());

System.out.println(modelPermissions.mode());
```

```ruby
model_permissions = openai.admin.organization.projects.model_permissions.update(
  "proj_abc",
  mode: :allow_list,
  model_ids: ["gpt-4.1", "o3"]
)

puts(model_permissions.mode)
```


## 设置组织支出限额

使用 [Spend Limits endpoint](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/spend_limit) 来创建或替换你组织的月度硬性支出限制。设置 `threshold_amount` 以分为单位。以下示例设置了每月 $100 的限制：

```bash
curl -X POST https://api.openai.com/v1/organization/spend_limit \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "threshold_amount": 10000,
    "currency": "USD",
    "interval": "month"
  }'
```

当追踪的支出达到硬性限制时，受影响的 API 请求将返回 `429` 错误。有关详细信息，请参阅 [spend limits guide](https://developers.openai.com/api/docs/guides/spend-limits).

## 管理支出限制提醒

使用项目支出提醒，当项目支出达到阈值时通知你的团队。阈值金额以美分指定。

创建项目支出限额提醒

```javascript
const spendAlert = await client.admin.organization.projects.spendAlerts.create(
  "proj_abc",
  {
    currency: "USD",
    interval: "month",
    notification_channel: {
      recipients: ["billing@example.com"],
      type: "email",
      subject_prefix: "[OpenAI spend]",
    },
    threshold_amount: 50000,
  }
);

console.log(spendAlert.id);
```

```python
spend_alert = client.admin.organization.projects.spend_alerts.create(
    "proj_abc",
    currency="USD",
    interval="month",
    notification_channel={
        "recipients": ["billing@example.com"],
        "type": "email",
        "subject_prefix": "[OpenAI spend]",
    },
    threshold_amount=50000,
)

print(spend_alert.id)
```

```go
ctx := context.Background()

spendAlert, err := client.Admin.Organization.Projects.SpendAlerts.New(
	ctx,
	"proj_abc",
	openai.AdminOrganizationProjectSpendAlertNewParams{
		Currency: openai.AdminOrganizationProjectSpendAlertNewParamsCurrencyUsd,
		Interval: openai.AdminOrganizationProjectSpendAlertNewParamsIntervalMonth,
		NotificationChannel: openai.AdminOrganizationProjectSpendAlertNewParamsNotificationChannel{
			Recipients:    []string{"billing@example.com"},
			Type:          "email",
			SubjectPrefix: openai.String("[OpenAI spend]"),
		},
		ThresholdAmount: 50000,
	},
)
if err != nil {
	panic(err)
}

println(spendAlert.ID)
```

```java
import com.openai.models.admin.organization.projects.spendalerts.ProjectSpendAlert;
import com.openai.models.admin.organization.projects.spendalerts.SpendAlertCreateParams;

ProjectSpendAlert spendAlert =
    client
        .admin()
        .organization()
        .projects()
        .spendAlerts()
        .create(
            "proj_abc",
            SpendAlertCreateParams.builder()
                .currency(SpendAlertCreateParams.Currency.USD)
                .interval(SpendAlertCreateParams.Interval.MONTH)
                .notificationChannel(
                    SpendAlertCreateParams.NotificationChannel.builder()
                        .addRecipient("billing@example.com")
                        .subjectPrefix("[OpenAI spend]")
                        .build())
                .thresholdAmount(50000L)
                .build());

System.out.println(spendAlert.id());
```

```ruby
spend_alert = openai.admin.organization.projects.spend_alerts.create(
  "proj_abc",
  currency: :USD,
  interval: :month,
  notification_channel: {
    recipients: ["billing@example.com"],
    type: :email,
    subject_prefix: "[OpenAI spend]"
  },
  threshold_amount: 50_000
)

puts(spend_alert.id)
```


## 管理数据保留

使用项目数据保留控制来覆盖或继承组织的项目保留策略。设置 `retention_type` 为 `organization_default` 以继承组织设置。

设置项目数据保留

```javascript
const dataRetention =
  await client.admin.organization.projects.dataRetention.update("proj_abc", {
    retention_type: "organization_default",
  });

console.log(dataRetention.type);
```

```python
data_retention = client.admin.organization.projects.data_retention.update(
    "proj_abc",
    retention_type="organization_default",
)

print(data_retention.type)
```

```go
ctx := context.Background()

dataRetention, err := client.Admin.Organization.Projects.DataRetention.Update(
	ctx,
	"proj_abc",
	openai.AdminOrganizationProjectDataRetentionUpdateParams{
		RetentionType: openai.AdminOrganizationProjectDataRetentionUpdateParamsRetentionTypeOrganizationDefault,
	},
)
if err != nil {
	panic(err)
}

println(dataRetention.Type)
```

```java
import com.openai.models.admin.organization.projects.dataretention.DataRetentionUpdateParams;
import com.openai.models.admin.organization.projects.dataretention.ProjectDataRetention;

ProjectDataRetention dataRetention =
    client
        .admin()
        .organization()
        .projects()
        .dataRetention()
        .update(
            "proj_abc",
            DataRetentionUpdateParams.builder()
                .retentionType(DataRetentionUpdateParams.RetentionType.ORGANIZATION_DEFAULT)
                .build());

System.out.println(dataRetention.type());
```

```ruby
data_retention = openai.admin.organization.projects.data_retention.update(
  "proj_abc",
  retention_type: :organization_default
)

puts(data_retention.type)
```


## 通过电子邮件邀请用户

使用 Invites 端点向电子邮件地址发送组织邀请。

通过电子邮件邀请用户

```javascript
const invite = await client.admin.organization.invites.create({
  email: "user@example.com",
  role: "reader",
});

console.log(invite.id);
```

```python
invite = client.admin.organization.invites.create(
    email="user@example.com",
    role="reader",
)

print(invite.id)
```

```go
ctx := context.Background()

invite, err := client.Admin.Organization.Invites.New(ctx, openai.AdminOrganizationInviteNewParams{
	Email: "user@example.com",
	Role:  openai.AdminOrganizationInviteNewParamsRoleReader,
})
if err != nil {
	panic(err)
}

println(invite.ID)
```

```java
import com.openai.models.admin.organization.invites.Invite;
import com.openai.models.admin.organization.invites.InviteCreateParams;

Invite invite =
    client
        .admin()
        .organization()
        .invites()
        .create(
            InviteCreateParams.builder()
                .email("user@example.com")
                .role(InviteCreateParams.Role.READER)
                .build());

System.out.println(invite.id());
```

```ruby
invite = openai.admin.organization.invites.create(
  email: "user@example.com",
  role: :reader
)

puts(invite.id)
```


## 检索审计日志

使用 Audit Logs 端点列出组织的近期用户操作和配置更改。

检索审计日志

```javascript
const auditLogs = await client.admin.organization.auditLogs.list({
  limit: 10,
});

console.log(auditLogs.data);
```

```python
audit_logs = client.admin.organization.audit_logs.list(limit=10)

for audit_log in audit_logs.data:
    print(audit_log.id)
```

```go
ctx := context.Background()

auditLogs, err := client.Admin.Organization.AuditLogs.List(ctx, openai.AdminOrganizationAuditLogListParams{
	Limit: openai.Int(10),
})
if err != nil {
	panic(err)
}

for _, auditLog := range auditLogs.Data {
	println(auditLog.ID)
}
```

```java
import com.openai.models.admin.organization.auditlogs.AuditLogListParams;

var page =
    client
        .admin()
        .organization()
        .auditLogs()
        .list(AuditLogListParams.builder().limit(10L).build());

page.data().forEach(auditLog -> System.out.println(auditLog.id()));
```

```ruby
audit_logs = openai.admin.organization.audit_logs.list(limit: 10)

(audit_logs.data || []).each do |audit_log|
  puts(audit_log.id)
end
```