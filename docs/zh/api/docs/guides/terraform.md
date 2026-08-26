# Terraform provider

> 有关完整的文档索引，请参阅 [llms.txt](/llms.txt)。文档页面的 Markdown 版本可通过在页面 URL 后附加 `.md` 来获取。

官方 [OpenAI Terraform provider](https://github.com/openai/terraform-provider-openai) 让你能使用基础设施即代码来管理 OpenAI 组织资源。该 provider 使用 [Administration API](https://developers.openai.com/api/reference/administration/overview) 来管理项目、用户、组、角色、服务账户、证书、速率限制、支出警报以及相关的项目设置。

本指南创建一个 OpenAI 项目。继续查看有关项目访问、服务账户、操作限制、项目控制和导入的使用案例指南。

## 开始之前

你需要：

- [Terraform](https://developer.hashicorp.com/terraform/install) 1.0 或更高版本。导入示例需要 Terraform 1.5 或更高版本。
- 拥有创建 OpenAI 的权限的组织 [管理员 API 密钥](https://platform.openai.com/settings/organization/admin-keys).

管理 API 端点需要使用管理员 API 密钥，这些密钥不适用于非管理性 OpenAI API 端点。将密钥存储在环境变量或密钥管理器中。不要将其提交到你的 Terraform 配置或源代码控制中。

## 配置提供商

创建一个新目录并添加一个 `main.tf` 包含以下配置的文件：

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

版本约束允许 provider 版本 1.0.0 及更高版本。请查阅 [provider 版本发布](https://github.com/openai/terraform-provider-openai/releases) 在升级之前。

在环境中设置你的管理员 API 密钥：

```bash
export OPENAI_ADMIN_KEY="<your-admin-api-key>"
```

provider 默认读取 `OPENAI_ADMIN_KEY` 。你也可以设置 `OPENAI_ORG_ID` 和 `OPENAI_PROJECT_ID` 以发送 `OpenAI-Organization` 和 `OpenAI-Project` 请求头带随 API 请求。当这些可选变量未设置时，OpenAI 会从 API 密钥中解析组织和项目。当你想要明确标识你的 Terraform 配置所管理的组织或项目时，请设置它们。请参阅 [provider 配置参考](https://registry.terraform.io/providers/openai/openai/latest/docs) 以获取所有可用参数。

## 初始化并应用

初始化工作目录，然后格式化并检查配置：

```bash
terraform init
terraform fmt
terraform validate
```

Terraform 会下载提供程序并创建 `.terraform.lock.hcl`。将锁文件提交到版本控制，以便后续运行选择相同的提供程序版本。运行 `terraform init -upgrade` 以选择约束允许的最新提供程序版本。

查看 Terraform 将要进行的更改：

```bash
terraform plan
```

计划应显示一个 `openai_project` 要添加的资源。仅在审查计划后应用配置：

```bash
terraform apply
```

在提示时确认应用。Terraform 会创建项目并从 `project_id` 输出中打印其 ID。

## 选择用例指南

| 指南                                                                         | 使用它来                                                                |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [项目与访问](https://developers.openai.com/api/docs/guides/terraform/projects-and-access)         | 创建项目并配置基于角色和基于组的访问。         |
| [服务账户](https://developers.openai.com/api/docs/guides/terraform/service-accounts)               | 为工作负载身份或 API 密钥认证创建服务账户。 |
| [速率限制与支出](https://developers.openai.com/api/docs/guides/terraform/rate-limits-and-spend)     | 调整现有速率限制并配置支出警报。               |
| [模型、工具和数据控制](https://developers.openai.com/api/docs/guides/terraform/project-controls) | 配置模型访问、托管工具和数据保留。                |
| [导入与对账](https://developers.openai.com/api/docs/guides/terraform/import-and-reconcile)  | 采用现有资源并检测偏差。                               |

对于个别参数和导入格式，请参阅 [provider 资源和数据源参考](https://registry.terraform.io/providers/openai/openai/latest/docs).