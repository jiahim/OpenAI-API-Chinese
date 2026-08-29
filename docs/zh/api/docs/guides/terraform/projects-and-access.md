# 使用 Terraform 管理项目和访问权限

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 获取。

使用本指南创建 OpenAI 项目并建立可复用的访问控制。你将定义项目角色对身份的权限，将身份归集到组织群组中，并把该群组关联到项目。

完成主要的 工作流 后，你将得到一个可重复使用的配置，它能够：

- 为应用创建一个 OpenAI 项目。
- 定义一个最小权限的项目角色。
- 为需要访问权限的身份创建一个组织组。
- 通过角色授予该组对项目的访问权限。
- 将现有组织用户添加到该组中。

## 开始之前

完成 [Terraform provider 配置](https://developers.openai.com/api/docs/guides/terraform) 并导出一个 Admin API 密钥作为 `OPENAI_ADMIN_KEY`。你还需要现有组织用户的 ID 以及应用程序已批准的权限标识符。在评估工作流时请使用测试组织。

销毁一个 `openai_project` 会归档项目，而不是永久删除它。你无法恢复已归档的项目。

## 创建项目边界

为应用程序创建一个项目：

```terraform
resource "openai_project" "application" {
  name = "example-application-development"
}
```

该项目为应用程序的 API 使用、服务账户、速率限制、支出提醒和项目设置划定了边界。Terraform 将生成的 ID 以以下形式提供 `openai_project.application.project_id`。项目级资源可以引用该值，因此 Terraform 会先创建项目，再创建这些资源。

这个聚焦示例使用一个具体的名称。稍后的完整示例会将其替换为变量，以便在多个环境中复用该配置。

## 定义项目权限

为应用创建一个项目角色，并授予已批准的权限：

```terraform
resource "openai_project_role" "application" {
  project_id  = openai_project.application.project_id
  role_name   = "Application API access"
  description = "Permissions approved for this application"
  permissions = ["api.webhooks.read"]
}
```

该 `openai_project_role` resource 用于定义身份在项目内可执行的操作。本示例授予读取 webhook 配置的权限。请将 `api.webhooks.read` 替换为你的应用已批准的权限标识符，并仅从应用所需的权限开始授予。

更改 `permissions` 会更新该角色。运行 `terraform plan` 以在应用更改之前查看每个新增或移除的权限。

## 创建或复用组

在 Terraform 应该负责组织组的生命周期时创建一个组织组：

```terraform
resource "openai_group" "application_access" {
  name = "example-application-development-access"
}
```

组织组存在于组织级别，你可以在多个项目中复用它们。以 `-access` 结尾的名称表明成员资格授予的是访问权限，而不仅仅是描述一个团队。

如果另一个系统负责现有的组，则改为读取它：

```terraform
data "openai_group" "application_access" {
  group_id = "group_123"
}
```

数据源会读取该组，而不会让此配置负责其生命周期。你可以读取由 SCIM 管理的组，但请将成员资格变更保留在拥有该组的身份系统中。

## 授予该群组项目访问权限

在项目中将该组连接到自定义角色：

```terraform
resource "openai_project_group_role" "application_access" {
  project_id = openai_project.application.project_id
  group_id   = openai_group.application_access.group_id
  role_id    = openai_project_role.application.role_id
}
```

本示例使用由 Terraform 管理的组。如果你通过 data source 复用了已有的组，请将 `group_id` 表达式替换为 `data.openai_group.application_access.group_id`.

该赋关联了三个对象：

- `project_id` 标识该组获得访问权限的位置。
- `group_id` 标识哪些身份集合获得访问权限。
- `role_id` 标识该组获得哪些权限。

群组成员会继承该项目中的自定义角色。单独添加角色或群组不会授予访问权限；分配才是它们之间的关联。

## 添加用户和其他身份

使用以下方式向 Terraform 管理的组织组添加标识 `openai_group_user`:

```terraform
resource "openai_group_user" "application_developer" {
  group_id = openai_group.application_access.group_id
  user_id  = "user_123"
}
```

该 `user_id` 可以标识现有的组织用户或服务账号。若要添加服务账号，请使用 `openai_project_service_account.application.id` 作为 `user_id`。请参阅 [服务账号](https://developers.openai.com/api/docs/guides/terraform/service-accounts) 了解基于组的服务账号访问、身份认证及凭证生命周期要求。

在不适用基于组的访问时，请使用直接角色分配：

```terraform
resource "openai_project_user_role" "application_developer" {
  project_id = openai_project.application.project_id
  user_id    = "user_123"
  role_id    = openai_project_role.application.role_id
}
```

对于组织范围的权限，请创建组织角色并通过组或直接分配：

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

将 `organization_role_permissions` 设置为已批准的组织级权限标识符。请将组织权限与项目权限分开管理，使每次分配都具有尽可能窄的作用范围。

## 查看当前分配

在更改访问权限前，读取分配给身份的组织与项目角色：

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

数据源会报告当前分配的角色，但不会让 Terraform 对这些分配负责。

## 移除分配

当 Terraform 已经在管理某个分配时，移除其资源块会让下一次 plan 提议删除该远程分配。请审阅 plan，并确认仍有其他路径授予任何必需的访问权限。

对于已存在的分配，首先声明匹配的资源，并使用文档中记录的复合 ID 导入它。确认第一次 plan 是 no-op 后，再将其从配置中移除并应用删除操作。

Terraform 只能移除其状态中记录的分配。若要移除
  已存在的默认分配，首先将其导入到对应的 Terraform
  资源中。然后从你的配置中移除该资源，并应用
  生成的 destroy plan。如果你的组织不允许这种
  导入后销毁的 工作流，请通过审批过的
  控制台或管理后台 API 流程移除该分配。

请参阅 [导入与对账](https://developers.openai.com/api/docs/guides/terraform/import-and-reconcile) ，了解导入格式和安全的采用顺序。

## 运行完整示例

聚焦示例使用具体数值以厘清各关系。完整配置将重复出现的、与环境相关的值替换为变量，使你能够在不修改资源定义的情况下复用配置。

将以下配置另存为 `main.tf`:

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

创建 `terraform.tfvars` 时使用唯一的项目名称、已有的组织用户 ID 和已批准的权限：

```terraform
project_name = "example-application-development"
user_id      = "user_123"

project_role_permissions = [
  "api.webhooks.read",
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

首个 plan 应包含五个待添加的资源。apply 之后，该用户将通过组继承自定义项目角色，并且 `terraform output` 会输出项目、组和项目角色的 ID。再次运行 `terraform plan` 以确认配置不再产生任何变更。

若要添加更多真人用户，请为每位用户使用唯一的 Terraform 资源名称，复用相同的组成员模式。若要配置非真人身份，请参阅 [服务账号](https://developers.openai.com/api/docs/guides/terraform/service-accounts)。请参阅 [模型、工具和数据控制](https://developers.openai.com/api/docs/guides/terraform/project-controls) 以及 [速率限制与额度](https://developers.openai.com/api/docs/guides/terraform/rate-limits-and-spend) 以添加项目护栏。