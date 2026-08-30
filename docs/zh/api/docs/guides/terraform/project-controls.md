# 使用 Terraform 进行模型、工具和数据控制

> 完整文档索引请参阅 [llms.txt](/llms.txt). 可通过在页面 URL 末尾追加 `.md` 获取文档页面的 Markdown 版本。

使用本指南将模型、托管工具和数据保留控制应用到现有项目。这些控制决定项目工作流可使用的内容以及适用的已批准保留策略。它们不会授予用户或服务账号对项目的访问权限。

完成主要的工作流后，你将获得一个可重复使用的配置，该配置可以：

- 将项目限制在已批准的模型范围内。
- 为每个受支持的托管工具设置明确的权限。
- 将组织的默认数据保留策略应用于该项目。

## 准备工作

完成 [Terraform 提供商配置](https://developers.openai.com/api/docs/guides/terraform) ，并导出一个 Admin API 密钥作为 `OPENAI_ADMIN_KEY`。你还需要：

- 现有项目的 ID。
- 你的组织可用的模型 ID。
- 如果计划管理项目保留，请使用已启用数据保留控制的组织。

评估工作流时请使用测试项目。若要针对单个项目禁用托管工具，组织级别的工具策略必须已经将该工具限制为仅对所选项目启用。项目无法禁用组织已为所有项目启用的工具。

## 限制模型访问

`openai_project_model_permissions` 对单个项目应用允许列表或拒绝模型列表。本示例仅允许 `gpt-5.4-mini`:

```terraform
resource "openai_project_model_permissions" "application" {
  project_id = "proj_123"
  mode       = "allow_list"
  model_ids  = ["gpt-5.4-mini"]
}
```

Set `mode` to:

- `allow_list` 仅允许其中的模型 `model_ids`.
- `deny_list` 允许可用模型，但排除以下模型 `model_ids`.

每个模型 ID 必须对组织可见。这包括你添加到该策略中的任何微调模型快照。Terraform 会在下一次 plan 与 apply 中调和模式与模型列表的变更。

## 配置托管工具

`openai_project_hosted_tool_permissions` 管理五个项目级工具权限。请设置每个字段，使经过审阅的配置能够描述完整的策略：

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

这些字段控制文件搜索、网页搜索、图像生成、远程 MCP 服务器和 Code Interpreter。每个组织的托管工具策略有三种模式：允许所有项目、拒绝所有项目或仅允许指定项目。将字段设置为 `true` 会在符合组织的其他资格与留存要求的前提下，允许该项目使用该工具。将字段设置为 `false` 会将该项目从该工具的“指定项目”策略中移除。如果当前组织对所有项目允许使用该工具，将字段设置为 `false` 会失败。在为单个项目禁用该工具之前，请先将组织的工具策略修改为仅允许指定项目。

Terraform 会从 OpenAI 刷新全部五个值，并在下一次 plan 时将仪表板变更报告为漂移。

## 配置数据保留

`openai_project_data_retention` 将已批准的保留类型应用于一个项目。除非项目已有批准的覆盖设置，否则将继承组织的当前策略：

```terraform
resource "openai_project_data_retention" "application" {
  project_id = "proj_123"
  type       = "organization_default"
}
```

该提供方还接受 `none`, `zero_data_retention`, `modified_abuse_monitoring`, `enhanced_zero_data_retention`，以及 `enhanced_modified_abuse_monitoring`。可用的模式及允许的转换取决于你所在组织的配置以及项目的数据驻留区域。

请在选择项目覆盖设置之前查阅 [你的数据](https://developers.openai.com/api/docs/guides/your-data) 以及你所在组织与 OpenAI 签署的协议。

### 管理组织默认值

使用 `openai_organization_data_retention` 仅在 Terraform 拥有现有组织级设置时使用：

```terraform
resource "openai_organization_data_retention" "default" {
  type = "zero_data_retention"
}
```

此资源会更改现有的组织设置，但不会让组织加入数据保留计划。某些过渡需要支持，或在保留层级之间不可用。

从配置中移除 `openai_project_hosted_tool_permissions` 或
  `openai_project_data_retention` 会从 Terraform 状态中移除该资源，但不会更改远程设置。移除
  会删除项目的模型权限
  `openai_project_model_permissions` 配置。请结合这些不同的行为审阅销毁计划。
  配置。请结合这些不同的行为审阅销毁计划。

## 检测 Terraform 之外的更改

运行计划以刷新远端状态，并将其与已审阅的配置进行比较：

```bash
terraform plan -detailed-exitcode
```

退出码 `0` 表示无变更， `2` 表示计划包含变更，以及 `1` 表示 Terraform 遇到错误。在应用变更前，请调查意外的变更。在未先了解紧急管理变更用途的情况下，不要自动覆盖该变更。

## 运行完整示例

下面的示例会同时管理这三种项目控制项。Create `main.tf`:

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

Create `terraform.tfvars` 使用现有的项目 ID、可见的模型 ID、托管工具策略以及已批准的保留类型：

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

该示例启用所有托管工具，以便在组织策略为每个项目启用工具时也能运行。更改一个值为 `false` 只能在对应的组织级策略使用选定项目访问模式后才能进行。在应用之前，请确认你的组织可使用相应的模型 ID 和保留类型。

初始化 Terraform，然后查看并应用已保存的 plan：

```bash
terraform init
terraform fmt
terraform validate
terraform plan -out=tfplan
terraform show tfplan
terraform apply tfplan
```

第一次 plan 应包含三个要添加的资源。对于托管工具和数据保留控制项而言，添加意味着 Terraform 开始管理一个已存在的单例项目设置，而不会创建一个新的远程对象。模型权限则会创建或更新项目的模型权限配置。

再次运行 `terraform plan` 以确认该配置不会再产生变更。如果出现漂移，请判断是否有其他管理员或自动化在应用下一次更新之前修改了项目控制项。