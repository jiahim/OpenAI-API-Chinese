# 在 OpenAI 平台中管理权限

> 完整的文档索引请参阅 [llms.txt](/llms.txt)。如需获取文档页面的 Markdown 版本，可在页面 URL 后追加 `.md` 来访问。

基于角色的访问控制（RBAC）让你能够决定在整个组织与项目中谁能做什么——既包括通过 API，也包括在 Dashboard 中。同一套权限同时管控这两处界面：如果某人能够调用某个接口（例如， `/v1/chat/completions`），那么他们也能使用 Dashboard 中对应的页面；缺少相应权限时，相关 UI（例如 **Upload** 按钮在 Playground 中）会被禁用。通过 RBAC，你可以：

- 对用户进行分组并大规模分配权限
- 使用你所需的精确权限创建自定义角色
- 在组织或项目级别限定访问范围
- 在 Dashboard 和API中强制执行一致的权限

## 核心概念

- **Organization**:你的顶级账户。组织角色可以授予跨所有项目的访问权限。
- **Project**:用于存放密钥、文件和资源的工作区。项目角色仅授予该项目范围内的访问权限。
- **Groups**:你可以为其分配角色的用户集合。Groups 可以通过 SCIM 从你的身份提供方同步，以自动保持成员关系的最新状态。
- **Roles**:权限的集合（例如 Models Request 或 Files Write）。角色可以在 **Organization settings**，中为组织创建，或在该项目的设置中为特定项目创建。创建后，组织或项目角色可以分配给用户或组。用户可以拥有多个角色，其访问权限是这些角色的并集。
- **Permissions**:角色允许的具体操作（例如，向模型发起请求、读取文件、写入文件、管理密钥）。

### Permissions

下表显示了可用的权限、包含这些权限的预设角色，以及它们是否为自定义角色可配置。




| 区域                   | 允许的操作                                                                       | 组织所有者权限   | 组织读者权限 | 项目所有者权限 | 项目成员权限 | 项目查看者权限 | 支持自定义角色 |
| ---------------------- | ------------------------------------------------------------------------------------ | ----------------------- | ---------------------- | ------------------------- | -------------------------- | -------------------------- | -------------------- |
| 列出模型            | 列出该组织可访问的模型                                          | `Read`                  | `Read`                 | `Read`                    | `Read`                     | `Read`                     | ✓                    |
| 组                 | 查看和管理组                                                               | `Read`, `Write`         | `Read`                 | `Read`, `Write`           | `Read`, `Write`            | `Read`                     |                      |
| 角色                  | 查看和管理角色                                                                | `Read`, `Write`         | `Read`                 | `Read`, `Write`           | `Read`, `Write`            | `Read`                     |                      |
| 组织管理员     | 管理组织用户、项目、邀请、管理员 API 密钥以及速率限制        | `Read`, `Write`         |                        |                           |                            |                            |                      |
| 用量                  | 查看用量面板并导出                                                      | `Read`                  |                        |                           |                            |                            | ✓                    |
| 外部密钥          | 查看和管理企业密钥管理的密钥                                   | `Read`, `Write`         |                        |                           |                            |                            |                      |
| IP allowlist           | 查看和管理 IP allowlist                                                         | `Read`, `Write`         |                        |                           |                            |                            |                      |
| mTLS                   | 查看和管理 mutual TLS 设置                                                  | `Read`, `Write`         |                        |                           |                            |                            |                      |
| OIDC                   | 查看和管理 OIDC 配置                                                   | `Read`, `Write`         |                        |                           |                            |                            |                      |
| 模型能力     | 向 chat completions、音频、embeddings 和图片发起请求                     | `Request`               | `Request`              | `Request`                 | `Request`                  |                            | ✓                    |
| Assistants             | 创建和检索 Assistants                                                       | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Threads                | 创建和检索 Threads/Messages/Runs                                            | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Evals                  | 创建、检索和删除 Evals                                                   | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Fine-tuning            | 创建和检索微调任务                                                 | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Files                  | 创建和检索文件                                                            | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Vector Stores          | 创建和检索向量存储                                                    | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            |                            | ✓                    |
| Responses API          | 创建响应                                                                     | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            |                            | ✓                    |
| Prompts                | 创建和检索要在 Responses API 和 Realtime API 中用作上下文的提示     | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| Webhooks               | 在项目中创建和查看 Webhooks                                             | `Read`, `Write`         | `Read`                 | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| 数据集               | 创建和检索数据集                                                         | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| 应用                   | 在仪表板中创建、管理和提交应用以供审核                          | `Read`, `Write`         |                        |                           |                            |                            | ✓                    |
| Tunnels                | 检查、使用和管理组织范围的隧道                                 | `Read`, `Use`, `Manage` |                        |                           |                            |                            | ✓                    |
| 项目 API 密钥       | 用户管理自己的 API 密钥的权限                                   | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |
| 项目管理 | 通过管理 API 管理项目用户、服务帐户、API 密钥和速率限制 | `Read`, `Write`         |                        | `Read`, `Write`           |                            |                            |                      |
| Batch                  | 创建和管理批量任务                                                         | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     |                      |
| 服务帐户       | 查看和管理项目服务帐户                                             | `Read`, `Write`         |                        | `Read`, `Write`           |                            |                            |                      |
| Videos                 | 创建和检索视频                                                           | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            |                            |                      |
| Voices                 | 创建和检索语音                                                           | `Read`, `Write`         | `Read`, `Write`        | `Read`, `Write`           | `Read`, `Write`            | `Read`                     |                      |
| 智能体 Builder          | 在 智能体 Builder 中创建和管理智能体和工作流                              | `Read`, `Write`         | `Read`                 | `Read`, `Write`           | `Read`, `Write`            | `Read`                     | ✓                    |




