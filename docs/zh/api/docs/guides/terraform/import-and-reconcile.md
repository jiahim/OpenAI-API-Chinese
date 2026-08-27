# 导入并核对OpenAI资源

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 后追加 `.md` 即可获取文档页面的 Markdown 版本。

导入已有的 OpenAI 资源，而不是重新创建它们。安全的采用方式从与远程资源匹配的配置开始，预览并应用导入，并在任何预期更新之前生成一个无操作计划。

导入块需要 Terraform 1.5 或更高版本。

## 声明并导入资源

使用当前设置声明每个现有资源，然后添加一个 `import` 块，其 ID 格式来自提供程序参考文档：

```terraform
resource "openai_project" "existing" {
  name = "existing-project"
}

resource "openai_group" "existing" {
  name = "existing-group"
}

resource "openai_project_service_account" "existing" {
  project_id = openai_project.existing.project_id
  name       = "existing-service-account"
}

import {
  to = openai_project.existing
  id = "proj_123"
}

import {
  to = openai_group.existing
  id = "group_123"
}

import {
  to = openai_project_service_account.existing
  id = "proj_123/svc_acct_123"
}
```

在已保存的计划中预览导入：

```bash
terraform plan -out=tfplan
terraform show tfplan
```

该计划应显示导入内容，而不会建议对远程资源进行更新。如果它建议更新，请在继续之前使配置与当前设置匹配。应用已保存的计划执行导入，然后运行另一个计划：

```bash
terraform apply tfplan
terraform plan
```

第二个计划应报告无更改。你可以将导入块保留在配置中，作为 Terraform 如何采用这些资源的记录。

常见的导入 ID 格式包括：

| 资源                | 导入 ID 格式                    |
| ----------------------- | ----------------------------------- |
| 项目                 | `<project_id>`                      |
| 组织组      | `<group_id>`                        |
| 项目角色            | `<project_id>/<role_id>`            |
| 项目服务账户 | `<project_id>/<service_account_id>` |
| 项目组角色      | `<project_id>/<group_id>/<role_id>` |
| 项目用户角色       | `<project_id>/<user_id>/<role_id>`  |
| 项目速率限制      | `<project_id>/<rate_limit_id>`      |

查看 [提供者参考](https://registry.terraform.io/providers/openai/openai/latest/docs) 以了解每个资源的准确格式。

## 读取资源但不采用

当 Terraform 需要最新信息但资源由其他系统拥有时，请使用数据源。该提供程序包含用于项目、组、角色、用户、角色分配、速率限制、模型权限、托管工具权限、支出提醒、数据保留和证书的数据源。

例如，读取现有项目及其当前组：

```terraform
data "openai_project" "existing" {
  project_id = var.project_id
}

data "openai_project_groups" "existing" {
  project_id = data.openai_project.existing.project_id
}

output "project_groups" {
  value = data.openai_project_groups.existing.groups
}
```

该提供程序可以通过 ID 导入现有的项目服务账号，但它
  目前不提供服务账号数据源。当你需要采用
  现有服务账号时，请在已批准的清单中保留项目和服务账号 ID。
  参见 [Service
  accounts](https://developers.openai.com/api/docs/guides/terraform/service-accounts) 以了解 API 密钥
  的引导和导入顺序。

## 检测并协调漂移

运行常规计划以读取当前 OpenAI 设置，并将其与 Terraform 配置中的期望值进行比较：

```bash
terraform plan -detailed-exitcode
```

退出码 `0` 表示没有更改， `2` 表示计划包含更改，且 `1` 表示 Terraform 遇到错误。

如果计划显示有在 Terraform 之外更改的设置：

1. 确定该变更是否为有意为之。
2. 若要保留远程变更，请更新 Terraform 配置以使其匹配。
3. 若要撤销远程变更，请审查并应用计划以恢复配置值。
4. 再次运行计划并要求结果为 no-op。

## 了解移除行为

移除资源块会将该资源从 Terraform 状态中移除，但并不总是会删除或重置相同类型的远程对象：

| 资源类型                                                             | 移除行为                                                                |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `openai_project`                                                          | 归档项目。你无法恢复已归档的项目。                    |
| `openai_project_service_account`                                          | 删除服务账户。                                                    |
| 角色、组、成员关系和分配资源                         | 删除相应的托管对象或分配。                         |
| `openai_project_model_permissions`                                        | 删除项目模型权限配置。                             |
| 项目速率限制、托管工具权限和数据保留资源 | 从 Terraform 状态中移除资源，而不重置远程设置。 |