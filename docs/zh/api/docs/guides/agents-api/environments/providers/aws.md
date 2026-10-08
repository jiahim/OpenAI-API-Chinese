# AWS Lambda MicroVMs

> 如需查看完整的文档索引，请参阅 [llms.txt](/llms.txt)。通过在页面 URL 末尾添加 `.md` 即可获取文档页面的 Markdown 版本。

使用 [AWS Lambda MicroVMs](https://docs.aws.amazon.com/lambda/latest/dg/microvms-getting-started.html) 在你的 AWS 账户中运行 智能体 的工具。OpenAI 运行 智能体 框架；每个 MicroVM 运行 `codex exec-server` 并保存该会话的工作区文件。

默认情况下，示例使用一个 MicroVM 处理一轮调用。准备一个可复用的镜像，然后从你的应用或 OpenAI webhook 启动它。两种路径使用相同的镜像和凭证。每个会话选择一个供应负责人。

试用 [AWS Cookbook 示例](https://github.com/openai/openai-cookbook/tree/main/examples/agents_api/sandboxes/aws) ，了解应用管理的沙箱和 webhook 管理的沙箱。

## 工作原理

在 Webhook 路径中，你的应用创建一个自托管会话并发送输入。当会话需要执行器时，OpenAI 发送 `agent.session.action_required` 一个带 `environment_connection` 操作。 [API 网关](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) 将该 Webhook 投递给一个启动器 [Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html)，它会验证签名、检查当前会话，然后启动或恢复一个 MicroVM。

该 MicroVM 的 `/run` 钩子从 [Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) 获取一个环境密钥，并启动执行器。执行器会主动连接到 OpenAI，等待中的输入继续处理。你的应用会跟随会话流，下载输出文件，并在最后一轮结束后终止 MicroVM。

<picture>
  <source
    media="(max-width: 640px)"
    srcSet="/images/api/agents-api/aws-microvm-sandboxes-mobile.webp"
    width="680"
    height="1420"
  />
  <img src="https://developers.openai.com/images/api/agents-api/aws-microvm-sandboxes.webp"
    width="1480"
    height="1212"
    loading="lazy"
    alt="The application sends input to Agents API. A connection-required webhook flows through API Gateway and a launcher Lambda to an AWS Lambda MicroVM. The launcher uses a reusable image; the VM reads its environment key from Secrets Manager and connects outbound to OpenAI. The application retrieves output files."
  />
</picture>

## 准备工作

准备好以下资源：

- **AWS 访问：** 一个具有 Lambda MicroVMs 访问权限的账号，一个包含 `lambda-microvms`，的 AWS CLI，并具备构建镜像和运行 MicroVMs 的权限。请按照 AWS 的 [入门指南](https://docs.aws.amazon.com/lambda/latest/dg/microvms-getting-started.html) 创建 [S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) 制品存储桶和 [IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html) 镜像构建角色。
- **应用密钥：** 用于 `OPENAI_API_KEY` 创建会话和提交输入。
- **环境密钥（`OPENAI_EXECUTOR_API_KEY`):** 创建一个独立的 [environment key](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#authentication) ，要求组织、项目和用户或服务账号归属一致。将其值存储在 Secrets Manager 中，例如存放在名为 `codex/agents-api/executor`。的密钥里。该 `/run` 钩子会将其作为 `CODEX_API_KEY`.
- **MicroVM 执行角色：** 允许该角色仅读取环境密钥相关的 secret。如果你使用客户管理的 KMS 密钥，还需要添加解密权限。参阅 AWS [安全与权限](https://docs.aws.amazon.com/lambda/latest/dg/microvms-security.html) 用于角色配置。

将应用密钥和 Webhook 签名密钥保存在 MicroVM 之外。Webhook 启动器需要在其自己的 Secrets Manager 密钥中持有这些凭据；VM 仅接收其环境密钥密钥的 ARN。

## Prepare a reusable image

使用 [Codex CLI](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#prepare-your-environment)、工具依赖项、一个工作目录（如 `/workspace`）以及一个用于 AWS 生命周期钩子的 HTTP 服务器来构建镜像。

示例在 `/aws/lambda-microvms/runtime/v1`:

| Hook         | 行为                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| `/ready`     | 当服务器准备好供 AWS 创建快照时，返回 HTTP 200。保持执行器处于未连接状态。        |
| `/validate`  | 检查 Codex 是否运行，以及工作区是否可写。                                                  |
| `/run`       | 读取会话连接值和密钥 ARN，获取环境密钥，然后启动执行器。 |
| `/suspend`   | 在 AWS 创建 VM 快照之前停止执行器。                                                        |
| `/resume`    | 重新加载环境密钥，并使用已保存的连接值重启执行器。                |
| `/terminate` | 在 VM 终止之前停止执行器。                                                           |

将 `Dockerfile` 和 hook 服务打包为 S3 制品，然后构建一个版本化镜像，例如 `codex-executor`。在镜像配置中启用全部六个 hook，并将 hook 端口设置为与你的服务匹配。会话 ID、凭据以及正在运行的 executor 连接不要放入镜像快照中。参见 AWS [MicroVM images](https://docs.aws.amazon.com/lambda/latest/dg/microvms-images.html) 了解构建和 hook 配置。

启动时，你的应用或启动器会将这些值以 JSON 形式序列化到 `runHookPayload`:

| Value                            | Purpose                                                            |
| -------------------------------- | ------------------------------------------------------------------ |
| `session.environment.id`         | 标识执行器连接到的环境。               |
| `session.environment.remote_url` | 提供执行器的 OpenAI 连接 URL。                     |
| 环境密钥密钥 ARN       | 允许 hook 使用 MicroVM 的执行角色来检索密钥。 |

该 `/run` hook 解析来自 AWS 请求体中的该字符串，检索密钥，并在 `CODEX_API_KEY` 子进程环境中设置它，然后 [启动执行器](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#start-the-executor)。进程启动后从 hook 返回。等待智能体完成其回合可能导致 hook 超时。

允许执行器所需的 [出站连接](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#network-access) 以及对 Secrets Manager 的访问。为私有资源或网络限制配置 AWS egress 连接器。对于文件下载，添加一条到你的服务器的路由，并通过 MicroVM 的 HTTP 端点调用它，使用作用域限定到服务器端口的 AWS 身份验证令牌。

## 启动 MicroVM

选择应用管理或 Webhook 管理的预配方案。在两种情况下，都需在连接、输入和补全阶段保持会话事件流处于打开状态。

### 由应用管理的预置

1. [创建一个自托管会话](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted#create-or-reuse-a-session) 其工作目录与镜像匹配，然后 [打开其事件流](https://developers.openai.com/api/docs/guides/agents-api/sessions/events#consume-a-stream).
2. 调用 AWS [RunMicrovm](https://docs.aws.amazon.com/lambda/latest/microvm-api/API_RunMicrovm.html) 并传入镜像 ARN 与版本、执行角色、网络连接器，以及 `runHookPayload`。保存返回的 `microvmId` 与会话 ID 一同保存。
3. 等待 `agent.session.environment.connected`，然后 [发送输入](https://developers.openai.com/api/docs/guides/agents-api/sessions#send-input) 并跟踪该轮的结果。
4. 检索输出文件并 [停止 MicroVM](#stop-the-microvm).

### Webhook 管理的预配

使用 API Gateway HTTP API 和一个启动器 Lambda。你的应用创建会话、打开其流，并提交输入；当会话需要连接时，webhook 会启动或恢复计算。

1. 部署一个 `POST /webhook` 路由来调用启动器。授予 `lambda:RunMicrovm`, `lambda:GetMicrovm`, `lambda:ResumeMicrovm`，以及 `lambda:TerminateMicrovm` 所选镜像的相应权限。启动器还需要读取其凭据、传递 MicroVM 执行角色，并使用配置好的网络连接器。
2. [注册端点](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks#set-up-a-webhook) 用于 `agent.session.action_required` 和 `agent.session.failed`。将端点的签名密钥与启动器的应用密钥一同存储。
3. 在访问会话或启动算力之前，请根据原始请求体校验 Webhook 签名。检索当前会话并确认处理器拥有该会话，例如通过匹配专用的已保存智能体。
4. 如果 `environment_connection` 仍处于挂起状态，可使用 `GetMicrovm`。检查记录的 VM。使用 `SUSPENDED` 恢复 VM，或 `ResumeMicrovm`，等待新的 `PENDING` 或 `RUNNING` VM 连接。仅在未记录任何 VM 时调用 `RunMicrovm` 。将其 ID 保存在会话元数据中；若保存失败，请终止你刚刚启动的 VM。
5. 如果会话仍处于 `failed`，请终止其记录的 MicroVM。忽略已删除的会话、已解决的操作以及由其他处理器拥有的事件。

如果执行器在 [连接超时](https://developers.openai.com/api/docs/guides/agents-api/sessions/webhooks#environment-connection-events)，之前连接，等待中的输入将继续执行，无需重新提交。

原型可以同步启动并将 MicroVM ID 存储在会话元数据中。在投入生产使用之前，需要添加持久化的启动所有权和幂等性，并且 [队列化资源配置工作](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle#handle-lifecycle-webhooks)。仅靠元数据无法防止重复启动，而且启动缓慢可能会超过 webhook 响应超时时间。

## 停止 MicroVM

在会话流上，等待 `agent.session.turn.completed`, `agent.session.turn.failed`，或 `agent.session.turn.cancelled` 针对主 智能体 (`event.turn.subagent_id` 是 `null`)。子智能体共享同一个 MicroVM；它们的终止事件不得触发清理。最后一轮结束后，获取所需文件，调用 `TerminateMicrovm`，并验证 VM 进入 `TERMINATED`。在应用出错时也要运行清理。

轮次结果是流事件，而非 webhook 订阅。 `agent.session.failed` webhook 用于处理会话失败，但不会覆盖每一轮失败。不要仅依据 `agent.session.idle` 终止：它可能在等待输入开始之前就已到达。

将这些 AWS 限制配置为错过清理时的兜底机制：

| 设置                                          | 说明                                                                                                                |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `maximumDurationInSeconds`                       | 为工作负载设定上限，例如 `900` 持续 15 分钟的测试。它可以中断正在进行的任务。                       |
| `maxIdleDurationSeconds`                         | 覆盖预期的工作负载。AWS 测量入站流量；执行器的出站连接不会重置此计时器。 |
| `suspendedDurationSeconds` / `autoResumeEnabled` | 这些示例默认使用 `0` / `false` ，并使用 `300` / `false` 配合 `--suspend-resume`.                                  |

参见 AWS [运行和使用 MicroVM](https://docs.aws.amazon.com/lambda/latest/dg/microvms-launching.html) 以了解生命周期和空闲控制。

[删除会话](https://developers.openai.com/api/docs/guides/agents-api/sessions/manage#delete-a-session) 需要单独进行。会话删除不会终止 AWS 计算资源，也不会发出删除 webhook。请保留镜像和环境密钥以便复用。对于后续回合，请通过 [沙箱生命周期](https://developers.openai.com/api/docs/guides/agents-api/environments/lifecycle).

## 在轮次之间暂停与恢复

使用 AWS [挂起和恢复](https://docs.aws.amazon.com/lambda/latest/dg/microvms-launching.html#microvms-launching-suspend-resume) 来在两次会话之间保留内存和磁盘。请设置一个非零的 `suspendedDurationSeconds`；挂起期间会产生快照存储费用。 `maximumDurationInSeconds` 将总运行和挂起时间限制为八小时。

使用以下任一示例运行 `--suspend-resume` 来写入 `/workspace/hello.txt`, 然后挂起 VM，并在第二次会话中读取该文件。由应用管理的示例会直接恢复；由 Webhook 管理的示例会发送另一个输入，从而触发启动器恢复记录的 VM。两者都会验证文件内容，并在最后一次会话后进行清理。

该 `/suspend` 钩子停止执行器； `/resume` 重新加载其密钥并重新连接。仅在工具和子智能体完成后挂起。AWS 自动恢复需要入站 VM 流量；仅凭 智能体 API 输入无法唤醒它。

## 验证与监控

使用一个会在小文件中创建临时文件的提示进行测试 `/workspace`。确认执行器已连接、本轮已完成、下载的文件包含预期结果，并且 MicroVM 在清理后达到 `TERMINATED` 状态。仅启动成功并不能验证集成是否正确。

在 AWS 示例目录下，使用 `jq` 从已保存的构建状态中读取镜像 ARN 和区域。如果你使用了自定义 `--state`，请相应调整路径；如果重命名了启动器，请替换日志组：

```bash
image_state=application_managed/.local/image.json
region=$(jq -r '.region' "$image_state")
image_arn=$(jq -r '.image_arn' "$image_state")

aws logs tail /aws/lambda/codex-agents-api-webhook --since 10m --region "$region"

aws lambda-microvms list-microvms \
  --image-identifier "$image_arn" --region "$region" \
  --query 'items[].{id:microvmId,state:state}' --output table
```

将会话 ID 与 MicroVM ID 一起记录，以便追踪单次运行。切勿将凭据和原始 webhook 请求体写入日志。

## 故障排查

| 症状                       | 检查内容                                                                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Webhook 签名被拒绝 | 使用该端点的签名密钥，并验证未修改的请求体。                                                          |
| MicroVM 未启动           | 检查 Webhook 订阅、会话所有权过滤器、待处理 `environment_connection` 操作，以及启动器的 IAM 权限。 |
| 镜像构建失败             | 检查 S3 制品、镜像构建角色以及 `/ready` hook 响应。                                                               |
| `/run` 失败或超时     | 检查密钥访问和执行器启动。在进程启动后返回，而不是在该轮结束后返回。                                   |
| 执行器无法连接        | 检查环境 ID、远程 URL、密钥所有权以及出站网络访问。                                                  |
| VM 在一轮中停止        | 检查最大生命周期和空闲策略；出站执行器流量不计入入站活动。                               |

若发生连接失败，请检查 `agent.session.environment.failed` 以及执行器的日志。请参阅 [Self-hosted sandboxes](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted) 了解共享执行器的约定。

## 参考资料

- 生命周期： [运行和使用 MicroVM](https://docs.aws.amazon.com/lambda/latest/dg/microvms-launching.html) 涵盖启动、暂停、恢复和终止。
- 安全： [安全与权限](https://docs.aws.amazon.com/lambda/latest/dg/microvms-security.html) 涵盖 IAM 角色、身份验证令牌和访问控制。