# 使用 Terraform 进行模型、工具和数据控制

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

使用本指南为现有项目应用模型、托管工具和数据保留控制。这些控制决定了项目工作负载可以使用什么以及适用哪种已批准的保留策略。它们不会授予用户或服务账户对项目的访问权限。

完成主要工作流后，你将获得一个可重复的配置，该配置：

- 将项目限制为已批准的模型集。
- 为每个支持的托管工具设置显式权限。
- 将组织的默认数据保留策略应用于项目。

## 开始之前

完成 [Terraform provider 设置](https://developers.openai.com/api/docs/guides/terraform) 并导出管理员 API 密钥作为 `OPENAI_ADMIN_KEY`。你还需要：

- 现有项目的 ID。
- 你的组织可用的模型 ID。
- 一个启用了数据保留控制的组织，如果你计划管理项目保留的话。

在评估工作流时，请使用测试项目。要为某个项目禁用托管工具，组织级工具策略必须已经将该工具限制为仅限选定的项目。项目无法禁用组织已为所有项目启用的工具。

## 限制模型访问

`openai_project_model_permissions` 对一个项目应用允许列表或拒绝模型列表。此示例仅允许 `gpt-5.4-mini`:

```terraform
resource "openai_project_model_permissions" "application" {
  project_id = "proj_123"
  mode       = "allow_list"
  model_ids  = ["gpt-5.4-mini"]
}
```

设置 `mode` 为：

- `allow_list` 以仅允许以下模型 `model_ids`.
- `deny_list` 以允许除以下模型之外的所有可用模型 `model_ids`.

每个模型 ID 必须对组织可见。这包括你添加到策略中的任何微调模型快照。Terraform 会在下一次计划和应用期间协调模式及模型列表的变更。

## 配置托管工具

`openai_project_hosted_tool_permissions` 管理五个项目级工具权限。设置每个字段，使审核后的配置描述完整策略：

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

这些字段控制文件搜索、网页搜索、图像生成、远程 MCP 服务器和代码解释器。每个组织的托管工具策略有三种模式：允许所有项目、拒绝所有项目或允许选定项目。将字段设置为 `true` 即为该项目允许该工具，但须遵守组织的其他资格和保留要求。将字段设置为 `false` 可将该项目从该工具的选定项目策略中移除。如果组织当前允许所有项目使用该工具，则将字段设置为 `false` 会失败。在禁用单个项目工具之前，请将组织的工具策略改为允许选定项目。

Terraform 会从OpenAI刷新所有五个值，并在下次计划时将仪表板更改报告为漂移。

## 配置数据保留

`openai_project_data_retention` 将批准的保留类型应用于一个项目。除非项目有批准的覆盖设置，否则继承组织的当前策略：

```terraform
resource "openai_project_data_retention" "application" {
  project_id = "proj_123"
  type       = "organization_default"
}
```

该提供商还接受 `none`, `zero_data_retention`, `modified_abuse_monitoring`, `enhanced_zero_data_retention`，以及 `enhanced_modified_abuse_monitoring`。可用的模式和允许的转换取决于你组织的配置和项目的数据驻留区域。

在 [你的数据](https://developers.openai.com/api/docs/guides/your-data) 和你组织的 OpenAI 协议中选择项目覆盖之前，请先查看。

### 管理组织默认设置

仅在 `openai_organization_data_retention` Terraform 拥有现有组织级设置时使用：

```terraform
resource "openai_organization_data_retention" "default" {
  type = "zero_data_retention"
}
```

此资源更改现有的组织设置；它不会将组织纳入数据保留计划。某些转换需要支持，或在保留层级之间不可用。

移除 `openai_project_hosted_tool_permissions` 或
  `openai_project_data_retention` 从配置中移除资源会将资源从
  Terraform 状态中移除，但保持远程设置不变。移除
  `openai_project_model_permissions` 将删除项目的模型权限
  配置。审查销毁计划时请牢记这些不同的行为。

## 检测 Terraform 之外的更改

运行一个计划以刷新远程状态，并将其与已审查的配置进行比较：

```bash
terraform plan -detailed-exitcode
```

退出码 `0` 表示没有变更， `2` 表示计划包含变更，以及 `1` 表示 Terraform 遇到了错误。在应用前调查意外变更。不要在不先理解其目的的情况下自动覆盖紧急管理变更。

## 运行完整示例

以下示例同时管理所有三个项目控制项。创建 `main.tf`:

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

创建 `terraform.tfvars` 时使用现有项目 ID、可见的模型 ID、托管工具策略以及已批准的保留类型：

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

该示例启用了所有托管工具，因此当组织策略为每个项目启用工具时，它可以运行。仅在相应的组织级策略使用选定项目访问权限后，才将值更改为 `false` 。应用前请确认模型 ID 和保留类型对你的组织可用。

初始化 Terraform，然后审查并应用保存的计划：

```bash
terraform init
terraform fmt
terraform validate
terraform plan -out=tfplan
terraform show tfplan
terraform apply tfplan
```

第一个计划应包含三个要添加的资源。对于托管工具和数据保留控制项，添加意味着 Terraform 开始管理现有的单例项目设置；它不会创建单独的远程对象。模型权限会创建或更新项目的模型权限配置。

再次运行 `terraform plan` 以确认配置不会产生进一步更改。如果显示漂移，请在应用另一个更新之前确定是否有其他管理员或自动化更改了项目控制项。