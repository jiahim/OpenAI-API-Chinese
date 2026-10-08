# 在 OpenAI 平台上管理权限

> 如需完整文档索引，请参阅 [llms.txt](/llms.txt)。在页面 URL 末尾追加 `.md` 即可获得文档页面的 Markdown 版本。

基于角色的访问控制（RBAC）让你可以决定在整个组织和项目中谁能执行哪些操作——无论是通过 API 还是在 Dashboard 中。两种界面遵循相同的权限规则：如果某人能够调用某个端点（例如， `/v1/chat/completions`），他们就可以使用对应的 Dashboard 页面；若缺少相应权限，相关 UI（如 **Upload** 按钮 Playground 上）也会被禁用。使用 RBAC，你可以：

- 批量对用户进行分组并分配权限
- 使用你所需的精确权限创建自定义角色
- 在组织或项目级别范围内控制访问
- 在控制台和API中强制执行一致的权限

## 核心概念

- **Organization**: 你的顶级账户。Organization 角色可以授权访问所有项目。
- **Project**: 用于管理密钥、文件和资源的工作区。Project 角色只能在所属项目内授权访问。
- **Groups**: 由用户组成的集合，你可以为其分配角色。Groups 可以通过 SCIM 从你的身份提供方同步，以自动保持成员关系的最新状态。
- **Roles**: 权限的集合（例如 Models Request 或 Files Write）。角色可以在 **Organization settings**，下为 Organization 创建，也可以在特定项目的设置下为该项目创建。创建后，Organization 或 Project 角色可以分配给用户或 Groups。用户可以拥有多个角色，其访问权限是这些角色的并集。
- **Permissions**: 角色允许的具体操作（例如，向模型发出请求、读取文件、写入文件、管理密钥）。

### 权限

下表列出了可用的权限、包含这些权限的预设角色，以及它们是否可以为自定义角色进行配置。




| 区域                   | 所允许的操作                                                                       | 组织所有者权限   | 组织读取者权限 | 项目所有者权限 | 项目成员权限 | 项目查看者权限 | 可分配自定义角色 |
| ---------------------- | ------------------------------------------------------------------------------------ | ----------------------- | ---------------------- | ------------------------- | -------------------------- | -------------------------- | -------------------- |
| 列出模型            | 列出本组织可访问的模型                                          | `Read`                  | `Read`                 | `Read`                    | `Read`                     | `Read`                     | ✓                    |
| 分组                 | 查看和管理分组                                                               | `Read`, `Write`         | `Read`                 | `Read`, `Write`           | `Read`, `Write`            | `Read`                     |                      |
| 角色                  | 查看和管理角色                                                                | `Read`, `Write`         | `Read`                 | `Read`, `Write`           | `Read`, `Write`            | `Read`                     |                      |
| 组织管理员     | 管理组织用户、项目、邀请、管理员 API 密钥以及速率限制        | `Read`, `Write`         |                        |                           |                            |                            |                      |
| 用量                  | 查看用量仪表板并导出                                                      | `Read`                  |                        |                           |                            |                            | ✓                    |
| 外部密钥          | 查看并管理企业密钥管理的密钥                                   | `Read`, `Write`         |                        |                           |                            |                            |                      |
| IP allowlist           | 查看和管理 IP allowlist                                                         | `Read`, `Write`         |                        |                           |                            |                            |                      |
| mTLS                   | 查看和管理 mutual TLS 设置                                                  | `Read`, `Write`         |                        |                           |                            |                            |                      |
| OIDC                   | 查看和管理 OIDC 配置                                                   | `Read`, `Write`         |                        |                           |                            |                            |                      |
| 模型能力     | 对 chat completions、audio、embeddings 和 images 发起请求                     | `Request`               | `Request`              | `Request`                 | `Request`                  |                            | ✓                    |
| Assistants             | 创建和检索 Assistants                                                       | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Threads                | 创建和检索 Threads/Messages/Runs                                            | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Evals                  | 创建、检索和删除 Evals                                                   | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Fine-tuning            | 创建和检索 fine tuning 任务                                                 | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Files                  | 创建和检索文件                                                            | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Vector Stores          | 创建和检索 vector stores                                                    | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            |                            | ✓                    |
| Responses API          | 创建 responses                                                                     | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            |                            | ✓                    |
| Prompts                | 创建并检索提示，用作 Responses API 和 Realtime API 的上下文     | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Webhooks               | 在你的项目中创建并查看 webhooks                                             | `Read`, `Write`         | `Read`                 | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Datasets               | 创建并检索 Datasets                                                         | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Apps                   | 在 Dashboard 中创建、管理应用并提交审核                          | `Read`, `Write`         |                        |                           |                            |                            | ✓                    |
| Tunnels                | 检查、使用并管理组织级 tunnels                                 | `Read`, `Use`, `Manage` |                        |                           |                            |                            | ✓                    |
| Project API Keys       | 用户管理自己的 API 密钥的权限                                   | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Project Administration | 通过管理 API 管理项目用户、服务账户、API 密钥以及速率限制 | `Read`, `Write`         |                        | `Read`, `Write`           |                            |                            |                      |
| Batch                  | 创建并管理批量任务                                                         | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     |                      |
| Service Accounts       | 查看并管理项目的服务账户                                             | `Read`, `Write`         |                        | `Read`, `Write`           |                            |                            |                      |
| Voices                 | 创建并检索语音                                                           | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     |                      |
| 智能体 Builder          | 在 智能体 Builder 中创建和管理 智能体 与工作流                              | `Read`, `Write`         | `Read`                 | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |




