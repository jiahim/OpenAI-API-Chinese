# Model, tool, and data controls with Terraform

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use this guide to apply model, hosted-tool, and data-retention controls to an existing project. These controls determine what project workloads can use and which approved retention policy applies. They don't grant users or service accounts access to the project.

After completing the main workflow, you will have a repeatable configuration that:

- Limits the project to an approved set of models.
- Sets an explicit permission for every supported hosted tool.
- Applies the organization's default data-retention policy to the project.

## Before you begin

Complete the [Terraform provider setup](https://developers.openai.com/api/docs/guides/terraform) and export an Admin API key as `OPENAI_ADMIN_KEY`. You also need:

- The ID of an existing project.
- The IDs of models available to your organization.
- An organization with data-retention controls enabled if you plan to manage project retention.

Use a test project when evaluating the workflow. To disable a hosted tool for one project, the organization-level tool policy must already limit that tool to selected projects. A project can't disable a tool that the organization has enabled for every project.

## Restrict model access

`openai_project_model_permissions` applies either an allowlist or a list of denied models to one project. This example permits only `gpt-5.4-mini`:

```terraform
resource "openai_project_model_permissions" "application" {
  project_id = "proj_123"
  mode       = "allow_list"
  model_ids  = ["gpt-5.4-mini"]
}
```

Set `mode` to:

- `allow_list` to permit only the models in `model_ids`.
- `deny_list` to permit available models except those in `model_ids`.

Each model ID must be visible to the organization. This includes any fine-tuned model snapshots that you add to the policy. Terraform reconciles changes to the mode and model list during the next plan and apply.

## Configure hosted tools

`openai_project_hosted_tool_permissions` manages five project-level tool permissions. Set every field so the reviewed configuration describes the complete policy:

```terraform
resource "openai_project_hosted_tool_permissions" "application" {
  project_id               = "proj_123"
  file_search_enabled      = true
  web_search_enabled       = false
  image_generation_enabled = false
  mcp_enabled              = false
  code_interpreter_enabled = true
}
```

The fields control file search, web search, image generation, remote MCP servers, and Code Interpreter. Each organization's hosted-tool policy has three modes: allow all projects, deny all projects, or allow selected projects. Setting a field to `true` permits that tool for the project, subject to the organization's other eligibility and retention requirements. Setting a field to `false` removes the project from that tool's selected-project policy. If the organization currently allows the tool for all projects, setting the field to `false` fails. Change the organization's tool policy to allow selected projects before disabling the tool for an individual project.

Terraform refreshes all five values from OpenAI and reports dashboard changes as drift on the next plan.

## Configure data retention

`openai_project_data_retention` applies an approved retention type to one project. Inherit the organization's current policy unless the project has an approved override:

```terraform
resource "openai_project_data_retention" "application" {
  project_id = "proj_123"
  type       = "organization_default"
}
```

The provider also accepts `none`, `zero_data_retention`, `modified_abuse_monitoring`, `enhanced_zero_data_retention`, and `enhanced_modified_abuse_monitoring`. The available modes and permitted transitions depend on your organization's configuration and the project's data-residency region.

Review [Your data](https://developers.openai.com/api/docs/guides/your-data) and your organization's OpenAI agreement before selecting a project override.

### Manage the organization default

Use `openai_organization_data_retention` only when Terraform owns the existing organization-level setting:

```terraform
resource "openai_organization_data_retention" "default" {
  type = "zero_data_retention"
}
```

This resource changes an existing organization setting; it doesn't enroll an organization in a data-retention program. Some transitions require support or aren't available between retention tiers.

Removing `openai_project_hosted_tool_permissions` or
  `openai_project_data_retention` from configuration removes the resource from
  Terraform state but leaves the remote settings unchanged. Removing
  `openai_project_model_permissions` deletes the project's model-permission
  configuration. Review destroy plans with these different behaviors in mind.

## Detect changes outside Terraform

Run a plan to refresh remote state and compare it with the reviewed configuration:

```bash
terraform plan -detailed-exitcode
```

Exit code `0` means no changes, `2` means the plan contains changes, and `1` means Terraform encountered an error. Investigate unexpected changes before applying. Don't automatically overwrite an emergency administrative change without first understanding its purpose.

## Run the complete example

The following example manages all three project controls together. Create `main.tf`:

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
  type        = string
  description = "ID of the existing OpenAI project."
}

variable "model_permission_mode" {
  type        = string
  description = "Whether model_ids is an allowlist or denylist."
  default     = "allow_list"

  validation {
    condition     = contains(["allow_list", "deny_list"], var.model_permission_mode)
    error_message = "The model permission mode must be allow_list or deny_list."
  }
}

variable "model_ids" {
  type        = list(string)
  description = "Model IDs included in the project model policy."
}

variable "hosted_tools" {
  type = object({
    file_search      = bool
    web_search       = bool
    image_generation = bool
    mcp              = bool
    code_interpreter = bool
  })
  description = "Hosted tools enabled for the project."
}

variable "project_data_retention_type" {
  type        = string
  description = "Approved data-retention type for the project."

  validation {
    condition = contains([
      "organization_default",
      "none",
      "zero_data_retention",
      "modified_abuse_monitoring",
      "enhanced_zero_data_retention",
      "enhanced_modified_abuse_monitoring",
    ], var.project_data_retention_type)
    error_message = "Provide a supported project data-retention type."
  }
}

resource "openai_project_model_permissions" "application" {
  project_id = var.project_id
  mode       = var.model_permission_mode
  model_ids  = var.model_ids
}

resource "openai_project_hosted_tool_permissions" "application" {
  project_id               = var.project_id
  file_search_enabled      = var.hosted_tools.file_search
  web_search_enabled       = var.hosted_tools.web_search
  image_generation_enabled = var.hosted_tools.image_generation
  mcp_enabled              = var.hosted_tools.mcp
  code_interpreter_enabled = var.hosted_tools.code_interpreter
}

resource "openai_project_data_retention" "application" {
  project_id = var.project_id
  type       = var.project_data_retention_type
}

output "controlled_project_id" {
  value = var.project_id
}

output "model_permission_mode" {
  value = openai_project_model_permissions.application.mode
}

output "project_data_retention_type" {
  value = openai_project_data_retention.application.type
}
```

Create `terraform.tfvars` with an existing project ID, visible model IDs, the hosted-tool policy, and an approved retention type:

```terraform
project_id            = "proj_123"
model_permission_mode = "allow_list"
model_ids             = ["gpt-5.4-mini"]

hosted_tools = {
  file_search      = true
  web_search       = true
  image_generation = true
  mcp              = true
  code_interpreter = true
}

project_data_retention_type = "organization_default"
```

The example enables all hosted tools so it can run when the organization policy enables tools for every project. Change a value to `false` only after the corresponding organization-level policy uses selected-project access. Confirm that the model ID and retention type are available to your organization before applying.

Initialize Terraform, then review and apply a saved plan:

```bash
terraform init
terraform fmt
terraform validate
terraform plan -out=tfplan
terraform show tfplan
terraform apply tfplan
```

The first plan should contain three resources to add. For hosted-tool and data-retention controls, an addition means Terraform starts managing an existing singleton project setting; it doesn't create a separate remote object. Model permissions create or update the project's model-permission configuration.

Run `terraform plan` again to confirm that the configuration produces no further changes. If it shows drift, determine whether another administrator or automation changed a project control before applying another update.