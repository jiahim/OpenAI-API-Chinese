# Rate limits and spend with Terraform

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use this guide to manage an existing project rate limit and create a monthly spend alert. Rate limits constrain a project's model usage over time. Spend alerts notify your team when monthly usage reaches a threshold, but they don't stop API requests or enforce a spending cap.

After completing the main workflow, you will have a repeatable configuration that:

- Reads the rate-limit records available to an existing project.
- Manages the request and token limits for one model.
- Sends an email alert when the project's monthly spend reaches a threshold.

## Before you begin

Complete the [Terraform provider setup](https://developers.openai.com/api/docs/guides/terraform) and export an Admin API key as `OPENAI_ADMIN_KEY`. You also need:

- The ID of an existing project.
- At least one email address that should receive spend alerts.

Use a test project when evaluating the workflow. You will identify the rate-limit record for a text model in the next section. OpenAI creates the rate-limit records available to a project; Terraform updates those records rather than creating new ones.

## Discover project rate limits

Read the rate-limit records available to a project:

```terraform
data "openai_project_rate_limits" "current" {
  project_id = "proj_123"
}

output "project_rate_limits" {
  value = data.openai_project_rate_limits.current.rate_limits
}
```

The data source makes a read-only request:

- `project_id` selects the project to inspect.
- `rate_limits` contains one object for each available model rate limit, including its `id`, `model`, and applicable limit values.
- The output makes the records visible after `terraform plan` or `terraform apply`.

Use the record whose `model` matches the model you want to control. Copy its `id`; the next resource uses that value as `rate_limit_id`. Keep the ID as an explicit input to prevent a provider or API change from selecting a different record.

## Manage an existing rate limit

Manage the request and token limits for the selected text-model record:

```terraform
resource "openai_project_rate_limit" "application" {
  project_id                = "proj_123"
  rate_limit_id             = "rl-gpt-3.5-turbo"
  max_requests_per_1_minute = 500
  max_tokens_per_1_minute   = 200000
}
```

Each argument has a specific role:

- `project_id` identifies the project whose rate limit will change.
- `rate_limit_id` identifies an existing model rate-limit record. It isn't a model ID.
- `max_requests_per_1_minute` limits the number of requests the project can send for that model each minute.
- `max_tokens_per_1_minute` limits the number of tokens the project can process for that model each minute.

Set only the fields that apply to the selected record. Other record types can expose limits for images per minute, audio megabytes per minute, requests per day, or Batch input tokens per day. A configured value can't exceed the limit available to the organization and project.

Although the first Terraform plan shows this resource as an addition, the provider updates the existing rate-limit record and then stores it in Terraform state. Changing a configured limit sends another update.

Removing `openai_project_rate_limit` from the configuration removes the record
  from Terraform state, but it doesn't reset or delete the remote rate limit.
  Set the desired remote values before removing the resource if another workflow
  will manage the record.

## Configure a project spend alert

Create a monthly project spend alert:

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

The alert definition combines the spend condition and its notification channel:

- `project_id` limits the alert to spend from one project.
- `threshold_amount` is the monthly threshold in cents. `20000` represents USD 200.
- `currency` must be `USD`.
- `interval` must be `month`.
- `notification_channel_type` must be `email`.
- `notification_channel_recipients` must contain at least one recipient.
- `notification_channel_subject_prefix` is optional text added to alert email subjects.

Terraform creates the alert and stores its generated `alert_id`. Changing the threshold or notification fields updates the alert. Removing the resource deletes the remote alert.

Spend alerts are notifications, not hard limits. Define an incident or administrative response for each threshold, and use rate limits to constrain request volume independently.

## Configure an organization spend alert

Use an organization alert when the threshold should cover spend across the organization:

```terraform
resource "openai_organization_spend_alert" "monthly" {
  threshold_amount                = 100000
  currency                        = "USD"
  interval                        = "month"
  notification_channel_type       = "email"
  notification_channel_recipients = ["platform-alerts@example.com"]
}
```

This resource uses the same threshold units, interval, currency, and notification fields as a project alert. It doesn't take a `project_id` because it measures organization-wide spend. The example sends an email after monthly organization spend reaches USD 1,000.

You can manage project and organization alerts together. Use distinct thresholds and recipients when different teams own the response at each scope.

## Run the complete example

The focused examples use concrete values to explain each resource. The complete configuration replaces environment-specific values with variables and combines project rate-limit discovery, one managed rate limit, and one project spend alert.

Save the following configuration as `main.tf`:

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

Create `terraform.tfvars` with an existing project ID, the rate-limit record ID you discovered for a text model, approved limits, a threshold in cents, and the alert recipients:

```terraform
project_id    = "proj_123"
rate_limit_id = "rl-gpt-3.5-turbo"

max_requests_per_minute = 500
max_tokens_per_minute   = 200000

project_spend_threshold_cents = 20000
alert_recipients               = ["platform-alerts@example.com"]
```

Choose request and token values that don't exceed the limits currently available to the project. The `available_rate_limits` output in the plan shows the current records and values for comparison.

Initialize Terraform, then review and apply a saved plan:

```bash
terraform init
terraform fmt
terraform validate
terraform plan -out=tfplan
terraform show tfplan
terraform apply tfplan
```

The first plan should contain two resources to add. Terraform describes the rate-limit resource as an addition to state, but applying it updates the existing OpenAI rate-limit record. The other addition creates the project spend alert. After the apply, `terraform output` prints the available rate limits, the model associated with the managed record, and the alert ID.

Run `terraform plan` again to confirm that the configuration produces no further changes. If it shows drift, determine whether another administrator or automation changed the rate limit or spend alert before applying another update.