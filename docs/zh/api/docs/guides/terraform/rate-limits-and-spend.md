# 使用 Terraform 管理速率限制与消费

> 完整文档索引请参阅 [llms.txt](/llms.txt)。Markdown 版本的文档页面可通过在页面 URL 末尾追加 `.md` 获取。

使用本指南来管理现有的项目速率限制并创建月度消费告警。速率限制用于约束项目随时间变化的模型用量。消费告警会在月度用量达到阈值时通知你的团队，但它们不会停止 API 请求，也不会强制设定消费上限。

完成主要的 工作流 后，你将得到一个可重复使用的配置，该配置：

- 读取现有项目可用的速率限制记录。
- 管理单个模型的请求和令牌限制。
- 当项目的月度支出达到阈值时发送邮件告警。

## 准备工作

完成 [Terraform 提供商设置](https://developers.openai.com/api/docs/guides/terraform) 并将一个管理 API 密钥导出为 `OPENAI_ADMIN_KEY`。你还需要：

- 现有项目的 ID。
- 用于接收消费告警的至少一个电子邮件地址。

在评估工作流时，请使用测试项目。你将在下一节中找到文本模型的速率限制记录。OpenAI会创建项目可用的速率限制记录；Terraform 会更新这些记录，而不是新建。

## 了解项目速率限制

读取项目可用的速率限制记录：

```terraform
data "openai_project_rate_limits" "current" {
  project_id = "proj_123"
}

output "project_rate_limits" {
  value = data.openai_project_rate_limits.current.rate_limits
}
```

数据源发起只读请求：

- `project_id` 选择要检查的项目。
- `rate_limits` 包含每个可用模型速率限制的一个对象,包括其 `id`, `model`,以及适用的限制值。
- 该输出会在 `terraform plan` 或 `terraform apply`.

使用其中 `model` 与你希望控制的模型匹配的记录。复制其 `id`；下一个资源将该值用作 `rate_limit_id`。请保留该 ID 作为显式输入，以避免提供方或 API 变更选择到其他记录。

## 管理现有的速率限制

管理所选文本模型记录的请求与令牌上限：

```terraform
resource "openai_project_rate_limit" "application" {
  project_id                = "proj_123"
  rate_limit_id             = "rl-gpt-3.5-turbo"
  max_requests_per_1_minute = 500
  max_tokens_per_1_minute   = 200000
}
```

每个参数都有特定的作用：

- `project_id` 标识其速率限制将要变更的项目。
- `rate_limit_id` 标识一个已存在的模型速率限制记录。它不是模型 ID。
- `max_requests_per_1_minute` 限制项目每分钟可针对该模型发送的请求数。
- `max_tokens_per_1_minute` 限制项目每分钟可针对该模型处理的令牌数。

仅设置适用于所选记录的字段。其他记录类型可能提供每分钟图像数、每分钟音频兆字节数、每天请求数或每天 Batch 输入 token 数的限制。已配置的值不能超过组织和项目可用的限制。

尽管首次 Terraform plan 会将该资源显示为新增，但提供程序会更新现有的速率限制记录，并将其存储在 Terraform 状态中。更改已配置的限制会再次触发更新。

从 `openai_project_rate_limit` 配置中移除该记录
  会将其从 Terraform 状态中移除，但不会重置或删除远程速率限制。
  如果另一个工作流将管理该记录，请在移除资源之前设置所需的远程值
  。

## 配置项目支出提醒

创建一个每月项目支出告警:

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

该告警定义将支出条件与其通知渠道结合在一起:

- `project_id` 限制告警仅从一个项目支出。
- `threshold_amount` 是以美分为单位的月度阈值。 `20000` 表示 200 美元。
- `currency` 必须为 `USD`.
- `interval` 必须为 `month`.
- `notification_channel_type` 必须为 `email`.
- `notification_channel_recipients` 必须至少包含一个收件人。
- `notification_channel_subject_prefix` 是添加到告警邮件主题的可选文本。

Terraform 创建该告警并存储其生成的 `alert_id`。修改阈值或通知字段会更新该告警。移除该资源会删除远程告警。

消费告警属于通知，而不是硬性限制。请为每个阈值定义事件响应或管理流程，并使用速率限制来独立约束请求量。

## 配置组织支出提醒

当阈值需要覆盖整个组织的支出时，请使用组织告警：

```terraform
resource "openai_organization_spend_alert" "monthly" {
  threshold_amount                = 100000
  currency                        = "USD"
  interval                        = "month"
  notification_channel_type       = "email"
  notification_channel_recipients = ["platform-alerts@example.com"]
}
```

该资源使用与项目告警相同的阈值单位、时间间隔、货币和通知字段。它不接受 `project_id` ，因为它衡量的是整个组织的支出。该示例会在每月组织支出达到 1,000 美元时发送一封邮件。

你可以一并管理项目和组织告警。当不同团队各自负责对应范围的响应时，请使用不同的阈值和收件人。

## 运行完整示例

聚焦示例使用具体值解释每个资源。完整配置会用变量替换与具体环境相关的值，并组合项目速率限制发现、一条托管速率限制以及一条项目支出告警。

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

创建 `terraform.tfvars` ，并使用现有项目 ID、你为文本模型发现的速率限制记录 ID、已批准的限额、以分为单位的阈值以及告警接收人：

```terraform
project_id    = "proj_123"
rate_limit_id = "rl-gpt-3.5-turbo"

max_requests_per_minute = 500
max_tokens_per_minute   = 200000

project_spend_threshold_cents = 20000
alert_recipients               = ["platform-alerts@example.com"]
```

选择不超过项目当前可用限制的请求和令牌值。该 `available_rate_limits` 计划中的输出会展示当前记录和值以便对比。

初始化 Terraform，然后查看并应用已保存的计划：

```bash
terraform init
terraform fmt
terraform validate
terraform plan -out=tfplan
terraform show tfplan
terraform apply tfplan
```

第一次计划应包含两个要添加的资源。Terraform 将速率限制资源描述为对状态的添加，但应用该资源会更新现有的 OpenAI 速率限制记录。另一个添加操作会创建项目支出告警。应用后， `terraform output` 会输出可用的速率限制、与托管记录关联的模型以及告警 ID。

运行 `terraform plan` 再次运行以确认该配置不再产生变更。如果显示了漂移，请先判断是否有其他管理员或自动化修改了速率限制或支出告警，然后再应用其他更新。