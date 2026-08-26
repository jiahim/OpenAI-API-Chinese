# 使用 Terraform 管理速率限制和支出

> 如需完整的文档索引，请参阅 [llms.txt](/llms.txt). 文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

使用本指南来管理现有项目的速率限制并创建每月支出提醒。速率限制约束项目在一段时间内的模型使用量。支出提醒会在每月使用量达到阈值时通知你的团队，但不会停止API请求或强制实施支出上限。

完成主要工作流后，你将获得一个可重复的配置，该配置：

- 读取现有项目可用的速率限制记录。
- 管理一个模型的请求和令牌限制。
- 当项目的月度支出达到阈值时，发送电子邮件警报。

## 开始之前

完成 [Terraform provider 设置](https://developers.openai.com/api/docs/guides/terraform) 并将管理员 API 密钥导出为 `OPENAI_ADMIN_KEY`。你还需要：

- 现有项目的 ID。
- 至少一个应接收支出提醒的电子邮件地址。

在评估工作流时，使用一个测试项目。你将在下一节中识别文本模型的速率限制记录。OpenAI创建可供项目使用的速率限制记录；Terraform 会更新这些记录，而不是创建新记录。

## 了解项目速率限制

读取项目中可用的速率限制记录：

```terraform
data "openai_project_rate_limits" "current" {
  project_id = "proj_123"
}

output "project_rate_limits" {
  value = data.openai_project_rate_limits.current.rate_limits
}
```

数据源发出只读请求：

- `project_id` 选择要检查的项目。
- `rate_limits` 为每个可用的模型速率限制包含一个对象，包括其 `id`, `model`，以及适用的限制值。
- 输出使记录在 `terraform plan` 或 `terraform apply`.

使用记录，其 `model` 与你想要控制的模型匹配。复制其 `id`；下一个资源将使用该值作为 `rate_limit_id`。将 ID 保留为显式输入，以防止提供商或 API 变更选择不同的记录。

## 管理现有速率限制

管理所选文本模型记录的请求和令牌限制：

```terraform
resource "openai_project_rate_limit" "application" {
  project_id                = "proj_123"
  rate_limit_id             = "rl-gpt-3.5-turbo"
  max_requests_per_1_minute = 500
  max_tokens_per_1_minute   = 200000
}
```

每个参数都有特定的作用：

- `project_id` 标识速率限制将要变更的项目。
- `rate_limit_id` 标识一条现有的模型速率限制记录。它不是模型 ID。
- `max_requests_per_1_minute` 限制项目每分钟可针对该模型发送的请求数量。
- `max_tokens_per_1_minute` 限制项目每分钟可针对该模型处理的令牌数量。

仅设置适用于所选记录的字段。其他记录类型可能针对每分钟图片数、每分钟音频兆字节数、每日请求数或每日 Batch 输入令牌数暴露限制。配置的值不能超过组织和项目可用的限制。

尽管第一个 Terraform 计划将此资源显示为新增，但提供程序会更新现有的速率限制记录，然后将其存储在 Terraform 状态中。更改配置的限制会发送另一次更新。

从配置中移除 `openai_project_rate_limit` 会从 Terraform 状态中删除该记录
  ，但不会重置或删除远程速率限制。
  如果在移除资源前需要由另一个工作流
  管理该记录，请先设置所需的远程值。

## 配置项目支出提醒

创建每月项目支出提醒：

```terraform
resource "openai_project_spend_alert" "monthly" {
  project_id                          = "proj_123"
  threshold_amount                    = 20000
  currency                            = "USD"
  interval                            = "month"
  notification_channel_type           = "email"
  notification_channel_recipients     = ["platform-alerts@example.com"]
  notification_channel_subject_prefix = "OpenAI project spend"
}
```

提醒定义结合了支出条件及其通知渠道：

- `project_id` 将警报限制为仅限单个项目的支出。
- `threshold_amount` 是以美分计的月度阈值。 `20000` 代表 200 美元。
- `currency` 必须为 `USD`.
- `interval` 必须为 `month`.
- `notification_channel_type` 必须为 `email`.
- `notification_channel_recipients` 必须至少包含一个收件人。
- `notification_channel_subject_prefix` 是添加到警报邮件主题中的可选文本。

Terraform 会创建告警并存储其生成的 `alert_id`。更改阈值或通知字段会更新告警。删除资源会删除远程告警。

支出告警是通知，不是硬性限制。为每个阈值定义事件或管理响应，并独立使用速率限制来约束请求量。

## 配置组织支出警报

当阈值需要覆盖整个组织的支出时，请使用组织警报：

```terraform
resource "openai_organization_spend_alert" "monthly" {
  threshold_amount                = 100000
  currency                        = "USD"
  interval                        = "month"
  notification_channel_type       = "email"
  notification_channel_recipients = ["platform-alerts@example.com"]
}
```

此资源使用与项目警报相同的阈值单位、间隔、货币和通知字段。它不采用 `project_id` ，因为它衡量的是组织范围的支出。示例在组织月度支出达到 1000 美元后发送电子邮件。

你可以同时管理项目警报和组织警报。当不同团队各自负责相应范围内的响应时，使用不同的阈值和收件人。

## 运行完整示例

聚焦示例使用具体值解释每个资源。完整配置用变量替换特定环境的值，并整合项目速率限制发现、一个托管速率限制和一个项目支出警报。

将以下配置保存为 `main.tf`:

```terraform
terraform {
  required_version = ">= 1.0"

  required_providers {
    openai = {
      source  = "openai/openai"
      version = ">= 1.0.0"
    }
  }
}

provider "openai" {}

variable "project_id" {
  type = string
}

variable "rate_limit_id" {
  type        = string
  description = "Existing rate-limit record for the text model to manage."
}

variable "max_requests_per_minute" {
  type = number
}

variable "max_tokens_per_minute" {
  type = number
}

variable "project_spend_threshold_cents" {
  type        = number
  description = "Monthly project spend threshold in cents."

  validation {
    condition     = var.project_spend_threshold_cents > 0
    error_message = "The project spend threshold must be greater than zero."
  }
}

variable "alert_recipients" {
  type = list(string)

  validation {
    condition     = length(var.alert_recipients) > 0
    error_message = "Provide at least one spend-alert recipient."
  }
}

data "openai_project_rate_limits" "current" {
  project_id = var.project_id
}

resource "openai_project_rate_limit" "application" {
  project_id                = var.project_id
  rate_limit_id             = var.rate_limit_id
  max_requests_per_1_minute = var.max_requests_per_minute
  max_tokens_per_1_minute   = var.max_tokens_per_minute
}

resource "openai_project_spend_alert" "monthly" {
  project_id                          = var.project_id
  threshold_amount                    = var.project_spend_threshold_cents
  currency                            = "USD"
  interval                            = "month"
  notification_channel_type           = "email"
  notification_channel_recipients     = var.alert_recipients
  notification_channel_subject_prefix = "OpenAI project spend"
}

output "available_rate_limits" {
  value = data.openai_project_rate_limits.current.rate_limits
}

output "managed_rate_limit_model" {
  value = openai_project_rate_limit.application.model
}

output "project_spend_alert_id" {
  value = openai_project_spend_alert.monthly.alert_id
}
```

创建 `terraform.tfvars` ，使用现有项目 ID、你为文本模型发现的速率限制记录 ID、批准的限额、以美分为单位的阈值以及警报收件人：

```terraform
project_id    = "proj_123"
rate_limit_id = "rl-gpt-3.5-turbo"

max_requests_per_minute = 500
max_tokens_per_minute   = 200000

project_spend_threshold_cents = 20000
alert_recipients               = ["platform-alerts@example.com"]
```

选择不超过项目当前可用限额的请求和令牌值。 `available_rate_limits` 计划中的输出显示当前记录和值以供比较。

初始化 Terraform，然后审查并应用已保存的计划：

```bash
terraform init
terraform fmt
terraform validate
terraform plan -out=tfplan
terraform show tfplan
terraform apply tfplan
```

第一个计划应包含两个要添加的资源。Terraform 将速率限制资源描述为状态的新增项，但应用它会更新现有的 OpenAI 速率限制记录。另一个新增项创建项目支出警报。应用后， `terraform output` 打印可用的速率限制、与托管记录关联的模型以及警报 ID。

运行 `terraform plan` 再次确认配置不再产生进一步更改。如果显示漂移，请在应用另一次更新前确定是否有其他管理员或自动化更改了速率限制或支出警报。