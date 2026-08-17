# Admin APIs

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Admin APIs let you automate organization management workflows such as user invitations, audit log review, project administration, API key management, spend limits and alerts, data retention, and rate limit operations. Use them for back-office automation, security workflows, and operational tooling that should run outside the dashboard.

For endpoint details, see the [Administration API reference](https://developers.openai.com/api/reference/administration/overview), including [Admin API keys](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/admin_api_keys), [Invites](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/invites), [Users](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/users), [Projects](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects), [Spend limits](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/spend_limit), and [Audit logs](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/audit_logs).

## Use an Admin API key with the SDK

To access these endpoints, [create an Admin API key](https://platform.openai.com/settings/organization/admin-keys). Admin API keys cannot be used for non-administration endpoints.

Support for Admin APIs was added in these SDK versions, which may require updating your SDK version:

- Node: `6.36.0`
- Python: `2.34.0`
- Go: `3.34.0`
- Ruby: `0.61.0`
- Java: `4.34.0`

Set `OPENAI_ADMIN_KEY`, then initialize the SDK for your language.

Set up the SDK with an Admin API key

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


## Restrict model access for projects

Use project model permissions to set an allowlist or denylist for a project. Set `mode` to `allow_list` to allow only the listed models, or set `mode` to `deny_list` to block the listed models while allowing other available models. Model IDs must be visible to the organization, including visible fine-tuned model snapshots.

Set a project model allowlist/denylist

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


## Set an organization spend limit

Use the [Spend Limits endpoint](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/spend_limit) to create or replace your organization's monthly hard spend limit. Set `threshold_amount` in cents. The following example sets a $100 monthly limit:

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

When tracked spend reaches a hard limit, affected API requests return a `429` error. For details, see the [spend limits guide](https://developers.openai.com/api/docs/guides/spend-limits).

## Manage spend limit alerts

Use project spend alerts to notify your team when project spend reaches a threshold. Threshold amounts are specified in cents.

Create a project spend limit alert

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


## Manage data retention

Use project data retention controls to override or inherit the organization's retention policy for a project. Set `retention_type` to `organization_default` to inherit the organization setting.

Set project data retention

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


## Invite a user by email

Use the Invites endpoint to send an organization invitation to an email address.

Invite a user by email

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


## Retrieve audit logs

Use the Audit Logs endpoint to list recent user actions and configuration changes for the organization.

Retrieve audit logs

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