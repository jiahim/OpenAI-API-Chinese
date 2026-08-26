# 使用 Terraform 管理项目和访问权限

> 有关完整文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后追加 `.md` 来获取。

使用本指南创建 OpenAI 项目并建立可重复使用的访问控制。你将定义身份通过项目角色可以执行哪些操作，将身份收集到组织分组中，并将该分组连接到项目。

完成主要 工作流 后，你将获得一个可重复的配置，该配置：

- 为应用程序创建一个 OpenAI 项目。
- 定义最低权限项目角色。
- 为需要访问的身份创建一个组织组。
- 通过该角色授予组对项目的访问权限。
- 将现有组织用户添加到该组中。

## 开始之前

完成 [Terraform 提供程序设置](https://developers.openai.com/api/docs/guides/terraform) 并导出 Admin API 密钥作为 `OPENAI_ADMIN_KEY`。你还需要现有组织用户的 ID 以及为应用程序批准的权限标识符。在评估 工作流 时使用测试组织。

销毁 `openai_project` 会将项目归档而不是永久删除。你无法恢复已归档的项目。

## 创建项目边界

为应用程序创建项目：

```terraform
resource "openai_project" "application" {
  name = "example-application-development"
}
```

该项目为应用程序的 API 使用、服务账户、速率限制、支出警报和项目设置划定边界。Terraform 将生成的 ID 作为 `openai_project.application.project_id`。提供。项目级资源可以引用该值，因此 Terraform 会在它们之前创建项目。

这个聚焦的示例使用了具体名称。完整的示例稍后会将其替换为变量，以便你可以在不同环境中重用该配置。

## 定义项目权限

创建具有应用程序已批准权限的项目角色：

```terraform
resource "openai_project_role" "application" {
  project_id  = openai_project.application.project_id
  role_name   = "Application API access"
  description = "Permissions approved for this application"
  permissions = ["api.webhooks.read"]
}
```

该 `openai_project_role` 资源定义了身份在项目内可以执行的操作。此示例授予读取 webhook 配置的权限。将 `api.webhooks.read` 替换为应用程序已批准的权限标识符，并且仅从它所需的最少权限开始。

更改 `permissions` 会更新该角色。在应用更改之前，运行 `terraform plan` 以审查每个添加或移除的权限。

## 创建或复用群组

当 Terraform 应负责组织组的生命周期时，创建该组织组：

```terraform
resource "openai_group" "application_access" {
  name = "example-application-development-access"
}
```

组织组在组织级别存在，你可以跨项目复用。以 `-access` 结尾的名称表示成员资格授予访问权限，而非仅仅描述团队。

如果另一个系统拥有现有组，请改为读取它：

```terraform
data "openai_group" "application_access" {
  group_id = "group_123"
}
```

数据源读取组时不会使此配置负责其生命周期。你可以读取 SCIM 管理的组，但成员变更应保留在拥有这些组的身份系统中。

## 授予分组项目访问权限

将组连接到项目内的自定义角色：

```terraform
resource "openai_project_group_role" "application_access" {
  project_id = openai_project.application.project_id
  group_id   = openai_group.application_access.group_id
  role_id    = openai_project_role.application.role_id
}
```

此示例使用 Terraform 管理的组。如果通过数据源复用了现有组，请将 `group_id` 表达式替换为 `data.openai_group.application_access.group_id`.

该分配连接三个对象：

- `project_id` 标识群组在何处获得访问权限。
- `group_id` 标识哪些身份集合获得访问权限。
- `role_id` 标识群组获得哪些权限。

组成员继承此项目中的自定义角色。仅添加角色或仅添加组并不会授予访问权限，分配是它们之间的关联。

## 添加用户及其他身份

向 Terraform 管理的组织组添加身份，使用 `openai_group_user`:

```terraform
resource "openai_group_user" "application_developer" {
  group_id = openai_group.application_access.group_id
  user_id  = "user_123"
}
```

该 `user_id` 可识别现有组织用户或服务账号。要添加服务账号，请使用 `openai_project_service_account.application.id` 作为 `user_id`。参见 [服务账号](https://developers.openai.com/api/docs/guides/terraform/service-accounts) 了解基于组的服务账号访问、身份验证和凭据生命周期要求。

当基于组的访问不适用时，使用直接角色分配：

```terraform
resource "openai_project_user_role" "application_developer" {
  project_id = openai_project.application.project_id
  user_id    = "user_123"
  role_id    = openai_project_role.application.role_id
}
```

对于组织级权限，创建组织角色并直接或通过组分配：

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

将 `organization_role_permissions` 设置为已批准的组织级权限标识符。保持组织权限与项目权限分离，使每项分配具有最窄的必要范围。

## 检查当前分配

在更改访问权限之前，请阅读分配给某个身份的组织和项目角色：

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

数据源报告当前的分配情况，但不会让 Terraform 对其负责。

## 移除赋值

当 Terraform 已管理某个分配时，移除其资源块会让下一次计划提议删除远程分配。请审查该计划并确认仍有其他路径授予任何所需的访问权限。

对于已存在的分配，请先声明匹配的资源，并使用文档中所述的复合 ID 导入它。在将其从配置中移除并应用删除之前，请确认第一个计划是一个无操作。

Terraform 只能移除其状态中记录的分配。要移除
  已存在的默认分配，请先将其导入到相应的 Terraform
  资源中。然后从配置中移除该资源并应用
  由此产生的销毁计划。如果你的组织不允许此
  导入并销毁 工作流，请通过已批准的
  仪表盘或管理 API 流程移除该分配。

参见 [导入与对账](https://developers.openai.com/api/docs/guides/terraform/import-and-reconcile) 以了解导入格式和安全采用顺序。

## 运行完整示例

聚焦示例使用具体值使每种关系清晰明了。完整配置将重复的、环境特有的值替换为变量，以便你无需更改资源定义即可复用。

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

创建 `terraform.tfvars` ，使用唯一的项目名称、现有的组织用户 ID 和已批准的权限：

```terraform
project_name = "example-application-development"
user_id      = "user_123"

project_role_permissions = [
  "api.webhooks.read",
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

第一个计划应包含五个要添加的资源。应用后，用户通过组继承自定义项目角色，并且 `terraform output` 打印项目、组和项目角色的 ID。运行 `terraform plan` 再次确认配置不再产生任何更改。

要添加更多人工用户，请为每个用户使用唯一的 Terraform 资源名称重复组成员模式。要配置非人工身份，请参阅 [服务账户](https://developers.openai.com/api/docs/guides/terraform/service-accounts)。使用 [模型、工具和数据控制](https://developers.openai.com/api/docs/guides/terraform/project-controls) 和 [速率限制和支出](https://developers.openai.com/api/docs/guides/terraform/rate-limits-and-spend) 为项目添加护栏。