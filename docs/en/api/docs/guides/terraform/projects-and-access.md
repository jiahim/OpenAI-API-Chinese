# Manage projects and access with Terraform

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

Use this guide to create an OpenAI project and establish reusable access controls. You will define what identities can do with a project role, collect identities in an organization group, and connect the group to the project.

After completing the main workflow, you will have a repeatable configuration that:

- Creates an OpenAI project for an application.
- Defines a least-privilege project role.
- Creates an organization group for identities that need access.
- Grants the group access to the project through the role.
- Adds an existing organization user to the group.

## Before you begin

Complete the [Terraform provider setup](https://developers.openai.com/api/docs/guides/terraform) and export an Admin API key as `OPENAI_ADMIN_KEY`. You also need the ID of an existing organization user and the permission identifiers approved for the application. Use a test organization when evaluating the workflow.

Destroying an `openai_project` archives the project instead of permanently deleting it. You can't restore an archived project.

## Create the project boundary

Create a project for the application:

```terraform
resource "openai_project" "application" {
  name = "example-application-development"
}
```

The project creates the boundary for the application's API usage, service accounts, rate limits, spend alerts, and project settings. Terraform makes the generated ID available as `openai_project.application.project_id`. Project-level resources can reference that value, so Terraform creates the project before them.

This focused example uses a concrete name. The complete example later replaces it with a variable so you can reuse the configuration across environments.

## Define project permissions

Create a project role with the permissions approved for the application:

```terraform
resource "openai_project_role" "application" {
  project_id  = openai_project.application.project_id
  role_name   = "Application API access"
  description = "Permissions approved for this application"
  permissions = ["api.webhooks.read"]
}
```

The `openai_project_role` resource defines what an identity can do inside the project. This example grants permission to read webhook configuration. Replace `api.webhooks.read` with the permission identifiers approved for your application, and start with only the permissions it needs.

Changing `permissions` updates the role. Run `terraform plan` to review every added or removed permission before applying the change.

## Create or reuse a group

Create an organization group when Terraform should own its lifecycle:

```terraform
resource "openai_group" "application_access" {
  name = "example-application-development-access"
}
```

Groups exist at the organization level, and you can reuse them across projects. A name ending in `-access` communicates that membership grants access rather than merely describing a team.

If another system owns an existing group, read it instead:

```terraform
data "openai_group" "application_access" {
  group_id = "group_123"
}
```

The data source reads the group without making this configuration responsible for its lifecycle. You can read SCIM-managed groups, but keep membership changes in the identity system that owns them.

## Grant the group project access

Connect the group to the custom role inside the project:

```terraform
resource "openai_project_group_role" "application_access" {
  project_id = openai_project.application.project_id
  group_id   = openai_group.application_access.group_id
  role_id    = openai_project_role.application.role_id
}
```

This example uses the Terraform-managed group. If you reused an existing group through the data source, replace the `group_id` expression with `data.openai_group.application_access.group_id`.

The assignment connects three objects:

- `project_id` identifies where the group receives access.
- `group_id` identifies which collection of identities receives access.
- `role_id` identifies which permissions the group receives.

Group members inherit the custom role in this project. Adding a role or a group alone doesn't grant access; the assignment is the link between them.

## Add users and other identities

Add an identity to a Terraform-managed organization group with `openai_group_user`:

```terraform
resource "openai_group_user" "application_developer" {
  group_id = openai_group.application_access.group_id
  user_id  = "user_123"
}
```

The `user_id` can identify an existing organization user or service account. To add a service account, use `openai_project_service_account.application.id` as the `user_id`. See [Service accounts](https://developers.openai.com/api/docs/guides/terraform/service-accounts) for group-based service-account access, authentication, and credential-lifecycle requirements.

Use direct role assignments when group-based access isn't appropriate:

```terraform
resource "openai_project_user_role" "application_developer" {
  project_id = openai_project.application.project_id
  user_id    = "user_123"
  role_id    = openai_project_role.application.role_id
}
```

For organization-wide permissions, create an organization role and assign it directly or through a group:

```terraform
variable "organization_role_permissions" {
  type = list(string)
}

resource "openai_role" "platform_operator" {
  role_name   = "Platform operator"
  description = "Organization permissions for the platform team"
  permissions = var.organization_role_permissions
}

resource "openai_user_role" "platform_operator" {
  user_id = "user_123"
  role_id = openai_role.platform_operator.role_id
}
```

Set `organization_role_permissions` to the approved organization-level permission identifiers. Keep organization permissions separate from project permissions so each assignment has the narrowest required scope.

## Inspect current assignments

Read the organization and project roles assigned to an identity before changing access:

```terraform
data "openai_user_roles" "current" {
  user_id = "user_123"
}

data "openai_project_user_roles" "current" {
  project_id = openai_project.application.project_id
  user_id    = "user_123"
}

output "organization_roles" {
  value = data.openai_user_roles.current.roles
}

output "project_roles" {
  value = data.openai_project_user_roles.current.roles
}
```

Data sources report current assignments but don't make Terraform responsible for them.

## Remove assignments

When Terraform already manages an assignment, removing its resource block makes the next plan propose deleting the remote assignment. Review the plan and verify that another path still grants any required access.

For a pre-existing assignment, first declare the matching resource and import it using the documented composite ID. Confirm that the first plan is a no-op before removing it from configuration and applying the deletion.

Terraform can remove only assignments recorded in its state. To remove an
  existing default assignment, first import it into the corresponding Terraform
  resource. Then remove that resource from your configuration and apply the
  resulting destroy plan. If your organization doesn't allow this
  import-and-destroy workflow, remove the assignment through an approved
  dashboard or Administration API process.

See [Import and reconciliation](https://developers.openai.com/api/docs/guides/terraform/import-and-reconcile) for import formats and a safe adoption sequence.

## Run the complete example

The focused examples use concrete values to make each relationship clear. The complete configuration replaces repeated, environment-specific values with variables so you can reuse it without changing the resource definitions.

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

variable "project_name" {
  type = string
}

variable "project_role_permissions" {
  type = list(string)
}

variable "user_id" {
  type = string
}

resource "openai_project" "application" {
  name = var.project_name
}

resource "openai_project_role" "application" {
  project_id  = openai_project.application.project_id
  role_name   = "Application API access"
  description = "Permissions approved for this application"
  permissions = var.project_role_permissions
}

resource "openai_group" "application_access" {
  name = "${var.project_name}-access"
}

resource "openai_project_group_role" "application_access" {
  project_id = openai_project.application.project_id
  group_id   = openai_group.application_access.group_id
  role_id    = openai_project_role.application.role_id
}

resource "openai_group_user" "application_developer" {
  group_id = openai_group.application_access.group_id
  user_id  = var.user_id
}

output "project_id" {
  value = openai_project.application.project_id
}

output "group_id" {
  value = openai_group.application_access.group_id
}

output "project_role_id" {
  value = openai_project_role.application.role_id
}
```

Create `terraform.tfvars` with a unique project name, an existing organization user ID, and the approved permissions:

```terraform
project_name = "example-application-development"
user_id      = "user_123"

project_role_permissions = [
  "api.webhooks.read",
]
```

Initialize Terraform, then review and apply a saved plan:

```bash
terraform init
terraform fmt
terraform validate
terraform plan -out=tfplan
terraform show tfplan
terraform apply tfplan
```

The first plan should contain five resources to add. After the apply, the user inherits the custom project role through the group, and `terraform output` prints the project, group, and project-role IDs. Run `terraform plan` again to confirm that the configuration produces no further changes.

To add more human users, repeat the group membership pattern with a unique Terraform resource name for each user. To configure a nonhuman identity, see [Service accounts](https://developers.openai.com/api/docs/guides/terraform/service-accounts). Use [Model, tool, and data controls](https://developers.openai.com/api/docs/guides/terraform/project-controls) and [Rate limits and spend](https://developers.openai.com/api/docs/guides/terraform/rate-limits-and-spend) to add project guardrails.