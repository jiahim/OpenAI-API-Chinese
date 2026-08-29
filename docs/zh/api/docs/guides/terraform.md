# Terraform provider

> 完整文档索引请参阅 [llms.txt](/llms.txt)，可通过在页面 URL 末尾添加 `.md` 来获取文档页面的 Markdown 版本。

官方 [OpenAI Terraform provider](https://github.com/openai/terraform-provider-openai) 让你通过基础设施即代码管理 OpenAI 组织资源。该 provider 使用 [Administration API](https://developers.openai.com/api/reference/administration/overview) 来管理项目、用户、群组、角色、服务账户、证书、速率限制、支出提醒以及相关的项目设置。

本指南创建一个 OpenAI 项目。请继续阅读用例指南，了解项目访问、服务账户、运营限制、项目控制和导入。

## 准备工作

你需要：

- [Terraform](https://developer.hashicorp.com/terraform/install) 1.0 或更高版本。导入示例要求 Terraform 1.5 或更高版本。
- 拥有创建权限的 OpenAI 组织 [Admin API key](https://platform.openai.com/settings/organization/admin-keys).

管理类 API 端点需要使用 Admin API 密钥，该密钥无法用于非管理类的 OpenAI API 端点。请将该密钥保存在环境变量或密钥管理工具中，不要将其提交到你的 Terraform 配置或源代码仓库中。

## 配置服务商

创建一个新目录并添加一个 `main.tf` 文件，包含以下配置：

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

版本约束允许 provider 1.0.0 及更高版本。升级前请查阅 [provider 发布版本](https://github.com/openai/terraform-provider-openai/releases) 。

在环境中设置你的 Admin API 密钥：

```bash
export OPENAI_ADMIN_KEY="<your-admin-api-key>"
```

Provider 默认会读取 `OPENAI_ADMIN_KEY` 。你也可以设置 `OPENAI_ORG_ID` 和 `OPENAI_PROJECT_ID` ，以便在发送 `OpenAI-Organization` 和 `OpenAI-Project` 请求时附带 API 请求头。当这些可选变量未设置时，OpenAI 会从 API 密钥中解析 organization 和 project。如果你希望明确标识 Terraform 配置所管理的 organization 或 project，请设置这些变量。详见 [provider 配置参考](https://registry.terraform.io/providers/openai/openai/latest/docs) ，了解所有可用参数。

## 初始化并应用

初始化工作目录，然后格式化并检查配置：

```bash
terraform init
terraform fmt
terraform validate
```

Terraform 下载该 provider 并创建 `.terraform.lock.hcl`。请将锁文件提交到源代码管理，以便后续运行选择相同的 provider 版本。运行 `terraform init -upgrade` 以选择该约束所允许的最新 provider 版本。

查看 Terraform 将进行的更改：

```bash
terraform plan
```

计划应显示一个要添加的 `openai_project` 资源。仅在查看计划后再应用配置：

```bash
terraform apply
```

在提示时确认应用。Terraform 会创建项目并从 `project_id` 输出中打印其 ID。

## 选择用例指南

| 指南                                                                         | 用途                                                                |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [项目与访问](https://developers.openai.com/api/docs/guides/terraform/projects-and-access)         | 创建项目，并配置基于角色和基于组的访问权限。         |
| [服务账户](https://developers.openai.com/api/docs/guides/terraform/service-accounts)               | 为工作负载身份或 API 密钥身份验证创建服务账户。 |
| [速率限制与支出](https://developers.openai.com/api/docs/guides/terraform/rate-limits-and-spend)     | 核对现有速率限制，并配置支出提醒。               |
| [模型、工具和数据控制](https://developers.openai.com/api/docs/guides/terraform/project-controls) | 配置模型访问权限、托管工具以及数据保留策略。                |
| [导入与核对](https://developers.openai.com/api/docs/guides/terraform/import-and-reconcile)  | 采用现有资源并检测配置漂移。                               |

对于各个参数和导入格式，请使用 [provider 资源和数据源参考](https://registry.terraform.io/providers/openai/openai/latest/docs).