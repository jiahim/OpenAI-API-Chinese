# Terraform provider

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

The official [OpenAI Terraform provider](https://github.com/openai/terraform-provider-openai) lets you manage OpenAI organization resources with infrastructure as code. The provider uses the [Administration API](https://developers.openai.com/api/reference/administration/overview) to manage projects, users, groups, roles, service accounts, certificates, rate limits, spend alerts, and related project settings.

This guide creates an OpenAI project. Continue to the use-case guides for project access, service accounts, operational limits, project controls, and imports.

## Before you begin

You need:

- [Terraform](https://developer.hashicorp.com/terraform/install) 1.0 or later. The import examples require Terraform 1.5 or later.
- An OpenAI organization with permission to create an [Admin API key](https://platform.openai.com/settings/organization/admin-keys).

Administration API endpoints require Admin API keys, which don't work with non-administration OpenAI API endpoints. Store the key in an environment variable or a secrets manager. Don't commit it to your Terraform configuration or source control.

## Configure the provider

Create a new directory and add a `main.tf` file with the following configuration:

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

resource "openai_project" "example" {
  name = "terraform-managed"
}

output "project_id" {
  value = openai_project.example.project_id
}
```

The version constraint allows provider version 1.0.0 and later. Review the [provider releases](https://github.com/openai/terraform-provider-openai/releases) before upgrading.

Set your Admin API key in the environment:

```bash
export OPENAI_ADMIN_KEY="<your-admin-api-key>"
```

The provider reads `OPENAI_ADMIN_KEY` by default. You can also set `OPENAI_ORG_ID` and `OPENAI_PROJECT_ID` to send the `OpenAI-Organization` and `OpenAI-Project` headers with API requests. When these optional variables aren't set, OpenAI resolves the organization and project from the API key. Set them when you want to explicitly identify which organization or project your Terraform configuration manages. See the [provider configuration reference](https://registry.terraform.io/providers/openai/openai/latest/docs) for all available arguments.

## Initialize and apply

Initialize the working directory, then format and check the configuration:

```bash
terraform init
terraform fmt
terraform validate
```

Terraform downloads the provider and creates `.terraform.lock.hcl`. Commit the lock file to source control so future runs select the same provider version. Run `terraform init -upgrade` to select the latest provider version allowed by the constraint.

Review the changes Terraform will make:

```bash
terraform plan
```

The plan should show one `openai_project` resource to add. Apply the configuration only after you have reviewed the plan:

```bash
terraform apply
```

Confirm the apply when prompted. Terraform creates the project and prints its ID from the `project_id` output.

## Choose a use-case guide

| Guide                                                                         | Use it to                                                                |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [Projects and access](https://developers.openai.com/api/docs/guides/terraform/projects-and-access)         | Create projects and configure role-based and group-based access.         |
| [Service accounts](https://developers.openai.com/api/docs/guides/terraform/service-accounts)               | Create service accounts for workload identity or API-key authentication. |
| [Rate limits and spend](https://developers.openai.com/api/docs/guides/terraform/rate-limits-and-spend)     | Reconcile existing rate limits and configure spend alerts.               |
| [Model, tool, and data controls](https://developers.openai.com/api/docs/guides/terraform/project-controls) | Configure model access, hosted tools, and data retention.                |
| [Import and reconciliation](https://developers.openai.com/api/docs/guides/terraform/import-and-reconcile)  | Adopt existing resources and detect drift.                               |

For individual arguments and import formats, use the [provider resource and data source reference](https://registry.terraform.io/providers/openai/openai/latest/docs).