#### 批处理权限影响

批量权限包括准备批量输入文件、执行请求和获取结果所需的访问权限。此有效访问权限独立于可在批量内提交的端点，这些端点在 [批量 API 指南](https://developers.openai.com/api/docs/guides/batch#1-prepare-your-batch-file).

| 批量权限          | 授予的额外访问权限                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Read (`api.batch.read`)   | Files Read (`api.files.read`) 用于 `/v1/files`                                                                                                                                                                                                                                                                                                                                 |
| Write (`api.batch.write`) | Batch Read<br />List models (`api.model.read` and `model.read`) 用于 `/v1/models`<br />Files Read and Write (`api.files.read` and `api.files.write`) 用于 `/v1/files`<br />Model capabilities Request (`api.model.request` and `model.request`) 用于 `/v1/audio`, `/v1/chat/completions`, `/v1/embeddings`, `/v1/images`, `/v1/moderations`, `/v1/realtime`，以及 `/v1/responses` |

## 设置 RBAC

Allow up to **30 minutes** 角色变更和群组同步可能需要最多 30 分钟才能生效。

1. **创建组**
   为各个团队创建组（例如， **Data Science** 和 **Support**）。如果你使用 IdP，请启用 SCIM 同步以保持组成员关系为最新。

2. **创建自定义角色**
   从最小权限开始。例如：
   - _Model Tester_: Models Read、Model Capabilities Request、Evals
   - _Model Engineer_: Model Capabilities Request、Files Read/Write、Fine-tuning
   - _App Publisher_: Apps Read、Apps Write

3. **分配角色**
   - **组织级别** 的角色在整个组织内（组织内的所有项目）通用。
   - **项目级别** 的角色仅在该项目中生效。
     你可以将角色分配给 **用户** 和 **群组**. 一个用户可以拥有多个角色，访问权限是其所有角色的 **并集**.

4. **验证**
   使用非所有者账户确认预期的访问权限（API 和控制台）。如果用户能够看到超出其需要的内容，请调整其角色。

遵循最小权限原则。从任务所需的最小权限开始
  入手，然后仅按需增加权限。

## 访问配置示例

### 小型团队

- 为核心团队分配一个具备 Model Capabilities Request 与 Files Read/Write 权限的组织级角色。
- 为每个应用创建一个项目；仅将这些项目级别的角色授予承包商。

### 大型组织

- 从你的 IdP 同步用户组（例如， **Research**, **Support**，以及 **Finance**).
- 为每个职能创建自定义角色并在组织级别分配；仅在项目需要更严格的控制时授予项目级角色。

### 承包商与供应商

- 创建一个“Contractors”（承包商）分组，且不分配组织级别的角色。
- 为他们分配范围受限的项目级角色（例如只读访问权限）并加入特定项目。

## 如何评估用户访问权限

在控制台中，我们合并：

- 来自该 **组织** （直接 + 通过群组）
- 来自该 **项目** （直接 + 通过群组）

有效权限是所有已分配角色的 **并集** 。

如果使用项目内的 API 密钥发起请求，我们会获取该 API 密钥所分配的权限，并确保用户拥有可授予这些权限的某个项目角色。例如，请求 /v1/models 时，该 API 密钥必须被分配了 api.model.read，并且用户必须拥有包含 api.model.read 的项目角色。

## 最佳实践

- **按分组来组织你的组织结构**：在 IdP 中镜像团队，并将角色分配到分组而非个人。
- **职责分离**：读取模型、上传文件与管理密钥。
- **项目边界**：将实验、预发布和生产环境放在不同的项目中。
- **定期审查**：移除不再使用的角色和密钥；定期轮换敏感密钥。
- **以非所有者身份测试**：在大规模推广前验证访问权限是否符合预期。