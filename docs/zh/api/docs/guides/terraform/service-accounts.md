# 使用 Terraform 管理服务账号

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过向页面 URL 追加 `.md` 可获取文档页面的 Markdown 版本。

OpenAI 服务账号是由项目拥有的非人工身份。Terraform 可以在不分配默认角色的情况下创建该账号，定义最小权限捆绑，并通过组分配该捆绑。通过在 Terraform 外部通过 Administration API 创建和管理服务账号 API 密钥。

本指南遵循典型的服务账号入门的 工作流：

1. 创建一个无默认项目角色或 API 密钥的服务账户。
2. 通过组分配自定义项目角色，仅授予工作负载所需的权限。
3. 创建作用域 API 密钥，并将其存储在你的密钥管理器中。

## 开始之前

完成 [Terraform 提供程序设置](https://developers.openai.com/api/docs/guides/terraform)，导出管理员 API 密钥作为 `OPENAI_ADMIN_KEY`，并导出现有项目的 ID 作为 `PROJECT_ID`.

在评估服务账户的创建、导入、替换和删除时，请使用测试组织。

## 创建无默认角色的服务账号

使用 Terraform 创建服务账号：

```terraform
resource "openai_project_service_account" "application" {
  project_id = "proj_123"
  name       = "example-application-development-service-account"
}

output "service_account_id" {
  value = openai_project_service_account.application.service_account_id
}
```

将 `proj_123` 替换为将拥有服务账号的现有项目的 ID。

提供程序会创建服务账号身份，而不生成 API 密钥或分配默认项目角色。Terraform 将服务账号 ID 和其他非敏感元数据存储在状态中。在此阶段，服务账号没有任何项目权限。

## 分配最低权限

定义一个自定义项目角色，只包含工作负载所需的权限。创建一个组，将服务账号添加到该组中，并将该角色分配给该组。此示例允许组成员创建响应：

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

该 `openai_project_role` 资源定义了最小权限权限集， `openai_group_user` 将服务账号添加到组中，且 `openai_project_group_role` 将角色分配给该组。添加到该组的每个服务账号都继承相同的项目角色。将 `api.responses.write` 替换为你的工作负载批准的最小权限集。参见 [项目和访问](https://developers.openai.com/api/docs/guides/terraform/projects-and-access) 了解更多关于基于组的项目访问信息。

查看并应用配置：

```bash
terraform plan
terraform apply
```

不要将内置的 `member` 或 `owner` 角色分配，当自定义项目角色
  提供你的工作负载所需的权限时。保持访问权限仅限于
  已批准的权限集。

## 创建作用域受限的 API 密钥

应用 Terraform 配置后，通过以下方式创建API密钥： [创建项目服务账号API密钥](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/subresources/service_accounts/subresources/api_keys/methods/create) 端点。该API仅返回一次密钥的完整值，因此在发出请求前保护响应文件：

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

选择工作负载所需的最窄范围。API密钥范围可以进一步限制服务账号的权限，但不能授予超出其分配项目角色的权限。

将 `value` from `service-account-api-key.json` 传递到你已批准的密钥管理器工作流中，而不打印它。密钥管理器存储并验证密钥后，删除响应文件：

```bash
rm service-account-api-key.json
```

将 `service-account-api-key.json` 视为秘密，只要它存在就保持如此。不要提交它、将其写入 Terraform 配置、通过 Terraform 输出暴露它，或将其作为 Terraform 变量传递。

该 [API参考](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/subresources/service_accounts/subresources/api_keys/methods/create) 包括响应形状和特定语言的示例。支持 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation) 的工作负载可以使用相同的服务账号和最小权限角色，而无需创建API密钥。

## 导入现有服务账号

你无需导入 Terraform 创建的服务账号。若要采用在 Terraform 外部创建的服务账号，请使用相同的项目 ID 和名称进行声明：

```terraform
resource "openai_project_service_account" "application" {
  project_id = "proj_123"
  name       = "example-application-development-service-account"
}
```

在运行正常的 apply 之前导入现有身份：

```bash
SERVICE_ACCOUNT_ID="<existing-service-account-id>"

terraform import \
  openai_project_service_account.application \
  "$PROJECT_ID/$SERVICE_ACCOUNT_ID"

terraform plan
```

导入后的首次计划不应提议对服务账号进行任何更改。如果提议替换，请在应用前使配置的名称和项目与现有账号一致。

导入不会恢复或存储 API 密钥、更改服务账号现有的项目角色或导入其群组成员资格。如果 Terraform 应管理现有 `openai_project_role`, `openai_group`, `openai_group_user`，和 `openai_project_group_role` 资源，请声明并导入这些资源。工作负载将继续从你的密钥管理器中读取任何现有密钥。

在应用资源声明之前导入服务账号。如果你
  先执行 apply，Terraform 将创建另一个服务账号，而非采用
  现有身份。

## 恢复或轮换凭据

完整的API密钥值仅出现在API密钥创建响应中。之后的项目API密钥检索会返回脱敏值，因此你无法恢复丢失的密钥。

在不中断工作负载的情况下替换丢失或轮换的凭据：

1. 将替换账号声明为新的 `openai_project_service_account` 资源，并使用与旧账号不同的 Terraform 资源名称。
2. 应用配置以创建替换服务账号。
3. 将替换账号添加到现有组中，使用 `openai_group_user` 以便其继承最小权限项目角色。
4. 通过管理 API 为替换账号创建 API 密钥，并将该密钥存储在经批准的 secrets-manager 工作流 中。
5. 部署替换密钥，并使用替换账号验证工作负载。
6. 从 Terraform 配置中移除旧的 `openai_project_service_account` 及其 `openai_group_user` 资源。保留替换服务账号仍会使用的角色、组和组角色分配。
7. 审查并应用删除旧服务账号及其组成员关系的计划，然后运行 `terraform plan` 并要求结果为无操作。

删除 `openai_project_service_account` 资源会删除远程服务账户。请对该变更明确进行审查，尤其是在旧凭据仍在提供流量期间。

关于更广泛的状态采用和移除行为，请参阅 [导入与对账](https://developers.openai.com/api/docs/guides/terraform/import-and-reconcile).

## 运行完整示例

重点示例使用具体值来说明服务账号创建、角色分配和 API 密钥创建。完整配置将项目特定的值和权限替换为变量，以便你可以在不同环境中复用。

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

创建 `terraform.tfvars` ，使用现有的项目 ID、唯一的服务账号名称以及最小的一组已批准项目权限：

```terraform
project_id           = "proj_123"
service_account_name = "example-application-development-service-account"

project_role_permissions = [
  "api.responses.write",
]
```

初始化 Terraform，然后查看并应用已保存的计划：

```bash
terraform init
terraform fmt
terraform validate
terraform plan -out=tfplan
terraform show tfplan
terraform apply tfplan
```

第一个计划应包含五个要添加的资源：服务账号、其自定义项目角色、群组、群组成员资格和群组角色分配。运行 `terraform plan` 再次确认配置不会产生进一步更改。

在 Terraform 之外创建服务账号 API 密钥：

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

将返回的 API 密钥值移入你批准的机密管理器中，然后删除 `service-account-api-key.json`。不要将密钥存储在 Terraform 配置、状态或输出中。