#### 批处理权限相关影响

批处理权限包括准备批处理输入文件、执行请求以及检索结果所需的访问权限。此有效访问权限与可在批处理中提交的端点相互独立，相关端点列于 [Batch API 指南](https://developers.openai.com/api/docs/guides/batch#1-prepare-your-batch-file).

| 批量权限          | 授予的额外访问权限                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 读取（`api.batch.read`)   | 文件读取（`api.files.read`）用于 `/v1/files`                                                                                                                                                                                                                                                                                                                                                                                                                        |
| 写入（`api.batch.write`) | 批量读取<br />列出模型（`api.model.read` 和 `model.read`）用于 `/v1/models`<br />文件读写（`api.files.read` 和 `api.files.write`）用于 `/v1/files`<br />模型能力请求（`api.model.request` 和 `model.request`）用于 `/v1/audio`, `/v1/chat/completions`, `/v1/embeddings`, `/v1/images`, `/v1/moderations`, `/v1/realtime`，和 `/v1/responses`<br />视频读写（`api.videos.read` 和 `api.videos.write`）用于 `/v1/videos` |

## Setting up RBAC

允许最多 **30 分钟** 以完成角色变更和组同步的传播。

1. **创建组**
   为团队添加组（例如，“数据科学”、“支持”）。如果你使用 IdP，请启用 SCIM 同步以保持组成员关系的最新状态。

2. **创建自定义角色**
   从最小权限开始。例如：
   - _Model Tester_：Models Read、Model Capabilities Request、Evals
   - _Model Engineer_：Model Capabilities Request、Files Read/Write、Fine-tuning
   - _App Publisher_：Apps Read、Apps Write

3. **分配角色**
   - **组织级别** 角色在所有位置生效（组织内的所有项目）。
   - **项目级别** 角色仅在该项目中生效。
     你可以将角色分配给 **用户** 和 **组**。用户可以持有多个角色；访问权限是这些 **union**.

4. **验证**
   使用非所有者账号确认预期访问权限（API 和 Dashboard）。如果用户可见内容超出所需范围，请调整角色。

使用最小权限原则。从完成任务所需的最低权限开始，
  然后根据需要逐步增加权限。

## 访问配置示例

### 小型团队

- 为核心团队分配一个组织级角色，拥有 Model Capabilities Request 和 Files Read/Write 权限。
- 为每个应用创建一个项目；仅将外包人员加入这些项目，并为其分配项目级角色。

### 更大的组织

- 从你的 IdP 同步用户组（例如“Research”、“Support”、“Finance”）。
- 按职能创建自定义角色，并在组织级别进行分配；仅在项目需要更严格的控制时才授予项目级专属角色。

### 承包商与供应商

- 创建一个“Contractors”组，不分配组织级角色。
- 将他们添加到特定项目中，并为其分配范围较窄的项目角色（例如，只读访问权限）。

## 如何评估用户访问权限

在控制台中，我们将以下内容整合在一起：

- 组织内的角色 **组织** （直接 + 通过群组）
- 组织内的角色 **项目** （直接 + 通过群组）

有效权限是所有已分配角色的 **并集** 。

如果使用项目内的 API key 进行请求，我们会取该 API key 被分配的权限，并确保用户拥有授予这些权限的某个项目角色。例如，请求 /v1/models 时，该 API key 必须被分配了 api.model.read，并且用户必须拥有包含 api.model.read 的项目角色。

## 最佳实践

- **按群组对组织进行建模**: 在你的 IdP 中映射团队，并将角色分配给群组，而不是个人。
- **职责分离**: 区分读取模型、上传文件和管理密钥等职责。
- **项目边界**: 将实验、预发布和生产环境放在不同的项目中。
- **定期审查**: 移除不再使用的角色和密钥；定期轮换敏感密钥。
- **以非所有者身份测试**: 在大规模推广前，验证访问权限是否符合预期。