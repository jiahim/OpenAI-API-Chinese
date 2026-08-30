# 导入并协调 OpenAI 资源

> 如需查看完整文档索引，请参阅 [llms.txt](/llms.txt)。你可以通过在页面 URL 末尾追加 `.md` 来获取文档页面的 Markdown 版本。

导入现有的 OpenAI 资源，而不是重新创建它们。安全采用的做法从与远程资源匹配的配置开始，预览并应用导入，并在任何预期更新之前生成一个空操作（no-op）计划。

导入块需要 Terraform 1.5 或更高版本。

## 声明并导入资源

使用每个现有资源的当前设置声明它们，然后添加一个 `import` 其 ID 格式来自 provider 参考文档的代码块：

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

在已保存的 plan 中预览导入：

```bash
terraform plan -out=tfplan
terraform show tfplan
```

该 plan 应仅显示导入项，且不会提议对远程资源进行任何更新。如果它提议了更新，请在继续之前使配置与当前设置保持一致。应用已保存的 plan 以执行导入，然后再次运行 plan：

```bash
terraform apply tfplan
terraform plan
```

第二次 plan 应报告没有更改。你可以将导入块保留在配置中，作为 Terraform 接管这些资源的记录。

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

查看 [provider 参考](https://registry.terraform.io/providers/openai/openai/latest/docs) ，了解每种资源的精确格式。

## 读取资源而不采纳它们

当 Terraform 需要当前信息但资源由另一个系统管理时，使用数据源。该 provider 包含项目、组、角色、用户、角色分配、速率限制、模型权限、托管工具权限、支出提醒、数据保留和证书的数据源。

例如，读取一个现有项目及其当前的组：

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

该 provider 可以按 ID 导入现有的项目服务账号，但它
  目前未提供 service-account 数据源。在需要采用现
  有服务账号时，请将项目和服务账号 ID 保留在已批准的清单中。参见
  服务 [账号
  账户](https://developers.openai.com/api/docs/guides/terraform/service-accounts) 的API key
  引导和导入顺序。

## 检测并调和漂移

运行常规计划以读取当前的 OpenAI 设置，并与 Terraform 配置中期望的值进行比较：

```bash
terraform plan -detailed-exitcode
```

退出代码 `0` 表示没有变更， `2` 表示计划中包含变更，以及 `1` 表示 Terraform 遇到错误。

如果计划显示了 Terraform 之外发生更改的设置：

1. 判断此次变更是否为有意的。
2. 若要保留远端变更，请更新 Terraform 配置以匹配该变更。
3. 若要撤销远端变更，请查看并应用该计划以恢复所配置的值。
4. 重新运行一次计划，并要求得到 no-op（无操作）的结果。

## 了解移除行为

移除一个资源块会把该资源从 Terraform 状态中移除，但并不总是会删除或重置同类型的远程对象：

| 资源类型                                                             | 移除行为                                                                |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `openai_project`                                                          | 归档该项目。已归档的项目无法恢复。                    |
| `openai_project_service_account`                                          | 删除该服务账号。                                                    |
| 角色、组、成员资格和分配资源                         | 删除相应的托管对象或分配。                         |
| `openai_project_model_permissions`                                        | 删除该项目的模型权限配置。                             |
| 项目速率限制、托管工具权限和数据保留资源 | 从 Terraform 状态中移除该资源，但不重置远端设置。 |