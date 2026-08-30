# 使用 Terraform 管理服务账号

> 完整的文档索引请参见 [llms.txt](/llms.txt)。可通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

OpenAI 服务账户是项目拥有的非人类身份。Terraform 可以创建该账户而不指定默认角色，定义一个最小权限的权限集合，并通过一个组分配该集合。请在 Terraform 之外，通过 Administration API 创建和管理服务账户 API 密钥。

本指南遵循典型的服务账户接入 工作流：

1. 创建一个服务账号，不要分配默认项目角色或 API 密钥。
2. 通过用户组为其分配自定义项目角色，仅授予工作负载所需的权限。
3. 创建一个限定范围的 API 密钥，并将其存储在你的密钥管理器中。

## 准备工作

完成 [Terraform provider 设置](https://developers.openai.com/api/docs/guides/terraform)，导出 Admin API 密钥为 `OPENAI_ADMIN_KEY`，并导出已有项目的 ID 为 `PROJECT_ID`.

在评估服务账号的创建、导入、更换和删除时，请使用测试组织。

## 创建不带默认角色的服务账号

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

将 `proj_123` 替换为将拥有该服务账号的现有项目的 ID。

该 provider 会创建服务账号身份，但不会生成 API 密钥，也不会分配默认的项目角色。Terraform 会将服务账号 ID 和其他非敏感元数据存储在状态中。在此阶段，该服务账号没有任何项目权限。

## 分配最小权限

为你的工作负载定义一个仅包含所需权限的自定义项目角色。创建一个群组，将服务账号加入该群组，然后把角色分配给这个群组。以下示例允许群组成员创建响应：

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

该 `openai_project_role` 资源定义了最小权限的权限集， `openai_group_user` 将服务账号加入该群组，并且 `openai_project_group_role` 将角色分配给该群组。加入该群组的每个服务账号都会继承同一个项目角色。请将 `api.responses.write` 替换为你的工作负载已批准使用的最小权限集。参见 [项目与访问权限](https://developers.openai.com/api/docs/guides/terraform/projects-and-access) 了解有关基于群组的项目访问权限的更多信息。

审阅并应用该配置：

```bash
terraform plan
terraform apply
```

当自定义项目角色 `member` 或 `owner` 已经能够提供你的工作负载所需的权限时，不要分配内置的
  角色。请将访问权限限制在
  已批准的权限集之内。

## 创建一个限定范围的 API 密钥

在应用 Terraform 配置后，通过以下链接创建一个 API 密钥： [创建项目服务账号 API 密钥](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/subresources/service_accounts/subresources/api_keys/methods/create) 端点。API 仅返回一次密钥的完整值，因此请在发起请求之前妥善保护响应文件：

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

选择工作负载所需的最窄作用域。API 密钥的作用域可以进一步限制服务账号的权限，但不能授予其已分配项目角色之外的权限。

将 `value` 传递给 `service-account-api-key.json` 到你已批准的密钥管理器 工作流，且不要将其打印出来。在密钥管理器存储并验证该密钥后，删除响应文件：

```bash
rm service-account-api-key.json
```

将 `service-account-api-key.json` 视为长期存在的密钥。不要将其提交到代码，也不要将密钥写入 Terraform 配置、通过 Terraform 输出公开，或作为 Terraform 变量传递。

该 [API 参考](https://developers.openai.com/api/reference/resources/admin/subresources/organization/subresources/projects/subresources/service_accounts/subresources/api_keys/methods/create) 其中包含响应结构及各语言示例。支持 [工作负载身份联合](https://developers.openai.com/api/docs/guides/workload-identity-federation) 的工作负载可以使用同一个服务账号和最小权限角色，而无需创建 API 密钥。

## 导入现有服务账户

你无需导入 Terraform 创建的服务账号。若要接管在 Terraform 外部创建的服务账号，请使用相同的项目 ID 和名称进行声明：

```terraform
resource "openai_project_service_account" "application" {
  project_id = "proj_123"
  name       = "example-application-development-service-account"
}
```

在运行普通的 apply 之前先导入已有的身份：

```bash
SERVICE_ACCOUNT_ID="<existing-service-account-id>"

terraform import \
  openai_project_service_account.application \
  "$PROJECT_ID/$SERVICE_ACCOUNT_ID"

terraform plan
```

导入后首次 plan 不应提议对该服务账号做任何更改。若提议替换为新建，请在 apply 之前确保所配置的名称和项目与现有账号一致。

导入不会恢复或存储 API 密钥，也不会更改服务账号现有的项目角色，更不会导入其组成员关系。请声明并导入现有的 `openai_project_role`, `openai_group`, `openai_group_user`，资源，以及 `openai_project_group_role` 资源，前提是你希望 Terraform 管理它们。工作负载仍会继续从你的密钥管理服务中读取任何现有密钥。

在应用资源声明之前先导入该服务账号。如果你先执行
  apply，Terraform 会创建一个新的服务账号，而不是接管现有
  的身份。

## 恢复或轮换凭据

完整的 API 密钥值仅在 API 密钥创建响应中可用。后续对该项目 API 密钥的获取将返回脱敏后的值，因此你无法恢复已丢失的密钥。

在不影响工作负载的情况下替换已丢失或正在轮换的凭据：

1. 将该替换项声明为一个新的 `openai_project_service_account` 资源，使用与旧账号不同的 Terraform 资源名称。
2. 应用配置以创建替换服务账号。
3. 将替换项添加到现有组中，使用 `openai_group_user` ，使其继承最小权限的项目角色。
4. 通过 Administration API 为该替换项创建一个 API 密钥，并使用你已批准的密钥管理器 工作流 存储该密钥。
5. 部署替换密钥,并验证使用替换账号的工作负载。
6. 移除旧的 `openai_project_service_account` 及其 `openai_group_user` 资源从 Terraform 配置中移除。保留替换服务账号仍在使用的角色、组以及组角色分配。
7. 审阅并应用删除旧服务账号及其组成员身份的方案，然后运行 `terraform plan` 并要求得到无操作 (no-op) 结果。

删除 `openai_project_service_account` 资源会删除远程服务账号。该变更需要明确复核，尤其是在旧凭据仍在处理流量时。

关于更广泛的状态采用与移除行为，请参阅 [导入与协调](https://developers.openai.com/api/docs/guides/terraform/import-and-reconcile).

## 运行完整示例

聚焦示例使用具体值来解释服务账号创建、角色分配以及 API 密钥创建。完整配置将项目特定的值和权限替换为变量，以便你可以在不同环境中复用。

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

创建 `terraform.tfvars` ，传入一个现有项目 ID、一个唯一的服务账号名称，以及最小范围的已批准项目权限：

```terraform
project_id           = "proj_123"
service_account_name = "example-application-development-service-account"

project_role_permissions = [
  "api.responses.write",
]
```

初始化 Terraform，然后审阅并应用已保存的 plan：

```bash
terraform init
terraform fmt
terraform validate
terraform plan -out=tfplan
terraform show tfplan
terraform apply tfplan
```

第一次 plan 应包含五个要新增的资源：服务账号、自定义项目角色、组、组成员资格以及组角色分配。再次运行 `terraform plan` 以确认该配置不会再产生任何变更。

在 Terraform 之外创建服务账号的 API 密钥：

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

将返回的 API 密钥值移至你的合规密钥管理器，然后删除 `service-account-api-key.json`。不要将该密钥存储在 Terraform 配置、状态或输出中。