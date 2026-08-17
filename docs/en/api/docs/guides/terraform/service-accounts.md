# Manage service accounts with Terraform

> For the complete documentation index, see [llms.txt](/llms.txt). Markdown versions of documentation pages are available by appending `.md` to the page URL.

An OpenAI service account is a nonhuman identity owned by a project. Terraform can create the account without a default role, define a least-privilege permission bundle, and assign that bundle through a group. Create and manage service-account API keys outside Terraform through the Administration API.

This guide follows a typical service-account onboarding workflow:

1. Create a service account without a default project role or API key.
2. Assign a custom project role through a group, granting only the permissions the workload needs.
3. Create a scoped API key and store it in your secrets manager.

## Before you begin

Complete the [Terraform provider setup](https://developers.openai.com/api/docs/guides/terraform), export an Admin API key as `OPENAI_ADMIN_KEY`, and export the existing project's ID as `PROJECT_ID`.

Use a test organization when evaluating service-account creation, import, replacement, and deletion.

## Create a service account without a default role

Create the service account with Terraform:

```terraform
resource "openai_project_service_account" "application" {
  project_id = "proj_123"
  name       = "example-application-development-service-account"
}

output "service_account_id" {
  value = openai_project_service_account.application.service_account_id
}
```

Replace `proj_123` with the ID of the existing project that will own the service account.

The provider creates the service-account identity without generating an API key or assigning a default project role. Terraform stores the service-account ID and other nonsensitive metadata in state. At this stage, the service account has no project permissions.

## Assign least-privilege permissions

Define a custom project role with only the permissions the workload requires. Create a group, add the service account to it, and assign the role to the group. This example allows group members to create responses:

```terraform
resource "openai_project_role" "application" {
  project_id  = openai_project_service_account.application.project_id
  role_name   = "Application response writer"
  description = "Allows the application to create responses"
  permissions = ["api.responses.write"]
}

resource "openai_group" "application_access" {
  name = "example-application-development-access"
}

resource "openai_group_user" "application" {
  group_id = openai_group.application_access.group_id
  user_id  = openai_project_service_account.application.id
}

resource "openai_project_group_role" "application_access" {
  project_id = openai_project_service_account.application.project_id
  group_id   = openai_group.application_access.group_id
  role_id    = openai_project_role.application.role_id
}
```

The `openai_project_role` resource defines the least-privilege permission bundle, `openai_group_user` adds the service account to the group, and `openai_project_group_role` assigns the role to that group. Every service account added to the group inherits the same project role. Replace `api.responses.write` with the smallest set of permissions approved for your workload. See [Projects and access](https://developers.openai.com/api/docs/guides/terraform/projects-and-access) for more information about group-based project access.

Review and apply the configuration:

```bash
terraform plan
terraform apply
```

Don't assign the built-in `member` or `owner` role when a custom project role
  provides the permissions your workload needs. Keep access limited to the
  approved permission bundle.

## Create a scoped API key

After applying the Terraform configuration, create an API key through the [Create project service account API key](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/subresources/service_accounts/subresources/api_keys/methods/create) endpoint. The API returns the key's full value only once, so protect the response file before making the request:

```bash
SERVICE_ACCOUNT_ID="$(terraform output -raw service_account_id)"
umask 077

curl -X POST \
  "https://api.openai.com/v1/organization/projects/$PROJECT_ID/service_accounts/$SERVICE_ACCOUNT_ID/api_keys" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production App",
    "scopes": ["api.responses.write"]
  }' \
  --output service-account-api-key.json
```

Choose the narrowest scopes the workload needs. API-key scopes can further restrict the service account's permissions, but they can't grant permissions outside its assigned project role.

Pass the `value` from `service-account-api-key.json` to your approved secrets-manager workflow without printing it. After your secrets manager stores and verifies the secret, remove the response file:

```bash
rm service-account-api-key.json
```

Treat `service-account-api-key.json` as a secret for as long as it exists. Don't commit it, write the key to Terraform configuration, expose it through a Terraform output, or pass it as a Terraform variable.

The [API reference](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/subresources/service_accounts/subresources/api_keys/methods/create) includes the response shape and language-specific examples. Workloads that support [workload identity federation](https://developers.openai.com/api/docs/guides/workload-identity-federation) can use the same service account and least-privilege role without creating an API key.

## Import an existing service account

You don't need to import a service account that Terraform created. To adopt a service account created outside Terraform, declare it with the same project ID and name:

```terraform
resource "openai_project_service_account" "application" {
  project_id = "proj_123"
  name       = "example-application-development-service-account"
}
```

Import the existing identity before running a normal apply:

```bash
SERVICE_ACCOUNT_ID="<existing-service-account-id>"

terraform import \
  openai_project_service_account.application \
  "$PROJECT_ID/$SERVICE_ACCOUNT_ID"

terraform plan
```

The first plan after import should propose no changes to the service account. If it proposes replacement, make the configured name and project match the existing account before applying.

Import doesn't recover or store an API key, change the service account's existing project role, or import its group membership. Declare and import the existing `openai_project_role`, `openai_group`, `openai_group_user`, and `openai_project_group_role` resources if Terraform should manage them. The workload continues to read any existing secret from your secrets manager.

Import the service account before applying the resource declaration. If you
  apply first, Terraform creates a different service account instead of adopting
  the existing identity.

## Recover or rotate credentials

The full API-key value is available only in the API-key create response. Later project API-key retrieval returns a redacted value, so you can't recover a lost key.

Replace a lost or rotating credential without interrupting the workload:

1. Declare the replacement as a new `openai_project_service_account` resource, using a different Terraform resource name from the old account.
2. Apply the configuration to create the replacement service account.
3. Add the replacement to the existing group with `openai_group_user` so it inherits the least-privilege project role.
4. Create an API key for the replacement through the Administration API and store the key with your approved secrets-manager workflow.
5. Deploy the replacement key and verify the workload with the replacement account.
6. Remove the old `openai_project_service_account` and its `openai_group_user` resource from the Terraform configuration. Keep the role, group, and group role assignment that the replacement service account still uses.
7. Review and apply the plan that deletes the old service account and its group membership, then run `terraform plan` and require a no-op result.

Deleting an `openai_project_service_account` resource deletes the remote service account. Require explicit review for that change, especially while the old credential is still serving traffic.

For broader state adoption and removal behavior, see [Import and reconciliation](https://developers.openai.com/api/docs/guides/terraform/import-and-reconcile).

## Run the complete example

The focused examples use concrete values to explain service-account creation, role assignment, and API-key creation. The complete configuration replaces project-specific values and permissions with variables so you can reuse it across environments.

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
  type        = string
  description = "ID of the existing OpenAI project."
}

variable "service_account_name" {
  type        = string
  description = "Name of the application service account."
}

variable "project_role_permissions" {
  type        = list(string)
  description = "Least-privilege project permissions for the application."

  validation {
    condition     = length(var.project_role_permissions) > 0
    error_message = "Provide at least one approved project permission."
  }
}

resource "openai_project_service_account" "application" {
  project_id = var.project_id
  name       = var.service_account_name
}

resource "openai_project_role" "application" {
  project_id  = var.project_id
  role_name   = "Application API access"
  description = "Least-privilege permissions approved for the application"
  permissions = var.project_role_permissions
}

resource "openai_group" "application_access" {
  name = "${var.service_account_name}-access"
}

resource "openai_group_user" "application" {
  group_id = openai_group.application_access.group_id
  user_id  = openai_project_service_account.application.id
}

resource "openai_project_group_role" "application_access" {
  project_id = var.project_id
  group_id   = openai_group.application_access.group_id
  role_id    = openai_project_role.application.role_id
}

output "project_id" {
  value = var.project_id
}

output "service_account_id" {
  value = openai_project_service_account.application.service_account_id
}

output "group_id" {
  value = openai_group.application_access.group_id
}

output "project_role_id" {
  value = openai_project_role.application.role_id
}
```

Create `terraform.tfvars` with an existing project ID, a unique service-account name, and the smallest set of approved project permissions:

```terraform
project_id           = "proj_123"
service_account_name = "example-application-development-service-account"

project_role_permissions = [
  "api.responses.write",
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

The first plan should contain five resources to add: the service account, its custom project role, the group, the group membership, and the group role assignment. Run `terraform plan` again to confirm that the configuration produces no further changes.

Create the service-account API key outside Terraform:

```bash
PROJECT_ID="$(terraform output -raw project_id)"
SERVICE_ACCOUNT_ID="$(terraform output -raw service_account_id)"
umask 077

curl -X POST \
  "https://api.openai.com/v1/organization/projects/$PROJECT_ID/service_accounts/$SERVICE_ACCOUNT_ID/api_keys" \
  -H "Authorization: Bearer $OPENAI_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production App",
    "scopes": ["api.responses.write"]
  }' \
  --output service-account-api-key.json
```

Move the returned API-key value into your approved secrets manager, then delete `service-account-api-key.json`. Don't store the key in Terraform configuration, state, or outputs.